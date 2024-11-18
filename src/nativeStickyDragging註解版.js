// @id nativeSticky完成，有註解

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
      position: fixed;
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
    overlay.addEventListener('click', function() {
      overlay.style.display = 'none';
    });


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
    console.log('dragStart event triggered', {
        type: e.type,
        target: e.target,
        isTargetContainer: e.target == container,
        isTargetDescendant: container.contains(e.target)
    });
    if (e.type == "touchstart") {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
    } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
    }

    if (container.contains(e.target)) {
        isDragging = true;
        console.log('Dragging started, isDragging set to true');
    }onsole.log('Dragging started, isDragging set to true');
    
}

// 拖曳中
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
    if(autoCloseTimeoutId != undefined){// @id nativeSticky  最後修改偵測參數

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
        
            const draggableOverlay = new DraggableOverlay(container, {
                dragWidth: args.dragWidth || 40,
                minClickableSize: args.minClickableSize || 80,
                overlayColor: args.overlayColor || 'rgba(0, 0, 0, 0.5)',
                enableDrag: args.enableDrag !== false
            });
            
        
        
            console.log('Container element:', container); // 檢查 container 元素是否存在
            console.log('Container ID:', container ? container.id : 'not found');
            console.log('Container classes:', container ? container.className : 'not found');
        
            closeBtn = container.querySelector('#close-btn');
            closeBtn.addEventListener('click', closeContainer);
        
            if (args.enableDrag !== false) {
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
            }else {
                // 如果禁用拖曳，移除所有相關事件監聽器
                container.style.cursor = 'default';
                container.removeEventListener('mousedown', dragStart);
                document.removeEventListener('mousemove', drag);
                document.removeEventListener('mouseup', dragEnd);
                container.removeEventListener('touchstart', dragStart);
                document.removeEventListener('touchmove', drag);
                document.removeEventListener('touchend', dragEnd);
            }
            
        
            // 原有的樣式設定
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
                
                // 等待容器尺寸可用後再初始化
                this.waitForContainerSize();
            }
        
            waitForContainerSize() {
                // 使用 ResizeObserver 監聽容器尺寸變化
                const resizeObserver = new ResizeObserver((entries) => {
                    for (const entry of entries) {
                        const { width, height } = entry.contentRect;
                        
                        // 確保容器有實際尺寸
                        if (width > 0 && height > 0) {
                            console.log('Container size detected:', { width, height });
                            this.initialize(width, height);
                            // 如果不需要持續監聽，可以在這裡斷開觀察
                            // resizeObserver.disconnect();
                        }
                    }
                });
        
                // 開始觀察容器
                resizeObserver.observe(this.container);
        
                // 同時也檢查 DOM 是否已經有尺寸
                this.checkContainerSize();
            }
        
            checkContainerSize() {
                // 取得容器的實際尺寸
                const rect = this.container.getBoundingClientRect();
                const computedStyle = window.getComputedStyle(this.container);
                
                // 嘗試從不同來源獲取尺寸
                const width = rect.width || 
                             this.container.offsetWidth || 
                             parseInt(computedStyle.width) || 
                             parseInt(this.container.style.width) || 0;
                             
                const height = rect.height || 
                              this.container.offsetHeight || 
                              parseInt(computedStyle.height) || 
                              parseInt(this.container.style.height) || 0;
        
                console.log('Container measurements:', {
                    getBoundingClientRect: rect,
                    offsetDimensions: {
                        width: this.container.offsetWidth,
                        height: this.container.offsetHeight
                    },
                    computedStyle: {
                        width: computedStyle.width,
                        height: computedStyle.height
                    },
                    inlineStyle: {
                        width: this.container.style.width,
                        height: this.container.style.height
                    }
                });
        
                if (width > 0 && height > 0) {
                    console.log('Initial size available:', { width, height });
                    this.initialize(width, height);// 這裡把寬高傳入 initialize＝containerWidth/containerHeight
                    return true;
                }
                return false;
            }
        
            initialize(containerWidth, containerHeight) {
                console.log('Initializing with dimensions:', { containerWidth, containerHeight });
                
                // 如果啟用拖曳功能，才創建遮罩
                if (this.options.enableDrag) {
                    // 計算偏移量和可拖曳區域大小
                    const {
                        dragSizeWidth,
                        dragSizeHeight,
                        offsetLeftRight,
                        offsetTopBottom
                    } = this.calculateDragArea(containerWidth, containerHeight);
                    
                    // 創建遮罩元素
                    this.createOverlays({
                        dragSizeWidth,
                        dragSizeHeight,
                        offsetLeftRight,
                        offsetTopBottom
                    });
                } else {
                    // 如果禁用拖曳功能，移除所有遮罩
                    this.container.querySelectorAll('.overlay-handle').forEach(el => el.remove());
                 
                    if (!this.options.enableDrag) {
                        console.log('Drag disabled - removing overlay and drag cursor');
                        this.container.querySelectorAll('.overlay-handle').forEach(el => el.remove());
                        this.container.style.cursor = 'default';
                        this.container.style.position = 'fixed';  // 保持固定定位
                        return;
                    }
                }
                
                // 設置容器樣式
                this.setupContainer();
            }
        
            calculateDragArea(containerWidth, containerHeight) {
                const { dragWidth, minClickableSize } = this.options;
                let offsetLeftRight = 0;
                let offsetTopBottom = 0;
                let dragSizeWidth;
                let dragSizeHeight;
                
                // 計算最小可點擊區域 //用比較方法來對比最小的可點擊區，使點擊區不會比容器還大
                const effectiveMinClickable = Math.min(
                    Math.min(containerWidth, containerHeight),
                    minClickableSize
                );
        
                // 計算水平方向
                //假設是containerWidth = 100px  dragWidth= 40px minClickableSize = 80px
                //100 - (2 * 40) = 20px
                //20px < effectiveMinClickable(80px)
                if (containerWidth - (2 * dragWidth) < effectiveMinClickable) {
                    //(0, 40 - (100 - 80) / 2)=(0, 40 - 10)Math.max(0, 30)=30
                    offsetLeftRight = Math.max(0, dragWidth - (containerWidth - effectiveMinClickable) / 2);// 偏移的量
                   //Math.max(0, 30)=30,dragSizeWidth = 100 + (30 * 2) = 160px
                    dragSizeWidth = containerWidth + (offsetLeftRight * 2);


                } else {
                    //假設是containerWidth = 200px  dragWidth= 40px minClickableSize = 80px
                    //200 - (2 * 40) = 120px
                //120px > effectiveMinClickable(80px)
                    offsetLeftRight = 0;
                    dragSizeWidth = containerWidth;
                }
        
                // 計算垂直方向
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
                // 移除現有遮罩
                this.container.querySelectorAll('.overlay-handle').forEach(el => el.remove());
        
                // 如果禁用拖曳功能，不創建遮罩
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
        
                // 創建新遮罩
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
        // //簡單小測試
        
        
        
        // 拖曳開始
        function dragStart(e) {
            console.log(`拖曳功能狀態: ${args.enableDrag !== false ? '啟動' : '禁止'}`);
            if (args.enableDrag === false) {
                console.log('禁止拖曳版型：拖曳功能已關閉');
                return;}
                console.log('拖曳版型啟動：開始進行拖曳');
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
            
            if (args.enableDrag === false) {
                return;
            }
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
                draggableOverlay.initialize();
        
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
        const originalShowContainer = showContainer;
        function showContainer() {
            container.classList.remove('conceal');
            container.classList.add('show');
            closeBtn.classList.remove('conceal');
            if (autoClose) {
                autoCloseTimeoutId = setTimeout(closeContainer, (autoCloseTime * 1000));
            }
            draggableOverlay.initialize();
        }
        const originalCloseContainer = closeContainer;
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
    }
    container.classList.remove('show');
    container.classList.add('conceal');
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


