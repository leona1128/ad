//增加判斷螢幕寬度改變時要再重新檢查遮罩寬高
var asset = loader.asset;
var adcode = loader.adcode;
var util = loader.util;
const containerId = 'TenMax_sticky';
var container, closeBtn;
var draggableOverlay; 
var scrolled$ = util.onScroll$();
var args = loader.args || {};

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

    draggableOverlay = new DraggableOverlay(container, {
        dragWidth: args.dragWidth || 40,
        minClickableSize: args.minClickableSize || 80,
        overlayColor: args.overlayColor || 'rgba(0, 0, 0, 0.5)',
        enableDrag: args.enableDrag !== false
    });

    closeBtn = container.querySelector('#close-btn');
    closeBtn.addEventListener('click', closeContainer);

    if (args.enableDrag !== false) {
        container.style.position = 'fixed';
        container.style.cursor = 'grab';
        
        container.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);
        
        container.addEventListener('touchstart', dragStart);
 
        container.addEventListener('touchmove', function(e) {
            if (isDragging) {
                e.preventDefault();
                e.stopPropagation();
                drag(e);
            }
        }, { passive: false });
        container.addEventListener('touchend', dragEnd);
    
    } else {
        container.style.cursor = 'grab';
        container.style.position = 'fixed';
    }

    args.closeBtnColor ? container.style.setProperty("--closeBtnColor", args.closeBtnColor) : false;

    var bottomConceal;
    var topConceal;
    if (args.bottomShow == 'auto'){
        topConceal = window.innerHeight - (args.bottomConceal ? parseInt(args.bottomConceal): -500) + 'px';
        bottomConceal = 'auto';
    } else {
        topConceal = 'auto';
        bottomConceal = (parseInt(args.bottomConceal) - 500) + 'px';
    }

    args.bottomConceal ? container.style.setProperty("--bottomConceal", bottomConceal) : false;
    container.style.setProperty("--topConceal", topConceal);
    args.bottomShow ? container.style.setProperty("--bottomShow", args.bottomShow) : false;
    args.topShow ? container.style.setProperty("--topShow", args.topShow) : false;
    args.rightPosition ? container.style.setProperty("--rightPosition", args.rightPosition) : false;
    args.leftPosition ? container.style.setProperty("--leftPosition", args.leftPosition) : false;
    args.zIndex ? container.style.setProperty("--zIndex", args.zIndex) : false;
    requestAnimationFrame(() => {
        draggableOverlay = new DraggableOverlay(container, {
            dragWidth: args.dragWidth || 40,
            minClickableSize: args.minClickableSize || 80,
            overlayColor: args.overlayColor || 'rgba(0, 0, 0, 0.5)',
            enableDrag: args.enableDrag !== false
        });
    });
});

