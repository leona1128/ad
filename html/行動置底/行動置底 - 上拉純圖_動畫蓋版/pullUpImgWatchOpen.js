var TenMaxScript = document.querySelector('#pullUpImgWatchOpenJs');
var TenMaxLink = 'https://bit.ly/3IezazM';
var clickUrl = TenMaxScript.dataset.clickUrl;
var viewableUrl = TenMaxScript.dataset.viewableUrl;
var SSPviewableUrl = TenMaxScript.dataset.sspviewableUrl;
var ADXviewableUrl = TenMaxScript.dataset.adxviewableUrl;
var TenMaxCreativeId = TenMaxScript.dataset.creativeId;
var TenMaxCampaignId = TenMaxScript.dataset.campaignId;

let TenMaxTemplate = document.querySelector('#pullUpImgWatchOpen');
let firstInterstitial = TenMaxTemplate.querySelector('.firstInterstitial');
let TenMaxCloseBtn = TenMaxTemplate.querySelector('.TenMaxCloseBtn');
let pullUpBtn = TenMaxTemplate.querySelector('.pullUpArrow');
let TenMaxBannerBundle = TenMaxTemplate.querySelector('.TenMaxBannerBundle');
let TenMaxBanner = TenMaxBannerBundle.querySelector('.TenMaxBanner');
let TenMaxInterstitial = TenMaxBannerBundle.querySelector('.TenMaxInterstitial');

TenMaxTemplate.addEventListener('touchstart', handleTouchStart);
TenMaxTemplate.addEventListener('touchmove', handleTouchMove);
TenMaxTemplate.addEventListener('animationend', function(event) {
  if (isPullUp) {
    return;
  }
  let interval = 200;
  if (event.timeStamp - lastScroll < interval) {
    playBouncingAnimation();
  } else {
    isPlaying = false;
    TenMaxTemplate.setAttribute('style', 'animation: none;');
  }
});
pullUpBtn.addEventListener('click', function(e) {
  e.preventDefault();
  pullUpContainer();
});
TenMaxCloseBtn.addEventListener('click', function(e) {
  e.preventDefault();
  if (!TenMaxTemplate.classList.contains('up')) {
    closeContainer();
    TenMaxVideo.muted = true;
  } else {
    pushDownContainer();
    TenMaxVideo.muted = true;
  }
});
// 模擬 Touch 事件
function simulateTouch(targetEl, event, type) {
  try {
    const touchObj = new Touch({
      identifier: Date.now(),
      target: targetEl,
      clientX: event.clientX,
      clientY: event.clientY,
      pageX: event.pageX,
      pageY: event.pageY,
      screenX: event.screenX,
      screenY: event.screenY,
      radiusX: 2.5,
      radiusY: 2.5,
      rotationAngle: 0,
      force: 0.5
    });

    const touchEvent = new TouchEvent(type, {
      cancelable: true,
      bubbles: true,
      touches: [touchObj],
      targetTouches: [touchObj],
      changedTouches: [touchObj]
    });

    targetEl.dispatchEvent(touchEvent);
  } catch (error) {
    console.error('Error simulating touch event:', error);
  }
}
let x = 0, y = 0;

TenMaxTemplate.addEventListener('mousedown', (e) => {
  e.preventDefault();
  x = e.clientX;
  y = e.clientY;
  simulateTouch(TenMaxTemplate, e, 'touchstart');
});

TenMaxTemplate.addEventListener('mousemove', (e) => {
  if (e.buttons === 1) { // 只有在滑鼠按下時觸發
    pullUpContainer();
    e.preventDefault();
    simulateTouch(TenMaxTemplate, e, 'touchmove');
  }
});

TenMaxTemplate.addEventListener('mouseup', (e) => {
  e.preventDefault();
  simulateTouch(TenMaxTemplate, e, 'touchend');
});

TenMaxTemplate.addEventListener('click', e => {
  if (Math.abs(e.clientX - x) > 20 || Math.abs(e.clientY - y) > 20) {
    e.preventDefault();
  }
});

// 防止滑鼠事件影響其他 elements
TenMaxTemplate.addEventListener('dragstart', (e) => e.preventDefault());

let start = null;
function handleTouchStart(e) {
  if (TenMaxInterstitial.style.display == 'block') {
    start = null;
  } else {
    start = e.touches[0].clientY;
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
  safariHacks();
  TenMaxInterstitial.offsetHeight;
  TenMaxTemplate.classList.add('up');
}

function pushDownContainer() {
  isPullUp = false;
  TenMaxTemplate.classList.remove('up');
}

function playBouncingAnimation() {
  TenMaxTemplate.setAttribute('style', '');
  TenMaxTemplate.offsetHeight;
  TenMaxTemplate.setAttribute('style', 'animation: down 1s ease-in-out 1');
}

let lastScroll = 0;
let isPlaying = false;
function showContainer() {
  TenMaxTemplate.classList.add('show');
  setTracker(TenMaxTemplate);
}

function setTracker(TenMaxTemplate) {
  let href = window.location.href;
  let blob = 'tenmaxsgstatic.blob.core.windows.net/ssp/H5_Creative_Advertising';
  let cdn = 'tenmax-static.cacafly.net/ssp/H5_Creative_Advertising';
  if (href.indexOf(blob) != -1 || href.indexOf(cdn) != -1) {
    TenMaxBannerBundle.setAttribute("href", TenMaxLink);
  } else {
    TenMaxBannerBundle.setAttribute("href", clickUrl + encodeURIComponent(TenMaxLink));
  }
  let viewable = document.createElement("img");
  viewable.src = viewableUrl;
  viewable.style.display = "none";
  let sspViewable = document.createElement("img");
  sspViewable.src = SSPviewableUrl;
  sspViewable.style.display = "none";
  let adxViewable = document.createElement("img");
  adxViewable.src = ADXviewableUrl;
  adxViewable.style.display = "none";
  TenMaxTemplate.appendChild(viewable);
  TenMaxTemplate.appendChild(sspViewable);
  TenMaxTemplate.appendChild(adxViewable);
}

function safariHacks() {
  let windowsVH = window.innerHeight / 100;
  TenMaxTemplate.style.setProperty('--vh', windowsVH + 'px');
  window.addEventListener('resize', function() {
    TenMaxTemplate.style.setProperty("--vh", windowsVH + "px");
  });
}

window.addEventListener('scroll', function(event) {
  if (isPullUp) {
    return;
  }
  lastScroll = event.timeStamp;
  if (!isPlaying) {
    playBouncingAnimation();
    isPlaying = true;
  }
});

function closeContainer() {
  isPullUp = true;
  TenMaxBanner.style = '';
  TenMaxBanner.offsetHeight;
  TenMaxTemplate.classList.remove('play', 'show');
}

let isLoaded = performance.getEntriesByType('navigation').every((e) => e.loadEventEnd);
let TenMaxInit = function () {
  // safariHacks();
  TenMaxTemplate.classList.add('play');
  setTimeout(function() {
    showContainer();
    firstInterstitial.setAttribute("style", "display:none !important");
  }, 3200);
};

if (isLoaded) {
  TenMaxInit();
} else {
  window.onload = TenMaxInit;
};