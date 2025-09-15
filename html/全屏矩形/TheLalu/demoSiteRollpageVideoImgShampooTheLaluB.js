var TenMaxScript = document.querySelector('#rollpageVideoImgShampooJs');
var TenMaxLink = 'https://tlathena.ec-hotel.net/webhotel-v4/0174/index';
var clickUrl = TenMaxScript.dataset.clickUrl;
var viewableUrl = TenMaxScript.dataset.viewableUrl;
var SSPviewableUrl = TenMaxScript.dataset.sspviewableUrl;
var ADXviewableUrl = TenMaxScript.dataset.adxviewableUrl;

let TenMaxTemplate = document.querySelector("#rollpageVideoImgShampoo");
let TenMaxInterstitial = TenMaxTemplate.querySelector(".TenMaxInterstitial");
let TenMaxBannerBundle = TenMaxTemplate.querySelector(".TenMaxBannerBundle");
let TenMaxViewport = TenMaxTemplate.querySelector(".TenMaxViewport");
let TenMaxCloseBtn = TenMaxTemplate.querySelector(".TenMaxCloseBtn");
let TenMaxMuteBtn = TenMaxTemplate.querySelector('.TenMaxMuteBtn');
let TenMaxVideoContent = TenMaxTemplate.querySelector('.TenMaxVideo');
let TenMaxVideo = TenMaxTemplate.querySelector('video');
let pageNum = TenMaxTemplate.querySelector(".pageNum");
TenMaxCloseBtn.addEventListener("click", function (e) {
  e.preventDefault();
  TenMaxTemplate.scrollIntoView();
  TenMaxTemplate.style.display = "none";
  TenMaxVideo.muted = true;
});
TenMaxMuteBtn.addEventListener('click', function (e) {
  e.preventDefault();
  TenMaxVideo.muted ? TenMaxVideo.muted = false : TenMaxVideo.muted = true;
  toggleMuteBtn();
});

function toggleMuteBtn() {
  TenMaxVideo.muted ? TenMaxMuteBtn.classList.add('muted') : TenMaxMuteBtn.classList.remove('muted');
}

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
  if (lastNum != num) {
    lastNum = num;
    pageNum.textContent = `${lastNum}/${imgs.length}`;
  }
  if (isInViewport(TenMaxViewport)) {
    // console.log('yes');
    TenMaxVideo.play();
  } else {
    // console.log('no');
    TenMaxVideo.pause();
  }
  // console.log(window.innerWidth, window.innerHeight - window.innerWidth * 1080 / 1920);
  requestAnimationFrame(howPage);
}

function setBannerBundle() {
  let windowWidth;
  if(TenMaxTemplate.offsetWidth != 0) {
    windowWidth = TenMaxTemplate.offsetWidth;
  } else {
    windowWidth = window.innerWidth * 0.8;
  }
  TenMaxBannerBundle.style.width = `${windowWidth}px`;
  TenMaxInterstitial.style.height = `min(calc(${windowWidth}px / 4 * 9 + 1px), calc(100vh - ${windowWidth}px / 16 * 9 + 1px))`;
  TenMaxVideoContent.style.height = `max(calc(100vh - ${windowWidth}px / 4 * 9 + 1px), calc(${windowWidth}px / 16 * 9 + 1px))`;
  TenMaxBannerBundle.style.transform = `translateX(${(window.innerWidth - windowWidth) / 2}px)`;
}

function isInViewport(element) {
  let obj = element.getBoundingClientRect();
  let back = (
    obj.top <= (window.innerHeight || document.documentElement.clientHeight) &&
    obj.bottom >= 0
  );
  return back;
}

function setTracker(template) {
  if (window.location.host == 'tenmaxsgstatic.blob.core.windows.net') {
    TenMaxBannerBundle.setAttribute('href', TenMaxLink);
  } else {
    TenMaxBannerBundle.setAttribute('href',TenMaxLink);
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
let init = function () {
  toggleMuteBtn();
  setBannerBundle();
  setTracker(TenMaxTemplate);
  requestAnimationFrame(howPage);
};

if (isLoaded) {
  init();
} else {
  window.onload = init;
}