var TenMaxScript = document.querySelector("#rollpageImgJs");
var TenMaxLink = "{{URL_01}}";
var clickUrl = TenMaxScript.dataset.clickUrl;
var viewableUrl = TenMaxScript.dataset.viewableUrl;
var SSPviewableUrl = TenMaxScript.dataset.sspviewableUrl;
var ADXviewableUrl = TenMaxScript.dataset.adxviewableUrl;

let TenMaxTemplate = document.querySelector("#rollpageImg");
let TenMaxInterstitial = TenMaxTemplate.querySelector(".TenMaxInterstitial");
let TenMaxBannerBundle = TenMaxTemplate.querySelector(".TenMaxBannerBundle");
let TenMaxCloseBtn = TenMaxTemplate.querySelector(".TenMaxCloseBtn");
let pageNum = TenMaxTemplate.querySelector(".pageNum");

TenMaxCloseBtn.addEventListener("click", function (e) {
  e.preventDefault();
  TenMaxTemplate.scrollIntoView();
  TenMaxTemplate.style.display = "none";
});

let imgs = [...TenMaxInterstitial.querySelectorAll("img")].reverse();
let lastNum;
function howPage() {
  const numOfRollingPages = imgs.length - 1;
  const rotateDegree = 10;
  const translateDistance = -500;
  const rollingDuration = 0.5;
  const perPageDuration = rollingDuration / numOfRollingPages;
  let windowTop = TenMaxTemplate.getBoundingClientRect().top;
  let progress = windowTop / -TenMaxTemplate.offsetHeight;
  let arr = Array.from(Array(numOfRollingPages), (_, i) => i).map(n => {
    let p = (progress - perPageDuration * n) / perPageDuration;
    p = Math.max(Math.min(p, 1), 0);
    return p;
  });
  arr.forEach((progress, index) => {
    imgs[index].style.transform = `rotateZ(${rotateDegree * progress}deg) translateX(${translateDistance * progress}px)`;
  });
  let num = 1 + arr.filter(x => x == 1).length;
  if(lastNum != num) {
    lastNum = num;
    pageNum.textContent = `${lastNum}/${imgs.length}`;
  }
  // console.log('roll!');
  // TenMaxTemplate.querySelector(".stickyWindow").style.top = `${Math.max(Math.floor(windowTop), 0)}px`;
  requestAnimationFrame(howPage);
}

function setBannerBundle() {
  if(TenMaxTemplate.offsetWidth != 0) {
    TenMaxBannerBundle.style.width = `${TenMaxTemplate.offsetWidth}px`;
  } else {
    TenMaxBannerBundle.style.width = `${window.innerWidth * 0.8}px`;
  }
  TenMaxBannerBundle.style.transform = `translateX(${(window.innerWidth - TenMaxBannerBundle.offsetWidth) / 2}px)`;
}

function setTracker(template) {
  let href = window.location.href;
  let blob = 'tenmaxsgstatic.blob.core.windows.net/ssp/H5_Creative_Advertising';
  let cdn = 'tenmax-static.cacafly.net/ssp/H5_Creative_Advertising';
  if (href.indexOf(blob) != -1 || href.indexOf(cdn) != -1) {
    TenMaxBannerBundle.setAttribute("href", TenMaxLink);
  } else {
    TenMaxBannerBundle.setAttribute("href", clickUrl + encodeURIComponent(TenMaxLink));
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
}

let isLoaded = performance.getEntriesByType("navigation").every((e) => e.loadEventEnd);
let TenMaxPageInit = function () {
  setBannerBundle();
  setTracker(TenMaxTemplate);
  requestAnimationFrame(howPage);
};

if (isLoaded) {
  TenMaxPageInit();
} else {
  window.onload = TenMaxPageInit;
}