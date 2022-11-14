var offcanvas = (function () {
  'use strict';

  function isWindow(obj) {
    return obj != null && obj === obj.window;
  }

  function find(selector, context) {
    if (context === void 0) {
      context = null;
    }

    if (selector instanceof HTMLElement || selector instanceof Node || isWindow(selector)) {
      return [selector];
    } else if (selector instanceof NodeList) {
      return [].slice.call(selector);
    } else if (typeof selector === 'string') {
      var startElement = context ? find(context)[0] : document;
      return [].slice.call(startElement.querySelectorAll(selector));
    }

    return [];
  }

  function addClass(selector, cls) {
    if (Array.isArray(selector)) {
      return selector.forEach(function (item) {
        return addClass(item, cls);
      });
    }

    var els = find(selector);

    if (els.length) {
      var clsArray = [].concat(cls);
      els.forEach(function (el) {
        clsArray.forEach(function (item) {
          el.classList.add(item);
        });
      });
      return els;
    }
  }

  function on(selector, event, cb, capture) {
    if (capture === void 0) {
      capture = false;
    }

    if (Array.isArray(selector)) {
      selector.forEach(function (item) {
        return on(item, event, cb, capture);
      });
      return;
    }

    var data = {
      cb: cb,
      capture: capture
    };

    if (!window._domassistevents) {
      window._domassistevents = {};
    }

    window._domassistevents["_" + event] = data;
    var el = find(selector);

    if (el.length) {
      el.forEach(function (item) {
        item.addEventListener(event, cb, capture);
      });
    }
  }

  function removeClass(selector, cls) {
    if (Array.isArray(selector)) {
      return selector.forEach(function (item) {
        return removeClass(item, cls);
      });
    }

    var els = find(selector);

    if (els.length) {
      var clsArray = [].concat(cls);
      els.forEach(function (el) {
        clsArray.forEach(function (item) {
          el.classList.remove(item);
        });
      });
      return els;
    }
  }

  var setupReady = function setupReady(callbacks) {
    return function (callback) {
      callbacks.push(callback);

      function execute() {
        while (callbacks.length) {
          var fn = callbacks.shift();

          if (typeof fn === 'function') {
            fn();
          }
        }
      }

      function loaded() {
        document.removeEventListener('DOMContentLoaded', loaded);
        execute();
      }

      setTimeout(function () {
        if (document.readyState !== 'loading') {
          return execute();
        }
      }, 0);
      document.addEventListener('DOMContentLoaded', loaded);
    };
  };

  var ready = setupReady([]);

  var CLASSES = {
    OVERLAY: 'offcanvas-overlay',
    VISIBLE: 'visible',
    OPEN: 'open',
    LOCK_OVERFLOW: 'offcanvas-is-open',
    READY: 'offcanvas-ready'
  };
  var SELECTORS = {
    CANVAS: '[data-offcanvas]',
    FIXED: '[data-offcanvas-fixed]'
  };

  var OffCanvas = /*#__PURE__*/function () {
    function OffCanvas(options) {
      this.name = options.name;
      this.el = options.el;
      this.options = options;
      this.visible = false;
      this.boundSetup = this.setup.bind(this);
      this.boundToggle = this.toggle.bind(this);
      this.boundHide = this.hide.bind(this);
      this.fixedEl = find(SELECTORS.FIXED);
      this.transitionTime = parseFloat(window.getComputedStyle(this.el).transitionDuration) * 1000;
      this.setup();
      this.setupEvents();
    }

    var _proto = OffCanvas.prototype;

    _proto.setupEvents = function setupEvents() {
      on(window, 'resize', this.boundSetup);
      on(window, 'orientationchange', this.boundSetup);
    };

    _proto.destroy = function destroy() {
      var _this = this;

      this.overlay.removeEventListener('click', this.boundHide);
      this.options.trigger.forEach(function (trigger) {
        return trigger.removeEventListener('click', _this.boundToggle);
      });
      this.overlay.parentNode.removeChild(this.overlay);
      this.overlay = null;
      this.initialized = false;
    };

    _proto.setup = function setup() {
      if (this.options.match && !window.matchMedia(this.options.match).matches) {
        if (this.initialized) {
          this.destroy();
        }

        return;
      }

      if (this.initialized) {
        return;
      }

      this.initialized = true; // Setting some default id for ARIA to work

      if (!this.el.id) {
        this.el.id = "offcanvas-" + this.name;
      }

      this.updateAria(); // Creating overlay

      this.setupOverlay(); // Setting up the rest

      this.setupTriggers(this.options.trigger); // Making it ready to fix browser issues

      setTimeout(function () {
        addClass(document.body, CLASSES.READY);
      }, this.transitionTime);
    };

    _proto.setupOverlay = function setupOverlay() {
      if (!this.overlay) {
        this.overlay = document.createElement('div');
        addClass(this.overlay, CLASSES.OVERLAY);
        document.body.appendChild(this.overlay);
        this.overlay.addEventListener('click', this.boundHide);
      }
    };

    _proto.setupTriggers = function setupTriggers(els) {
      var _this2 = this;

      els.forEach(function (el) {
        el.addEventListener('click', _this2.boundToggle);
        el.setAttribute('aria-controls', _this2.el.id);
      });
    };

    _proto.updateAria = function updateAria() {
      var _this3 = this;

      this.options.trigger.forEach(function (trigger) {
        trigger.setAttribute('aria-expanded', "" + _this3.visible);
      });
      this.el.setAttribute('aria-hidden', "" + !this.visible);
    };

    _proto.show = function show() {
      if (this.visible) {
        return;
      }

      this.visible = true;
      addClass(this.el, CLASSES.OPEN);
      addClass(this.overlay, CLASSES.VISIBLE);
      addClass(document.body, CLASSES.LOCK_OVERFLOW);

      if (this.fixedEl) {
        this.fixedEl.forEach(function (el) {
          el.style.top = (document.documentElement.scrollTop || document.body.scrollTop) + "px";
        });
      }

      this.updateAria();
    };

    _proto.hide = function hide() {
      var _this4 = this;

      if (!this.visible) {
        return;
      }

      this.visible = false;
      removeClass(this.el, CLASSES.OPEN);
      removeClass(this.overlay, CLASSES.VISIBLE);
      removeClass(document.body, CLASSES.LOCK_OVERFLOW);

      if (this.fixedEl) {
        setTimeout(function () {
          _this4.fixedEl.forEach(function (el) {
            el.style.top = '';
          });
        }, this.transitionTime);
      }

      this.updateAria();
    };

    _proto.toggle = function toggle() {
      if (!this.visible) {
        this.show();
      } else {
        this.hide();
      }
    };

    return OffCanvas;
  }();

  OffCanvas.autoLoad = true;
  ready(function () {
    if (OffCanvas.autoLoad === false) {
      return;
    }

    find(SELECTORS.CANVAS).forEach(function (el) {
      var name = el.getAttribute('data-offcanvas');
      new OffCanvas({
        name: name,
        el: el,
        trigger: find("[data-offcanvas-trigger=\"" + name + "\"]"),
        match: el.getAttribute('data-offcanvas-match')
      });
    });
  });

  return OffCanvas;

}());
//# sourceMappingURL=offcanvas.bundle.js.map
