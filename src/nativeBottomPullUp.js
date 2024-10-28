// @id nativeBottomPullUp

var asset = loader.asset;
var adcode = loader.adcode;
var util = loader.util;
const containerId = 'TenMax_fix_bottom_pullUp';

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
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove);

    // wire up close event
    closeBtn = container.querySelector('#close-btn');
    closeBtn.addEventListener('click', closeContainer);

    // up event
    upBtn = container.querySelector('#pullUp');
    upBtn.addEventListener('click', pullUpContainer);
    upBtn.addEventListener('touchmove', function() {
      console.log(TouchEvent);
    });

    //dynamic setUp down keyframe;
    args.bouncingAmplitude ? container.style.setProperty("--bouncingAmplitude", args.bouncingAmplitude + '%') : false;
    // change AD background color
    args.backgroundColor ? container.style.setProperty("--backgroundColor", args.backgroundColor) : false;
    args.borderColor ? container.style.setProperty("--borderColor", args.borderColor) : false;
    args.closeBtnColor ? container.style.setProperty("--closeBtnColor", args.closeBtnColor) : false;
    args.closeBtnBackgroundColor ? container.style.setProperty("--closeBtnBackgroundColor", args.closeBtnBackgroundColor) : false;
    args.pullUpBtnBorderColor ? container.style.setProperty("--pullUpBtnBorderColor", args.pullUpBtnBorderColor) : false;
    args.zIndex ? container.style.setProperty("--zIndex", args.zIndex) : false;
    args.headerBackgroundColor ? container.style.setProperty("--headerBackgroundColor", args.headerBackgroundColor) : false;
    args.headerFontColor ? container.style.setProperty("--headerFontColor", args.headerFontColor) : false;

  });

function installSpace() {
  args.forDevice = args.forDevice || 'PHONE' //  PHONE (default) / TABLET / PERSONAL_COMPUTER

  let frequency = args.frequency || 60;
  let enableAdFreqRestriction = args.enableAdFreqRestriction != undefined ? args.enableAdFreqRestriction : false;
  var overFrequency = checkLastADTime(getCookieByName("lastTime4")) > frequency;
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
      if (!ad || !ad.channel.useContainer) {
        return;
      }
      defaultOpenContainerSetting();

      try {
        document.cookie = "lastTime4=" + Date.now() + ";max-age=" + (frequency * 60) + ";path=/;";
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

let start = null;
function handleTouchStart(e) {
  if (container.classList.contains("up")) {
    start = null;
  } else {
    start = e.touches[0].clientY;
    // alert(`handleTouchStart ${start}`);
  }
}

function handleTouchMove(e) {
  if (!start) {
    return;
  }
  let move = e.touches[0].clientY;
  let diff = start - move;
  if (diff > 50) {
    pullUpContainer();
    start = null;
  }
}

let isPullUp = false;
function pullUpContainer() {
  isPullUp = true;
  container.style.setProperty("animation", "none");
  container.offsetHeight;
  container.classList.add('up');
  container.querySelector('.ad').classList.add('up');
  container.querySelector('.adHeader').classList.add('up');
  container.querySelector('#pullUp').classList.add('conceal');
  closeBtn.classList.add('up');
  enable();
  closeBtn.addEventListener('click', disable);
}

let isShow = false;
function playBouncingAnimation() {
  if(!isShow){
    return;
  }
  container.style.setProperty("animation", "none");
  container.offsetHeight;
  container.style.setProperty("animation", "down 1s ease-in-out 1");
}

let lastScroll = 0;
let isPlaying = false;
let bouncingOrNot = args.bouncingOrNot;
function showContainer() {
  container.classList.remove('conceal');
  container.classList.add('show');
  closeBtn.classList.remove('conceal');
  isShow = true;
  container.addEventListener('animationend', function(event) {
    if (isPullUp) {
      return;
    }
    let interval = 200;
    if (event.timeStamp - lastScroll < interval) {
      if(bouncingOrNot == undefined){
          bouncingOrNot = true;
      }
      if(bouncingOrNot){
         playBouncingAnimation();
      }
      container.querySelector("#pullUp").classList.toggle("adNotScroll");
    } else {
      isPlaying = false;
    }
  });
}

function defaultOpenContainerSetting(){
    let showWay = args.showWay || 'directly';
    let deferSecondsToShowUp =  args.deferSecondsToShowUp || 3;
    let scrollPercentToShowUp = args.scrollPercentToShowUp || 50;
    let scrollPixelToShowUp = args.scrollPixelToShowUp || 100;

    if( showWay == 'directly'){
        //直接顯示ad
        showContainer();
    } else if ( showWay == 'defer' && deferSecondsToShowUp >= 0){
        //幾秒後自動出現
        deferSecondsToShowUpTimeoutId = setTimeout(showContainer, (deferSecondsToShowUp * 1000));
    } else if ( showWay == 'scrollPercent' && scrollPercentToShowUp >= 0) {
        // 滑到多少比例再出現
        window.scrollPercentToShowUp = scrollPercentToShowUp;
        window.addEventListener('scroll', calculateScrollPercent);
    } else if ( showWay == 'scrollPixel' && scrollPixelToShowUp >= 0){
        // 滑動多少pixel再出現
        window.scrollPixelToShowUp = scrollPixelToShowUp;
        window.addEventListener('scroll', calculateScrollPixel);
    } else {
        showContainer();
    }
}

function calculateScrollPercent(event){
    var scrollPercent = (document.scrollingElement.scrollTop / ( document.body.scrollHeight - document.body.clientHeight ) ) * 100;

    if(scrollPercent >= event.currentTarget.scrollPercentToShowUp){
        showContainer();
        window.removeEventListener('scroll', calculateScrollPercent);
    }
 }

function calculateScrollPixel(event){
    if(document.scrollingElement.scrollTop >= event.currentTarget.scrollPixelToShowUp){
        showContainer();
        window.removeEventListener('scroll', calculateScrollPixel);
    }
 }


window.addEventListener('scroll', function(event) {
  if (isPullUp) {
    return;
  }
  lastScroll = event.timeStamp;
  if (!isPlaying) {
    if(bouncingOrNot == undefined){
        bouncingOrNot = true;
    }
    if(bouncingOrNot){
       playBouncingAnimation();
    }
    container.querySelector("#pullUp").classList.toggle("adNotScroll");
    isPlaying = true;
  }
});

function closeContainer() {
  isPullUp = true;
  container.style = "";
  container.offsetHeight;
  container.classList.remove('show');
  container.classList.add('conceal');
  container.querySelector('.adHeader').classList.remove('up');
  container.querySelector('.adHeader').classList.add('conceal');
  closeBtn.style.display = 'none';
}

// src/utils/scroll-lock.js
const $body = document.querySelector('body');
let scrollPosition = 0;
function enable() {
  scrollPosition = window.pageYOffset;
  $body.style.overflow = 'hidden';
  $body.style.position = 'fixed';
  $body.style.top = `-${scrollPosition}px`;
  $body.style.width = '100%';
};
function disable() {
  $body.style.removeProperty('overflow');
  $body.style.removeProperty('position');
  $body.style.removeProperty('top');
  $body.style.removeProperty('width');
  window.scrollTo(0, scrollPosition);
};


// main flow
Promise.all([containerInstalled$])
  .then(installSpace);