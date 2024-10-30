var TenMaxScript = document.querySelector('#effectsAnimationFarEasternIIIJs');
var TenMaxLink = 'https://www.feds.com.tw/tw/1/Event/Detail/26596';
var clickUrl = TenMaxScript.dataset.clickUrl;
var viewableUrl = TenMaxScript.dataset.viewableUrl;
var SSPviewableUrl = TenMaxScript.dataset.sspviewableUrl;
var ADXviewableUrl = TenMaxScript.dataset.adxviewableUrl;

let TenMaxTemplate = document.querySelector('#effectsAnimationFarEasternIII');
let TenMaxMuteBtn = TenMaxTemplate.querySelector('.TenMaxMuteBtn');
let TenMaxInterstitial = TenMaxTemplate.querySelector('.TenMaxInterstitial');
let TMMom = TenMaxInterstitial.querySelector('.mom');
let TMMomGift = TenMaxInterstitial.querySelector('.momGift');
let TMDad = TenMaxInterstitial.querySelector('.dad');
let TMDadGift = TenMaxInterstitial.querySelector('.dadGift');
let TMGirl = TenMaxInterstitial.querySelector('.girl');
let TMGirlGift = TenMaxInterstitial.querySelector('.girlGift');
let TMSmoke = TenMaxInterstitial.querySelector('.smoke');
let endPeople = TenMaxInterstitial.querySelector('.endPeople');
let FELogo = TenMaxInterstitial.querySelector('.logo');
let TMBloons = TenMaxInterstitial.querySelector('.bloons');
let TMRRibbon = TenMaxInterstitial.querySelector('.RRibbonII');
let TenMaxBannerBundle = TenMaxTemplate.querySelector('.TenMaxBannerBundle');
let bannerClose = TenMaxTemplate.querySelector('.TenMaxBannerCloseBtn');
let TenMaxVideo = TenMaxBannerBundle.querySelector('video');
let interstitialClose = TenMaxTemplate.querySelector('.interstitialClose');

bannerClose.addEventListener('click', function (e) {
  e.preventDefault();
  TenMaxTemplate.classList.remove('show');
  TenMaxVideo.pause();
});

interstitialClose.addEventListener('click', function (e) {
  e.preventDefault();
  TenMaxTemplate.classList.add('remove');
  TenMaxVideo.pause();
});

TMMomGift.addEventListener('animationend', () => {
  TMDad.classList.add('fadeOut');
  TMSmoke.classList.add('fadeInNOut');
  TMDadGift.classList.add('fadeIn');
});

TMSmoke.addEventListener('animationend', () =>{
  TMSmoke.classList.remove('fadeInNOut');
});

TMDadGift.addEventListener('animationend', ()=> {
  TMGirl.classList.add('fadeOut');
  TMSmoke.classList.add('girlFadeInNOut');
  TMGirlGift.classList.add('fadeIn');
});

TMGirlGift.addEventListener('animationend', () => {
  FELogo.classList.add('popIn');
  TMBloons.classList.add('float');
  endPeople.classList.add('show');
  TenMaxInterstitial.querySelectorAll('.ribbon').forEach(e => {
    e.classList.add('fall');
  });
});

TMRRibbon.addEventListener('animationend', () => {
  TenMaxInterstitial.classList.add('out');
  interstitialClose.classList.add('out');
});

TenMaxInterstitial.addEventListener('animationend', function(event) {
  if (TenMaxInterstitial != event.target) {
    return;
  }
  showContainer();
});

TenMaxMuteBtn.addEventListener('click', function (e) {
  e.preventDefault();
  TenMaxVideo.muted ? TenMaxVideo.muted = false : TenMaxVideo.muted = true;
  toggleMuteBtn();
});

function toggleMuteBtn() {
  TenMaxVideo.muted ? TenMaxMuteBtn.classList.add('muted') : TenMaxMuteBtn.classList.remove('muted');
}

function showContainer() {
  TenMaxTemplate.classList.add('show');
  TenMaxVideo.play();
  TenMaxVideo.muted = true;
}

function setURL() {
  let href = window.location.href;
  let blob = 'tenmaxsgstatic.blob.core.windows.net/ssp/H5_Creative_Advertising';
  let cdn = 'tenmax-static.cacafly.net/ssp/H5_Creative_Advertising';
  if (href.indexOf(blob) != -1 || href.indexOf(cdn) != -1) {
    TenMaxInterstitial.setAttribute('href', TenMaxLink);
    TenMaxBannerBundle.setAttribute('href', TenMaxLink);
  } else {
    TenMaxInterstitial.setAttribute('href', clickUrl + encodeURIComponent(TenMaxLink));
    TenMaxBannerBundle.setAttribute('href', clickUrl + encodeURIComponent(TenMaxLink));
  }
}

function setTracker(template) {
  let viewable = document.createElement('img');
  viewable.src = viewableUrl;
  viewable.style.display = 'none';
  let sspViewable = document.createElement('img');
  sspViewable.src = SSPviewableUrl;
  sspViewable.style.display = 'none';
  let adxViewable = document.createElement('img');
  adxViewable.src = ADXviewableUrl;
  adxViewable.style.display = 'none';
  template.appendChild(viewable);
  template.appendChild(sspViewable);
  template.appendChild(adxViewable);
}

function safariHacks() {
  let windowsVH = window.innerHeight / 100;
  TenMaxTemplate.style.setProperty('--vh', windowsVH + 'px');
  window.addEventListener('resize', function () {
    TenMaxTemplate.style.setProperty('--vh', windowsVH + 'px');
  });
  TenMaxInterstitial.classList.add('show');
}

let isLoaded = performance.getEntriesByType('navigation').every((e) => e.loadEventEnd);
let init = function () {
  safariHacks();
  toggleMuteBtn();
  interstitialClose.classList.add('show');
  TMMom.classList.add('momFadeOut');
  TMSmoke.classList.add('fadeInNOut');
  TMMomGift.classList.add('fadeIn');
  setTracker(TenMaxTemplate);
  setURL();
};

if (isLoaded) {
  init();
} else {
  window.onload = init;
}
