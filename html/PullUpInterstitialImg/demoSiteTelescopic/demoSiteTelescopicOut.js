var TenMaxScript = document.querySelector('#PullUpKnockoutImgJs');
var TenMaxLink = 'http://tenmax.io/';
var clickUrl = TenMaxScript.dataset.clickUrl;
var viewableUrl = TenMaxScript.dataset.viewableUrl;
var SSPviewableUrl = TenMaxScript.dataset.sspviewableUrl;
var ADXviewableUrl = TenMaxScript.dataset.adxviewableUrl;
var TenMaxBannerId = TenMaxScript.dataset.bannerId;
var TenMaxCampaignId = TenMaxScript.dataset.campaignId;

let TenMaxTemplate = document.querySelector('#pullUpImg');
let firstInterstitial = TenMaxTemplate.querySelector('.firstInterstitial');
let TenMaxBannerBundle = TenMaxTemplate.querySelector('.TenMaxBannerBundle');
let TenMaxBanner = TenMaxBannerBundle.querySelector('.TenMaxBanner');
let bannerBar = TenMaxBanner.querySelector('.bar');
let TenMaxInterstitial = TenMaxBannerBundle.querySelector('.TenMaxInterstitial');
let TenMaxBannerCloseBtn = TenMaxBanner.querySelector('.TenMaxCloseBtn');
let TenMaxInterstitialCloseBtn = TenMaxInterstitial.querySelector('.TenMaxCloseBtn');

// 添加動畫結束事件監聽
TenMaxTemplate.addEventListener('animationend', function(event) {
  if (isPullUp) {
    return;
  }
  let interval = 200;
  if (event.timeStamp - lastScroll < interval) {
    playBouncingAnimation();
  } else {
    isPlaying = false;
    TenMaxTemplate.setAttribute('style','animation: none;');
  }
});

// TenMaxBanner.addEventListener('touchstart', handleTouchStart);
// TenMaxBanner.addEventListener('touchmove', handleTouchMove);

TenMaxInterstitialCloseBtn.addEventListener('click', function(e) {
  e.preventDefault();
  closePicContainer();
  setTimeout(function() {
    TenMaxBannerCloseBtn.style.display = 'block';
  }, 1000);
});

TenMaxBannerCloseBtn.addEventListener('click', function(e) {
  e.preventDefault();
  closeContainer();
  bannerBar.style.display = 'none';
});

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

let lastScroll = 0;
let isPlaying = false;

function playBouncingAnimation() {
  TenMaxTemplate.setAttribute('style', '');
  TenMaxTemplate.offsetHeight;
  TenMaxTemplate.setAttribute('style', 'animation:none');
}

function showContainer() {
  TenMaxTemplate.classList.add('show');
  setTracker(TenMaxTemplate);
  TenMaxBanner.style.display = 'block';
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
}

function safariHacks() {
  let windowsVH = window.innerHeight / 100;
  TenMaxTemplate.style.setProperty('--vh', windowsVH + 'px');
  window.addEventListener('resize', function() {
    TenMaxTemplate.style.setProperty("--vh", windowsVH + "px");
  });
}

let resizeTimeout;
window.addEventListener('resize', function() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(function() {
    let windowsVH = window.innerHeight / 100;
    TenMaxTemplate.style.setProperty('--vh', windowsVH + 'px');
  }, 0);
});

// 滾動事件處理
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

let shakeAdded = false;
let adElement = document.querySelector('.TenMaxInterstitial');
let pic2Element = document.querySelector('.pic2');
let handElement = document.querySelector('.hand');

window.addEventListener('load', function() {
  setTimeout(function() {
    if (adElement && !shakeAdded) {
      adElement.classList.add('shake');
      shakeAdded = true;
      bannerBar.style.display = 'block';
    }
  }, 4000);
});

function handleScroll() {
  if (shakeAdded) {
    if (pic2Element) {
      pic2Element.style.display = 'block';
      bannerBar.style.display = 'none';
    }
    if (handElement) {
      handElement.style.display = 'none';
    }
    window.removeEventListener('scroll', handleScroll);
  }
}

window.addEventListener('scroll', handleScroll);

function closeContainer() {
  isPullUp = true;
  TenMaxBanner.style .display = 'none';
  TenMaxBanner.offsetHeight;
  TenMaxTemplate.classList.remove('play', 'show');
  TenMaxInterstitial.style.display = 'none';
  firstInterstitial.style.display = 'none';

}

function closePicContainer() {
  TenMaxInterstitial.classList.add('down');
  console.log('移除shake');
  setTimeout(function() {
    bannerBar.style.display = 'block';
  }, 1255);
}

let isLoaded = performance.getEntriesByType('navigation').every((e) => e.loadEventEnd);

let Init = function() {
  bannerBar.style.display = 'none';
  TenMaxTemplate.classList.add('play');
  safariHacks();
  setTimeout(function() {
    showContainer();
    firstInterstitial.style.display = 'block';
  }, 1500);
};

if (isLoaded) {
  Init();
} else {
  window.onload = Init;
}