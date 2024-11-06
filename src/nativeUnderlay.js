// @id nativeUnderlay

var asset = loader.asset;
var adcode = loader.adcode;
var util = loader.util;
const containerId = 'TenMax_underlay';

// interact & container installed -> install space
// space displayed -> show
var container, closeBtn;
var scrolled$ = util.onScroll$();
var args = loader.args || {};
var toggleOrShutDown;

var containerInstalled$ = asset.get$(`demo/${containerId}.html`)
  .then(function(template) {

    // TODO: enhance util or asset API
    var html = template.replace('{{asset.basePath}}', asset.basePath);
    var space = document.querySelector(`script[data-uuid="${adcode._loader.uuid}"]`);
    space.insertAdjacentHTML('afterend', html); // append after loader code

    // save element as variable
    container = document.querySelector(`script[data-uuid="${adcode._loader.uuid}"] ~ #${containerId}`);
  });

function installSpace() {
  args.forDevice = args.forDevice || 'PHONE' //  PHONE (default) / TABLET / PERSONAL_COMPUTER

  let frequency = args.frequency || 60;
  let enableAdFreqRestriction = args.enableAdFreqRestriction != undefined ? args.enableAdFreqRestriction : false;
  var overFrequency = checkLastADTime(getCookieByName("lastTime7")) > frequency;
  // create ins element
  if (loader.util.isDeviceMatched(args.forDevice) && (!enableAdFreqRestriction || overFrequency)) {
    var ins = adcode.createIns();
    // append ins to DOM
    container.querySelector('.ad').appendChild(ins);
  } else if (loader.fallbackMode == 'PASSBACK') {
    var ins = adcode.createSoftBanIns()
    container.querySelector('.ad').appendChild(ins);
  }
  // hook space display
  adcode.onSpaceCreate(ins, function(space) {
    space.on('display', function(ad) {
      // ad === undefined means no ad
      if (!ad) {
        return;
      } else if (!ad.channel.useContainer) {
        let contentEle = container.querySelector('.content');
        let adEle = container.querySelector('.ad');
        adEle.style.height = 'unset';
        adEle.style.position = 'unset';
        contentEle.style.height = 'unset';
      }
      initVh();
      setupContainer(space, ad);
      container.classList.remove('conceal');

      try {
        document.cookie = "lastTime7=" + Date.now() + ";max-age=" + (frequency * 60) + ";path=/;";
      } catch(e) {
          console.error(e)
      }
    });
  });

  // install acdode
  adcode.install({
    // cdn: false,
    // env: 'stage',
    // dev: true
  });
}

function checkLastADTime(recordTime) {
  var nowTime = Date.now();
  if (recordTime == undefined) {
    recordTime = 0;
  }
  return (nowTime - recordTime)/1000/60;
}

function parseCookie() {
  var cookieObj = {};
  var cookieAry = document.cookie.split(';');
  for (let c of cookieAry) {
    c = c.trim();
    c = c.split('=');
    cookieObj[c[0]] = c[1];
  }
  return cookieObj;
}

function getCookieByName(name) {
  var value = parseCookie()[name];
  if (value) {
    value = decodeURIComponent(value);
  }
  return value;
}

// container state control
var topCssValue;
var topCssValueForShutDown;
function setupContainer(space, ad) {
  // TODO: mark mod type, ad type, subtype on container attribute
  let windowSize = args.windowSize || 50;
  container.style.setProperty("--windowSize", windowSize);
}

var open = false;

function initVh() {
  let windowsVH = window.innerHeight / 100;
  container.style.setProperty("--vh", windowsVH + "px");
}

// main flow
Promise.all([containerInstalled$])
  .then(installSpace);