var TenMaxScript = document.querySelector('#pullUpBestProductJs');
var TenMaxLink = 'http://tenmax.io/';
var clickUrl = TenMaxScript.dataset.clickUrl;
var viewableUrl = TenMaxScript.dataset.viewableUrl;
var SSPviewableUrl = TenMaxScript.dataset.sspviewableUrl;
var ADXviewableUrl = TenMaxScript.dataset.adxviewableUrl;
var TenMaxBannerId = TenMaxScript.dataset.bannerId;
var TenMaxCampaignId = TenMaxScript.dataset.campaignId;
let TenMaxTemplate = document.querySelector('#pullUpBestProduct');
// let firstInterstitial = TenMaxTemplate.querySelector('.firstInterstitial');
let TenMaxBannerBundle = TenMaxTemplate.querySelector('.TenMaxBannerBundle');
let TenMaxBanner = TenMaxBannerBundle.querySelector('.TenMaxBanner');
let TenMaxInterstitial = TenMaxBannerBundle.querySelector('.TenMaxInterstitial');
let pullUpBtn = TenMaxBanner.querySelector('.pullUpArrow');
let TenMaxBannerCloseBtn = TenMaxBanner.querySelector('.TenMaxCloseBtn');
let TenMaxInterstitialCloseBtn = TenMaxInterstitial.querySelector('.TenMaxCloseBtn');

let TenMaxProducts = TenMaxInterstitial.querySelector('.TenMaxProuct');
let productImages = TenMaxProducts.querySelectorAll('img');

const productLinks = {
  'Product-1': 'http://tenmax.io/',
  'Product-2': 'http://tenmax.io/',
  'Product-3': 'http://tenmax.io/',
  'Product-4': 'http://tenmax.io/'
};

productImages.forEach(img => {
  const productId = img.id;
  img.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (productLinks[productId]) {
      let href = window.location.href;
      let blob = 'tenmaxsgstatic.blob.core.windows.net/ssp/H5_Creative_Advertising';
      let cdn = 'tenmax-static.cacafly.net/ssp/H5_Creative_Advertising';
      let targetUrl;
      
      if (href.indexOf(blob) != -1 || href.indexOf(cdn) != -1) {
        targetUrl = productLinks[productId];
      } else {
        targetUrl = clickUrl + encodeURIComponent(productLinks[productId]);
      }
      
      window.open(targetUrl, '_blank');
    }
  });
});

pullUpBtn.addEventListener('click', function(e) {
  e.preventDefault();
  
  if (!isPullUp) {
    pullUpContainer();
  } else {
    pushDownContainer();
  }
});

TenMaxInterstitialCloseBtn.addEventListener('click', function(e) {
  e.preventDefault();
  pushDownContainer();
});

TenMaxBannerCloseBtn.addEventListener('click', function(e) {
  e.preventDefault();
  closeContainer();
});

TenMaxBanner.addEventListener('touchstart', function(e) {
  touchStartY = e.touches[0].clientY;

});

TenMaxBanner.addEventListener('touchmove', function(e) {
  e.preventDefault(); 
});
TenMaxBanner.addEventListener('touchend', function(e) {
  touchEndY = e.changedTouches[0].clientY;
  const swipeDistance = touchStartY - touchEndY;
  const minSwipeDistance = 30;
  if (Math.abs(swipeDistance) >= minSwipeDistance) {
    if (swipeDistance > 0) {
      if (!isPullUp) {
        pullUpContainer();
      }
    } else {
      if (isPullUp) {
        pushDownContainer();
      }
    }
  }
});

let touchStartY = 0;
let touchEndY = 0;
function simulateTouch(event, type) {
  try {
 
    if (type === 'touchstart') {
      touchStartY = event.clientY;
    }

    else if (type === 'touchend') {
      touchEndY = event.clientY;
      const swipeDistance = touchStartY - touchEndY;
      const minSwipeDistance = 30;
      if (Math.abs(swipeDistance) >= minSwipeDistance) {
        if (swipeDistance > 0) {
          if (!isPullUp) {
            pullUpContainer();
          }
        } else {
          if (isPullUp) {
            pushDownContainer();
          }
        }
      }
    }
  } catch (error) {
    console.error('Error simulating touch event:', error);
  }
}
let mouseStartY = 0;
let isMouseDown = false;
// 處理滑鼠事件並轉換為觸控事件
TenMaxBanner.addEventListener('mousedown', (e) => {
  e.preventDefault();
  isMouseDown = true;
  mouseStartY = e.clientY;
  simulateTouch(e, 'touchstart');
});

