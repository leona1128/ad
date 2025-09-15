var TenMaxScript = document.querySelector("#rollpageSlideshowJs");
var TenMaxLink = "https://tenmax.io";
var clickUrl = TenMaxScript.dataset.clickUrl;
var viewableUrl = TenMaxScript.dataset.viewableUrl;
var SSPviewableUrl = TenMaxScript.dataset.sspviewableUrl;
var ADXviewableUrl = TenMaxScript.dataset.adxviewableUrl;
var Third_party_viewableUrl_1 = TenMaxScript.dataset.thirdPartyViewableUrl1;
var Third_party_viewableUrl_2 = TenMaxScript.dataset.thirdPartyViewableUrl2;
var Third_party_viewableUrl_3 = TenMaxScript.dataset.thirdPartyViewableUrl3;

let TenMaxTemplate = document.querySelector("#rollpageSlideshow");
let TenMaxInterstitial = TenMaxTemplate.querySelector(".TenMaxInterstitial");
let TenMaxBannerBundle = TenMaxTemplate.querySelector(".TenMaxBannerBundle");
let TenMaxCloseBtn = TenMaxTemplate.querySelector(".TenMaxCloseBtn");
let pageNum = TenMaxTemplate.querySelector(".pageNum");
let tenmaxLogo = TenMaxTemplate.querySelector(".TenMaxLogo");
let imgs = [...TenMaxInterstitial.querySelectorAll("img")].reverse();
let lastNum;
const contentToShow = 2;
const moveSpeed = 700;    // 動畫時間
const scaleRatio = 0.75;    // 縮放比例
const delayTime = 500;    // 延遲時間

// 狀態控制
let isAnimating = false; // 動畫中
let currentStep = 0;   // 當前步驟
let lastScrollPosition = window.scrollY;  // 上次滾動位置
let isWaiting = false; // 等待中
let initialDelay = false; // 初次延遲

// 初始化圖片樣式
imgs.forEach((img, index) => {
  img.style.transition = `transform ${moveSpeed}ms ease-out`;
  img.style.willChange = 'transform';
  
  // 設置初始位置
  if (index < contentToShow) {
      // 前兩張圖片的位置
      img.style.transform = `translateY(${index * (imgs[0].offsetHeight + parseInt(getComputedStyle(imgs[0]).marginBottom))}px) scale(1)`;
      img.style.zIndex = 1;
  } else {
      // 其餘圖片的位置
      img.style.transform = `translateY(${index * (imgs[0].offsetHeight + parseInt(getComputedStyle(imgs[0]).marginBottom))}px) scale(1)`;
      img.style.zIndex = 0;
  }
});
pageNum.textContent = `1/${imgs.length}`;
lastNum = 1;

// 關閉按鈕事件
TenMaxCloseBtn.addEventListener("click", function (e) {
    e.preventDefault();
    TenMaxTemplate.scrollIntoView();
    TenMaxTemplate.style.display = "none";
});

// 滾動事件處理
window.addEventListener('scroll', function() {
  if (initialDelay) {
      window.scrollTo(0, lastScrollPosition);
      return;
  }

  if (isAnimating || isWaiting) {
      window.scrollTo(0, lastScrollPosition);
      return;
  }

  const currentScrollY = window.scrollY;
  const containerTop = TenMaxTemplate.getBoundingClientRect().top + window.scrollY;
  const containerHeight = TenMaxTemplate.offsetHeight;
  
  // 檢查是否在廣告區域內
  if (currentScrollY < containerTop || currentScrollY > containerTop + containerHeight) {
      lastScrollPosition = currentScrollY;
      return;
  }

  const windowTop = currentScrollY - containerTop;//計算滾動動畫中可切換的總步驟數
  let progress = Math.abs(windowTop) / (containerHeight - window.innerHeight);
  progress = Math.max(0, Math.min(1, progress));//根據滾動進度計算當前應該顯示的步驟（圖片序號）
  
  const totalSteps = imgs.length - contentToShow + 1;
  const potentialStep = Math.min(Math.floor(progress * totalSteps), totalSteps + 1);

  if (potentialStep !== currentStep && !isAnimating) {
    // 檢查是否需要更新圖片位置
      updateImagePositions(potentialStep);
  }

  lastScrollPosition = currentScrollY;
});
function updateImagePositions(newStep) {
  if (isAnimating) return;
  
  isAnimating = true;
  isWaiting = true;

  const imgHeight = imgs[0].offsetHeight;
  const imgStyle = getComputedStyle(imgs[0]);
  const marginBottom = parseInt(imgStyle.marginBottom);
  const moveDistance = imgHeight + marginBottom;//圖片在動畫中需要移動的距離

  // 第一步：所有圖片先縮小
  imgs.forEach((img, index) => {
      const scale = scaleRatio;
      const move = moveDistance * scaleRatio;
      let position;

      if (index < newStep) {//如果圖片的索引小於 currentStep，說明這張圖片已經被滾出視野
          position = -move;
          img.style.zIndex = index - newStep;
      } else if (index >= newStep && index < newStep + contentToShow) {
        //如果圖片的索引在當前顯示範圍內，根據它相對於 currentStep 的位置計算偏移
          position = (index - newStep) * move;
          img.style.zIndex = 1;
      } else {
         //如果圖片在顯示範圍之外，移出視野下方。
          position = (index - newStep) * move;
          img.style.zIndex = 0;
      }

      img.style.transform = `translateY(${position}px) scale(${scale})`;
  });

  // 第二步：放大回原尺寸時重新計算位置
  setTimeout(() => {
      imgs.forEach((img, index) => {
          let newPosition;
          
          if (index < newStep) {
              newPosition = -moveDistance;
              img.style.zIndex = index - newStep;
          } else if (index >= newStep && index < newStep + contentToShow) {
              newPosition = (index - newStep) * moveDistance;
              img.style.zIndex = 1;
          } else {
              newPosition = (index - newStep) * moveDistance;
              img.style.zIndex = 0;
          }

          img.style.transform = `translateY(${newPosition}px) scale(1)`;
      });

      // 更新頁碼
      let displayPage = newStep + 1;
      if (lastNum !== displayPage) {
          lastNum = displayPage;
          pageNum.textContent = `${displayPage}/${imgs.length}`;
      }
      
      setTimeout(() => {
          // 先重設動畫標記
          currentStep = newStep;
          isAnimating = false;   
          // 判斷是否為最後一張
    const isLastStep = newStep === imgs.length - contentToShow +1;
    // 如果是最後一張，強制等待 
    if (isLastStep) {
      // isAnimating = true;
      // isWaiting = true;
          isAnimating = false;
          isWaiting = false;
      
    } else {
        // 不是最後一張，正常等待 
        setTimeout(() => {
            isWaiting = false;
        },  0);
    }
}, moveSpeed);
  }, delayTime); // 等待動畫結束後再執行
} 

