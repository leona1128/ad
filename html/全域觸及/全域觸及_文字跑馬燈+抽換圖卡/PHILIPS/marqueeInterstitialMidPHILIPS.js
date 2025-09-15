var TenMaxScript = document.querySelector('#marqueeInterstitialTeaJs');
var TenMaxLink = 'https://www.momoshop.com.tw/category/LgrpCategory.jsp?l_code=2127100000&srsltid=AfmBOopesa91i4p_HkHZwBWfcmFxeTj43z3lyA_EZBa4wGcjcuYZOHgD';
var clickUrl = TenMaxScript.dataset.clickUrl;
var viewableUrl = TenMaxScript.dataset.viewableUrl;
var SSPviewableUrl = TenMaxScript.dataset.sspviewableUrl;
var ADXviewableUrl = TenMaxScript.dataset.adxviewableUrl;
var TenMaxCreativeId = TenMaxScript.dataset.creativeId;
var TenMaxCampaignId = TenMaxScript.dataset.campaignId;

let pageBody = document.querySelector('body');
let TenMaxTemplate = document.querySelector('#marqueeInterstitialTea');
let TenMaxInterstitial = TenMaxTemplate.querySelector('.TenMaxInterstitial');
let TenMaxBannerBundle = TenMaxTemplate.querySelector('.TenMaxBannerBundle');
let TenMaxMarquee = TenMaxBannerBundle.querySelector('.marqueeBackground');
let TenMaxSlide = TenMaxBannerBundle.querySelector('.slide');
let TenMaxCards = TenMaxBannerBundle.querySelector('.TenMaxCards');
let cardA = TenMaxCards.querySelector('.cardA');
let cardB = TenMaxCards.querySelector('.cardB');
let cardC = TenMaxCards.querySelector('.cardC');
let TenMaxCloseBtn = TenMaxTemplate.querySelector('.TenMaxCloseBtn');

// 模擬 Touch 事件
function simulateTouch(targetEl, event, type) {
  try {
    const touchObj = new Touch({
      identifier: Date.now(),
      target: targetEl, // 直接指定目標為方塊
      clientX: event.clientX,
      clientY: event.clientY,
      pageX: event.pageX,
      pageY: event.pageY,
      screenX: event.screenX,
      screenY: event.screenY,
      radiusX: 2.5,
      radiusY: 2.5,
      rotationAngle: 0,
      force: 0.5
    });

    const touchEvent = new TouchEvent(type, {
      cancelable: true,
      bubbles: true,
      touches: [touchObj],
      targetTouches: [touchObj],
      changedTouches: [touchObj]
    });

    targetEl.dispatchEvent(touchEvent);
  } catch (error) {
    console.error('Error simulating touch event:', error);
  }
}

TenMaxCloseBtn.addEventListener('click', function (e) {
  e.preventDefault();
  stopRolling = false;
  startRolling();
  closeInterstitial();
});

let stopRolling = false;
let intersectionObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    TenMaxMarquee.querySelectorAll('.marqueeContent').forEach((e) => {
      e.classList.add('go');
    });
    TenMaxSlide.classList.add('show');
    startRolling();
    intersectionObserver.unobserve(TenMaxTemplate);
  }
}, {
  root: null,
  rootMargin: "0px 0px 0px 0px",
  threshold: 1,
});

TenMaxSlide.addEventListener('animationend', () => {
  TenMaxSlide.classList.remove('show');
});

const DELAY = 1;
const PAUSE = 2;
const ORDER = [1, 2, 3];
let cardSorted = [...TenMaxBannerBundle.querySelectorAll('.TenMaxCards > img').entries()].sort(([a], [b]) => ORDER[a] - ORDER[b]).map(x => x[1]);
let imgSorted = [...TenMaxInterstitial.querySelectorAll('.ICard').entries()].sort(([a], [b]) => ORDER[a] - ORDER[b]).map(x => x[1]);
let currentCard, currentImg ,nextCard ,nextImg;
let nowNum = 0;
async function spinPage() {
  currentCard = cardSorted[nowNum % cardSorted.length];
  currentImg = imgSorted[nowNum % imgSorted.length];
  nextCard = cardSorted[(nowNum + 1) % cardSorted.length];
  nextImg = imgSorted[(nowNum + 1) % imgSorted.length];
  nowNum++;
  await Promise.allSettled([fadeOut(currentCard), fadeIn(nextCard), fadeOut(currentImg), fadeIn(nextImg)]);
}

let start_on_banner = null;
TenMaxCards.addEventListener('touchstart', e => {
	e.stopPropagation();
	start_on_banner = e.touches[0].clientX;
})

