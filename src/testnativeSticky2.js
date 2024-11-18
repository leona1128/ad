// @id nativeSticky  最後修改4

var asset = loader.asset;
var adcode = loader.adcode;
var util = loader.util;
const containerId = 'TenMax_sticky';

var container, closeBtn;
var scrolled$ = util.onScroll$();
var args = loader.args || {};

// 新增拖曳相關變數
let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;

var containerInstalled$ = asset.get$(`demo/${containerId}.html`)
.then(function(template) {
    var html = template.replace('{{asset.basePath}}', asset.basePath);
    document.body.insertAdjacentHTML('afterbegin', html);

    container = document.querySelector(`#${containerId}`);

    overlay = document.createElement('div');
    overlay.className = 'content-overlay';
    overlay.style.cssText = `
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    cursor: pointer;
    `;
    
    // 將遮罩層添加到 content div 中
    const contentDiv = container.querySelector('.content');
    if (contentDiv) {
    contentDiv.insertBefore(overlay, contentDiv.firstChild);
    }

    // 為遮罩層添加點擊事件
    


    console.log('Container element:', container); // 檢查 container 元素是否存在
    console.log('Container ID:', container ? container.id : 'not found');
    console.log('Container classes:', container ? container.className : 'not found');

    closeBtn = container.querySelector('#close-btn');
    closeBtn.addEventListener('click', closeContainer);

    // 設置拖曳相關樣式
    container.style.position = 'fixed';
    container.style.cursor = 'move';
    console.log('Adding drag event listeners to container:', container);
    
    // 添加拖曳事件監聽器
    container.addEventListener('mousedown', function(e) {
        console.log('mousedown event fired on:', e.target);
        dragStart(e);
    });
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
    
    // 觸控設備支援
    container.addEventListener('touchstart', dragStart);
    document.addEventListener('touchmove', drag);
    document.addEventListener('touchend', dragEnd);
    

    // 原有的樣式設定
    args.closeBtnColor ? container.style.setProperty("--closeBtnColor", args.closeBtnColor) : false;

    var bottomConceal;
    var topConceal;
    if (args.bottomShow == 'auto'){
        topConceal = window.innerHeight - (args.bottomConceal ? parseInt(args.bottomConceal): -500) + 'px';
        bottomConceal = 'auto';
    } else {
        topConceal = 'auto';
        bottomConceal = args.bottomConceal;
    }

    args.bottomConceal ? container.style.setProperty("--bottomConceal", bottomConceal) : false;
    container.style.setProperty("--topConceal", topConceal);
    args.bottomShow ? container.style.setProperty("--bottomShow", args.bottomShow) : false;
    args.topShow ? container.style.setProperty("--topShow", args.topShow) : false;
    args.rightPosition ? container.style.setProperty("--rightPosition", args.rightPosition) : false;
    args.leftPosition ? container.style.setProperty("--leftPosition", args.leftPosition) : false;
    args.zIndex ? container.style.setProperty("--zIndex", args.zIndex) : false;
    
});

// 拖曳開始
function dragStart(e) {
    if (e.type == "touchstart") {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
    } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
    }

    if (container.contains(e.target)) {
        isDragging = true;
    }
}

