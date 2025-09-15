var TenMaxScript = document.querySelector('#calendarImgE_SHOPJs');
var TenMaxLink = 'https://bmai.app/7pu9vr';
var iOSCalendar = 'https://bmai.app/7pu9vr';
var androidCalendar = 'https://bmai.app/7pu9vr';
var clickUrl = TenMaxScript.dataset.clickUrl;
var viewableUrl = TenMaxScript.dataset.viewableUrl;
var SSPviewableUrl = TenMaxScript.dataset.sspviewableUrl;
var ADXviewableUrl = TenMaxScript.dataset.adxviewableUrl;
var TenMaxCreativeId = TenMaxScript.dataset.creativeId;
var TenMaxCampaignId = TenMaxScript.dataset.campaignId;

let TenMaxTemplate = document.querySelector("#calendarImgE_SHOP");
let TenMaxInterstitial = TenMaxTemplate.querySelector(".TenMaxInterstitial");
let TenMaxBannerBundle = TenMaxTemplate.querySelector(".TenMaxBannerBundle");
let TenMaxCloseBtn = TenMaxTemplate.querySelector(".TenMaxCloseBtn");
let kindsOfMobile = {
  Android: function() {
      return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function() {
      return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function() {
      return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function() {
      return navigator.userAgent.match(/IEMobile/i);
  },
  any: function() {
      return (kindsOfMobile.Android() || kindsOfMobile.BlackBerry() || kindsOfMobile.iOS() || kindsOfMobile.Opera() || kindsOfMobile.Windows());
  }
};
let urlOrigin = window.location.origin;
let targetZIndex = zindexDomain(urlOrigin);
function zindexDomain(url) {
  try {
      let hostname = new URL(url).hostname;
      if (hostname.includes('ctee.com.tw')) {
          return 2147483646;
      }
      if (hostname.includes('ctinews.com')) {
          return 2147483646;  
      }
      if (hostname.includes('udn.com')) {
          return 35;
      }
      

      return 2147483647;
  } catch (error) {
      console.error('Error parsing URL:', error);
      return 2147483647; 
  }
}

TenMaxTemplate.style.zIndex = targetZIndex;


// TenMaxBannerBundle.addEventListener("click", () => {
//   if (kindsOfMobile.any()[0] == "iPhone") {
//     // window.open("https://calndr.link/e/WyAW8g3YRb?s=apple", "iOSCalendar");
//     setTimeout(() => {
//       window.open("https://calndr.link/e/WyAW8g3YRb?s=apple", "iOSCalendar");
//       // window.open(TenMaxLink, "landingPage");
//     }, 2000);
//   } else {
//     // window.open("https://calndr.link/e/WyAW8g3YRb?s=google", "androidCalendar");
//     setTimeout(() => {
//       window.open("https://calndr.link/e/WyAW8g3YRb?s=google", "androidCalendar");
//       // window.open(TenMaxLink);
//     }, 2000);
//   }
// });

TenMaxCloseBtn.addEventListener("click", function (e) {
  e.preventDefault();
  e.stopPropagation();
  TenMaxTemplate.classList.remove('show');
});


function showContainer() {
  TenMaxTemplate.classList.add('show');
  TenMaxBannerBundle.querySelectorAll('.list').forEach(e => e.classList.add('is-play'));
  startCountDown();
  setTracker(TenMaxTemplate);
}

function setTracker(template) {
  let href = window.location.href;
  let blob = 'tenmaxsgstatic.blob.core.windows.net/ssp/H5_Creative_Advertising';
  let cdn = 'tenmax-static.cacafly.net/ssp/H5_Creative_Advertising';
  if (href.indexOf(blob) != -1 || href.indexOf(cdn) != -1) {
    TenMaxBannerBundle.setAttribute('href', TenMaxLink);
    if (kindsOfMobile.any() != null && kindsOfMobile.any()[0] == "iPhone") {
      TenMaxBannerBundle.setAttribute('href', iOSCalendar);
    } else {
      TenMaxBannerBundle.setAttribute('href', androidCalendar);
    }
  } else {
    TenMaxBannerBundle.setAttribute('href', clickUrl + encodeURIComponent(TenMaxLink));
    if (kindsOfMobile.any() != null && kindsOfMobile.any()[0] == "iPhone") {
      TenMaxBannerBundle.setAttribute('href', clickUrl + encodeURIComponent(iOSCalendar));
    } else {
      TenMaxBannerBundle.setAttribute('href', clickUrl + encodeURIComponent(androidCalendar));
    }
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

async function startCountDown() {
  let diffTime = (() => {
    let endTime = (new Date(2025, 5, 23, 0, 0)).getTime(); // 月份(從 0 開始算)
    return function diffTime() {
      let offsetTime = parseInt((endTime - Date.now()) / 1000);
      let sec = offsetTime % 60;
      let min = parseInt(offsetTime / 60) % 60;
      let hr = parseInt(offsetTime / 60 / 60) % 24;
      let day = parseInt(offsetTime / 60 / 60 / 24);
      return [day, hr, min, sec];
    };
  })();
  await preStageAnime(diffTime());
  while(true) {
    refreshTimer(diffTime());
    await wait(1);
  }
}

function refreshTimer([day, hr, min, sec]) {
  let countDownDay = TenMaxBannerBundle.querySelector(".dayList");
  let countDownHr = TenMaxBannerBundle.querySelector(".hrList");
  let countDownMin = TenMaxBannerBundle.querySelector(".minList");
  let countDownSec = TenMaxBannerBundle.querySelector(".secList");
  countDownDay.innerText = day.toString().padStart(2, '0');
  countDownHr.innerText = hr.toString().padStart(2, '0');
  countDownMin.innerText = min.toString().padStart(2, '0');
  countDownSec.innerText = sec.toString().padStart(2, '0');
}

async function preStageAnime([day, hr, min, sec]) {
  const PAUSE = .5;
  const DELAY = 1;
  let val = [day, hr, min, ((sec - 5 + 60) % 60)];
  await wait(DELAY);
  for (let i = 0; i < 4; i++) {
    let current = listArr[i];
    let value = val[i];
    await wait(PAUSE);
    await whosTurn(current, value);
  }
  for (let i = 0; i < 4; i++) {
    TenMaxTemplate.querySelector(`.${listArr[i]}`).style.transform = "translateY(0)";
  }
}

function wait(sec) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, sec * 1000);
  });
}

function whosTurn(target, value) {
  return new Promise((resolve, reject) => {
    let you = TenMaxTemplate.querySelector(`.${target}`);
    stopAnimation(you, value);
    resolve();
  });
}

let listArr = ['dayList', 'hrList', 'minList', 'secList'];
function createNum(target) {
  let numLocation;
  let slot = document.querySelector(`.${target}`);
  if(target == "hrList") {
    for (let i = 0; i < 24; i ++) {
      numLocation = document.createElement("span");
      numLocation.innerText = i < 10 ? `0${i}` : i;
      numLocation.classList.add("num");
      slot.appendChild(numLocation);
    }
  } else {
    for (let i = 0; i < 60; i ++) {
      numLocation = document.createElement("span");
      numLocation.innerText = i < 10 ? `0${i}` : i;
      numLocation.classList.add("num");
      slot.appendChild(numLocation);
    }
  }
}

function stopAnimation(target, index) {
  target.classList.remove("is-play");
  target.style.transform = `translateY(${(index) * -(100 / target.childElementCount)}%)`;
}
function safariHacks() {
  let windowsVH = window.innerHeight / 100;
  TenMaxTemplate.style.setProperty("--vh", windowsVH + "px");
  TenMaxInterstitial.classList.add("show");
}

let isLoaded = performance.getEntriesByType("navigation").every((e) => e.loadEventEnd);
let init = function () {
  safariHacks();
  for(let target of listArr) {
    createNum(target);
  }
  setTimeout(function() {
    showContainer();
    TenMaxInterstitial.setAttribute("style", "display:none !important");
  }, 3000);
};

if (isLoaded) {
  init();
} else {
  window.onload = init;
};