function setBannerBundle() {
    if(TenMaxTemplate.offsetWidth != 0) {
        TenMaxBannerBundle.style.width = `${TenMaxTemplate.offsetWidth}px`;
    } else {
        TenMaxBannerBundle.style.width = `${window.innerWidth * 0.8}px`;
    }
    TenMaxBannerBundle.style.transform = `translateX(${(window.innerWidth - TenMaxBannerBundle.offsetWidth) / 2}px)`;
}

// 追蹤器設置
function setTracker(template) {
    if (window.location.host == "tenmaxsgstatic.blob.core.windows.net") {
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
    
    template.appendChild(viewable);
    template.appendChild(sspViewable);
    template.appendChild(adxViewable);

    if (Third_party_viewableUrl_1) {
        let thirdPartyViewable1 = document.createElement("img");
        thirdPartyViewable1.src = Third_party_viewableUrl_1;
        thirdPartyViewable1.style.display = "none";
        template.appendChild(thirdPartyViewable1);
    }
    if (Third_party_viewableUrl_2) {
        let thirdPartyViewable2 = document.createElement("img");
        thirdPartyViewable2.src = Third_party_viewableUrl_2;
        thirdPartyViewable2.style.display = "none";
        template.appendChild(thirdPartyViewable2);
    }
    if (Third_party_viewableUrl_3) {
        let thirdPartyViewable3 = document.createElement("img");
        thirdPartyViewable3.src = Third_party_viewableUrl_3;
        thirdPartyViewable3.style.display = "none";
        template.appendChild(thirdPartyViewable3);
    }
}

// 初始化
let isLoaded = performance.getEntriesByType("navigation").every((e) => e.loadEventEnd);
let pageInit = function () {
  setBannerBundle();
  safariHacks();
  setTracker(TenMaxTemplate);
  // 重新設置初始狀態
  currentStep = 0;  // 確保從第一張開始
  // 初始延遲
  initialDelay = true;
  setTimeout(() => {
      initialDelay = false;
  }, delayTime);
};
function safariHacks() {
    let windowsVH = window.innerHeight / 100;
    let bottomSpacing = Math.max(windowsVH * 1.8, 15);
    tenmaxLogo.style.bottom = `${bottomSpacing}px`;
    tenmaxLogo.style.setProperty("--vh", `${windowsVH}px`);
    document.body.style.height = `${window.innerHeight}px`;
    window.addEventListener("resize", function() {
      windowsVH = window.innerHeight / 100;
      bottomSpacing = Math.max(windowsVH * 1.8, 15);
      tenmaxLogo.style.bottom = `${bottomSpacing}px`;
      tenmaxLogo.style.setProperty("--vh", `${windowsVH}px`);
      document.body.style.height = `${window.innerHeight}px`;
    });
  }

if (isLoaded) {
    pageInit();
} else {
    window.onload = pageInit;
}

// 視窗大小改變時重新設置 Banner 尺寸
window.addEventListener('resize', setBannerBundle);