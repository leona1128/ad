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
let bannerBar = TenMaxTemplate.querySelector('.bar');

let TenMaxInterstitial = TenMaxBannerBundle.querySelector('.TenMaxInterstitial');
let TenMaxBannerCloseBtn = TenMaxBanner.querySelector('.TenMaxCloseBtn');
let TenMaxInterstitialCloseBtn = firstInterstitial.querySelector('.TenMaxCloseBtn');
let pic1Element = document.querySelector('.pic1');

// 追蹤動畫狀態的變數
let animationInProgress = false;
let animationComplete = false;

// Add click handler for pic1
pic1Element.addEventListener('click', function(e) {
  e.preventDefault();
  e.stopPropagation();
  
  // Get the current href from TenMaxBannerBundle
  let href = window.location.href;
  let targetUrl;
  
  let blob = 'tenmaxsgstatic.blob.core.windows.net/ssp/H5_Creative_Advertising';
  let cdn = 'tenmax-static.cacafly.net/ssp/H5_Creative_Advertising';
  
  if (href.indexOf(blob) != -1 || href.indexOf(cdn) != -1) {
    targetUrl = TenMaxLink;
  } else {
    targetUrl = clickUrl + encodeURIComponent(TenMaxLink);
  }
  
  // Redirect to the target URL
  window.open(targetUrl, '_blank');
});

document.addEventListener('DOMContentLoaded', () => {
  const banner = document.querySelector('.TenMaxBanner');
  banner.style.bottom = '0';
});

TenMaxInterstitialCloseBtn.addEventListener('click', function(e) {
  e.preventDefault();
  if (!animationInProgress) {
    closePicContainer();
  }
});

TenMaxBannerCloseBtn.addEventListener('click', function(e) {
  e.preventDefault();
  closeContainer();
  bannerBar.style.display = 'none';
});

let isPullUp = false;
function pullUpContainer() {
  isPullUp = true;
  safariHacks();
  TenMaxInterstitial.offsetHeight;
  TenMaxTemplate.classList.add('up');
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
}

function safariHacks() {
  setTimeout(function() {
    let windowsVH = window.innerHeight / 100;
    console.log("Corrected VH after load:", windowsVH + 'px'); 
    TenMaxTemplate.style.setProperty('--vh', windowsVH + 'px');
  }, 300);  
  
  window.addEventListener('resize', function () {
    let windowsVH = window.innerHeight / 100;
    console.log("VH on resize:", windowsVH + 'px');
    TenMaxTemplate.style.setProperty('--vh', windowsVH + 'px');
  });
  
  TenMaxInterstitial.classList.add('show');
}

let resizeTimeout;
window.addEventListener('resize', function() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(function() {
    let windowsVH = window.innerHeight / 100;
    console.log(" delayed resize:", windowsVH + 'px');
    TenMaxTemplate.style.setProperty('--vh', windowsVH + 'px');
  }, 300); 
});

let shakeAdded = false;
let adElement = document.querySelector('.TenMaxInterstitial');
let handElement = document.querySelector('.hand');

window.addEventListener('load', function() {
  setTimeout(function() {
    if (adElement && !shakeAdded) {
      adElement.classList.add('shake');
      shakeAdded = true;
      bannerBar.style.display = 'block';
      handElement.style.display = 'block';

      TenMaxBannerCloseBtn.style.display = 'block';
      TenMaxBannerCloseBtn.style.position = 'relative';
      // 為 hand 元素添加事件監聽器
      handElement.addEventListener('touchstart', handleBarTouch);
      handElement.addEventListener('mousedown', handleBarTouch);
      
      // 原有的 bar 事件監聽器
      bannerBar.addEventListener('touchstart', handleBarTouch);
      bannerBar.addEventListener('mousedown', handleBarTouch);
    }
  }, 3500);
});

function handleBarTouch(e) {
  e.preventDefault(); // 防止事件冒泡
  
  if (!animationInProgress && shakeAdded && pic1Element) {
    animationInProgress = true;
    animationComplete = false;
    
    firstInterstitial.classList.add('touch');
    bannerBar.style.display = 'none';
    TenMaxBannerCloseBtn.style.display = 'none';
    TenMaxInterstitialCloseBtn.style.display = 'none';
    pic1Element.addEventListener('animationend', function onAnimationEnd() {
      animationComplete = true;
      animationInProgress = false;
      TenMaxInterstitialCloseBtn.style.display = 'block';
   
      pic1Element.removeEventListener('animationend', onAnimationEnd);
    });
  }
  
  if (handElement) {
    handElement.style.display = 'none';
  }
}

function closeContainer() {
  isPullUp = true;
  TenMaxBanner.style.display = 'none';
  TenMaxBanner.offsetHeight;
  TenMaxTemplate.classList.remove('play', 'show');
  TenMaxInterstitial.style.display = 'none';
}

function closePicContainer() {
  if (!animationInProgress) {
    animationInProgress = true;

    TenMaxInterstitialCloseBtn.style.display = 'none';
    firstInterstitial.classList.add('down');
    firstInterstitial.classList.remove('touch');
    
    pic1Element.addEventListener('animationend', function onAnimationEnd() {
      animationComplete = true;
      animationInProgress = false;
      firstInterstitial.classList.remove('down');
      pic1Element.removeEventListener('animationend', onAnimationEnd);
    });
    setTimeout(function() {
      if (animationComplete) {
        bannerBar.style.display = 'block';
        TenMaxBannerCloseBtn.style.display = 'block';
        TenMaxBannerCloseBtn.style.position = 'relative';
      }
    }, 700);
  }
}

let isLoaded = performance.getEntriesByType('navigation').every((e) => e.loadEventEnd);

let Init = function() {
  TenMaxTemplate.classList.add('play');
  safariHacks();
  showContainer(); 
  bannerBar.style.display = 'none';
 
 
  firstInterstitial.classList.add('start');
  setTimeout(function() {
    firstInterstitial.classList.remove('start');
  }, 4000);
};

if (isLoaded) {
  Init();
} else {
  window.onload = Init;
}