TenMaxCards.addEventListener('touchmove', e => {
	e.stopPropagation();
	if (start_on_banner === null) {
		return
	}
	let current = e.touches[0].clientX;
	let diff = current - start_on_banner;
	if (diff > -20) {
		return;
	}
  stopRolling = true;
  openInterstitial();
  start_on_banner = null;
  TenMaxInterstitial.addEventListener('animationend', event => {
    if (TenMaxInterstitial != event.target) {
      return;
    }
    spinPage();
  });
});

let start_on_interstitial = null;
TenMaxInterstitial.addEventListener('touchstart', e => {
	e.stopPropagation()
	start_on_interstitial = e.touches[0].clientX;
})

TenMaxInterstitial.addEventListener('touchmove', e => {
	if (start_on_interstitial === null) {
		return
	}
	let current = e.touches[0].clientX;
	let diff = current - start_on_interstitial;
	if (diff > -20) {
		return;
	}
	spinPage();
	start_on_interstitial = null;
});

// 處理滑鼠事件並轉換為觸控事件
TenMaxCards.addEventListener('mousedown', (e) => {
  e.preventDefault();
  x = e.x;
  y = e.y;
  simulateTouch(TenMaxCards, e, 'touchstart');
});

TenMaxCards.addEventListener('mousemove', (e) => {
  if (e.buttons === 1) { // 只有在滑鼠按下時觸發
    e.preventDefault();
    simulateTouch(TenMaxCards, e, 'touchmove');
  }
});

TenMaxCards.addEventListener('mouseup', (e) => {
  e.preventDefault();
  simulateTouch(TenMaxCards, e, 'touchend');
})

TenMaxCards.addEventListener('click', e => {
  if(
    (Math.abs(e.x - x) > 20 || Math.abs(e.y - y) > 20)
  ) {
    e.preventDefault();
  }
})

// 防止滑鼠事件影響其他 elements
TenMaxInterstitial.addEventListener('dragstart', (e) => e.preventDefault());

// 處理滑鼠事件並轉換為觸控事件
TenMaxInterstitial.addEventListener('mousedown', (e) => {
  e.preventDefault();
  x = e.x;
  y = e.y;
  simulateTouch(TenMaxInterstitial, e, 'touchstart');
});

TenMaxInterstitial.addEventListener('mousemove', (e) => {
  if (e.buttons === 1) { // 只有在滑鼠按下時觸發
    e.preventDefault();
    simulateTouch(TenMaxInterstitial, e, 'touchmove');
  }
});

TenMaxInterstitial.addEventListener('mouseup', (e) => {
  e.preventDefault();
  simulateTouch(TenMaxInterstitial, e, 'touchend');
})

TenMaxInterstitial.addEventListener('click', e => {
  if(
    (Math.abs(e.x - x) > 20 || Math.abs(e.y - y) > 20)
  ) {
    e.preventDefault();
  }
})

// 防止滑鼠事件影響其他 elements
TenMaxInterstitial.addEventListener('dragstart', (e) => e.preventDefault());

function openInterstitial() {
	TenMaxInterstitial.classList.add('show');
	TenMaxCloseBtn.classList.add('show');
	pageBody.classList.add('block');
}

function closeInterstitial() {
	TenMaxInterstitial.classList.remove('show');
	TenMaxCloseBtn.classList.remove('show');
	pageBody.classList.remove('block');
}

function showContainer() {
  setTracker(TenMaxTemplate);
  intersectionObserver.observe(TenMaxTemplate);
}

function setTracker(TenMaxTemplate) {
  let href = window.location.href;
  let blob = 'tenmaxsgstatic.blob.core.windows.net/ssp/H5_Creative_Advertising';
  let cdn = 'tenmax-static.cacafly.net/ssp/H5_Creative_Advertising';
  if (href.indexOf(blob) != -1 || href.indexOf(cdn) != -1) {
    TenMaxCards.setAttribute('href', TenMaxLink);
    TenMaxInterstitial.setAttribute('href', TenMaxLink);
  } else {
    TenMaxCards.setAttribute('href', clickUrl + encodeURIComponent(TenMaxLink));
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

async function startRolling() {
  await wait(PAUSE);
  while (!stopRolling) {
    await spinPage();
    await wait(PAUSE);
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
    target.addEventListener('animationend', resolve, {once: true});
  });
}

function fadeOut(target) {
  return new Promise((resolve, reject) => {
    target.classList.replace('current', 'out');
    target.addEventListener('animationend', () => {
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
}

let isLoaded = performance.getEntriesByType('navigation').every((e) => e.loadEventEnd);
let TenMaxInit = function () {
  safariHacks();
  showContainer();
};

if (isLoaded) {
  TenMaxInit();
} else {
  window.onload = TenMaxInit;
};

