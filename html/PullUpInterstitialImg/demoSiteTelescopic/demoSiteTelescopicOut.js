// 選擇載入廣告腳本的標籤
var TenMaxScript = document.querySelector('#PullUpKnockoutImgJs');
// 定義廣告的目標鏈接
var TenMaxLink = 'http://tenmax.io/';
// 從'pullUpImgJs'元素的data屬性中獲取點擊URL
var clickUrl = TenMaxScript.dataset.clickUrl;
// 從'pullUpImgJs'元素的data屬性中獲取可視化URL
var viewableUrl = TenMaxScript.dataset.viewableUrl;
// 從'pullUpImgJs'元素的data屬性中獲取SSP（供應方平台）可視化URL
var SSPviewableUrl = TenMaxScript.dataset.sspviewableUrl;
// 從'pullUpImgJs'元素的data屬性中獲取ADX（廣告交易平台）可視化URL
var ADXviewableUrl = TenMaxScript.dataset.adxviewableUrl;
// 從'pullUpImgJs'元素的data屬性中獲取橫幅廣告ID
var TenMaxBannerId = TenMaxScript.dataset.bannerId;
// 從'pullUpImgJs'元素的data屬性中獲取廣告活動ID
var TenMaxCampaignId = TenMaxScript.dataset.campaignId;
// 選擇ID為'pullUpImg'的元素，這是主廣告容器
let TenMaxTemplate = document.querySelector('#pullUpImg');
//--開始
// 在主廣告容器中選擇class為'firstInterstitial'的元素
let firstInterstitial = TenMaxTemplate.querySelector('.firstInterstitial');
// 在主廣告容器中選擇class為'TenMaxBannerBundle'的元素
let TenMaxBannerBundle = TenMaxTemplate.querySelector('.TenMaxBannerBundle');
// 在TenMaxBannerBundle中選擇class為'TenMaxBanner'的元素
let TenMaxBanner = TenMaxBannerBundle.querySelector('.TenMaxBanner');
// 在TenMaxBannerBundle中選擇class為'TenMaxInterstitial'的元素
let bannerBar = TenMaxBanner.querySelector('.bar');

let TenMaxInterstitial = TenMaxBannerBundle.querySelector('.TenMaxInterstitial');
// 在TenMaxBanner中選擇class為'TenMaxCloseBtn'的元素，這是關閉按鈕
let TenMaxBannerCloseBtn = TenMaxBanner.querySelector('.TenMaxCloseBtn');
// 在TenMaxInterstitial中選擇class為'TenMaxCloseBtn'的元素，這是另一個關閉按鈕
let TenMaxInterstitialCloseBtn = TenMaxInterstitial.querySelector('.TenMaxCloseBtn');

TenMaxBanner.addEventListener('touchstart', handleTouchStart);
TenMaxBanner.addEventListener('touchmove', handleTouchMove);
let scrollTriggered = false;


  // 為插頁式廣告的關閉按鈕添加點擊事件監聽器
TenMaxInterstitialCloseBtn.addEventListener('click', function(e) {
  e.preventDefault(); // 阻止默認事件
  // 調用下推容器函數
  closePicContainer();
  setTimeout(function() {
    TenMaxBannerCloseBtn.style.display = 'block';
}, 1000);
  
  
});
// 為橫幅廣告的關閉按鈕添加點擊事件監聽器
TenMaxBannerCloseBtn.addEventListener('click', function(e) {
  e.preventDefault(); // 阻止默認事件
  closeContainer(); // 調用關閉容器函數
  bannerBar.style.display = 'none';

});
// 觸摸開始邏輯
let start = null;
function handleTouchStart(e) {
  if (TenMaxInterstitial.style.display == 'block') {
    start = null;
  } else {
    start = e.touches[0].clientY;
  }
}
 // 觸摸移動邏輯
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
function showContainer() {
  TenMaxTemplate.classList.add('show');
  setTracker(TenMaxTemplate);
  TenMaxBanner.style.display = 'block';
 
} // 顯示廣告容器

// 設置追蹤器 
//載入tracker
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
// Safari瀏覽器的特殊處理
function safariHacks() {
  let windowsVH = window.innerHeight / 100;
  TenMaxTemplate.style.setProperty('--vh', windowsVH + 'px');
  window.addEventListener('resize', function() {
      document.querySelector('#TenMaxTemplate').style.setProperty('--vh', windowsVH + 'px');
  });
}

window.addEventListener('resize', function () {
  setTimeout(function() {
    let windowsVH = window.innerHeight / 100;
    TenMaxTemplate.style.setProperty('--vh', windowsVH + 'px');
  }, 1000);
  safariHacks();
});
let shakeAdded = false;
let adElement = document.querySelector('.TenMaxInterstitial');
let pic2Element = document.querySelector('.pic2');
let handElement = document.querySelector('.hand')

window.addEventListener('load', function() {
    setTimeout(function() {
      if (adElement && !shakeAdded) {
        adElement.classList.add('shake');
        shakeAdded = true;
        bannerBar.style.display = 'block';  
      }
    }, 4000)
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
 
// 關閉廣告容器
function closeContainer() {
  isPullUp = true;
  TenMaxBanner.style = '';
  TenMaxBanner.offsetHeight;
  TenMaxTemplate.classList.remove('play', 'show');
  TenMaxInterstitial.style.display='none';
  firstInterstitial.style.display='none';
}
function closePicContainer(){
   
    TenMaxInterstitial.classList.add('down');    
    console.log('移除shake');
    setTimeout(function() {
        bannerBar.style.display = 'block';
    },1255);
  
  
}
// 檢查頁面是否已加載完成,並執行初始化
let isLoaded = performance.getEntriesByType('navigation').every((e) => e.loadEventEnd);
// 初始化函數
let init = function () {
bannerBar.style.display = 'none';
  TenMaxTemplate.classList.add('play');
  safariHacks();
  showContainer();
    setTimeout(function() {
        firstInterstitial.style.display = 'block';
       
  },1500);

};
if (isLoaded) {
  init();
} else {
  window.onload = init;
};