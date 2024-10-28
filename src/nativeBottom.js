// @id nativeBottom

var asset = loader.asset;
var adcode = loader.adcode;
var util = loader.util;
const containerId = 'TenMax_fix_bottom';

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
    document.body.insertAdjacentHTML('afterbegin', html); // append to body before first child

    // save element as variable
    container = document.querySelector(`#${containerId}`);

    // wire up close event
    closeBtn = container.querySelector('#close-btn');
    closeBtn.addEventListener('click', function() {
      autoCloseTimeoutId && clearTimeout(autoCloseTimeoutId);
      toggleContainer();
    });

     var closeSpan = document.querySelector('#close');
     var shutDownSpan = document.querySelector('#shutDown');
     toggleOrShutDown = args.toggleOrShutDown || 'shutDown';
     if(toggleOrShutDown=='shutDown'){
        closeSpan.style.display='none';
        shutDownSpan.style.display='inline';
     } else {
        closeSpan.style.display='inline';
        shutDownSpan.style.display='none';
     }

    // change AD background color
    args.backgroundColor ? container.style.setProperty("--backgroundColor", args.backgroundColor) : false;
    args.borderColor ? container.style.setProperty("--borderColor", args.borderColor) : false;
    args.closeBtnColor ? container.style.setProperty("--closeBtnColor", args.closeBtnColor) : false;
    args.closeBtnBackgroundColor ? container.style.setProperty("--closeBtnBackgroundColor", args.closeBtnBackgroundColor) : false;
    args.closeBtnBorderColor ? container.style.setProperty("--closeBtnBorderColor", args.closeBtnBorderColor) : false;
    args.zIndex ? container.style.setProperty("--zIndex", args.zIndex) : false;
  });

var autoCloseTimeoutId;
var deferSecondsToShowUpTimeoutId;

function installSpace() {
  args.forDevice = args.forDevice || 'PHONE' //  PHONE (default) / TABLET / PERSONAL_COMPUTER

  let frequency = args.frequency || 60;
  let enableAdFreqRestriction = args.enableAdFreqRestriction != undefined ? args.enableAdFreqRestriction : false;
  var overFrequency = checkLastADTime(getCookieByName("lastTime3")) > frequency;
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
      let autoCloseTime = args.autoCloseTime || 5;
      let autoClose = args.autoClose || false;
      if (!ad || !ad.channel.useContainer) {
        return;
      }
      setupContainer(space, ad);
      defaultOpenContainerSetting();

      try {
        document.cookie = "lastTime3=" + Date.now() + ";max-age=" + (frequency * 60) + ";path=/;";
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

//設定初始化是直接顯示,延遲顯示,下滑多少比例, 滑動多少pixel才顯示
function defaultOpenContainerSetting(){
    let showWay = args.showWay || 'directly';
    let deferSecondsToShowUp =  args.deferSecondsToShowUp || 3;
    let scrollPercentToShowUp = args.scrollPercentToShowUp || 50;
    let scrollPixelToShowUp = args.scrollPixelToShowUp || 100;

    if( showWay == 'directly'){
        //直接顯示ad
        openContainer('default');
    } else if ( showWay == 'defer' && deferSecondsToShowUp >= 0){
        //幾秒後自動出現
        deferSecondsToShowUpTimeoutId = setTimeout(openContainer.bind(this, 'default'), (deferSecondsToShowUp * 1000));
    } else if ( showWay == 'scrollPercent' && scrollPercentToShowUp >= 0) {
        // 滑到多少比例再出現
        window.scrollPercentToShowUp = scrollPercentToShowUp;
        window.addEventListener('scroll', calculateScrollPercent);
    } else if ( showWay == 'scrollPixel' && scrollPixelToShowUp >= 0){
        // 滑動多少pixel再出現
        window.scrollPixelToShowUp = scrollPixelToShowUp;
        window.addEventListener('scroll', calculateScrollPixel);
    } else {
        openContainer('default');
    }
}

function calculateScrollPercent(event){
    var scrollPercent = (document.scrollingElement.scrollTop / ( document.body.scrollHeight - document.body.clientHeight ) ) * 100;

    if(scrollPercent >= event.currentTarget.scrollPercentToShowUp){
        openContainer('default');
        window.removeEventListener('scroll', calculateScrollPercent);
    }
 }

function calculateScrollPixel(event){
    if(document.scrollingElement.scrollTop >= event.currentTarget.scrollPixelToShowUp){
        openContainer('default');
        window.removeEventListener('scroll', calculateScrollPixel);
    }
 }

// container state control
var bottomCssValue;
var bottomCssValueForShutDown;
function setupContainer(space, ad) {
  container.style.top = '';
  container.style.bottom = bottomCssValue = '-' + container.offsetHeight + 'px';
  container.offsetHeight; // kickoff
  if (ad.channel.subType == 'combo' && ad._element.clientHeight != 100) {
    container.querySelector('.content > .ad ins').style.width = 'calc(100% - 10px)';
  }
}

var open = false;

function toggleContainer() {
   if(toggleOrShutDown=='shutDown'){
        shutDownContainer();
        return;
   };
  (open ? closeContainer : openContainer)();
}

let autoCloseTime = args.autoCloseTime || 5;
let autoClose = args.autoClose || false;

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


function openContainer(defaultSetting) {
  if (open) {
    return;
  }
  open = true;
  container.classList.remove('conceal');
  container.classList.add('open');
  container.style.bottom = ''; // set to 0 !important by stylesheet
  bottomCssValueForShutDown = - (container.offsetHeight + document.querySelector('#close-btn').offsetHeight) + 'px';
  bottomCssValue = '-' + container.offsetHeight + 'px';
  if (autoClose && defaultSetting == 'default') {
    autoCloseTimeoutId = setTimeout(toggleOrShutDown =='shutDown' ? shutDownContainer: closeContainer , (autoCloseTime * 1000));
  }
}

function closeContainer() {
  if (!open) {
    return;
  }
  open = false;
   bottomCssValue = '-' + container.offsetHeight + 'px';
   container.classList.remove('open');
   container.style.bottom = bottomCssValue;

}

function shutDownContainer() {
    bottomCssValueForShutDown = - (container.offsetHeight + document.querySelector('#close-btn').offsetHeight) + 'px';
    container.classList.remove('open');
    container.style.bottom = bottomCssValueForShutDown;

     //取消setTimeout和scroll Event綁定
     if(deferSecondsToShowUpTimeoutId != undefined){
        clearTimeout(deferSecondsToShowUpTimeoutId);
     }
     window.removeEventListener('scroll', calculateScrollPercent);
}

// main flow
Promise.all([containerInstalled$])
  .then(installSpace);