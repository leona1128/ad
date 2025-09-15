var TenMaxScript = document.querySelector("#rollpageBannerJs");
var TenMaxLink = "https://tenmax.io";
var clickUrl = TenMaxScript.dataset.clickUrl;
var viewableUrl = TenMaxScript.dataset.viewableUrl;
var SSPviewableUrl = TenMaxScript.dataset.sspviewableUrl;
var ADXviewableUrl = TenMaxScript.dataset.adxviewableUrl;
var Third_party_viewableUrl_1 = TenMaxScript.dataset.thirdPartyViewableUrl1;
var Third_party_viewableUrl_2 = TenMaxScript.dataset.thirdPartyViewableUrl2;
var Third_party_viewableUrl_3 = TenMaxScript.dataset.thirdPartyViewableUrl3;

let TenMaxTemplate = document.querySelector("#rollpageBanner");
let TenMaxInterstitial = TenMaxTemplate.querySelector(".TenMaxInterstitial");

let TenMaxBannerBundle = TenMaxTemplate.querySelector(".TenMaxBannerBundle");
let TenMaxCloseBtn = TenMaxTemplate.querySelector(".TenMaxCloseBtn");
let pageNum = TenMaxTemplate.querySelector(".pageNum");
let textImg_3 = TenMaxTemplate.querySelector(".textImg-3");
let tenmaxLogo = TenMaxTemplate.querySelector(".TenMaxLogo");
// 先定義 imgs
let imgs = [...TenMaxInterstitial.querySelectorAll("img")].reverse();
let lastNum;
const contentToShow = 2;  // 輪播內容物的顯示數量
const moveSpeed = 500;    // 輪播切換時的速度
const scaleRatio = 1; // 縮小至 80%
const delayTime = 500; // 停留時間 1 秒
let animationStates = {
  currentStep: 0,
  isAnimating: false,
  hasShownCurrent: false,
  isOutAnimating: false,
  hasCompletedOut: false  // 追蹤 out 動畫是否完成
};

function handleAnimations(currentStep, currentProgress) {
  const currentElement = document.querySelector(`.textImg-${currentStep + 1}`);
  if (!currentElement) return;

  // 檢查是否可以切換到新步驟
  if (currentStep !== animationStates.currentStep) {
    // 只有在前一個元素完成了 out 動畫後才允許切換
    if (!animationStates.hasCompletedOut) {
      return; // 如果還沒完成 out，強制保持在當前步驟
    }

    // 可以切換到新步驟
    const prevElement = document.querySelector(`.textImg-${animationStates.currentStep + 1}`);
    if (prevElement) {
      prevElement.classList.remove('show', 'out');
    }
    
    // 重置所有動畫狀態
    animationStates.hasShownCurrent = false;
    animationStates.isOutAnimating = false;
    animationStates.hasCompletedOut = false;
    animationStates.currentStep = currentStep;
  }

  // Show 動畫
  if (!currentElement.classList.contains('show') && !animationStates.isAnimating) {
    animationStates.isAnimating = true;
    
    // 清除其他元素的 class
    document.querySelectorAll('.textImg-1, .textImg-2, .textImg-3').forEach(el => {
      if (el !== currentElement) {
        el.classList.remove('show', 'out');
      }
    });

    currentElement.classList.add('show');
    
    setTimeout(() => {
      animationStates.isAnimating = false;
      animationStates.hasShownCurrent = true;
    }, 0);
  }

  // Out 動畫處理
  const isInOutTriggerZone = (scrollDirection === 'down' && currentProgress >= 0.75) ||
                            (scrollDirection === 'up' && currentProgress <= 0.25);

  if (animationStates.hasShownCurrent) {
    if (isInOutTriggerZone) {
      // 在觸發區域內，且還沒有 out class 時，添加 out
      if (!currentElement.classList.contains('out') && !animationStates.isOutAnimating) {
        animationStates.isOutAnimating = true;
        currentElement.classList.add('out');
        
        setTimeout(() => {
          animationStates.isOutAnimating = false;
          animationStates.hasCompletedOut = true;
        }, 0);
      }
    } else {
      // 在觸發區域外，且有 out class 時，移除 out
      if (currentElement.classList.contains('out')) {
        currentElement.classList.remove('out');
        // 如果已完成 out 動畫，重置狀態以允許再次觸發
        if (animationStates.hasCompletedOut) {
          animationStates.hasCompletedOut = false;
          animationStates.isOutAnimating = false;
        }
      }
    }
  }

  return animationStates.currentStep;
}

// 設置圖片的 transition
imgs.forEach(img => {

  img.style.transition = `transform ${moveSpeed}ms cubic-bezier(0.4, 0.0, 0.2, 1)`;
  img.style.willChange = 'transform';
  img.style.backfaceVisibility = 'hidden';

  // img.style.perspective = '1000px';
});

// 添加滾動狀態追踪
let isScrolling = false;
let scrollTimeout;
let forceResetTimeout;
let canAddOut = false;


// 添加滾動方向追踪
let lastScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
let scrollDirection = 'down';