TenMaxBanner.addEventListener('mousemove', (e) => {

    if (e.buttons === 1 && isMouseDown) { 
        e.preventDefault();
        touchEndY = e.clientY;
        const swipeDistance = touchStartY - touchEndY;
        const minSwipeDistance = 30;
        if (Math.abs(swipeDistance) >= minSwipeDistance) {
          if (swipeDistance > 0) {
            if (!isPullUp) {
              pullUpContainer();
              isMouseDown = false; 
            }
          } else {
            if (isPullUp) {
              pushDownContainer();
              isMouseDown = false;
            }
          }
        }
      }
});

TenMaxBanner.addEventListener('mouseup', (e) => {
  e.preventDefault();
  simulateTouch(e, 'touchend');
  isMouseDown = false;
});

// 防止滑鼠事件影響其他 elements
TenMaxBanner.addEventListener('dragstart', (e) => e.preventDefault());

let isPullUp = false;
function pullUpContainer() {
  isPullUp = true;
  safariHacks();

  TenMaxInterstitial.offsetHeight;
  TenMaxTemplate.classList.add('up');
  setTimeout(function() {
  productImages.forEach(img => {
    img.classList.add('animate-product');
  });
  }, 1000);
  TenMaxBannerCloseBtn.style.display = 'none';
  TenMaxInterstitialCloseBtn.style.display = 'block';
  TenMaxBanner.style.animation = 'none';
}

function pushDownContainer() {
  isPullUp = false;
  TenMaxTemplate.classList.remove('up');
  TenMaxBannerCloseBtn.style.display = 'block';
  TenMaxInterstitialCloseBtn.style.display = 'none';

  setTimeout(function() {
    playBouncingAnimation();
    isPlaying = true;
  }, 100);
}

function playBouncingAnimation() {
  TenMaxBanner.offsetHeight;
  TenMaxBanner.style.animation = 'down 2s ease-in-out infinite';
}

let isPlaying = false;
function showContainer() {
  TenMaxTemplate.classList.add('show');
  playBouncingAnimation();
  setTracker(TenMaxTemplate);
}

function setTracker(TenMaxTemplate) {
  let href = window.location.href;
  let blob = 'tenmaxsgstatic.blob.core.windows.net/ssp/H5_Creative_Advertising';
  let cdn = 'tenmax-static.cacafly.net/ssp/H5_Creative_Advertising';
  if (href.indexOf(blob) != -1 || href.indexOf(cdn) != -1) {
    TenMaxBannerBundle.setAttribute('href', TenMaxLink);
    TenMaxInterstitial.setAttribute('href', TenMaxLink);
  }else {
    TenMaxBannerBundle.setAttribute('href', clickUrl + encodeURIComponent(TenMaxLink));
    TenMaxInterstitial.setAttribute('href', clickUrl + encodeURIComponent(TenMaxLink));
  }
  let viewable = document.createElement('img');
  viewable.src = viewableUrl;
  viewable.style.display = 'none';
  let sspViewable = document.createElement('img');
  sspViewable.src = SSPviewableUrl;
  sspViewable.style.display = 'none';
  let adxViewable = document.createElement('img');
  adxViewable.src = ADXviewableUrl;
  adxViewable.style.display = 'none';
  TenMaxTemplate.appendChild(viewable);
  TenMaxTemplate.appendChild(sspViewable);
  TenMaxTemplate.appendChild(adxViewable);
}

function safariHacks() {
  let windowsVH = window.innerHeight / 100;
  TenMaxTemplate.style.setProperty('--vh', windowsVH + 'px');
  window.addEventListener('resize', function() {
      document.querySelector('#pullUpBestProduct').style.setProperty('--vh', windowsVH + 'px');
  });
}

window.addEventListener('resize', function () {
  setTimeout(function() {
    let windowsVH = window.innerHeight / 100;
    TenMaxTemplate.style.setProperty('--vh', windowsVH + 'px');
  }, 200);
  safariHacks();
});

function closeContainer() {
  isPullUp = true;
  TenMaxBanner.style = '';
  TenMaxBanner.offsetHeight;
  TenMaxTemplate.classList.remove('play', 'show');
}

let isLoaded = performance.getEntriesByType('navigation').every((e) => e.loadEventEnd);
let TMInit = function () {
  TenMaxTemplate.classList.remove('up');
  TenMaxTemplate.classList.add('play');
  safariHacks();
  isPullUp = false;
  TenMaxBannerCloseBtn.style.display = 'block';
  TenMaxInterstitialCloseBtn.style.display = 'none';
  showContainer();
};

if (isLoaded) {
  TMInit();
} else {
  window.onload = TMInit;
};