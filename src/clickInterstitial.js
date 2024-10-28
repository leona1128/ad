// @id clickInterstitial

var asset = loader.asset;
var adcode = loader.adcode;
var util = loader.util;
const containerId = 'interstitial2';


// interact & container installed -> install space
// space displayed -> show
var container, closeBtn;
var scrolled$ = util.onScroll$();
var args = loader.args || {};

var containerInstalled$ = asset.get$(`demo/${containerId}.html`)
  .then(function(template) {

    // TODO: enhance util or asset API
    var html = template.replace('{{asset.basePath}}', asset.basePath);
    document.body.insertAdjacentHTML('afterbegin', html); // append to body before first child

    // save element as variable
    container = document.querySelector(`#${containerId}`);

    closeBtn = container.querySelector('.close-btn');
    // wire up close event
    closeBtn.addEventListener('click', closeContainer);

    // change AD background color
    args.headerBackgroundColor ? container.style.setProperty("--headerBackgroundColor", args.headerBackgroundColor) : false;
    args.headerFontColor ? container.style.setProperty("--headerFontColor", args.headerFontColor) : false;
    args.bodyBackgroundColor ? container.style.setProperty("--bodyBackgroundColor", args.bodyBackgroundColor) : false;
    args.zIndex ? container.style.setProperty("--zIndex", args.zIndex) : false;
  });

function installSpace() {
  args.forDevice = args.forDevice || 'PHONE' //  PHONE (default) / TABLET / PERSONAL_COMPUTER

  // create ins element
  let frequency = args.frequency || 60;
  let enableAdFreqRestriction = args.enableAdFreqRestriction != undefined ? args.enableAdFreqRestriction : true;
  var overFrequency = checkLastADTime(getCookieByName("lastTime2")) > frequency;
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
      if (!ad || !ad.channel.useContainer) {
        return;
      }
      clickLink();
      try {
        document.cookie = "lastTime2=" + Date.now() + ";max-age=" + (frequency * 60) + ";path=/;";
      } catch (e) {}

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
  try {
    var value = parseCookie()[name];
      if (value) {
        value = decodeURIComponent(value);
      }
      return value;
  } catch(e) {
    return undefined;
  }
}

function clickLink() {
  document.querySelectorAll("* > a, a").forEach(el => {
    el.addEventListener('click', function(event) {
      var targetLink = el.href;
      event.preventDefault();
      container.querySelector(".close-btn").onclick = function() {
        location.href = targetLink;
      };
      showContainer();
    });
  });
}

let autoClose = args.autoClose || false;
let autoCloseTime = args.autoCloseTime || 5;
let enableCloseBtnAfterSeconds = args.enableCloseBtnAfterSeconds || false;
let afterSecondsShowCloseBtn = args.afterSecondsShowCloseBtn || 5;
var autoCloseTimeoutId;

function showContainer() {
  container.classList.remove('conceal');
  container.classList.add('show');
  if (autoClose) {
    autoCloseTimeoutId = setTimeout(closeContainer , (autoCloseTime * 1000));
  }

  if (enableCloseBtnAfterSeconds){
    setTimeout(showCloseBtn, (afterSecondsShowCloseBtn * 1000));
  } else {
    closeBtn.classList.remove('hide');
  }
}

function showCloseBtn(){
  closeBtn.classList.remove('hide');
}

function closeContainer() {
  if(autoCloseTimeoutId != undefined){
    clearTimeout(autoCloseTimeoutId);
  }
  container.classList.remove('show');
  container.classList.add('conceal');
}

// main flow
Promise.all([containerInstalled$])
  .then(installSpace);