// 滾動事件監聽

let lastScrollTime = 0;
const scrollThrottle = 8; //滾動限制

window.addEventListener('scroll', function() {
  const now = Date.now();
  
  if (now - lastScrollTime >= scrollThrottle) {
    const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    const scrollDelta = currentScrollPosition - lastScrollPosition;
    
    if (Math.abs(scrollDelta) > 2) {
      scrollDirection = scrollDelta > 0 ? 'down' : 'up';
      lastScrollPosition = currentScrollPosition;
    }
    
    if (!scrollTimeout) {
      scrollTimeout = requestAnimationFrame(() => {
        howPage();
        scrollTimeout = null;
      });
    }
    
    lastScrollTime = now;
  }
}, { passive: true });


TenMaxCloseBtn.addEventListener("click", function (e) {
  e.preventDefault();
  TenMaxTemplate.scrollIntoView();
  TenMaxTemplate.style.display = "none";
});
// 添加變量追踪 out 動畫狀態
let isOutAnimating = false;
let previousStep = 0;
let isAnimating = false;  
let hasShownCurrent = false; 


// 處理圖片變換
function howPage() {
  let windowTop = TenMaxTemplate.getBoundingClientRect().top;
  
  const imgHeight = Math.round(imgs[0].offsetHeight);
  const imgStyle = getComputedStyle(imgs[0]);
  const marginBottom = Math.round(parseInt(imgStyle.marginBottom));
  const moveDistance = Math.round(imgHeight + marginBottom);
  
  let containerHeight = (imgs.length - 1) * moveDistance + window.innerHeight;
  
  let progress = Math.abs(windowTop) / (containerHeight - window.innerHeight);
  progress = Math.max(0, Math.min(1, progress));
  const totalSteps = imgs.length - contentToShow + 1;
  
  const targetStep = Math.min(Math.floor(progress * totalSteps), totalSteps);
  
  // 計算當前進度
  const totalDistance = imgHeight + marginBottom;
  let currentScrollPosition = Math.abs(windowTop);
  const relativePosition = currentScrollPosition - (targetStep * totalDistance);
  const currentProgress = relativePosition / totalDistance;
  
  // 使用 handleAnimations 的返回值作為實際的 currentStep
  const currentStep = handleAnimations(targetStep, currentProgress);
  
  // 處理圖片位置
  imgs.forEach((img, index) => {
    const move = moveDistance;
    let basePosition;
    
    if (index < currentStep) {
      basePosition = -move;
      img.style.zIndex = index - currentStep;
    } else if (index >= currentStep && index < currentStep + contentToShow) {
      const offset = index - currentStep;
      
      if (offset === 0) {
        basePosition = 0;
      } else {
        basePosition = move;
        if (!animationStates.isOutAnimating && currentProgress >= 0.75) {
          basePosition = move - (currentProgress - 0.75) * move * 2;
        }
      }
      
      img.style.zIndex = contentToShow - offset;
    } else {
      basePosition = (index - currentStep) * move;
    }
    
    img.style.transform = `translate3d(0, ${basePosition}px, 0)`;
  });

  // 更新頁碼
  if (lastNum !== currentStep + 1) {
    lastNum = currentStep + 1;
    pageNum.textContent = `${lastNum}/${imgs.length}`;
  }
}

function setBannerBundle() {
  if (TenMaxTemplate.offsetWidth != 0) {
    TenMaxBannerBundle.style.width = `${TenMaxTemplate.offsetWidth}px`;
  } else {
    TenMaxBannerBundle.style.width = `${window.innerWidth * 0.8}px`;
  }
  TenMaxBannerBundle.style.transform = `translateX(${(window.innerWidth - TenMaxBannerBundle.offsetWidth) / 2}px)`;
}

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

let isLoaded = performance.getEntriesByType("navigation").every((e) => e.loadEventEnd);
let pageInit = function () {
  safariHacks(); 
  setBannerBundle();
  setTracker(TenMaxTemplate);
  requestAnimationFrame(howPage);
};
function safariHacks() {

  let windowsVH = window.innerHeight / 100;

  textImg_3.style.setProperty("--vh", windowsVH + "px");

  let bottomSpacing = Math.max(windowsVH * 2, 15);
  

  tenmaxLogo.style.bottom = `${bottomSpacing}px`;
  tenmaxLogo.style.setProperty("--vh", windowsVH + "px");
  

  document.body.style.height = `${window.innerHeight}px`;
  

  window.addEventListener("resize", function() {

    windowsVH = window.innerHeight / 100;
    

    textImg_3.style.setProperty("--vh", windowsVH + "px");
    

    bottomSpacing = Math.max(windowsVH * 2.5, 15);
    tenmaxLogo.style.bottom = `${bottomSpacing}px`;
    tenmaxLogo.style.setProperty("--vh", windowsVH + "px");
    

    document.body.style.height = `${window.innerHeight}px`;
  });
}


if (isLoaded) {
  pageInit();

} else {
  window.onload = pageInit;
}