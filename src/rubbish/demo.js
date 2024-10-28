// @id demo
// @description This is a demo loader script
// @hidden

var asset = loader.asset;
var adcode = loader.adcode;
var util = loader.util;

// interact & container installed -> install space
// space displayed -> show
var container;

var scrolled$ = util.onScroll$();

var containerInstalled$ = asset.get$('demo/template.html')
  .then(function(template) {
    // TODO: enhance util or asset API
    var html = template.replace('{{asset.basePath}}', asset.basePath);
    document.body.insertAdjacentHTML('beforeend', html);

    // save element as variable
    container = document.querySelector('#demo-space-panel');

    // wire up close event
    container.querySelector('.close-btn').addEventListener('click', closeContainer);
  });

function installSpace() {
  // create ins element
  var ins = adcode.createIns();

  // hook space display
  adcode.onSpaceCreate(ins, function(space) {
    space.on('display', function(ad) {
      // ad === undefined means no ad
      if (ad) {
        showContainer();
      }
    });
  });

  // append ins to DOM
  container.querySelector('.ad').appendChild(ins);

  // install acdode
  adcode.install({
    cdn: false,
    env: 'stage',
    dev: true
  });
}

function showContainer() {
  container.classList.add('show');
}

function closeContainer() {
  container.classList.add('close');
}

// main flow
Promise.all([scrolled$, containerInstalled$])
  .then(installSpace);
