// @id interstitial

var asset = loader.asset;
var adcode = loader.adcode;
var util = loader.util;
const containerId = 'interstitial';


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
  var overFrequency = checkLastADTime(getCookieByName("lastTime")) > frequency;
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
    //呼叫code可以自訂編輯的地方-也可以關掉對方的按鈕或container.
    space.on('display', function(ad) {
      // ad === undefined means no ad
      if (!ad || !ad.channel.useContainer) {
        return;
      }
      defaultOpenContainerSetting();

      try {
        document.cookie = "lastTime=" + Date.now() + ";max-age=" + (frequency * 60) + ";path=/;";
//        document.cookie = "thisHourFirstTime=true;max-age=60;path=/;";
//        document.cookie = "interstitialADFill=true;max-age=" + (frequency * 60) + ";path=/;";
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



//設定初始化是一滑動就顯示,下滑多少比例, 滑動多少pixel才顯示
function defaultOpenContainerSetting(){
    let showWay = args.showWay || 'directly';
    let scrollPercentToShowUp = args.scrollPercentToShowUp || 50;
    let scrollPixelToShowUp = args.scrollPixelToShowUp || 100;

    if( showWay == 'directly'){
        //直接顯示ad
        window.addEventListener('scroll', scrollToShowUp);
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

function scrollToShowUp(event){
    showContainer();
    window.removeEventListener('scroll', scrollToShowUp);
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