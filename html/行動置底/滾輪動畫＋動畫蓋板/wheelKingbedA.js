var TenMaxScript = document.querySelector("#wheelKingbedAJs");
var TenMaxLink = "https://reurl.cc/A649be";
var clickUrl = TenMaxScript.dataset.clickUrl;
var viewableUrl = TenMaxScript.dataset.viewableUrl;
var SSPviewableUrl = TenMaxScript.dataset.sspviewableUrl;
var ADXviewableUrl = TenMaxScript.dataset.adxviewableUrl;

let TenMaxTemplate = document.querySelector("#wheelKingbedA");
let TenMaxInterstitial = TenMaxTemplate.querySelector(".TenMaxInterstitial");
let TenMaxBannerBundle = TenMaxTemplate.querySelector(".TenMaxBannerBundle");
let TenMaxCloseBtn = TenMaxTemplate.querySelector(".TenMaxCloseBtn");

TenMaxCloseBtn.addEventListener("click", function (e) {
  e.preventDefault();
  TenMaxTemplate.classList.remove("show");
});

function showContainer() {
  TenMaxTemplate.classList.add("show");
  setTracker(TenMaxTemplate);
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

function safariHacks() {
  let windowsVH = window.innerHeight / 100;
  TenMaxTemplate.style.setProperty("--vh", windowsVH + "px");
  window.addEventListener("resize", function () {
    TenMaxTemplate.style.setProperty("--vh", windowsVH + "px");
  });
  TenMaxInterstitial.classList.add("show");
}

let isLoaded = performance.getEntriesByType("navigation").every((e) => e.loadEventEnd);
let TenMaxInit = function () {
  safariHacks();
  TenMaxInterstitial.addEventListener("animationend", function(event) {
    if (TenMaxInterstitial != event.target) {
      return;
    }
    showContainer();
  });
};

if (isLoaded) {
  TenMaxInit();
} else {
  window.onload = TenMaxInit;
}
