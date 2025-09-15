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

// 先定義 imgs
let imgs = [...TenMaxInterstitial.querySelectorAll("img")].reverse();
let lastNum;
const contentToShow = 2;  // 輪播內容物的顯示數量
const moveSpeed = 1000;    // 輪播切換時的速度
const scaleRatio = 0.8; // 縮小至 80%
const delayTime = 1000; // 停留時間 1 秒



// 添加滾動狀態追踪
let isScrolling = false;
let scrollTimeout;
let forceResetTimeout;
let lastStep = 0; // 追蹤上一次的步驟
let canScroll = false; // 控制是否可以滾動
let delayTimeout; // 控制延遲的 timeout

// 滾動事件監聽
window.addEventListener('scroll', function() {
  isScrolling = true;
  clearTimeout(scrollTimeout);
  clearTimeout(forceResetTimeout);

   // 使用 setTimeout 來檢測滾動停止
   scrollTimeout = setTimeout(function() {
    isScrolling = false;
    requestAnimationFrame(howPage); // 重新渲染以恢復大小
  }, 150);

  // 新增強制重置的 timeout
  forceResetTimeout = setTimeout(function() {
    isScrolling = false;
    requestAnimationFrame(howPage);
  }, 150);
}, { passive: true });


imgs.forEach(img => {
  img.style.transition = `transform ${moveSpeed}ms`;
});

TenMaxCloseBtn.addEventListener("click", function (e) {
  e.preventDefault();
  TenMaxTemplate.scrollIntoView();
  TenMaxTemplate.style.display = "none";
});

function howPage() {
    let windowTop = TenMaxTemplate.getBoundingClientRect().top;
    let containerHeight = TenMaxTemplate.offsetHeight;
    let offset = 0; 

    const imgHeight = imgs[0].offsetHeight;
    const imgStyle = getComputedStyle(imgs[0]);
    const marginBottom = parseInt(imgStyle.marginBottom);
    const moveDistance = imgHeight + marginBottom;

    let progress = Math.abs(windowTop) / (containerHeight - window.innerHeight);
    progress = Math.max(0, Math.min(1, progress));
    const totalSteps = imgs.length - contentToShow + 1; 
    const currentStep = Math.min(Math.floor(progress * totalSteps), totalSteps + 1); 

    imgs.forEach((img, index) => {
        let scale = isScrolling ? scaleRatio : 1;
        const move = isScrolling ? (imgHeight+ marginBottom) * scaleRatio : moveDistance;
        if (index < currentStep) {//如果圖片的索引小於 currentStep，說明這張圖片已經被滾出視野
            img.style.transform = `translateY(-${move}px) scale(${scale})`;
            img.style.zIndex = index - currentStep ;
        } else if (index >= currentStep && index < currentStep + contentToShow) {
            //如果圖片的索引在當前顯示範圍內，根據它相對於 currentStep 的位置計算偏移。
            const offset = index - currentStep;
            img.style.transform = `translateY(${offset * move}px) scale(${scale})`;
            img.style.zIndex = 1;
        } else {
            //如果圖片在顯示範圍之外，移出視野下方。
            position = (index - currentStep) * (move);
            img.style.transform = `translateY(${position}px) scale(${scale})`;
        }
    });

    let displayPage = currentStep + 1;
    if (lastNum !== displayPage) {
        lastNum = displayPage;
        pageNum.textContent = `${displayPage}/${imgs.length}`;
    }

    requestAnimationFrame(howPage);
}


function setBannerBundle() {
  if(TenMaxTemplate.offsetWidth != 0) {
    TenMaxBannerBundle.style.width = `${TenMaxTemplate.offsetWidth}px`;
  } else {
    TenMaxBannerBundle.style.width = `${window.innerWidth *0.8}px`;
  }
  TenMaxBannerBundle.style.transform = `translateX(${(window.innerWidth - TenMaxBannerBundle.offsetWidth) / 2}px)`;
}

function setTracker(template) {
  if (window.location.host == "tenmaxsgstatic.blob.core.windows.net") {
    TenMaxBannerBundle.setAttribute("href", TenMaxLink);
  } else {
    TenMaxBannerBundle.setAttribute("href", encodeURIComponent(TenMaxLink));
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
  setBannerBundle();
  setTracker(TenMaxTemplate);
  requestAnimationFrame(howPage);
};

if (isLoaded) {
  pageInit();
} else {
  window.onload = pageInit;
}