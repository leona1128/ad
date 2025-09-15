var TenMaxScript = document.querySelector('#airleeIIJs');
var TenMaxLink = 'https://airlee.com.tw/news/78';
var clickUrl = TenMaxScript.dataset.clickUrl;
var viewableUrl = TenMaxScript.dataset.viewableUrl;
var SSPviewableUrl = TenMaxScript.dataset.sspviewableUrl;
var ADXviewableUrl = TenMaxScript.dataset.adxviewableUrl;
var TenMaxBannerId = TenMaxScript.dataset.bannerId;
var TenMaxCampaignId = TenMaxScript.dataset.campaignId;
let AirleeII = document.querySelector('#AirleeII');
let firstInterstitial = AirleeII.querySelector('.firstInterstitial');
let TenMaxBannerBundle = AirleeII.querySelector('.TenMaxBannerBundle');
let TenMaxBanner = TenMaxBannerBundle.querySelector('.TenMaxBanner');
let TenMaxInterstitial = TenMaxBannerBundle.querySelector('.TenMaxInterstitial');
let pullUpBtn = TenMaxBanner.querySelector('.pullUpArrow');
let TenMaxBannerCloseBtn = TenMaxBanner.querySelector('.TenMaxCloseBtn');
let TenMaxMuteBtn = TenMaxInterstitial.querySelector('.TenMaxMuteBtn');
let TenMaxInterstitialCloseBtn = TenMaxInterstitial.querySelector('.TenMaxCloseBtn');
let TenMaxVideo = TenMaxInterstitial.querySelector('video');

TenMaxBanner.addEventListener('touchstart', handleTouchStart);
TenMaxBanner.addEventListener('touchmove', handleTouchMove);
TenMaxBanner.addEventListener('animationend', function(event) {
  if (isPullUp) {
    return;
  }
  let interval = 200;
  if (event.timeStamp - lastScroll < interval) {
    playBouncingAnimation();
  } else {
    isPlaying = false;
    TenMaxBanner.setAttribute('style', 'animation: none;');
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


TenMaxBanner.addEventListener('mousedown', (e) => {
  e.preventDefault();
  x = e.clientX;
  y = e.clientY;
  simulateTouch(TenMaxBanner, e, 'touchstart');
});

TenMaxBanner.addEventListener('mousemove', (e) => {
  if (e.buttons === 1) { // 只有在滑鼠按下時觸發
    e.preventDefault();
    pullUpContainer();
    simulateTouch(TenMaxBanner, e, 'touchmove');
  }
});

TenMaxBanner.addEventListener('mouseup', (e) => {
  e.preventDefault();
  simulateTouch(TenMaxBanner, e, 'touchend');
});

TenMaxBanner.addEventListener('click', e => {
  if (Math.abs(e.clientX - x) > 20 || Math.abs(e.clientY - y) > 20) {
    e.preventDefault();
  }
});

// 防止滑鼠事件影響其他 elements
TenMaxBanner.addEventListener('dragstart', (e) => e.preventDefault());
pullUpBtn.addEventListener('click', function(e) {
  e.preventDefault();
  pullUpContainer();
});
TenMaxInterstitialCloseBtn.addEventListener('click', function(e) {
  e.preventDefault();
  pushDownContainer();
  TenMaxVideo.muted = true;
  toggleMuteBtn();
});
TenMaxBannerCloseBtn.addEventListener('click', function(e) {
  e.preventDefault();
  closeContainer();
});
TenMaxMuteBtn.addEventListener('click', function (e) {
  e.preventDefault();
  TenMaxVideo.muted ? TenMaxVideo.muted = false : TenMaxVideo.muted = true;
  toggleMuteBtn();
});

function toggleMuteBtn() {
  TenMaxVideo.muted ? TenMaxMuteBtn.classList.add('muted') : TenMaxMuteBtn.classList.remove('muted');
}

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
  toggleMuteBtn();
  TenMaxInterstitial.offsetHeight;
  AirleeII.classList.add('up');
  TenMaxInterstitial.querySelector('video').play();
}

function pushDownContainer() {
  isPullUp = false;
  AirleeII.classList.remove('up');
}

function playBouncingAnimation() {
  TenMaxBanner.setAttribute('style', '');
  TenMaxBanner.offsetHeight;
  TenMaxBanner.setAttribute('style', 'animation: down 1s ease-in-out 1');
}

let lastScroll = 0;
let isPlaying = false;
function showContainer() {
  AirleeII.classList.add('show');
  setTracker(AirleeII);
}

function setTracker(template) {
  TenMaxBannerBundle.setAttribute('href', clickUrl + encodeURIComponent(TenMaxLink + '?af_c_id=' + TenMaxBannerId + '&c=' + TenMaxCampaignId));
  // TenMaxBannerBundle.setAttribute('href', TenMaxLink);
  let viewable = document.createElement("img");
  viewable.src = viewableUrl;
  viewable.style.display = "none";
  let sspViewable = document.createElement("img");
  sspViewable.src = SSPviewableUrl;
  sspViewable.style.display = "none";
  let adxViewable = document.createElement("img");
  adxViewable.src = ADXviewableUrl;
  adxViewable.style.display = "none";
  template.appendChild(viewable);
  template.appendChild(sspViewable);
  template.appendChild(adxViewable);
}

function safariHacks() {
  let windowsVH = window.innerHeight / 100;
  AirleeII.style.setProperty('--vh', windowsVH + 'px');
  window.addEventListener('resize', function() {
      document.querySelector('#AirleeII').style.setProperty('--vh', windowsVH + 'px');
  });
}

window.addEventListener('resize', function () {
  setTimeout(function() {
    let windowsVH = window.innerHeight / 100;
    AirleeII.style.setProperty('--vh', windowsVH + 'px');
  }, 200);
  safariHacks();
});

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
  AirleeII.classList.remove('play', 'show');
}

let isLoaded = performance.getEntriesByType('navigation').every((e) => e.loadEventEnd);
let init = function () {
  AirleeII.classList.add('play');
  toggleMuteBtn();
  safariHacks();
  setTimeout(function() {
    showContainer();
    firstInterstitial.setAttribute("style", "display:none !important");
  }, 3400);
};

if (isLoaded) {
  init();
} else {
  window.onload = init;
};