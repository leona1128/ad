// @id nativeSticky

var asset = loader.asset;
var adcode = loader.adcode;
var util = loader.util;
const containerId = 'TenMax_sticky';

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

    // wire up close event
    closeBtn = container.querySelector('#close-btn');
    closeBtn.addEventListener('click', closeContainer);

    // change AD background color
    args.closeBtnColor ? container.style.setProperty("--closeBtnColor", args.closeBtnColor) : false;

    var bottomConceal;
    var topConceal;
    if (args.bottomShow == 'auto'){
        topConceal = window.innerHeight - (args.bottomConceal ? parseInt(args.bottomConceal): -500) + 'px';
        bottomConceal = 'auto';
    } else {
        topConceal = 'auto';
        bottomConceal =  args.bottomConceal;
    }

    args.bottomConceal ? container.style.setProperty("--bottomConceal", bottomConceal) : false;
    container.style.setProperty("--topConceal", topConceal);

    args.bottomShow ? container.style.setProperty("--bottomShow", args.bottomShow) : false;
    args.topShow ? container.style.setProperty("--topShow", args.topShow) : false;
    args.rightPosition ? container.style.setProperty("--rightPosition", args.rightPosition) : false;
    args.leftPosition ? container.style.setProperty("--leftPosition", args.leftPosition) : false;
    args.zIndex ? container.style.setProperty("--zIndex", args.zIndex) : false;
  });

function installSpace() {
  // create ins element

    let frequency = args.frequency || 60;
    let enableAdFreqRestriction = args.enableAdFreqRestriction != undefined ? args.enableAdFreqRestriction : false;
    var overFrequency = checkLastADTime(getCookieByName("lastTime5")) > frequency;

    if (!enableAdFreqRestriction || overFrequency) {
      var ins = adcode.createIns();
      // append ins to DOM
      container.querySelector('.ad').appendChild(ins);
    }

  // hook space display
  adcode.onSpaceCreate(ins, function(space) {
    space.on('display', function(ad) {
      // ad === undefined means no ad
      if (!ad || !ad.channel.useContainer) {
        return;
      }
      showContainer();

      try {
        document.cookie = "lastTime5=" + Date.now() + ";max-age=" + (frequency * 60) + ";path=/;";
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



let autoCloseTime = args.autoCloseTime || 5;
let autoClose = args.autoClose || false;
var autoCloseTimeoutId;
function showContainer() {
  container.classList.remove('conceal');
  container.classList.add('show');
  closeBtn.classList.remove('conceal');
  if (autoClose) {
    autoCloseTimeoutId = setTimeout(closeContainer , (autoCloseTime * 1000));
  }
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