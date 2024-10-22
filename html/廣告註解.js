// 選擇廣告相關的DOM元素
// 選擇載入廣告腳本的標籤
var TenMaxScript = document.querySelector('#pullUpImgJs');

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

// 在主廣告容器中選擇class為'firstInterstitial'的元素
let firstInterstitial = TenMaxTemplate.querySelector('.firstInterstitial');

// 在主廣告容器中選擇class為'TenMaxBannerBundle'的元素
let TenMaxBannerBundle = TenMaxTemplate.querySelector('.TenMaxBannerBundle');

// 在TenMaxBannerBundle中選擇class為'TenMaxBanner'的元素
let TenMaxBanner = TenMaxBannerBundle.querySelector('.TenMaxBanner');

// 在TenMaxBannerBundle中選擇class為'TenMaxInterstitial'的元素
let TenMaxInterstitial = TenMaxBannerBundle.querySelector('.TenMaxInterstitial');

// 在TenMaxBanner中選擇class為'pullUpArrow'的元素，這可能是上拉按鈕
let pullUpBtn = TenMaxBanner.querySelector('.pullUpArrow');

// 在TenMaxBanner中選擇class為'TenMaxCloseBtn'的元素，這是關閉按鈕
let TenMaxBannerCloseBtn = TenMaxBanner.querySelector('.TenMaxCloseBtn');

// 在TenMaxInterstitial中選擇class為'TenMaxCloseBtn'的元素，這是另一個關閉按鈕
let TenMaxInterstitialCloseBtn = TenMaxInterstitial.querySelector('.TenMaxCloseBtn');

// 添加事件監聽器
TenMaxBanner.addEventListener('touchstart', handleTouchStart);
TenMaxBanner.addEventListener('touchmove', handleTouchMove);
// 為TenMaxBanner添加動畫結束事件監聽器
TenMaxBanner.addEventListener('animationend', function(event) {
    // 如果廣告已經被拉起，則不執行後續操作
    if (isPullUp) {
      return;
    }
    
    let interval = 200;
    // 如果自上次滾動以來的時間小於interval
    if (event.timeStamp - lastScroll < interval) {
      // 播放彈跳動畫
      playBouncingAnimation();
    } else {
      // 否則，停止動畫
      isPlaying = false;
      TenMaxBanner.setAttribute('style', 'animation: none;');
    }
  });
  
  // 為上拉按鈕添加點擊事件監聽器
  pullUpBtn.addEventListener('click', function(e) {
    // 阻止默認事件
    e.preventDefault();
    // 調用上拉容器函數
    pullUpContainer();
  });
  
  // 為插頁式廣告的關閉按鈕添加點擊事件監聽器
  TenMaxInterstitialCloseBtn.addEventListener('click', function(e) {
    // 阻止默認事件
    e.preventDefault();
    // 調用下推容器函數
    pushDownContainer();
  });
  
  // 為橫幅廣告的關閉按鈕添加點擊事件監聽器
  TenMaxBannerCloseBtn.addEventListener('click', function(e) {
    // 阻止默認事件
    e.preventDefault();
    // 調用關閉容器函數
    closeContainer();
  });

// 處理觸摸事件的函數
function handleTouchStart(e) {
  // 觸摸開始邏輯
}

function handleTouchMove(e) {
  // 觸摸移動邏輯
}

// 控制廣告容器的函數
function pullUpContainer() {
  // 拉起廣告容器
}

function pushDownContainer() {
  // 推下廣告容器
}

function playBouncingAnimation() {
  // 播放彈跳動畫
}

function showContainer() {
  // 顯示廣告容器
  TenMaxTemplate.classList.add('show');
  setTracker(TenMaxTemplate);
}

// 設置追蹤器
function setTracker(TenMaxTemplate) {
  // 設置追蹤器邏輯
}

// Safari瀏覽器的特殊處理
function safariHacks() {
  // Safari相關的調整
}

// 關閉廣告容器
function closeContainer() {
  // 關閉廣告容器邏輯
}

// 初始化函數
let init = function () {
  TenMaxTemplate.classList.add('play');
  safariHacks();
  setTimeout(function() {
    showContainer();
    firstInterstitial.setAttribute("style", "display:none !important");
  }, 3400);
};

// 檢查頁面是否已加載完成,並執行初始化
let isLoaded = performance.getEntriesByType('navigation').every((e) => e.loadEventEnd);
if (isLoaded) {
  init();
} else {
  window.onload = init;
}