// 拖曳中
function drag(e) {
    if (isDragging) {
        e.preventDefault();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const containerRect = container.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;

        // 獲取當前拖曳位置
        if (e.type === "touchmove") {
            currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
        } else {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
        }

        // 解析設定值，移除 'px' 並轉換為數字
        function parseValue(value) {
            if (!value || value === 'auto') return 'auto';
            return parseInt(value.toString().replace('px', ''));
        }


        const bottomShow = parseValue(args.bottomShow);
        const topShow = parseValue(args.topShow);
        const rightPosition = parseValue(args.rightPosition);
        const leftPosition = parseValue(args.leftPosition);


        let maxMoveRight, maxMoveLeft, maxMoveBottom, maxMoveTop;

        // 計算水平方向邊界
        if (rightPosition === 'auto') {
    
            maxMoveRight = windowWidth - containerWidth;
        } else {
       
            maxMoveRight = rightPosition;
        }

        if (leftPosition === 'auto') {

            maxMoveLeft = -(windowWidth - containerWidth);
        } else {

            maxMoveLeft = -leftPosition;
        }

        // 計算垂直方向邊界
        if (topShow === 'auto') {
    
            maxMoveTop = -(windowHeight - containerHeight);
        } else {
        
            maxMoveTop = -topShow;
        }

        if (bottomShow === 'auto') {
           
            maxMoveBottom = windowWidth - containerWidth;
        } else {
          
            maxMoveBottom = bottomShow;
        }

        // 限制移動範圍
        currentX = Math.min(maxMoveRight, Math.max(maxMoveLeft, currentX));
        currentY = Math.min(maxMoveBottom, Math.max(maxMoveTop, currentY));

        xOffset = currentX;
        yOffset = currentY;

        setTranslate(currentX, currentY, container);

        // 記錄位置和邊界值（用於調試）
        console.log('Current Position and Boundaries:', {
            position: { x: currentX, y: currentY },
            boundaries: {
                right: maxMoveRight,
                left: maxMoveLeft,
                bottom: maxMoveBottom,
                top: maxMoveTop
            },
            settings: {
                bottomShow,
                topShow,
                rightPosition,
                leftPosition
            }
        });
    }
}
// 拖曳結束
function dragEnd(e) {
    console.log('dragEnd event triggered', {
        finalX: currentX,
        finalY: currentY
    });
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
}

// 設置元素位置
function setTranslate(xPos, yPos, el) {
    console.log('Setting new position', {
        xPos,
        yPos,
        element: el
    });
    el.style.transform = `translate(${xPos}px, ${yPos}px)`;
}
window.addEventListener('resize', function() {
    if (!isDragging && container) {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const containerRect = container.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;

    }
});
function logPosition() {
    console.log('Container Position:', {
        x: currentX,
        y: currentY,
        boundaries: getContainerBoundaries(container, args)
    });
}

// 原有的功能函數
function installSpace() {
    let frequency = args.frequency || 60;
    let enableAdFreqRestriction = args.enableAdFreqRestriction != undefined ? args.enableAdFreqRestriction : false;
    var overFrequency = checkLastADTime(getCookieByName("lastTime5")) > frequency;

    if (!enableAdFreqRestriction || overFrequency) {
        var ins = adcode.createIns();
        container.querySelector('.ad').appendChild(ins);
    }

    adcode.onSpaceCreate(ins, function(space) {
        space.on('display', function(ad) {
            if (!ad || !ad.channel.useContainer) {
                return;
            }
            showContainer();

            try {
                document.cookie = "lastTime5=" + Date.now() + ";max-age=" + (frequency * 60) + ";path=/;";
            } catch(e) {
                console.error(e)
            }
        });
    });

    adcode.install({});
}

let autoCloseTime = args.autoCloseTime || 5;
let autoClose = args.autoClose || false;
var autoCloseTimeoutId;

function showContainer() {
    container.classList.remove('conceal');
    container.classList.add('show');
    closeBtn.classList.remove('conceal');
    if (autoClose) {
        autoCloseTimeoutId = setTimeout(closeContainer, (autoCloseTime * 1000));
    }
}

function closeContainer() {
    if(autoCloseTimeoutId != undefined){
        clearTimeout(autoCloseTimeoutId);
    }
    container.classList.remove('show');
    container.classList.add('conceal');
    xOffset = 0;
    yOffset = 0;
    
}

// 其他輔助函數
function checkLastADTime(recordTime) {
    var nowTime = Date.now();
    if (recordTime == undefined) {
        recordTime = 0;
    }
    return (nowTime - recordTime)/1000/60;
}

function parseCookie() {
    var cookieObj = {};
    var cookieAry = document.cookie.split(';');
    for (let c of cookieAry) {
        c = c.trim();
        c = c.split('=');
        cookieObj[c[0]] = c[1];
    }
    return cookieObj;
}

function getCookieByName(name) {
    var value = parseCookie()[name];
    if (value) {
        value = decodeURIComponent(value);
    }
    return value;
}

// 主流程
Promise.all([containerInstalled$])
    .then(installSpace);