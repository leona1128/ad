var TenMaxScript = document.querySelector('#marqueeJs');
var TenMaxLink = 'https://www.tenmax.io';
var clickUrl = TenMaxScript.dataset.clickUrl;
var viewableUrl = TenMaxScript.dataset.viewableUrl;
var SSPviewableUrl = TenMaxScript.dataset.sspviewableUrl;
var ADXviewableUrl = TenMaxScript.dataset.adxviewableUrl;
var TenMaxCreativeId = TenMaxScript.dataset.creativeId;
var TenMaxCampaignId = TenMaxScript.dataset.campaignId;

let TenMaxTemplate = document.querySelector('#marquee');
let TenMaxInterstitial = TenMaxTemplate.querySelector('.TenMaxInterstitial');
let TenMaxBannerBundle = TenMaxTemplate.querySelector('.TenMaxBannerBundle');
let TenMaxMarquee = TenMaxBannerBundle.querySelector('.marqueeBackground');
let TenMaxCards = TenMaxBannerBundle.querySelector('.TenMaxCards');
let cardA = TenMaxCards.querySelector('.cardA');
let cardB = TenMaxCards.querySelector('.cardB');
let cardC = TenMaxCards.querySelector('.cardC');
let TenMaxCloseBtn = TenMaxTemplate.querySelector('.TenMaxCloseBtn');
TenMaxCloseBtn.addEventListener('click', function (e) {
  e.preventDefault();
  TenMaxTemplate.classList.remove('show');
});

TenMaxMarquee.addEventListener('animationend', function(event) {
  if (TenMaxMarquee != event.target) {
    return;
  }
  TenMaxMarquee.querySelectorAll('.marqueeContent').forEach((e) => {
    e.classList.add('go');
  });
});

cardA.addEventListener('animationend', function(event) {
  if (cardA != event.target) {
    return;
  }
  cardA.classList.remove('show');
  startRolling();
}, {once: true});

function showContainer() {
  TenMaxTemplate.classList.add('show');
  cardA.classList.add('show');
  setTracker(TenMaxTemplate);
}

function setTracker(TenMaxTemplate) {
  let href = window.location.href;
  let blob = 'tenmaxsgstatic.blob.core.windows.net/ssp/H5_Creative_Advertising';
  let cdn = 'tenmax-static.cacafly.net/ssp/H5_Creative_Advertising';
  if (href.indexOf(blob) != -1 || href.indexOf(cdn) != -1) {
    TenMaxBannerBundle.setAttribute('href', TenMaxLink);
  } else {
    TenMaxBannerBundle.setAttribute('href', clickUrl + encodeURIComponent(TenMaxLink));
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

async function startRolling() {
  const DELAY = 1;
  const PAUSE = 2.5;
  const ORDER = [1, 2, 3];
  let imgSorted = [...TenMaxBannerBundle.querySelectorAll('.TenMaxCards > img').entries()].sort(([a], [b]) => ORDER[a] - ORDER[b]).map(x => x[1]);
  await fadeIn(imgSorted[0]);
  await wait(PAUSE);
  while (true) {
    for (let i = 0; i < imgSorted.length; i++) {
      let current = imgSorted[i];
      let next = imgSorted[(i + 1) % imgSorted.length];
      await Promise.allSettled([fadeOut(current), fadeIn(next)]);
      await wait(PAUSE);
    } 
  }
}

function wait(sec) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, sec * 1000);
  });
}

function fadeIn(target) {
  return new Promise((resolve, reject) => {
    target.classList.add('current');
    target.addEventListener('transitionend', resolve, {once: true});
  });
}

function fadeOut(target) {
  return new Promise((resolve, reject) => {
    target.classList.replace('current', 'out');
    target.addEventListener('transitionend', () => {
      target.classList.remove('out');
      resolve();
    }, {once: true});
  });
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
let TenMaxInit = function () {
  safariHacks();
  TenMaxInterstitial.addEventListener('animationend', function(event) {
    if (TenMaxInterstitial != event.target) {
      return;
    }
    TenMaxInterstitial.setAttribute('style', 'display:none !important');
    showContainer();
  }, {once: true});
};

if (isLoaded) {
  TenMaxInit();
} else {
  window.onload = TenMaxInit;
};