class DraggableOverlay {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            dragWidth: options.dragWidth || 40,          
            minClickableSize: options.minClickableSize || 80,  
            overlayColor: options.overlayColor || 'rgba(0, 0, 0, 0.5)',  
            enableDrag: options.enableDrag,
            ...options
        };
        this.initializeResizeObserver();
        
       
    }
    initializeResizeObserver() {
        this.resizeObserver = new ResizeObserver((entries) => {
            // 使用 requestAnimationFrame 來確保 DOM 更新完成
            requestAnimationFrame(() => {
                for (const entry of entries) {
                    // 使用 getBoundingClientRect 來獲取實際大小
                    const rect = this.container.getBoundingClientRect();
                    if (rect.width > 0 && rect.height > 0) {
                        // 先移除現有遮罩
                        this.removeExistingOverlays();
                        // 使用實際大小初始化
                        this.initialize(rect.width, rect.height);
                    }
                }
            });
        });

        // 開始觀察容器
        this.resizeObserver.observe(this.container);
        
        // 初始化檢查
        const rect = this.container.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
            this.initialize(rect.width, rect.height);
        }
    }

    removeExistingOverlays() {
        const overlays = this.container.querySelectorAll('.overlay-handle');
        overlays.forEach(overlay => overlay.remove());
    }

    

    checkContainerSize() {
        const rect = this.container.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(this.container);
        
        const width = rect.width || 
                    this.container.offsetWidth || 
                    parseInt(computedStyle.width) || 
                    parseInt(this.container.style.width) || 0;
                     
        const height = rect.height || 
                    this.container.offsetHeight || 
                    parseInt(computedStyle.height) || 
                    parseInt(this.container.style.height) || 0;

        if (width > 0 && height > 0) {
            this.initialize(width, height);
            return true;
        }
        return false;
    }

    initialize(containerWidth, containerHeight) {
        if (!this.options.enableDrag) {
            this.removeExistingOverlays();
            this.container.style.cursor = 'grab';
            this.container.style.position = 'fixed';
            return;
        }

        const {
            dragSizeWidth,
            dragSizeHeight,
            offsetLeftRight,
            offsetTopBottom
        } = this.calculateDragArea(containerWidth, containerHeight);
        
        this.createOverlays({
            dragSizeWidth,
            dragSizeHeight,
            offsetLeftRight,
            offsetTopBottom,
            containerWidth,
            containerHeight
        });
        
        this.setupContainer();
    }

    calculateDragArea(containerWidth, containerHeight) {
        const { dragWidth, minClickableSize } = this.options;
        let offsetLeftRight = 0;
        let offsetTopBottom = 0;
        
        // 計算有效的最小可點擊區域
        const effectiveMinClickable = Math.min(
            Math.min(containerWidth, containerHeight),
            minClickableSize
        );

        // 確保拖曳區域不會小於有效最小區域
        if (containerWidth - (2 * dragWidth) < effectiveMinClickable) {
            offsetLeftRight = Math.max(0, (effectiveMinClickable - containerWidth + (2 * dragWidth)) / 2);
        }
        const dragSizeWidth = containerWidth + (2 * offsetLeftRight);

        if (containerHeight - (2 * dragWidth) < effectiveMinClickable) {
            offsetTopBottom = Math.max(0, (effectiveMinClickable - containerHeight + (2 * dragWidth)) / 2);
        }
        const dragSizeHeight = containerHeight + (2 * offsetTopBottom);

        return {
            dragSizeWidth,
            dragSizeHeight,
            offsetLeftRight,
            offsetTopBottom
        };
    }
    createOverlays({ dragSizeWidth, dragSizeHeight, offsetLeftRight, offsetTopBottom }) {
        this.removeExistingOverlays();
        if (!this.options.enableDrag) {
            return;
        }

        const overlayDefinitions = [
            {
                class: 'overlay-handle-top',
                style: {
                    top: `-${offsetTopBottom}px`,
                    left: `-${offsetLeftRight}px`,
                    width: `${dragSizeWidth}px`,
                    height: `${this.options.dragWidth}px`
                }
            },
            {
                class: 'overlay-handle-bottom',
                style: {
                    bottom: `-${offsetTopBottom}px`,
                    left: `-${offsetLeftRight}px`,
                    width: `${dragSizeWidth}px`,
                    height: `${this.options.dragWidth}px`
                }
            },
            {
                class: 'overlay-handle-left',
                style: {
                    top: `-${offsetTopBottom}px`,
                    left: `-${offsetLeftRight}px`,
                    width: `${this.options.dragWidth}px`,
                    height: `${dragSizeHeight}px`
                }
            },
            {
                class: 'overlay-handle-right',
                style: {
                    top: `-${offsetTopBottom}px`,
                    right: `-${offsetLeftRight}px`,
                    width: `${this.options.dragWidth}px`,
                    height: `${dragSizeHeight}px`
                }
            }
        ];

        overlayDefinitions.forEach(({ class: className, style }) => {
            const overlay = document.createElement('div');
            overlay.className = `overlay-handle ${className}`;
            
            Object.assign(overlay.style, {
                position: 'absolute',
                backgroundColor: this.options.overlayColor,
                cursor: this.options.enableDrag ? 'grab' : 'move',
                pointerEvents: 'auto',
                zIndex: 1000,
                ...style
            });

            this.container.appendChild(overlay);
        });
    }

    setupContainer() {
            if (!this.container) return;
            
            Object.assign(this.container.style, {
                position: this.options.enableDrag ? 'fixed' : 'relative',
                overflow: 'visible',
                cursor: this.options.enableDrag ? 'grab' : 'default'
            });
        }

destroy() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        this.removeExistingOverlays();
    }
}

function dragStart(e) {
    if (args.enableDrag === false) {
        return;
    }
    
    if (e.type === "touchstart") {
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

function drag(e) {
   
    if (args.enableDrag === false || !isDragging) {
        return;
    }
   

    e.preventDefault();
    e.stopPropagation();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;

    if (e.type === "touchmove") {
        currentX = e.touches[0].clientX - initialX;
        currentY = e.touches[0].clientY - initialY;
    } else {
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
    }

    function parseValue(value) {
        if (!value || value === 'auto') return 'auto';
        return parseInt(value.toString().replace('px', ''));
    }

    const bottomShow = parseValue(args.bottomShow);
    const topShow = parseValue(args.topShow);
    const rightPosition = parseValue(args.rightPosition);
    const leftPosition = parseValue(args.leftPosition);

    let maxMoveRight = rightPosition === 'auto' ? windowWidth - containerWidth : rightPosition;
    let maxMoveLeft = leftPosition === 'auto' ? -(windowWidth - containerWidth) : -leftPosition;
    let maxMoveTop = topShow === 'auto' ? -(windowHeight - containerHeight) : -topShow;
    let maxMoveBottom = bottomShow === 'auto' ? windowHeight - containerHeight : bottomShow;

    currentX = Math.min(maxMoveRight, Math.max(maxMoveLeft, currentX));
    currentY = Math.min(maxMoveBottom, Math.max(maxMoveTop, currentY));
    

    xOffset = currentX;
    yOffset = currentY;

    container.style.transform = `translate(${currentX}px, ${currentY}px)`;
}

function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
}

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
    closeBtn.style.cursor= 'default';
    closeBtn.classList.remove('conceal');
    if (autoClose) {
        autoCloseTimeoutId = setTimeout(closeContainer, (autoCloseTime * 1000));
    }
    if (draggableOverlay) {
        draggableOverlay.initialize();
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
    if (draggableOverlay) { 
        draggableOverlay.destroy(); 
        draggableOverlay = null;
    }
}

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

window.addEventListener('resize', function() {
    if (!isDragging && container && draggableOverlay) {
        
    }
});

Promise.all([containerInstalled$])
    .then(installSpace);