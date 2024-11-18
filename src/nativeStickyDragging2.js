//刪除註解精簡版
var asset = loader.asset;
var adcode = loader.adcode;
var util = loader.util;
const containerId = 'TenMax_sticky';


var container, closeBtn;
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

    const draggableOverlay = new DraggableOverlay(container, {
        dragWidth: args.dragWidth || 40,
        minClickableSize: args.minClickableSize || 80,
        overlayColor: args.overlayColor || 'rgba(0, 0, 0, 0.5)',
        enableDrag: args.enableDrag !== false
    });

    closeBtn = container.querySelector('#close-btn');
    closeBtn.addEventListener('click', closeContainer);

    if (args.enableDrag !== false) {
        container.style.position = 'fixed';
        container.style.cursor = 'move';
        
        container.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);
        
        container.addEventListener('touchstart', dragStart);
        document.addEventListener('touchmove', drag);
        document.addEventListener('touchend', dragEnd);
    } else {
        container.style.cursor = 'default';
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
        
        this.waitForContainerSize();
    }

    waitForContainerSize() {
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                if (width > 0 && height > 0) {
                    this.initialize(width, height);
                }
            }
        });

        resizeObserver.observe(this.container);
        this.checkContainerSize();
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
        if (this.options.enableDrag) {
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
                offsetTopBottom
            });
        } else {
            this.container.querySelectorAll('.overlay-handle').forEach(el => el.remove());
            this.container.style.cursor = 'default';
            this.container.style.position = 'fixed';
            return;
        }
        
        this.setupContainer();
    }

    calculateDragArea(containerWidth, containerHeight) {
        const { dragWidth, minClickableSize } = this.options;
        let offsetLeftRight = 0;
        let offsetTopBottom = 0;
        let dragSizeWidth;
        let dragSizeHeight;
        
        const effectiveMinClickable = Math.min(
            Math.min(containerWidth, containerHeight),
            minClickableSize
        );

        if (containerWidth - (2 * dragWidth) < effectiveMinClickable) {
            offsetLeftRight = Math.max(0, dragWidth - (containerWidth - effectiveMinClickable) / 2);
            dragSizeWidth = containerWidth + (offsetLeftRight * 2);
        } else {
            offsetLeftRight = 0;
            dragSizeWidth = containerWidth;
        }

        if (containerHeight - (2 * dragWidth) < effectiveMinClickable) {
            offsetTopBottom = Math.max(0, dragWidth - (containerHeight - effectiveMinClickable) / 2);
            dragSizeHeight = containerHeight + (offsetTopBottom * 2);
        } else {
            offsetTopBottom = 0;
            dragSizeHeight = containerHeight;
        }

        return {
            dragSizeWidth,
            dragSizeHeight,
            offsetLeftRight,
            offsetTopBottom
        };
    }

    createOverlays({ dragSizeWidth, dragSizeHeight, offsetLeftRight, offsetTopBottom }) {
        this.container.querySelectorAll('.overlay-handle').forEach(el => el.remove());

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
                cursor: this.options.enableDrag ? 'move' : 'default',
                pointerEvents: 'auto',
                zIndex: 1000,
                ...style
            });

            this.container.appendChild(overlay);
        });
    }

    setupContainer() {
        Object.assign(this.container.style, {
            position: 'relative',
            overflow: 'visible',
            cursor: this.options.enableDrag ? 'move' : 'default'
        });
    }
}

function dragStart(e) {
    if (args.enableDrag === false) {
        return;
    }
    
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

function drag(e) {
   
    if (args.enableDrag === false || !isDragging) {
        return;
    }
   
   
    e.preventDefault();
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
    closeBtn.classList.remove('conceal');
    if (autoClose) {
        autoCloseTimeoutId = setTimeout(closeContainer, (autoCloseTime * 1000));
    }
    draggableOverlay.initialize();
}

function closeContainer() {
    if(autoCloseTimeoutId != undefined){
        clearTimeout(autoCloseTimeoutId);
    }
    container.classList.remove('show');
    container.classList.add('conceal');
    xOffset = 0;
    yOffset = 0;
    draggableOverlay.initialize();
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
    if (!isDragging && container) {
        draggableOverlay.initialize();
    }
});

Promise.all([containerInstalled$])
    .then(installSpace);