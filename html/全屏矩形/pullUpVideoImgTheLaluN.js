var TenMaxScript = document.querySelector('#pullUpVideoImgTheLaluIJs');
var TenMaxLink = 'https://tlathena.ec-hotel.net/webhotel-v4/0174/index';
var clickUrl = TenMaxScript.dataset.clickUrl;
var viewableUrl = TenMaxScript.dataset.viewableUrl;
var SSPviewableUrl = TenMaxScript.dataset.sspviewableUrl;
var ADXviewableUrl = TenMaxScript.dataset.adxviewableUrl;
var TenMaxCreativeId = TenMaxScript.dataset.creativeId;
var TenMaxCampaignId = TenMaxScript.dataset.campaignId;

let TenMaxTemplate = document.querySelector('#pullUpVideoImgTheLaluI');
let firstInterstitial = TenMaxTemplate.querySelector('.firstInterstitial');
let TenMaxCloseBtn = TenMaxTemplate.querySelector('.TenMaxCloseBtn');
let pullUpBtn = TenMaxTemplate.querySelector('.pullUpArrow');
let TenMaxMuteBtn = TenMaxTemplate.querySelector('.TenMaxMuteBtn');
let TenMaxBannerBundle = TenMaxTemplate.querySelector('.TenMaxBannerBundle');
let TenMaxBanner = TenMaxBannerBundle.querySelector('.TenMaxBanner');
let TenMaxInterstitial = TenMaxBannerBundle.querySelector('.TenMaxInterstitial');
let TenMaxVideo = TenMaxInterstitial.querySelector('video');

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
    toggleMuteBtn();
  }
});
TenMaxMuteBtn.addEventListener('click', function (e) {
  e.preventDefault();
  TenMaxVideo.muted ? TenMaxVideo.muted = false : TenMaxVideo.muted = true;
  toggleMuteBtn();
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    TenMaxVideo.pause();
  } else {
    TenMaxVideo.play();
  }
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
  TenMaxTemplate.classList.add('up');
  TenMaxInterstitial.querySelector('video').play();
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
    TenMaxBannerBundle.setAttribute("href", TenMaxLink);
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
  toggleMuteBtn();
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