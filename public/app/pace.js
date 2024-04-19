/*!
 * pace.js v1.2.4
 * https://github.com/CodeByZach/pace/
 * Licensed MIT © HubSpot, Inc.
 */

(function () {
  var AjaxMonitor,
    Bar,
    DocumentMonitor,
    ElementMonitor,
    ElementTracker,
    EventLagMonitor,
    Evented,
    Events,
    NoTargetError,
    Pace,
    RequestIntercept,
    SOURCE_KEYS,
    Scaler,
    SocketRequestTracker,
    XHRRequestTracker,
    addEventListener,
    animation,
    avgAmplitude,
    bar,
    cancelAnimation,
    cancelAnimationFrame,
    defaultOptions,
    extend,
    extendNative,
    getFromDOM,
    getIntercept,
    handlePushState,
    ignoreStack,
    init,
    now,
    options,
    requestAnimationFrame,
    result,
    runAnimation,
    scalers,
    shouldIgnoreURL,
    shouldTrack,
    source,
    sources,
    uniScaler,
    _WebSocket,
    _XDomainRequest,
    _XMLHttpRequest,
    _i,
    _intercept,
    _len,
    _pushState,
    _ref,
    _ref1,
    _replaceState,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    // child.__super__에 patent.__proto__ 연결
    __extends = function (child, parent) {
      for (var key in parent) {
        if (__hasProp.call(parent, key)) child[key] = parent[key];
      }
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    },
    __indexOf =
      [].indexOf ||
      function (item) {
        for (var i = 0, l = this.length; i < l; i++) {
          if (i in this && this[i] === item) return i;
        }
        return -1;
      },
    __bind = function (fn, me) {
      return function () {
        return fn.apply(me, arguments);
      };
    };

  // debugger;

  defaultOptions = {
    className: '',
    catchupTime: 100,
    initialRate: 0.03,
    minTime: 250,
    ghostTime: 100,
    maxProgressPerFrame: 20,
    easeFactor: 1.25,
    startOnPageLoad: true,
    restartOnPushState: true,
    restartOnRequestAfter: 500,
    target: 'body',
    elements: {
      checkInterval: 100,
      selectors: ['body'],
    },
    eventLag: {
      minSamples: 10,
      sampleCount: 3,
      lagThreshold: 3,
    },
    ajax: {
      trackMethods: ['GET'],
      trackWebSockets: true,
      ignoreURLs: [],
    },
  };

  // null이 아닌 _ref 또는 new Date를 반환
  now = function () {
    var _ref;
    // performance API(Web API) : window.performance
    // performance.now() : It represents the time elapsed since Performance.timeOrigin (the time when navigation has started in window contexts, or the time when the worker is run in Worker and ServiceWorker contexts).
    return (_ref =
      typeof performance !== 'undefined' && performance !== null
        ? typeof performance.now === 'function'
          ? performance.now()
          : void 0
        : void 0) != null
      ? _ref
      : +new Date();
  };

  requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

  cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

  // obj에 이벤트리스너를 등록하는 함수
  addEventListener = function (obj, event, callback) {
    if (typeof obj.addEventListener === 'function') {
      return obj.addEventListener(event, callback, false);
    } else {
      // 다른 방식
      return (function () {
        if (typeof obj['on' + event] !== 'function' || typeof obj['on' + event].eventListeners !== 'object') {
          var eventListeners = new Events();
          if (typeof obj['on' + event] === 'function') {
            eventListeners.on(event, obj['on' + event]);
          }
          obj['on' + event] = function (evt) {
            return eventListeners.trigger(event, evt);
          };
          obj['on' + event].eventListeners = eventListeners;
        } else {
          var eventListeners = obj['on' + event].eventListeners;
        }
        eventListeners.on(event, callback);
      })();
    }
  };

  // window.requestAnimationFrame이 없는 경우, setTimeout을 실행하고 id를 리턴하는 함수로 교체
  if (requestAnimationFrame == null) {
    requestAnimationFrame = function (fn) {
      return setTimeout(fn, 50);
    };
    cancelAnimationFrame = function (id) {
      return clearTimeout(id);
    };
  }

  // 받은 callback에 frameTime을 계산해 넘겨 실행하는 tick을 실행한다
  // frameTime은 여기서 계산하고, 나머지 로직은 callback에 맡기는 구조
  runAnimation = function (fn) {
    var last, tick;
    last = now();
    // tick : callback에 frameTime을 계산해 넘겨 실행시키는 함수
    tick = function () {
      var diff;
      diff = now() - last;
      // 결국 tick을 계속 실행시키기 위한 방법
      // requestAnimationFrame과 setTimeout의 차이? 얼마나 자주 fn를 호출할 것인가?
      // diff 값(간격)이 작을수록 이펙트가 부드러워짐
      if (diff >= 33) {
        last = now();
        // argument : frameTime, enqueueNextFrame
        // 자기자신을 다른 함수의 callback으로 설정
        // requestAnimationFrame을 fn에서 "바로" 실행시키기 위해 함수로 감싸서 전달
        return fn(diff, function () {
          return requestAnimationFrame(tick);
        });
      } else {
        // 위와 다르게 tick 실행을 지연시킴
        return setTimeout(tick, 33 - diff);
      }
    };
    return tick();
  };

  result = function () {
    var args, key, obj;
    (obj = arguments[0]), (key = arguments[1]), (args = 3 <= arguments.length ? __slice.call(arguments, 2) : []);
    if (typeof obj[key] === 'function') {
      return obj[key].apply(obj, args);
    } else {
      return obj[key];
    }
  };

  // 1. extend(Pace, Evented.prototype) : Evented.prototype를 Pace로 복사
  // 2. extend({}, defaultOptions, window.paceOptions, getFromDOM())
  extend = function () {
    // debugger;
    var key, out, source, sources, val, _i, _len;
    (out = arguments[0]), (sources = 2 <= arguments.length ? __slice.call(arguments, 1) : []);
    console.log(sources);
    for (_i = 0, _len = sources.length; _i < _len; _i++) {
      source = sources[_i];
      if (source) {
        for (key in source) {
          if (!__hasProp.call(source, key)) continue;
          val = source[key];
          if (out[key] != null && typeof out[key] === 'object' && val != null && typeof val === 'object') {
            extend(out[key], val);
          } else {
            out[key] = val;
          }
        }
      }
    }
    return out;
  };

  avgAmplitude = function (arr) {
    var count, sum, v, _i, _len;
    sum = count = 0;
    for (_i = 0, _len = arr.length; _i < _len; _i++) {
      v = arr[_i];
      sum += Math.abs(v);
      count++;
    }
    return sum / count;
  };

  getFromDOM = function (key, json) {
    var data, e, el;
    if (key == null) {
      key = 'options';
    }
    if (json == null) {
      json = true;
    }
    el = document.querySelector('[data-pace-' + key + ']');
    if (!el) {
      return;
    }
    data = el.getAttribute('data-pace-' + key);
    if (!json) {
      return data;
    }
    try {
      return JSON.parse(data);
    } catch (_error) {
      e = _error;
      return typeof console !== 'undefined' && console !== null
        ? console.error('Error parsing inline pace options', e)
        : void 0;
    }
  };

  Evented = (function () {
    function Evented() {}

    Evented.prototype.on = function (event, handler, ctx, once) {
      var _base;
      if (once == null) {
        once = false;
      }
      if (this.bindings == null) {
        this.bindings = {};
      }
      if ((_base = this.bindings)[event] == null) {
        _base[event] = [];
      }
      return this.bindings[event].push({
        handler: handler,
        ctx: ctx,
        once: once,
      });
    };

    Evented.prototype.once = function (event, handler, ctx) {
      return this.on(event, handler, ctx, true);
    };

    Evented.prototype.off = function (event, handler) {
      var i, _ref, _results;
      if (((_ref = this.bindings) != null ? _ref[event] : void 0) == null) {
        return;
      }
      if (handler == null) {
        return delete this.bindings[event];
      } else {
        i = 0;
        _results = [];
        while (i < this.bindings[event].length) {
          if (this.bindings[event][i].handler === handler) {
            _results.push(this.bindings[event].splice(i, 1));
          } else {
            _results.push(i++);
          }
        }
        return _results;
      }
    };

    // 저장된 콜백 함수를 실행시키는 함수
    Evented.prototype.trigger = function () {
      debugger;
      console.log('Evented trigger');
      var args, ctx, event, handler, i, once, _ref, _ref1, _results;
      (event = arguments[0]), (args = 2 <= arguments.length ? __slice.call(arguments, 1) : []);
      if ((_ref = this.bindings) != null ? _ref[event] : void 0) {
        i = 0;
        _results = [];
        while (i < this.bindings[event].length) {
          (_ref1 = this.bindings[event][i]), (handler = _ref1.handler), (ctx = _ref1.ctx), (once = _ref1.once);
          handler.apply(ctx != null ? ctx : this, args);
          if (once) {
            _results.push(this.bindings[event].splice(i, 1));
          } else {
            _results.push(i++);
          }
        }
        return _results;
      }
    };

    return Evented;
  })();

  Pace = window.Pace || {};

  window.Pace = Pace;

  // Evented.prototype을 상속받음
  extend(Pace, Evented.prototype);

  options = Pace.options = extend({}, defaultOptions, window.paceOptions, getFromDOM());

  _ref = ['ajax', 'document', 'eventLag', 'elements'];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    source = _ref[_i];
    if (options[source] === true) {
      options[source] = defaultOptions[source];
    }
  }

  NoTargetError = (function (_super) {
    // before
    // Error.__proto__ : message(""), name("Error"), toString(f toString)
    // NoTargetError.__proto__ : {}
    __extends(NoTargetError, _super);

    // after
    // NoTargetError.__proto__ : Error

    function NoTargetError() {
      _ref1 = NoTargetError.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    return NoTargetError;
  })(Error);

  Bar = (function () {
    function Bar() {
      this.progress = 0;
    }

    Bar.prototype.getElement = function () {
      var targetElement;
      if (this.el == null) {
        targetElement = document.querySelector(options.target);
        if (!targetElement) {
          throw new NoTargetError();
        }
        this.el = document.createElement('div');
        this.el.className = 'pace pace-active';
        document.body.className = document.body.className.replace(/(pace-done )|/, 'pace-running ');
        var _custom_class_name = options.className !== '' ? ' ' + options.className : '';
        this.el.innerHTML =
          '<div class="pace-progress' +
          _custom_class_name +
          '">\n  <div class="pace-progress-inner"></div>\n</div>\n<div class="pace-activity"></div>';
        if (targetElement.firstChild != null) {
          targetElement.insertBefore(this.el, targetElement.firstChild);
        } else {
          targetElement.appendChild(this.el);
        }
      }
      return this.el;
    };

    Bar.prototype.finish = function () {
      var el;
      el = this.getElement();
      el.className = el.className.replace('pace-active', 'pace-inactive');
      return (document.body.className = document.body.className.replace('pace-running ', 'pace-done '));
    };

    Bar.prototype.update = function (prog) {
      this.progress = prog;
      Pace.trigger('progress', prog);
      return this.render();
    };

    Bar.prototype.destroy = function () {
      try {
        this.getElement().parentNode.removeChild(this.getElement());
      } catch (_error) {
        NoTargetError = _error;
      }
      return (this.el = void 0);
    };

    Bar.prototype.render = function () {
      var el, key, progressStr, transform, _j, _len1, _ref2;
      if (document.querySelector(options.target) == null) {
        return false;
      }
      el = this.getElement();
      transform = 'translate3d(' + this.progress + '%, 0, 0)';
      _ref2 = ['webkitTransform', 'msTransform', 'transform'];
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        key = _ref2[_j];
        el.children[0].style[key] = transform;
      }
      if (!this.lastRenderedProgress || this.lastRenderedProgress | (0 !== this.progress) | 0) {
        el.children[0].setAttribute('data-progress-text', '' + (this.progress | 0) + '%');
        if (this.progress >= 100) {
          progressStr = '99';
        } else {
          progressStr = this.progress < 10 ? '0' : '';
          progressStr += this.progress | 0;
        }
        el.children[0].setAttribute('data-progress', '' + progressStr);
      }
      Pace.trigger('change', this.progress);
      return (this.lastRenderedProgress = this.progress);
    };

    Bar.prototype.done = function () {
      return this.progress >= 100;
    };

    return Bar;
  })();

  // 모듈 패턴? : IIFE와 클로저를 이용하여 생성자를 반환함으로써 스코프를 제한하면서 객체를 생성
  Events = (function () {
    function Events() {
      this.bindings = {};
    }

    Events.prototype.trigger = function (name, val) {
      // console.log('Events trigger');
      var binding, _j, _len1, _ref2, _results;
      if (this.bindings[name] != null) {
        _ref2 = this.bindings[name];
        _results = [];
        // 특정 name에 있는 on 콜백 함수를 모두 실행
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          binding = _ref2[_j];
          _results.push(binding.call(this, val));
        }
        return _results;
      }
    };

    // this.binding에 함수를 추가하는 함수 => 왜?
    Events.prototype.on = function (name, fn) {
      var _base;
      if ((_base = this.bindings)[name] == null) {
        _base[name] = [];
      }
      return this.bindings[name].push(fn);
    };

    return Events;
  })();

  _XMLHttpRequest = window.XMLHttpRequest;

  _XDomainRequest = window.XDomainRequest;

  _WebSocket = window.WebSocket;

  extendNative = function (to, from) {
    var e, key, _results;
    _results = [];
    for (key in from.prototype) {
      try {
        if (to[key] == null && typeof from[key] !== 'function') {
          if (typeof Object.defineProperty === 'function') {
            _results.push(
              Object.defineProperty(to, key, {
                get: (function (key) {
                  return function () {
                    return from.prototype[key];
                  };
                })(key),
                configurable: true,
                enumerable: true,
              })
            );
          } else {
            _results.push((to[key] = from.prototype[key]));
          }
        } else {
          _results.push(void 0);
        }
      } catch (_error) {
        e = _error;
      }
    }
    return _results;
  };

  ignoreStack = [];

  // Pace 객체에 새로운 프로퍼티 추가
  Pace.ignore = function () {
    var args, fn, ret;
    (fn = arguments[0]), (args = 2 <= arguments.length ? __slice.call(arguments, 1) : []);
    ignoreStack.unshift('ignore');
    ret = fn.apply(null, args);
    ignoreStack.shift();
    return ret;
  };

  Pace.track = function () {
    var args, fn, ret;
    (fn = arguments[0]), (args = 2 <= arguments.length ? __slice.call(arguments, 1) : []);
    ignoreStack.unshift('track');
    ret = fn.apply(null, args);
    ignoreStack.shift();
    return ret;
  };

  shouldTrack = function (method) {
    var _ref2;
    if (method == null) {
      method = 'GET';
    }
    if (ignoreStack[0] === 'track') {
      return 'force';
    }
    if (!ignoreStack.length && options.ajax) {
      if (method === 'socket' && options.ajax.trackWebSockets) {
        return true;
      } else if (((_ref2 = method.toUpperCase()), __indexOf.call(options.ajax.trackMethods, _ref2) >= 0)) {
        return true;
      }
    }
    return false;
  };

  // 여기서는 Events 객체를 사용하고 Pace에서는 Evented 객체를 사용함
  RequestIntercept = (function (_super) {
    // arguments(child, parent) : child.__super__ = parent.prototype
    __extends(RequestIntercept, _super);

    // 내부 함수 RequestIntercept는 왜 실행되는가?
    // anonymous에서 new RequestIntercept()를 호출
    function RequestIntercept() {
      var monitorXHR,
        _this = this;
      // 상속 구현 : 특정 객체 생성자.apply(this, [ arg1, arg2, ... ])
      // RequestIntercept.__super__ : Events.prototype 추가(this.bindings, trigger 등...)
      RequestIntercept.__super__.constructor.apply(this, arguments);

      monitorXHR = function (req) {
        var _open;
        _open = req.open;
        return (req.open = function (type, url, async) {
          if (shouldTrack(type)) {
            _this.trigger('request', {
              type: type,
              url: url,
              request: req,
            });
          }
          return _open.apply(req, arguments);
        });
      };

      // interceptor
      window.XMLHttpRequest = function (flags) {
        var req;
        req = new _XMLHttpRequest(flags);
        monitorXHR(req);
        return req;
      };

      try {
        extendNative(window.XMLHttpRequest, _XMLHttpRequest);
      } catch (_error) {}

      if (_XDomainRequest != null) {
        window.XDomainRequest = function () {
          var req;
          req = new _XDomainRequest();
          monitorXHR(req);
          return req;
        };
        try {
          extendNative(window.XDomainRequest, _XDomainRequest);
        } catch (_error) {}
      }

      // 위에서 WebSocket 생성 함수 할당
      if (_WebSocket != null && options.ajax.trackWebSockets) {
        console.log('here?');
        // 원래 window.WebSocket에 로직(this.trigger) 추가를 위해 _WebSocket에 옮겨놓음 => intercept
        // 아래 콜백 함수는 pace.js를 다 읽고 grafana의 index.ts를 실행할 때, CentrifugeService 컴포넌트에서 this.centrifuge.connect()를 실행하면 호출됨
        window.WebSocket = function (url, protocols) {
          // debugger;
          var req;
          if (protocols != null) {
            req = new _WebSocket(url, protocols);
          } else {
            req = new _WebSocket(url);
          }
          if (shouldTrack('socket')) {
            console.log('here?2');
            _this.trigger('request', {
              type: 'socket',
              url: url,
              protocols: protocols,
              request: req,
            });
          }
          return req;
        };
        try {
          extendNative(window.WebSocket, _WebSocket);
        } catch (_error) {}
      }
    }

    return RequestIntercept;
  })(Events);

  _intercept = null;

  // Events 객체를 extends 함으로써 on 메서드를 사용할 수 있음
  getIntercept = function () {
    if (_intercept == null) {
      // function RequestIntercept이 호출됨
      _intercept = new RequestIntercept();
    }
    return _intercept;
  };

  shouldIgnoreURL = function (url) {
    var pattern, _j, _len1, _ref2;
    _ref2 = options.ajax.ignoreURLs;
    for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
      pattern = _ref2[_j];
      if (typeof pattern === 'string') {
        if (url.indexOf(pattern) !== -1) {
          return true;
        }
      } else {
        if (pattern.test(url)) {
          return true;
        }
      }
    }
    return false;
  };

  // request를 key로 Events.binding 객체에 콜백 함수를 저장
  // Events 객체에서 콜백 함수를 실행
  getIntercept().on('request', function (_arg) {
    // _arg : intercept한 { type: 'socket' } 객체
    // console.log(_arg);
    var after, args, request, type, url;
    (type = _arg.type), (request = _arg.request), (url = _arg.url);
    if (shouldIgnoreURL(url)) {
      return;
    }
    if (!Pace.running && (options.restartOnRequestAfter !== false || shouldTrack(type) === 'force')) {
      args = arguments;
      after = options.restartOnRequestAfter || 0;
      if (typeof after === 'boolean') {
        after = 0;
      }
      return setTimeout(function () {
        var stillActive, _j, _len1, _ref2, _ref3, _results;
        // request 객체 : socket 객체
        if (type === 'socket') {
          stillActive = request.readyState < 1;
        } else {
          stillActive = 0 < (_ref2 = request.readyState) && _ref2 < 4;
        }
        // 어떤 조건에 의해 restart가 되지 않음
        // console.log(request.readyState, _ref2, 'still', stillActive);
        if (stillActive) {
          Pace.restart();
          _ref3 = Pace.sources;
          _results = [];
          for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
            source = _ref3[_j];
            if (source instanceof AjaxMonitor) {
              source.watch.apply(source, args);
              break;
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        }
      }, after);
    }
  });

  AjaxMonitor = (function () {
    function AjaxMonitor() {
      this.complete = __bind(this.complete, this);
      var _this = this;
      this.elements = [];
      getIntercept().on('request', function () {
        return _this.watch.apply(_this, arguments);
      });
    }

    AjaxMonitor.prototype.watch = function (_arg) {
      var request, tracker, type, url;
      (type = _arg.type), (request = _arg.request), (url = _arg.url);
      if (shouldIgnoreURL(url)) {
        return;
      }
      if (type === 'socket') {
        tracker = new SocketRequestTracker(request, this.complete);
      } else {
        tracker = new XHRRequestTracker(request, this.complete);
      }
      return this.elements.push(tracker);
    };

    AjaxMonitor.prototype.complete = function (tracker) {
      return (this.elements = this.elements.filter(function (e) {
        return e !== tracker;
      }));
    };

    return AjaxMonitor;
  })();

  XHRRequestTracker = (function () {
    function XHRRequestTracker(request, completeCallback) {
      var event,
        size,
        _j,
        _len1,
        _onreadystatechange,
        _ref2,
        _this = this;
      this.progress = 0;
      if (window.ProgressEvent != null) {
        size = null;
        addEventListener(
          request,
          'progress',
          function (evt) {
            if (evt.lengthComputable) {
              return (_this.progress = (100 * evt.loaded) / evt.total);
            } else {
              return (_this.progress = _this.progress + (100 - _this.progress) / 2);
            }
          },
          false
        );
        _ref2 = ['load', 'abort', 'timeout', 'error'];
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          event = _ref2[_j];
          addEventListener(
            request,
            event,
            function () {
              completeCallback(_this);
              return (_this.progress = 100);
            },
            false
          );
        }
      } else {
        _onreadystatechange = request.onreadystatechange;
        request.onreadystatechange = function () {
          var _ref3;
          if ((_ref3 = request.readyState) === 0 || _ref3 === 4) {
            completeCallback(_this);
            _this.progress = 100;
          } else if (request.readyState === 3) {
            _this.progress = 50;
          }
          return typeof _onreadystatechange === 'function' ? _onreadystatechange.apply(null, arguments) : void 0;
        };
      }
    }

    return XHRRequestTracker;
  })();

  SocketRequestTracker = (function () {
    function SocketRequestTracker(request, completeCallback) {
      var event,
        _j,
        _len1,
        _ref2,
        _this = this;
      this.progress = 0;
      _ref2 = ['error', 'open'];
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        event = _ref2[_j];
        addEventListener(
          request,
          event,
          function () {
            completeCallback(_this);
            return (_this.progress = 100);
          },
          false
        );
      }
    }

    return SocketRequestTracker;
  })();

  ElementMonitor = (function () {
    function ElementMonitor(options) {
      var selector, _j, _len1, _ref2;
      if (options == null) {
        options = {};
      }
      this.complete = __bind(this.complete, this);
      this.elements = [];
      if (options.selectors == null) {
        options.selectors = [];
      }
      _ref2 = options.selectors;
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        selector = _ref2[_j];
        this.elements.push(new ElementTracker(selector, this.complete));
      }
    }

    ElementMonitor.prototype.complete = function (tracker) {
      return (this.elements = this.elements.filter(function (e) {
        return e !== tracker;
      }));
    };

    return ElementMonitor;
  })();

  ElementTracker = (function () {
    function ElementTracker(selector, completeCallback) {
      console.log('element tracker');
      this.selector = selector;
      this.completeCallback = completeCallback;
      this.progress = 0;
      this.check();
    }

    ElementTracker.prototype.check = function () {
      var _this = this;
      if (document.querySelector(this.selector)) {
        return this.done();
      } else {
        return setTimeout(function () {
          return _this.check();
        }, options.elements.checkInterval);
      }
    };

    ElementTracker.prototype.done = function () {
      this.completeCallback(this);
      this.completeCallback = null;
      return (this.progress = 100);
    };

    return ElementTracker;
  })();

  DocumentMonitor = (function () {
    DocumentMonitor.prototype.states = {
      loading: 0,
      interactive: 50,
      complete: 100,
    };

    function DocumentMonitor() {
      console.log('document monitor');
      var _onreadystatechange,
        _ref2,
        _this = this;
      this.progress = (_ref2 = this.states[document.readyState]) != null ? _ref2 : 100;
      _onreadystatechange = document.onreadystatechange;
      document.onreadystatechange = function () {
        if (_this.states[document.readyState] != null) {
          _this.progress = _this.states[document.readyState];
        }
        return typeof _onreadystatechange === 'function' ? _onreadystatechange.apply(null, arguments) : void 0;
      };
    }

    return DocumentMonitor;
  })();

  EventLagMonitor = (function () {
    function EventLagMonitor() {
      var avg,
        interval,
        last,
        points,
        samples,
        _this = this;
      this.progress = 0;
      avg = 0;
      samples = [];
      points = 0;
      last = now();
      interval = setInterval(function () {
        var diff;
        diff = now() - last - 50;
        last = now();
        samples.push(diff);
        if (samples.length > options.eventLag.sampleCount) {
          samples.shift();
        }
        avg = avgAmplitude(samples);
        // console.log(samples, avg);
        if (++points >= options.eventLag.minSamples && avg < options.eventLag.lagThreshold) {
          _this.progress = 100;
          return clearInterval(interval);
        } else {
          // console.log(100 * (3 / (avg + 3)));
          return (_this.progress = 100 * (3 / (avg + 3)));
        }
      }, 50);
    }

    return EventLagMonitor;
  })();

  Scaler = (function () {
    function Scaler(source) {
      this.source = source;
      this.last = this.sinceLastUpdate = 0;
      this.rate = options.initialRate;
      this.catchup = 0;
      this.progress = this.lastProgress = 0;
      if (this.source != null) {
        this.progress = result(this.source, 'progress');
      }
    }

    Scaler.prototype.tick = function (frameTime, val) {
      var scaling;
      if (val == null) {
        val = result(this.source, 'progress');
      }
      if (val >= 100) {
        this.done = true;
      }
      if (val === this.last) {
        this.sinceLastUpdate += frameTime;
      } else {
        if (this.sinceLastUpdate) {
          this.rate = (val - this.last) / this.sinceLastUpdate;
        }
        this.catchup = (val - this.progress) / options.catchupTime;
        this.sinceLastUpdate = 0;
        this.last = val;
      }
      if (val > this.progress) {
        this.progress += this.catchup * frameTime;
      }
      scaling = 1 - Math.pow(this.progress / 100, options.easeFactor);
      this.progress += scaling * this.rate * frameTime;
      this.progress = Math.min(this.lastProgress + options.maxProgressPerFrame, this.progress);
      this.progress = Math.max(0, this.progress);
      this.progress = Math.min(100, this.progress);
      this.lastProgress = this.progress;
      return this.progress;
    };

    return Scaler;
  })();

  sources = null;

  scalers = null;

  bar = null;

  uniScaler = null;

  animation = null;

  cancelAnimation = null;

  Pace.running = false;

  handlePushState = function () {
    if (options.restartOnPushState) {
      return Pace.restart();
    }
  };

  // interceptor
  if (window.history.pushState != null) {
    _pushState = window.history.pushState;
    window.history.pushState = function () {
      handlePushState();
      // apply를 이용해 arguments를 가지고 함수를 실행
      // window.WebSocket은 함수가 아니기 때문에 객체로 반환했지만, 여기서는 함수이기 때문에 apply를 이용하여 함수를 실행
      return _pushState.apply(window.history, arguments);
    };
  }

  if (window.history.replaceState != null) {
    _replaceState = window.history.replaceState;
    window.history.replaceState = function () {
      handlePushState();
      return _replaceState.apply(window.history, arguments);
    };
  }

  // 주소 표시줄 history만 바뀌고 페이지가 이동하지는 않음
  // window.history.back();

  // - 왜 popstate는 이벤트로 등록해야 하는가? 위의 방법처럼은 불가능한가?
  // - TODO : history API 정리
  // https://developer.mozilla.org/ko/docs/Web/API/History
  window.addEventListener(
    'popstate',
    function (evt) {
      console.log('popstate');
      handlePushState();
    },
    false
  );

  SOURCE_KEYS = {
    ajax: AjaxMonitor,
    elements: ElementMonitor,
    document: DocumentMonitor,
    eventLag: EventLagMonitor,
  };

  // init : 초기화 및 세팅, init 변수에는 함수가 담기고 즉시 실행
  (init = function () {
    var type, _j, _k, _len1, _len2, _ref2, _ref3, _ref4;
    Pace.sources = sources = [];
    _ref2 = ['ajax', 'elements', 'document', 'eventLag'];
    for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
      type = _ref2[_j];
      if (options[type] !== false) {
        sources.push(new SOURCE_KEYS[type](options[type]));
      }
    }
    _ref4 = (_ref3 = options.extraSources) != null ? _ref3 : [];
    for (_k = 0, _len2 = _ref4.length; _k < _len2; _k++) {
      source = _ref4[_k];
      sources.push(new source(options));
    }
    Pace.bar = bar = new Bar();
    scalers = [];
    return (uniScaler = new Scaler());
  })();

  Pace.stop = function () {
    console.log('pace stop');
    Pace.trigger('stop');
    Pace.running = false;
    bar.destroy();
    cancelAnimation = true;
    if (animation != null) {
      if (typeof cancelAnimationFrame === 'function') {
        cancelAnimationFrame(animation);
      }
      animation = null;
    }
    return init();
  };

  Pace.restart = function () {
    console.log('pace restart');
    // Pace.trigger는 어떤 용도인가? 어떻길래 이렇게 추상화가 가능했나?
    Pace.trigger('restart');
    Pace.stop();
    return Pace.start();
  };

  // runAnimation
  Pace.go = function () {
    var start;
    Pace.running = true;
    console.log('pace go');
    bar.render();
    start = now();
    cancelAnimation = false;
    // runAnimation에서 실행할 callback을 정의 => runAnimation에서 계산된 frameTime을 가지고 1) bar 업데이트 2) 등 ...
    // animation 변수에는 callbackId를 저장
    return (animation = runAnimation(function (frameTime, enqueueNextFrame) {
      var avg, count, done, element, elements, i, j, remaining, scaler, scalerList, sum, _j, _k, _len1, _len2, _ref2;
      remaining = 100 - bar.progress;
      count = sum = 0;
      done = true;
      // sources, source는 가장 상위 컨텍스트에 있는 변수
      for (i = _j = 0, _len1 = sources.length; _j < _len1; i = ++_j) {
        source = sources[i];
        scalerList = scalers[i] != null ? scalers[i] : (scalers[i] = []);
        elements = (_ref2 = source.elements) != null ? _ref2 : [source];
        for (j = _k = 0, _len2 = elements.length; _k < _len2; j = ++_k) {
          element = elements[j];
          scaler = scalerList[j] != null ? scalerList[j] : (scalerList[j] = new Scaler(element));
          done &= scaler.done;
          if (scaler.done) {
            continue;
          }
          count++;
          sum += scaler.tick(frameTime);
        }
      }
      avg = sum / count;
      bar.update(uniScaler.tick(frameTime, avg));
      // 끝난 경우
      if (bar.done() || done || cancelAnimation) {
        bar.update(100);
        Pace.trigger('done');
        return setTimeout(
          function () {
            bar.finish();
            Pace.running = false;
            return Pace.trigger('hide');
          },
          Math.max(options.ghostTime, Math.max(options.minTime - (now() - start), 0))
        );
      } else {
        return enqueueNextFrame();
      }
    }));
  };

  Pace.start = function (_options) {
    console.log('pace start');
    extend(options, _options);
    Pace.running = true;
    try {
      bar.render();
    } catch (_error) {
      NoTargetError = _error;
    }
    if (!document.querySelector('.pace')) {
      return setTimeout(Pace.start, 50);
    } else {
      Pace.trigger('start');
      return Pace.go();
    }
  };

  // 진입점
  // 어느 쪽으로 들어가는가에 따라, 비동기로 호출한 callback이 중간중간 불리는 지가 결정됨
  // document 첫 번째 load 이후에는 아래 코드는 다시 호출되지 않음

  // console.log(typeof define, define.amd, typeof exports); // function {} Object
  if (typeof define === 'function' && define.amd) {
    console.log(1);
    // This code checks for the presence of require.js
    // https://stackoverflow.com/questions/30953589/what-is-typeof-define-function-defineamd-used-for
    define(function () {
      return Pace;
    });
  } else if (typeof exports === 'object') {
    console.log(2);
    // CommonJS 스펙에는 exports라는 자유롭게 접근할 수 있는 자유 변수가 존재 => 이걸 검사
    // https://stackoverflow.com/questions/46708062/what-environment-is-expected-by-iftypeof-exports-object-in-umd-definit
    module.exports = Pace;
  } else {
    console.log(3);
    if (options.startOnPageLoad) {
      Pace.start();
    }
  }
}).call(this);

// document : 처음 받아오는 시점
// element : 특정 엘리먼트가 렌더링 되는 시점

// https://github.com/CodeByZach/pace/blob/master/pace.js

// 1. 첫 document loading 때는 runAnimation가 불리지 않는데, mega menu를 클릭하면 Pace.go => runAnimation가 호출됨
// - 처음에는 왜 Pace.go가 호출되지 않는가?
// - 진입점에서 3번으로 들어가 Pace.start => Pace.go가 호출되지 않기 때문
// - 나중에 window.WebSocket이 호출되어 RequestIntercept(socket)에 의해 Events.trigger가 호출되긴 하지만 조건문에 의해 Pace.restart 되지 않음

// 2. 버튼을 누르면 어떻게 Pace.restart가 동작하는가?
// - pushState를 감지하여 Pace.restart 호출
