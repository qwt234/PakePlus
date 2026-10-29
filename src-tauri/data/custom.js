window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// very important, if you don't know what it is, don't touch it
// 非常重要，不懂代码不要动，这里可以解决80%的问题，也可以生产1000+的bug
const hookClick = (e) => {
    const origin = e.target.closest('a')
    const isBaseTargetBlank = document.querySelector(
        'head base[target="_blank"]'
    )
    console.log('origin', origin, isBaseTargetBlank)
    if (
        (origin && origin.href && origin.target === '_blank') ||
        (origin && origin.href && isBaseTargetBlank)
    ) {
        e.preventDefault()
        console.log('handle origin', origin)
        location.href = origin.href
    } else {
        console.log('not handle origin', origin)
    }
}

window.open = function (url, target, features) {
    console.log('open', url, target, features)
    location.href = url
}

document.addEventListener('click', hookClick, { capture: true })
/* ============================================================
 * PakePlus macOS 10.14.6 (Mojave) 兼容补丁
 * 用法：整段追加在原始脚本的后面，一起粘进「脚本文件」框
 * 注意：开头的分号 ; 不要删（原脚本末尾没分号，删了会被拼成函数调用报错）
 * ============================================================ */
;(function () {
  'use strict';

  var TAG = '[PakePlus-Mojave]';
  function log() {
    try {
      var a = Array.prototype.slice.call(arguments);
      a.unshift(TAG);
      console.log.apply(console, a);
    } catch (e) {}
  }

  /* ---------- ① 补齐 Mojave 老 WebKit 缺失的 API（存在就跳过） ---------- */

  // globalThis（Safari 12.1 才有）
  if (typeof globalThis === 'undefined') {
    try {
      Object.defineProperty(window, 'globalThis', { value: window, writable: true, configurable: true });
    } catch (e) {}
  }

  // String.prototype.replaceAll（Safari 13.1 才有）
  if (!String.prototype.replaceAll) {
    String.prototype.replaceAll = function (search, replacement) {
      if (search instanceof RegExp) {
        if (!search.flags || search.flags.indexOf('g') === -1) {
          throw new TypeError('replaceAll called with a non-global RegExp argument');
        }
        return String(this).replace(search, replacement);
      }
      return String(this).split(String(search)).join(replacement);
    };
  }

  // String / Array 的 .at（Safari 15.4 才有）
  if (!String.prototype.at) {
    String.prototype.at = function (i) {
      var len = this.length >>> 0, k = i >> 0;
      if (k < 0) k += len;
      return (k < 0 || k >= len) ? undefined : this.charAt(k);
    };
  }
  if (!Array.prototype.at) {
    Array.prototype.at = function (i) {
      var len = this.length >>> 0, k = i >> 0;
      if (k < 0) k += len;
      return (k < 0 || k >= len) ? undefined : this[k];
    };
  }

  // Object.hasOwn（Safari 15.4 才有）
  if (typeof Object.hasOwn !== 'function') {
    Object.hasOwn = function (obj, prop) {
      if (obj == null) throw new TypeError('Cannot convert undefined or null to object');
      return Object.prototype.hasOwnProperty.call(Object(obj), prop);
    };
  }

  // Object.fromEntries
  if (typeof Object.fromEntries !== 'function') {
    Object.fromEntries = function (iterable) {
      var out = {}, list;
      if (!iterable) return out;
      list = Array.isArray(iterable) ? iterable : Array.prototype.slice.call(iterable);
      for (var i = 0; i < list.length; i++) out[list[i][0]] = list[i][1];
      return out;
    };
  }

  // Array.prototype.flat / flatMap
  if (!Array.prototype.flat) {
    Array.prototype.flat = function (depth) {
      var d = depth === undefined ? 1 : Number(depth), out = [];
      (function walk(arr, dd) {
        for (var i = 0; i < arr.length; i++) {
          var v = arr[i];
          if (Array.isArray(v) && dd > 0) walk(v, dd - 1);
          else out.push(v);
        }
      })(this, d);
      return out;
    };
  }
  if (!Array.prototype.flatMap) {
    Array.prototype.flatMap = function (fn, thisArg) {
      return Array.prototype.flat.call(Array.prototype.map.call(this, fn, thisArg), 1);
    };
  }

  // Promise.allSettled / Promise.any（Safari 13 才有）
  if (typeof Promise !== 'undefined' && !Promise.allSettled) {
    Promise.allSettled = function (list) {
      return Promise.all(Array.prototype.map.call(list || [], function (p) {
        return Promise.resolve(p).then(
          function (v) { return { status: 'fulfilled', value: v }; },
          function (e) { return { status: 'rejected', reason: e }; }
        );
      }));
    };
  }
  if (typeof Promise !== 'undefined' && !Promise.any) {
    Promise.any = function (list) {
      return new Promise(function (resolve, reject) {
        var arr = Array.prototype.slice.call(list || []);
        var errs = [], done = false, n = 0;
        function onReject(err) {
          errs.push(err);
          n++;
          if (n >= arr.length && !done) {
            var e = new Error('All promises were rejected');
            e.name = 'AggregateError';
            e.errors = errs;
            reject(e);
          }
        }
        if (!arr.length) return onReject(new Error('No promises'));
        arr.forEach(function (p) {
          Promise.resolve(p).then(function (v) {
            if (!done) { done = true; resolve(v); }
          }, onReject);
        });
      });
    };
  }

  // Element.matches / closest（原脚本第 4 行就用了 closest）
  (function (El) {
    if (!El) return;
    if (!El.matches) {
      El.matches = El.msMatchesSelector || El.mozMatchesSelector || El.webkitMatchesSelector;
    }
    if (!El.closest) {
      El.closest = function (sel) {
        var node = this;
        while (node && node.nodeType === 1) {
          if (El.matches && El.matches.call(node, sel)) return node;
          node = node.parentElement || node.parentNode;
        }
        return null;
      };
    }
  })(window.Element && window.Element.prototype);

  // CustomEvent 可被 new（老 WebKit 只能 createEvent）
  try {
    new window.CustomEvent('t');
  } catch (e) {
    var CE = function (ev, p) {
      p = p || {};
      var t = document.createEvent('CustomEvent');
      t.initCustomEvent(ev, !!p.bubbles, !!p.cancelable, p.detail);
      return t;
    };
    CE.prototype = window.Event.prototype;
    window.CustomEvent = CE;
  }

  /* ---------- ② 修补原脚本的 window.open（原版无参时会把页面导航到 "undefined"） ---------- */

  var prevOpen = window.open;
  window.open = function (url, target, features) {
    if (!url) {
      log('window.open 无参数调用，已忽略（原脚本会把页面导航到 undefined）');
      return null;
    }
    var href = String(url);
    if (/^(mailto|tel|sms):/i.test(href)) {
      log('忽略非网页协议：', href);
      return null;
    }
    if (/^(javascript|data|blob|about|file):/i.test(href)) {
      return prevOpen ? prevOpen.call(window, url, target, features) : null;
    }
    log('window.open 统一在当前窗口打开：', href);
    window.location.href = href;
    return null;
  };

  /* ---------- ③ 补漏：命名 target 也会跳出应用，原脚本只挡了 _blank ---------- */

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented) return; // 原脚本已处理过 _blank
    var a = e.target && e.target.closest ? e.target.closest('a') : null;
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href || /^(javascript|mailto|tel|sms):/i.test(href)) return;
    if (href.charAt(0) === '#') return;
    var target = (a.getAttribute('target') || '').toLowerCase();
    if (target && target !== '_self' && target !== '_top' && target !== '_parent') {
      e.preventDefault();
      log('拦截命名 target 链接，应用内跳转：', a.href);
      window.location.href = a.href;
    }
  }, true);

  /* ---------- ④ alert / confirm / prompt 兜底（WebView 未实现时不再抛错中断页面） ---------- */

  ['alert', 'confirm', 'prompt'].forEach(function (name) {
    var orig = window[name];
    if (typeof orig !== 'function' || orig.__mojaveWrapped) return;
    var wrapped = function () {
      try {
        return orig.apply(window, arguments);
      } catch (err) {
        log(name + ' 不可用，已降级：', arguments[0]);
        if (name === 'confirm') return true;
        if (name === 'prompt') return '';
        return undefined;
      }
    };
    wrapped.__mojaveWrapped = true;
    window[name] = wrapped;
  });

  /* ---------- ⑤ 恢复被站点禁掉的右键 / 选择 / 复制粘贴 ---------- */

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function () {
    try {
      var st = document.createElement('style');
      st.setAttribute('data-pakeplus-mojave', 'user-select-fix');
      st.textContent =
        'html,body,*{-webkit-user-select:text !important;user-select:text !important;}' +
        'img{-webkit-user-drag:auto !important;}';
      (document.head || document.documentElement).appendChild(st);
    } catch (e) { log('注入选择样式失败', e); }
  });

  ['contextmenu', 'selectstart', 'copy', 'cut', 'paste', 'dragstart'].forEach(function (ev) {
    document.addEventListener(ev, function (e) {
      if (e.__mojavePassed) return;
      e.__mojavePassed = true;
      try { e.stopPropagation(); } catch (err) {}
    }, true);
  });

  /* ---------- ⑥ 全局错误兜底：单个脚本报错不再导致整页白屏 ---------- */

  window.addEventListener('error', function (e) {
    log('页面错误（已兜底，不影响 App 运行）：', (e && (e.message || e.error)) || e);
  }, true);
  window.addEventListener('unhandledrejection', function (e) {
    log('未处理的 Promise 拒绝：', e && e.reason);
  });

  /* ---------- ⑦ viewport 修正：桌面 App 不要被当成手机站 ---------- */

  ready(function () {
    try {
      var vp = document.querySelector('meta[name="viewport"]');
      if (!vp) {
        vp = document.createElement('meta');
        vp.setAttribute('name', 'viewport');
        (document.head || document.documentElement).appendChild(vp);
      }
      vp.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
    } catch (e) {}
  });

  log('Mojave 兼容补丁已加载。');
})();
