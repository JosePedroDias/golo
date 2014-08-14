/*
 PlayCanvas Engine v0.154.0-dev
 revision 7b9b7f1

 http://playcanvas.com
 Copyright 2011-2014 PlayCanvas Ltd. All rights reserved.
 Do not distribute.
 Contains: https://github.com/tildeio/rsvp.js - see page for license information
*/
var pc = {config:{}, common:{}, apps:{}, data:{}, unpack:function() {
  console.warn("pc.unpack has been deprecated and will be removed shortly. Please update your code.")
}, makeArray:function(arr) {
  var i, ret = [], length = arr.length;
  for(i = 0;i < length;++i) {
    ret.push(arr[i])
  }
  return ret
}, type:function(obj) {
  if(obj === null) {
    return"null"
  }
  var type = typeof obj;
  if(type == "undefined" || type == "number" || type == "string" || type == "boolean") {
    return type
  }
  return _typeLookup[Object.prototype.toString.call(obj)]
}, extend:function(target, ex) {
  var prop, copy;
  for(prop in ex) {
    copy = ex[prop];
    if(pc.type(copy) == "object") {
      target[prop] = pc.extend({}, copy)
    }else {
      if(pc.type(copy) == "array") {
        target[prop] = pc.extend([], copy)
      }else {
        target[prop] = copy
      }
    }
  }
  return target
}, isDefined:function(o) {
  var a;
  return o !== a
}};
var _typeLookup = function() {
  var result = {}, index, names = ["Array", "Object", "Function", "Date", "RegExp", "Float32Array"];
  for(index = 0;index < names.length;++index) {
    result["[object " + names[index] + "]"] = names[index].toLowerCase()
  }
  return result
}();
if(typeof exports !== "undefined") {
  exports.pc = pc
}
;(function() {
  if(typeof document === "undefined") {
    return
  }
  var fullscreenchange = function() {
    var e = document.createEvent("CustomEvent");
    e.initCustomEvent("fullscreenchange", true, false, null);
    document.dispatchEvent(e)
  };
  var fullscreenerror = function() {
    var e = document.createEvent("CustomEvent");
    e.initCustomEvent("fullscreenerror", true, false, null);
    document.dispatchEvent(e)
  };
  document.addEventListener("webkitfullscreenchange", fullscreenchange, false);
  document.addEventListener("mozfullscreenchange", fullscreenchange, false);
  document.addEventListener("MSFullscreenChange", fullscreenchange, false);
  document.addEventListener("webkitfullscreenerror", fullscreenerror, false);
  document.addEventListener("mozfullscreenerror", fullscreenerror, false);
  document.addEventListener("MSFullscreenError", fullscreenerror, false);
  if(Element.prototype.mozRequestFullScreen) {
    Element.prototype.requestFullscreen = function() {
      this.mozRequestFullScreen()
    }
  }else {
    Element.prototype.requestFullscreen = Element.prototype.requestFullscreen || Element.prototype.webkitRequestFullscreen || Element.prototype.msRequestFullscreen || function() {
    }
  }
  document.exitFullscreen = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
  if(!document.fullscreenElement) {
    Object.defineProperty(document, "fullscreenElement", {enumerable:true, configurable:false, get:function() {
      return document.webkitCurrentFullScreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement
    }})
  }
  if(!document.fullscreenEnabled) {
    Object.defineProperty(document, "fullscreenEnabled", {enumerable:true, configurable:false, get:function() {
      return document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled
    }})
  }
})();
(function(exports) {
  var lastTime = 0;
  var vendors = ["ms", "moz", "webkit", "o"];
  for(var x = 0;x < vendors.length && !exports.requestAnimationFrame;++x) {
    exports.requestAnimationFrame = exports[vendors[x] + "RequestAnimationFrame"];
    exports.cancelAnimationFrame = exports[vendors[x] + "CancelAnimationFrame"] || exports[vendors[x] + "CancelRequestAnimationFrame"]
  }
  if(!exports.requestAnimationFrame) {
    exports.requestAnimationFrame = function(callback, element) {
      var currTime = (new Date).getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = exports.setTimeout(function() {
        callback(currTime + timeToCall)
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id
    }
  }
  if(!exports.cancelAnimationFrame) {
    exports.cancelAnimationFrame = function(id) {
      clearTimeout(id)
    }
  }
  exports.requestAnimFrame = exports.requestAnimationFrame
})(typeof exports === "undefined" ? this : exports);
pc.extend(pc, function() {
  var Color = function() {
    this.data = new Float32Array(4);
    if(arguments.length >= 3) {
      this.data[0] = arguments[0];
      this.data[1] = arguments[1];
      this.data[2] = arguments[2];
      this.data[3] = arguments.length >= 4 ? arguments[3] : 1
    }else {
      this.data[0] = 0;
      this.data[1] = 0;
      this.data[2] = 0;
      this.data[3] = 1
    }
  };
  Color.prototype = {clone:function() {
    return new pc.Color(this.r, this.g, this.b, this.a)
  }, copy:function(rhs) {
    var a = this.data;
    var b = rhs.data;
    a[0] = b[0];
    a[1] = b[1];
    a[2] = b[2];
    a[3] = b[3];
    return this
  }, set:function(r, g, b, a) {
    var c = this.data;
    c[0] = r;
    c[1] = g;
    c[2] = b;
    c[3] = typeof a === "undefined" ? 1 : a;
    return this
  }, fromString:function(hex) {
    var i = parseInt(hex.replace("#", "0x"));
    var bytes;
    if(hex.length > 7) {
      bytes = pc.math.intToBytes32(i)
    }else {
      bytes = pc.math.intToBytes24(i);
      bytes[3] = 255
    }
    this.set(bytes[0] / 255, bytes[1] / 255, bytes[2] / 255, bytes[3] / 255);
    return this
  }, toString:function(alpha) {
    var s = "#" + ((1 << 24) + (parseInt(this.r * 255) << 16) + (parseInt(this.g * 255) << 8) + parseInt(this.b * 255)).toString(16).slice(1);
    if(alpha === true) {
      var a = parseInt(this.a * 255).toString(16);
      if(this.a < 16 / 255) {
        s += "0" + a
      }else {
        s += a
      }
    }
    return s
  }};
  Object.defineProperty(Color.prototype, "r", {get:function() {
    return this.data[0]
  }, set:function(value) {
    this.data[0] = value
  }});
  Object.defineProperty(Color.prototype, "g", {get:function() {
    return this.data[1]
  }, set:function(value) {
    this.data[1] = value
  }});
  Object.defineProperty(Color.prototype, "b", {get:function() {
    return this.data[2]
  }, set:function(value) {
    this.data[2] = value
  }});
  Object.defineProperty(Color.prototype, "a", {get:function() {
    return this.data[3]
  }, set:function(value) {
    this.data[3] = value
  }});
  return{Color:Color}
}());
pc.guid = function() {
  return{create:function() {
    return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == "x" ? r : r & 3 | 8;
      return v.toString(16)
    })
  }}
}();
pc.time = function() {
  var Timer = function Timer() {
    this._isRunning = false;
    this._a = 0;
    this._b = 0
  };
  Timer.prototype.start = function() {
    this._isRunning = true;
    this._a = (new Date).getTime()
  };
  Timer.prototype.stop = function() {
    this._isRunning = false;
    this._b = (new Date).getTime()
  };
  Timer.prototype.getMilliseconds = function() {
    return this._b - this._a
  };
  return{Timer:Timer, now:function() {
    return(new Date).getTime()
  }}
}();
pc.extend(pc, function() {
  return{createURI:function(options) {
    var s = "";
    if((options.authority || options.scheme) && (options.host || options.hostpath)) {
      throw new Error("Can't have 'scheme' or 'authority' and 'host' or 'hostpath' option");
    }
    if(options.host && options.hostpath) {
      throw new Error("Can't have 'host' and 'hostpath' option");
    }
    if(options.path && options.hostpath) {
      throw new Error("Can't have 'path' and 'hostpath' option");
    }
    if(options.scheme) {
      s += options.scheme + ":"
    }
    if(options.authority) {
      s += "//" + options.authority
    }
    if(options.host) {
      s += options.host
    }
    if(options.path) {
      s += options.path
    }
    if(options.hostpath) {
      s += options.hostpath
    }
    if(options.query) {
      s += "?" + options.query
    }
    if(options.fragment) {
      s += "#" + options.fragment
    }
    return s
  }, URI:function(uri) {
    var re = /^(([^:\/?\#]+):)?(\/\/([^\/?\#]*))?([^?\#]*)(\?([^\#]*))?(\#(.*))?/, result = uri.match(re);
    this.scheme = result[2];
    this.authority = result[4];
    this.path = result[5];
    this.query = result[7];
    this.fragment = result[9];
    this.toString = function() {
      var s = "";
      if(this.scheme) {
        s += this.scheme + ":"
      }
      if(this.authority) {
        s += "//" + this.authority
      }
      s += this.path;
      if(this.query) {
        s += "?" + this.query
      }
      if(this.fragment) {
        s += "#" + this.fragment
      }
      return s
    };
    this.getQuery = function() {
      var vars;
      var pair;
      var result = {};
      if(this.query) {
        vars = decodeURIComponent(this.query).split("&");
        vars.forEach(function(item, index, arr) {
          pair = item.split("=");
          result[pair[0]] = pair[1]
        }, this)
      }
      return result
    };
    this.setQuery = function(params) {
      q = "";
      for(var key in params) {
        if(params.hasOwnProperty(key)) {
          if(q !== "") {
            q += "&"
          }
          q += encodeURIComponent(key) + "=" + encodeURIComponent(params[key])
        }
      }
      this.query = q
    }
  }}
}());
pc.extend(pc, function() {
  var log = {write:function(text) {
    //console.log(text)
  }, open:function(text) {
    //pc.log.write(Date());
    //pc.log.info("Log opened")
  }, info:function(text) {
    //console.info("INFO:    " + text)
  }, debug:function(text) {
    //console.debug("DEBUG:   " + text)
  }, error:function(text) {
    console.error("ERROR:   " + text)
  }, warning:function(text) {
    //console.warn("WARNING: " + text)
  }, alert:function(text) {
    pc.log.write("ALERT:   " + text);
    alert(text)
  }, assert:function(condition, text) {
    if(condition === false) {
      pc.log.write("ASSERT:  " + text);
      alert("ASSERT failed: " + text)
    }
  }};
  return{log:log}
}());
var logINFO = pc.log.info;
var logDEBUG = pc.log.debug;
var logWARNING = pc.log.warning;
var logERROR = pc.log.error;
var logALERT = pc.log.alert;
var logASSERT = pc.log.assert;
Function.prototype.extendsFrom = function(Super) {
  var Self;
  var Func;
  var Temp = function() {
  };
  Self = this;
  Func = function() {
    Super.apply(this, arguments);
    Self.apply(this, arguments);
    this.constructor = Self
  };
  Func._super = Super.prototype;
  Temp.prototype = Super.prototype;
  Func.prototype = new Temp;
  return Func
};
pc.extend(pc, function() {
  return{inherits:function(Self, Super) {
    var Temp = function() {
    };
    var Func = function() {
      Super.apply(this, arguments);
      Self.apply(this, arguments)
    };
    Func._super = Super.prototype;
    Temp.prototype = Super.prototype;
    Func.prototype = new Temp;
    return Func
  }}
}());
if(!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if(typeof this !== "function") {
      throw new TypeError("Function.prototype.bind - what is trying to be fBound is not callable");
    }
    var aArgs = Array.prototype.slice.call(arguments, 1), fToBind = this, fNOP = function() {
    }, fBound = function() {
      return fToBind.apply(this instanceof fNOP ? this : oThis || window, aArgs.concat(Array.prototype.slice.call(arguments)))
    };
    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP;
    return fBound
  }
}
;pc.path = function() {
  return{delimiter:"/", join:function() {
    var index;
    var num = arguments.length;
    var result = arguments[0];
    for(index = 0;index < num - 1;++index) {
      var one = arguments[index];
      var two = arguments[index + 1];
      if(!pc.isDefined(one) || !pc.isDefined(two)) {
        throw new Error("undefined argument to pc.path.join");
      }
      if(two[0] === pc.path.delimiter) {
        result = two;
        continue
      }
      if(one && two && one[one.length - 1] !== pc.path.delimiter && two[0] !== pc.path.delimiter) {
        result += pc.path.delimiter + two
      }else {
        result += two
      }
    }
    return result
  }, split:function(path) {
    var parts = path.split(pc.path.delimiter);
    var tail = parts.slice(parts.length - 1)[0];
    var head = parts.slice(0, parts.length - 1).join(pc.path.delimiter);
    return[head, tail]
  }, getBasename:function(path) {
    return pc.path.split(path)[1]
  }, getDirectory:function(path) {
    var parts = path.split(pc.path.delimiter);
    return parts.slice(0, parts.length - 1).join(pc.path.delimiter)
  }, getExtension:function(path) {
    var ext = path.split(".").pop();
    if(ext !== path) {
      return"." + ext
    }else {
      return""
    }
  }, isRelativePath:function(s) {
    return s.charAt(0) !== "/" && s.match(/:\/\//) === null
  }, extractPath:function(s) {
    var path = ".", parts = s.split("/"), i = 0;
    if(parts.length > 1) {
      if(pc.path.isRelativePath(s) === false) {
        path = ""
      }
      for(i = 0;i < parts.length - 1;++i) {
        path += "/" + parts[i]
      }
    }
    return path
  }}
}();
pc.string = function() {
  return{ASCII_LOWERCASE:"abcdefghijklmnopqrstuvwxyz", ASCII_UPPERCASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZ", ASCII_LETTERS:this.ASCII_LOWERCASE + this.ASCII_UPPERCASE, format:function(s) {
    var i = 0, regexp, args = pc.makeArray(arguments);
    args.shift();
    for(i = 0;i < args.length;i++) {
      regexp = new RegExp("\\{" + i + "\\}", "gi");
      s = s.replace(regexp, args[i])
    }
    return s
  }, startsWith:function(s, subs) {
    return s.indexOf(subs) === 0
  }, endsWith:function(s, subs) {
    return s.lastIndexOf(subs, s.length - subs.length) !== -1
  }, toBool:function(s, strict) {
    if(s === "true") {
      return true
    }
    if(strict) {
      if(s === "false") {
        return false
      }
      throw new Error("Not a boolean string");
    }
    return false
  }}
}();
pc.extend(pc, function() {
  var json = {parse:function(value, reviver) {
    return JSON.parse(value, reviver)
  }, stringify:function(value, replacer, space) {
    return JSON.stringify(value, function(key, value) {
      if(this[key] instanceof Float32Array) {
        value = pc.makeArray(this[key])
      }
      return replacer ? replacer(key, value) : value
    }, space)
  }};
  return{json:json}
}());
pc.cookie = function() {
  return{set:function(name, value, options) {
    options = options || {};
    var cookie = name + "=" + value;
    if(options.path) {
      cookie += ";path=" + options.path
    }
    if(options.domain) {
      cookie += ";domain=" + options.domain
    }
    if(options.path) {
      cookie += ";path=" + options.path
    }
    if(options.secure) {
      cookie += ";secure"
    }
    if(options.lifetime) {
      cookie += ";max-age=" + options.lifetime * 24 * 60 * 60
    }else {
      cookie += ";max-age=" + 1 * 24 * 60 * 60
    }
    document.cookie = cookie
  }, get:function(name) {
    var cookie, cookies = document.cookie.split(";");
    var i, len = cookies.length;
    for(i = 0;i < len;i++) {
      cookie = cookies[i].trim();
      if(pc.string.startsWith(cookie, name)) {
        return cookie.split("=")[1]
      }
    }
  }, remove:function(name, options) {
    options.lifetime = 0;
    pc.cookie.set(name, "", options)
  }}
}();
pc.debug = function() {
  var table = null;
  var row = null;
  var title = null;
  var field = null;
  return{display:function(data) {
    function init() {
      table = document.createElement("table");
      row = document.createElement("tr");
      title = document.createElement("td");
      field = document.createElement("td");
      table.style.cssText = "position:absolute;font-family:sans-serif;font-size:12px";
      table.style.top = "0px";
      table.style.left = "0px";
      table.style.border = "thin solid black";
      document.body.appendChild(table)
    }
    if(!table) {
      init()
    }
    table.innerHTML = "";
    for(var key in data) {
      var r = row.cloneNode();
      var t = title.cloneNode();
      var f = field.cloneNode();
      t.textContent = key;
      f.textContent = data[key];
      r.appendChild(t);
      r.appendChild(f);
      table.appendChild(r)
    }
  }}
}();
pc.extend(pc, function() {
  var ObjectPool = function(constructor, options) {
    this.objects = [];
    this.ctor = constructor;
    this.name = options.name;
    this.useNew = typeof options.useNew === "undefined" || options.useNew;
    this.metrics = options.metrics;
    if(options.metrics) {
      this.total = 0;
      this.used = 0
    }
  };
  ObjectPool.prototype = {_construct:function(constructor, args) {
    function F() {
      return constructor.apply(this, args)
    }
    F.prototype = constructor.prototype;
    return new F
  }, allocate:function() {
    var object;
    if(this.objects.length) {
      object = this.objects.pop();
      this.ctor.apply(object, arguments);
      if(this.metrics) {
        this.used++
      }
    }else {
      if(this.useNew) {
        object = this._construct(this.ctor, arguments)
      }else {
        object = this.ctor.apply(this, arguments)
      }
      if(this.metrics) {
        this.total++;
        this.used++
      }
    }
    return object
  }, free:function(object) {
    this.objects.push(object);
    if(this.metrics) {
      this.used--
    }
    if(object.onFree) {
      object.onFree()
    }
  }, usage:function() {
    return pc.string.format("{0} - total: {1}, used: {2}", this.name, this.total, this.used)
  }};
  return{ObjectPool:ObjectPool}
}());
pc.events = function() {
  var Events = {attach:function(target) {
    var ev = pc.events;
    target.on = ev.on;
    target.off = ev.off;
    target.fire = ev.fire;
    target.hasEvent = ev.hasEvent;
    target.bind = ev.on;
    target.unbind = ev.off;
    return target
  }, on:function(name, callback, scope) {
    if(pc.type(name) != "string") {
      throw new TypeError("Event name must be a string");
    }
    var callbacks = this._callbacks || (this._callbacks = {});
    var events = callbacks[name] || (callbacks[name] = []);
    events.push({callback:callback, scope:scope || this});
    return this
  }, off:function(name, callback, scope) {
    var callbacks = this._callbacks;
    var events;
    var index;
    if(!callbacks) {
      return
    }
    if(!callback) {
      callbacks[name] = []
    }else {
      events = callbacks[name];
      if(!events) {
        return this
      }
      for(index = 0;index < events.length;index++) {
        if(events[index].callback === callback) {
          if(!scope || scope === events[index].scope) {
            events.splice(index, 1);
            index--
          }
        }
      }
    }
    return this
  }, fire:function(name) {
    var index;
    var length;
    var args;
    var callbacks;
    if(this._callbacks && this._callbacks[name]) {
      args = pc.makeArray(arguments);
      args.shift();
      callbacks = this._callbacks[name].slice();
      length = callbacks.length;
      for(index = 0;index < length;++index) {
        var scope = callbacks[index].scope;
        callbacks[index].callback.apply(scope, args)
      }
    }
    return this
  }, hasEvent:function(name) {
    return typeof this._callbacks !== "undefined" && typeof this._callbacks[name] !== "undefined" && this._callbacks[name].length > 0
  }};
  Events.bind = Events.on;
  Events.unbind = Events.off;
  return Events
}();
pc.dom = function() {
  return{getWidth:function(element) {
    return element.offsetWidth
  }, getHeight:function(element) {
    return element.offsetHeight
  }, setText:function(element, text) {
    if(element.textContent) {
      element.textContent = text
    }else {
      if(element.innerText) {
        element.innerText = text
      }
    }
  }, getText:function(element) {
    return element.textContent || element.innerText
  }}
}();
pc.math = {DEG_TO_RAD:Math.PI / 180, RAD_TO_DEG:180 / Math.PI, clamp:function(value, min, max) {
  if(value >= max) {
    return max
  }
  if(value <= min) {
    return min
  }
  return value
}, intToBytes24:function(i) {
  var r, g, b;
  r = i >> 16 & 255;
  g = i >> 8 & 255;
  b = i & 255;
  return[r, g, b]
}, intToBytes32:function(i) {
  var r, g, b, a;
  r = i >> 24 & 255;
  g = i >> 16 & 255;
  b = i >> 8 & 255;
  a = i & 255;
  return[r, g, b, a]
}, bytesToInt24:function(r, g, b) {
  if(r.length) {
    b = r[2];
    g = r[1];
    r = r[0]
  }
  return r << 16 | g << 8 | b
}, bytesToInt32:function(r, g, b, a) {
  if(r.length) {
    a = r[3];
    b = r[2];
    g = r[1];
    r = r[0]
  }
  return(r << 24 | g << 16 | b << 8 | a) >>> 32
}, lerp:function(a, b, alpha) {
  return a + (b - a) * pc.math.clamp(alpha, 0, 1)
}, lerpAngle:function(a, b, alpha) {
  if(b - a > 180) {
    b -= 360
  }
  if(b - a < -180) {
    b += 360
  }
  return pc.math.lerp(a, b, pc.math.clamp(alpha, 0, 1))
}, powerOfTwo:function(x) {
  return x !== 0 && !(x & x - 1)
}, random:function(min, max) {
  var diff = max - min;
  return Math.random() * diff + min
}, smoothstep:function(min, max, x) {
  if(x <= min) {
    return 0
  }
  if(x >= max) {
    return 1
  }
  x = (x - min) / (max - min);
  return x * x * (3 - 2 * x)
}, smootherstep:function(min, max, x) {
  if(x <= min) {
    return 0
  }
  if(x >= max) {
    return 1
  }
  x = (x - min) / (max - min);
  return x * x * x * (x * (x * 6 - 15) + 10)
}};
pc.math.intToBytes = pc.math.intToBytes32;
pc.math.bytesToInt = pc.math.bytesToInt32;
pc.extend(pc, function() {
  var Vec2 = function() {
    this.data = new Float32Array(2);
    if(arguments.length === 2) {
      this.data.set(arguments)
    }else {
      this.data[0] = 0;
      this.data[1] = 0
    }
  };
  Vec2.prototype = {add:function(rhs) {
    var a = this.data, b = rhs.data;
    a[0] += b[0];
    a[1] += b[1];
    return this
  }, add2:function(lhs, rhs) {
    var a = lhs.data, b = rhs.data, r = this.data;
    r[0] = a[0] + b[0];
    r[1] = a[1] + b[1];
    return this
  }, clone:function() {
    return(new Vec2).copy(this)
  }, copy:function(rhs) {
    var a = this.data, b = rhs.data;
    a[0] = b[0];
    a[1] = b[1];
    return this
  }, dot:function(rhs) {
    var a = this.data, b = rhs.data;
    return a[0] * b[0] + a[1] * b[1]
  }, equals:function(rhs) {
    var a = this.data, b = rhs.data;
    return a[0] === b[0] && a[1] === b[1]
  }, length:function() {
    var v = this.data;
    return Math.sqrt(v[0] * v[0] + v[1] * v[1])
  }, lengthSq:function() {
    var v = this.data;
    return v[0] * v[0] + v[1] * v[1]
  }, lerp:function(lhs, rhs, alpha) {
    var a = lhs.data, b = rhs.data, r = this.data;
    r[0] = a[0] + alpha * (b[0] - a[0]);
    r[1] = a[1] + alpha * (b[1] - a[1]);
    return this
  }, mul:function(rhs) {
    var a = this.data, b = rhs.data;
    a[0] *= b[0];
    a[1] *= b[1];
    return this
  }, mul2:function(lhs, rhs) {
    var a = lhs.data, b = rhs.data, r = this.data;
    r[0] = a[0] * b[0];
    r[1] = a[1] * b[1];
    return this
  }, normalize:function() {
    return this.scale(1 / this.length())
  }, scale:function(scalar) {
    var v = this.data;
    v[0] *= scalar;
    v[1] *= scalar;
    return this
  }, set:function(x, y) {
    var v = this.data;
    v[0] = x;
    v[1] = y;
    return this
  }, sub:function(rhs) {
    var a = this.data, b = rhs.data;
    a[0] -= b[0];
    a[1] -= b[1];
    return this
  }, sub2:function(lhs, rhs) {
    var a = lhs.data, b = rhs.data, r = this.data;
    r[0] = a[0] - b[0];
    r[1] = a[1] - b[1];
    return this
  }, toString:function() {
    return"[" + this.data[0] + ", " + this.data[1] + "]"
  }};
  Object.defineProperty(Vec2.prototype, "x", {get:function() {
    return this.data[0]
  }, set:function(value) {
    this.data[0] = value
  }});
  Object.defineProperty(Vec2.prototype, "y", {get:function() {
    return this.data[1]
  }, set:function(value) {
    this.data[1] = value
  }});
  Object.defineProperty(Vec2, "ONE", {get:function() {
    var one = new Vec2(1, 1);
    return function() {
      return one
    }
  }()});
  Object.defineProperty(Vec2, "RIGHT", {get:function() {
    var right = new Vec2(1, 0);
    return function() {
      return right
    }
  }()});
  Object.defineProperty(Vec2, "UP", {get:function() {
    var down = new Vec2(0, 1);
    return function() {
      return down
    }
  }()});
  Object.defineProperty(Vec2, "ZERO", {get:function() {
    var zero = new Vec2(0, 0);
    return function() {
      return zero
    }
  }()});
  return{Vec2:Vec2}
}());
pc.extend(pc, function() {
  var Vec3 = function() {
    this.data = new Float32Array(3);
    if(arguments.length === 3) {
      this.data.set(arguments)
    }else {
      this.data[0] = 0;
      this.data[1] = 0;
      this.data[2] = 0
    }
  };
  Vec3.prototype = {add:function(rhs) {
    var a = this.data, b = rhs.data;
    a[0] += b[0];
    a[1] += b[1];
    a[2] += b[2];
    return this
  }, add2:function(lhs, rhs) {
    var a = lhs.data, b = rhs.data, r = this.data;
    r[0] = a[0] + b[0];
    r[1] = a[1] + b[1];
    r[2] = a[2] + b[2];
    return this
  }, clone:function() {
    return(new Vec3).copy(this)
  }, copy:function(rhs) {
    var a = this.data, b = rhs.data;
    a[0] = b[0];
    a[1] = b[1];
    a[2] = b[2];
    return this
  }, cross:function(lhs, rhs) {
    var a, b, r, ax, ay, az, bx, by, bz;
    a = lhs.data;
    b = rhs.data;
    r = this.data;
    ax = a[0];
    ay = a[1];
    az = a[2];
    bx = b[0];
    by = b[1];
    bz = b[2];
    r[0] = ay * bz - by * az;
    r[1] = az * bx - bz * ax;
    r[2] = ax * by - bx * ay;
    return this
  }, dot:function(rhs) {
    var a = this.data, b = rhs.data;
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
  }, equals:function(rhs) {
    var a = this.data, b = rhs.data;
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2]
  }, length:function() {
    var v = this.data;
    return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2])
  }, lengthSq:function() {
    var v = this.data;
    return v[0] * v[0] + v[1] * v[1] + v[2] * v[2]
  }, lerp:function(lhs, rhs, alpha) {
    var a = lhs.data, b = rhs.data, r = this.data;
    r[0] = a[0] + alpha * (b[0] - a[0]);
    r[1] = a[1] + alpha * (b[1] - a[1]);
    r[2] = a[2] + alpha * (b[2] - a[2]);
    return this
  }, mul:function(rhs) {
    var a = this.data, b = rhs.data;
    a[0] *= b[0];
    a[1] *= b[1];
    a[2] *= b[2];
    return this
  }, mul2:function(lhs, rhs) {
    var a = lhs.data, b = rhs.data, r = this.data;
    r[0] = a[0] * b[0];
    r[1] = a[1] * b[1];
    r[2] = a[2] * b[2];
    return this
  }, normalize:function() {
    return this.scale(1 / this.length())
  }, project:function(rhs) {
    var a = this.data;
    var b = rhs.data;
    var a_dot_b = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    var b_dot_b = b[0] * b[0] + b[1] * b[1] + b[2] * b[2];
    var s = a_dot_b / b_dot_b;
    a[0] = b[0] * s;
    a[1] = b[1] * s;
    a[2] = b[2] * s;
    return this
  }, scale:function(scalar) {
    var v = this.data;
    v[0] *= scalar;
    v[1] *= scalar;
    v[2] *= scalar;
    return this
  }, set:function(x, y, z) {
    var v = this.data;
    v[0] = x;
    v[1] = y;
    v[2] = z;
    return this
  }, sub:function(rhs) {
    var a = this.data, b = rhs.data;
    a[0] -= b[0];
    a[1] -= b[1];
    a[2] -= b[2];
    return this
  }, sub2:function(lhs, rhs) {
    var a = lhs.data, b = rhs.data, r = this.data;
    r[0] = a[0] - b[0];
    r[1] = a[1] - b[1];
    r[2] = a[2] - b[2];
    return this
  }, toString:function() {
    return"[" + this.data[0] + ", " + this.data[1] + ", " + this.data[2] + "]"
  }};
  Object.defineProperty(Vec3.prototype, "x", {get:function() {
    return this.data[0]
  }, set:function(value) {
    this.data[0] = value
  }});
  Object.defineProperty(Vec3.prototype, "y", {get:function() {
    return this.data[1]
  }, set:function(value) {
    this.data[1] = value
  }});
  Object.defineProperty(Vec3.prototype, "z", {get:function() {
    return this.data[2]
  }, set:function(value) {
    this.data[2] = value
  }});
  Object.defineProperty(Vec3, "BACK", {get:function() {
    var back = new Vec3(0, 0, 1);
    return function() {
      return back
    }
  }()});
  Object.defineProperty(Vec3, "DOWN", {get:function() {
    var down = new Vec3(0, -1, 0);
    return function() {
      return down
    }
  }()});
  Object.defineProperty(Vec3, "FORWARD", {get:function() {
    var forward = new Vec3(0, 0, -1);
    return function() {
      return forward
    }
  }()});
  Object.defineProperty(Vec3, "LEFT", {get:function() {
    var left = new Vec3(-1, 0, 0);
    return function() {
      return left
    }
  }()});
  Object.defineProperty(Vec3, "ONE", {get:function() {
    var one = new Vec3(1, 1, 1);
    return function() {
      return one
    }
  }()});
  Object.defineProperty(Vec3, "RIGHT", {get:function() {
    var right = new Vec3(1, 0, 0);
    return function() {
      return right
    }
  }()});
  Object.defineProperty(Vec3, "UP", {get:function() {
    var down = new Vec3(0, 1, 0);
    return function() {
      return down
    }
  }()});
  Object.defineProperty(Vec3, "ZERO", {get:function() {
    var zero = new Vec3(0, 0, 0);
    return function() {
      return zero
    }
  }()});
  return{Vec3:Vec3}
}());
pc.extend(pc, function() {
  var Vec4 = function() {
    this.data = new Float32Array(4);
    if(arguments.length === 4) {
      this.data.set(arguments)
    }else {
      this.data[0] = 0;
      this.data[1] = 0;
      this.data[2] = 0;
      this.data[3] = 0
    }
  };
  Vec4.prototype = {add:function(rhs) {
    var a = this.data, b = rhs.data;
    a[0] += b[0];
    a[1] += b[1];
    a[2] += b[2];
    a[3] += b[3];
    return this
  }, add2:function(lhs, rhs) {
    var a = lhs.data, b = rhs.data, r = this.data;
    r[0] = a[0] + b[0];
    r[1] = a[1] + b[1];
    r[2] = a[2] + b[2];
    r[3] = a[3] + b[3];
    return this
  }, clone:function() {
    return(new Vec4).copy(this)
  }, copy:function(rhs) {
    var a = this.data, b = rhs.data;
    a[0] = b[0];
    a[1] = b[1];
    a[2] = b[2];
    a[3] = b[3];
    return this
  }, dot:function(rhs) {
    var a = this.data, b = rhs.data;
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]
  }, equals:function(rhs) {
    var a = this.data, b = rhs.data;
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3]
  }, length:function() {
    var v = this.data;
    return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2] + v[3] * v[3])
  }, lengthSq:function() {
    var v = this.data;
    return v[0] * v[0] + v[1] * v[1] + v[2] * v[2] + v[3] * v[3]
  }, lerp:function(lhs, rhs, alpha) {
    var a = lhs.data, b = rhs.data, r = this.data;
    r[0] = a[0] + alpha * (b[0] - a[0]);
    r[1] = a[1] + alpha * (b[1] - a[1]);
    r[2] = a[2] + alpha * (b[2] - a[2]);
    r[3] = a[3] + alpha * (b[3] - a[3]);
    return this
  }, mul:function(rhs) {
    var a = this.data, b = rhs.data;
    a[0] *= b[0];
    a[1] *= b[1];
    a[2] *= b[2];
    a[3] *= b[3];
    return this
  }, mul2:function(lhs, rhs) {
    var a = lhs.data, b = rhs.data, r = this.data;
    r[0] = a[0] * b[0];
    r[1] = a[1] * b[1];
    r[2] = a[2] * b[2];
    r[3] = a[3] * b[3];
    return this
  }, normalize:function() {
    return this.scale(1 / this.length())
  }, scale:function(scalar) {
    var v = this.data;
    v[0] *= scalar;
    v[1] *= scalar;
    v[2] *= scalar;
    v[3] *= scalar;
    return this
  }, set:function(x, y, z, w) {
    var v = this.data;
    v[0] = x;
    v[1] = y;
    v[2] = z;
    v[3] = w;
    return this
  }, sub:function(rhs) {
    var a = this.data, b = rhs.data;
    a[0] -= b[0];
    a[1] -= b[1];
    a[2] -= b[2];
    a[3] -= b[3];
    return this
  }, sub2:function(lhs, rhs) {
    var a = lhs.data, b = rhs.data, r = this.data;
    r[0] = a[0] - b[0];
    r[1] = a[1] - b[1];
    r[2] = a[2] - b[2];
    r[3] = a[3] - b[3];
    return this
  }, toString:function() {
    return"[" + this.data[0] + ", " + this.data[1] + ", " + this.data[2] + ", " + this.data[3] + "]"
  }};
  Object.defineProperty(Vec4.prototype, "x", {get:function() {
    return this.data[0]
  }, set:function(value) {
    this.data[0] = value
  }});
  Object.defineProperty(Vec4.prototype, "y", {get:function() {
    return this.data[1]
  }, set:function(value) {
    this.data[1] = value
  }});
  Object.defineProperty(Vec4.prototype, "z", {get:function() {
    return this.data[2]
  }, set:function(value) {
    this.data[2] = value
  }});
  Object.defineProperty(Vec4.prototype, "w", {get:function() {
    return this.data[3]
  }, set:function(value) {
    this.data[3] = value
  }});
  Object.defineProperty(Vec4, "ONE", {get:function() {
    var one = new Vec4(1, 1, 1, 1);
    return function() {
      return one
    }
  }()});
  Object.defineProperty(Vec4, "ZERO", {get:function() {
    var zero = new Vec4(0, 0, 0, 0);
    return function() {
      return zero
    }
  }()});
  return{Vec4:Vec4}
}());
pc.extend(pc, function() {
  var Mat3 = function() {
    this.data = new Float32Array(9);
    if(arguments.length === 9) {
      this.data.set(arguments)
    }else {
      this.setIdentity()
    }
  };
  Mat3.prototype = {clone:function() {
    return(new pc.Mat3).copy(this)
  }, copy:function(rhs) {
    var src = rhs.data;
    var dst = this.data;
    dst[0] = src[0];
    dst[1] = src[1];
    dst[2] = src[2];
    dst[3] = src[3];
    dst[4] = src[4];
    dst[5] = src[5];
    dst[6] = src[6];
    dst[7] = src[7];
    dst[8] = src[8];
    return this
  }, equals:function(rhs) {
    var l = this.data;
    var r = rhs.data;
    return;
    l[0] === r[0] && l[1] === r[1] && l[2] === r[2] && l[3] === r[3] && l[4] === r[4] && l[5] === r[5] && l[6] === r[6] && l[7] === r[7] && l[8] === r[8]
  }, isIdentity:function() {
    var m = this.data;
    return;
    m[0] === 1 && m[1] === 0 && m[2] === 0 && m[3] === 0 && m[4] === 1 && m[5] === 0 && m[6] === 0 && m[7] === 0 && m[8] === 1
  }, setIdentity:function() {
    var m = this.data;
    m[0] = 1;
    m[1] = 0;
    m[2] = 0;
    m[3] = 0;
    m[4] = 0;
    m[5] = 1;
    m[6] = 0;
    m[7] = 0;
    m[8] = 0;
    m[9] = 0;
    m[10] = 1;
    m[11] = 0;
    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;
    return this
  }, toString:function() {
    var t = "[";
    for(var i = 0;i < 9;i++) {
      t += this.data[i];
      t += i !== 9 ? ", " : ""
    }
    t += "]";
    return t
  }, transpose:function() {
    var m = this.data;
    var tmp;
    tmp = m[1];
    m[1] = m[3];
    m[3] = tmp;
    tmp = m[2];
    m[2] = m[6];
    m[6] = tmp;
    tmp = m[5];
    m[5] = m[7];
    m[7] = tmp;
    return this
  }};
  Object.defineProperty(Mat3, "IDENTITY", {get:function() {
    var identity = new Mat3;
    return function() {
      return identity
    }
  }()});
  Object.defineProperty(Mat3, "ZERO", {get:function() {
    var zero = new Mat3(0, 0, 0, 0, 0, 0, 0, 0, 0);
    return function() {
      return zero
    }
  }()});
  return{Mat3:Mat3}
}());
pc.extend(pc, function() {
  var Mat4 = function() {
    this.data = new Float32Array(16);
    if(arguments.length === 16) {
      this.data.set(arguments)
    }else {
      this.setIdentity()
    }
  };
  Mat4.prototype = {add2:function(lhs, rhs) {
    var a = lhs.data, b = rhs.data, r = this.data;
    r[0] = a[0] + b[0];
    r[1] = a[1] + b[1];
    r[2] = a[2] + b[2];
    r[3] = a[3] + b[3];
    r[4] = a[4] + b[4];
    r[5] = a[5] + b[5];
    r[6] = a[6] + b[6];
    r[7] = a[7] + b[7];
    r[8] = a[8] + b[8];
    r[9] = a[9] + b[9];
    r[10] = a[10] + b[10];
    r[11] = a[11] + b[11];
    r[12] = a[12] + b[12];
    r[13] = a[13] + b[13];
    r[14] = a[14] + b[14];
    r[15] = a[15] + b[15];
    return this
  }, add:function(rhs) {
    return this.add2(this, rhs)
  }, clone:function() {
    return(new pc.Mat4).copy(this)
  }, copy:function(rhs) {
    var src = rhs.data, dst = this.data;
    dst[0] = src[0];
    dst[1] = src[1];
    dst[2] = src[2];
    dst[3] = src[3];
    dst[4] = src[4];
    dst[5] = src[5];
    dst[6] = src[6];
    dst[7] = src[7];
    dst[8] = src[8];
    dst[9] = src[9];
    dst[10] = src[10];
    dst[11] = src[11];
    dst[12] = src[12];
    dst[13] = src[13];
    dst[14] = src[14];
    dst[15] = src[15];
    return this
  }, equals:function(rhs) {
    var l = this.data, r = rhs.data;
    return l[0] === r[0] && l[1] === r[1] && l[2] === r[2] && l[3] === r[3] && l[4] === r[4] && l[5] === r[5] && l[6] === r[6] && l[7] === r[7] && l[8] === r[8] && l[9] === r[9] && l[10] === r[10] && l[11] === r[11] && l[12] === r[12] && l[13] === r[13] && l[14] === r[14] && l[15] === r[15]
  }, isIdentity:function() {
    var m = this.data;
    return m[0] === 1 && m[1] === 0 && m[2] === 0 && m[3] === 0 && m[4] === 0 && m[5] === 1 && m[6] === 0 && m[7] === 0 && m[8] === 0 && m[9] === 0 && m[10] === 1 && m[11] === 0 && m[12] === 0 && m[13] === 0 && m[14] === 0 && m[15] === 1
  }, mul2:function(lhs, rhs) {
    var a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33, b0, b1, b2, b3, a = lhs.data, b = rhs.data, r = this.data;
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    a30 = a[12];
    a31 = a[13];
    a32 = a[14];
    a33 = a[15];
    b0 = b[0];
    b1 = b[1];
    b2 = b[2];
    b3 = b[3];
    r[0] = a00 * b0 + a10 * b1 + a20 * b2 + a30 * b3;
    r[1] = a01 * b0 + a11 * b1 + a21 * b2 + a31 * b3;
    r[2] = a02 * b0 + a12 * b1 + a22 * b2 + a32 * b3;
    r[3] = a03 * b0 + a13 * b1 + a23 * b2 + a33 * b3;
    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    r[4] = a00 * b0 + a10 * b1 + a20 * b2 + a30 * b3;
    r[5] = a01 * b0 + a11 * b1 + a21 * b2 + a31 * b3;
    r[6] = a02 * b0 + a12 * b1 + a22 * b2 + a32 * b3;
    r[7] = a03 * b0 + a13 * b1 + a23 * b2 + a33 * b3;
    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    r[8] = a00 * b0 + a10 * b1 + a20 * b2 + a30 * b3;
    r[9] = a01 * b0 + a11 * b1 + a21 * b2 + a31 * b3;
    r[10] = a02 * b0 + a12 * b1 + a22 * b2 + a32 * b3;
    r[11] = a03 * b0 + a13 * b1 + a23 * b2 + a33 * b3;
    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    r[12] = a00 * b0 + a10 * b1 + a20 * b2 + a30 * b3;
    r[13] = a01 * b0 + a11 * b1 + a21 * b2 + a31 * b3;
    r[14] = a02 * b0 + a12 * b1 + a22 * b2 + a32 * b3;
    r[15] = a03 * b0 + a13 * b1 + a23 * b2 + a33 * b3;
    return this
  }, mul:function(rhs) {
    return this.mul2(this, rhs)
  }, transformPoint:function(vec, res) {
    var x, y, z, m = this.data, v = vec.data;
    res = res === undefined ? new pc.Vec3 : res;
    x = v[0] * m[0] + v[1] * m[4] + v[2] * m[8] + m[12];
    y = v[0] * m[1] + v[1] * m[5] + v[2] * m[9] + m[13];
    z = v[0] * m[2] + v[1] * m[6] + v[2] * m[10] + m[14];
    return res.set(x, y, z)
  }, transformVector:function(vec, res) {
    var x, y, z, m = this.data, v = vec.data;
    res = res === undefined ? new pc.Vec3 : res;
    x = v[0] * m[0] + v[1] * m[4] + v[2] * m[8];
    y = v[0] * m[1] + v[1] * m[5] + v[2] * m[9];
    z = v[0] * m[2] + v[1] * m[6] + v[2] * m[10];
    return res.set(x, y, z)
  }, setLookAt:function() {
    var x, y, z;
    x = new pc.Vec3;
    y = new pc.Vec3;
    z = new pc.Vec3;
    return function(position, target, up) {
      z.sub2(position, target).normalize();
      y.copy(up).normalize();
      x.cross(y, z).normalize();
      y.cross(z, x);
      var r = this.data;
      r[0] = x.x;
      r[1] = x.y;
      r[2] = x.z;
      r[3] = 0;
      r[4] = y.x;
      r[5] = y.y;
      r[6] = y.z;
      r[7] = 0;
      r[8] = z.x;
      r[9] = z.y;
      r[10] = z.z;
      r[11] = 0;
      r[12] = position.x;
      r[13] = position.y;
      r[14] = position.z;
      r[15] = 1;
      return this
    }
  }(), setFrustum:function(left, right, bottom, top, znear, zfar) {
    var temp1, temp2, temp3, temp4, r;
    temp1 = 2 * znear;
    temp2 = right - left;
    temp3 = top - bottom;
    temp4 = zfar - znear;
    r = this.data;
    r[0] = temp1 / temp2;
    r[1] = 0;
    r[2] = 0;
    r[3] = 0;
    r[4] = 0;
    r[5] = temp1 / temp3;
    r[6] = 0;
    r[7] = 0;
    r[8] = (right + left) / temp2;
    r[9] = (top + bottom) / temp3;
    r[10] = (-zfar - znear) / temp4;
    r[11] = -1;
    r[12] = 0;
    r[13] = 0;
    r[14] = -temp1 * zfar / temp4;
    r[15] = 0;
    return this
  }, setPerspective:function(fovy, aspect, znear, zfar) {
    var xmax, ymax;
    ymax = znear * Math.tan(fovy * Math.PI / 360);
    xmax = ymax * aspect;
    return this.setFrustum(-xmax, xmax, -ymax, ymax, znear, zfar)
  }, setOrtho:function(left, right, bottom, top, near, far) {
    var r = this.data;
    r[0] = 2 / (right - left);
    r[1] = 0;
    r[2] = 0;
    r[3] = 0;
    r[4] = 0;
    r[5] = 2 / (top - bottom);
    r[6] = 0;
    r[7] = 0;
    r[8] = 0;
    r[9] = 0;
    r[10] = -2 / (far - near);
    r[11] = 0;
    r[12] = -(right + left) / (right - left);
    r[13] = -(top + bottom) / (top - bottom);
    r[14] = -(far + near) / (far - near);
    r[15] = 1;
    return this
  }, setFromAxisAngle:function(axis, angle) {
    var x, y, z, c, s, t, tx, ty, m;
    angle *= pc.math.DEG_TO_RAD;
    x = axis.x;
    y = axis.y;
    z = axis.z;
    c = Math.cos(angle);
    s = Math.sin(angle);
    t = 1 - c;
    tx = t * x;
    ty = t * y;
    m = this.data;
    m[0] = tx * x + c;
    m[1] = tx * y + s * z;
    m[2] = tx * z - s * y;
    m[3] = 0;
    m[4] = tx * y - s * z;
    m[5] = ty * y + c;
    m[6] = ty * z + s * x;
    m[7] = 0;
    m[8] = tx * z + s * y;
    m[9] = ty * z - x * s;
    m[10] = t * z * z + c;
    m[11] = 0;
    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;
    return this
  }, setTranslate:function(tx, ty, tz) {
    var m = this.data;
    m[0] = 1;
    m[1] = 0;
    m[2] = 0;
    m[3] = 0;
    m[4] = 0;
    m[5] = 1;
    m[6] = 0;
    m[7] = 0;
    m[8] = 0;
    m[9] = 0;
    m[10] = 1;
    m[11] = 0;
    m[12] = tx;
    m[13] = ty;
    m[14] = tz;
    m[15] = 1;
    return this
  }, setScale:function(sx, sy, sz) {
    var m = this.data;
    m[0] = sx;
    m[1] = 0;
    m[2] = 0;
    m[3] = 0;
    m[4] = 0;
    m[5] = sy;
    m[6] = 0;
    m[7] = 0;
    m[8] = 0;
    m[9] = 0;
    m[10] = sz;
    m[11] = 0;
    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;
    return this
  }, invert:function() {
    var a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33, b00, b01, b02, b03, b04, b05, b06, b07, b08, b09, b10, b11, invDet, m;
    m = this.data;
    a00 = m[0];
    a01 = m[1];
    a02 = m[2];
    a03 = m[3];
    a10 = m[4];
    a11 = m[5];
    a12 = m[6];
    a13 = m[7];
    a20 = m[8];
    a21 = m[9];
    a22 = m[10];
    a23 = m[11];
    a30 = m[12];
    a31 = m[13];
    a32 = m[14];
    a33 = m[15];
    b00 = a00 * a11 - a01 * a10;
    b01 = a00 * a12 - a02 * a10;
    b02 = a00 * a13 - a03 * a10;
    b03 = a01 * a12 - a02 * a11;
    b04 = a01 * a13 - a03 * a11;
    b05 = a02 * a13 - a03 * a12;
    b06 = a20 * a31 - a21 * a30;
    b07 = a20 * a32 - a22 * a30;
    b08 = a20 * a33 - a23 * a30;
    b09 = a21 * a32 - a22 * a31;
    b10 = a21 * a33 - a23 * a31;
    b11 = a22 * a33 - a23 * a32;
    invDet = 1 / (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06);
    m[0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
    m[1] = (-a01 * b11 + a02 * b10 - a03 * b09) * invDet;
    m[2] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
    m[3] = (-a21 * b05 + a22 * b04 - a23 * b03) * invDet;
    m[4] = (-a10 * b11 + a12 * b08 - a13 * b07) * invDet;
    m[5] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
    m[6] = (-a30 * b05 + a32 * b02 - a33 * b01) * invDet;
    m[7] = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;
    m[8] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;
    m[9] = (-a00 * b10 + a01 * b08 - a03 * b06) * invDet;
    m[10] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;
    m[11] = (-a20 * b04 + a21 * b02 - a23 * b00) * invDet;
    m[12] = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet;
    m[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
    m[14] = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet;
    m[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;
    return this
  }, setIdentity:function() {
    var m = this.data;
    m[0] = 1;
    m[1] = 0;
    m[2] = 0;
    m[3] = 0;
    m[4] = 0;
    m[5] = 1;
    m[6] = 0;
    m[7] = 0;
    m[8] = 0;
    m[9] = 0;
    m[10] = 1;
    m[11] = 0;
    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;
    return this
  }, setTRS:function(t, r, s) {
    var tx, ty, tz, qx, qy, qz, qw, sx, sy, sz, x2, y2, z2, xx, xy, xz, yy, yz, zz, wx, wy, wz, m;
    tx = t.x;
    ty = t.y;
    tz = t.z;
    qx = r.x;
    qy = r.y;
    qz = r.z;
    qw = r.w;
    sx = s.x;
    sy = s.y;
    sz = s.z;
    x2 = qx + qx;
    y2 = qy + qy;
    z2 = qz + qz;
    xx = qx * x2;
    xy = qx * y2;
    xz = qx * z2;
    yy = qy * y2;
    yz = qy * z2;
    zz = qz * z2;
    wx = qw * x2;
    wy = qw * y2;
    wz = qw * z2;
    m = this.data;
    m[0] = (1 - (yy + zz)) * sx;
    m[1] = (xy + wz) * sx;
    m[2] = (xz - wy) * sx;
    m[3] = 0;
    m[4] = (xy - wz) * sy;
    m[5] = (1 - (xx + zz)) * sy;
    m[6] = (yz + wx) * sy;
    m[7] = 0;
    m[8] = (xz + wy) * sz;
    m[9] = (yz - wx) * sz;
    m[10] = (1 - (xx + yy)) * sz;
    m[11] = 0;
    m[12] = tx;
    m[13] = ty;
    m[14] = tz;
    m[15] = 1;
    return this
  }, transpose:function() {
    var tmp, m = this.data;
    tmp = m[1];
    m[1] = m[4];
    m[4] = tmp;
    tmp = m[2];
    m[2] = m[8];
    m[8] = tmp;
    tmp = m[3];
    m[3] = m[12];
    m[12] = tmp;
    tmp = m[6];
    m[6] = m[9];
    m[9] = tmp;
    tmp = m[7];
    m[7] = m[13];
    m[13] = tmp;
    tmp = m[11];
    m[11] = m[14];
    m[14] = tmp;
    return this
  }, invertTo3x3:function(res) {
    var a11, a21, a31, a12, a22, a32, a13, a23, a33, m, r, det, idet;
    m = this.data;
    r = res.data;
    a11 = m[10] * m[5] - m[6] * m[9];
    a21 = -m[10] * m[1] + m[2] * m[9];
    a31 = m[6] * m[1] - m[2] * m[5];
    a12 = -m[10] * m[4] + m[6] * m[8];
    a22 = m[10] * m[0] - m[2] * m[8];
    a32 = -m[6] * m[0] + m[2] * m[4];
    a13 = m[9] * m[4] - m[5] * m[8];
    a23 = -m[9] * m[0] + m[1] * m[8];
    a33 = m[5] * m[0] - m[1] * m[4];
    det = m[0] * a11 + m[1] * a12 + m[2] * a13;
    if(det === 0) {
      console.warn("pc.Mat4#invertTo3x3: Matrix not invertible");
      return this
    }
    idet = 1 / det;
    r[0] = idet * a11;
    r[1] = idet * a21;
    r[2] = idet * a31;
    r[3] = idet * a12;
    r[4] = idet * a22;
    r[5] = idet * a32;
    r[6] = idet * a13;
    r[7] = idet * a23;
    r[8] = idet * a33;
    return this
  }, getTranslation:function(t) {
    t = t === undefined ? new pc.Vec3 : t;
    return t.set(this.data[12], this.data[13], this.data[14])
  }, getX:function(x) {
    x = x === undefined ? new pc.Vec3 : x;
    return x.set(this.data[0], this.data[1], this.data[2])
  }, getY:function(y) {
    y = y === undefined ? new pc.Vec3 : y;
    return y.set(this.data[4], this.data[5], this.data[6])
  }, getZ:function(z) {
    z = z === undefined ? new pc.Vec3 : z;
    return z.set(this.data[8], this.data[9], this.data[10])
  }, getScale:function() {
    var x, y, z;
    x = new pc.Vec3;
    y = new pc.Vec3;
    z = new pc.Vec3;
    return function(scale) {
      scale = scale === undefined ? new pc.Vec3 : scale;
      this.getX(x);
      this.getY(y);
      this.getZ(z);
      scale.set(x.length(), y.length(), z.length());
      return scale
    }
  }(), setFromEulerAngles:function(ex, ey, ez) {
    var s1, c1, s2, c2, s3, c3, m;
    ex *= pc.math.DEG_TO_RAD;
    ey *= pc.math.DEG_TO_RAD;
    ez *= pc.math.DEG_TO_RAD;
    s1 = Math.sin(-ex);
    c1 = Math.cos(-ex);
    s2 = Math.sin(-ey);
    c2 = Math.cos(-ey);
    s3 = Math.sin(-ez);
    c3 = Math.cos(-ez);
    m = this.data;
    m[0] = c2 * c3;
    m[1] = -c2 * s3;
    m[2] = s2;
    m[3] = 0;
    m[4] = c1 * s3 + c3 * s1 * s2;
    m[5] = c1 * c3 - s1 * s2 * s3;
    m[6] = -c2 * s1;
    m[7] = 0;
    m[8] = s1 * s3 - c1 * c3 * s2;
    m[9] = c3 * s1 + c1 * s2 * s3;
    m[10] = c1 * c2;
    m[11] = 0;
    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;
    return this
  }, getEulerAngles:function() {
    var scale = new pc.Vec3;
    return function(eulers) {
      var x, y, z, sx, sy, sz, m, halfPi;
      eulers = eulers === undefined ? new pc.Vec3 : eulers;
      this.getScale(scale);
      sx = scale.x;
      sy = scale.y;
      sz = scale.z;
      m = this.data;
      y = Math.asin(-m[2] / sx);
      halfPi = Math.PI * 0.5;
      if(y < halfPi) {
        if(y > -halfPi) {
          x = Math.atan2(m[6] / sy, m[10] / sz);
          z = Math.atan2(m[1] / sx, m[0] / sx)
        }else {
          z = 0;
          x = -Math.atan2(m[4] / sy, m[5] / sy)
        }
      }else {
        z = 0;
        x = Math.atan2(m[4] / sy, m[5] / sy)
      }
      return eulers.set(x, y, z).scale(pc.math.RAD_TO_DEG)
    }
  }(), toString:function() {
    var i, t;
    t = "[";
    for(i = 0;i < 16;i += 1) {
      t += this.data[i];
      t += i !== 15 ? ", " : ""
    }
    t += "]";
    return t
  }};
  Object.defineProperty(Mat4, "IDENTITY", {get:function() {
    var identity = new Mat4;
    return function() {
      return identity
    }
  }()});
  Object.defineProperty(Mat4, "ZERO", {get:function() {
    var zero = new Mat4(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    return function() {
      return zero
    }
  }()});
  return{Mat4:Mat4}
}());
pc.extend(pc, function() {
  var Quat = function(x, y, z, w) {
    this.x = x === undefined ? 0 : x;
    this.y = y === undefined ? 0 : y;
    this.z = z === undefined ? 0 : z;
    this.w = w === undefined ? 1 : w
  };
  Quat.prototype = {clone:function() {
    return new pc.Quat(this.x, this.y, this.z, this.w)
  }, conjugate:function() {
    this.x *= -1;
    this.y *= -1;
    this.z *= -1;
    return this
  }, copy:function(rhs) {
    this.x = rhs.x;
    this.y = rhs.y;
    this.z = rhs.z;
    this.w = rhs.w;
    return this
  }, equals:function(that) {
    return this.x === that.x && this.y === that.y && this.z === that.z && this.w === that.w
  }, getEulerAngles:function(eulers) {
    var x, y, z, qx, qy, qz, qw, a2;
    eulers = eulers === undefined ? new pc.Vec3 : eulers;
    qx = this.x;
    qy = this.y;
    qz = this.z;
    qw = this.w;
    a2 = 2 * (qw * qy - qx * qz);
    if(a2 <= -0.99999) {
      x = 2 * Math.atan2(qx, qw);
      y = -Math.PI / 2;
      z = 0
    }else {
      if(a2 >= 0.99999) {
        x = 2 * Math.atan2(qx, qw);
        y = Math.PI / 2;
        z = 0
      }else {
        x = Math.atan2(2 * (qw * qx + qy * qz), 1 - 2 * (qx * qx + qy * qy));
        y = Math.asin(a2);
        z = Math.atan2(2 * (qw * qz + qx * qy), 1 - 2 * (qy * qy + qz * qz))
      }
    }
    return eulers.set(x, y, z).scale(pc.math.RAD_TO_DEG)
  }, invert:function() {
    return this.conjugate().normalize()
  }, length:function() {
    var x, y, z, w;
    x = this.x;
    y = this.y;
    z = this.z;
    w = this.w;
    return Math.sqrt(x * x + y * y + z * z + w * w)
  }, lengthSq:function() {
    var v = this.data;
    return v[0] * v[0] + v[1] * v[1] + v[2] * v[2]
  }, mul:function(rhs) {
    var q1x, q1y, q1z, q1w, q2x, q2y, q2z, q2w;
    q1x = this.x;
    q1y = this.y;
    q1z = this.z;
    q1w = this.w;
    q2x = rhs.x;
    q2y = rhs.y;
    q2z = rhs.z;
    q2w = rhs.w;
    this.x = q1w * q2x + q1x * q2w + q1y * q2z - q1z * q2y;
    this.y = q1w * q2y + q1y * q2w + q1z * q2x - q1x * q2z;
    this.z = q1w * q2z + q1z * q2w + q1x * q2y - q1y * q2x;
    this.w = q1w * q2w - q1x * q2x - q1y * q2y - q1z * q2z;
    return this
  }, mul2:function(lhs, rhs) {
    var q1x, q1y, q1z, q1w, q2x, q2y, q2z, q2w;
    q1x = lhs.x;
    q1y = lhs.y;
    q1z = lhs.z;
    q1w = lhs.w;
    q2x = rhs.x;
    q2y = rhs.y;
    q2z = rhs.z;
    q2w = rhs.w;
    this.x = q1w * q2x + q1x * q2w + q1y * q2z - q1z * q2y;
    this.y = q1w * q2y + q1y * q2w + q1z * q2x - q1x * q2z;
    this.z = q1w * q2z + q1z * q2w + q1x * q2y - q1y * q2x;
    this.w = q1w * q2w - q1x * q2x - q1y * q2y - q1z * q2z;
    return this
  }, normalize:function() {
    var len = this.length();
    if(len === 0) {
      this.x = this.y = this.z = 0;
      this.w = 1
    }else {
      len = 1 / len;
      this.x *= len;
      this.y *= len;
      this.z *= len;
      this.w *= len
    }
    return this
  }, set:function(x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this
  }, setFromAxisAngle:function(axis, angle) {
    var sa, ca;
    angle *= 0.5 * pc.math.DEG_TO_RAD;
    sa = Math.sin(angle);
    ca = Math.cos(angle);
    this.x = sa * axis.x;
    this.y = sa * axis.y;
    this.z = sa * axis.z;
    this.w = ca;
    return this
  }, setFromEulerAngles:function(ex, ey, ez) {
    var sx, cx, sy, cy, sz, cz, halfToRad;
    halfToRad = 0.5 * pc.math.DEG_TO_RAD;
    ex *= halfToRad;
    ey *= halfToRad;
    ez *= halfToRad;
    sx = Math.sin(ex);
    cx = Math.cos(ex);
    sy = Math.sin(ey);
    cy = Math.cos(ey);
    sz = Math.sin(ez);
    cz = Math.cos(ez);
    this.x = sx * cy * cz - cx * sy * sz;
    this.y = cx * sy * cz + sx * cy * sz;
    this.z = cx * cy * sz - sx * sy * cz;
    this.w = cx * cy * cz + sx * sy * sz;
    return this
  }, setFromMat4:function(m) {
    var m00, m01, m02, m10, m11, m12, m20, m21, m22, tr, s, rs, lx, ly, lz;
    m = m.data;
    m00 = m[0];
    m01 = m[1];
    m02 = m[2];
    m10 = m[4];
    m11 = m[5];
    m12 = m[6];
    m20 = m[8];
    m21 = m[9];
    m22 = m[10];
    lx = 1 / Math.sqrt(m00 * m00 + m01 * m01 + m02 * m02);
    ly = 1 / Math.sqrt(m10 * m10 + m11 * m11 + m12 * m12);
    lz = 1 / Math.sqrt(m20 * m20 + m21 * m21 + m22 * m22);
    m00 *= lx;
    m01 *= lx;
    m02 *= lx;
    m10 *= ly;
    m11 *= ly;
    m12 *= ly;
    m20 *= lz;
    m21 *= lz;
    m22 *= lz;
    tr = m00 + m11 + m22;
    if(tr >= 0) {
      s = Math.sqrt(tr + 1);
      this.w = s * 0.5;
      s = 0.5 / s;
      this.x = (m12 - m21) * s;
      this.y = (m20 - m02) * s;
      this.z = (m01 - m10) * s
    }else {
      if(m00 > m11) {
        if(m00 > m22) {
          rs = m00 - (m11 + m22) + 1;
          rs = Math.sqrt(rs);
          this.x = rs * 0.5;
          rs = 0.5 / rs;
          this.w = (m12 - m21) * rs;
          this.y = (m01 + m10) * rs;
          this.z = (m02 + m20) * rs
        }else {
          rs = m22 - (m00 + m11) + 1;
          rs = Math.sqrt(rs);
          this.z = rs * 0.5;
          rs = 0.5 / rs;
          this.w = (m01 - m10) * rs;
          this.x = (m20 + m02) * rs;
          this.y = (m21 + m12) * rs
        }
      }else {
        if(m11 > m22) {
          rs = m11 - (m22 + m00) + 1;
          rs = Math.sqrt(rs);
          this.y = rs * 0.5;
          rs = 0.5 / rs;
          this.w = (m20 - m02) * rs;
          this.z = (m12 + m21) * rs;
          this.x = (m10 + m01) * rs
        }else {
          rs = m22 - (m00 + m11) + 1;
          rs = Math.sqrt(rs);
          this.z = rs * 0.5;
          rs = 0.5 / rs;
          this.w = (m01 - m10) * rs;
          this.x = (m20 + m02) * rs;
          this.y = (m21 + m12) * rs
        }
      }
    }
    return this
  }, slerp:function(lhs, rhs, alpha) {
    var q1x, q1y, q1z, q1w, q2x, q2y, q2z, q2w, omega, cosOmega, invSinOmega, flip, beta;
    q1x = lhs.x;
    q1y = lhs.y;
    q1z = lhs.z;
    q1w = lhs.w;
    q2x = rhs.x;
    q2y = rhs.y;
    q2z = rhs.z;
    q2w = rhs.w;
    cosOmega = q1x * q2x + q1y * q2y + q1z * q2z + q1w * q2w;
    flip = cosOmega < 0;
    if(flip) {
      cosOmega *= -1
    }
    beta = 1 - alpha;
    if(cosOmega < 1) {
      omega = Math.acos(cosOmega);
      invSinOmega = 1 / Math.sin(omega);
      beta = Math.sin(omega * beta) * invSinOmega;
      alpha = Math.sin(omega * alpha) * invSinOmega;
      if(flip) {
        alpha = -alpha
      }
    }
    this.x = beta * q1x + alpha * q2x;
    this.y = beta * q1y + alpha * q2y;
    this.z = beta * q1z + alpha * q2z;
    this.w = beta * q1w + alpha * q2w;
    return this
  }, transformVector:function(vec, res) {
    if(typeof res === "undefined") {
      res = new pc.Vec3
    }
    var x = vec.x, y = vec.y, z = vec.z;
    var qx = this.x, qy = this.y, qz = this.z, qw = this.w;
    var ix = qw * x + qy * z - qz * y;
    var iy = qw * y + qz * x - qx * z;
    var iz = qw * z + qx * y - qy * x;
    var iw = -qx * x - qy * y - qz * z;
    res.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    res.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    res.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return res
  }, toString:function() {
    return"[" + this.x + ", " + this.y + ", " + this.z + ", " + this.w + "]"
  }};
  Object.defineProperty(Quat, "IDENTITY", {get:function() {
    var identity = new Quat;
    return function() {
      return identity
    }
  }()});
  Object.defineProperty(Quat, "ZERO", {get:function() {
    var zero = new Quat(0, 0, 0, 0);
    return function() {
      return zero
    }
  }()});
  return{Quat:Quat}
}());
pc.shape = function() {
  var Shape = function Shape() {
  };
  Shape.prototype = {containsPoint:function(point) {
    throw new Error("Shape hasn't implemented containsPoint");
  }};
  return{Shape:Shape, Type:{CAPSULE:"Capsule", CONE:"Cone", CYLINDER:"Cylinder", CIRCLE:"Circle", RECT:"Rect"}}
}();
pc.shape.intersection = function() {
  return{aabbAabb:function(a, b) {
    var aMax = a.getMax();
    var aMin = a.getMin();
    var bMax = b.getMax();
    var bMin = b.getMin();
    return aMin[0] <= bMax[0] && aMax[0] >= bMin[0] && aMin[1] <= bMax[1] && aMax[1] >= bMin[1] && aMin[2] <= bMax[2] && aMax[2] >= bMin[2]
  }, rayAabb:function(rayOrigin, rayDir, aabb) {
    var diff = new pc.Vec3, absDiff, absDir, cross = new pc.Vec3, prod = new pc.Vec3, i;
    diff.sub2(rayOrigin, aabb.center);
    absDiff = new pc.Vec3(Math.abs(diff.x), Math.abs(diff.y), Math.abs(diff.z));
    prod.mul2(diff, rayDir);
    if(absDiff.x > aabb.halfExtents.x && prod.x >= 0) {
      return false
    }
    if(absDiff.y > aabb.halfExtents.y && prod.y >= 0) {
      return false
    }
    if(absDiff.z > aabb.halfExtents.z && prod.z >= 0) {
      return false
    }
    absDir = new pc.Vec3(Math.abs(rayDir.x), Math.abs(rayDir.y), Math.abs(rayDir.z));
    cross.cross(rayDir, diff);
    cross.set(Math.abs(cross.x), Math.abs(cross.y), Math.abs(cross.z));
    if(cross.x > aabb.halfExtents.y * absDir.z + aabb.halfExtents.z * absDir.y) {
      return false
    }
    if(cross.y > aabb.halfExtents.x * absDir.z + aabb.halfExtents.z * absDir.x) {
      return false
    }
    if(cross.z > aabb.halfExtents.x * absDir.y + aabb.halfExtents.y * absDir.x) {
      return false
    }
    return true
  }, raySphere:function(rayOrigin, rayDir, sphere, result) {
    var diff = new pc.Vec3;
    var a = 0;
    var b = 0;
    var c = 0;
    var discr = 0;
    result = result || {};
    diff.sub2(rayOrigin, sphere.center);
    if(diff.dot(diff) < sphere.radius * sphere.radius) {
      result.success = true;
      result.t = 0;
      return true
    }
    a = rayDir.dot(rayDir);
    b = 2 * rayDir.dot(diff);
    c = sphere.center.dot(sphere.center);
    c += rayOrigin.dot(rayOrigin);
    c -= 2 * sphere.center.dot(rayOrigin);
    c -= sphere.radius * sphere.radius;
    discr = b * b - 4 * a * c;
    if(discr < 0) {
      result.success = false;
      result.t = 0;
      return false
    }
    result.success = true;
    result.t = (-b - Math.sqrt(discr)) / (2 * a);
    return true
  }, rayTriangle:function(rayOrigin, rayDir, t, intersection) {
    var w0 = rayOrigin.clone().sub(t.v0);
    var a = -t.n.dot(w0);
    var b = t.n.dot(rayDir);
    if(Math.fabs(b) < 1E-8) {
      if(a === 0) {
        return 2
      }else {
        return 0
      }
    }
    var r = a / b;
    if(r < 0) {
      return 0
    }
    var fromOrigin = rayDir.clone().scale(r);
    intersection.add2(rayOrigin, fromOrigin);
    var w = (new pc.Vec3).sub2(intersection, t.v0);
    var wu = w.dot(t.u);
    var wv = w.dot(t.v);
    var s = (t.uv * wv - t.vv * wu) / t.d;
    if(s < 0 || s > 1) {
      return 0
    }
    var t = (t.uv * wu - t.uu * wv) / t.d;
    if(t < 0 || s + t > 1) {
      return 0
    }
    return 1
  }}
}();
pc.extend(pc.shape, function() {
  pc.shape.Type.AABB = "Aabb";
  var Aabb = function Aabb(center, halfExtents) {
    this.center = center || new pc.Vec3(0, 0, 0);
    this.halfExtents = halfExtents || new pc.Vec3(0.5, 0.5, 0.5);
    this.type = pc.shape.Type.AABB
  };
  Aabb = pc.inherits(Aabb, pc.shape.Shape);
  Aabb.prototype.add = function(other) {
    var tc = this.center;
    var th = this.halfExtents;
    var tminx = tc.x - th.x;
    var tmaxx = tc.x + th.x;
    var tminy = tc.y - th.y;
    var tmaxy = tc.y + th.y;
    var tminz = tc.z - th.z;
    var tmaxz = tc.z + th.z;
    var oc = other.center;
    var oh = other.halfExtents;
    var ominx = oc.x - oh.x;
    var omaxx = oc.x + oh.x;
    var ominy = oc.y - oh.y;
    var omaxy = oc.y + oh.y;
    var ominz = oc.z - oh.z;
    var omaxz = oc.z + oh.z;
    if(ominx < tminx) {
      tminx = ominx
    }
    if(omaxx > tmaxx) {
      tmaxx = omaxx
    }
    if(ominy < tminy) {
      tminy = ominy
    }
    if(omaxy > tmaxy) {
      tmaxy = omaxy
    }
    if(ominz < tminz) {
      tminz = ominz
    }
    if(omaxz > tmaxz) {
      tmaxz = omaxz
    }
    tc.set(tminx + tmaxx, tminy + tmaxy, tminz + tmaxz).scale(0.5);
    th.set(tmaxx - tminx, tmaxy - tminy, tmaxz - tminz).scale(0.5)
  };
  Aabb.prototype.copy = function(src) {
    this.center.copy(src.center);
    this.halfExtents.copy(src.halfExtents);
    this.type = src.type
  };
  Aabb.prototype.setMinMax = function(min, max) {
    this.center.add2(max, min).scale(0.5);
    this.halfExtents.sub2(max, min).scale(0.5)
  };
  Aabb.prototype.getMin = function() {
    return this.center.clone().sub(this.halfExtents)
  };
  Aabb.prototype.getMax = function() {
    return this.center.clone().add(this.halfExtents)
  };
  Aabb.prototype.containsPoint = function(point) {
    var min = this.getMin(), max = this.getMax(), i;
    for(i = 0;i < 3;++i) {
      if(point.data[i] < min.data[i] || point.data[i] > max.data[i]) {
        return false
      }
    }
    return true
  };
  Aabb.prototype.setFromTransformedAabb = function(aabb, m) {
    var bc = this.center;
    var br = this.halfExtents;
    var ac = aabb.center.data;
    var ar = aabb.halfExtents.data;
    m = m.data;
    var mx0 = m[0];
    var mx1 = m[4];
    var mx2 = m[8];
    var my0 = m[1];
    var my1 = m[5];
    var my2 = m[9];
    var mz0 = m[2];
    var mz1 = m[6];
    var mz2 = m[10];
    var mx0a = Math.abs(mx0);
    var mx1a = Math.abs(mx1);
    var mx2a = Math.abs(mx2);
    var my0a = Math.abs(my0);
    var my1a = Math.abs(my1);
    var my2a = Math.abs(my2);
    var mz0a = Math.abs(mz0);
    var mz1a = Math.abs(mz1);
    var mz2a = Math.abs(mz2);
    bc.set(m[12] + mx0 * ac[0] + mx1 * ac[1] + mx2 * ac[2], m[13] + my0 * ac[0] + my1 * ac[1] + my2 * ac[2], m[14] + mz0 * ac[0] + mz1 * ac[1] + mz2 * ac[2]);
    br.set(mx0a * ar[0] + mx1a * ar[1] + mx2a * ar[2], my0a * ar[0] + my1a * ar[1] + my2a * ar[2], mz0a * ar[0] + mz1a * ar[1] + mz2a * ar[2])
  };
  Aabb.prototype.compute = function(vertices) {
    var min = new pc.Vec3(vertices[0], vertices[1], vertices[2]);
    var max = new pc.Vec3(vertices[0], vertices[1], vertices[2]);
    var numVerts = vertices.length / 3;
    for(var i = 1;i < numVerts;i++) {
      var x = vertices[i * 3 + 0];
      var y = vertices[i * 3 + 1];
      var z = vertices[i * 3 + 2];
      if(x < min.x) {
        min.x = x
      }
      if(y < min.y) {
        min.y = y
      }
      if(z < min.z) {
        min.z = z
      }
      if(x > max.x) {
        max.x = x
      }
      if(y > max.y) {
        max.y = y
      }
      if(z > max.z) {
        max.z = z
      }
    }
    this.setMinMax(min, max)
  };
  return{Aabb:Aabb}
}());
pc.extend(pc.shape, function() {
  pc.shape.Type.BOX = "Box";
  var center = new pc.Vec3;
  var p = new pc.Vec3;
  var t = new pc.Mat4;
  var scale = new pc.Mat4;
  function Box(transform, halfExtents) {
    this.transform = typeof transform === "undefined" ? new pc.Mat4 : transform;
    this.halfExtents = typeof halfExtents === "undefined" ? new pc.Vec3(0.5, 0.5, 0.5) : halfExtents;
    this.type = pc.shape.Type.BOX
  }
  Box = pc.inherits(Box, pc.shape.Shape);
  Box.prototype.containsPoint = function(point) {
    this.transform.getTranslation(center);
    var extents = this.getHalfExtents();
    t.copy(this.transform);
    p.copy(extents).scale(2);
    scale.setTRS(pc.Vec3.ZERO, pc.Quat.IDENTITY, p);
    t.mul(scale).invert();
    t.transformPoint(point, p);
    var min = -0.5;
    var max = 0.5;
    if(p.x < min || p.x > max) {
      return false
    }else {
      if(p.y < min || p.y > max) {
        return false
      }else {
        if(p.z < min || p.z > max) {
          return false
        }
      }
    }
    return true
  };
  Box.prototype.getHalfExtents = function() {
    return this.halfExtents
  };
  return{Box:Box}
}());
pc.extend(pc.shape, function() {
  pc.shape.Type.FRUSTUM = "Frustum";
  var viewProj = new pc.Mat4;
  var Frustum = function Frustum(projectionMatrix, viewMatrix) {
    projectionMatrix = projectionMatrix || (new pc.Mat4).setPerspective(90, 16 / 9, 0.1, 1E3);
    viewMatrix = viewMatrix || new pc.Mat4;
    this.planes = [];
    for(var i = 0;i < 6;i++) {
      this.planes[i] = []
    }
    this.update(projectionMatrix, viewMatrix);
    this.type = pc.shape.Type.FRUSTUM
  };
  Frustum = pc.inherits(Frustum, pc.shape.Shape);
  Frustum.prototype.update = function(projectionMatrix, viewMatrix) {
    viewProj.mul2(projectionMatrix, viewMatrix);
    var vpm = viewProj.data;
    this.planes[0][0] = vpm[3] - vpm[0];
    this.planes[0][1] = vpm[7] - vpm[4];
    this.planes[0][2] = vpm[11] - vpm[8];
    this.planes[0][3] = vpm[15] - vpm[12];
    t = Math.sqrt(this.planes[0][0] * this.planes[0][0] + this.planes[0][1] * this.planes[0][1] + this.planes[0][2] * this.planes[0][2]);
    this.planes[0][0] /= t;
    this.planes[0][1] /= t;
    this.planes[0][2] /= t;
    this.planes[0][3] /= t;
    this.planes[1][0] = vpm[3] + vpm[0];
    this.planes[1][1] = vpm[7] + vpm[4];
    this.planes[1][2] = vpm[11] + vpm[8];
    this.planes[1][3] = vpm[15] + vpm[12];
    t = Math.sqrt(this.planes[1][0] * this.planes[1][0] + this.planes[1][1] * this.planes[1][1] + this.planes[1][2] * this.planes[1][2]);
    this.planes[1][0] /= t;
    this.planes[1][1] /= t;
    this.planes[1][2] /= t;
    this.planes[1][3] /= t;
    this.planes[2][0] = vpm[3] + vpm[1];
    this.planes[2][1] = vpm[7] + vpm[5];
    this.planes[2][2] = vpm[11] + vpm[9];
    this.planes[2][3] = vpm[15] + vpm[13];
    t = Math.sqrt(this.planes[2][0] * this.planes[2][0] + this.planes[2][1] * this.planes[2][1] + this.planes[2][2] * this.planes[2][2]);
    this.planes[2][0] /= t;
    this.planes[2][1] /= t;
    this.planes[2][2] /= t;
    this.planes[2][3] /= t;
    this.planes[3][0] = vpm[3] - vpm[1];
    this.planes[3][1] = vpm[7] - vpm[5];
    this.planes[3][2] = vpm[11] - vpm[9];
    this.planes[3][3] = vpm[15] - vpm[13];
    t = Math.sqrt(this.planes[3][0] * this.planes[3][0] + this.planes[3][1] * this.planes[3][1] + this.planes[3][2] * this.planes[3][2]);
    this.planes[3][0] /= t;
    this.planes[3][1] /= t;
    this.planes[3][2] /= t;
    this.planes[3][3] /= t;
    this.planes[4][0] = vpm[3] - vpm[2];
    this.planes[4][1] = vpm[7] - vpm[6];
    this.planes[4][2] = vpm[11] - vpm[10];
    this.planes[4][3] = vpm[15] - vpm[14];
    t = Math.sqrt(this.planes[4][0] * this.planes[4][0] + this.planes[4][1] * this.planes[4][1] + this.planes[4][2] * this.planes[4][2]);
    this.planes[4][0] /= t;
    this.planes[4][1] /= t;
    this.planes[4][2] /= t;
    this.planes[4][3] /= t;
    this.planes[5][0] = vpm[3] + vpm[2];
    this.planes[5][1] = vpm[7] + vpm[6];
    this.planes[5][2] = vpm[11] + vpm[10];
    this.planes[5][3] = vpm[15] + vpm[14];
    t = Math.sqrt(this.planes[5][0] * this.planes[5][0] + this.planes[5][1] * this.planes[5][1] + this.planes[5][2] * this.planes[5][2]);
    this.planes[5][0] /= t;
    this.planes[5][1] /= t;
    this.planes[5][2] /= t;
    this.planes[5][3] /= t
  };
  Frustum.prototype.containsPoint = function(point) {
    for(var p = 0;p < 6;p++) {
      if(this.planes[p][0] * point.x + this.planes[p][1] * point.y + this.planes[p][2] * point.z + this.planes[p][3] <= 0) {
        return false
      }
    }
    return true
  };
  Frustum.prototype.containsSphere = function(sphere) {
    var c = 0;
    var d;
    for(p = 0;p < 6;p++) {
      d = this.planes[p][0] * sphere.center.x + this.planes[p][1] * sphere.center.y + this.planes[p][2] * sphere.center.z + this.planes[p][3];
      if(d <= -sphere.radius) {
        return 0
      }
      if(d > sphere.radius) {
        c++
      }
    }
    return c === 6 ? 2 : 1
  };
  return{Frustum:Frustum}
}());
pc.extend(pc.shape, function() {
  pc.shape.Type.PLANE = "Plane";
  var Plane = function Plane(point, normal) {
    this.normal = normal || new pc.Vec3(0, 0, 1);
    this.point = point || new pc.Vec3(0, 0, 0);
    this.d = -this.normal.dot(this.point);
    this.type = pc.shape.Type.PLANE
  };
  Plane = pc.inherits(Plane, pc.shape.Shape);
  Plane.prototype.containsPoint = function(point) {
    return false
  };
  Plane.prototype.distance = function(pos) {
    return this.normal.dot(pos) + this.d
  };
  Plane.prototype.intersect = function(p0, p1) {
    var d0 = this.distance(p0);
    var d1 = this.distance(p1);
    return d0 / (d0 - d1)
  };
  Plane.prototype.intersectPosition = function(p0, p1) {
    var t = this.intersect(p0, p1);
    var r = new pc.Vec3;
    r.lerp(p0, p1, t);
    return r
  };
  return{Plane:Plane}
}());
pc.extend(pc.shape, function() {
  pc.shape.Type.SPHERE = "Sphere";
  function Sphere(center, radius) {
    this.center = center === undefined ? new pc.Vec3(0, 0, 0) : center;
    this.radius = radius === undefined ? 1 : radius;
    this.type = pc.shape.Type.SPHERE
  }
  Sphere = pc.inherits(Sphere, pc.shape.Shape);
  Sphere.prototype.containsPoint = function() {
    var centerToPoint = new pc.Vec3;
    return function(point) {
      var lenSq = centerToPoint.sub2(point, this.center).lengthSq();
      var r = this.radius;
      return lenSq < r * r
    }
  }();
  Sphere.prototype.compute = function(vertices) {
    var i;
    var numVerts = vertices.length / 3;
    var vertex = new pc.Vec3(0, 0, 0);
    var avgVertex = new pc.Vec3(0, 0, 0);
    var sum = new pc.Vec3(0, 0, 0);
    for(i = 0;i < numVerts;i++) {
      vertex.set(vertices[i * 3], vertices[i * 3 + 1], vertices[i * 3 + 2]);
      sum.addSelf(vertex);
      if(i % 100 === 0) {
        sum.scale(1 / numVerts);
        avgVertex.add(sum);
        sum.set(0, 0, 0)
      }
    }
    sum.scale(1 / numVerts);
    avgVertex.add(sum);
    this.center.copy(avgVertex);
    var maxDistSq = 0;
    var centerToVert = new pc.Vec3(0, 0, 0);
    for(i = 0;i < numVerts;i++) {
      vertex.set(vertices[i * 3], vertices[i * 3 + 1], vertices[i * 3 + 2]);
      centerToVert.sub2(vertex, this.center);
      maxDistSq = Math.max(centerToVert.lengthSq(), maxDistSq)
    }
    this.radius = Math.sqrt(maxDistSq)
  };
  Sphere.prototype.intersectRay = function(start, direction) {
    var m = start.clone().sub(this.center);
    var b = m.dot(direction);
    var c = m.dot(m) - this.radius * this.radius;
    if(c > 0 && b > 0) {
      return null
    }
    var discr = b * b - c;
    if(discr < 0) {
      return null
    }
    t = Math.abs(-b - Math.sqrt(discr));
    return direction.clone().scale(t).add(start)
  };
  return{Sphere:Sphere}
}());
pc.extend(pc.shape, function() {
  pc.shape.Type.TORUS = "Torus";
  var Torus = function Torus(transform, iradius, oradius) {
    this.transform = transform;
    this.iradius = iradius;
    this.oradius = oradius;
    this.type = pc.shape.Type.TORUS
  };
  Torus = pc.inherits(Torus, pc.shape.Shape);
  Torus.prototype.containsPoint = function(point) {
    throw new Error("Not implemented yet");
  };
  return{Torus:Torus}
}());
pc.resources = {};
pc.extend(pc.resources, function() {
  var ResourceLoader = function() {
    if(typeof window.RSVP === "undefined") {
      logERROR("Missing RSVP library")
    }
    this._types = {};
    this._handlers = {};
    this._requests = {};
    this._cache = {};
    this._hashes = {};
    this._canonicals = {};
    this._requested = 0;
    this._loaded = 0;
    this._sequence = 0;
    this.cache = true;
    pc.events.attach(this)
  };
  ResourceLoader.prototype = {createFileRequest:function(identifier, type) {
    return new this._types[type](identifier)
  }, registerHandler:function(RequestType, handler) {
    var request = new RequestType;
    if(request.type === "") {
      throw Error("ResourceRequests must have a type");
    }
    this._types[request.type] = RequestType;
    this._handlers[request.type] = handler;
    handler.setLoader(this)
  }, request:function(requests, options) {
    options = options || {};
    var self = this;
    var parent = options.parent;
    options.cache = self.cache;
    var promise = new pc.promise.Promise(function(resolve, reject) {
      var i, n;
      var p;
      if(requests.length === undefined) {
        requests = [requests]
      }
      var requested = [];
      var promises = [];
      for(i = 0, n = requests.length;i < n;i++) {
        var request = self._findExistingRequest(requests[i]);
        if(request !== requests[i]) {
          request.data = requests[i].data
        }
        self._makeCanonical(request);
        promises.push(self._request(request, options));
        requested.push(request);
        if(parent) {
          parent.children.push(request)
        }
      }
      var check = function(resources, requests, promises) {
        var i, n;
        var childPromises = [];
        var childRequests = [];
        requests.forEach(function(r) {
          r.children.forEach(function(c) {
            childRequests.push(c);
            childPromises.push.apply(childPromises, c.promises)
          })
        });
        if(childPromises.length) {
          pc.promise.all(childPromises).then(function(childResources) {
            check(resources, childRequests, childPromises)
          }, function(error) {
            reject(error)
          })
        }else {
          self.fire("complete", resources);
          resolve(resources)
        }
      };
      pc.promise.all(promises).then(function(resources) {
        check(resources, requested, promises)
      }, function(error) {
        reject(error)
      })
    });
    return promise
  }, open:function(RequestType, data, options) {
    var request = new RequestType;
    return this._handlers[request.type].open(data, request, options)
  }, registerHash:function(hash, identifier) {
    if(!this._hashes[identifier]) {
      this._hashes[identifier] = hash
    }
    if(!this._canonicals[hash]) {
      this._canonicals[hash] = identifier
    }
  }, getHash:function(identifier) {
    return this._hashes[identifier]
  }, addToCache:function(identifier, resource) {
    var hash = this.getHash(identifier);
    if(hash) {
      this._cache[hash] = resource
    }else {
    }
  }, getFromCache:function(identifier) {
    var hash = this.getHash(identifier);
    if(hash) {
      return this._cache[hash]
    }else {
      return null
    }
  }, removeFromCache:function(identifier) {
    var hash = this.getHash(identifier);
    if(hash) {
      delete this._cache[hash]
    }else {
      return null
    }
  }, resetProgress:function() {
    this._requested = 0;
    this._loaded = 0
  }, _request:function(request, _options) {
    var self = this;
    var promise = null;
    var options = {};
    for(key in _options) {
      options[key] = _options[key]
    }
    if(request.id === null) {
      request.id = this._sequence++
    }
    this.fire("request", request);
    if(request.promises.length) {
      request.promises.push(new pc.promise.Promise(function(resolve, reject) {
        request.promises[0].then(function(resource) {
          var resource = self._postOpen(resource, request);
          resolve(resource)
        })
      }))
    }else {
      request.promises[0] = new pc.promise.Promise(function(resolve, reject) {
        var handler = self._handlers[request.type];
        if(!handler) {
          var msg = "Missing handler for type: " + request.type;
          self.fire("error", request, msg);
          reject(msg);
          return
        }
        var resource = self.getFromCache(request.canonical);
        if(resource && (request.Type === undefined || resource instanceof request.Type)) {
          resource = self._postOpen(resource, request);
          resolve(resource)
        }else {
          var promise = handler.load(request, options);
          promise.then(function(data) {
            try {
              var resource = self._open(data, request, options);
              if(resource) {
                resource = self._postOpen(resource, request)
              }
              resolve(resource)
            }catch(e) {
              reject(e)
            }
          }, function(error) {
            self.fire("error", request, error);
            reject(error)
          })
        }
      })
    }
    self._requests[request.canonical] = request;
    this._requested++;
    return request.promises[request.promises.length - 1]
  }, _open:function(data, request, options) {
    return this._handlers[request.type].open(data, request, options)
  }, _postOpen:function(resource, request) {
    this.addToCache(request.canonical, resource);
    resource = this._handlers[request.type].clone(resource, request);
    delete this._requests[request.canonical];
    this._loaded++;
    this.fire("progress", this._loaded / this._requested);
    this.fire("load", request, resource);
    return resource
  }, _makeCanonical:function(request) {
    var hash = this.getHash(request.identifier);
    if(hash && this._canonicals[hash]) {
      request.canonical = this._canonicals[hash]
    }else {
      request.canonical = request.identifier
    }
  }, _findExistingRequest:function(request) {
    var existing = this._requests[request.canonical];
    if(existing) {
      if(existing.type !== request.type || existing.result || request.result) {
        return request
      }else {
        return existing
      }
    }else {
      return request
    }
  }};
  var ResourceRequest = function ResourceRequest(identifier, data, result) {
    this.id = null;
    this.canonical = identifier;
    this.alternatives = [];
    this.promises = [];
    this.children = [];
    this.data = data;
    this.result = result;
    this.identifier = identifier
  };
  var ResourceHandler = function() {
  };
  ResourceHandler.prototype = {setLoader:function(loader) {
    this._loader = loader
  }, load:function(request, options) {
    throw Error("Not implemented");
  }, open:function(data, options) {
    throw Error("Not implemented");
  }, clone:function(resource) {
    return resource
  }};
  return{ResourceLoader:ResourceLoader, ResourceHandler:ResourceHandler, ResourceRequest:ResourceRequest}
}());
pc.extend(pc.resources, function() {
  var count = 0;
  var ResourceLoaderDisplay = function(element, loader) {
    loader.on("request", this.handleRequest, this);
    loader.on("load", this.handleLoad, this);
    loader.on("error", this.handleError, this);
    loader.on("progress", this.handleProgress, this);
    this.addCss();
    this._element = element;
    this._domCreate()
  };
  ResourceLoaderDisplay.prototype = {addCss:function() {
    var styles = [".pc-resourceloaderdisplay-root {", "   font-family: sans-serif;", "   font-size: 0.7em;", "   color: #aaa;", "   border-collapse: collapse;", "   position: absolute;", "   top: 10px;", "   left: 10px;", "   background-color: black;", "   opacity: 0.6;", "}", ".pc-resourceloaderdisplay-root td {", "   border: 1px solid #aaa;", "}", ".pc-resourceloaderdisplay-subtable {", "   border-collapse: collapse;", "}"].join("\n");
    var style = document.createElement("style");
    document.getElementsByTagName("head")[0].appendChild(style);
    if(style.styleSheet) {
      style.styleSheet.cssText = styles
    }else {
      var cssText = document.createTextNode(styles);
      style.appendChild(cssText)
    }
  }, handleRequest:function(request) {
    console.warn("request: " + request.id);
    this._domAddRequest(request)
  }, handleLoad:function(request, resource) {
    console.warn("load: " + request.id);
    var id = "pc-resourcesloaderdisplay-progress-" + request.id;
    var el = document.getElementsByClassName(id);
    if(el) {
      for(var i = 0;i < el.length;i++) {
        el[i].textContent = "100%"
      }
    }
  }, handleError:function(request, error) {
    var id = "pc-resourcesloaderdisplay-progress-" + request.id;
    var el = document.getElementsByClassName(id);
    if(el) {
      for(var i = 0;i < el.length;i++) {
        el[i].textContent = error
      }
    }
  }, handleProgress:function(value) {
  }, _domCreate:function() {
    this._rootTable = document.createElement("table");
    this._rootTable.setAttribute("class", "pc-resourceloaderdisplay-root");
    this._element.appendChild(this._rootTable)
  }, _domAddRequest:function(request) {
    var id = "pc-resourcesloaderdisplay-progress-" + request.id;
    var row = document.createElement("tr");
    var titleEl = document.createElement("td");
    titleEl.textContent = request.identifier;
    var progressEl = document.createElement("td");
    progressEl.className = id;
    progressEl.textContent = "0%";
    row.appendChild(titleEl);
    row.appendChild(progressEl);
    this._rootTable.appendChild(row)
  }, _sanitizeId:function(id) {
    return id.replace(/\//, "").replace(/\./, "")
  }};
  return{ResourceLoaderDisplay:ResourceLoaderDisplay}
}());
pc.extend(pc.resources, function() {
  var TextureCache = function(loader) {
    this.cache = {};
    this.loader = loader
  };
  TextureCache.prototype = {getTexture:function(url) {
    var hash = this.loader.getHash(url);
    if(hash && this.cache[hash]) {
      return this.cache[hash]
    }
    return null
  }, addTexture:function(url, texture) {
    var hash = this.loader.getHash(url);
    if(hash) {
      this.cache[hash] = texture
    }
  }};
  return{TextureCache:TextureCache}
}());
pc.gfx = {ADDRESS_REPEAT:0, ADDRESS_CLAMP_TO_EDGE:1, ADDRESS_MIRRORED_REPEAT:2, BLENDMODE_ZERO:0, BLENDMODE_ONE:1, BLENDMODE_SRC_COLOR:2, BLENDMODE_ONE_MINUS_SRC_COLOR:3, BLENDMODE_DST_COLOR:4, BLENDMODE_ONE_MINUS_DST_COLOR:5, BLENDMODE_SRC_ALPHA:6, BLENDMODE_SRC_ALPHA_SATURATE:7, BLENDMODE_ONE_MINUS_SRC_ALPHA:8, BLENDMODE_DST_ALPHA:9, BLENDMODE_ONE_MINUS_DST_ALPHA:10, BLENDEQUATION_ADD:0, BLENDEQUATION_SUBTRACT:1, BLENDEQUATION_REVERSE_SUBTRACT:2, BUFFER_STATIC:0, BUFFER_DYNAMIC:1, BUFFER_STREAM:2, 
CLEARFLAG_COLOR:1, CLEARFLAG_DEPTH:2, CLEARFLAG_STENCIL:4, CULLFACE_NONE:0, CULLFACE_BACK:1, CULLFACE_FRONT:2, CULLFACE_FRONTANDBACK:3, ELEMENTTYPE_INT8:0, ELEMENTTYPE_UINT8:1, ELEMENTTYPE_INT16:2, ELEMENTTYPE_UINT16:3, ELEMENTTYPE_INT32:4, ELEMENTTYPE_UINT32:5, ELEMENTTYPE_FLOAT32:6, FILTER_NEAREST:0, FILTER_LINEAR:1, FILTER_NEAREST_MIPMAP_NEAREST:2, FILTER_NEAREST_MIPMAP_LINEAR:3, FILTER_LINEAR_MIPMAP_NEAREST:4, FILTER_LINEAR_MIPMAP_LINEAR:5, INDEXFORMAT_UINT8:0, INDEXFORMAT_UINT16:1, INDEXFORMAT_UINT32:2, 
PIXELFORMAT_A8:0, PIXELFORMAT_L8:1, PIXELFORMAT_L8_A8:2, PIXELFORMAT_R5_G6_B5:3, PIXELFORMAT_R5_G5_B5_A1:4, PIXELFORMAT_R4_G4_B4_A4:5, PIXELFORMAT_R8_G8_B8:6, PIXELFORMAT_R8_G8_B8_A8:7, PIXELFORMAT_DXT1:8, PIXELFORMAT_DXT3:9, PIXELFORMAT_DXT5:10, PIXELFORMAT_RGB16F:11, PIXELFORMAT_RGBA16F:12, PIXELFORMAT_RGB32F:13, PIXELFORMAT_RGBA32F:14, PRIMITIVE_POINTS:0, PRIMITIVE_LINES:1, PRIMITIVE_LINESTRIP:2, PRIMITIVE_TRIANGLES:3, PRIMITIVE_TRISTRIP:4, SEMANTIC_POSITION:"POSITION", SEMANTIC_NORMAL:"NORMAL", 
SEMANTIC_TANGENT:"TANGENT", SEMANTIC_BLENDWEIGHT:"BLENDWEIGHT", SEMANTIC_BLENDINDICES:"BLENDINDICES", SEMANTIC_COLOR:"COLOR", SEMANTIC_TEXCOORD0:"TEXCOORD0", SEMANTIC_TEXCOORD1:"TEXCOORD1", SEMANTIC_TEXCOORD2:"TEXCOORD2", SEMANTIC_TEXCOORD3:"TEXCOORD3", SEMANTIC_TEXCOORD4:"TEXCOORD4", SEMANTIC_TEXCOORD5:"TEXCOORD5", SEMANTIC_TEXCOORD6:"TEXCOORD6", SEMANTIC_TEXCOORD7:"TEXCOORD7", SEMANTIC_ATTR0:"ATTR0", SEMANTIC_ATTR1:"ATTR1", SEMANTIC_ATTR2:"ATTR2", SEMANTIC_ATTR3:"ATTR3", SEMANTIC_ATTR4:"ATTR4", 
SEMANTIC_ATTR5:"ATTR5", SEMANTIC_ATTR6:"ATTR6", SEMANTIC_ATTR7:"ATTR7", SEMANTIC_ATTR8:"ATTR8", SEMANTIC_ATTR9:"ATTR9", SEMANTIC_ATTR10:"ATTR10", SEMANTIC_ATTR11:"ATTR11", SEMANTIC_ATTR12:"ATTR12", SEMANTIC_ATTR13:"ATTR13", SEMANTIC_ATTR14:"ATTR14", SEMANTIC_ATTR15:"ATTR15", TEXTURELOCK_READ:1, TEXTURELOCK_WRITE:2};
pc.extend(pc.gfx, function() {
  var ScopeId = function(name) {
    this.name = name;
    this.value = null;
    this.versionObject = new pc.gfx.VersionedObject
  };
  ScopeId.prototype = {setValue:function(value) {
    this.value = value;
    this.versionObject.increment()
  }, getValue:function(value) {
    return this.value
  }};
  return{ScopeId:ScopeId}
}());
pc.extend(pc.gfx, function() {
  var ScopeSpace = function(name) {
    this.name = name;
    this.variables = {};
    this.namespaces = {}
  };
  ScopeSpace.prototype = {resolve:function(name) {
    if(this.variables.hasOwnProperty(name) === false) {
      this.variables[name] = new pc.gfx.ScopeId(name)
    }
    return this.variables[name]
  }, getSubSpace:function(name) {
    if(this.namespaces.hasOwnProperty(name) === false) {
      this.namespaces[name] = new pc.gfx.ScopeSpace(name);
      logDEBUG("Added ScopeSpace: " + name)
    }
    return this.namespaces[name]
  }};
  return{ScopeSpace:ScopeSpace}
}());
pc.extend(pc.gfx, function() {
  var Version = function() {
    this.globalId = 0;
    this.revision = 0
  };
  Version.prototype = {equals:function(other) {
    return this.globalId === other.globalId && this.revision === other.revision
  }, notequals:function(other) {
    return this.globalId !== other.globalId || this.revision !== other.revision
  }, copy:function(other) {
    this.globalId = other.globalId;
    this.revision = other.revision
  }, reset:function() {
    this.globalId = 0;
    this.revision = 0
  }};
  return{Version:Version}
}());
pc.extend(pc.gfx, function() {
  var idCounter = 0;
  var VersionedObject = function() {
    idCounter++;
    this.version = new pc.gfx.Version;
    this.version.globalId = idCounter
  };
  VersionedObject.prototype = {increment:function() {
    this.version.revision++
  }};
  return{VersionedObject:VersionedObject}
}());
function WebGLValidator(gl) {
  this.gl = gl;
  var self = this;
  function makeWrapper(member) {
    return function() {
      var result = self.gl[member].apply(self.gl, arguments);
      self.validate(member);
      return result
    }
  }
  for(var member in gl) {
    if(typeof gl[member] === "function") {
      this[member] = makeWrapper(member)
    }else {
      this[member] = gl[member]
    }
  }
  this.errorString = {};
  this.errorString[gl.NO_ERROR] = "NO_ERROR";
  this.errorString[gl.INVALID_ENUM] = "INVALID_ENUM";
  this.errorString[gl.INVALID_VALUE] = "INVALID_VALUE";
  this.errorString[gl.INVALID_OPERATION] = "INVALID_OPERATION";
  this.errorString[gl.OUT_OF_MEMORY] = "OUT_OF_MEMORY";
  this.errorString[gl.INVALID_FRAMEBUFFER_OPERATION] = "INVALID_FRAMEBUFFER_OPERATION"
}
WebGLValidator.prototype.validate = function(functionName) {
  var gl = this.gl;
  var error = gl.getError();
  if(error !== gl.NO_ERROR) {
    pc.log.error("WebGL error from " + functionName + ": " + this.errorString[error]);
    return false
  }
  return true
};
pc.extend(pc.gfx, function() {
  function VertexIteratorSetter(buffer, vertexElement) {
    this.index = 0;
    switch(vertexElement.dataType) {
      case pc.gfx.ELEMENTTYPE_INT8:
        this.array = new Int8Array(buffer, vertexElement.offset);
        break;
      case pc.gfx.ELEMENTTYPE_UINT8:
        this.array = new Uint8Array(buffer, vertexElement.offset);
        break;
      case pc.gfx.ELEMENTTYPE_INT16:
        this.array = new Int16Array(buffer, vertexElement.offset);
        break;
      case pc.gfx.ELEMENTTYPE_UINT16:
        this.array = new Uint16Array(buffer, vertexElement.offset);
        break;
      case pc.gfx.ELEMENTTYPE_INT32:
        this.array = new Int32Array(buffer, vertexElement.offset);
        break;
      case pc.gfx.ELEMENTTYPE_UINT32:
        this.array = new Uint32Array(buffer, vertexElement.offset);
        break;
      case pc.gfx.ELEMENTTYPE_FLOAT32:
        this.array = new Float32Array(buffer, vertexElement.offset);
        break
    }
    switch(vertexElement.numComponents) {
      case 1:
        this.set = VertexIteratorSetter_set1;
        break;
      case 2:
        this.set = VertexIteratorSetter_set2;
        break;
      case 3:
        this.set = VertexIteratorSetter_set3;
        break;
      case 4:
        this.set = VertexIteratorSetter_set4;
        break
    }
  }
  function VertexIteratorSetter_set1(a) {
    this.array[this.index] = a
  }
  function VertexIteratorSetter_set2(a, b) {
    this.array[this.index] = a;
    this.array[this.index + 1] = b
  }
  function VertexIteratorSetter_set3(a, b, c) {
    this.array[this.index] = a;
    this.array[this.index + 1] = b;
    this.array[this.index + 2] = c
  }
  function VertexIteratorSetter_set4(a, b, c, d) {
    this.array[this.index] = a;
    this.array[this.index + 1] = b;
    this.array[this.index + 2] = c;
    this.array[this.index + 3] = d
  }
  function VertexIterator(vertexBuffer) {
    this.vertexBuffer = vertexBuffer;
    this.buffer = this.vertexBuffer.lock();
    this.setters = [];
    this.element = {};
    var vertexFormat = this.vertexBuffer.getFormat();
    for(var i = 0;i < vertexFormat.elements.length;i++) {
      var vertexElement = vertexFormat.elements[i];
      this.setters[i] = new VertexIteratorSetter(this.buffer, vertexElement);
      this.element[vertexElement.name] = this.setters[i]
    }
  }
  VertexIterator.prototype = {next:function() {
    var i = 0;
    var setters = this.setters;
    var numSetters = this.setters.length;
    var vertexFormat = this.vertexBuffer.getFormat();
    while(i < numSetters) {
      var setter = setters[i++];
      setter.index += vertexFormat.size / setter.array.constructor.BYTES_PER_ELEMENT
    }
  }, end:function() {
    this.vertexBuffer.unlock()
  }};
  return{VertexIterator:VertexIterator}
}());
pc.extend(pc.gfx, function() {
  var _typeSize = [];
  _typeSize[pc.gfx.ELEMENTTYPE_INT8] = 1;
  _typeSize[pc.gfx.ELEMENTTYPE_UINT8] = 1;
  _typeSize[pc.gfx.ELEMENTTYPE_INT16] = 2;
  _typeSize[pc.gfx.ELEMENTTYPE_UINT16] = 2;
  _typeSize[pc.gfx.ELEMENTTYPE_INT32] = 4;
  _typeSize[pc.gfx.ELEMENTTYPE_UINT32] = 4;
  _typeSize[pc.gfx.ELEMENTTYPE_FLOAT32] = 4;
  var VertexFormat = function(graphicsDevice, description) {
    var i;
    this.elements = [];
    this.size = 0;
    for(var i = 0, len = description.length;i < len;i++) {
      var elementDesc = description[i];
      var element = {name:elementDesc.semantic, offset:0, stride:0, stream:-1, scopeId:graphicsDevice.scope.resolve(elementDesc.semantic), dataType:elementDesc.type, numComponents:elementDesc.components, normalize:typeof elementDesc.normalize === "undefined" ? false : elementDesc.normalize, size:elementDesc.components * _typeSize[elementDesc.type]};
      this.elements.push(element);
      this.size += element.size
    }
    var offset = 0;
    for(var i = 0, len = this.elements.length;i < len;i++) {
      var element = this.elements[i];
      element.offset = offset;
      element.stride = this.size;
      offset += element.size
    }
  };
  return{VertexFormat:VertexFormat}
}());
pc.extend(pc.gfx, function() {
  var VertexBuffer = function(graphicsDevice, format, numVertices, usage) {
    this.usage = usage || pc.gfx.BUFFER_STATIC;
    this.format = format;
    this.numVertices = numVertices;
    this.numBytes = format.size * numVertices;
    this.device = graphicsDevice;
    var gl = this.device.gl;
    this.bufferId = gl.createBuffer();
    this.storage = new ArrayBuffer(this.numBytes)
  };
  VertexBuffer.prototype = {destroy:function() {
    var gl = this.device.gl;
    gl.deleteBuffer(this.bufferId)
  }, getFormat:function() {
    return this.format
  }, getUsage:function() {
    return this.usage
  }, getNumVertices:function() {
    return this.numVertices
  }, lock:function() {
    return this.storage
  }, unlock:function() {
    var gl = this.device.gl;
    var glUsage;
    switch(this.usage) {
      case pc.gfx.BUFFER_STATIC:
        glUsage = gl.STATIC_DRAW;
        break;
      case pc.gfx.BUFFER_DYNAMIC:
        glUsage = gl.DYNAMIC_DRAW;
        break;
      case pc.gfx.BUFFER_STREAM:
        glUsage = gl.STREAM_DRAW;
        break
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, this.storage, glUsage)
  }};
  return{VertexBuffer:VertexBuffer}
}());
pc.extend(pc.gfx, function() {
  var IndexBuffer = function(graphicsDevice, format, numIndices, usage) {
    this.usage = usage || pc.gfx.BUFFER_STATIC;
    this.format = format;
    this.numIndices = numIndices;
    this.device = graphicsDevice;
    var gl = this.device.gl;
    this.bufferId = gl.createBuffer();
    var bytesPerIndex;
    if(format === pc.gfx.INDEXFORMAT_UINT8) {
      bytesPerIndex = 1;
      this.glFormat = gl.UNSIGNED_BYTE
    }else {
      if(format === pc.gfx.INDEXFORMAT_UINT16) {
        bytesPerIndex = 2;
        this.glFormat = gl.UNSIGNED_SHORT
      }else {
        if(format === pc.gfx.INDEXFORMAT_UINT32) {
          bytesPerIndex = 4;
          this.glFormat = gl.UNSIGNED_INT
        }
      }
    }
    var numBytes = this.numIndices * bytesPerIndex;
    this.storage = new ArrayBuffer(numBytes)
  };
  IndexBuffer.prototype = {destroy:function() {
    var gl = this.device.gl;
    gl.deleteBuffer(this.bufferId)
  }, getFormat:function() {
    return this.format
  }, getNumIndices:function() {
    return this.numIndices
  }, lock:function() {
    return this.storage
  }, unlock:function() {
    var gl = this.device.gl;
    var glUsage;
    switch(this.usage) {
      case pc.gfx.BUFFER_STATIC:
        glUsage = gl.STATIC_DRAW;
        break;
      case pc.gfx.BUFFER_DYNAMIC:
        glUsage = gl.DYNAMIC_DRAW;
        break;
      case pc.gfx.BUFFER_STREAM:
        glUsage = gl.STREAM_DRAW;
        break
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferId);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.storage, glUsage)
  }};
  return{IndexBuffer:IndexBuffer}
}());
pc.extend(pc.gfx, function() {
  var Texture = function(graphicsDevice, options) {
    this.device = graphicsDevice;
    var width = 4;
    var height = 4;
    var format = pc.gfx.PIXELFORMAT_R8_G8_B8_A8;
    var cubemap = false;
    var autoMipmap = true;
    if(typeof options !== "undefined") {
      width = typeof options.width !== "undefined" ? options.width : width;
      height = typeof options.height !== "undefined" ? options.height : height;
      format = typeof options.format !== "undefined" ? options.format : format;
      cubemap = typeof options.cubemap !== "undefined" ? options.cubemap : cubemap;
      autoMipmap = typeof options.autoMipmap !== "undefined" ? options.autoMipmap : autoMipmap
    }
    this.name = null;
    this.autoMipmap = true;
    var gl = this.device.gl;
    var ext;
    this._glTextureId = gl.createTexture();
    this._glTarget = cubemap ? gl.TEXTURE_CUBE_MAP : gl.TEXTURE_2D;
    this._cubemap = cubemap;
    this._format = format;
    switch(format) {
      case pc.gfx.PIXELFORMAT_A8:
        this._glFormat = gl.ALPHA;
        this._glInternalFormat = gl.ALPHA;
        this._glPixelType = gl.UNSIGNED_BYTE;
        break;
      case pc.gfx.PIXELFORMAT_L8:
        this._glFormat = gl.LUMINANCE;
        this._glInternalFormat = gl.LUMINANCE;
        this._glPixelType = gl.UNSIGNED_BYTE;
        break;
      case pc.gfx.PIXELFORMAT_L8_A8:
        this._glFormat = gl.LUMINANCE_ALPHA;
        this._glInternalFormat = gl.LUMINANCE_ALPHA;
        this._glPixelType = gl.UNSIGNED_BYTE;
        break;
      case pc.gfx.PIXELFORMAT_R5_G6_B5:
        this._glFormat = gl.RGB;
        this._glInternalFormat = gl.RGB;
        this._glPixelType = gl.UNSIGNED_SHORT_5_6_5;
        break;
      case pc.gfx.PIXELFORMAT_R5_G5_B5_A1:
        this._glFormat = gl.RGBA;
        this._glInternalFormat = gl.RGBA;
        this._glPixelType = gl.UNSIGNED_SHORT_5_5_5_1;
        break;
      case pc.gfx.PIXELFORMAT_R4_G4_B4_A4:
        this._glFormat = gl.RGBA;
        this._glInternalFormat = gl.RGBA;
        this._glPixelType = gl.UNSIGNED_SHORT_4_4_4_4;
        break;
      case pc.gfx.PIXELFORMAT_R8_G8_B8:
        this._glFormat = gl.RGB;
        this._glInternalFormat = gl.RGB;
        this._glPixelType = gl.UNSIGNED_BYTE;
        break;
      case pc.gfx.PIXELFORMAT_R8_G8_B8_A8:
        this._glFormat = gl.RGBA;
        this._glInternalFormat = gl.RGBA;
        this._glPixelType = gl.UNSIGNED_BYTE;
        break;
      case pc.gfx.PIXELFORMAT_DXT1:
        ext = this.device.extCompressedTextureS3TC;
        this._glFormat = gl.RGB;
        this._glInternalFormat = ext.COMPRESSED_RGB_S3TC_DXT1_EXT;
        break;
      case pc.gfx.PIXELFORMAT_DXT3:
        ext = this.device.extCompressedTextureS3TC;
        this._glFormat = gl.RGBA;
        this._glInternalFormat = ext.COMPRESSED_RGBA_S3TC_DXT3_EXT;
        break;
      case pc.gfx.PIXELFORMAT_DXT5:
        ext = this.device.extCompressedTextureS3TC;
        this._glFormat = gl.RGBA;
        this._glInternalFormat = ext.COMPRESSED_RGBA_S3TC_DXT5_EXT;
        break;
      case pc.gfx.PIXELFORMAT_RGB16F:
        ext = this.device.extTextureHalfFloat;
        this._glFormat = gl.RGB;
        this._glInternalFormat = gl.RGB;
        this._glPixelType = ext.HALF_FLOAT_OES;
        break;
      case pc.gfx.PIXELFORMAT_RGBA16F:
        ext = this.device.extTextureHalfFloat;
        this._glFormat = gl.RGBA;
        this._glInternalFormat = gl.RGBA;
        this._glPixelType = ext.HALF_FLOAT_OES;
        break;
      case pc.gfx.PIXELFORMAT_RGB32F:
        this._glFormat = gl.RGB;
        this._glInternalFormat = gl.RGB;
        this._glPixelType = gl.FLOAT;
        break;
      case pc.gfx.PIXELFORMAT_RGBA32F:
        this._glFormat = gl.RGBA;
        this._glInternalFormat = gl.RGBA;
        this._glPixelType = gl.FLOAT;
        break
    }
    this._compressed = format === pc.gfx.PIXELFORMAT_DXT1 || format === pc.gfx.PIXELFORMAT_DXT3 || format === pc.gfx.PIXELFORMAT_DXT5;
    this._width = width || 4;
    this._height = height || 4;
    this._addressu = pc.gfx.ADDRESS_REPEAT;
    this._addressv = pc.gfx.ADDRESS_REPEAT;
    this._minFilter = pc.gfx.FILTER_NEAREST_MIPMAP_LINEAR;
    this._magFilter = pc.gfx.FILTER_LINEAR;
    this._maxAnisotropy = 1;
    this._levels = cubemap ? [[null, null, null, null, null, null]] : [null];
    this._lockedLevel = -1;
    this.upload()
  };
  Object.defineProperty(Texture.prototype, "minFilter", {get:function() {
    return this._minFilter
  }, set:function(filter) {
    if(!(pc.math.powerOfTwo(this._width) && pc.math.powerOfTwo(this._height))) {
      if(!(filter === pc.gfx.FILTER_NEAREST || filter === pc.gfx.FILTER_LINEAR)) {
        logWARNING("Invalid filter mode set on non power of two texture. Forcing linear addressing.");
        filter = pc.gfx.FILTER_LINEAR
      }
    }
    this.bind();
    var gl = this.device.gl;
    var _filterLookup = [gl.NEAREST, gl.LINEAR, gl.NEAREST_MIPMAP_NEAREST, gl.NEAREST_MIPMAP_LINEAR, gl.LINEAR_MIPMAP_NEAREST, gl.LINEAR_MIPMAP_LINEAR];
    gl.texParameteri(this._glTarget, gl.TEXTURE_MIN_FILTER, _filterLookup[filter]);
    this._minFilter = filter
  }});
  Object.defineProperty(Texture.prototype, "magFilter", {get:function() {
    return this._magFilter
  }, set:function(magFilter) {
    if(!(magFilter === pc.gfx.FILTER_NEAREST || magFilter === pc.gfx.FILTER_LINEAR)) {
      logWARNING("Invalid maginication filter mode. Must be set to FILTER_NEAREST or FILTER_LINEAR.")
    }
    this.bind();
    var gl = this.device.gl;
    var _filterLookup = [gl.NEAREST, gl.LINEAR, gl.NEAREST_MIPMAP_NEAREST, gl.NEAREST_MIPMAP_LINEAR, gl.LINEAR_MIPMAP_NEAREST, gl.LINEAR_MIPMAP_LINEAR];
    gl.texParameteri(this._glTarget, gl.TEXTURE_MAG_FILTER, _filterLookup[magFilter]);
    this._magFilter = magFilter
  }});
  Object.defineProperty(Texture.prototype, "addressU", {get:function() {
    return this._addressu
  }, set:function(addressu) {
    if(!(pc.math.powerOfTwo(this._width) && pc.math.powerOfTwo(this._height))) {
      if(addressu !== pc.gfx.ADDRESS_CLAMP_TO_EDGE) {
        logWARNING("Invalid address mode in U set on non power of two texture. Forcing clamp to edge addressing.");
        addressu = pc.gfx.ADDRESS_CLAMP_TO_EDGE
      }
    }
    this.bind();
    var gl = this.device.gl;
    var _addressLookup = [gl.REPEAT, gl.CLAMP_TO_EDGE, gl.MIRRORED_REPEAT];
    gl.texParameteri(this._glTarget, gl.TEXTURE_WRAP_S, _addressLookup[addressu]);
    this._addressu = addressu
  }});
  Object.defineProperty(Texture.prototype, "addressV", {get:function() {
    return this._addressv
  }, set:function(addressv) {
    if(!(pc.math.powerOfTwo(this._width) && pc.math.powerOfTwo(this._height))) {
      if(addressv !== pc.gfx.ADDRESS_CLAMP_TO_EDGE) {
        logWARNING("Invalid address mode in V set on non power of two texture. Forcing clamp to edge addressing.");
        addressv = pc.gfx.ADDRESS_CLAMP_TO_EDGE
      }
    }
    this.bind();
    var gl = this.device.gl;
    var _addressLookup = [gl.REPEAT, gl.CLAMP_TO_EDGE, gl.MIRRORED_REPEAT];
    gl.texParameteri(this._glTarget, gl.TEXTURE_WRAP_T, _addressLookup[addressv]);
    this._addressv = addressv
  }});
  Object.defineProperty(Texture.prototype, "maxAnisotropy", {get:function() {
    return this._maxAnisotropy
  }, set:function(maxAnisotropy) {
    this._maxAnisotropy = maxAnisotropy;
    var device = this.device;
    var ext = device.extTextureFilterAnisotropic;
    if(ext) {
      this.bind();
      var gl = device.gl;
      maxAnisotropy = Math.min(maxAnisotropy, device.maxSupportedMaxAnisotropy);
      gl.texParameterf(this._glTarget, ext.TEXTURE_MAX_ANISOTROPY_EXT, maxAnisotropy)
    }
  }});
  Object.defineProperty(Texture.prototype, "width", {get:function() {
    return this._width
  }});
  Object.defineProperty(Texture.prototype, "height", {get:function() {
    return this._height
  }});
  Object.defineProperty(Texture.prototype, "format", {get:function() {
    return this._format
  }});
  pc.extend(Texture.prototype, {bind:function() {
    var gl = this.device.gl;
    gl.bindTexture(this._glTarget, this._glTextureId)
  }, destroy:function() {
    var gl = this.device.gl;
    gl.deleteTexture(this._glTextureId)
  }, lock:function(options) {
    options = options || {level:0, face:0, mode:pc.gfx.TEXTURELOCK_WRITE};
    if(options.level === undefined) {
      options.level = 0
    }
    if(options.face === undefined) {
      options.face = 0
    }
    if(options.mode === undefined) {
      options.mode = pc.gfx.TEXTURELOCK_WRITE
    }
    this._lockedLevel = options.level;
    if(this._levels[options.level] === null) {
      switch(this._format) {
        case pc.gfx.PIXELFORMAT_A8:
        ;
        case pc.gfx.PIXELFORMAT_L8:
          this._levels[options.level] = new Uint8Array(this._width * this._height);
          break;
        case pc.gfx.PIXELFORMAT_L8_A8:
          this._levels[options.level] = new Uint8Array(this._width * this._height * 2);
          break;
        case pc.gfx.PIXELFORMAT_R5_G6_B5:
        ;
        case pc.gfx.PIXELFORMAT_R5_G5_B5_A1:
        ;
        case pc.gfx.PIXELFORMAT_R4_G4_B4_A4:
          this._levels[options.level] = new Uint16Array(this._width * this._height);
          break;
        case pc.gfx.PIXELFORMAT_R8_G8_B8:
          this._levels[options.level] = new Uint8Array(this._width * this._height * 3);
          break;
        case pc.gfx.PIXELFORMAT_R8_G8_B8_A8:
          this._levels[options.level] = new Uint8Array(this._width * this._height * 4);
          break;
        case pc.gfx.PIXELFORMAT_DXT1:
          this._levels[options.level] = new Uint8Array(Math.floor((this._width + 3) / 4) * Math.floor((this._height + 3) / 4) * 8);
          break;
        case pc.gfx.PIXELFORMAT_DXT3:
        ;
        case pc.gfx.PIXELFORMAT_DXT5:
          this._levels[options.level] = new Uint8Array(Math.floor((this._width + 3) / 4) * Math.floor((this._height + 3) / 4) * 16);
          break;
        case pc.gfx.PIXELFORMAT_RGB16F:
        ;
        case pc.gfx.PIXELFORMAT_RGB32F:
          this._levels[options.level] = new Float32Array(this._width * this._height * 3);
          break;
        case pc.gfx.PIXELFORMAT_RGBA16F:
        ;
        case pc.gfx.PIXELFORMAT_RGBA32F:
          this._levels[options.level] = new Float32Array(this._width * this._height * 4);
          break
      }
    }
    return this._levels[options.level]
  }, recover:function() {
    var gl = this.device.gl;
    this._glTextureId = gl.createTexture();
    this.addressU = this._addressu;
    this.addressV = this._addressv;
    this.minFilter = this._minFilter;
    this.magFilter = this._magFilter;
    this.maxAnisotropy = this._maxAnisotropy;
    this.upload()
  }, load:function(src, loader, requestBatch) {
    if(this._cubemap) {
      var options = {batch:requestBatch};
      var requests = src.map(function(url) {
        return new pc.resources.ImageRequest(url)
      });
      loader.request(requests).then(function(resources) {
        this.setSource(resources)
      }.bind(this))
    }else {
      var request = new pc.resources.ImageRequest(src);
      loader.request(request).then(function(resources) {
        this.setSource(resources[0])
      }.bind(this))
    }
  }, setSource:function(source) {
    if(this._cubemap) {
      logASSERT(Object.prototype.toString.apply(source) === "[object Array]", "pc.gfx.Texture: setSource: supplied source is not an array");
      logASSERT(source.length === 6, "pc.gfx.Texture: setSource: supplied source does not have 6 entries.");
      var validTypes = 0;
      var validDimensions = true;
      var width = source[0].width;
      var height = source[0].height;
      for(var i = 0;i < 6;i++) {
        if(source[i] instanceof HTMLCanvasElement || source[i] instanceof HTMLImageElement || source[i] instanceof HTMLVideoElement) {
          validTypes++
        }
        if(source[i].width !== width) {
          validDimensions = false
        }
        if(source[i].height !== height) {
          validDimensions = false
        }
      }
      logASSERT(validTypes === 6, "pc.gfx.Texture: setSource: Not all supplied source elements are of required type (canvas, image or video).");
      logASSERT(validDimensions, "pc.gfx.Texture: setSource: Not all supplied source elements share the same dimensions.");
      this._width = source[0].width;
      this._height = source[0].height;
      this._levels[0] = source
    }else {
      logASSERT(source instanceof HTMLCanvasElement || source instanceof HTMLImageElement || source instanceof HTMLVideoElement, "pc.gfx.Texture: setSource: supplied source is not an instance of HTMLCanvasElement, HTMLImageElement or HTMLVideoElement.");
      this._width = source.width;
      this._height = source.height;
      this._levels[0] = source
    }
    this.upload();
    this.minFilter = this._minFilter;
    this.magFilter = this._magFilter;
    this.addressu = this._addressu;
    this.addressv = this._addressv
  }, unlock:function() {
    logASSERT(this._lockedLevel !== -1, "Attempting to unlock a texture that is not locked");
    this.upload();
    this._lockedLevel = -1
  }, upload:function() {
    this.bind();
    var gl = this.device.gl;
    var pixels = this._levels[0];
    if(this._cubemap) {
      var face;
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      if(pixels[0] instanceof HTMLCanvasElement || pixels[0] instanceof HTMLImageElement || pixels[0] instanceof HTMLVideoElement) {
        for(face = 0;face < 6;face++) {
          gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + face, 0, this._glInternalFormat, this._glFormat, this._glPixelType, pixels[face])
        }
      }else {
        for(face = 0;face < 6;face++) {
          gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + face, 0, this._glInternalFormat, this._width, this._height, 0, this._glFormat, this._glPixelType, pixels[face])
        }
      }
    }else {
      if(pixels instanceof HTMLCanvasElement || pixels instanceof HTMLImageElement || pixels instanceof HTMLVideoElement) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        gl.texImage2D(gl.TEXTURE_2D, 0, this._glInternalFormat, this._glFormat, this._glPixelType, pixels)
      }else {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        if(this._compressed) {
          gl.compressedTexImage2D(gl.TEXTURE_2D, 0, this._glInternalFormat, this._width, this._height, 0, pixels)
        }else {
          gl.texImage2D(gl.TEXTURE_2D, 0, this._glInternalFormat, this._width, this._height, 0, this._glFormat, this._glPixelType, pixels)
        }
      }
    }
    if(this.autoMipmap && pc.math.powerOfTwo(this._width) && pc.math.powerOfTwo(this._height) && this._levels.length === 1) {
      gl.generateMipmap(this._glTarget)
    }
  }});
  return{Texture:Texture}
}());
pc.extend(pc.gfx, function() {
  var defaultOptions = {depth:true, face:0};
  var RenderTarget = function(graphicsDevice, colorBuffer, options) {
    this._device = graphicsDevice;
    this._colorBuffer = colorBuffer;
    options = typeof options !== "undefined" ? options : defaultOptions;
    this._face = typeof options.face !== "undefined" ? options.face : 0;
    this._depth = typeof options.depth !== "undefined" ? options.depth : true;
    var gl = this._device.gl;
    this._frameBuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, this._colorBuffer._cubemap ? gl.TEXTURE_CUBE_MAP_POSITIVE_X + this._face : gl.TEXTURE_2D, this._colorBuffer._glTextureId, 0);
    if(this._depth) {
      this._depthBuffer = gl.createRenderbuffer();
      gl.bindRenderbuffer(gl.RENDERBUFFER, this._depthBuffer);
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width, this.height);
      gl.bindRenderbuffer(gl.RENDERBUFFER, null);
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this._depthBuffer)
    }
    var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    switch(status) {
      case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
        logERROR("RenderTarget error: FRAMEBUFFER_INCOMPLETE_ATTACHMENT");
        break;
      case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
        logERROR("RenderTarget error: FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT");
        break;
      case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
        logERROR("RenderTarget error: FRAMEBUFFER_INCOMPLETE_DIMENSIONS");
        break;
      case gl.FRAMEBUFFER_UNSUPPORTED:
        logERROR("RenderTarget error: FRAMEBUFFER_UNSUPPORTED");
        break;
      case gl.FRAMEBUFFER_COMPLETE:
        break;
      default:
        break
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  };
  RenderTarget.prototype = {bind:function() {
    var gl = this._device.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer)
  }, destroy:function() {
    var gl = this._device.gl;
    gl.deleteFramebuffer(this._frameBuffer);
    if(this._depthBuffer) {
      gl.deleteRenderbuffer(this._depthBuffer)
    }
  }, unbind:function() {
    var gl = this._device.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }};
  Object.defineProperty(RenderTarget.prototype, "colorBuffer", {get:function() {
    return this._colorBuffer
  }});
  Object.defineProperty(RenderTarget.prototype, "face", {get:function() {
    return this._face
  }});
  Object.defineProperty(RenderTarget.prototype, "width", {get:function() {
    return this._colorBuffer.width
  }});
  Object.defineProperty(RenderTarget.prototype, "height", {get:function() {
    return this._colorBuffer.height
  }});
  return{RenderTarget:RenderTarget}
}());
pc.gfx.ShaderInputType = {BOOL:0, INT:1, FLOAT:2, VEC2:3, VEC3:4, VEC4:5, IVEC2:6, IVEC3:7, IVEC4:8, BVEC2:9, BVEC3:10, BVEC4:11, MAT2:12, MAT3:13, MAT4:14, TEXTURE2D:15, TEXTURECUBE:16};
pc.gfx.ShaderInput = function(graphicsDevice, name, type, locationId) {
  this.locationId = locationId;
  this.scopeId = graphicsDevice.scope.resolve(name);
  this.version = new pc.gfx.Version;
  this.dataType = type;
  this.array = []
};
pc.extend(pc.gfx, function() {
  function addLineNumbers(src) {
    var chunks = src.split("\n");
    for(var i = 0, len = chunks.length;i < len;i++) {
      chunks[i] = i + 1 + ":\t" + chunks[i]
    }
    return chunks.join("\n")
  }
  function createShader(gl, type, src) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    var ok = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(!ok) {
      var error = gl.getShaderInfoLog(shader);
      var typeName = type === gl.VERTEX_SHADER ? "vertex" : "fragment";
      logERROR("Failed to compile " + typeName + " shader:\n\n" + addLineNumbers(src) + "\n\n" + error)
    }
    return shader
  }
  function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var ok = gl.getProgramParameter(program, gl.LINK_STATUS);
    if(!ok) {
      var error = gl.getProgramInfoLog(program);
      logERROR("Failed to link shader program. Error: " + error)
    }
    return program
  }
  var Shader = function(graphicsDevice, definition) {
    this.device = graphicsDevice;
    this.definition = definition;
    var gl = this.device.gl;
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, definition.vshader);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, definition.fshader);
    this.program = createProgram(gl, vertexShader, fragmentShader);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    this.attributes = [];
    this.uniforms = [];
    this.samplers = [];
    var i = 0;
    var info, location;
    var _typeToPc = {};
    _typeToPc[gl.BOOL] = pc.gfx.ShaderInputType.BOOL;
    _typeToPc[gl.INT] = pc.gfx.ShaderInputType.INT;
    _typeToPc[gl.FLOAT] = pc.gfx.ShaderInputType.FLOAT;
    _typeToPc[gl.FLOAT_VEC2] = pc.gfx.ShaderInputType.VEC2;
    _typeToPc[gl.FLOAT_VEC3] = pc.gfx.ShaderInputType.VEC3;
    _typeToPc[gl.FLOAT_VEC4] = pc.gfx.ShaderInputType.VEC4;
    _typeToPc[gl.INT_VEC2] = pc.gfx.ShaderInputType.IVEC2;
    _typeToPc[gl.INT_VEC3] = pc.gfx.ShaderInputType.IVEC3;
    _typeToPc[gl.INT_VEC4] = pc.gfx.ShaderInputType.IVEC4;
    _typeToPc[gl.BOOL_VEC2] = pc.gfx.ShaderInputType.BVEC2;
    _typeToPc[gl.BOOL_VEC3] = pc.gfx.ShaderInputType.BVEC3;
    _typeToPc[gl.BOOL_VEC4] = pc.gfx.ShaderInputType.BVEC4;
    _typeToPc[gl.FLOAT_MAT2] = pc.gfx.ShaderInputType.MAT2;
    _typeToPc[gl.FLOAT_MAT3] = pc.gfx.ShaderInputType.MAT3;
    _typeToPc[gl.FLOAT_MAT4] = pc.gfx.ShaderInputType.MAT4;
    _typeToPc[gl.SAMPLER_2D] = pc.gfx.ShaderInputType.TEXTURE2D;
    _typeToPc[gl.SAMPLER_CUBE] = pc.gfx.ShaderInputType.TEXTURECUBE;
    var numAttributes = gl.getProgramParameter(this.program, gl.ACTIVE_ATTRIBUTES);
    while(i < numAttributes) {
      info = gl.getActiveAttrib(this.program, i++);
      location = gl.getAttribLocation(this.program, info.name);
      if(typeof definition.attributes[info.name] === "undefined") {
        console.error('Vertex shader attribute "' + info.name + '" is not mapped to a semantic in shader definition.')
      }
      var attr = new pc.gfx.ShaderInput(graphicsDevice, definition.attributes[info.name], _typeToPc[info.type], location);
      this.attributes.push(attr)
    }
    i = 0;
    var numUniforms = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);
    while(i < numUniforms) {
      info = gl.getActiveUniform(this.program, i++);
      location = gl.getUniformLocation(this.program, info.name);
      if(info.type === gl.SAMPLER_2D || info.type === gl.SAMPLER_CUBE) {
        this.samplers.push(new pc.gfx.ShaderInput(graphicsDevice, info.name, _typeToPc[info.type], location))
      }else {
        this.uniforms.push(new pc.gfx.ShaderInput(graphicsDevice, info.name, _typeToPc[info.type], location))
      }
    }
  };
  Shader.prototype = {destroy:function() {
    var gl = this.device.gl;
    gl.deleteProgram(this.program)
  }};
  return{Shader:Shader}
}());
pc.extend(pc.gfx, function() {
  var ProgramLibrary = function(device) {
    this._device = device;
    this._cache = {};
    this._generators = {}
  };
  ProgramLibrary.prototype.register = function(name, generator) {
    if(!this.isRegistered(name)) {
      this._generators[name] = generator
    }
  };
  ProgramLibrary.prototype.unregister = function(name) {
    if(this.isRegistered(name)) {
      delete this._generators[name]
    }
  };
  ProgramLibrary.prototype.isRegistered = function(name) {
    var generator = this._generators[name];
    return generator !== undefined
  };
  ProgramLibrary.prototype.getProgram = function(name, options) {
    var generator = this._generators[name];
    if(generator === undefined) {
      logERROR("No program library functions registered for: " + name);
      return null
    }
    var key = generator.generateKey(gd, options);
    var shader = this._cache[key];
    if(!shader) {
      var gd = this._device;
      var shaderDefinition = generator.createShaderDefinition(gd, options);
      shader = this._cache[key] = new pc.gfx.Shader(gd, shaderDefinition)
    }
    return shader
  };
  return{ProgramLibrary:ProgramLibrary}
}());
pc.gfx.precalculatedTangents = true;
pc.extend(pc.gfx, function() {
  var EVENT_RESIZE = "resizecanvas";
  function UnsupportedBrowserError(message) {
    this.name = "UnsupportedBrowserError";
    this.message = message || ""
  }
  UnsupportedBrowserError.prototype = Error.prototype;
  function ContextCreationError(message) {
    this.name = "ContextCreationError";
    this.message = message || ""
  }
  ContextCreationError.prototype = Error.prototype;
  var _contextLostHandler = function() {
    logWARNING("Context lost.")
  };
  var _contextRestoredHandler = function() {
    logINFO("Context restored.")
  };
  var _createContext = function(canvas, options) {
    var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    var context = null;
    for(var i = 0;i < names.length;i++) {
      try {
        context = canvas.getContext(names[i], options)
      }catch(e) {
      }
      if(context) {
        break
      }
    }
    return context
  };
  var Device = function(canvas) {
    this.gl = undefined;
    this.canvas = canvas;
    this.shader = null;
    this.indexBuffer = null;
    this.vertexBuffers = [];
    this.precision = "highp";
    this.attributesInvalidated = true;
    this.boundBuffer = null;
    this.enabledAttributes = {};
    this.textureUnits = [];
    this.commitFunction = {};
    if(!window.WebGLRenderingContext) {
      throw new pc.gfx.UnsupportedBrowserError;
    }
    this.gl = _createContext(canvas, {alpha:false});
    if(!this.gl) {
      throw new pc.gfx.ContextCreationError;
    }
    (function() {
      canvas.addEventListener("webglcontextlost", _contextLostHandler, false);
      canvas.addEventListener("webglcontextrestored", _contextRestoredHandler, false);
      this.canvas = canvas;
      this.shader = null;
      this.indexBuffer = null;
      this.vertexBuffers = [];
      this.precision = "highp";
      var gl = this.gl;
      logINFO("Device started");
      logINFO("WebGL version:                " + gl.getParameter(gl.VERSION));
      logINFO("WebGL shader version:         " + gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
      logINFO("WebGL vendor:                 " + gl.getParameter(gl.VENDOR));
      logINFO("WebGL renderer:               " + gl.getParameter(gl.RENDERER));
      logINFO("WebGL extensions:             " + gl.getSupportedExtensions());
      logINFO("WebGL max vertex attribs:     " + gl.getParameter(gl.MAX_VERTEX_ATTRIBS));
      logINFO("WebGL max vshader vectors:    " + gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS));
      logINFO("WebGL max varying vectors:    " + gl.getParameter(gl.MAX_VARYING_VECTORS));
      logINFO("WebGL max fshader vectors:    " + gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS));
      logINFO("WebGL max combined tex units: " + gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS));
      logINFO("WebGL max vertex tex units:   " + gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS));
      logINFO("WebGL max tex units:          " + gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS));
      logINFO("WebGL max texture size:       " + gl.getParameter(gl.MAX_TEXTURE_SIZE));
      logINFO("WebGL max cubemap size:       " + gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE));
      var vertexShaderPrecisionHighpFloat = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT);
      var vertexShaderPrecisionMediumpFloat = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT);
      var vertexShaderPrecisionLowpFloat = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT);
      var fragmentShaderPrecisionHighpFloat = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
      var fragmentShaderPrecisionMediumpFloat = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT);
      var fragmentShaderPrecisionLowpFloat = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT);
      var vertexShaderPrecisionHighpInt = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT);
      var vertexShaderPrecisionMediumpInt = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_INT);
      var vertexShaderPrecisionLowpInt = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_INT);
      var fragmentShaderPrecisionHighpInt = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT);
      var fragmentShaderPrecisionMediumpInt = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT);
      var fragmentShaderPrecisionLowpInt = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT);
      var highpAvailable = vertexShaderPrecisionHighpFloat.precision > 0 && fragmentShaderPrecisionHighpFloat.precision > 0;
      var mediumpAvailable = vertexShaderPrecisionMediumpFloat.precision > 0 && fragmentShaderPrecisionMediumpFloat.precision > 0;
      if(!highpAvailable) {
        if(mediumpAvailable) {
          this.precision = "mediump";
          console.warn("WARNING: highp not supported, using mediump")
        }else {
          this.precision = "lowp";
          console.warn("WARNING: highp and mediump not supported, using lowp")
        }
      }
      this.defaultClearOptions = {color:[0, 0, 0, 1], depth:1, flags:pc.gfx.CLEARFLAG_COLOR | pc.gfx.CLEARFLAG_DEPTH};
      this.glPrimitive = [gl.POINTS, gl.LINES, gl.LINE_STRIP, gl.TRIANGLES, gl.TRIANGLE_STRIP];
      this.glBlendEquation = [gl.FUNC_ADD, gl.FUNC_SUBTRACT, gl.FUNC_REVERSE_SUBTRACT];
      this.glBlendFunction = [gl.ZERO, gl.ONE, gl.SRC_COLOR, gl.ONE_MINUS_SRC_COLOR, gl.DST_COLOR, gl.ONE_MINUS_DST_COLOR, gl.SRC_ALPHA, gl.SRC_ALPHA_SATURATE, gl.ONE_MINUS_SRC_ALPHA, gl.DST_ALPHA, gl.ONE_MINUS_DST_ALPHA];
      this.glClearFlag = [0, gl.COLOR_BUFFER_BIT, gl.DEPTH_BUFFER_BIT, gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT, gl.STENCIL_BUFFER_BIT, gl.STENCIL_BUFFER_BIT | gl.COLOR_BUFFER_BIT, gl.STENCIL_BUFFER_BIT | gl.DEPTH_BUFFER_BIT, gl.STENCIL_BUFFER_BIT | gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT];
      this.glType = [gl.BYTE, gl.UNSIGNED_BYTE, gl.SHORT, gl.UNSIGNED_SHORT, gl.INT, gl.UNSIGNED_INT, gl.FLOAT];
      this.extTextureFloat = gl.getExtension("OES_texture_float");
      this.extTextureHalfFloat = gl.getExtension("OES_texture_half_float");
      this.maxVertexTextures = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
      this.supportsBoneTextures = this.extTextureFloat && this.maxVertexTextures > 0;
      this.extDepthTexture = null;
      this.extStandardDerivatives = gl.getExtension("OES_standard_derivatives");
      if(this.extStandardDerivatives) {
        gl.hint(this.extStandardDerivatives.FRAGMENT_SHADER_DERIVATIVE_HINT_OES, gl.NICEST)
      }
      this.maxTextureMaxAnisotropy = 1;
      this.extTextureFilterAnisotropic = gl.getExtension("EXT_texture_filter_anisotropic");
      if(!this.extTextureFilterAnisotropic) {
        this.extTextureFilterAnisotropic = gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic")
      }
      if(this.extTextureFilterAnisotropic) {
        this.maxTextureMaxAnisotropy = gl.getParameter(this.extTextureFilterAnisotropic.MAX_TEXTURE_MAX_ANISOTROPY_EXT)
      }
      this.extCompressedTextureS3TC = gl.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");
      if(this.extCompressedTextureS3TC) {
        var formats = gl.getParameter(gl.COMPRESSED_TEXTURE_FORMATS);
        var formatMsg = "WebGL compressed texture formats:";
        for(var i = 0;i < formats.length;i++) {
          switch(formats[i]) {
            case this.extCompressedTextureS3TC.COMPRESSED_RGB_S3TC_DXT1_EXT:
              formatMsg += " COMPRESSED_RGB_S3TC_DXT1_EXT";
              break;
            case this.extCompressedTextureS3TC.COMPRESSED_RGBA_S3TC_DXT1_EXT:
              formatMsg += " COMPRESSED_RGBA_S3TC_DXT1_EXT";
              break;
            case this.extCompressedTextureS3TC.COMPRESSED_RGBA_S3TC_DXT3_EXT:
              formatMsg += " COMPRESSED_RGBA_S3TC_DXT3_EXT";
              break;
            case this.extCompressedTextureS3TC.COMPRESSED_RGBA_S3TC_DXT5_EXT:
              formatMsg += " COMPRESSED_RGBA_S3TC_DXT5_EXT";
              break;
            default:
              formatMsg += " UNKOWN(" + formats[i] + ")";
              break
          }
        }
        logINFO(formatMsg)
      }
      this.extDrawBuffers = gl.getExtension("EXT_draw_buffers");
      if(this.extDrawBuffers) {
        logINFO("WebGL max draw buffers:       " + gl.getParameter(this.extDrawBuffers.MAX_DRAW_BUFFERS_EXT));
        logINFO("WebGL max color attachments:  " + gl.getParameter(this.extDrawBuffers.MAX_COLOR_ATTACHMENTS_EXT))
      }else {
        logINFO("WebGL max draw buffers:       " + 1);
        logINFO("WebGL max color attachments:  " + 1)
      }
      this.renderTarget = null;
      this.scope = new pc.gfx.ScopeSpace("Device");
      this.commitFunction = {};
      this.commitFunction[pc.gfx.ShaderInputType.BOOL] = function(locationId, value) {
        gl.uniform1i(locationId, value)
      };
      this.commitFunction[pc.gfx.ShaderInputType.INT] = function(locationId, value) {
        gl.uniform1i(locationId, value)
      };
      this.commitFunction[pc.gfx.ShaderInputType.FLOAT] = function(locationId, value) {
        if(typeof value == "number") {
          gl.uniform1f(locationId, value)
        }else {
          gl.uniform1fv(locationId, value)
        }
      };
      this.commitFunction[pc.gfx.ShaderInputType.VEC2] = function(locationId, value) {
        gl.uniform2fv(locationId, value)
      };
      this.commitFunction[pc.gfx.ShaderInputType.VEC3] = function(locationId, value) {
        gl.uniform3fv(locationId, value)
      };
      this.commitFunction[pc.gfx.ShaderInputType.VEC4] = function(locationId, value) {
        gl.uniform4fv(locationId, value)
      };
      this.commitFunction[pc.gfx.ShaderInputType.IVEC2] = function(locationId, value) {
        gl.uniform2iv(locationId, value)
      };
      this.commitFunction[pc.gfx.ShaderInputType.BVEC2] = function(locationId, value) {
        gl.uniform2iv(locationId, value)
      };
      this.commitFunction[pc.gfx.ShaderInputType.IVEC3] = function(locationId, value) {
        gl.uniform3iv(locationId, value)
      };
      this.commitFunction[pc.gfx.ShaderInputType.BVEC3] = function(locationId, value) {
        gl.uniform3iv(locationId, value)
      };
      this.commitFunction[pc.gfx.ShaderInputType.IVEC4] = function(locationId, value) {
        gl.uniform4iv(locationId, value)
      };
      this.commitFunction[pc.gfx.ShaderInputType.BVEC4] = function(locationId, value) {
        gl.uniform4iv(locationId, value)
      };
      this.commitFunction[pc.gfx.ShaderInputType.MAT2] = function(locationId, value) {
        gl.uniformMatrix2fv(locationId, false, value)
      };
      this.commitFunction[pc.gfx.ShaderInputType.MAT3] = function(locationId, value) {
        gl.uniformMatrix3fv(locationId, false, value)
      };
      this.commitFunction[pc.gfx.ShaderInputType.MAT4] = function(locationId, value) {
        gl.uniformMatrix4fv(locationId, false, value)
      };
      this.setBlending(false);
      this.setBlendFunction(pc.gfx.BLENDMODE_ONE, pc.gfx.BLENDMODE_ZERO);
      this.setBlendEquation(pc.gfx.BLENDEQUATION_ADD);
      this.setColorWrite(true, true, true, true);
      this.setCullMode(pc.gfx.CULLFACE_BACK);
      this.setDepthTest(true);
      this.setDepthWrite(true);
      this.setClearDepth(1);
      this.setClearColor(0, 0, 0, 0);
      gl.enable(gl.SCISSOR_TEST);
      this.programLib = new pc.gfx.ProgramLibrary(this);
      for(var generator in pc.gfx.programlib) {
        this.programLib.register(generator, pc.gfx.programlib[generator])
      }
      var numUniforms = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
      numUniforms -= 4 * 4;
      numUniforms -= 8;
      numUniforms -= 1;
      numUniforms -= 4 * 4;
      this.boneLimit = Math.floor(numUniforms / 4);
      if(this.boneLimit > 110) {
        this.boneLimit = 110
      }
      pc.events.attach(this);
      this.boundBuffer = null;
      this.textureUnits = [];
      this.attributesInvalidated = true;
      this.enabledAttributes = {};
      var bufferId = gl.createBuffer();
      var storage = new ArrayBuffer(16);
      gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
      gl.bufferData(gl.ARRAY_BUFFER, storage, gl.STATIC_DRAW);
      gl.getError();
      gl.vertexAttribPointer(0, 4, gl.UNSIGNED_BYTE, false, 4, 0);
      this.supportsUnsignedByte = gl.getError() === 0;
      gl.deleteBuffer(bufferId)
    }).call(this)
  };
  Device.prototype = {setViewport:function(x, y, width, height) {
    var gl = this.gl;
    gl.viewport(x, y, width, height)
  }, setScissor:function(x, y, width, height) {
    var gl = this.gl;
    gl.scissor(x, y, width, height)
  }, getProgramLibrary:function() {
    return this.programLib
  }, setProgramLibrary:function(programLib) {
    this.programLib = programLib
  }, updateBegin:function() {
    logASSERT(this.canvas !== null, "Device has not been started");
    this.boundBuffer = null;
    this.indexBuffer = null;
    if(this.renderTarget) {
      this.renderTarget.bind()
    }else {
      var gl = this.gl;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    }
    for(var i = 0;i < 16;i++) {
      this.textureUnits[i] = null
    }
  }, updateEnd:function() {
  }, draw:function(primitive) {
    var gl = this.gl;
    var i, j, len, sampler, samplerValue, texture, numTextures, uniform, scopeId, uniformVersion, programVersion;
    var shader = this.shader;
    var samplers = shader.samplers;
    var uniforms = shader.uniforms;
    if(this.attributesInvalidated) {
      var attribute, element, vertexBuffer;
      var attributes = shader.attributes;
      for(i = 0, len = attributes.length;i < len;i++) {
        attribute = attributes[i];
        element = attribute.scopeId.value;
        if(element !== null) {
          vertexBuffer = this.vertexBuffers[element.stream];
          if(this.boundBuffer !== vertexBuffer.bufferId) {
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer.bufferId);
            this.boundBuffer = vertexBuffer.bufferId
          }
          if(!this.enabledAttributes[attribute.locationId]) {
            gl.enableVertexAttribArray(attribute.locationId);
            this.enabledAttributes[attribute.locationId] = true
          }
          gl.vertexAttribPointer(attribute.locationId, element.numComponents, this.glType[element.dataType], element.normalize, element.stride, element.offset)
        }
      }
      this.attributesInvalidated = false
    }
    textureUnit = 0;
    for(i = 0, len = samplers.length;i < len;i++) {
      sampler = samplers[i];
      samplerValue = sampler.scopeId.value;
      if(samplerValue instanceof pc.gfx.Texture) {
        texture = samplerValue;
        if(this.textureUnits[textureUnit] !== texture) {
          gl.activeTexture(gl.TEXTURE0 + textureUnit);
          texture.bind();
          this.textureUnits[textureUnit] = texture
        }
        if(sampler.slot !== textureUnit) {
          gl.uniform1i(sampler.locationId, textureUnit);
          sampler.slot = textureUnit
        }
        textureUnit++
      }else {
        sampler.array.length = 0;
        numTexures = samplerValue.length;
        for(j = 0;j < numTexures;j++) {
          texture = samplerValue[j];
          if(this.textureUnits[textureUnit] !== texture) {
            gl.activeTexture(gl.TEXTURE0 + textureUnit);
            texture.bind();
            this.textureUnits[textureUnit] = texture
          }
          sampler.array[j] = textureUnit;
          textureUnit++
        }
        gl.uniform1iv(sampler.locationId, sampler.array)
      }
    }
    for(i = 0, len = uniforms.length;i < len;i++) {
      uniform = uniforms[i];
      scopeId = uniform.scopeId;
      uniformVersion = uniform.version;
      programVersion = scopeId.versionObject.version;
      if(uniformVersion.globalId !== programVersion.globalId || uniformVersion.revision !== programVersion.revision) {
        uniformVersion.globalId = programVersion.globalId;
        uniformVersion.revision = programVersion.revision;
        this.commitFunction[uniform.dataType](uniform.locationId, scopeId.value)
      }
    }
    if(primitive.indexed) {
      gl.drawElements(this.glPrimitive[primitive.type], primitive.count, this.indexBuffer.glFormat, primitive.base * 2)
    }else {
      gl.drawArrays(this.glPrimitive[primitive.type], primitive.base, primitive.count)
    }
  }, clear:function(options) {
    var defaultOptions = this.defaultClearOptions;
    options = options || defaultOptions;
    var flags = options.flags === undefined ? defaultOptions.flags : options.flags;
    if(flags !== 0) {
      if(flags & pc.gfx.CLEARFLAG_COLOR) {
        var color = options.color === undefined ? defaultOptions.color : options.color;
        this.setClearColor(color[0], color[1], color[2], color[3])
      }
      if(flags & pc.gfx.CLEARFLAG_DEPTH) {
        var depth = options.depth === undefined ? defaultOptions.depth : options.depth;
        this.setClearDepth(depth)
      }
      this.gl.clear(this.glClearFlag[flags])
    }
  }, setClearDepth:function(depth) {
    if(depth !== this.clearDepth) {
      this.gl.clearDepth(depth);
      this.clearDepth = depth
    }
  }, setClearColor:function(r, g, b, a) {
    if(r !== this.clearRed || g !== this.clearGreen || b !== this.clearBlue || a !== this.clearAlpha) {
      this.gl.clearColor(r, g, b, a);
      this.clearRed = r;
      this.clearGreen = g;
      this.clearBlue = b;
      this.clearAlpha = a
    }
  }, setRenderTarget:function(renderTarget) {
    this.renderTarget = renderTarget
  }, getRenderTarget:function() {
    return this.renderTarget
  }, getDepthTest:function() {
    return this.depthTest
  }, setDepthTest:function(depthTest) {
    if(this.depthTest !== depthTest) {
      var gl = this.gl;
      if(depthTest) {
        gl.enable(gl.DEPTH_TEST)
      }else {
        gl.disable(gl.DEPTH_TEST)
      }
      this.depthTest = depthTest
    }
  }, getDepthWrite:function() {
    return this.depthWrite
  }, setDepthWrite:function(writeDepth) {
    if(this.depthWrite !== writeDepth) {
      this.gl.depthMask(writeDepth);
      this.depthWrite = writeDepth
    }
  }, setColorWrite:function(writeRed, writeGreen, writeBlue, writeAlpha) {
    if(this.writeRed !== writeRed || this.writeGreen !== writeGreen || this.writeBlue !== writeBlue || this.writeAlpha !== writeAlpha) {
      this.gl.colorMask(writeRed, writeGreen, writeBlue, writeAlpha);
      this.writeRed = writeRed;
      this.writeGreen = writeGreen;
      this.writeBlue = writeBlue;
      this.writeAlpha = writeAlpha
    }
  }, getBlending:function() {
    return this.blending
  }, setBlending:function(blending) {
    if(this.blending !== blending) {
      var gl = this.gl;
      if(blending) {
        gl.enable(gl.BLEND)
      }else {
        gl.disable(gl.BLEND)
      }
      this.blending = blending
    }
  }, setBlendFunction:function(blendSrc, blendDst) {
    if(this.blendSrc !== blendSrc || this.blendDst !== blendDst) {
      this.gl.blendFunc(this.glBlendFunction[blendSrc], this.glBlendFunction[blendDst]);
      this.blendSrc = blendSrc;
      this.blendDst = blendDst
    }
  }, setBlendEquation:function(blendEquation) {
    if(this.blendEquation !== blendEquation) {
      var gl = this.gl;
      gl.blendEquation(this.glBlendEquation[blendEquation]);
      this.blendEquation = blendEquation
    }
  }, setCullMode:function(cullMode) {
    if(this.cullMode !== cullMode) {
      var gl = this.gl;
      switch(cullMode) {
        case pc.gfx.CULLFACE_NONE:
          gl.disable(gl.CULL_FACE);
          break;
        case pc.gfx.CULLFACE_FRONT:
          gl.enable(gl.CULL_FACE);
          gl.cullFace(gl.FRONT);
          break;
        case pc.gfx.CULLFACE_BACK:
          gl.enable(gl.CULL_FACE);
          gl.cullFace(gl.BACK);
          break;
        case pc.gfx.CULLFACE_FRONTANDBACK:
          gl.enable(gl.CULL_FACE);
          gl.cullFace(gl.FRONT_AND_BACK);
          break
      }
      this.cullMode = cullMode
    }
  }, setIndexBuffer:function(indexBuffer) {
    if(this.indexBuffer !== indexBuffer) {
      this.indexBuffer = indexBuffer;
      var gl = this.gl;
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer ? indexBuffer.bufferId : null)
    }
  }, setVertexBuffer:function(vertexBuffer, stream) {
    if(this.vertexBuffers[stream] !== vertexBuffer) {
      this.vertexBuffers[stream] = vertexBuffer;
      var vertexFormat = vertexBuffer.getFormat();
      var i = 0;
      var elements = vertexFormat.elements;
      var numElements = elements.length;
      while(i < numElements) {
        var vertexElement = elements[i++];
        vertexElement.stream = stream;
        vertexElement.scopeId.setValue(vertexElement)
      }
      this.attributesInvalidated = true
    }
  }, setShader:function(shader) {
    if(shader !== this.shader) {
      this.shader = shader;
      var gl = this.gl;
      gl.useProgram(shader.program);
      this.attributesInvalidated = true
    }
  }, getBoneLimit:function() {
    return this.boneLimit
  }, setBoneLimit:function(maxBones) {
    this.boneLimit = maxBones
  }, enableValidation:function(enable) {
    if(enable === true) {
      if(this.gl instanceof WebGLRenderingContext) {
        this.gl = new WebGLValidator(this.gl)
      }
    }else {
      if(this.gl instanceof WebGLValidator) {
        this.gl = Context.gl
      }
    }
  }, validate:function() {
    var gl = this.gl;
    var error = gl.getError();
    if(error !== gl.NO_ERROR) {
      Log.error("WebGL error: " + WebGLValidator.ErrorString[error]);
      return false
    }
    return true
  }, resizeCanvas:function(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.fire(EVENT_RESIZE, width, height)
  }};
  Object.defineProperty(Device.prototype, "maxSupportedMaxAnisotropy", {get:function() {
    return this.maxTextureMaxAnisotropy
  }});
  Object.defineProperty(Device.prototype, "width", {get:function() {
    return this.gl.drawingBufferWidth || this.canvas.width
  }});
  Object.defineProperty(Device.prototype, "height", {get:function() {
    return this.gl.drawingBufferHeight || this.canvas.height
  }});
  Object.defineProperty(Device.prototype, "fullscreen", {get:function() {
    return!!document.fullscreenElement
  }, set:function(fullscreen) {
    if(fullscreen) {
      var canvas = this.gl.canvas;
      canvas.requestFullscreen()
    }else {
      document.exitFullscreen()
    }
  }});
  return{UnsupportedBrowserError:UnsupportedBrowserError, ContextCreationError:ContextCreationError, Device:Device}
}());
pc.gfx.programlib = {getSnippet:function(device, id) {
  var code = "";
  switch(id) {
    case "common_main_begin":
      code += "void main(void)\n{\n";
      break;
    case "common_main_end":
      code += "}\n";
      break;
    case "fs_alpha_test_decl":
      code += "uniform float alpha_ref;\n";
      break;
    case "fs_alpha_test":
      code += "    if (gl_FragColor.a < alpha_ref) discard;\n\n";
      break;
    case "fs_clamp":
      code += "    gl_FragColor = clamp(gl_FragColor, 0.0, 1.0);\n";
      break;
    case "fs_flat_color_decl":
      code += "uniform vec4 uColor;\n";
      break;
    case "fs_flat_color":
      code += "    gl_FragColor = uColor;\n";
      break;
    case "fs_fog_linear_decl":
    ;
    case "fs_fog_exp_decl":
    ;
    case "fs_fog_exp2_decl":
      code += "uniform vec3 fog_color;\n";
      if(id === "fs_fog_linear_decl") {
        code += "uniform float fog_start;\n";
        code += "uniform float fog_end;\n\n"
      }else {
        code += "uniform float fog_density;\n\n"
      }
      break;
    case "fs_fog_linear":
    ;
    case "fs_fog_exp":
    ;
    case "fs_fog_exp2":
      code += "    float depth = gl_FragCoord.z / gl_FragCoord.w;\n";
      if(id === "fs_fog_linear") {
        code += "    float fogFactor = (fog_end - depth) / (fog_end - fog_start);\n"
      }else {
        if(id === "fs_fog_exp") {
          code += "    float fogFactor = exp(-depth * fog_density);\n"
        }else {
          code += "    float fogFactor = exp(-depth * depth * fog_density * fog_density);\n"
        }
      }
      code += "    fogFactor = clamp(fogFactor, 0.0, 1.0);\n";
      code += "    gl_FragColor.rgb = mix(fog_color, gl_FragColor.rgb, fogFactor);\n";
      break;
    case "fs_precision":
      code += "precision " + device.precision + " float;\n\n";
      break;
    case "fs_height_map_funcs":
      code += "vec3 perturb_normal( vec3 N, vec3 p, vec2 uv )\n";
      code += "{\n";
      code += "    vec3 dp1 = dFdx( p );\n";
      code += "    vec3 dp2 = dFdy( p );\n";
      code += "    vec2 duv1 = dFdx( uv );\n";
      code += "    vec2 duv2 = dFdy( uv );\n\n";
      code += "    vec3 dp2perp = cross( dp2, N );\n";
      code += "    vec3 dp1perp = cross( N, dp1 );\n\n";
      code += "    const float bumpScale = 0.125;\n";
      code += "    float Hll = bumpScale * texture2D( texture_heightMap, uv ).x;\n";
      code += "    float dBx = bumpScale * texture2D( texture_heightMap, uv + duv1 ).x - Hll;\n";
      code += "    float dBy = bumpScale * texture2D( texture_heightMap, uv + duv2 ).x - Hll;\n\n";
      code += "    float fDet = dot( dp1, dp2perp );\n";
      code += "    vec3 vGrad = sign( fDet ) * ( dBx * dp2perp + dBy * dp1perp );\n";
      code += "    return normalize( abs( fDet ) * N - vGrad );\n";
      code += "}\n\n";
      break;
    case "fs_normal_map_funcs":
      if(!pc.gfx.precalculatedTangents) {
        code += "mat3 cotangent_frame( vec3 N, vec3 p, vec2 uv )\n";
        code += "{\n";
        code += "    vec3 dp1 = dFdx( p );\n";
        code += "    vec3 dp2 = dFdy( p );\n";
        code += "    vec2 duv1 = dFdx( uv );\n";
        code += "    vec2 duv2 = dFdy( uv );\n\n";
        code += "    vec3 dp2perp = cross( dp2, N );\n";
        code += "    vec3 dp1perp = cross( N, dp1 );\n";
        code += "    vec3 T = dp2perp * duv1.x + dp1perp * duv2.x;\n";
        code += "    vec3 B = dp2perp * duv1.y + dp1perp * duv2.y;\n\n";
        code += "    float invmax = inversesqrt( max( dot(T,T), dot(B,B) ) );\n";
        code += "    return mat3( T * invmax, B * invmax, N );\n";
        code += "}\n\n";
        code += "vec3 perturb_normal( vec3 N, vec3 V, vec2 uv )\n";
        code += "{\n";
        code += "    vec3 map = texture2D( texture_normalMap, uv ).xyz;\n";
        code += "    map = map * 255./127. - 128./127.;\n";
        code += "    map.xy = map.xy * material_bumpMapFactor;\n";
        code += "    mat3 TBN = cotangent_frame( N, -V, uv );\n";
        code += "    return normalize( TBN * map );\n";
        code += "}\n\n"
      }
      break;
    case "vs_skin_decl":
      if(device.supportsBoneTextures) {
        code += ["attribute vec4 vertex_boneWeights;", "attribute vec4 vertex_boneIndices;", "", "uniform sampler2D texture_poseMap;", "uniform vec2 texture_poseMapSize;", "", "mat4 getBoneMatrix(const in float i)", "{", "    float j = i * 4.0;", "    float x = mod(j, float(texture_poseMapSize.x));", "    float y = floor(j / float(texture_poseMapSize.x));", "", "    float dx = 1.0 / float(texture_poseMapSize.x);", "    float dy = 1.0 / float(texture_poseMapSize.y);", "", "    y = dy * (y + 0.5);", 
        "", "    vec4 v1 = texture2D(texture_poseMap, vec2(dx * (x + 0.5), y));", "    vec4 v2 = texture2D(texture_poseMap, vec2(dx * (x + 1.5), y));", "    vec4 v3 = texture2D(texture_poseMap, vec2(dx * (x + 2.5), y));", "    vec4 v4 = texture2D(texture_poseMap, vec2(dx * (x + 3.5), y));", "", "    mat4 bone = mat4(v1, v2, v3, v4);", "", "    return bone;", "}"].join("\n")
      }else {
        code += ["attribute vec4 vertex_boneWeights;", "attribute vec4 vertex_boneIndices;", "", "uniform mat4 matrix_pose[" + device.getBoneLimit() + "];", "", "mat4 getBoneMatrix(const in float i)", "{", "    mat4 bone = matrix_pose[int(i)];", "", "    return bone;", "}"].join("\n")
      }
      code += "\n\n";
      break;
    case "vs_transform_decl":
      code += "attribute vec3 vertex_position;\n";
      code += "uniform mat4 matrix_model;\n";
      code += "uniform mat4 matrix_viewProjection;\n\n";
      break
  }
  return code
}};
pc.gfx.programlib.basic = {generateKey:function(device, options) {
  var key = "basic";
  if(options.fog) {
    key += "_fog"
  }
  if(options.alphaTest) {
    key += "_atst"
  }
  if(options.vertexColors) {
    key += "_vcol"
  }
  if(options.diffuseMap) {
    key += "_diff"
  }
  return key
}, createShaderDefinition:function(device, options) {
  var attributes = {vertex_position:pc.gfx.SEMANTIC_POSITION};
  if(options.skin) {
    attributes.vertex_boneWeights = pc.gfx.SEMANTIC_BLENDWEIGHT;
    attributes.vertex_boneIndices = pc.gfx.SEMANTIC_BLENDINDICES
  }
  if(options.vertexColors) {
    attributes.vertex_color = pc.gfx.SEMANTIC_COLOR
  }
  if(options.diffuseMap) {
    attributes.vertex_texCoord0 = pc.gfx.SEMANTIC_TEXCOORD0
  }
  var getSnippet = pc.gfx.programlib.getSnippet;
  var code = "";
  code += getSnippet(device, "vs_transform_decl");
  if(options.skin) {
    code += getSnippet(device, "vs_skin_decl")
  }
  if(options.vertexColors) {
    code += "attribute vec4 vertex_color;\n";
    code += "varying vec4 vColor;\n"
  }
  if(options.diffuseMap) {
    code += "attribute vec2 vertex_texCoord0;\n";
    code += "varying vec2 vUv0;\n"
  }
  code += getSnippet(device, "common_main_begin");
  if(options.skin) {
    code += "    mat4 modelMatrix = vertex_boneWeights.x * getBoneMatrix(vertex_boneIndices.x) +\n";
    code += "                       vertex_boneWeights.y * getBoneMatrix(vertex_boneIndices.y) +\n";
    code += "                       vertex_boneWeights.z * getBoneMatrix(vertex_boneIndices.z) +\n";
    code += "                       vertex_boneWeights.w * getBoneMatrix(vertex_boneIndices.w);\n"
  }else {
    code += "    mat4 modelMatrix = matrix_model;\n"
  }
  code += "\n";
  code += "    vec4 positionW = modelMatrix * vec4(vertex_position, 1.0);\n";
  code += "    gl_Position = matrix_viewProjection * positionW;\n\n";
  if(options.vertexColors) {
    code += "    vColor = vertex_color;\n"
  }
  if(options.diffuseMap) {
    code += "    vUv0 = vertex_texCoord0;\n"
  }
  code += getSnippet(device, "common_main_end");
  var vshader = code;
  code = getSnippet(device, "fs_precision");
  if(options.vertexColors) {
    code += "varying vec4 vColor;\n"
  }else {
    code += "uniform vec4 uColor;\n"
  }
  if(options.diffuseMap) {
    code += "varying vec2 vUv0;\n";
    code += "uniform sampler2D texture_diffuseMap;\n"
  }
  if(options.fog) {
    code += getSnippet(device, "fs_fog_decl")
  }
  if(options.alphatest) {
    code += getSnippet(device, "fs_alpha_test_decl")
  }
  code += getSnippet(device, "common_main_begin");
  if(options.vertexColors) {
    code += "    gl_FragColor = vColor;\n"
  }else {
    code += "    gl_FragColor = uColor;\n"
  }
  if(options.diffuseMap) {
    code += "    gl_FragColor *= texture2D(texture_diffuseMap, vUv0);\n"
  }
  if(options.alphatest) {
    code += getSnippet(device, "fs_alpha_test")
  }
  code += getSnippet(device, "fs_clamp");
  if(options.fog) {
    code += getSnippet(device, "fs_fog")
  }
  code += getSnippet(device, "common_main_end");
  var fshader = code;
  return{attributes:attributes, vshader:vshader, fshader:fshader}
}};
pc.gfx.programlib.depth = {generateKey:function(device, options) {
  var key = "depth";
  if(options.skin) {
    key += "_skin"
  }
  if(options.opacityMap) {
    key += "_opam"
  }
  return key
}, createShaderDefinition:function(device, options) {
  var attributes = {vertex_position:pc.gfx.SEMANTIC_POSITION};
  if(options.skin) {
    attributes.vertex_boneWeights = pc.gfx.SEMANTIC_BLENDWEIGHT;
    attributes.vertex_boneIndices = pc.gfx.SEMANTIC_BLENDINDICES
  }
  if(options.opacityMap) {
    attributes.vertex_texCoord0 = pc.gfx.SEMANTIC_TEXCOORD0
  }
  var getSnippet = pc.gfx.programlib.getSnippet;
  var code = "";
  code += getSnippet(device, "vs_transform_decl");
  if(options.skin) {
    code += getSnippet(device, "vs_skin_decl")
  }
  if(options.opacityMap) {
    code += "attribute vec2 vertex_texCoord0;\n\n";
    code += "varying vec2 vUv0;\n\n"
  }
  code += getSnippet(device, "common_main_begin");
  if(options.skin) {
    code += "    mat4 modelMatrix = vertex_boneWeights.x * getBoneMatrix(vertex_boneIndices.x) +\n";
    code += "                       vertex_boneWeights.y * getBoneMatrix(vertex_boneIndices.y) +\n";
    code += "                       vertex_boneWeights.z * getBoneMatrix(vertex_boneIndices.z) +\n";
    code += "                       vertex_boneWeights.w * getBoneMatrix(vertex_boneIndices.w);\n"
  }else {
    code += "    mat4 modelMatrix = matrix_model;\n"
  }
  code += "\n";
  code += "    vec4 positionW = modelMatrix * vec4(vertex_position, 1.0);\n";
  code += "    gl_Position = matrix_viewProjection * positionW;\n\n";
  if(options.opacityMap) {
    code += "    vUv0 = vertex_texCoord0;\n"
  }
  code += getSnippet(device, "common_main_end");
  var vshader = code;
  code = getSnippet(device, "fs_precision");
  code += "uniform float camera_near;\n";
  code += "uniform float camera_far;\n";
  code += getSnippet(device, "common_main_begin");
  code += "float depth = gl_FragCoord.z / gl_FragCoord.w;";
  code += "float color = 1.0 - smoothstep(camera_near, camera_far, depth);";
  code += "gl_FragColor = vec4(vec3(color), 1.0);";
  code += getSnippet(device, "common_main_end");
  var fshader = code;
  return{attributes:attributes, vshader:vshader, fshader:fshader}
}};
pc.gfx.programlib.depthrgba = {generateKey:function(device, options) {
  var key = "depthrgba";
  if(options.skin) {
    key += "_skin"
  }
  if(options.opacityMap) {
    key += "_opam"
  }
  return key
}, createShaderDefinition:function(device, options) {
  var attributes = {vertex_position:pc.gfx.SEMANTIC_POSITION};
  if(options.skin) {
    attributes.vertex_boneWeights = pc.gfx.SEMANTIC_BLENDWEIGHT;
    attributes.vertex_boneIndices = pc.gfx.SEMANTIC_BLENDINDICES
  }
  if(options.opacityMap) {
    attributes.vertex_texCoord0 = pc.gfx.SEMANTIC_TEXCOORD0
  }
  var getSnippet = pc.gfx.programlib.getSnippet;
  var code = "";
  code += getSnippet(device, "vs_transform_decl");
  if(options.skin) {
    code += getSnippet(device, "vs_skin_decl")
  }
  if(options.opacityMap) {
    code += "attribute vec2 vertex_texCoord0;\n\n";
    code += "varying vec2 vUv0;\n\n"
  }
  code += getSnippet(device, "common_main_begin");
  if(options.skin) {
    code += "    mat4 modelMatrix = vertex_boneWeights.x * getBoneMatrix(vertex_boneIndices.x) +\n";
    code += "                       vertex_boneWeights.y * getBoneMatrix(vertex_boneIndices.y) +\n";
    code += "                       vertex_boneWeights.z * getBoneMatrix(vertex_boneIndices.z) +\n";
    code += "                       vertex_boneWeights.w * getBoneMatrix(vertex_boneIndices.w);\n"
  }else {
    code += "    mat4 modelMatrix = matrix_model;\n"
  }
  code += "\n";
  code += "    vec4 positionW = modelMatrix * vec4(vertex_position, 1.0);\n";
  code += "    gl_Position = matrix_viewProjection * positionW;\n\n";
  if(options.opacityMap) {
    code += "    vUv0 = vertex_texCoord0;\n"
  }
  code += getSnippet(device, "common_main_end");
  var vshader = code;
  code = getSnippet(device, "fs_precision");
  if(options.opacityMap) {
    code += "varying vec2 vUv0;\n\n";
    code += "uniform sampler2D texture_opacityMap;\n\n"
  }
  code += "vec4 packFloat(float depth)\n";
  code += "{\n";
  code += "    const vec4 bit_shift = vec4(256.0 * 256.0 * 256.0, 256.0 * 256.0, 256.0, 1.0);\n";
  code += "    const vec4 bit_mask  = vec4(0.0, 1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0);\n";
  code += "    vec4 res = mod(depth * bit_shift * vec4(255), vec4(256) ) / vec4(255);\n";
  code += "    res -= res.xxyz * bit_mask;\n";
  code += "    return res;\n";
  code += "}\n\n";
  code += getSnippet(device, "common_main_begin");
  if(options.opacityMap) {
    code += "    if (texture2D(texture_opacityMap, vUv0).r < 0.25) discard;\n\n"
  }
  code += "    gl_FragData[0] = packFloat(gl_FragCoord.z);\n";
  code += getSnippet(device, "common_main_end");
  var fshader = code;
  return{attributes:attributes, vshader:vshader, fshader:fshader}
}};
pc.gfx.programlib.particle = {generateKey:function(device, options) {
  var key = "particle";
  if(options.billboard) {
    key += "_bbrd"
  }
  return key
}, createShaderDefinition:function(device, options) {
  var attributes = {particle_uvLifeTimeFrameStart:pc.gfx.SEMANTIC_ATTR0, particle_positionStartTime:pc.gfx.SEMANTIC_ATTR1, particle_velocityStartSize:pc.gfx.SEMANTIC_ATTR2, particle_accelerationEndSize:pc.gfx.SEMANTIC_ATTR3, particle_spinStartSpinSpeed:pc.gfx.SEMANTIC_ATTR4, particle_colorMult:pc.gfx.SEMANTIC_ATTR5};
  if(!options.billboard) {
    attributes.particle_orientation = pc.gfx.SEMANTIC_ATTR6
  }
  var getSnippet = pc.gfx.programlib.getSnippet;
  var code = "";
  code += "attribute vec4 particle_uvLifeTimeFrameStart;\n";
  code += "attribute vec4 particle_positionStartTime;\n";
  code += "attribute vec4 particle_velocityStartSize;\n";
  code += "attribute vec4 particle_accelerationEndSize;\n";
  code += "attribute vec4 particle_spinStartSpinSpeed;\n";
  code += "attribute vec4 particle_colorMult;\n";
  if(!options.billboard) {
    code += "attribute vec4 particle_orientation;\n"
  }
  code += "uniform mat4 matrix_viewProjection;\n";
  code += "uniform mat4 matrix_model;\n";
  code += "uniform mat4 matrix_viewInverse;\n";
  code += "uniform vec3 particle_worldVelocity;\n";
  code += "uniform vec3 particle_worldAcceleration;\n";
  code += "uniform float particle_timeRange;\n";
  code += "uniform float particle_time;\n";
  code += "uniform float particle_timeOffset;\n";
  code += "uniform float particle_frameDuration;\n";
  code += "uniform float particle_numFrames;\n\n";
  code += "varying vec2 vUv0;\n";
  code += "varying float vAge;\n";
  code += "varying vec4 vColor;\n\n";
  code += "void main(void)\n";
  code += "{\n";
  code += "    vec2 uv = particle_uvLifeTimeFrameStart.xy;\n";
  code += "    float lifeTime = particle_uvLifeTimeFrameStart.z;\n";
  code += "    float frameStart = particle_uvLifeTimeFrameStart.w;\n";
  code += "    vec3 position = particle_positionStartTime.xyz;\n";
  code += "    float startTime = particle_positionStartTime.w;\n";
  code += "    vec3 velocity = (matrix_model * vec4(particle_velocityStartSize.xyz, 0.0)).xyz + particle_worldVelocity;\n";
  code += "    float startSize = particle_velocityStartSize.w;\n";
  code += "    vec3 acceleration = (matrix_model * vec4(particle_accelerationEndSize.xyz, 0.0)).xyz + particle_worldAcceleration;\n";
  code += "    float endSize = particle_accelerationEndSize.w;\n";
  code += "    float spinStart = particle_spinStartSpinSpeed.x;\n";
  code += "    float spinSpeed = particle_spinStartSpinSpeed.y;\n";
  code += "    float localTime = mod((particle_time - particle_timeOffset - startTime), particle_timeRange);\n";
  code += "    float percentLife = localTime / lifeTime;\n";
  code += "    float frame = mod(floor(localTime / particle_frameDuration + frameStart), particle_numFrames);\n";
  code += "    float uOffset = frame / particle_numFrames;\n";
  code += "    float u = uOffset + (uv.x + 0.5) * (1.0 / particle_numFrames);\n";
  code += "    vUv0 = vec2(u, uv.y + 0.5);\n";
  code += "    vColor = particle_colorMult;\n";
  if(options.billboard) {
    code += "    vec3 basisX = matrix_viewInverse[0].xyz;\n";
    code += "    vec3 basisZ = matrix_viewInverse[1].xyz;\n";
    code += "    float size = mix(startSize, endSize, percentLife);\n";
    code += "    size = (percentLife < 0.0 || percentLife > 1.0) ? 0.0 : size;\n";
    code += "    float s = sin(spinStart + spinSpeed * localTime);\n";
    code += "    float c = cos(spinStart + spinSpeed * localTime);\n";
    code += "    vec2 rotatedPoint = vec2(uv.x * c + uv.y * s, \n";
    code += "                             -uv.x * s + uv.y * c);\n";
    code += "    vec3 localPosition = vec3(basisX * rotatedPoint.x +\n";
    code += "                              basisZ * rotatedPoint.y) * size +\n";
    code += "                              velocity * localTime +\n";
    code += "                              acceleration * localTime * localTime + \n";
    code += "                              position;\n";
    code += "    vAge = percentLife;\n";
    code += "    gl_Position = matrix_viewProjection * vec4(localPosition + matrix_model[3].xyz, 1.0);\n"
  }else {
    code += "    float size = mix(startSize, endSize, percentLife);\n";
    code += "    size = (percentLife < 0.0 || percentLife > 1.0) ? 0.0 : size;\n";
    code += "    float s = sin(spinStart + spinSpeed * localTime);\n";
    code += "    float c = cos(spinStart + spinSpeed * localTime);\n";
    code += "\n";
    code += "    vec4 rotatedPoint = vec4((uv.x * c + uv.y * s) * size, 0.0, (uv.x * s - uv.y * c) * size, 1.0);\n";
    code += "    vec3 center = velocity * localTime + acceleration * localTime * localTime + position;\n";
    code += "\n";
    code += "    vec4 q2 = particle_orientation + particle_orientation;\n";
    code += "    vec4 qx = particle_orientation.xxxw * q2.xyzx;\n";
    code += "    vec4 qy = particle_orientation.xyyw * q2.xyzy;\n";
    code += "    vec4 qz = particle_orientation.xxzw * q2.xxzz;\n";
    code += "\n";
    code += "    mat4 localMatrix =\n";
    code += "         mat4((1.0 - qy.y) - qz.z, qx.y + qz.w, qx.z - qy.w, 0,\n";
    code += "              qx.y - qz.w, (1.0 - qx.x) - qz.z, qy.z + qx.w, 0,\n";
    code += "              qx.z + qy.w, qy.z - qx.w, (1.0 - qx.x) - qy.y, 0,\n";
    code += "              center.x, center.y, center.z, 1);\n";
    code += "    rotatedPoint = localMatrix * rotatedPoint;\n";
    code += "    vAge = percentLife;\n";
    code += "    gl_Position = matrix_viewProjection * vec4(rotatedPoint.xyz + matrix_model[3].xyz, 1.0);\n"
  }
  code += "}";
  var vshader = code;
  code = getSnippet(device, "fs_precision");
  code += "varying vec2 vUv0;\n";
  code += "varying float vAge;\n";
  code += "varying vec4 vColor;\n";
  code += "uniform sampler2D texture_colorMap;\n";
  code += "uniform sampler2D texture_opacityMap;\n";
  code += "uniform sampler2D texture_rampMap;\n\n";
  code += "void main(void)\n";
  code += "{\n";
  code += "    vec4 colorMult = texture2D(texture_rampMap, vec2(vAge, 0.5)) * vColor;\n";
  code += "    vec3 rgb = texture2D(texture_colorMap, vUv0).rgb;\n";
  code += "    float a = texture2D(texture_opacityMap, vUv0).r;\n";
  code += "    gl_FragColor = vec4(rgb, a) * colorMult;\n";
  code += "}";
  var fshader = code;
  return{attributes:attributes, vshader:vshader, fshader:fshader}
}};
pc.gfx.programlib.phong = {generateKey:function(device, options) {
  var key = "phong";
  if(options.skin) {
    key += "_skin"
  }
  switch(options.fog) {
    case "none":
      key += "_fogn";
      break;
    case "linear":
      key += "_fogl";
      break;
    case "exp2":
      key += "_foge";
      break
  }
  if(options.numDirs > 0) {
    key += "_" + options.numDirs + "dir"
  }
  if(options.numPnts > 0) {
    key += "_" + options.numPnts + "pnt"
  }
  if(options.numSpts > 0) {
    key += "_" + options.numSpts + "spt"
  }
  if(options.numSDirs > 0) {
    key += "_" + options.numSDirs + "sdir"
  }
  if(options.numSPnts > 0) {
    key += "_" + options.numSPnts + "spnt"
  }
  if(options.numSSpts > 0) {
    key += "_" + options.numSSpts + "sspt"
  }
  if(options.vertexColors) {
    key += "_vcol"
  }
  if(options.diffuseMapTransform) {
    key += "_difx"
  }else {
    if(options.diffuseMap) {
      key += "_difm"
    }else {
      key += "_difc"
    }
  }
  if(options.specularMapTransform) {
    key += "_spex"
  }else {
    if(options.specularMap) {
      key += "_spem"
    }else {
      key += "_spec"
    }
  }
  if(options.glossMapTransform) {
    key += "_glox"
  }else {
    if(options.glossMap) {
      key += "_glom"
    }
  }
  if(options.emissiveMapTransform) {
    key += "_emix"
  }else {
    if(options.emissiveMap) {
      key += "_emim"
    }else {
      key += "_emic"
    }
  }
  if(options.opacityMapTransform) {
    key += "_opax"
  }else {
    if(options.opacityMap) {
      key += "_opam"
    }
  }
  if(options.normalMapTransform) {
    key += "_norx"
  }else {
    if(options.normalMap) {
      key += "_norm"
    }
  }
  if(options.heightMapTransform) {
    key += "_hgtx"
  }else {
    if(options.heightMap) {
      key += "_hgtm"
    }
  }
  if(options.sphereMap) {
    key += "_sphr"
  }
  if(options.cubeMap) {
    key += "_cube"
  }
  if(options.lightMap) {
    key += "_lght"
  }
  return key
}, createShaderDefinition:function(device, options) {
  var i;
  var numNormalLights = options.numDirs + options.numPnts + options.numSpts;
  var numShadowLights = options.numSDirs + options.numSPnts + options.numSSpts;
  var totalDirs = options.numDirs + options.numSDirs;
  var totalPnts = options.numPnts + options.numSPnts;
  var totalSpts = options.numSpts + options.numSSpts;
  var totalLights = numNormalLights + numShadowLights;
  var lighting = totalLights > 0;
  var mapWithoutTransform = options.diffuseMap && !options.diffuseMapTransform || options.specularMap && !options.specularMapTransform || options.glossMap && !options.glossMapTransform || options.emissiveMap && !options.emissiveMapTransform || options.opacityMap && !options.opacityMapTransform || options.normalMap && !options.normalMapTransform || options.heightMap && !options.heightMapTransform;
  var useTangents = pc.gfx.precalculatedTangents;
  var attributes = {vertex_position:pc.gfx.SEMANTIC_POSITION};
  if(lighting || options.cubeMap || options.sphereMap) {
    attributes.vertex_normal = pc.gfx.SEMANTIC_NORMAL;
    if(options.normalMap && useTangents) {
      attributes.vertex_tangent = pc.gfx.SEMANTIC_TANGENT
    }
  }
  if(options.diffuseMap || options.specularMap || options.glossMap || options.emissiveMap || options.normalMap || options.heightMap || options.opacityMap) {
    attributes.vertex_texCoord0 = pc.gfx.SEMANTIC_TEXCOORD0
  }
  if(options.lightMap) {
    attributes.vertex_texCoord1 = pc.gfx.SEMANTIC_TEXCOORD1
  }
  if(options.vertexColors) {
    attributes.vertex_color = pc.gfx.SEMANTIC_COLOR
  }
  if(options.skin) {
    attributes.vertex_boneWeights = pc.gfx.SEMANTIC_BLENDWEIGHT;
    attributes.vertex_boneIndices = pc.gfx.SEMANTIC_BLENDINDICES
  }
  var getSnippet = pc.gfx.programlib.getSnippet;
  var code = "";
  code += "attribute vec3 vertex_position;\n";
  if(lighting) {
    code += "attribute vec3 vertex_normal;\n";
    if(options.normalMap && useTangents) {
      code += "attribute vec4 vertex_tangent;\n"
    }
  }
  if(options.diffuseMap || options.specularMap || options.glossMap || options.emissiveMap || options.normalMap || options.heightMap || options.opacityMap) {
    code += "attribute vec2 vertex_texCoord0;\n"
  }
  if(options.lightMap) {
    code += "attribute vec2 vertex_texCoord1;\n"
  }
  if(options.vertexColors) {
    code += "attribute vec4 vertex_color;\n"
  }
  code += "\n";
  code += "uniform mat4 matrix_viewProjection;\n";
  code += "uniform mat4 matrix_model;\n";
  if(lighting) {
    code += "uniform mat3 matrix_normal;\n"
  }
  for(i = 0;i < totalLights;i++) {
    if(i < totalDirs) {
      code += "uniform vec3 light" + i + "_direction;\n"
    }
    if(i >= totalDirs) {
      code += "uniform vec3 light" + i + "_position;\n"
    }
    if(i >= totalDirs + totalPnts) {
      code += "uniform vec3 light" + i + "_spotDirection;\n"
    }
    if(i >= options.numDirs && i < totalDirs || i >= totalDirs + options.numPnts && i < totalDirs + totalPnts || i >= totalDirs + totalPnts + options.numSpts && i < totalLights) {
      code += "uniform mat4 light" + i + "_shadowMatrix;\n"
    }
  }
  if(lighting) {
    code += "uniform vec3 view_position;\n"
  }
  if(options.diffuseMap && options.diffuseMapTransform) {
    code += "uniform mat4 texture_diffuseMapTransform;\n"
  }
  if(options.normalMap && options.normalMapTransform) {
    code += "uniform mat4 texture_normalMapTransform;\n"
  }
  if(options.heightMap && options.heightMapTransform) {
    code += "uniform mat4 texture_heightMapTransform;\n"
  }
  if(options.opacityMap && options.opacityMapTransform) {
    code += "uniform mat4 texture_opacityMapTransform;\n"
  }
  if(options.specularMap && options.specularMapTransform) {
    code += "uniform mat4 texture_specularMapTransform;\n"
  }
  if(options.glossMap && options.glossMapTransform) {
    code += "uniform mat4 texture_glossMapTransform;\n"
  }
  if(options.emissiveMap && options.emissiveMapTransform) {
    code += "uniform mat4 texture_emissiveMapTransform;\n"
  }
  code += "\n";
  if(lighting) {
    if(!(options.normalMap && useTangents)) {
      code += "varying vec3 vNormalW;\n"
    }
    code += "varying vec3 vViewDirW;\n";
    for(i = 0;i < totalLights;i++) {
      code += "varying vec3 vLight" + i + "DirW;\n";
      if(i >= totalDirs + totalPnts) {
        code += "varying vec3 vLight" + i + "SpotDirW;\n"
      }
      if(i >= options.numDirs && i < totalDirs || i >= totalDirs + options.numPnts && i < totalDirs + totalPnts || i >= totalDirs + totalPnts + options.numSpts && i < totalLights) {
        code += "varying vec4 vLight" + i + "ShadowCoord;\n"
      }
    }
  }
  if(mapWithoutTransform) {
    code += "varying vec2 vUv0;\n"
  }
  if(options.diffuseMap && options.diffuseMapTransform) {
    code += "varying vec2 vUvDiffuseMap;\n"
  }
  if(lighting) {
    if(options.specularMap && options.specularMapTransform) {
      code += "varying vec2 vUvSpecularMap;\n"
    }
    if(options.glossMap && options.glossMapTransform) {
      code += "varying vec2 vUvGlossMap;\n"
    }
    if(options.normalMap && options.normalMapTransform || options.heightMap && options.heightMapTransform) {
      code += "varying vec2 vUvBumpMap;\n"
    }
  }
  if(options.emissiveMap && options.emissiveMapTransform) {
    code += "varying vec2 vUvEmissiveMap;\n"
  }
  if(options.opacityMap && options.opacityMapTransform) {
    code += "varying vec2 vUvOpacityMap;\n"
  }
  if(options.lightMap) {
    code += "varying vec2 vUvLightMap;\n"
  }
  if(options.vertexColors) {
    code += "varying vec4 vVertexColor;\n"
  }
  code += "\n";
  if(options.skin) {
    code += getSnippet(device, "vs_skin_decl")
  }
  code += "void main(void)\n";
  code += "{\n";
  if(options.skin) {
    code += "    mat4 modelMatrix = vertex_boneWeights.x * getBoneMatrix(vertex_boneIndices.x) +\n";
    code += "                       vertex_boneWeights.y * getBoneMatrix(vertex_boneIndices.y) +\n";
    code += "                       vertex_boneWeights.z * getBoneMatrix(vertex_boneIndices.z) +\n";
    code += "                       vertex_boneWeights.w * getBoneMatrix(vertex_boneIndices.w);\n";
    code += "    mat3 normalMatrix = mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz);\n"
  }else {
    code += "    mat4 modelMatrix = matrix_model;\n";
    code += "    mat3 normalMatrix = matrix_normal;\n"
  }
  code += "\n";
  code += "    vec4 positionW = modelMatrix * vec4(vertex_position, 1.0);\n";
  code += "    gl_Position = matrix_viewProjection * positionW;\n\n";
  if(lighting) {
    code += "    vec3 normalW = normalMatrix * vertex_normal;\n";
    code += "    normalW = normalize(normalW);\n";
    if(options.normalMap && useTangents) {
      code += "    vec3 tangentW = normalMatrix * vertex_tangent.xyz;\n";
      code += "    tangentW  = normalize(tangentW);\n"
    }
  }
  code += "\n";
  if(lighting) {
    if(options.normalMap && useTangents) {
      code += "    vec3 binormalW = cross(normalW, tangentW) * vertex_tangent.w;\n";
      code += "    mat3 tbnMatrix = mat3(tangentW.x, binormalW.x, normalW.x,\n";
      code += "                          tangentW.y, binormalW.y, normalW.y,\n";
      code += "                          tangentW.z, binormalW.z, normalW.z);\n";
      code += "    vViewDirW = tbnMatrix * (view_position - positionW.xyz);\n";
      for(i = 0;i < totalLights;i++) {
        if(i < totalDirs) {
          code += "    vLight" + i + "DirW = -(tbnMatrix * light" + i + "_direction);\n"
        }
        if(i >= totalDirs) {
          code += "    vLight" + i + "DirW = tbnMatrix * (light" + i + "_position - positionW.xyz);\n"
        }
        if(i >= totalDirs + totalPnts) {
          code += "    vLight" + i + "SpotDirW = tbnMatrix * light" + i + "_spotDirection;\n"
        }
      }
    }else {
      code += "    vNormalW = normalW;\n";
      code += "    vViewDirW = view_position - positionW.xyz;\n";
      for(i = 0;i < totalLights;i++) {
        if(i < totalDirs) {
          code += "    vLight" + i + "DirW = -light" + i + "_direction;\n"
        }
        if(i >= totalDirs) {
          code += "    vLight" + i + "DirW = light" + i + "_position - positionW.xyz;\n"
        }
        if(i >= totalDirs + totalPnts) {
          code += "    vLight" + i + "SpotDirW = light" + i + "_spotDirection;\n"
        }
      }
    }
    for(i = 0;i < totalLights;i++) {
      if(i >= options.numDirs && i < totalDirs || i >= totalDirs + options.numPnts && i < totalDirs + totalPnts || i >= totalDirs + totalPnts + options.numSpts && i < totalLights) {
        code += "    vLight" + i + "ShadowCoord = light" + i + "_shadowMatrix * positionW;\n"
      }
    }
    code += "\n"
  }
  if(mapWithoutTransform) {
    code += "    vUv0 = vertex_texCoord0;\n"
  }
  if(options.diffuseMap && options.diffuseMapTransform) {
    code += "    vUvDiffuseMap = (texture_diffuseMapTransform * vec4(vertex_texCoord0, 0, 1)).st;\n"
  }
  if(lighting) {
    if(options.specularMap & options.specularMapTransform) {
      code += "    vUvSpecularMap = (texture_specularMapTransform * vec4(vertex_texCoord0, 0, 1)).st;\n"
    }
    if(options.glossMap & options.glossMapTransform) {
      code += "    vUvGlossMap = (texture_glossMapTransform * vec4(vertex_texCoord0, 0, 1)).st;\n"
    }
    if(options.normalMap && options.normalMapTransform) {
      code += "    vUvBumpMap = (texture_normalMapTransform * vec4(vertex_texCoord0, 0, 1)).st;\n"
    }else {
      if(options.heightMap && options.heightMapTransform) {
        code += "    vUvBumpMap = (texture_heightMapTransform * vec4(vertex_texCoord0, 0, 1)).st;\n"
      }
    }
  }
  if(options.opacityMap && options.opacityMapTransform) {
    code += "    vUvOpacityMap = (texture_opacityMapTransform * vec4(vertex_texCoord0, 0, 1)).st;\n"
  }
  if(options.emissiveMap && options.emissiveMapTransform) {
    code += "    vUvEmissiveMap = (texture_emissiveMapTransform * vec4(vertex_texCoord0, 0, 1)).st;\n"
  }
  if(options.lightMap) {
    code += "    vUvLightMap = vertex_texCoord1;\n"
  }
  code += "}";
  var vshader = code;
  code = getSnippet(device, "fs_precision");
  if(options.normalMap && !useTangents || options.heightMap) {
    code += "#extension GL_OES_standard_derivatives : enable\n\n"
  }
  if(lighting) {
    if(!(options.normalMap && useTangents)) {
      code += "varying vec3 vNormalW;\n"
    }
    code += "varying vec3 vViewDirW;\n";
    for(i = 0;i < totalLights;i++) {
      code += "varying vec3 vLight" + i + "DirW;\n";
      if(i >= totalDirs + totalPnts) {
        code += "varying vec3 vLight" + i + "SpotDirW;\n"
      }
      if(i >= options.numDirs && i < totalDirs || i >= totalDirs + options.numPnts && i < totalDirs + totalPnts || i >= totalDirs + totalPnts + options.numSpts && i < totalLights) {
        code += "varying vec4 vLight" + i + "ShadowCoord;\n"
      }
    }
  }
  if(mapWithoutTransform) {
    code += "varying vec2 vUv0;\n"
  }
  if(options.diffuseMap && options.diffuseMapTransform) {
    code += "varying vec2 vUvDiffuseMap;\n"
  }
  if(lighting) {
    if(options.specularMap && options.specularMapTransform) {
      code += "varying vec2 vUvSpecularMap;\n"
    }
    if(options.glossMap && options.glossMapTransform) {
      code += "varying vec2 vUvGlossMap;\n"
    }
    if(options.normalMap && options.normalMapTransform || options.heightMap && options.heightMapTransform) {
      code += "varying vec2 vUvBumpMap;\n"
    }
  }
  if(options.emissiveMap && options.emissiveMapTransform) {
    code += "varying vec2 vUvEmissiveMap;\n"
  }
  if(options.opacityMap && options.opacityMapTransform) {
    code += "varying vec2 vUvOpacityMap;\n"
  }
  if(options.lightMap) {
    code += "varying vec2 vUvLightMap;\n"
  }
  if(options.vertexColors) {
    code += "varying vec4 vVertexColor;\n"
  }
  code += "\n";
  if(options.diffuseMap) {
    code += "uniform sampler2D texture_diffuseMap;\n"
  }else {
    code += "uniform vec3 material_ambient;\n";
    code += "uniform vec3 material_diffuse;\n"
  }
  if(lighting) {
    if(options.specularMap) {
      code += "uniform sampler2D texture_specularMap;\n"
    }else {
      code += "uniform vec3 material_specular;\n"
    }
    if(options.glossMap) {
      code += "uniform sampler2D texture_glossMap;\n"
    }else {
      code += "uniform float material_shininess;\n"
    }
  }
  if(options.emissiveMap) {
    code += "uniform sampler2D texture_emissiveMap;\n"
  }else {
    code += "uniform vec3 material_emissive;\n"
  }
  if(options.lightMap) {
    code += "uniform sampler2D texture_lightMap;\n"
  }
  if(lighting) {
    if(options.normalMap) {
      code += "uniform sampler2D texture_normalMap;\n";
      code += "uniform float material_bumpMapFactor;\n"
    }
    if(options.heightMap) {
      code += "uniform sampler2D texture_heightMap;\n"
    }
    if(options.cubeMap || options.sphereMap) {
      code += "uniform float material_reflectionFactor;\n";
      if(options.sphereMap) {
        code += "uniform mat4 matrix_view;\n";
        code += "uniform sampler2D texture_sphereMap;\n"
      }else {
        code += "uniform samplerCube texture_cubeMap;\n"
      }
    }
  }
  if(options.opacityMap) {
    code += "uniform sampler2D texture_opacityMap;\n"
  }else {
    code += "uniform float material_opacity;\n"
  }
  code += "uniform vec3 light_globalAmbient;\n";
  for(i = 0;i < totalLights;i++) {
    code += "uniform vec3 light" + i + "_color;\n";
    if(i >= totalDirs) {
      code += "uniform float light" + i + "_radius;\n";
      if(i >= totalDirs + totalPnts) {
        code += "uniform float light" + i + "_innerConeAngle;\n";
        code += "uniform float light" + i + "_outerConeAngle;\n"
      }
    }
    if(i >= options.numDirs && i < totalDirs || i >= totalDirs + options.numPnts && i < totalDirs + totalPnts || i >= totalDirs + totalPnts + options.numSpts && i < totalLights) {
      code += "uniform vec3 light" + i + "_shadowParams;\n";
      code += "uniform sampler2D light" + i + "_shadowMap;\n"
    }
  }
  if(numShadowLights > 0) {
    code += "uniform bool shadow_enable;\n"
  }
  switch(options.fog) {
    case "linear":
      code += getSnippet(device, "fs_fog_linear_decl");
      break;
    case "exp":
      code += getSnippet(device, "fs_fog_exp_decl");
      break;
    case "exp2":
      code += getSnippet(device, "fs_fog_exp2_decl");
      break
  }
  code += getSnippet(device, "fs_alpha_test_decl");
  if(options.normalMap) {
    code += getSnippet(device, "fs_normal_map_funcs")
  }else {
    if(options.heightMap) {
      code += getSnippet(device, "fs_height_map_funcs")
    }
  }
  code += "\n";
  if(numShadowLights > 0) {
    code += "float unpackFloat(vec4 rgbaDepth)\n";
    code += "{\n";
    code += "    const vec4 bitShift = vec4(1.0 / (256.0 * 256.0 * 256.0), 1.0 / (256.0 * 256.0), 1.0 / 256.0, 1.0);\n";
    code += "    float depth = dot(rgbaDepth, bitShift);\n";
    code += "    return depth;\n";
    code += "}\n\n";
    code += "float calculateShadowFactor(const in vec4 sc, const in vec3 sp, const in sampler2D shadowMap)\n";
    code += "{\n";
    code += "    float depth;\n";
    code += "    float depthBias = sp.z;\n";
    code += "    vec3 shadowCoord = sc.xyz / sc.w;\n";
    code += "    shadowCoord.z += depthBias;\n";
    code += "    bvec4 containedVec = bvec4(shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0);\n";
    code += "    bool contained = all(bvec2(all(containedVec), shadowCoord.z <= 1.0));\n";
    code += "    if (contained)\n";
    code += "    {\n";
    if(false) {
      code += "        depth = upackRgbaDepthToFloat(texture2D(shadowMap, shadowCoord.xy));\n";
      code += "        return (depth < shadowCoord.z) ? 0.3 : 1.0;\n"
    }else {
      code += "        float shadowAccum = 0.0;\n";
      code += "        float xoffset = 1.0 / sp[0];\n";
      code += "        float yoffset = 1.0 / sp[1];\n";
      code += "        float dx0 = -xoffset;\n";
      code += "        float dy0 = -yoffset;\n";
      code += "        float dx1 = xoffset;\n";
      code += "        float dy1 = yoffset;\n";
      code += "        mat3 shadowKernel;\n", code += "        mat3 depthKernel;\n", code += "        depthKernel[0][0] = unpackFloat(texture2D(shadowMap, shadowCoord.xy + vec2(dx0, dy0)));\n";
      code += "        depthKernel[0][1] = unpackFloat(texture2D(shadowMap, shadowCoord.xy + vec2(dx0, 0.0)));\n";
      code += "        depthKernel[0][2] = unpackFloat(texture2D(shadowMap, shadowCoord.xy + vec2(dx0, dy1)));\n";
      code += "        depthKernel[1][0] = unpackFloat(texture2D(shadowMap, shadowCoord.xy + vec2(0.0, dy0)));\n";
      code += "        depthKernel[1][1] = unpackFloat(texture2D(shadowMap, shadowCoord.xy));\n";
      code += "        depthKernel[1][2] = unpackFloat(texture2D(shadowMap, shadowCoord.xy + vec2(0.0, dy1)));\n";
      code += "        depthKernel[2][0] = unpackFloat(texture2D(shadowMap, shadowCoord.xy + vec2(dx1, dy0)));\n";
      code += "        depthKernel[2][1] = unpackFloat(texture2D(shadowMap, shadowCoord.xy + vec2(dx1, 0.0)));\n";
      code += "        depthKernel[2][2] = unpackFloat(texture2D(shadowMap, shadowCoord.xy + vec2(dx1, dy1)));\n";
      code += "        vec3 shadowZ = vec3(shadowCoord.z);\n";
      code += "        shadowKernel[0] = vec3(lessThan(depthKernel[0], shadowZ));\n";
      code += "        shadowKernel[0] *= vec3(0.25);\n";
      code += "        shadowKernel[1] = vec3(lessThan(depthKernel[1], shadowZ));\n";
      code += "        shadowKernel[1] *= vec3(0.25);\n";
      code += "        shadowKernel[2] = vec3(lessThan(depthKernel[2], shadowZ));\n";
      code += "        shadowKernel[2] *= vec3(0.25);\n";
      code += "        vec2 fractionalCoord = 1.0 - fract( shadowCoord.xy * sp.xy );\n";
      code += "        shadowKernel[0] = mix(shadowKernel[1], shadowKernel[0], fractionalCoord.x);\n";
      code += "        shadowKernel[1] = mix(shadowKernel[2], shadowKernel[1], fractionalCoord.x);\n";
      code += "        vec4 shadowValues;\n";
      code += "        shadowValues.x = mix(shadowKernel[0][1], shadowKernel[0][0], fractionalCoord.y);\n";
      code += "        shadowValues.y = mix(shadowKernel[0][2], shadowKernel[0][1], fractionalCoord.y);\n";
      code += "        shadowValues.z = mix(shadowKernel[1][1], shadowKernel[1][0], fractionalCoord.y);\n";
      code += "        shadowValues.w = mix(shadowKernel[1][2], shadowKernel[1][1], fractionalCoord.y);\n";
      code += "        shadowAccum = 1.0 - dot( shadowValues, vec4( 1.0 ) );\n";
      code += "        return shadowAccum;\n"
    }
    code += "    }\n";
    code += "    else\n";
    code += "    {\n";
    code += "        return 1.0;\n";
    code += "    }\n";
    code += "}\n\n"
  }
  code += getSnippet(device, "common_main_begin");
  if(options.diffuseMap) {
    if(options.diffuseMapTransform) {
      code += "    vec2 uvDiffuseMap = vUvDiffuseMap;\n"
    }else {
      code += "    vec2 uvDiffuseMap = vUv0;\n"
    }
  }
  if(lighting) {
    if(options.specularMap) {
      if(options.specularMapTransform) {
        code += "    vec2 uvSpecularMap = vUvSpecularMap;\n"
      }else {
        code += "    vec2 uvSpecularMap = vUv0;\n"
      }
    }
    if(options.glossMap) {
      if(options.glossMapTransform) {
        code += "    vec2 uvGlossMap = vUvGlossMap;\n"
      }else {
        code += "    vec2 uvGlossMap = vUv0;\n"
      }
    }
    if(options.normalMap || options.heightMap) {
      if(options.normalMapTransform || options.heightMapTransform) {
        code += "    vec2 uvBumpMap = vUvBumpMap;\n"
      }else {
        code += "    vec2 uvBumpMap = vUv0;\n"
      }
    }
  }
  if(options.opacityMap) {
    if(options.opacityMapTransform) {
      code += "    vec2 uvOpacityMap = vUvOpacityMap;\n"
    }else {
      code += "    vec2 uvOpacityMap = vUv0;\n"
    }
  }
  if(options.emissiveMap) {
    if(options.emissiveMapTransform) {
      code += "    vec2 uvEmissiveMap = vUvEmissiveMap;\n"
    }else {
      code += "    vec2 uvEmissiveMap = vUv0;\n"
    }
  }
  if(options.lightMap) {
    code += "    vec2 uvLightMap = vUvLightMap;\n"
  }
  if(lighting) {
    code += "    vec3 viewDirW = normalize(vViewDirW);\n";
    if(!(options.normalMap && useTangents)) {
      code += "    vec3 normalW = normalize(vNormalW);\n"
    }
    if(options.normalMap && options.heightMap) {
      code += "    const float parallaxScale = 0.025;\n";
      code += "    const float parallaxBias = 0.01;\n";
      code += "    float height = texture2D(texture_heightMap, uvBumpMap).a * parallaxScale - parallaxBias;\n";
      code += "    uvBumpMap = uvBumpMap - min(height * viewDirW.xy, vec2(parallaxBias));\n";
      if(options.diffuseMap) {
        code += "    uvDiffuseMap = uvDiffuseMap - min(height * viewDirW.xy, vec2(parallaxBias));\n"
      }
      if(options.specularMap) {
        code += "    uvSpecularMap = uvSpecularMap - min(height * viewDirW.xy, vec2(parallaxBias));\n"
      }
    }
    code += "\n"
  }
  if(options.diffuseMap) {
    code += "    vec3 diffuseColor = texture2D(texture_diffuseMap, uvDiffuseMap).rgb;\n";
    code += "    vec3 ambientColor = diffuseColor;\n"
  }else {
    code += "    vec3 ambientColor = material_ambient;\n";
    code += "    vec3 diffuseColor = material_diffuse;\n"
  }
  if(lighting) {
    if(options.specularMap) {
      code += "    vec3 specularColor = texture2D(texture_specularMap, uvSpecularMap).rgb;\n"
    }else {
      code += "    vec3 specularColor = material_specular;\n"
    }
    if(options.glossMap) {
      code += "    float shininess = texture2D(texture_glossMap, uvGlossMap).r * 100.0 + 0.0001;\n"
    }else {
      code += "    float shininess = material_shininess + 0.0001;\n"
    }
  }
  if(options.emissiveMap) {
    code += "    vec3 emissiveColor = texture2D(texture_emissiveMap, uvEmissiveMap).rgb;\n"
  }else {
    code += "    vec3 emissiveColor = material_emissive;\n"
  }
  if(options.opacityMap) {
    code += "    float opacity = texture2D(texture_opacityMap, uvOpacityMap).r;\n"
  }else {
    code += "    float opacity = material_opacity;\n"
  }
  code += "\n";
  if(lighting || options.lightMap) {
    code += "    vec3 diffuseContrib = vec3(0.0);\n"
  }
  if(lighting) {
    code += "    vec3 specularContrib = vec3(0.0);\n";
    if(options.normalMap) {
      if(useTangents) {
        code += "    vec3 N = normalize(texture2D(texture_normalMap, uvBumpMap).xyz * 2.0 - 1.0);\n";
        code += "    N = normalize(mix(vec3(0.0, 0.0, 1.0), N, material_bumpMapFactor));\n"
      }else {
        code += "    vec3 N = perturb_normal(normalW, viewDirW, uvBumpMap);\n"
      }
    }else {
      code += "    vec3 N = normalW;\n"
    }
    code += "    vec3 L, R;\n";
    code += "    float diffuseLight, specularLight;\n";
    if(totalPnts + totalSpts > 0) {
      code += "    float d, attenuation;\n"
    }
    if(totalSpts > 0) {
      code += "    float cosAngle, spotEffect;\n"
    }
    if(numShadowLights > 0) {
      code += "    float shadowFactor;\n"
    }
    code += "\n";
    for(i = 0;i < totalLights;i++) {
      var positionalLight = i >= totalDirs;
      var spotLight = i >= totalDirs + totalPnts;
      var shadowLight = i >= options.numDirs && i < totalDirs || i >= totalDirs + options.numPnts && i < totalDirs + totalPnts || i >= totalDirs + totalPnts + options.numSpts && i < totalLights;
      code += "    L = normalize(vLight" + i + "DirW);\n";
      code += "    diffuseLight = max(dot(N, L), 0.0);\n";
      code += "    R = normalize(-reflect(L, N));\n";
      code += "    specularLight = pow(max(dot(R, viewDirW), 0.0), shininess);\n";
      if(positionalLight) {
        code += "    d = length(vLight" + i + "DirW);\n";
        code += "    attenuation = max(((light" + i + "_radius - d) / light" + i + "_radius), 0.0);\n"
      }
      if(spotLight) {
        code += "    cosAngle = dot(-L, vLight" + i + "SpotDirW);\n";
        code += "    spotEffect = smoothstep(light" + i + "_outerConeAngle, light" + i + "_innerConeAngle, cosAngle);\n"
      }
      if(shadowLight) {
        code += "    shadowFactor = shadow_enable ? calculateShadowFactor(vLight" + i + "ShadowCoord, light" + i + "_shadowParams, light" + i + "_shadowMap) : 1.0;\n"
      }
      code += "    diffuseContrib += light" + i + "_color * diffuseLight" + (positionalLight ? " * attenuation" : "") + (spotLight ? " * spotEffect" : "") + (shadowLight ? " * shadowFactor" : "") + ";\n";
      code += "    if (diffuseLight <= 0.0) specularLight = 0.0;\n";
      code += "    specularContrib += light" + i + "_color * specularLight" + (positionalLight ? " * attenuation" : "") + (spotLight ? " * spotEffect" : "") + (shadowLight ? " * shadowFactor" : "") + ";\n\n"
    }
  }
  if(options.lightMap) {
    code += "    diffuseContrib += texture2D(texture_lightMap, uvLightMap).rgb;\n"
  }
  if(lighting) {
    if(options.cubeMap || options.sphereMap) {
      code += "    vec3 reflectW = -reflect(viewDirW, N);\n";
      if(options.cubeMap) {
        code += "    vec3 reflectionColor = textureCube(texture_cubeMap, reflectW).rgb;\n"
      }else {
        if(options.sphereMap) {
          code += "    vec3 reflectE = (matrix_view * vec4(reflectW, 0.0)).xyz;\n";
          code += "    float m = 2.0 * sqrt( dot(reflectE.xy, reflectE.xy) + (reflectE.z+1.0)*(reflectE.z+1.0) );\n";
          code += "    vec2 sphereMapUv = reflectE.xy / m + 0.5;\n";
          code += "    vec3 reflectionColor = texture2D(texture_sphereMap, sphereMapUv).rgb;\n"
        }
      }
      code += "    diffuseColor = mix(diffuseColor, reflectionColor, material_reflectionFactor);\n\n"
    }
  }
  code += "    vec3 ambient  = ambientColor * light_globalAmbient;\n";
  if(lighting || options.lightMap) {
    code += "    vec3 diffuse  = diffuseColor * diffuseContrib;\n"
  }
  if(lighting) {
    code += "    vec3 specular = specularColor * specularContrib;\n"
  }
  code += "    vec3 emissive = emissiveColor;\n\n";
  code += "    gl_FragColor.rgb  = ambient;\n";
  if(lighting || options.lightMap) {
    code += "    gl_FragColor.rgb += diffuse;\n"
  }
  if(lighting) {
    code += "    gl_FragColor.rgb += specular;\n"
  }
  code += "    gl_FragColor.rgb += emissive;\n";
  code += "    gl_FragColor.a    = opacity;\n\n";
  code += getSnippet(device, "fs_alpha_test");
  code += getSnippet(device, "fs_clamp");
  switch(options.fog) {
    case "linear":
      code += getSnippet(device, "fs_fog_linear");
      break;
    case "exp":
      code += getSnippet(device, "fs_fog_exp");
      break;
    case "exp2":
      code += getSnippet(device, "fs_fog_exp2");
      break
  }
  code += getSnippet(device, "common_main_end");
  var fshader = code;
  return{attributes:attributes, vshader:vshader, fshader:fshader}
}};
pc.gfx.programlib.pick = {generateKey:function(device, options) {
  var key = "pick";
  if(options.skin) {
    key += "_skin"
  }
  return key
}, createShaderDefinition:function(device, options) {
  var attributes = {vertex_position:pc.gfx.SEMANTIC_POSITION};
  if(options.skin) {
    attributes.vertex_boneWeights = pc.gfx.SEMANTIC_BLENDWEIGHT;
    attributes.vertex_boneIndices = pc.gfx.SEMANTIC_BLENDINDICES
  }
  var getSnippet = pc.gfx.programlib.getSnippet;
  var code = "";
  code += getSnippet(device, "vs_transform_decl");
  if(options.skin) {
    code += getSnippet(device, "vs_skin_decl")
  }
  code += getSnippet(device, "common_main_begin");
  if(options.skin) {
    code += "    mat4 modelMatrix = vertex_boneWeights.x * getBoneMatrix(vertex_boneIndices.x) +\n";
    code += "                       vertex_boneWeights.y * getBoneMatrix(vertex_boneIndices.y) +\n";
    code += "                       vertex_boneWeights.z * getBoneMatrix(vertex_boneIndices.z) +\n";
    code += "                       vertex_boneWeights.w * getBoneMatrix(vertex_boneIndices.w);\n"
  }else {
    code += "    mat4 modelMatrix = matrix_model;\n"
  }
  code += "\n";
  code += "    vec4 positionW = modelMatrix * vec4(vertex_position, 1.0);\n";
  code += "    gl_Position = matrix_viewProjection * positionW;\n\n";
  code += getSnippet(device, "common_main_end");
  var vshader = code;
  code = getSnippet(device, "fs_precision");
  code += getSnippet(device, "fs_flat_color_decl");
  code += getSnippet(device, "common_main_begin");
  code += getSnippet(device, "fs_flat_color");
  code += getSnippet(device, "common_main_end");
  var fshader = code;
  return{attributes:attributes, vshader:vshader, fshader:fshader}
}};
pc.gfx.programlib.skybox = {generateKey:function(device, options) {
  var key = "skybox";
  return key
}, createShaderDefinition:function(device, options) {
  var getSnippet = pc.gfx.programlib.getSnippet;
  return{attributes:{aPosition:pc.gfx.SEMANTIC_POSITION}, vshader:["attribute vec3 aPosition;", "", "uniform mat4 matrix_view;", "uniform mat4 matrix_projection;", "", "varying vec3 vViewDir;", "", "void main(void)", "{", "    mat4 view = matrix_view;", "    view[3][0] = view[3][1] = view[3][2] = 0.0;", "    gl_Position = matrix_projection * view * vec4(aPosition, 1.0);", "    gl_Position.z = gl_Position.w - 0.00001;", "    vViewDir = aPosition;", "}"].join("\n"), fshader:getSnippet(device, "fs_precision") + 
  ["varying vec3 vViewDir;", "", "uniform samplerCube texture_cubeMap;", "", "void main(void)", "{", "    gl_FragColor = textureCube(texture_cubeMap, vec3(-vViewDir.x, vViewDir.yz));", "}"].join("\n")}
}};
pc.posteffect = {};
pc.extend(pc.posteffect, function() {
  var PostEffect = function(graphicsDevice) {
    this.device = graphicsDevice;
    this.shader = null;
    this.depthMap = null;
    this.vertexBuffer = pc.posteffect.createFullscreenQuad(graphicsDevice);
    this.needsDepthBuffer = false
  };
  PostEffect.prototype = {render:function(inputTarget, outputTarget, rect) {
  }};
  function createFullscreenQuad(device) {
    var vertexFormat = new pc.gfx.VertexFormat(device, [{semantic:pc.gfx.SEMANTIC_POSITION, components:2, type:pc.gfx.ELEMENTTYPE_FLOAT32}]);
    var vertexBuffer = new pc.gfx.VertexBuffer(device, vertexFormat, 4);
    var iterator = new pc.gfx.VertexIterator(vertexBuffer);
    iterator.element[pc.gfx.SEMANTIC_POSITION].set(-1, -1);
    iterator.next();
    iterator.element[pc.gfx.SEMANTIC_POSITION].set(1, -1);
    iterator.next();
    iterator.element[pc.gfx.SEMANTIC_POSITION].set(-1, 1);
    iterator.next();
    iterator.element[pc.gfx.SEMANTIC_POSITION].set(1, 1);
    iterator.end();
    return vertexBuffer
  }
  function drawFullscreenQuad(device, target, vertexBuffer, shader, rect) {
    device.setRenderTarget(target);
    device.updateBegin();
    var w = target !== null ? target.width : device.width;
    var h = target !== null ? target.height : device.height;
    var x = 0;
    var y = 0;
    if(rect) {
      x = rect.x * w;
      y = rect.y * h;
      w *= rect.z;
      h *= rect.w
    }
    device.setViewport(x, y, w, h);
    device.setScissor(x, y, w, h);
    var oldDepthTest = device.getDepthTest();
    var oldDepthWrite = device.getDepthWrite();
    device.setDepthTest(false);
    device.setDepthWrite(false);
    device.setVertexBuffer(vertexBuffer, 0);
    device.setShader(shader);
    device.draw({type:pc.gfx.PRIMITIVE_TRISTRIP, base:0, count:4, indexed:false});
    device.setDepthTest(oldDepthTest);
    device.setDepthWrite(oldDepthWrite);
    device.updateEnd()
  }
  return{PostEffect:PostEffect, createFullscreenQuad:createFullscreenQuad, drawFullscreenQuad:drawFullscreenQuad}
}());
pc.extend(pc.posteffect, function() {
  function PostEffectQueue(context, camera) {
    this.context = context;
    this.camera = camera;
    this.effects = [];
    this.enabled = false;
    this.depthTarget = null;
    this.renderTargetScale = 1;
    this.resizeTimeout = null;
    camera.on("set_rect", this.onCameraRectChanged, this);
    this.previous
  }
  PostEffectQueue.prototype = {_createOffscreenTarget:function(useDepth) {
    var rect = this.camera.rect;
    var width = Math.floor(rect.z * this.context.graphicsDevice.width * this.renderTargetScale);
    var height = Math.floor(rect.w * this.context.graphicsDevice.height * this.renderTargetScale);
    var colorBuffer = new pc.gfx.Texture(this.context.graphicsDevice, {format:pc.gfx.PIXELFORMAT_R8_G8_B8_A8, width:width, height:height});
    colorBuffer.minFilter = pc.gfx.FILTER_NEAREST;
    colorBuffer.magFilter = pc.gfx.FILTER_NEAREST;
    colorBuffer.addressU = pc.gfx.ADDRESS_CLAMP_TO_EDGE;
    colorBuffer.addressV = pc.gfx.ADDRESS_CLAMP_TO_EDGE;
    return new pc.gfx.RenderTarget(this.context.graphicsDevice, colorBuffer, {depth:useDepth})
  }, _setDepthTarget:function(depthTarget) {
    if(this.depthTarget !== depthTarget) {
      if(this.depthTarget) {
        this.depthTarget.destroy()
      }
      this.depthTarget = depthTarget
    }
    this.camera.camera._depthTarget = depthTarget
  }, setRenderTargetScale:function(scale) {
    this.renderTargetScale = scale;
    this.resizeRenderTargets()
  }, addEffect:function(effect) {
    var isFirstEffect = this.effects.length === 0;
    var effects = this.effects;
    var newEntry = {effect:effect, inputTarget:this._createOffscreenTarget(isFirstEffect), outputTarget:null};
    if(effect.needsDepthBuffer) {
      if(!this.depthTarget) {
        this._setDepthTarget(this._createOffscreenTarget(true))
      }
      effect.depthMap = this.depthTarget.colorBuffer
    }
    if(isFirstEffect) {
      this.camera.renderTarget = newEntry.inputTarget
    }
    effects.push(newEntry);
    var len = effects.length;
    if(len > 1) {
      effects[len - 2].outputTarget = newEntry.inputTarget
    }
    this.enable()
  }, removeEffect:function(effect) {
    var index = -1;
    for(var i = 0, len = this.effects.length;i < len;i++) {
      if(this.effects[i].effect === effect) {
        index = i;
        break
      }
    }
    if(index >= 0) {
      if(index > 0) {
        this.effects[index - 1].outputTarget = index + 1 < this.effects.length ? this.effects[index + 1].inputTarget : null
      }else {
        if(this.effects.length > 1) {
          if(!this.effects[1].inputTarget._depth) {
            this.effects[1].inputTarget.destroy();
            this.effects[1].inputTarget = this._createOffscreenTarget(true)
          }
          this.camera.renderTarget = this.effects[1].inputTarget
        }
      }
      this.effects[index].inputTarget.destroy();
      this.effects.splice(index, 1)
    }
    if(this.depthTarget) {
      var isDepthTargetNeeded = false;
      for(var i = 0, len = this.effects.length;i < len;i++) {
        if(this.effects[i].effect.needsDepthBuffer) {
          isDepthTargetNeeded = true;
          break
        }
      }
      if(!isDepthTargetNeeded) {
        this._setDepthTarget(null)
      }
    }
    if(this.effects.length === 0) {
      this.disable()
    }
  }, destroy:function() {
    if(this.depthTarget) {
      this.depthTarget.destroy();
      this.depthTarget = null
    }
    for(var i = 0, len = this.effects.length;i < len;i++) {
      this.effects[i].inputTarget.destroy()
    }
    this.effects.length = 0;
    this.disable()
  }, enable:function() {
    if(!this.enabled && this.effects.length) {
      this.enabled = true;
      var effects = this.effects;
      var camera = this.camera;
      this.context.graphicsDevice.on("resizecanvas", this._onCanvasResized, this);
      camera.camera.setRect(0, 0, 1, 1);
      this.command = new pc.scene.Command(pc.scene.LAYER_FX, pc.scene.BLEND_NONE, function() {
        if(this.enabled && camera.data.isRendering) {
          var rect = null;
          var len = effects.length;
          if(len) {
            camera.renderTarget = effects[0].inputTarget;
            this._setDepthTarget(this.depthTarget);
            for(var i = 0;i < len;i++) {
              var fx = effects[i];
              if(i === len - 1) {
                rect = camera.rect
              }
              fx.effect.render(fx.inputTarget, fx.outputTarget, rect)
            }
          }
        }
      }.bind(this));
      this.context.scene.drawCalls.push(this.command)
    }
  }, disable:function() {
    if(this.enabled) {
      this.enabled = false;
      this.context.graphicsDevice.off("resizecanvas", this._onCanvasResized, this);
      this.camera.renderTarget = null;
      this.camera.camera._depthTarget = null;
      var rect = this.camera.rect;
      this.camera.camera.setRect(rect.x, rect.y, rect.z, rect.w);
      var i = this.context.scene.drawCalls.indexOf(this.command);
      if(i >= 0) {
        this.context.scene.drawCalls.splice(i, 1)
      }
    }
  }, _onCanvasResized:function(width, height) {
    if(this.resizeTimeout) {
      clearTimeout(this.resizeTimeout)
    }
    this.resizeTimeout = setTimeout(this.resizeRenderTargets.bind(this), 500)
  }, resizeRenderTargets:function() {
    var rect = this.camera.rect;
    var desiredWidth = Math.floor(rect.z * this.context.graphicsDevice.width * this.renderTargetScale);
    var desiredHeight = Math.floor(rect.w * this.context.graphicsDevice.height * this.renderTargetScale);
    var effects = this.effects;
    if(this.depthTarget && this.depthTarget.width !== desiredWidth && this.depthTarget.height !== desiredHeight) {
      this._setDepthTarget(this._createOffscreenTarget(true))
    }
    for(var i = 0, len = effects.length;i < len;i++) {
      var fx = effects[i];
      if(fx.inputTarget.width !== desiredWidth || fx.inputTarget.height !== desiredHeight) {
        fx.inputTarget.destroy();
        fx.inputTarget = this._createOffscreenTarget(fx.effect.needsDepthBuffer || i === 0);
        if(fx.effect.needsDepthBuffer) {
          fx.depthMap = this.depthTarget
        }
        if(i > 0) {
          effects[i - 1].outputTarget = fx.inputTarget
        }else {
          this.camera.renderTarget = fx.inputTarget
        }
      }
    }
  }, onCameraRectChanged:function(name, oldValue, newValue) {
    if(this.enabled) {
      this.camera.camera.setRect(0, 0, 1, 1);
      this.resizeRenderTargets()
    }
  }};
  return{PostEffectQueue:PostEffectQueue}
}());
pc.scene = {BLEND_SUBTRACTIVE:0, BLEND_ADDITIVE:1, BLEND_NORMAL:2, BLEND_NONE:3, RENDERSTYLE_SOLID:0, RENDERSTYLE_WIREFRAME:1, RENDERSTYLE_POINTS:2, LAYER_HUD:0, LAYER_GIZMO:1, LAYER_FX:2, LAYER_WORLD:3, FOG_NONE:"none", FOG_LINEAR:"linear", FOG_EXP:"exp", FOG_EXP2:"exp2"};
pc.extend(pc.scene, function() {
  var Scene = function Scene() {
    this.drawCalls = [];
    this.shadowCasters = [];
    this.fog = pc.scene.FOG_NONE;
    this.fogColor = new pc.Color(0, 0, 0);
    this.fogStart = 1;
    this.fogEnd = 1E3;
    this.fogDensity = 0;
    this.ambientLight = new pc.Color(0, 0, 0);
    this.shadowDistance = 40;
    this._models = [];
    this._lights = [];
    this._globalLights = [];
    this._localLights = [[], []];
    this.updateShaders = true
  };
  Object.defineProperty(Scene.prototype, "fog", {get:function() {
    return this._fog
  }, set:function(type) {
    if(type !== this._fog) {
      this._fog = type;
      this.updateShaders = true
    }
  }});
  Scene.prototype._updateShaders = function(device) {
    var i;
    var materials = [];
    var drawCalls = this.drawCalls;
    for(i = 0;i < drawCalls.length;i++) {
      var drawCall = drawCalls[i];
      if(drawCall.material !== undefined) {
        if(materials.indexOf(drawCall.material) === -1) {
          materials.push(drawCall.material)
        }
      }
    }
    for(i = 0;i < materials.length;i++) {
      materials[i].updateShader(device, this)
    }
  };
  Scene.prototype.getModels = function() {
    return this._models
  };
  Scene.prototype.addModel = function(model) {
    var i;
    var index = this._models.indexOf(model);
    if(index === -1) {
      this._models.push(model);
      var materials = model.getMaterials();
      for(i = 0;i < materials.length;i++) {
        materials[i].scene = this
      }
      var meshInstance;
      var numMeshInstances = model.meshInstances.length;
      for(i = 0;i < numMeshInstances;i++) {
        meshInstance = model.meshInstances[i];
        if(this.drawCalls.indexOf(meshInstance) === -1) {
          this.drawCalls.push(meshInstance)
        }
        if(meshInstance.castShadow) {
          if(this.shadowCasters.indexOf(meshInstance) === -1) {
            this.shadowCasters.push(meshInstance)
          }
        }
      }
      var lights = model.getLights();
      for(i = 0, len = lights.length;i < len;i++) {
        this.addLight(lights[i])
      }
    }
  };
  Scene.prototype.removeModel = function(model) {
    var i;
    var index = this._models.indexOf(model);
    if(index !== -1) {
      this._models.splice(index, 1);
      var materials = model.getMaterials();
      for(i = 0;i < materials.length;i++) {
        materials[i].scene = null
      }
      var meshInstance;
      var numMeshInstances = model.meshInstances.length;
      for(i = 0;i < numMeshInstances;i++) {
        meshInstance = model.meshInstances[i];
        index = this.drawCalls.indexOf(meshInstance);
        if(index !== -1) {
          this.drawCalls.splice(index, 1)
        }
        if(meshInstance.castShadow) {
          index = this.shadowCasters.indexOf(meshInstance);
          if(index !== -1) {
            this.shadowCasters.splice(index, 1)
          }
        }
      }
      var lights = model.getLights();
      for(i = 0, len = lights.length;i < len;i++) {
        this.removeLight(lights[i])
      }
    }
  };
  Scene.prototype.containsModel = function(model) {
    return this._models.indexOf(model) >= 0
  };
  Scene.prototype.addLight = function(light) {
    var index = this._lights.indexOf(light);
    if(index !== -1) {
      console.warn("pc.scene.Scene#addLight: light is already in the scene")
    }else {
      this._lights.push(light);
      light._scene = this;
      this.updateShaders = true
    }
  };
  Scene.prototype.removeLight = function(light) {
    var index = this._lights.indexOf(light);
    if(index === -1) {
      console.warn("pc.scene.Scene#removeLight: light is not in the scene")
    }else {
      this._lights.splice(index, 1);
      light._scene = null;
      this.updateShaders = true
    }
  };
  Scene.prototype.update = function() {
    for(var i = 0, len = this._models.length;i < len;i++) {
      this._models[i].getGraph().syncHierarchy()
    }
  };
  return{Scene:Scene}
}());
pc.extend(pc.scene, function() {
  function sortDrawCalls(drawCallA, drawCallB) {
    if(drawCallA.distSqr && drawCallB.distSqr) {
      return drawCallB.distSqr - drawCallA.distSqr
    }else {
      return drawCallB.key - drawCallA.key
    }
  }
  var scale = (new pc.Mat4).setScale(0.5, 0.5, 0.5);
  var shift = (new pc.Mat4).setTranslate(0.5, 0.5, 0.5);
  var scaleShift = (new pc.Mat4).mul2(shift, scale);
  var camToLight = (new pc.Mat4).setFromAxisAngle(pc.Vec3.RIGHT, -90);
  var shadowCamWtm = new pc.Mat4;
  var shadowCamView = new pc.Mat4;
  var shadowCamViewProj = new pc.Mat4;
  var viewMat = new pc.Mat4;
  var viewProjMat = new pc.Mat4;
  var frustumPoints = [];
  for(i = 0;i < 8;i++) {
    frustumPoints.push(new pc.Vec3)
  }
  function _calculateSceneAabb(scene) {
    var meshInstances = scene.meshInstances;
    if(meshInstances.length > 0) {
      scene._sceneAabb.copy(meshInstances[0].aabb);
      for(var i = 1;i < meshInstances.length;i++) {
        scene._sceneAabb.add(meshInstances[i].aabb)
      }
    }
  }
  function _getFrustumCentroid(scene, camera, centroid) {
    centroid.set(0, 0, -(scene.shadowDistance + camera._nearClip) * 0.5);
    camera.getWorldTransform().transformPoint(centroid, centroid)
  }
  function _getFrustumPoints(scene, camera, points) {
    var cam = camera;
    var nearClip = cam.getNearClip();
    var farClip = scene.shadowDistance;
    var fov = cam.getFov() * Math.PI / 180;
    var aspect = cam.getAspectRatio();
    var projection = cam.getProjection();
    var x, y;
    if(projection === pc.scene.Projection.PERSPECTIVE) {
      y = Math.tan(fov / 2) * nearClip
    }else {
      y = this._orthoHeight
    }
    x = y * aspect;
    points[0].x = x;
    points[0].y = -y;
    points[0].z = -nearClip;
    points[1].x = x;
    points[1].y = y;
    points[1].z = -nearClip;
    points[2].x = -x;
    points[2].y = y;
    points[2].z = -nearClip;
    points[3].x = -x;
    points[3].y = -y;
    points[3].z = -nearClip;
    if(projection === pc.scene.Projection.PERSPECTIVE) {
      y = Math.tan(fov / 2) * farClip;
      x = y * aspect
    }
    points[4].x = x;
    points[4].y = -y;
    points[4].z = -farClip;
    points[5].x = x;
    points[5].y = y;
    points[5].z = -farClip;
    points[6].x = -x;
    points[6].y = y;
    points[6].z = -farClip;
    points[7].x = -x;
    points[7].y = -y;
    points[7].z = -farClip;
    return points
  }
  function createShadowMap(device, width, height) {
    var shadowMap = new pc.gfx.Texture(device, {format:pc.gfx.PIXELFORMAT_R8_G8_B8_A8, width:width, height:height});
    shadowMap.minFilter = pc.gfx.FILTER_NEAREST;
    shadowMap.magFilter = pc.gfx.FILTER_NEAREST;
    shadowMap.addressU = pc.gfx.ADDRESS_CLAMP_TO_EDGE;
    shadowMap.addressV = pc.gfx.ADDRESS_CLAMP_TO_EDGE;
    return new pc.gfx.RenderTarget(device, shadowMap, true)
  }
  function createShadowCamera(device) {
    var flags = pc.gfx.CLEARFLAG_DEPTH;
    if(!device.extDepthTexture) {
      flags |= pc.gfx.CLEARFLAG_COLOR
    }
    var shadowCam = new pc.scene.CameraNode;
    shadowCam.setClearOptions({color:[1, 1, 1, 1], depth:1, flags:flags});
    return shadowCam
  }
  function getShadowCamera(device, light) {
    var shadowCam = light._shadowCamera;
    var shadowBuffer;
    if(shadowCam === null) {
      shadowCam = createShadowCamera(device);
      shadowBuffer = createShadowMap(device, light._shadowResolution, light._shadowResolution);
      shadowCam.setRenderTarget(shadowBuffer);
      light._shadowCamera = shadowCam
    }else {
      shadowBuffer = shadowCam.getRenderTarget();
      if(shadowBuffer.width !== light._shadowResolution || shadowBuffer.height !== light._shadowResolution) {
        shadowBuffer = createShadowMap(device, light._shadowResolution, light._shadowResolution);
        shadowCam.setRenderTarget(shadowBuffer)
      }
    }
    return shadowCam
  }
  function ForwardRenderer(graphicsDevice) {
    this.device = graphicsDevice;
    var library = this.device.getProgramLibrary();
    this._depthProgStatic = library.getProgram("depthrgba", {skin:false, opacityMap:false});
    this._depthProgSkin = library.getProgram("depthrgba", {skin:true, opacityMap:false});
    this._depthProgStaticOp = library.getProgram("depthrgba", {skin:false, opacityMap:true});
    this._depthProgSkinOp = library.getProgram("depthrgba", {skin:true, opacityMap:true});
    this._depthShaderStatic = library.getProgram("depth", {skin:false});
    this._depthShaderSkin = library.getProgram("depth", {skin:true});
    var scope = this.device.scope;
    this.projId = scope.resolve("matrix_projection");
    this.viewId = scope.resolve("matrix_view");
    this.viewInvId = scope.resolve("matrix_viewInverse");
    this.viewProjId = scope.resolve("matrix_viewProjection");
    this.viewPosId = scope.resolve("view_position");
    this.nearClipId = scope.resolve("camera_near");
    this.farClipId = scope.resolve("camera_far");
    this.fogColorId = scope.resolve("fog_color");
    this.fogStartId = scope.resolve("fog_start");
    this.fogEndId = scope.resolve("fog_end");
    this.fogDensityId = scope.resolve("fog_density");
    this.modelMatrixId = scope.resolve("matrix_model");
    this.normalMatrixId = scope.resolve("matrix_normal");
    this.poseMatrixId = scope.resolve("matrix_pose[0]");
    this.boneTextureId = scope.resolve("texture_poseMap");
    this.boneTextureSizeId = scope.resolve("texture_poseMapSize");
    this.alphaTestId = scope.resolve("alpha_ref");
    this.shadowEnableId = scope.resolve("shadow_enable");
    this._shadowAabb = new pc.shape.Aabb;
    this._sceneAabb = new pc.shape.Aabb;
    this._shadowState = {blend:false};
    this.centroid = new pc.Vec3;
    this.fogColor = new Float32Array(3);
    this.ambientColor = new Float32Array(3)
  }
  pc.extend(ForwardRenderer.prototype, {setCamera:function(camera) {
    var projMat = camera.getProjectionMatrix();
    this.projId.setValue(projMat.data);
    var wtm = camera.getWorldTransform();
    this.viewInvId.setValue(wtm.data);
    viewMat.copy(wtm).invert();
    this.viewId.setValue(viewMat.data);
    viewProjMat.mul2(projMat, viewMat);
    this.viewProjId.setValue(viewProjMat.data);
    this.viewPosId.setValue(camera.getPosition().data);
    this.nearClipId.setValue(camera.getNearClip());
    this.farClipId.setValue(camera.getFarClip());
    camera._frustum.update(projMat, viewMat);
    var device = this.device;
    var target = camera.getRenderTarget();
    device.setRenderTarget(target);
    device.updateBegin();
    var rect = camera.getRect();
    var pixelWidth = target ? target.width : device.width;
    var pixelHeight = target ? target.height : device.height;
    var x = Math.floor(rect.x * pixelWidth);
    var y = Math.floor(rect.y * pixelHeight);
    var w = Math.floor(rect.width * pixelWidth);
    var h = Math.floor(rect.height * pixelHeight);
    device.setViewport(x, y, w, h);
    device.setScissor(x, y, w, h);
    device.clear(camera.getClearOptions())
  }, dispatchGlobalLights:function(scene) {
    var dirs = scene._globalLights;
    var numDirs = dirs.length;
    var scope = this.device.scope;
    this.ambientColor[0] = scene.ambientLight.r;
    this.ambientColor[1] = scene.ambientLight.g;
    this.ambientColor[2] = scene.ambientLight.b;
    scope.resolve("light_globalAmbient").setValue(this.ambientColor);
    for(var i = 0;i < numDirs;i++) {
      var directional = dirs[i];
      var wtm = directional.getWorldTransform();
      var light = "light" + i;
      scope.resolve(light + "_color").setValue(directional._finalColor.data);
      wtm.getY(directional._direction).scale(-1);
      scope.resolve(light + "_direction").setValue(directional._direction.data);
      if(directional.getCastShadows()) {
        var shadowMap = this.device.extDepthTexture ? directional._shadowCamera._renderTarget._depthTexture : directional._shadowCamera._renderTarget.colorBuffer;
        scope.resolve(light + "_shadowMap").setValue(shadowMap);
        scope.resolve(light + "_shadowMatrix").setValue(directional._shadowMatrix.data);
        scope.resolve(light + "_shadowParams").setValue([directional._shadowResolution, directional._shadowResolution, directional._shadowBias])
      }
    }
  }, dispatchLocalLights:function(scene) {
    var i, wtm;
    var point, spot;
    var light;
    var localLights = scene._localLights;
    var pnts = localLights[pc.scene.LIGHTTYPE_POINT - 1];
    var spts = localLights[pc.scene.LIGHTTYPE_SPOT - 1];
    var numDirs = scene._globalLights.length;
    var numPnts = pnts.length;
    var numSpts = spts.length;
    var scope = this.device.scope;
    for(i = 0;i < numPnts;i++) {
      point = pnts[i];
      wtm = point.getWorldTransform();
      light = "light" + (numDirs + i);
      scope.resolve(light + "_radius").setValue(point._attenuationEnd);
      scope.resolve(light + "_color").setValue(point._finalColor.data);
      wtm.getTranslation(point._position);
      scope.resolve(light + "_position").setValue(point._position.data)
    }
    for(i = 0;i < numSpts;i++) {
      spot = spts[i];
      wtm = spot.getWorldTransform();
      light = "light" + (numDirs + numPnts + i);
      scope.resolve(light + "_innerConeAngle").setValue(spot._innerConeAngleCos);
      scope.resolve(light + "_outerConeAngle").setValue(spot._outerConeAngleCos);
      scope.resolve(light + "_radius").setValue(spot._attenuationEnd);
      scope.resolve(light + "_color").setValue(spot._finalColor.data);
      wtm.getTranslation(spot._position);
      scope.resolve(light + "_position").setValue(spot._position.data);
      wtm.getY(spot._direction).scale(-1);
      scope.resolve(light + "_spotDirection").setValue(spot._direction.data);
      if(spot.getCastShadows()) {
        var shadowMap = this.device.extDepthTexture ? spot._shadowCamera._renderTarget._depthTexture : spot._shadowCamera._renderTarget.colorBuffer;
        scope.resolve(light + "_shadowMap").setValue(shadowMap);
        scope.resolve(light + "_shadowMatrix").setValue(spot._shadowMatrix.data);
        scope.resolve(light + "_shadowParams").setValue([spot._shadowResolution, spot._shadowResolution, spot._shadowBias])
      }
    }
  }, render:function(scene, camera) {
    var device = this.device;
    var scope = device.scope;
    if(scene.updateShaders) {
      scene._updateShaders(device);
      scene.updateShaders = false
    }
    var lights = scene._lights;
    var models = scene._models;
    var drawCalls = scene.drawCalls;
    var shadowCasters = scene.shadowCasters;
    var i, j, numInstances;
    var drawCall, meshInstance, prevMeshInstance = null, mesh, material, prevMaterial = null, style;
    for(i = 0, numDrawCalls = scene.drawCalls.length;i < numDrawCalls;i++) {
      drawCall = scene.drawCalls[i];
      if(drawCall.skinInstance) {
        drawCall.skinInstance.updateMatrixPalette()
      }
    }
    scene._globalLights.length = 0;
    scene._localLights[0].length = 0;
    scene._localLights[1].length = 0;
    for(i = 0;i < lights.length;i++) {
      var light = lights[i];
      if(light.getEnabled()) {
        if(light.getType() === pc.scene.LIGHTTYPE_DIRECTIONAL) {
          if(light.getCastShadows()) {
            scene._globalLights.push(light)
          }else {
            scene._globalLights.unshift(light)
          }
        }else {
          scene._localLights[light.getType() === pc.scene.LIGHTTYPE_POINT ? 0 : 1].push(light)
        }
      }
    }
    var camPos = camera.getPosition();
    for(i = 0, numDrawCalls = drawCalls.length;i < numDrawCalls;i++) {
      drawCall = drawCalls[i];
      if(!drawCall.command) {
        meshInstance = drawCall;
        if(meshInstance.material.blendType === pc.scene.BLEND_NORMAL) {
          meshInstance.syncAabb();
          var meshPos = meshInstance.aabb.center;
          var tempx = meshPos.x - camPos.x;
          var tempy = meshPos.y - camPos.y;
          var tempz = meshPos.z - camPos.z;
          meshInstance.distSqr = tempx * tempx + tempy * tempy + tempz * tempz
        }else {
          if(typeof meshInstance.distSqr !== "undefined") {
            delete meshInstance.distSqr
          }
        }
      }
    }
    drawCalls.sort(sortDrawCalls);
    if(camera._depthTarget) {
      var oldTarget = camera.getRenderTarget();
      camera.setRenderTarget(camera._depthTarget);
      this.setCamera(camera);
      var oldBlending = device.getBlending();
      device.setBlending(false);
      for(i = 0, numDrawCalls = drawCalls.length;i < numDrawCalls;i++) {
        drawCall = drawCalls[i];
        if(!drawCall.command) {
          meshInstance = drawCall;
          if(meshInstance.layer !== pc.scene.LAYER_SKYBOX) {
            mesh = meshInstance.mesh;
            this.modelMatrixId.setValue(meshInstance.node.worldTransform.data);
            if(meshInstance.skinInstance) {
              if(device.supportsBoneTextures) {
                this.boneTextureId.setValue(meshInstance.skinInstance.boneTexture);
                var w = meshInstance.skinInstance.boneTexture.width;
                var h = meshInstance.skinInstance.boneTexture.height;
                this.boneTextureSizeId.setValue([w, h])
              }else {
                this.poseMatrixId.setValue(meshInstance.skinInstance.matrixPalette)
              }
              device.setShader(this._depthShaderSkin)
            }else {
              device.setShader(this._depthShaderStatic)
            }
            style = meshInstance.renderStyle;
            device.setVertexBuffer(mesh.vertexBuffer, 0);
            device.setIndexBuffer(mesh.indexBuffer[style]);
            device.draw(mesh.primitive[style])
          }
        }
        camera.setRenderTarget(oldTarget)
      }
      device.setBlending(oldBlending)
    }
    for(i = 0;i < lights.length;i++) {
      var light = lights[i];
      var type = light.getType();
      if(type === pc.scene.LIGHTTYPE_POINT) {
        continue
      }
      if(light.getCastShadows() && light.getEnabled()) {
        var shadowCam = getShadowCamera(device, light);
        if(type === pc.scene.LIGHTTYPE_DIRECTIONAL) {
          _getFrustumCentroid(scene, camera, this.centroid);
          shadowCam.setPosition(this.centroid);
          var lightDir = new pc.Vec3;
          light.worldTransform.getY(lightDir);
          shadowCam.translate(lightDir);
          shadowCam.lookAt(this.centroid);
          shadowCamWtm.copy(shadowCam.getWorldTransform());
          _getFrustumPoints(scene, camera, frustumPoints);
          var worldToShadowCam = shadowCamWtm.invert();
          var camToWorld = camera.worldTransform;
          var c2sc = new pc.Mat4;
          c2sc.mul2(worldToShadowCam, camToWorld);
          for(j = 0;j < 8;j++) {
            c2sc.transformPoint(frustumPoints[j], frustumPoints[j])
          }
          var minx = 1E6;
          var maxx = -1E6;
          var miny = 1E6;
          var maxy = -1E6;
          var minz = 1E6;
          var maxz = -1E6;
          for(j = 0;j < 8;j++) {
            var p = frustumPoints[j];
            if(p.x < minx) {
              minx = p.x
            }
            if(p.x > maxx) {
              maxx = p.x
            }
            if(p.y < miny) {
              miny = p.y
            }
            if(p.y > maxy) {
              maxy = p.y
            }
            if(p.z < minz) {
              minz = p.z
            }
            if(p.z > maxz) {
              maxz = p.z
            }
          }
          shadowCam.translateLocal(-(maxx + minx) * 0.5, (maxy + miny) * 0.5, maxz + (maxz - minz) * 0.25);
          shadowCamWtm.copy(shadowCam.getWorldTransform());
          shadowCam.setProjection(pc.scene.Projection.ORTHOGRAPHIC);
          shadowCam.setNearClip(0);
          shadowCam.setFarClip((maxz - minz) * 1.5);
          shadowCam.setAspectRatio((maxx - minx) / (maxy - miny));
          shadowCam.setOrthoHeight((maxy - miny) * 0.5)
        }else {
          if(type === pc.scene.LIGHTTYPE_SPOT) {
            shadowCam.setProjection(pc.scene.Projection.PERSPECTIVE);
            shadowCam.setNearClip(light.getAttenuationEnd() / 1E3);
            shadowCam.setFarClip(light.getAttenuationEnd());
            shadowCam.setAspectRatio(1);
            shadowCam.setFov(light.getOuterConeAngle() * 2);
            var lightWtm = light.worldTransform;
            shadowCamWtm.mul2(lightWtm, camToLight)
          }
        }
        shadowCamView.copy(shadowCamWtm).invert();
        shadowCamViewProj.mul2(shadowCam.getProjectionMatrix(), shadowCamView);
        light._shadowMatrix.mul2(scaleShift, shadowCamViewProj);
        shadowCam.worldTransform.copy(shadowCamWtm);
        device.setBlending(false);
        device.setColorWrite(true, true, true, true);
        device.setCullMode(pc.gfx.CULLFACE_BACK);
        device.setDepthWrite(true);
        device.setDepthTest(true);
        if(device.extDepthTexture) {
          device.setColorWrite(false, false, false, false)
        }
        this.setCamera(shadowCam);
        for(j = 0, numInstances = shadowCasters.length;j < numInstances;j++) {
          meshInstance = shadowCasters[j];
          mesh = meshInstance.mesh;
          material = meshInstance.material;
          this.modelMatrixId.setValue(meshInstance.node.worldTransform.data);
          if(material.opacityMap) {
            scope.resolve("texture_opacityMap").setValue(material.opacityMap)
          }
          if(meshInstance.skinInstance) {
            if(device.supportsBoneTextures) {
              this.boneTextureId.setValue(meshInstance.skinInstance.boneTexture);
              var w = meshInstance.skinInstance.boneTexture.width;
              var h = meshInstance.skinInstance.boneTexture.height;
              this.boneTextureSizeId.setValue([w, h])
            }else {
              this.poseMatrixId.setValue(meshInstance.skinInstance.matrixPalette)
            }
            device.setShader(material.opacityMap ? this._depthProgSkinOp : this._depthProgSkin)
          }else {
            device.setShader(material.opacityMap ? this._depthProgStaticOp : this._depthProgStatic)
          }
          style = meshInstance.renderStyle;
          device.setVertexBuffer(mesh.vertexBuffer, 0);
          device.setIndexBuffer(mesh.indexBuffer[style]);
          device.draw(mesh.primitive[style])
        }
      }
    }
    this.setCamera(camera);
    this.dispatchGlobalLights(scene);
    this.dispatchLocalLights(scene);
    if(scene.fog !== pc.scene.FOG_NONE) {
      this.fogColor[0] = scene.fogColor.r;
      this.fogColor[1] = scene.fogColor.g;
      this.fogColor[2] = scene.fogColor.b;
      this.fogColorId.setValue(this.fogColor);
      if(scene.fog === pc.scene.FOG_LINEAR) {
        this.fogStartId.setValue(scene.fogStart);
        this.fogEndId.setValue(scene.fogEnd)
      }else {
        this.fogDensityId.setValue(scene.fogDensity)
      }
    }
    for(i = 0, numDrawCalls = drawCalls.length;i < numDrawCalls;i++) {
      drawCall = drawCalls[i];
      if(drawCall.command) {
        drawCall.command()
      }else {
        meshInstance = drawCall;
        mesh = meshInstance.mesh;
        material = meshInstance.material;
        var modelMatrix = meshInstance.node.worldTransform;
        var normalMatrix = meshInstance.normalMatrix;
        modelMatrix.invertTo3x3(normalMatrix);
        normalMatrix.transpose();
        this.modelMatrixId.setValue(modelMatrix.data);
        this.normalMatrixId.setValue(normalMatrix.data);
        if(meshInstance.skinInstance) {
          if(device.supportsBoneTextures) {
            this.boneTextureId.setValue(meshInstance.skinInstance.boneTexture);
            var w = meshInstance.skinInstance.boneTexture.width;
            var h = meshInstance.skinInstance.boneTexture.height;
            this.boneTextureSizeId.setValue([w, h])
          }else {
            this.poseMatrixId.setValue(meshInstance.skinInstance.matrixPalette)
          }
        }
        this.shadowEnableId.setValue(meshInstance.receiveShadow);
        if(material !== prevMaterial) {
          if(!material.shader) {
            material.updateShader(device, scene)
          }
          device.setShader(material.shader);
          var parameters = material.parameters;
          for(var paramName in parameters) {
            var parameter = parameters[paramName];
            if(!parameter.scopeId) {
              parameter.scopeId = device.scope.resolve(paramName)
            }
            parameter.scopeId.setValue(parameter.data)
          }
          this.alphaTestId.setValue(material.alphaTest);
          device.setBlending(material.blend);
          device.setBlendFunction(material.blendSrc, material.blendDst);
          device.setBlendEquation(material.blendEquation);
          device.setColorWrite(material.redWrite, material.greenWrite, material.blueWrite, material.alphaWrite);
          device.setCullMode(material.cull);
          device.setDepthWrite(material.depthWrite);
          device.setDepthTest(material.depthTest)
        }
        device.setVertexBuffer(mesh.vertexBuffer, 0);
        style = meshInstance.renderStyle;
        device.setIndexBuffer(mesh.indexBuffer[style]);
        device.draw(mesh.primitive[style]);
        prevMaterial = material;
        prevMeshInstance = meshInstance
      }
    }
  }});
  return{ForwardRenderer:ForwardRenderer}
}());
pc.extend(pc.scene, function() {
  var GraphNode = function GraphNode(name) {
    this.name = name || "Untitled";
    this._labels = {};
    this.localPosition = new pc.Vec3(0, 0, 0);
    this.localRotation = new pc.Quat(0, 0, 0, 1);
    this.localScale = new pc.Vec3(1, 1, 1);
    this.localEulerAngles = new pc.Vec3(0, 0, 0);
    this.position = new pc.Vec3(0, 0, 0);
    this.rotation = new pc.Quat(0, 0, 0, 1);
    this.eulerAngles = new pc.Vec3(0, 0, 0);
    this.localTransform = new pc.Mat4;
    this.dirtyLocal = false;
    this.worldTransform = new pc.Mat4;
    this.dirtyWorld = false;
    this._right = new pc.Vec3;
    this._up = new pc.Vec3;
    this._forward = new pc.Vec3;
    this._parent = null;
    this._children = [];
    this._enabled = true;
    this._enabledInHierarchy = true
  };
  Object.defineProperty(GraphNode.prototype, "right", {get:function() {
    return this.getWorldTransform().getX(this._right).normalize()
  }});
  Object.defineProperty(GraphNode.prototype, "up", {get:function() {
    return this.getWorldTransform().getY(this._up).normalize()
  }});
  Object.defineProperty(GraphNode.prototype, "forward", {get:function() {
    return this.getWorldTransform().getZ(this._forward).normalize().scale(-1)
  }});
  Object.defineProperty(GraphNode.prototype, "forwards", {get:function() {
    console.log("pc.GraphNode#forwards is DEPRECATED. Use pc.GraphNode#forward instead.");
    return this.forward
  }});
  Object.defineProperty(GraphNode.prototype, "enabled", {get:function() {
    return this._enabled && this._enabledInHierarchy
  }, set:function(enabled) {
    if(this._enabled !== enabled) {
      this._enabled = enabled;
      if(!this._parent || this._parent.enabled) {
        this._notifyHierarchyStateChanged(this, enabled)
      }
    }
  }});
  pc.extend(GraphNode.prototype, {_notifyHierarchyStateChanged:function(node, enabled) {
    node._onHierarchyStateChanged(enabled);
    var c = node._children;
    for(var i = 0, len = c.length;i < len;i++) {
      if(c[i]._enabled) {
        this._notifyHierarchyStateChanged(c[i], enabled)
      }
    }
  }, _onHierarchyStateChanged:function(enabled) {
    this._enabledInHierarchy = enabled
  }, _cloneInternal:function(clone) {
    clone.name = this.name;
    clone._labels = pc.extend(this._labels, {});
    clone.localPosition.copy(this.localPosition);
    clone.localRotation.copy(this.localRotation);
    clone.localScale.copy(this.localScale);
    clone.localEulerAngles.copy(this.localEulerAngles);
    clone.position.copy(this.position);
    clone.rotation.copy(this.rotation);
    clone.eulerAngles.copy(this.eulerAngles);
    clone.localTransform.copy(this.localTransform);
    clone.dirtyLocal = this.dirtyLocal;
    clone.worldTransform.copy(this.worldTransform);
    clone.dirtyWorld = this.dirtyWorld;
    clone._enabled = this._enabled;
    clone._enabledInHierarchy = this._enabledInHierarchy
  }, clone:function() {
    var clone = new pc.scene.GraphNode;
    this._cloneInternal(clone);
    return clone
  }, find:function(attr, value) {
    var i;
    var children = this.getChildren();
    var length = children.length;
    var results = [];
    var testValue;
    if(this[attr]) {
      if(this[attr] instanceof Function) {
        testValue = this[attr]()
      }else {
        testValue = this[attr]
      }
      if(testValue === value) {
        results.push(this)
      }
    }
    for(i = 0;i < length;++i) {
      results = results.concat(children[i].find(attr, value))
    }
    return results
  }, findOne:function(attr, value) {
    var i;
    var children = this.getChildren();
    var length = children.length;
    var result = null;
    var testValue;
    if(this[attr]) {
      if(this[attr] instanceof Function) {
        testValue = this[attr]()
      }else {
        testValue = this[attr]
      }
      if(testValue === value) {
        return this
      }
    }
    for(i = 0;i < length;++i) {
      result = children[i].findOne(attr, value);
      if(result !== null) {
        return result
      }
    }
    return null
  }, findByName:function(name) {
    if(this.name === name) {
      return this
    }
    for(var i = 0;i < this._children.length;i++) {
      var found = this._children[i].findByName(name);
      if(found !== null) {
        return found
      }
    }
    return null
  }, findByPath:function(path) {
    var parts = path.split("/");
    var currentParent = this;
    var result = null;
    for(var i = 0, imax = parts.length;i < imax && currentParent;i++) {
      var part = parts[i];
      result = null;
      var children = currentParent._children;
      for(var j = 0, jmax = children.length;j < jmax;j++) {
        if(children[j].name == part) {
          result = children[j];
          break
        }
      }
      currentParent = result
    }
    return result
  }, getPath:function() {
    var parent = this._parent;
    if(parent) {
      var path = this.name;
      var format = "{0}/{1}";
      while(parent && parent._parent) {
        path = pc.string.format(format, parent.name, path);
        parent = parent._parent
      }
      return path
    }else {
      return""
    }
  }, getRoot:function() {
    var parent = this.getParent();
    if(!parent) {
      return this
    }
    while(parent.getParent()) {
      parent = parent.getParent()
    }
    return parent
  }, getParent:function() {
    return this._parent
  }, getChildren:function() {
    return this._children
  }, getEulerAngles:function() {
    this.getWorldTransform().getEulerAngles(this.eulerAngles);
    return this.eulerAngles
  }, getLocalEulerAngles:function() {
    this.localRotation.getEulerAngles(this.localEulerAngles);
    return this.localEulerAngles
  }, getLocalPosition:function() {
    return this.localPosition
  }, getLocalRotation:function() {
    return this.localRotation
  }, getLocalScale:function() {
    return this.localScale
  }, getLocalTransform:function() {
    if(this.dirtyLocal) {
      this.localTransform.setTRS(this.localPosition, this.localRotation, this.localScale);
      this.dirtyLocal = false;
      this.dirtyWorld = true
    }
    return this.localTransform
  }, getName:function() {
    return this.name
  }, getPosition:function() {
    this.getWorldTransform().getTranslation(this.position);
    return this.position
  }, getRotation:function() {
    this.rotation.setFromMat4(this.getWorldTransform());
    return this.rotation
  }, getWorldTransform:function() {
    var syncList = [];
    return function() {
      var current = this;
      syncList.length = 0;
      while(current !== null) {
        syncList.push(current);
        current = current._parent
      }
      for(var i = syncList.length - 1;i >= 0;i--) {
        syncList[i].sync()
      }
      return this.worldTransform
    }
  }(), reparent:function(parent) {
    var current = this.getParent();
    if(current) {
      current.removeChild(this)
    }
    if(parent) {
      parent.addChild(this)
    }
  }, setLocalEulerAngles:function() {
    var ex, ey, ez;
    switch(arguments.length) {
      case 1:
        ex = arguments[0].x;
        ey = arguments[0].y;
        ez = arguments[0].z;
        break;
      case 3:
        ex = arguments[0];
        ey = arguments[1];
        ez = arguments[2];
        break
    }
    this.localRotation.setFromEulerAngles(ex, ey, ez);
    this.dirtyLocal = true
  }, setLocalPosition:function() {
    if(arguments.length === 1) {
      this.localPosition.copy(arguments[0])
    }else {
      this.localPosition.set(arguments[0], arguments[1], arguments[2])
    }
    this.dirtyLocal = true
  }, setLocalRotation:function(q) {
    if(arguments.length === 1) {
      this.localRotation.copy(arguments[0])
    }else {
      this.localRotation.set(arguments[0], arguments[1], arguments[2], arguments[3])
    }
    this.dirtyLocal = true
  }, setLocalScale:function() {
    if(arguments.length === 1) {
      this.localScale.copy(arguments[0])
    }else {
      this.localScale.set(arguments[0], arguments[1], arguments[2])
    }
    this.dirtyLocal = true
  }, setName:function(name) {
    this.name = name
  }, setPosition:function() {
    var position = new pc.Vec3;
    var invParentWtm = new pc.Mat4;
    return function() {
      if(arguments.length === 1) {
        position.copy(arguments[0])
      }else {
        position.set(arguments[0], arguments[1], arguments[2])
      }
      if(this._parent === null) {
        this.localPosition.copy(position)
      }else {
        invParentWtm.copy(this._parent.getWorldTransform()).invert();
        invParentWtm.transformPoint(position, this.localPosition)
      }
      this.dirtyLocal = true
    }
  }(), setRotation:function() {
    var rotation = new pc.Quat;
    var invParentRot = new pc.Quat;
    return function() {
      if(arguments.length === 1) {
        rotation.copy(arguments[0])
      }else {
        rotation.set(arguments[0], arguments[1], arguments[2], arguments[3])
      }
      if(this._parent === null) {
        this.localRotation.copy(rotation)
      }else {
        var parentRot = this._parent.getRotation();
        invParentRot.copy(parentRot).invert();
        this.localRotation.copy(invParentRot).mul(rotation)
      }
      this.dirtyLocal = true
    }
  }(), setEulerAngles:function() {
    var invParentRot = new pc.Quat;
    return function() {
      var ex, ey, ez;
      switch(arguments.length) {
        case 1:
          ex = arguments[0].x;
          ey = arguments[0].y;
          ez = arguments[0].z;
          break;
        case 3:
          ex = arguments[0];
          ey = arguments[1];
          ez = arguments[2];
          break
      }
      this.localRotation.setFromEulerAngles(ex, ey, ez);
      if(this._parent !== null) {
        var parentRot = this._parent.getRotation();
        invParentRot.copy(parentRot).invert();
        this.localRotation.mul2(invParentRot, this.localRotation)
      }
      this.dirtyLocal = true
    }
  }(), addChild:function(node) {
    if(node.getParent() !== null) {
      throw new Error("GraphNode is already parented");
    }
    this._children.push(node);
    node._parent = this;
    var enabledInHierarchy = node._enabled && this.enabled;
    if(node._enabledInHierarchy !== enabledInHierarchy) {
      node._enabledInHierarchy = enabledInHierarchy;
      node._notifyHierarchyStateChanged(node, enabledInHierarchy)
    }
    node.dirtyWorld = true
  }, removeChild:function(child) {
    var i;
    var length = this._children.length;
    child._parent = null;
    for(i = 0;i < length;++i) {
      if(this._children[i] === child) {
        this._children.splice(i, 1);
        return
      }
    }
  }, addLabel:function(label) {
    this._labels[label] = true
  }, getLabels:function() {
    return Object.keys(this._labels)
  }, hasLabel:function(label) {
    return!!this._labels[label]
  }, removeLabel:function(label) {
    delete this._labels[label]
  }, findByLabel:function(label, results) {
    var i, length = this._children.length;
    results = results || [];
    if(this.hasLabel(label)) {
      results.push(this)
    }
    for(i = 0;i < length;++i) {
      results = this._children[i].findByLabel(label, results)
    }
    return results
  }, sync:function() {
    if(this.dirtyLocal) {
      this.localTransform.setTRS(this.localPosition, this.localRotation, this.localScale);
      this.dirtyLocal = false;
      this.dirtyWorld = true
    }
    if(this.dirtyWorld) {
      if(this._parent === null) {
        this.worldTransform.copy(this.localTransform)
      }else {
        this.worldTransform.mul2(this._parent.worldTransform, this.localTransform)
      }
      this.dirtyWorld = false;
      for(var i = 0, len = this._children.length;i < len;i++) {
        this._children[i].dirtyWorld = true
      }
    }
  }, syncHierarchy:function() {
    var F = function() {
      if(!this._enabled) {
        return
      }
      this.sync();
      var c = this._children;
      for(var i = 0, len = c.length;i < len;i++) {
        F.call(c[i])
      }
    };
    return F
  }(), lookAt:function() {
    var matrix = new pc.Mat4;
    var target = new pc.Vec3;
    var up = new pc.Vec3;
    var rotation = new pc.Quat;
    return function() {
      switch(arguments.length) {
        case 1:
          target.copy(arguments[0]);
          up.copy(pc.Vec3.UP);
          break;
        case 2:
          target.copy(arguments[0]);
          up.copy(arguments[1]);
          break;
        case 3:
          target.set(arguments[0], arguments[1], arguments[2]);
          up.copy(pc.Vec3.UP);
          break;
        case 6:
          target.set(arguments[0], arguments[1], arguments[2]);
          up.set(arguments[3], arguments[4], arguments[5]);
          break
      }
      matrix.setLookAt(this.getPosition(), target, up);
      rotation.setFromMat4(matrix);
      this.setRotation(rotation)
    }
  }(), translate:function() {
    var translation = new pc.Vec3;
    return function() {
      switch(arguments.length) {
        case 1:
          translation.copy(arguments[0]);
          break;
        case 3:
          translation.set(arguments[0], arguments[1], arguments[2]);
          break
      }
      translation.add(this.getPosition());
      this.setPosition(translation)
    }
  }(), translateLocal:function() {
    var translation = new pc.Vec3;
    return function() {
      switch(arguments.length) {
        case 1:
          translation.copy(arguments[0]);
          break;
        case 3:
          translation.set(arguments[0], arguments[1], arguments[2]);
          break
      }
      this.localRotation.transformVector(translation, translation);
      this.localPosition.add(translation);
      this.dirtyLocal = true
    }
  }(), rotate:function() {
    var quaternion = new pc.Quat;
    var invParentRot = new pc.Quat;
    return function() {
      var ex, ey, ez;
      switch(arguments.length) {
        case 1:
          ex = arguments[0].x;
          ey = arguments[0].y;
          ez = arguments[0].z;
          break;
        case 3:
          ex = arguments[0];
          ey = arguments[1];
          ez = arguments[2];
          break
      }
      quaternion.setFromEulerAngles(ex, ey, ez);
      if(this._parent === null) {
        this.localRotation.mul2(quaternion, this.localRotation)
      }else {
        var rot = this.getRotation();
        var parentRot = this._parent.getRotation();
        invParentRot.copy(parentRot).invert();
        quaternion.mul2(invParentRot, quaternion);
        this.localRotation.mul2(quaternion, rot)
      }
      this.dirtyLocal = true
    }
  }(), rotateLocal:function() {
    var quaternion = new pc.Quat;
    return function() {
      var ex, ey, ez;
      switch(arguments.length) {
        case 1:
          ex = arguments[0].x;
          ey = arguments[0].y;
          ez = arguments[0].z;
          break;
        case 3:
          ex = arguments[0];
          ey = arguments[1];
          ez = arguments[2];
          break
      }
      quaternion.setFromEulerAngles(ex, ey, ez);
      this.localRotation.mul(quaternion);
      this.dirtyLocal = true
    }
  }()});
  return{GraphNode:GraphNode}
}());
pc.scene.Projection = {PERSPECTIVE:0, ORTHOGRAPHIC:1};
pc.extend(pc.scene, function() {
  var CameraNode = function() {
    this._projection = pc.scene.Projection.PERSPECTIVE;
    this._nearClip = 0.1;
    this._farClip = 1E4;
    this._fov = 45;
    this._orthoHeight = 10;
    this._aspect = 16 / 9;
    this._projMatDirty = true;
    this._projMat = new pc.Mat4;
    this._viewMat = new pc.Mat4;
    this._viewProjMat = new pc.Mat4;
    this._rect = {x:0, y:0, width:1, height:1};
    this._frustum = new pc.shape.Frustum(this._projMat, this._viewMat);
    this._renderTarget = null;
    this._clearOptions = {color:[186 / 255, 186 / 255, 177 / 255, 1], depth:1, flags:pc.gfx.CLEARFLAG_COLOR | pc.gfx.CLEARFLAG_DEPTH}
  };
  CameraNode = pc.inherits(CameraNode, pc.scene.GraphNode);
  pc.extend(CameraNode.prototype, {_cloneInternal:function(clone) {
    CameraNode._super._cloneInternal.call(this, clone);
    clone.setProjection(this.getProjection());
    clone.setNearClip(this.getNearClip());
    clone.setFarClip(this.getFarClip());
    clone.setFov(this.getFov());
    clone.setAspectRatio(this.getAspectRatio());
    clone.setRenderTarget(this.getRenderTarget());
    clone.setClearOptions(this.getClearOptions())
  }, clone:function() {
    var clone = new pc.scene.CameraNode;
    this._cloneInternal(clone);
    return clone
  }, worldToScreen:function(point) {
    var projMat, wtm = this.getWorldTransform(), viewMat = wtm.clone().invert();
    pvm = new pc.Mat4;
    width = this._renderTarget.getWidth(), height = this._renderTarget.getHeight(), point2d = new pc.Vec3;
    projMat = (new pc.Mat4).setPerspective(this._fov, width / height, this._nearClip, this._farClip);
    pvm.mul2(projMat, viewMat);
    pvm.transformPoint(point, point2d);
    point2d.x = width / 2 + width / 2 * point2d.x;
    point2d.y = height - (height / 2 + height / 2 * point2d.y);
    point2d.z = point2d.z;
    return point2d
  }, screenToWorld:function(x, y, z, cw, ch, worldCoord) {
    if(typeof worldCoord === "undefined") {
      worldCoord = new pc.Vec3
    }
    var projMat = this.getProjectionMatrix();
    var wtm = this.getWorldTransform();
    this._viewMat.copy(wtm);
    this._viewMat.invert();
    this._viewProjMat.mul2(projMat, this._viewMat);
    var invViewProjMat = this._viewProjMat.clone().invert();
    if(this._projection === pc.scene.Projection.PERSPECTIVE) {
      var far = new pc.Vec3(x / cw * 2 - 1, (ch - y) / ch * 2 - 1, 1);
      var farW = invViewProjMat.transformPoint(far);
      var w = far.x * invViewProjMat.data[3] + far.y * invViewProjMat.data[7] + far.z * invViewProjMat.data[11] + invViewProjMat.data[15];
      farW.scale(1 / w);
      var alpha = z / this._farClip;
      worldCoord.lerp(this.getPosition(), farW, alpha)
    }else {
      var range = this._farClip - this._nearClip;
      var deviceCoord = new pc.Vec3(x / cw * 2 - 1, (ch - y) / ch * 2 - 1, (this._farClip - z) / range * 2 - 1);
      invViewProjMat.transformPoint(deviceCoord, worldCoord)
    }
    return worldCoord
  }, getAspectRatio:function() {
    return this._aspect
  }, getClearOptions:function() {
    return this._clearOptions
  }, getFarClip:function() {
    return this._farClip
  }, getFov:function() {
    return this._fov
  }, getFrustum:function() {
    return this._frustum
  }, getNearClip:function() {
    return this._nearClip
  }, getOrthoHeight:function() {
    return this._orthoHeight
  }, getProjection:function() {
    return this._projection
  }, getProjectionMatrix:function() {
    if(this._projMatDirty) {
      if(this._projection === pc.scene.Projection.PERSPECTIVE) {
        this._projMat.setPerspective(this._fov, this._aspect, this._nearClip, this._farClip)
      }else {
        var y = this._orthoHeight;
        var x = y * this._aspect;
        this._projMat.setOrtho(-x, x, -y, y, this._nearClip, this._farClip)
      }
      this._projMatDirty = false
    }
    return this._projMat
  }, getRect:function() {
    return this._rect
  }, getRenderTarget:function() {
    return this._renderTarget
  }, setAspectRatio:function(aspect) {
    this._aspect = aspect;
    this._projMatDirty = true
  }, setClearOptions:function(options) {
    this._clearOptions = options
  }, setFarClip:function(far) {
    this._farClip = far;
    this._projMatDirty = true
  }, setFov:function(fov) {
    this._fov = fov;
    this._projMatDirty = true
  }, setNearClip:function(near) {
    this._nearClip = near;
    this._projMatDirty = true
  }, setOrthoHeight:function(height) {
    this._orthoHeight = height;
    this._projMatDirty = true
  }, setProjection:function(type) {
    this._projection = type;
    this._projMatDirty = true
  }, setRect:function(x, y, width, height) {
    this._rect.x = x;
    this._rect.y = y;
    this._rect.width = width;
    this._rect.height = height
  }, setRenderTarget:function(target) {
    this._renderTarget = target
  }});
  return{CameraNode:CameraNode}
}());
pc.extend(pc.scene, function() {
  var LightNode = function LightNode() {
    this._type = pc.scene.LIGHTTYPE_DIRECTIONAL;
    this._color = new pc.Color(0.8, 0.8, 0.8);
    this._intensity = 1;
    this._castShadows = false;
    this._enabled = false;
    this._attenuationStart = 10;
    this._attenuationEnd = 10;
    this._innerConeAngle = 40;
    this._outerConeAngle = 45;
    this._finalColor = new pc.Vec3(0.8, 0.8, 0.8);
    this._position = new pc.Vec3(0, 0, 0);
    this._direction = new pc.Vec3(0, 0, 0);
    this._innerConeAngleCos = Math.cos(this._innerConeAngle * Math.PI / 180);
    this._outerConeAngleCos = Math.cos(this._outerConeAngle * Math.PI / 180);
    this._shadowCamera = null;
    this._shadowMatrix = new pc.Mat4;
    this._shadowResolution = 1024;
    this._shadowBias = -5E-4;
    this._scene = null
  };
  LightNode = pc.inherits(LightNode, pc.scene.GraphNode);
  pc.extend(LightNode.prototype, {_cloneInternal:function(clone) {
    LightNode._super._cloneInternal.call(this, clone);
    clone.setType(this.getType());
    clone.setColor(this.getColor());
    clone.setIntensity(this.getIntensity());
    clone.setCastShadows(this.getCastShadows());
    clone.setEnabled(this.getEnabled());
    clone.setAttenuationStart(this.getAttenuationStart());
    clone.setAttenuationEnd(this.getAttenuationEnd());
    clone.setInnerConeAngle(this.getInnerConeAngle());
    clone.setOuterConeAngle(this.getOuterConeAngle());
    clone.setShadowBias(this.getShadowBias());
    clone.setShadowResolution(this.getShadowResolution())
  }, clone:function() {
    var clone = new pc.scene.LightNode;
    this._cloneInternal(clone);
    return clone
  }, getAttenuationEnd:function() {
    return this._attenuationEnd
  }, getAttenuationStart:function() {
    return this._attenuationStart
  }, getCastShadows:function() {
    return this._castShadows
  }, getColor:function() {
    return this._color
  }, getEnabled:function() {
    return this._enabled
  }, getInnerConeAngle:function() {
    return this._innerConeAngle
  }, getIntensity:function() {
    return this._intensity
  }, getOuterConeAngle:function() {
    return this._outerConeAngle
  }, getShadowBias:function() {
    return this._shadowBias
  }, getShadowResolution:function() {
    return this._shadowResolution
  }, getType:function() {
    return this._type
  }, setAttenuationEnd:function(radius) {
    this._attenuationEnd = radius
  }, setAttenuationStart:function(radius) {
    this._attenuationStart = radius
  }, setCastShadows:function(castShadows) {
    this._castShadows = castShadows;
    if(this._scene !== null) {
      this._scene.updateShaders = true
    }
  }, setColor:function() {
    var r, g, b;
    if(arguments.length === 1) {
      r = arguments[0].r;
      g = arguments[0].g;
      b = arguments[0].b
    }else {
      if(arguments.length === 3) {
        r = arguments[0];
        g = arguments[1];
        b = arguments[2]
      }
    }
    this._color.set(r, g, b);
    var i = this._intensity;
    this._finalColor.set(r * i, g * i, b * i)
  }, setEnabled:function(enable) {
    if(this._enabled !== enable) {
      this._enabled = enable;
      if(this._scene !== null) {
        this._scene.updateShaders = true
      }
    }
  }, setInnerConeAngle:function(angle) {
    this._innerConeAngle = angle;
    this._innerConeAngleCos = Math.cos(angle * Math.PI / 180)
  }, setIntensity:function(intensity) {
    this._intensity = intensity;
    var c = this._color;
    var r = c.r;
    var g = c.g;
    var b = c.b;
    var i = this._intensity;
    this._finalColor.set(r * i, g * i, b * i)
  }, setOuterConeAngle:function(angle) {
    this._outerConeAngle = angle;
    this._outerConeAngleCos = Math.cos(angle * Math.PI / 180)
  }, setShadowBias:function(bias) {
    this._shadowBias = bias
  }, setShadowResolution:function(resolution) {
    this._shadowResolution = resolution
  }, setType:function(type) {
    this._type = type
  }});
  return{LIGHTTYPE_DIRECTIONAL:0, LIGHTTYPE_POINT:1, LIGHTTYPE_SPOT:2, LightNode:LightNode}
}());
pc.extend(pc.scene, function() {
  var id = 0;
  var Material = function Material() {
    this.name = "Untitled";
    this.id = id++;
    this.shader = null;
    this.parameters = {};
    this.alphaTest = 0;
    this.blend = false;
    this.blendSrc = pc.gfx.BLENDMODE_ONE;
    this.blendDst = pc.gfx.BLENDMODE_ZERO;
    this.blendEquation = pc.gfx.BLENDEQUATION_ADD;
    this.cull = pc.gfx.CULLFACE_BACK;
    this.depthTest = true;
    this.depthWrite = true;
    this.redWrite = true;
    this.greenWrite = true;
    this.blueWrite = true;
    this.alphaWrite = true;
    this.meshInstances = []
  };
  Object.defineProperty(Material.prototype, "blendType", {get:function() {
    if(!this.blend && this.blendSrc === pc.gfx.BLENDMODE_ONE && this.blendDst === pc.gfx.BLENDMODE_ZERO && this.blendEquation === pc.gfx.BLENDEQUATION_ADD) {
      return pc.scene.BLEND_NONE
    }else {
      if(this.blend && this.blendSrc === pc.gfx.BLENDMODE_SRC_ALPHA && this.blendDst === pc.gfx.BLENDMODE_ONE_MINUS_SRC_ALPHA && this.blendEquation === pc.gfx.BLENDEQUATION_ADD) {
        return pc.scene.BLEND_NORMAL
      }else {
        if(this.blend && this.blendSrc === pc.gfx.BLENDMODE_ONE && this.blendDst === pc.gfx.BLENDMODE_ONE && this.blendEquation === pc.gfx.BLENDEQUATION_ADD) {
          return pc.scene.BLEND_ADDITIVE
        }else {
          return pc.scene.BLEND_NORMAL
        }
      }
    }
  }, set:function(type) {
    switch(type) {
      case pc.scene.BLEND_NONE:
        this.blend = false;
        this.blendSrc = pc.gfx.BLENDMODE_ONE;
        this.blendDst = pc.gfx.BLENDMODE_ZERO;
        this.blendEquation = pc.gfx.BLENDEQUATION_ADD;
        break;
      case pc.scene.BLEND_NORMAL:
        this.blend = true;
        this.blendSrc = pc.gfx.BLENDMODE_SRC_ALPHA;
        this.blendDst = pc.gfx.BLENDMODE_ONE_MINUS_SRC_ALPHA;
        this.blendEquation = pc.gfx.BLENDEQUATION_ADD;
        break;
      case pc.scene.BLEND_ADDITIVE:
        this.blend = true;
        this.blendSrc = pc.gfx.BLENDMODE_ONE;
        this.blendDst = pc.gfx.BLENDMODE_ONE;
        this.blendEquation = pc.gfx.BLENDEQUATION_ADD;
        break
    }
    this._updateMeshInstanceKeys()
  }});
  Material.prototype._cloneInternal = function(clone) {
    clone.name = this.name;
    clone.id = id++;
    clone.shader = null;
    clone.parameters = {};
    clone.alphaTest = this.alphaTest;
    clone.blend = this.blend;
    clone.blendSrc = this.blendSrc;
    clone.blendDst = this.blendDst;
    clone.blendEquation = this.blendEquation;
    clone.cull = this.cull;
    clone.depthTest = this.depthTest;
    clone.depthWrite = this.depthWrite;
    clone.redWrite = this.redWrite;
    clone.greenWrite = this.greenWrite;
    clone.blueWrite = this.blueWrite;
    clone.alphaWrite = this.alphaWrite;
    clone.meshInstances = []
  }, Material.prototype.clone = function() {
    var clone = new pc.scene.Material;
    this._cloneInternal(clone);
    return clone
  }, Material.prototype._updateMeshInstanceKeys = function() {
    var i, meshInstances = this.meshInstances;
    for(var i = 0;i < meshInstances.length;i++) {
      meshInstances[i].updateKey()
    }
  };
  Material.prototype.updateShader = function(device, scene) {
  };
  Material.prototype.getName = function() {
    return this.name
  };
  Material.prototype.setName = function(name) {
    this.name = name
  };
  Material.prototype.clearParameters = function() {
    this.parameters = {}
  };
  Material.prototype.getParameters = function() {
    return this.parameters
  };
  Material.prototype.getParameter = function(name) {
    return this.parameters[name]
  };
  Material.prototype.setParameter = function(name, data) {
    var param = this.parameters[name];
    if(param) {
      param.data = data
    }else {
      this.parameters[name] = {scopeId:null, data:data}
    }
  };
  Material.prototype.deleteParameter = function(name) {
    if(this.parameters[name]) {
      delete this.parameters[name]
    }
  };
  Material.prototype.setParameters = function() {
    for(var paramName in this.parameters) {
      var parameter = this.parameters[paramName];
      if(!parameter.scopeId) {
        parameter.scopeId = device.scope.resolve(paramName)
      }
      parameter.scopeId.setValue(parameter.data)
    }
  };
  Material.prototype.getShader = function() {
    return this.shader
  };
  Material.prototype.setShader = function(shader) {
    this.shader = shader
  };
  Material.prototype.update = function() {
    throw Error("Not Implemented in base class");
  };
  Material.prototype.init = function(data) {
    throw Error("Not Implemented in base class");
  };
  return{Material:Material}
}());
pc.extend(pc.scene, function() {
  var BasicMaterial = function() {
    this.color = new pc.Color(1, 1, 1, 1);
    this.colorMap = null;
    this.update()
  };
  BasicMaterial = pc.inherits(BasicMaterial, pc.scene.Material);
  pc.extend(BasicMaterial.prototype, {clone:function() {
    var clone = new pc.scene.BasicMaterial;
    Material.prototype._cloneInternal.call(this, clone);
    clone.color.copy(this.color);
    clone.colorMap = this.colorMap;
    clone.update();
    return clone
  }, update:function() {
    this.clearParameters();
    this.setParameter("uColor", this.color.data);
    if(this.colorMap) {
      this.setParameter("texture_diffuseMap", this.colorMap)
    }
  }, updateShader:function(device) {
    var options = {skin:!!this.meshInstances[0].skinInstance};
    var library = device.getProgramLibrary();
    this.shader = library.getProgram("basic", options)
  }});
  return{BasicMaterial:BasicMaterial}
}());
pc.extend(pc.scene, function() {
  var DepthMaterial = function() {
  };
  DepthMaterial = pc.inherits(DepthMaterial, pc.scene.Material);
  pc.extend(DepthMaterial.prototype, {clone:function() {
    var clone = new pc.scene.DepthMaterial;
    Material.prototype._cloneInternal.call(this, clone);
    clone.update();
    return clone
  }, update:function() {
  }, updateShader:function(device) {
    var options = {skin:!!this.meshInstances[0].skinInstance};
    var library = device.getProgramLibrary();
    this.shader = library.getProgram("depth", options)
  }});
  return{DepthMaterial:DepthMaterial}
}());
pc.extend(pc.scene, function() {
  var _tempTiling = new pc.Vec3;
  var _tempRotation = new pc.Quat;
  var _tempOffset = new pc.Vec3;
  var PhongMaterial = function() {
    this.ambient = new pc.Color(0.7, 0.7, 0.7);
    this.diffuse = new pc.Color(0.7, 0.7, 0.7);
    this.diffuseMap = null;
    this.diffuseMapTiling = new pc.Vec2(1, 1);
    this.diffuseMapOffset = new pc.Vec2(0, 0);
    this.diffuseMapRotation = new pc.Vec3(0, 0, 0);
    this.diffuseMapTransform = null;
    this.specular = new pc.Color(0, 0, 0);
    this.specularMap = null;
    this.specularMapTiling = new pc.Vec2(1, 1);
    this.specularMapOffset = new pc.Vec2(0, 0);
    this.specularMapRotation = new pc.Vec3(0, 0, 0);
    this.specularMapTransform = null;
    this.shininess = 25;
    this.glossMap = null;
    this.glossMapTiling = new pc.Vec2(1, 1);
    this.glossMapOffset = new pc.Vec2(0, 0);
    this.glossMapRotation = new pc.Vec3(0, 0, 0);
    this.glossMapTransform = null;
    this.emissive = new pc.Color(0, 0, 0);
    this.emissiveMap = null;
    this.emissiveMapTiling = new pc.Vec2(1, 1);
    this.emissiveMapOffset = new pc.Vec2(0, 0);
    this.emissiveMapRotation = new pc.Vec3(0, 0, 0);
    this.emissiveMapTransform = null;
    this.opacity = 1;
    this.opacityMap = null;
    this.opacityMapTiling = new pc.Vec2(1, 1);
    this.opacityMapOffset = new pc.Vec2(0, 0);
    this.opacityMapRotation = new pc.Vec3(0, 0, 0);
    this.opacityMapTransform = null;
    this.blendType = pc.scene.BLEND_NONE;
    this.normalMap = null;
    this.normalMapTransform = null;
    this.normalMapTiling = new pc.Vec2(1, 1);
    this.normalMapOffset = new pc.Vec2(0, 0);
    this.normalMapRotation = new pc.Vec3(0, 0, 0);
    this.heightMap = null;
    this.heightMapTiling = new pc.Vec2(1, 1);
    this.heightMapOffset = new pc.Vec2(0, 0);
    this.heightMapRotation = new pc.Vec3(0, 0, 0);
    this.heightMapTransform = null;
    this.bumpiness = 1;
    this.cubeMap = null;
    this.sphereMap = null;
    this.reflectivity = 1;
    this.lightMap = null;
    this.ambientUniform = new Float32Array(3);
    this.diffuseUniform = new Float32Array(3);
    this.specularUniform = new Float32Array(3);
    this.emissiveUniform = new Float32Array(3);
    this.update()
  };
  var _createTexture = function(param) {
    if(param.data) {
      if(param.data instanceof pc.gfx.Texture) {
        return param.data
      }else {
        throw Error("PhongMaterial.init() expects textures to already be created");
      }
    }else {
      return null
    }
  };
  var _createVec2 = function(param) {
    return new pc.Vec2(param.data[0], param.data[1])
  };
  var _createVec3 = function(param) {
    return new pc.Vec3(param.data[0], param.data[1], param.data[2])
  };
  var _createRgb = function(param) {
    return new pc.Color(param.data[0], param.data[1], param.data[2])
  };
  PhongMaterial = pc.inherits(PhongMaterial, pc.scene.Material);
  pc.extend(PhongMaterial.prototype, {clone:function() {
    var clone = new pc.scene.PhongMaterial;
    pc.scene.Material.prototype._cloneInternal.call(this, clone);
    clone.ambient.copy(this.ambient);
    clone.diffuse.copy(this.diffuse);
    clone.diffuseMap = this.diffuseMap;
    clone.diffuseMapTiling = this.diffuseMapTiling ? this.diffuseMapTiling.clone() : new pc.Vec2(1, 1);
    clone.diffuseMapOffset = this.diffuseMapOffset ? this.diffuseMapOffset.clone() : new pc.Vec2(0, 0);
    clone.diffuseMapRotation = this.diffuseMapRotation ? this.diffuseMapRotation.clone() : new pc.Vec3;
    clone.diffuseMapTransform = this.diffuseMapTransform ? this.diffuseMapTransform.clone() : null;
    clone.specular.copy(this.specular);
    clone.specularMap = this.specularMap;
    clone.specularMapTiling = this.specularMapTiling ? this.specularMapTiling.clone() : new pc.Vec2(1, 1);
    clone.specularMapOffset = this.specularMapOffset ? this.specularMapOffset.clone() : new pc.Vec2(0, 0);
    clone.specularMapRotation = this.specularMapRotation ? this.specularMapRotation.clone() : new pc.Vec3;
    clone.specularMapTransform = this.specularMapTransform ? this.specularMapTransform.clone() : null;
    clone.shininess = this.shininess;
    clone.glossMap = this.glossMap;
    clone.glossMapTiling = this.glossMapTiling ? this.glossMapTiling.clone() : new pc.Vec2(1, 1);
    clone.glossMapOffset = this.glossMapOffset ? this.glossMapOffset.clone() : new pc.Vec2(0, 0);
    clone.glossMapRotation = this.glossMapRotation ? this.glossMapRotation.clone() : new pc.Vec3;
    clone.glossMapTransform = this.glossMapTransform ? this.glossMapTransform.clone() : null;
    clone.emissive.copy(this.emissive);
    clone.emissiveMap = this.emissiveMap;
    clone.emissiveMapTiling = this.emissiveMapTiling ? this.emissiveMapTiling.clone() : new pc.Vec2(1, 1);
    clone.emissiveMapOffset = this.emissiveMapOffset ? this.emissiveMapOffset.clone() : new pc.Vec2(0, 0);
    clone.emissiveMapRotation = this.emissiveMapRotation ? this.emissiveMapRotation.clone() : new pc.Vec3;
    clone.emissiveMapTransform = this.emissiveMapTransform ? this.emissiveMapTransform.clone() : null;
    clone.opacity = this.opacity;
    clone.opacityMap = this.opacityMap;
    clone.opacityMapTiling = this.opacityMapTiling ? this.opacityMapTiling.clone() : new pc.Vec2(1, 1);
    clone.opacityMapOffset = this.opacityMapOffset ? this.opacityMapOffset.clone() : new pc.Vec2(0, 0);
    clone.opacityMapRotation = this.opacityMapRotation ? this.opacityMapRotation.clone() : new pc.Vec3;
    clone.opacityMapTransform = this.opacityMapTransform ? this.opacityMapTransform.clone() : null;
    clone.blendType = this.blendType;
    clone.normalMap = this.normalMap;
    clone.normalMapTransform = this.normalMapTransform ? this.normalMapTransform.clone() : null;
    clone.normalMapTiling = this.normalMapTiling ? this.normalMapTiling.clone() : new pc.Vec2(1, 1);
    clone.normalMapOffset = this.normalMapOffset ? this.normalMapOffset.clone() : new pc.Vec2(0, 0);
    clone.normalMapRotation = this.normalMapRotation ? this.normalMapRotation.clone() : new pc.Vec3;
    clone.heightMap = this.heightMap;
    clone.heightMapTransform = this.heightMapTransform ? this.heightMapTransform.clone() : null;
    clone.heightMapTiling = this.heightMapTiling ? this.heightMapTiling.clone() : new pc.Vec2(1, 1);
    clone.heightMapOffset = this.heightMapOffset ? this.heightMapOffset.clone() : new pc.Vec2(0, 0);
    clone.heightMapRotation = this.heightMapRotation ? this.heightMapRotation.clone() : new pc.Vec3;
    clone.bumpiness = this.bumpiness;
    clone.cubeMap = this.cubeMap;
    clone.sphereMap = this.sphereMap;
    clone.reflectivity = this.reflectivity;
    clone.lightMap = this.lightMap;
    clone.update();
    return clone
  }, init:function(data) {
    this.name = data.name;
    for(var i = 0;i < data.parameters.length;i++) {
      var param = data.parameters[i];
      switch(param.name) {
        case "ambient":
          this.ambient = _createRgb(param);
          break;
        case "diffuse":
          this.diffuse = _createRgb(param);
          break;
        case "diffuseMap":
          this.diffuseMap = _createTexture(param);
          break;
        case "diffuseMapTiling":
          this.diffuseMapTiling = _createVec2(param);
          break;
        case "diffuseMapOffset":
          this.diffuseMapOffset = _createVec2(param);
          break;
        case "diffuseMapRotation":
          this.diffuseMapRotation = _createVec3(param);
          break;
        case "specular":
          this.specular = _createRgb(param);
          break;
        case "specularMap":
          this.specularMap = _createTexture(param);
          break;
        case "specularMapTiling":
          this.specularMapTiling = _createVec2(param);
          break;
        case "specularMapOffset":
          this.specularMapOffset = _createVec2(param);
          break;
        case "specularMapRotation":
          this.specularMapRotation = _createVec3(param);
          break;
        case "shininess":
          this.shininess = param.data;
          break;
        case "glossMap":
          this.glossMap = _createTexture(param);
          break;
        case "glossMapTiling":
          this.glossMapTiling = _createVec2(param);
          break;
        case "glossMapOffset":
          this.glossMapOffset = _createVec2(param);
          break;
        case "glossMapRotation":
          this.glossMapRotation = _createVec3(param);
          break;
        case "emissive":
          this.emissive = _createRgb(param);
          break;
        case "emissiveMap":
          this.emissiveMap = _createTexture(param);
          break;
        case "emissiveMapTiling":
          this.emissiveMapTiling = _createVec2(param);
          break;
        case "emissiveMapOffset":
          this.emissiveMapOffset = _createVec2(param);
          break;
        case "emissiveMapRotation":
          this.emissiveMapRotation = _createVec3(param);
          break;
        case "opacity":
          this.opacity = param.data;
          break;
        case "opacityMap":
          this.opacityMap = _createTexture(param);
          break;
        case "opacityMapTiling":
          this.opacityMapTiling = _createVec2(param);
          break;
        case "opacityMapOffset":
          this.opacityMapOffset = _createVec2(param);
          break;
        case "opacityMapRotation":
          this.opacityMapRotation = _createVec3(param);
          break;
        case "normalMap":
          this.normalMap = _createTexture(param);
          break;
        case "normalMapTiling":
          this.normalMapTiling = _createVec2(param);
          break;
        case "normalMapOffset":
          this.normalMapOffset = _createVec2(param);
          break;
        case "normalMapRotation":
          this.normalMapRotation = _createVec3(param);
          break;
        case "heightMap":
          this.heightMap = _createTexture(param);
          break;
        case "heightMapTiling":
          this.heightMapTiling = _createVec2(param);
          break;
        case "heightMapOffset":
          this.heightMapOffset = _createVec2(param);
          break;
        case "heightMapRotation":
          this.heightMapRotation = _createVec3(param);
          break;
        case "bumpMapFactor":
          this.bumpiness = param.data;
          break;
        case "cubeMap":
          this.cubeMap = _createTexture(param);
          break;
        case "sphereMap":
          this.sphereMap = _createTexture(param);
          break;
        case "reflectivity":
          this.reflectivity = param.data;
          break;
        case "lightMap":
          this.lightMap = _createTexture(param);
          break;
        case "depthTest":
          this.depthTest = param.data;
          break;
        case "depthWrite":
          this.depthWrite = param.data;
          break;
        case "cull":
          this.cull = param.data;
          break;
        case "blendType":
          this.blendType = param.data;
          break
      }
    }
    this.update()
  }, _updateMapTransform:function(transform, tiling, offset, rotation) {
    if(tiling) {
      _tempTiling.set(tiling.x, tiling.y, 1)
    }else {
      _tempTiling.set(1, 1, 1)
    }
    if(offset) {
      _tempOffset.set(offset.x, offset.y, 0)
    }else {
      _tempOffset.set(0, 0, 0)
    }
    if(rotation) {
      _tempRotation.setFromEulerAngles(rotation.x, rotation.y, rotation.z)
    }else {
      _tempRotation.copy(pc.Quat.IDENTITY)
    }
    transform = transform || new pc.Mat4;
    transform.setTRS(_tempOffset, _tempRotation, _tempTiling);
    return transform.isIdentity() ? null : transform
  }, update:function() {
    this.clearParameters();
    this.ambientUniform[0] = this.ambient.r;
    this.ambientUniform[1] = this.ambient.g;
    this.ambientUniform[2] = this.ambient.b;
    this.setParameter("material_ambient", this.ambientUniform);
    if(this.diffuseMap) {
      this.setParameter("texture_diffuseMap", this.diffuseMap);
      this.diffuseMapTransform = this._updateMapTransform(this.diffuseMapTransform, this.diffuseMapTiling, this.diffuseMapOffset, this.diffuseMapRotation);
      if(this.diffuseMapTransform) {
        this.setParameter("texture_diffuseMapTransform", this.diffuseMapTransform.data)
      }
    }else {
      this.diffuseMapTransform = null;
      this.diffuseUniform[0] = this.diffuse.r;
      this.diffuseUniform[1] = this.diffuse.g;
      this.diffuseUniform[2] = this.diffuse.b;
      this.setParameter("material_diffuse", this.diffuseUniform)
    }
    if(this.specularMap) {
      this.setParameter("texture_specularMap", this.specularMap);
      this.specularMapTransform = this._updateMapTransform(this.specularMapTransform, this.specularMapTiling, this.specularMapOffset, this.specularMapRotation);
      if(this.specularMapTransform) {
        this.setParameter("texture_specularMapTransform", this.specularMapTransform.data)
      }
    }else {
      this.specularMapTransform = null;
      this.specularUniform[0] = this.specular.r;
      this.specularUniform[1] = this.specular.g;
      this.specularUniform[2] = this.specular.b;
      this.setParameter("material_specular", this.specularUniform)
    }
    if(this.glossMap) {
      this.setParameter("texture_glossMap", this.glossMap);
      this.glossMapTransform = this._updateMapTransform(this.glossMapTransform, this.glossMapTiling, this.glossMapOffset, this.glossMapRotation);
      if(this.glossMapTransform) {
        this.setParameter("texture_glossMapTransform", this.glossMapTransform.data)
      }
    }else {
      this.glossMapTransform = null;
      this.setParameter("material_shininess", this.shininess)
    }
    if(this.emissiveMap) {
      this.setParameter("texture_emissiveMap", this.emissiveMap);
      this.emissiveMapTransform = this._updateMapTransform(this.emissiveMapTransform, this.emissiveMapTiling, this.emissiveMapOffset, this.emissiveMapRotation);
      if(this.emissiveMapTransform) {
        this.setParameter("texture_emissiveMapTransform", this.emissiveMapTransform.data)
      }
    }else {
      this.emissiveMapTransform = null;
      this.emissiveUniform[0] = this.emissive.r;
      this.emissiveUniform[1] = this.emissive.g;
      this.emissiveUniform[2] = this.emissive.b;
      this.setParameter("material_emissive", this.emissiveUniform)
    }
    if(this.opacityMap) {
      this.setParameter("texture_opacityMap", this.opacityMap);
      this.opacityMapTransform = this._updateMapTransform(this.opacityMapTransform, this.opacityMapTiling, this.opacityMapOffset, this.opacityMapRotation);
      if(this.opacityMapTransform) {
        this.setParameter("texture_opacityMapTransform", this.opacityMapTransform.data)
      }
    }else {
      this.opacityMapTransform = null;
      this.setParameter("material_opacity", this.opacity)
    }
    if(this.normalMap) {
      this.setParameter("texture_normalMap", this.normalMap);
      this.normalMapTransform = this._updateMapTransform(this.normalMapTransform, this.normalMapTiling, this.normalMapOffset, this.normalMapRotation);
      if(this.normalMapTransform) {
        this.setParameter("texture_normalMapTransform", this.normalMapTransform.data)
      }
    }else {
      this.normalMapTransform = null
    }
    if(this.heightMap) {
      this.setParameter("texture_heightMap", this.heightMap);
      this.heightMapTransform = this._updateMapTransform(this.heightMapTransform, this.heightMapTiling, this.heightMapOffset, this.heightMapRotation);
      if(this.heightMapTransform) {
        this.setParameter("texture_heightMapTransform", this.heightMapTransform.data)
      }
    }else {
      this.heightMapTransform = null
    }
    if(this.normalMap || this.heightMap) {
      this.setParameter("material_bumpMapFactor", this.bumpiness)
    }
    if(this.cubeMap) {
      this.setParameter("texture_cubeMap", this.cubeMap)
    }
    if(this.sphereMap) {
      this.setParameter("texture_sphereMap", this.sphereMap)
    }
    if(this.sphereMap || this.cubeMap) {
      this.setParameter("material_reflectionFactor", this.reflectivity)
    }
    if(this.lightMap) {
      this.setParameter("texture_lightMap", this.lightMap)
    }
    this.shader = null
  }, updateShader:function(device, scene) {
    var lights = scene._lights;
    var numDirs = 0, numPnts = 0, numSpts = 0;
    var numSDirs = 0, numSPnts = 0, numSSpts = 0;
    for(var i = 0;i < lights.length;i++) {
      var light = lights[i];
      if(light.getEnabled()) {
        switch(light.getType()) {
          case pc.scene.LIGHTTYPE_DIRECTIONAL:
            if(light.getCastShadows()) {
              numSDirs++
            }else {
              numDirs++
            }
            break;
          case pc.scene.LIGHTTYPE_POINT:
            numPnts++;
            break;
          case pc.scene.LIGHTTYPE_SPOT:
            if(light.getCastShadows()) {
              numSSpts++
            }else {
              numSpts++
            }
            break
        }
      }
    }
    var options = {fog:scene.fog, skin:!!this.meshInstances[0].skinInstance, numDirs:numDirs, numSDirs:numSDirs, numPnts:numPnts, numSPnts:numSPnts, numSpts:numSpts, numSSpts:numSSpts, diffuseMap:!!this.diffuseMap, diffuseMapTransform:!!this.diffuseMapTransform, specularMap:!!this.specularMap, specularMapTransform:!!this.specularMapTransform, glossMap:!!this.glossMap, glossMapTransform:!!this.glossMapTransform, emissiveMap:!!this.emissiveMap, emissiveMapTransform:!!this.emissiveMapTransform, opacityMap:!!this.opacityMap, 
    opacityMapTransform:!!this.opacityMapTransform, normalMap:!!this.normalMap, normalMapTransform:!!this.normalMapTransform, heightMap:!!this.heightMap, heightMapTransform:!!this.heightMapTransform, sphereMap:!!this.sphereMap, cubeMap:!!this.cubeMap, lightMap:!!this.lightMap};
    var library = device.getProgramLibrary();
    this.shader = library.getProgram("phong", options)
  }});
  return{PhongMaterial:PhongMaterial}
}());
pc.extend(pc.scene, function() {
  var PickMaterial = function() {
    this.color = new pc.Color(1, 1, 1, 1);
    this.colorMap = null;
    this.update()
  };
  PickMaterial = pc.inherits(PickMaterial, pc.scene.Material);
  pc.extend(PickMaterial.prototype, {clone:function() {
    var clone = new pc.scene.PickMaterial;
    Material.prototype._cloneInternal.call(this, clone);
    clone.color.copy(this.color);
    clone.update();
    return clone
  }, update:function() {
    this.clearParameters();
    this.setParameter("uColor", this.color.data)
  }, updateShader:function(device) {
    var options = {skin:!!this.meshInstances[0].skinInstance};
    var library = device.getProgramLibrary();
    this.shader = library.getProgram("pick", options)
  }});
  return{PickMaterial:PickMaterial}
}());
pc.extend(pc.scene, function() {
  function getKey(layer, blendType, isCommand, materialId) {
    return(layer & 7) << 28 | (blendType & 3) << 26 | (isCommand ? 1 : 0) << 25 | (materialId & 33554431) << 0
  }
  var Mesh = function() {
    this.vertexBuffer = null;
    this.indexBuffer = [null];
    this.primitive = [{type:0, base:0, count:0}];
    this.skin = null;
    this.aabb = new pc.shape.Aabb
  };
  var MeshInstance = function MeshInstance(node, mesh, material) {
    this.node = node;
    this.mesh = mesh;
    this.material = material;
    this.layer = pc.scene.LAYER_WORLD;
    this.renderStyle = pc.scene.RENDERSTYLE_SOLID;
    this.castShadow = false;
    this.receiveShadow = true;
    this.key = 0;
    this.updateKey();
    this.skinInstance = null;
    this.aabb = new pc.shape.Aabb;
    this.normalMatrix = new pc.Mat3
  };
  Object.defineProperty(MeshInstance.prototype, "material", {get:function() {
    return this._material
  }, set:function(material) {
    if(this._material) {
      var meshInstances = this._material.meshInstances;
      var index = meshInstances.indexOf(this);
      if(index !== -1) {
        meshInstances.splice(index, 1)
      }
    }
    this._material = material;
    this._material.meshInstances.push(this);
    this.updateKey()
  }});
  Object.defineProperty(MeshInstance.prototype, "layer", {get:function() {
    return this._layer
  }, set:function(layer) {
    this._layer = layer;
    this.updateKey()
  }});
  pc.extend(MeshInstance.prototype, {syncAabb:function() {
    this.aabb.setFromTransformedAabb(this.mesh.aabb, this.node.worldTransform)
  }, updateKey:function() {
    var material = this.material;
    this.key = getKey(this.layer, material.blendType, false, material.id)
  }});
  var Command = function(layer, blendType, command) {
    this.key = getKey(layer, blendType, true, 0);
    this.command = command
  };
  return{Command:Command, Mesh:Mesh, MeshInstance:MeshInstance}
}());
pc.extend(pc.scene, function() {
  var Skin = function(graphicsDevice, ibp, boneNames) {
    this.device = graphicsDevice;
    this.inverseBindPose = ibp;
    this.boneNames = boneNames
  };
  var SkinInstance = function(skin) {
    this.skin = skin;
    this.bones = [];
    var numBones = skin.inverseBindPose.length;
    var device = skin.device;
    if(device.supportsBoneTextures) {
      var size;
      if(numBones > 256) {
        size = 64
      }else {
        if(numBones > 64) {
          size = 32
        }else {
          if(numBones > 16) {
            size = 16
          }else {
            size = 8
          }
        }
      }
      this.matrixPalette = new Float32Array(size * size * 4);
      this.boneTexture = new pc.gfx.Texture(device, {width:size, height:size, format:pc.gfx.PIXELFORMAT_RGBA32F, autoMipmap:false});
      this.boneTexture.minFilter = pc.gfx.FILTER_NEAREST;
      this.boneTexture.magFilter = pc.gfx.FILTER_NEAREST;
      this.matrixPalette = this.boneTexture.lock()
    }else {
      this.matrixPalette = new Float32Array(numBones * 16)
    }
  };
  SkinInstance.prototype = {updateMatrixPalette:function() {
    var paletteEntry = new pc.Mat4;
    return function() {
      var pe = paletteEntry.data;
      var mp = this.matrixPalette;
      var base;
      for(var i = this.bones.length - 1;i >= 0;i--) {
        paletteEntry.mul2(this.bones[i].worldTransform, this.skin.inverseBindPose[i]);
        base = i * 16;
        mp[base] = pe[0];
        mp[base + 1] = pe[1];
        mp[base + 2] = pe[2];
        mp[base + 3] = pe[3];
        mp[base + 4] = pe[4];
        mp[base + 5] = pe[5];
        mp[base + 6] = pe[6];
        mp[base + 7] = pe[7];
        mp[base + 8] = pe[8];
        mp[base + 9] = pe[9];
        mp[base + 10] = pe[10];
        mp[base + 11] = pe[11];
        mp[base + 12] = pe[12];
        mp[base + 13] = pe[13];
        mp[base + 14] = pe[14];
        mp[base + 15] = pe[15]
      }
      if(this.skin.device.supportsBoneTextures) {
        this.boneTexture.lock();
        this.boneTexture.unlock()
      }
    }
  }()};
  return{Skin:Skin, SkinInstance:SkinInstance}
}());
pc.extend(pc.scene, function() {
  function PartitionedVertex() {
    this.index = 0;
    this.boneIndices = [0, 0, 0, 0]
  }
  function SkinPartition() {
    this.partition = 0;
    this.vertexStart = 0;
    this.vertexCount = 0;
    this.indexStart = 0;
    this.indexCount = 0;
    this.boneIndices = [];
    this.vertices = [];
    this.indices = [];
    this.indexMap = {}
  }
  SkinPartition.prototype = {addVertex:function(vertex, idx, vertexArray) {
    var remappedIndex = -1;
    if(this.indexMap[idx] !== undefined) {
      remappedIndex = this.indexMap[idx];
      this.indices.push(remappedIndex)
    }else {
      for(var influence = 0;influence < 4;influence++) {
        if(vertexArray.blendWeight.data[idx * 4 + influence] === 0) {
          continue
        }
        var originalBoneIndex = vertexArray.blendIndices.data[vertex.index * 4 + influence];
        vertex.boneIndices[influence] = this.getBoneRemap(originalBoneIndex)
      }
      remappedIndex = this.vertices.length;
      this.indices.push(remappedIndex);
      this.vertices.push(vertex);
      this.indexMap[idx] = remappedIndex
    }
  }, addPrimitive:function(vertices, vertexIndices, vertexArray, boneLimit) {
    var i, j;
    var bonesToAdd = [];
    var bonesToAddCount = 0;
    var vertexCount = vertices.length;
    for(i = 0;i < vertexCount;i++) {
      var vertex = vertices[i];
      var idx = vertex.index;
      for(var influence = 0;influence < 4;influence++) {
        if(vertexArray.blendWeight.data[idx * 4 + influence] > 0) {
          var boneIndex = vertexArray.blendIndices.data[idx * 4 + influence];
          var needToAdd = true;
          for(j = 0;j < bonesToAddCount;j++) {
            if(bonesToAdd[j] == boneIndex) {
              needToAdd = false;
              break
            }
          }
          if(needToAdd) {
            bonesToAdd[bonesToAddCount] = boneIndex;
            var boneRemap = this.getBoneRemap(boneIndex);
            bonesToAddCount += boneRemap === -1 ? 1 : 0
          }
        }
      }
    }
    if(this.boneIndices.length + bonesToAddCount > boneLimit) {
      return false
    }
    for(i = 0;i < bonesToAddCount;i++) {
      this.boneIndices.push(bonesToAdd[i])
    }
    for(i = 0;i < vertexCount;i++) {
      this.addVertex(vertices[i], vertexIndices[i], vertexArray)
    }
    return true
  }, getBoneRemap:function(boneIndex) {
    for(var i = 0;i < this.boneIndices.length;i++) {
      if(this.boneIndices[i] === boneIndex) {
        return i
      }
    }
    return-1
  }};
  function indicesToReferences(model) {
    var i;
    var vertices = model.vertices;
    var skins = model.skins;
    var meshes = model.meshes;
    var meshInstances = model.meshInstances;
    for(i = 0;i < meshes.length;i++) {
      meshes[i].vertices = vertices[meshes[i].vertices];
      if(typeof meshes[i].skin !== "undefined") {
        meshes[i].skin = skins[meshes[i].skin]
      }
    }
    for(i = 0;i < meshInstances.length;i++) {
      meshInstances[i].mesh = meshes[meshInstances[i].mesh]
    }
  }
  function referencesToIndices(model) {
    var i;
    var vertices = model.vertices;
    var skins = model.skins;
    var meshes = model.meshes;
    var meshInstances = model.meshInstances;
    for(i = 0;i < meshes.length;i++) {
      meshes[i].vertices = vertices.indexOf(meshes[i].vertices);
      if(typeof meshes[i].skin !== "undefined") {
        meshes[i].skin = skins.indexOf(meshes[i].skin)
      }
    }
    for(i = 0;i < meshInstances.length;i++) {
      meshInstances[i].mesh = meshes.indexOf(meshInstances[i].mesh)
    }
  }
  function partitionSkin(model, materialMappings, boneLimit) {
    var i, j, k;
    indicesToReferences(model);
    var vertexArrays = model.vertices;
    var skins = model.skins;
    var meshes = model.meshes;
    var meshInstances = model.meshInstances;
    for(i = skins.length - 1;i >= 0;i--) {
      if(skins[i].boneNames.length > boneLimit) {
        var skin = skins.splice(i, 1)[0];
        var meshesToSplit = [];
        for(j = 0;j < meshes.length;j++) {
          if(meshes[j].skin === skin) {
            meshesToSplit.push(meshes[j])
          }
        }
        for(j = 0;j < meshesToSplit.length;j++) {
          var index = meshes.indexOf(meshesToSplit[j]);
          if(index !== -1) {
            meshes.splice(index, 1)
          }
        }
        if(meshesToSplit.length === 0) {
          throw new Error("partitionSkin: There should be at least one mesh that references a skin");
        }
        var vertexArray = meshesToSplit[0].vertices;
        for(j = 1;j < meshesToSplit.length;j++) {
          if(meshesToSplit[j].vertices !== vertexArray) {
            throw new Error("partitionSkin: All meshes that share a skin should also share the same vertex buffer");
          }
        }
        var partition;
        var partitions = [];
        var getVertex = function(idx) {
          var vert = new PartitionedVertex;
          vert.index = idx;
          return vert
        };
        var primitiveVertices = [];
        var primitiveIndices = [];
        var basePartition = 0;
        for(j = 0;j < meshesToSplit.length;j++) {
          var mesh = meshesToSplit[j];
          var indices = mesh.indices;
          for(var iIndex = mesh.base;iIndex < mesh.base + mesh.count;) {
            var index;
            index = indices[iIndex++];
            primitiveVertices[0] = getVertex(index);
            primitiveIndices[0] = index;
            index = indices[iIndex++];
            primitiveVertices[1] = getVertex(index);
            primitiveIndices[1] = index;
            index = indices[iIndex++];
            primitiveVertices[2] = getVertex(index);
            primitiveIndices[2] = index;
            var added = false;
            for(var iBonePartition = basePartition;iBonePartition < partitions.length;iBonePartition++) {
              partition = partitions[iBonePartition];
              if(partition.addPrimitive(primitiveVertices, primitiveIndices, vertexArray, boneLimit)) {
                added = true;
                break
              }
            }
            if(!added) {
              partition = new SkinPartition;
              partition.originalMesh = mesh;
              partition.addPrimitive(primitiveVertices, primitiveIndices, vertexArray, boneLimit);
              partitions.push(partition)
            }
          }
          basePartition = partitions.length
        }
        var partitionedVertices = [];
        var partitionedIndices = [];
        for(j = 0;j < partitions.length;j++) {
          partition = partitions[j];
          if(partition.vertices.length && partition.indices.length) {
            var vertexStart = partitionedVertices.length;
            var vertexCount = partition.vertices.length;
            var indexStart = partitionedIndices.length;
            var indexCount = partition.indices.length;
            partition.partition = j;
            partition.vertexStart = vertexStart;
            partition.vertexCount = vertexCount;
            partition.indexStart = indexStart;
            partition.indexCount = indexCount;
            var iSour;
            var iDest;
            iSour = 0;
            iDest = vertexStart;
            while(iSour < vertexCount) {
              partitionedVertices[iDest++] = partition.vertices[iSour++]
            }
            iSour = 0;
            iDest = indexStart;
            while(iSour < indexCount) {
              partitionedIndices[iDest++] = partition.indices[iSour++] + vertexStart
            }
          }
        }
        var splitSkins = [];
        for(j = 0;j < partitions.length;j++) {
          partition = partitions[j];
          var ibp = [];
          var boneNames = [];
          for(k = 0;k < partition.boneIndices.length;k++) {
            ibp.push(skin.inverseBindMatrices[partition.boneIndices[k]]);
            boneNames.push(skin.boneNames[partition.boneIndices[k]])
          }
          var splitSkin = {inverseBindMatrices:ibp, boneNames:boneNames};
          splitSkins.push(splitSkin);
          skins.push(splitSkin)
        }
        var attrib, attribName;
        var splitVertexArray = {};
        for(attribName in vertexArray) {
          splitVertexArray[attribName] = {components:vertexArray[attribName].components, data:[], type:vertexArray[attribName].type}
        }
        for(attribName in vertexArray) {
          if(attribName === "blendIndices") {
            var dstBoneIndices = splitVertexArray[attribName].data;
            for(j = 0;j < partitionedVertices.length;j++) {
              var srcBoneIndices = partitionedVertices[j].boneIndices;
              dstBoneIndices.push(srcBoneIndices[0], srcBoneIndices[1], srcBoneIndices[2], srcBoneIndices[3])
            }
          }else {
            attrib = vertexArray[attribName];
            data = attrib.data;
            components = attrib.components;
            for(j = 0;j < partitionedVertices.length;j++) {
              var index = partitionedVertices[j].index;
              for(k = 0;k < components;k++) {
                splitVertexArray[attribName].data.push(data[index * components + k])
              }
            }
          }
        }
        vertexArrays[vertexArrays.indexOf(vertexArray)] = splitVertexArray;
        var base = 0;
        for(j = 0;j < partitions.length;j++) {
          partition = partitions[j];
          var mesh = {aabb:{min:[0, 0, 0], max:[0, 0, 0]}, vertices:splitVertexArray, skin:splitSkins[j], indices:partitionedIndices.splice(0, partition.indexCount), type:"triangles", base:0, count:partition.indexCount};
          meshes.push(mesh);
          for(k = meshInstances.length - 1;k >= 0;k--) {
            if(meshInstances[k].mesh === partition.originalMesh) {
              meshInstances.push({mesh:mesh, node:meshInstances[k].node});
              if(materialMappings) {
                materialMappings.push({material:materialMappings[k].material, path:materialMappings[k].path})
              }
            }
          }
          base += partition.indexCount
        }
        for(j = 0;j < partitions.length;j++) {
          partition = partitions[j];
          for(k = meshInstances.length - 1;k >= 0;k--) {
            if(meshInstances[k].mesh === partition.originalMesh) {
              meshInstances.splice(k, 1);
              if(materialMappings) {
                materialMappings.splice(k, 1)
              }
            }
          }
        }
      }
    }
    referencesToIndices(model)
  }
  return{partitionSkin:partitionSkin}
}());
pc.extend(pc.scene, function() {
  var Model = function Model() {
    this.graph = null;
    this.meshInstances = [];
    this.skinInstances = [];
    this.cameras = [];
    this.lights = []
  };
  Model.prototype.getGraph = function() {
    return this.graph
  };
  Model.prototype.setGraph = function(graph) {
    this.graph = graph
  };
  Model.prototype.getCameras = function() {
    return this.cameras
  };
  Model.prototype.setCameras = function(cameras) {
    this.cameras = cameras
  };
  Model.prototype.getLights = function() {
    return this.lights
  };
  Model.prototype.setLights = function(lights) {
    this.lights = lights
  };
  Model.prototype.getTextures = function() {
    return this.textures
  };
  Model.prototype.getMaterials = function() {
    var i;
    var materials = [];
    for(i = 0;i < this.meshInstances.length;i++) {
      var meshInstance = this.meshInstances[i];
      if(materials.indexOf(meshInstance.material) === -1) {
        materials.push(meshInstance.material)
      }
    }
    return materials
  };
  Model.prototype.clone = function() {
    var i;
    var srcNodes = [];
    var cloneNodes = [];
    var _duplicate = function(node) {
      var newNode = node.clone();
      srcNodes.push(node);
      cloneNodes.push(newNode);
      if(node instanceof pc.scene.CameraNode) {
        clone.cameras.push(newNode)
      }else {
        if(node instanceof pc.scene.LightNode) {
          clone.lights.push(newNode)
        }
      }
      var children = node.getChildren();
      for(var i = 0;i < children.length;i++) {
        newNode.addChild(_duplicate(children[i]))
      }
      return newNode
    };
    var cloneGraph = _duplicate(this.graph);
    var cloneMeshInstances = [];
    var cloneSkinInstances = [];
    for(i = 0;i < this.skinInstances.length;i++) {
      var skin = this.skinInstances[i].skin;
      var cloneSkinInstance = new pc.scene.SkinInstance(skin);
      var bones = [];
      for(j = 0;j < skin.boneNames.length;j++) {
        var boneName = skin.boneNames[j];
        var bone = cloneGraph.findByName(boneName);
        bones.push(bone)
      }
      cloneSkinInstance.bones = bones;
      cloneSkinInstances.push(cloneSkinInstance)
    }
    for(i = 0;i < this.meshInstances.length;i++) {
      var meshInstance = this.meshInstances[i];
      var nodeIndex = srcNodes.indexOf(meshInstance.node);
      var cloneMeshInstance = new pc.scene.MeshInstance(cloneNodes[nodeIndex], meshInstance.mesh, meshInstance.material);
      if(meshInstance.skinInstance) {
        var skinInstanceIndex = this.skinInstances.indexOf(meshInstance.skinInstance);
        cloneMeshInstance.skinInstance = cloneSkinInstances[skinInstanceIndex]
      }
      cloneMeshInstances.push(cloneMeshInstance)
    }
    var clone = new pc.scene.Model;
    clone.graph = cloneGraph;
    clone.meshInstances = cloneMeshInstances;
    clone.skinInstances = cloneSkinInstances;
    clone.getGraph().syncHierarchy();
    var meshInstances = clone.meshInstances;
    for(i = 0;i < meshInstances.length;i++) {
      meshInstances[i].syncAabb()
    }
    return clone
  };
  Model.prototype.generateWireframe = function() {
    var i, j, k;
    var i1, i2;
    var mesh, base, count, indexBuffer, wireBuffer;
    var srcIndices, dstIndices;
    var meshes = [];
    for(i = 0;i < this.meshInstances.length;i++) {
      mesh = this.meshInstances[i].mesh;
      if(meshes.indexOf(mesh) === -1) {
        meshes.push(mesh)
      }
    }
    var offsets = [[0, 1], [1, 2], [2, 0]];
    for(i = 0;i < meshes.length;i++) {
      mesh = meshes[i];
      base = mesh.primitive[pc.scene.RENDERSTYLE_SOLID].base;
      count = mesh.primitive[pc.scene.RENDERSTYLE_SOLID].count;
      indexBuffer = mesh.indexBuffer[pc.scene.RENDERSTYLE_SOLID];
      srcIndices = new Uint16Array(indexBuffer.lock());
      var uniqueLineIndices = {};
      var lines = [];
      for(j = base;j < base + count;j += 3) {
        for(k = 0;k < 3;k++) {
          i1 = srcIndices[j + offsets[k][0]];
          i2 = srcIndices[j + offsets[k][1]];
          var line = i1 > i2 ? i2 << 16 | i1 : i1 << 16 | i2;
          if(uniqueLineIndices[line] === undefined) {
            uniqueLineIndices[line] = 0;
            lines.push(i1, i2)
          }
        }
      }
      indexBuffer.unlock();
      wireBuffer = new pc.gfx.IndexBuffer(indexBuffer.device, pc.gfx.INDEXFORMAT_UINT16, lines.length);
      dstIndices = new Uint16Array(wireBuffer.lock());
      dstIndices.set(lines);
      wireBuffer.unlock();
      mesh.primitive[pc.scene.RENDERSTYLE_WIREFRAME] = {type:pc.gfx.PRIMITIVE_LINES, base:0, count:lines.length, indexed:true};
      mesh.indexBuffer[pc.scene.RENDERSTYLE_WIREFRAME] = wireBuffer
    }
  };
  return{Model:Model}
}());
pc.extend(pc.scene, function() {
  var position = new pc.Vec3;
  var velocity = new pc.Vec3;
  var acceleration = new pc.Vec3;
  var colorMult = new pc.Vec4;
  var particleVerts = [[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]];
  var plusMinus = function(range) {
    return(Math.random() - 0.5) * range * 2
  };
  var plusMinusVector3 = function(range) {
    var v = new pc.Vec3;
    v.set(plusMinus(range.x), plusMinus(range.y), plusMinus(range.z));
    return v
  };
  var plusMinusVector4 = function(range) {
    var v = new pc.Vec4;
    v.set(plusMinus(range.x), plusMinus(range.y), plusMinus(range.z), plusMinus(range.w));
    return v
  };
  var _createTexture = function(device, width, height, pixelData) {
    var texture = new pc.gfx.Texture(device, {width:width, height:height, format:pc.gfx.PIXELFORMAT_R8_G8_B8_A8, cubemap:false, autoMipmap:true});
    var pixels = texture.lock();
    pixels.set(pixelData);
    texture.unlock();
    texture.addressU = pc.gfx.ADDRESS_CLAMP_TO_EDGE;
    texture.addressV = pc.gfx.ADDRESS_CLAMP_TO_EDGE;
    texture.minFilter = pc.gfx.FILTER_LINEAR;
    texture.magFilter = pc.gfx.FILTER_LINEAR;
    return texture
  };
  var ParticleEmitter = function ParticleEmitter(graphicsDevice, options) {
    this.graphicsDevice = graphicsDevice;
    this.numParticles = typeof options.numParticles !== "undefined" ? options.numParticles : 1;
    this.numFrames = typeof options.numFrames !== "undefined" ? options.numFrames : 1;
    this.frameDuration = typeof options.frameDuration !== "undefined" ? options.frameDuration : 1;
    this.frameStart = typeof options.frameStart !== "undefined" ? options.frameStart : 0;
    this.frameStartRange = typeof options.frameStartRange !== "undefined" ? options.frameStartRange : 0;
    this.timeRange = typeof options.timeRange !== "undefined" ? options.timeRange : 99999999;
    this.startTime = typeof options.startTime !== "undefined" ? options.startTime : null;
    this.lifeTime = typeof options.lifeTime !== "undefined" ? options.lifeTime : 1;
    this.lifeTimeRange = typeof options.lifeTimeRange !== "undefined" ? options.lifeTimeRange : 0;
    this.startSize = typeof options.startSize !== "undefined" ? options.startSize : 1;
    this.startSizeRange = typeof options.startSizeRange !== "undefined" ? options.startSizeRange : 0;
    this.endSize = typeof options.endSize !== "undefined" ? options.endSize : 1;
    this.endSizeRange = typeof options.endSizeRange !== "undefined" ? options.endSizeRange : 0;
    this.position = typeof options.position !== "undefined" ? options.position : new pc.Vec3(0, 0, 0);
    this.positionRange = typeof options.positionRange !== "undefined" ? options.positionRange : new pc.Vec3(0, 0, 0);
    this.velocity = typeof options.velocity !== "undefined" ? options.velocity : new pc.Vec3(0, 0, 0);
    this.velocityRange = typeof options.velocityRange !== "undefined" ? options.velocityRange : new pc.Vec3(0, 0, 0);
    this.acceleration = typeof options.acceleration !== "undefined" ? options.acceleration : new pc.Vec3(0, 0, 0);
    this.accelerationRange = typeof options.accelerationRange !== "undefined" ? options.accelerationRange : new pc.Vec3(0, 0, 0);
    this.spinStart = typeof options.spinStart !== "undefined" ? options.spinStart : 0;
    this.spinStartRange = typeof options.spinStartRange !== "undefined" ? options.spinStartRange : 0;
    this.spinSpeed = typeof options.spinSpeed !== "undefined" ? options.spinSpeed : 0;
    this.spinSpeedRange = typeof options.spinSpeedRange !== "undefined" ? options.spinSpeedRange : 0;
    this.colorMult = typeof options.colorMult !== "undefined" ? options.colorMult : new pc.Vec4(1, 1, 1, 1);
    this.colorMultRange = typeof options.colorMultRange !== "undefined" ? options.colorMultRange : new pc.Vec4(0, 0, 0, 0);
    this.worldVelocity = typeof options.worldVelocity !== "undefined" ? options.worldVelocity : new pc.Vec3(0, 0, 0);
    this.worldAcceleration = typeof options.worldAcceleration !== "undefined" ? options.worldAcceleration : new pc.Vec3(0, 0, 0);
    this.billboard = typeof options.billboard !== "undefined" ? options.billboard : true;
    this.orientation = typeof options.orientation !== "undefined" ? options.orientation : new pc.Vec4(0, 0, 0, 1);
    this.dynamic = typeof options.dynamic !== "undefined" ? options.dynamic : false;
    this.birthIndex = 0;
    this.maxParticles = 1E3;
    var pixels = [];
    var vals = [0, 0.2, 0.7, 1, 1, 0.7, 0.2, 0];
    for(var y = 0;y < 8;y++) {
      for(var x = 0;x < 8;x++) {
        var pixelComponent = vals[x] * vals[y] * 255;
        pixels.push(pixelComponent, pixelComponent, pixelComponent, pixelComponent)
      }
    }
    this.colorMap = _createTexture(graphicsDevice, 8, 8, pixels);
    this.opacityMap = _createTexture(graphicsDevice, 1, 1, [255, 255, 255, 255]);
    this.rampMap = _createTexture(graphicsDevice, 2, 1, [255, 255, 255, 255, 255, 255, 255, 0]);
    this.allocate(this.numParticles);
    this.generate(0, this.numParticles);
    var mesh = new pc.scene.Mesh;
    mesh.vertexBuffer = this.vertexBuffer;
    mesh.indexBuffer[0] = this.indexBuffer;
    mesh.primitive[0].type = pc.gfx.PRIMITIVE_TRIANGLES;
    mesh.primitive[0].base = 0;
    mesh.primitive[0].count = this.indexBuffer.getNumIndices();
    mesh.primitive[0].indexed = true;
    var material = new pc.scene.Material;
    var programLib = this.graphicsDevice.getProgramLibrary();
    var shader = programLib.getProgram("particle", {billboard:this.billboard});
    material.setShader(shader);
    material.setParameter("particle_worldVelocity", this.worldVelocity.data);
    material.setParameter("particle_worldAcceleration", this.worldAcceleration.data);
    material.setParameter("particle_numFrames", this.numFrames);
    material.setParameter("particle_frameDuration", this.frameDuration);
    material.setParameter("particle_timeRange", this.timeRange);
    material.setParameter("particle_timeOffset", 0);
    material.setParameter("particle_time", 0);
    material.setParameter("texture_colorMap", this.colorMap);
    material.setParameter("texture_opacityMap", this.opacityMap);
    material.setParameter("texture_rampMap", this.rampMap);
    material.cullMode = pc.gfx.CULLFACE_NONE;
    material.blend = true;
    material.blendSrc = pc.gfx.BLENDMODE_SRC_ALPHA;
    material.blendDst = pc.gfx.BLENDMODE_ONE;
    material.depthWrite = false;
    this.meshInstance = new pc.scene.MeshInstance(null, mesh, material);
    this.meshInstance.layer = pc.scene.LAYER_FX;
    this.meshInstance.updateKey();
    this.time = 0
  };
  ParticleEmitter.prototype = {allocate:function(numParticles) {
    if(this.vertexBuffer === undefined || this.vertexBuffer.getNumVertices() !== numParticles * 4) {
      var elements = [{semantic:pc.gfx.SEMANTIC_ATTR0, components:4, type:pc.gfx.ELEMENTTYPE_FLOAT32}, {semantic:pc.gfx.SEMANTIC_ATTR1, components:4, type:pc.gfx.ELEMENTTYPE_FLOAT32}, {semantic:pc.gfx.SEMANTIC_ATTR2, components:4, type:pc.gfx.ELEMENTTYPE_FLOAT32}, {semantic:pc.gfx.SEMANTIC_ATTR3, components:4, type:pc.gfx.ELEMENTTYPE_FLOAT32}, {semantic:pc.gfx.SEMANTIC_ATTR4, components:4, type:pc.gfx.ELEMENTTYPE_FLOAT32}, {semantic:pc.gfx.SEMANTIC_ATTR5, components:4, type:pc.gfx.ELEMENTTYPE_FLOAT32}];
      if(!this.billboard) {
        elements.push({semantic:pc.gfx.SEMANTIC_ATTR6, components:4, type:pc.gfx.ELEMENTTYPE_FLOAT32})
      }
      var particleFormat = new pc.gfx.VertexFormat(this.graphicsDevice, elements);
      this.vertexBuffer = new pc.gfx.VertexBuffer(this.graphicsDevice, particleFormat, 4 * numParticles, pc.gfx.BUFFER_DYNAMIC);
      this.indexBuffer = new pc.gfx.IndexBuffer(this.graphicsDevice, pc.gfx.INDEXFORMAT_UINT16, 6 * numParticles);
      var dst = 0;
      var indices = new Uint16Array(this.indexBuffer.lock());
      for(var i = 0;i < numParticles;i++) {
        var baseIndex = i * 4;
        indices[dst++] = baseIndex;
        indices[dst++] = baseIndex + 1;
        indices[dst++] = baseIndex + 2;
        indices[dst++] = baseIndex;
        indices[dst++] = baseIndex + 2;
        indices[dst++] = baseIndex + 3
      }
      this.indexBuffer.unlock()
    }
  }, generate:function(base, count) {
    var data = new Float32Array(this.vertexBuffer.lock());
    var vsize = this.billboard ? 6 * 4 : 7 * 4;
    for(var p = base;p < count;p++) {
      var lifeTime = this.lifeTime;
      var startTime = p * lifeTime / count;
      var frameStart = this.frameStart + plusMinus(this.frameStartRange);
      position.add2(this.position, plusMinusVector3(this.positionRange));
      velocity.add2(this.velocity, plusMinusVector3(this.velocityRange));
      acceleration.add2(this.acceleration, plusMinusVector3(this.accelerationRange));
      colorMult.add2(this.colorMult, plusMinusVector4(this.colorMultRange));
      var spinStart = this.spinStart + plusMinus(this.spinStartRange);
      var spinSpeed = this.spinSpeed + plusMinus(this.spinSpeedRange);
      var startSize = this.startSize + plusMinus(this.startSizeRange);
      var endSize = this.endSize + plusMinus(this.endSizeRange);
      var orientation = this.orientation;
      for(var corner = 0;corner < 4;corner++) {
        var i = (p * 4 + corner) * vsize;
        data[i + 0] = particleVerts[corner][0];
        data[i + 1] = particleVerts[corner][1];
        data[i + 2] = lifeTime;
        data[i + 3] = frameStart;
        data[i + 4] = position.x;
        data[i + 5] = position.y;
        data[i + 6] = position.z;
        data[i + 7] = startTime;
        data[i + 8] = velocity.x;
        data[i + 9] = velocity.y;
        data[i + 10] = velocity.z;
        data[i + 11] = startSize;
        data[i + 12] = acceleration.x;
        data[i + 13] = acceleration.y;
        data[i + 14] = acceleration.z;
        data[i + 15] = endSize;
        data[i + 16] = spinStart;
        data[i + 17] = spinSpeed;
        data[i + 18] = 0;
        data[i + 19] = 0;
        data[i + 20] = colorMult.x;
        data[i + 21] = colorMult.y;
        data[i + 22] = colorMult.z;
        data[i + 23] = colorMult.w;
        if(!this.billboard) {
          data[i + 24] = orientation.x;
          data[i + 25] = orientation.y;
          data[i + 26] = orientation.z;
          data[i + 27] = orientation.w
        }
      }
    }
    this.vertexBuffer.unlock()
  }, addTime:function(delta) {
    this.time += delta;
    this.meshInstance.material.setParameter("particle_time", this.time);
    if(this.dynamic) {
      this.generate(this.birthIndex + this.numParticles, this.numParticles);
      this.birthIndex += this.numParticles
    }
  }, setColorRamp:function(pixels) {
    for(var i = 0;i < pixels.length;i++) {
      pixels[i] = Math.floor(pixels[i] * 255)
    }
    this.rampMap = _createTexture(this.graphicsDevice, pixels.length / 4, 1, pixels);
    this.meshInstance.material.setParameter("texture_rampMap", this.rampMap)
  }, setColorMap:function(colorMap) {
    this.colorMap = colorMap;
    this.meshInstance.material.setParameter("texture_colorMap", this.colorMap)
  }, setOpacityMap:function(opacityMap) {
    this.opacityMap = opacityMap;
    this.meshInstance.material.setParameter("texture_opacityMap", this.opacityMap)
  }};
  return{ParticleEmitter:ParticleEmitter}
}());
pc.extend(pc.scene, function() {
  var Picker = function(device, width, height) {
    this.device = device;
    var library = device.getProgramLibrary();
    this.pickProgStatic = library.getProgram("pick", {skin:false});
    this.pickProgSkin = library.getProgram("pick", {skin:true});
    this.pickColor = new Float32Array(4);
    this.scene = null;
    this.clearOptions = {color:[1, 1, 1, 1], depth:1, flags:pc.gfx.CLEARFLAG_COLOR | pc.gfx.CLEARFLAG_DEPTH};
    this.resize(width, height)
  };
  Picker.prototype.getSelection = function(rect) {
    rect.width = rect.width || 1;
    rect.height = rect.height || 1;
    this._pickBufferTarget.bind();
    var pixels = new ArrayBuffer(4 * rect.width * rect.height);
    var pixelsBytes = new Uint8Array(pixels);
    var gl = this.device.gl;
    gl.readPixels(rect.x, rect.y, rect.width, rect.height, gl.RGBA, gl.UNSIGNED_BYTE, pixelsBytes);
    var selection = [];
    for(var i = 0;i < rect.width * rect.height;i++) {
      var pixel = new Uint8Array(pixels, i * 4, 4);
      var index = pixel[0] << 16 | pixel[1] << 8 | pixel[2];
      if(index !== 16777215) {
        var selectedMeshInstance = this.scene.drawCalls[index];
        if(selection.indexOf(selectedMeshInstance) === -1) {
          selection.push(selectedMeshInstance)
        }
      }
    }
    return selection
  };
  Picker.prototype.prepare = function(camera, scene) {
    this.scene = scene;
    device = this.device;
    var prevRenderTarget = device.getRenderTarget();
    device.setRenderTarget(this._pickBufferTarget);
    device.updateBegin();
    device.setViewport(0, 0, this._pickBufferTarget.width, this._pickBufferTarget.height);
    device.setScissor(0, 0, this._pickBufferTarget.width, this._pickBufferTarget.height);
    device.clear(this.clearOptions);
    var i;
    var mesh, meshInstance;
    var type;
    var drawCalls = scene.drawCalls;
    var numDrawCalls = drawCalls.length;
    var device = this.device;
    var scope = device.scope;
    var modelMatrixId = scope.resolve("matrix_model");
    var poseMatrixId = scope.resolve("matrix_pose[0]");
    var pickColorId = scope.resolve("uColor");
    var projId = scope.resolve("matrix_projection");
    var viewProjId = scope.resolve("matrix_viewProjection");
    var wtm = camera.getWorldTransform();
    var projMat = camera.getProjectionMatrix();
    var viewMat = wtm.clone().invert();
    var viewProjMat = new pc.Mat4;
    viewProjMat.mul2(projMat, viewMat);
    projId.setValue(projMat.data);
    viewProjId.setValue(viewProjMat.data);
    for(i = 0;i < numDrawCalls;i++) {
      if(!drawCalls[i].command) {
        meshInstance = drawCalls[i];
        mesh = meshInstance.mesh;
        type = mesh.primitive[pc.scene.RENDERSTYLE_SOLID].type;
        if(type === pc.gfx.PRIMITIVE_TRIANGLES || type === pc.gfx.PRIMITIVE_TRISTRIP) {
          modelMatrixId.setValue(meshInstance.node.worldTransform.data);
          if(meshInstance.skinInstance) {
            poseMatrixId.setValue(meshInstance.skinInstance.matrixPalette)
          }
          this.pickColor[0] = (i >> 16 & 255) / 255;
          this.pickColor[1] = (i >> 8 & 255) / 255;
          this.pickColor[2] = (i & 255) / 255;
          this.pickColor[3] = 1;
          pickColorId.setValue(this.pickColor);
          device.setShader(mesh.skin ? this.pickProgSkin : this.pickProgStatic);
          device.setVertexBuffer(mesh.vertexBuffer, 0);
          device.setIndexBuffer(mesh.indexBuffer[pc.scene.RENDERSTYLE_SOLID]);
          device.draw(mesh.primitive[pc.scene.RENDERSTYLE_SOLID])
        }
      }
    }
    device.setViewport(0, 0, device.width, device.height);
    device.setScissor(0, 0, device.width, device.height);
    device.updateEnd();
    device.setRenderTarget(prevRenderTarget)
  };
  Picker.prototype.resize = function(width, height) {
    var colorBuffer = new pc.gfx.Texture(this.device, {format:pc.gfx.PIXELFORMAT_R8_G8_B8_A8, width:width, height:height});
    colorBuffer.minFilter = pc.gfx.FILTER_NEAREST;
    colorBuffer.magFilter = pc.gfx.FILTER_NEAREST;
    colorBuffer.addressU = pc.gfx.ADDRESS_CLAMP_TO_EDGE;
    colorBuffer.addressV = pc.gfx.ADDRESS_CLAMP_TO_EDGE;
    this._pickBufferTarget = new pc.gfx.RenderTarget(this.device, colorBuffer, {depth:true})
  };
  Object.defineProperty(Picker.prototype, "renderTarget", {get:function() {
    return this._pickBufferTarget
  }});
  Object.defineProperty(Picker.prototype, "width", {get:function() {
    return this._pickBufferTarget.width
  }});
  Object.defineProperty(Picker.prototype, "height", {get:function() {
    return this._pickBufferTarget.height
  }});
  return{Picker:Picker}
}());
pc.scene.procedural = {};
pc.scene.procedural.calculateTangents = function(vertices, normals, uvs, indices) {
  var triangleCount = indices.length / 3;
  var vertexCount = vertices.length / 3;
  var i1, i2, i3;
  var x1, x2, y1, y2, z1, z2, s1, s2, t1, t2, r;
  var sdir = new pc.Vec3;
  var tdir = new pc.Vec3;
  var v1 = new pc.Vec3;
  var v2 = new pc.Vec3;
  var v3 = new pc.Vec3;
  var w1 = new pc.Vec2;
  var w2 = new pc.Vec2;
  var w3 = new pc.Vec2;
  var i;
  var tan1 = new Float32Array(vertexCount * 3);
  var tan2 = new Float32Array(vertexCount * 3);
  var tangents = [];
  for(i = 0;i < triangleCount;i++) {
    i1 = indices[i * 3];
    i2 = indices[i * 3 + 1];
    i3 = indices[i * 3 + 2];
    v1.set(vertices[i1 * 3], vertices[i1 * 3 + 1], vertices[i1 * 3 + 2]);
    v2.set(vertices[i2 * 3], vertices[i2 * 3 + 1], vertices[i2 * 3 + 2]);
    v3.set(vertices[i3 * 3], vertices[i3 * 3 + 1], vertices[i3 * 3 + 2]);
    w1.set(uvs[i1 * 2], uvs[i1 * 2 + 1]);
    w2.set(uvs[i2 * 2], uvs[i2 * 2 + 1]);
    w3.set(uvs[i3 * 2], uvs[i3 * 2 + 1]);
    x1 = v2.x - v1.x;
    x2 = v3.x - v1.x;
    y1 = v2.y - v1.y;
    y2 = v3.y - v1.y;
    z1 = v2.z - v1.z;
    z2 = v3.z - v1.z;
    s1 = w2.x - w1.x;
    s2 = w3.x - w1.x;
    t1 = w2.y - w1.y;
    t2 = w3.y - w1.y;
    r = 1 / (s1 * t2 - s2 * t1);
    sdir.set((t2 * x1 - t1 * x2) * r, (t2 * y1 - t1 * y2) * r, (t2 * z1 - t1 * z2) * r);
    tdir.set((s1 * x2 - s2 * x1) * r, (s1 * y2 - s2 * y1) * r, (s1 * z2 - s2 * z1) * r);
    tan1[i1 * 3 + 0] += sdir.x;
    tan1[i1 * 3 + 1] += sdir.y;
    tan1[i1 * 3 + 2] += sdir.z;
    tan1[i2 * 3 + 0] += sdir.x;
    tan1[i2 * 3 + 1] += sdir.y;
    tan1[i2 * 3 + 2] += sdir.z;
    tan1[i3 * 3 + 0] += sdir.x;
    tan1[i3 * 3 + 1] += sdir.y;
    tan1[i3 * 3 + 2] += sdir.z;
    tan2[i1 * 3 + 0] += tdir.x;
    tan2[i1 * 3 + 1] += tdir.y;
    tan2[i1 * 3 + 2] += tdir.z;
    tan2[i2 * 3 + 0] += tdir.x;
    tan2[i2 * 3 + 1] += tdir.y;
    tan2[i2 * 3 + 2] += tdir.z;
    tan2[i3 * 3 + 0] += tdir.x;
    tan2[i3 * 3 + 1] += tdir.y;
    tan2[i3 * 3 + 2] += tdir.z
  }
  t1 = new pc.Vec3;
  t2 = new pc.Vec3;
  var n = new pc.Vec3;
  var temp = new pc.Vec3;
  for(i = 0;i < vertexCount;i++) {
    n.set(normals[i * 3], normals[i * 3 + 1], normals[i * 3 + 2]);
    t1.set(tan1[i * 3], tan1[i * 3 + 1], tan1[i * 3 + 2]);
    t2.set(tan2[i * 3], tan2[i * 3 + 1], tan2[i * 3 + 2]);
    var ndott = n.dot(t1);
    temp.copy(n).scale(ndott);
    temp.sub2(t1, temp).normalize();
    tangents[i * 4] = temp.x;
    tangents[i * 4 + 1] = temp.y;
    tangents[i * 4 + 2] = temp.z;
    temp.cross(n, t1);
    tangents[i * 4 + 3] = temp.dot(t2) < 0 ? -1 : 1
  }
  return tangents
};
pc.scene.procedural.createMesh = function(device, positions, opts) {
  var normals = opts && opts.normals !== undefined ? opts.normals : null;
  var tangents = opts && opts.tangents !== undefined ? opts.tangents : null;
  var uvs = opts && opts.uvs !== undefined ? opts.uvs : null;
  var indices = opts && opts.indices !== undefined ? opts.indices : null;
  var vertexDesc = [{semantic:pc.gfx.SEMANTIC_POSITION, components:3, type:pc.gfx.ELEMENTTYPE_FLOAT32}];
  if(normals !== null) {
    vertexDesc.push({semantic:pc.gfx.SEMANTIC_NORMAL, components:3, type:pc.gfx.ELEMENTTYPE_FLOAT32})
  }
  if(tangents !== null) {
    vertexDesc.push({semantic:pc.gfx.SEMANTIC_TANGENT, components:4, type:pc.gfx.ELEMENTTYPE_FLOAT32})
  }
  if(uvs !== null) {
    vertexDesc.push({semantic:pc.gfx.SEMANTIC_TEXCOORD0, components:2, type:pc.gfx.ELEMENTTYPE_FLOAT32})
  }
  var vertexFormat = new pc.gfx.VertexFormat(device, vertexDesc);
  var numVertices = positions.length / 3;
  var vertexBuffer = new pc.gfx.VertexBuffer(device, vertexFormat, numVertices);
  var iterator = new pc.gfx.VertexIterator(vertexBuffer);
  for(var i = 0;i < numVertices;i++) {
    iterator.element[pc.gfx.SEMANTIC_POSITION].set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
    if(normals !== null) {
      iterator.element[pc.gfx.SEMANTIC_NORMAL].set(normals[i * 3], normals[i * 3 + 1], normals[i * 3 + 2])
    }
    if(tangents !== null) {
      iterator.element[pc.gfx.SEMANTIC_TANGENT].set(tangents[i * 4], tangents[i * 4 + 1], tangents[i * 4 + 2], tangents[i * 4 + 3])
    }
    if(uvs !== null) {
      iterator.element[pc.gfx.SEMANTIC_TEXCOORD0].set(uvs[i * 2], uvs[i * 2 + 1])
    }
    iterator.next()
  }
  iterator.end();
  var indexBuffer = null;
  var indexed = indices !== null;
  if(indexed) {
    indexBuffer = new pc.gfx.IndexBuffer(device, pc.gfx.INDEXFORMAT_UINT16, indices.length);
    var dst = new Uint16Array(indexBuffer.lock());
    dst.set(indices);
    indexBuffer.unlock()
  }
  var aabb = new pc.shape.Aabb;
  aabb.compute(positions);
  var mesh = new pc.scene.Mesh;
  mesh.vertexBuffer = vertexBuffer;
  mesh.indexBuffer[0] = indexBuffer;
  mesh.primitive[0].type = pc.gfx.PRIMITIVE_TRIANGLES;
  mesh.primitive[0].base = 0;
  mesh.primitive[0].count = indexed ? indices.length : numVertices;
  mesh.primitive[0].indexed = indexed;
  mesh.aabb = aabb;
  return mesh
};
pc.scene.procedural.createTorus = function(device, opts) {
  var rc = opts && opts.tubeRadius !== undefined ? opts.tubeRadius : 0.2;
  var rt = opts && opts.ringRadius !== undefined ? opts.ringRadius : 0.3;
  var segments = opts && opts.segments !== undefined ? opts.segments : 30;
  var sides = opts && opts.sides !== undefined ? opts.sides : 20;
  var i, j;
  var x, y, z, nx, ny, nz, u, v;
  var positions = [];
  var normals = [];
  var uvs = [];
  var indices = [];
  for(i = 0;i <= sides;i++) {
    for(j = 0;j <= segments;j++) {
      x = Math.cos(2 * Math.PI * j / segments) * (rt + rc * Math.cos(2 * Math.PI * i / sides));
      y = Math.sin(2 * Math.PI * i / sides) * rc;
      z = Math.sin(2 * Math.PI * j / segments) * (rt + rc * Math.cos(2 * Math.PI * i / sides));
      nx = Math.cos(2 * Math.PI * j / segments) * Math.cos(2 * Math.PI * i / sides);
      ny = Math.sin(2 * Math.PI * i / sides);
      nz = Math.sin(2 * Math.PI * j / segments) * Math.cos(2 * Math.PI * i / sides);
      u = i / sides;
      v = 1 - j / segments;
      positions.push(x, y, z);
      normals.push(nx, ny, nz);
      uvs.push(u, v);
      if(i < sides && j < segments) {
        var first, second, third, fourth;
        first = i * (segments + 1) + j;
        second = (i + 1) * (segments + 1) + j;
        third = i * (segments + 1) + (j + 1);
        fourth = (i + 1) * (segments + 1) + (j + 1);
        indices.push(first, second, third);
        indices.push(second, fourth, third)
      }
    }
  }
  var options = {normals:normals, uvs:uvs, indices:indices};
  if(pc.gfx.precalculatedTangents) {
    options.tangents = pc.scene.procedural.calculateTangents(positions, normals, uvs, indices)
  }
  return pc.scene.procedural.createMesh(device, positions, options)
};
pc.scene.procedural._createConeData = function(baseRadius, peakRadius, height, heightSegments, capSegments, roundedCaps) {
  var i, j;
  var x, y, z, u, v;
  var pos = new pc.Vec3;
  var bottomToTop = new pc.Vec3;
  var norm = new pc.Vec3;
  var top, bottom, tangent;
  var positions = [];
  var normals = [];
  var uvs = [];
  var indices = [];
  var cosTheta, sinTheta;
  var sinPhi, cosPhi;
  var first, second, third, fourth;
  var offset;
  if(height > 0) {
    for(i = 0;i <= heightSegments;i++) {
      for(j = 0;j <= capSegments;j++) {
        theta = j / capSegments * 2 * Math.PI - Math.PI;
        sinTheta = Math.sin(theta);
        cosTheta = Math.cos(theta);
        bottom = new pc.Vec3(sinTheta * baseRadius, -height / 2, cosTheta * baseRadius);
        top = new pc.Vec3(sinTheta * peakRadius, height / 2, cosTheta * peakRadius);
        pos.lerp(bottom, top, i / heightSegments);
        bottomToTop.sub2(top, bottom).normalize();
        tangent = new pc.Vec3(cosTheta, 0, -sinTheta);
        norm.cross(tangent, bottomToTop).normalize();
        positions.push(pos.x, pos.y, pos.z);
        normals.push(norm.x, norm.y, norm.z);
        uvs.push(j / capSegments, i / heightSegments);
        if(i < heightSegments && j < capSegments) {
          first = i * (capSegments + 1) + j;
          second = i * (capSegments + 1) + (j + 1);
          third = (i + 1) * (capSegments + 1) + j;
          fourth = (i + 1) * (capSegments + 1) + (j + 1);
          indices.push(first, second, third);
          indices.push(second, fourth, third)
        }
      }
    }
  }
  if(roundedCaps) {
    var lat, lon;
    var latitudeBands = Math.floor(capSegments / 2);
    var longitudeBands = capSegments;
    var capOffset = height / 2;
    for(lat = 0;lat <= latitudeBands;lat++) {
      theta = lat * Math.PI * 0.5 / latitudeBands;
      sinTheta = Math.sin(theta);
      cosTheta = Math.cos(theta);
      for(lon = 0;lon <= longitudeBands;lon++) {
        phi = lon * 2 * Math.PI / longitudeBands - Math.PI / 2;
        sinPhi = Math.sin(phi);
        cosPhi = Math.cos(phi);
        x = cosPhi * sinTheta;
        y = cosTheta;
        z = sinPhi * sinTheta;
        u = 1 - lon / longitudeBands;
        v = 1 - lat / latitudeBands;
        positions.push(x * peakRadius, y * peakRadius + capOffset, z * peakRadius);
        normals.push(x, y, z);
        uvs.push(u, v)
      }
    }
    offset = (heightSegments + 1) * (capSegments + 1);
    for(lat = 0;lat < latitudeBands;++lat) {
      for(lon = 0;lon < longitudeBands;++lon) {
        first = lat * (longitudeBands + 1) + lon;
        second = first + longitudeBands + 1;
        indices.push(offset + first + 1, offset + second, offset + first);
        indices.push(offset + first + 1, offset + second + 1, offset + second)
      }
    }
    for(lat = 0;lat <= latitudeBands;lat++) {
      theta = Math.PI * 0.5 + lat * Math.PI * 0.5 / latitudeBands;
      sinTheta = Math.sin(theta);
      cosTheta = Math.cos(theta);
      for(lon = 0;lon <= longitudeBands;lon++) {
        phi = lon * 2 * Math.PI / longitudeBands - Math.PI / 2;
        sinPhi = Math.sin(phi);
        cosPhi = Math.cos(phi);
        x = cosPhi * sinTheta;
        y = cosTheta;
        z = sinPhi * sinTheta;
        u = 1 - lon / longitudeBands;
        v = 1 - lat / latitudeBands;
        positions.push(x * peakRadius, y * peakRadius - capOffset, z * peakRadius);
        normals.push(x, y, z);
        uvs.push(u, v)
      }
    }
    offset = (heightSegments + 1) * (capSegments + 1) + (longitudeBands + 1) * (latitudeBands + 1);
    for(lat = 0;lat < latitudeBands;++lat) {
      for(lon = 0;lon < longitudeBands;++lon) {
        first = lat * (longitudeBands + 1) + lon;
        second = first + longitudeBands + 1;
        indices.push(offset + first + 1, offset + second, offset + first);
        indices.push(offset + first + 1, offset + second + 1, offset + second)
      }
    }
  }else {
    offset = (heightSegments + 1) * (capSegments + 1);
    if(baseRadius > 0) {
      for(i = 0;i < capSegments;i++) {
        theta = i / capSegments * 2 * Math.PI;
        x = Math.sin(theta);
        y = -height / 2;
        z = Math.cos(theta);
        u = 1 - (x + 1) / 2;
        v = (z + 1) / 2;
        positions.push(x * baseRadius, y, z * baseRadius);
        normals.push(0, -1, 0);
        uvs.push(u, v);
        if(i > 1) {
          indices.push(offset, offset + i, offset + i - 1)
        }
      }
    }
    offset += capSegments;
    if(peakRadius > 0) {
      for(i = 0;i < capSegments;i++) {
        theta = i / capSegments * 2 * Math.PI;
        x = Math.sin(theta);
        y = height / 2;
        z = Math.cos(theta);
        u = 1 - (x + 1) / 2;
        v = (z + 1) / 2;
        positions.push(x * peakRadius, y, z * peakRadius);
        normals.push(0, 1, 0);
        uvs.push(u, v);
        if(i > 1) {
          indices.push(offset, offset + i - 1, offset + i)
        }
      }
    }
  }
  return{positions:positions, normals:normals, uvs:uvs, indices:indices}
};
pc.scene.procedural.createCylinder = function(device, opts) {
  var baseRadius = opts && opts.baseRadius !== undefined ? opts.baseRadius : 0.5;
  var height = opts && opts.height !== undefined ? opts.height : 1;
  var heightSegments = opts && opts.heightSegments !== undefined ? opts.heightSegments : 5;
  var capSegments = opts && opts.capSegments !== undefined ? opts.capSegments : 20;
  var options = pc.scene.procedural._createConeData(baseRadius, baseRadius, height, heightSegments, capSegments, false);
  if(pc.gfx.precalculatedTangents) {
    options.tangents = pc.scene.procedural.calculateTangents(options.positions, options.normals, options.uvs, options.indices)
  }
  return pc.scene.procedural.createMesh(device, options.positions, options)
};
pc.scene.procedural.createCapsule = function(device, opts) {
  var radius = opts && opts.radius !== undefined ? opts.radius : 0.3;
  var height = opts && opts.height !== undefined ? opts.height : 1;
  var heightSegments = opts && opts.heightSegments !== undefined ? opts.heightSegments : 1;
  var sides = opts && opts.sides !== undefined ? opts.sides : 20;
  var options = pc.scene.procedural._createConeData(radius, radius, height - 2 * radius, heightSegments, sides, true);
  if(pc.gfx.precalculatedTangents) {
    options.tangents = pc.scene.procedural.calculateTangents(options.positions, options.normals, options.uvs, options.indices)
  }
  return pc.scene.procedural.createMesh(device, options.positions, options)
};
pc.scene.procedural.createCone = function(device, opts) {
  var baseRadius = opts && opts.baseRadius !== undefined ? opts.baseRadius : 0.5;
  var peakRadius = opts && opts.peakRadius !== undefined ? opts.peakRadius : 0;
  var height = opts && opts.height !== undefined ? opts.height : 1;
  var heightSegments = opts && opts.heightSegments !== undefined ? opts.heightSegments : 5;
  var capSegments = opts && opts.capSegments !== undefined ? opts.capSegments : 18;
  var options = pc.scene.procedural._createConeData(baseRadius, peakRadius, height, heightSegments, capSegments, false);
  if(pc.gfx.precalculatedTangents) {
    options.tangents = pc.scene.procedural.calculateTangents(options.positions, options.normals, options.uvs, options.indices)
  }
  return pc.scene.procedural.createMesh(device, options.positions, options)
};
pc.scene.procedural.createSphere = function(device, opts) {
  var radius = opts && opts.radius !== undefined ? opts.radius : 0.5;
  var latitudeBands = opts && opts.latitudeBands !== undefined ? opts.latitudeBands : 16;
  var longitudeBands = opts && opts.longitudeBands !== undefined ? opts.longitudeBands : 16;
  var lon, lat;
  var theta, sinTheta, cosTheta, phi, sinPhi, cosPhi;
  var first, second;
  var x, y, z, u, v;
  var positions = [];
  var normals = [];
  var uvs = [];
  var indices = [];
  for(lat = 0;lat <= latitudeBands;lat++) {
    theta = lat * Math.PI / latitudeBands;
    sinTheta = Math.sin(theta);
    cosTheta = Math.cos(theta);
    for(lon = 0;lon <= longitudeBands;lon++) {
      phi = lon * 2 * Math.PI / longitudeBands - Math.PI / 2;
      sinPhi = Math.sin(phi);
      cosPhi = Math.cos(phi);
      x = cosPhi * sinTheta;
      y = cosTheta;
      z = sinPhi * sinTheta;
      u = 1 - lon / longitudeBands;
      v = 1 - lat / latitudeBands;
      positions.push(x * radius, y * radius, z * radius);
      normals.push(x, y, z);
      uvs.push(u, v)
    }
  }
  for(lat = 0;lat < latitudeBands;++lat) {
    for(lon = 0;lon < longitudeBands;++lon) {
      first = lat * (longitudeBands + 1) + lon;
      second = first + longitudeBands + 1;
      indices.push(first + 1, second, first);
      indices.push(first + 1, second + 1, second)
    }
  }
  var options = {normals:normals, uvs:uvs, indices:indices};
  if(pc.gfx.precalculatedTangents) {
    options.tangents = pc.scene.procedural.calculateTangents(positions, normals, uvs, indices)
  }
  return pc.scene.procedural.createMesh(device, positions, options)
};
pc.scene.procedural.createPlane = function(device, opts) {
  var he = opts && opts.halfExtents !== undefined ? opts.halfExtents : new pc.Vec2(0.5, 0.5);
  var ws = opts && opts.widthSegments !== undefined ? opts.widthSegments : 5;
  var ls = opts && opts.lengthSegments !== undefined ? opts.lengthSegments : 5;
  var i, j;
  var x, y, z, u, v;
  var positions = [];
  var normals = [];
  var uvs = [];
  var indices = [];
  for(i = 0;i <= ws;i++) {
    for(j = 0;j <= ls;j++) {
      x = -he.x + 2 * he.x * i / ws;
      y = 0;
      z = -(-he.y + 2 * he.y * j / ls);
      u = i / ws;
      v = j / ls;
      positions.push(x, y, z);
      normals.push(0, 1, 0);
      uvs.push(u, v);
      if(i < ws && j < ls) {
        indices.push(j + i * (ws + 1), j + (i + 1) * (ws + 1), j + i * (ws + 1) + 1);
        indices.push(j + (i + 1) * (ws + 1), j + (i + 1) * (ws + 1) + 1, j + i * (ws + 1) + 1)
      }
    }
  }
  var options = {normals:normals, uvs:uvs, indices:indices};
  if(pc.gfx.precalculatedTangents) {
    options.tangents = pc.scene.procedural.calculateTangents(positions, normals, uvs, indices)
  }
  return pc.scene.procedural.createMesh(device, positions, options)
};
pc.scene.procedural.createBox = function(device, opts) {
  var he = opts && opts.halfExtents !== undefined ? opts.halfExtents : new pc.Vec3(0.5, 0.5, 0.5);
  var ws = opts && opts.widthSegments !== undefined ? opts.widthSegments : 1;
  var ls = opts && opts.lengthSegments !== undefined ? opts.lengthSegments : 1;
  var hs = opts && opts.heightSegments !== undefined ? opts.heightSegments : 1;
  var corners = [new pc.Vec3(-he.x, -he.y, he.z), new pc.Vec3(he.x, -he.y, he.z), new pc.Vec3(he.x, he.y, he.z), new pc.Vec3(-he.x, he.y, he.z), new pc.Vec3(he.x, -he.y, -he.z), new pc.Vec3(-he.x, -he.y, -he.z), new pc.Vec3(-he.x, he.y, -he.z), new pc.Vec3(he.x, he.y, -he.z)];
  var faceAxes = [[0, 1, 3], [4, 5, 7], [3, 2, 6], [1, 0, 4], [1, 4, 2], [5, 0, 6]];
  var faceNormals = [[0, 0, 1], [0, 0, -1], [0, 1, 0], [0, -1, 0], [1, 0, 0], [-1, 0, 0]];
  var sides = {FRONT:0, BACK:1, TOP:2, BOTTOM:3, RIGHT:4, LEFT:5};
  var side, i, j;
  var positions = [];
  var normals = [];
  var uvs = [];
  var indices = [];
  var generateFace = function(side, uSegments, vSegments) {
    var x, y, z, u, v;
    var i, j;
    var offset = positions.length / 3;
    for(i = 0;i <= uSegments;i++) {
      for(j = 0;j <= vSegments;j++) {
        var temp1 = new pc.Vec3;
        var temp2 = new pc.Vec3;
        var temp3 = new pc.Vec3;
        var r = new pc.Vec3;
        temp1.lerp(corners[faceAxes[side][0]], corners[faceAxes[side][1]], i / uSegments);
        temp2.lerp(corners[faceAxes[side][0]], corners[faceAxes[side][2]], j / vSegments);
        temp3.sub2(temp2, corners[faceAxes[side][0]]);
        r.add2(temp1, temp3);
        u = i / uSegments;
        v = j / vSegments;
        positions.push(r.x, r.y, r.z);
        normals.push(faceNormals[side][0], faceNormals[side][1], faceNormals[side][2]);
        uvs.push(u, v);
        if(i < uSegments && j < vSegments) {
          indices.push(offset + j + i * (uSegments + 1), offset + j + (i + 1) * (uSegments + 1), offset + j + i * (uSegments + 1) + 1);
          indices.push(offset + j + (i + 1) * (uSegments + 1), offset + j + (i + 1) * (uSegments + 1) + 1, offset + j + i * (uSegments + 1) + 1)
        }
      }
    }
  };
  generateFace(sides.FRONT, ws, hs);
  generateFace(sides.BACK, ws, hs);
  generateFace(sides.TOP, ws, ls);
  generateFace(sides.BOTTOM, ws, ls);
  generateFace(sides.RIGHT, ls, hs);
  generateFace(sides.LEFT, ls, hs);
  var options = {normals:normals, uvs:uvs, indices:indices};
  if(pc.gfx.precalculatedTangents) {
    options.tangents = pc.scene.procedural.calculateTangents(positions, normals, uvs, indices)
  }
  return pc.scene.procedural.createMesh(device, positions, options)
};
pc.extend(pc.resources, function() {
  var JsonResourceHandler = function() {
  };
  JsonResourceHandler = pc.inherits(JsonResourceHandler, pc.resources.ResourceHandler);
  JsonResourceHandler.prototype.load = function(request, options) {
    var self = this;
    var promise = new pc.promise.Promise(function(resolve, reject) {
      pc.net.http.get(request.canonical, function(response) {
        resolve(response)
      }, {error:function() {
        reject()
      }})
    });
    return promise
  };
  JsonResourceHandler.prototype.open = function(data, request, options) {
    return data
  };
  var JsonRequest = function JsonRequest(identifier) {
  };
  JsonRequest = pc.inherits(JsonRequest, pc.resources.ResourceRequest);
  JsonRequest.prototype.type = "json";
  JsonRequest.prototype.Type = Object;
  return{JsonResourceHandler:JsonResourceHandler, JsonRequest:JsonRequest}
}());
pc.extend(pc.resources, function() {
  var TextResourceHandler = function() {
  };
  TextResourceHandler = pc.inherits(TextResourceHandler, pc.resources.ResourceHandler);
  TextResourceHandler.prototype.load = function(request, options) {
    var self = this;
    var promise = new RSVP.Promise(function(resolve, reject) {
      pc.net.http.get(request.canonical, function(response) {
        resolve(response)
      }, {error:function() {
        reject()
      }})
    });
    return promise
  };
  TextResourceHandler.prototype.open = function(data, request, options) {
    return data
  };
  var TextRequest = function TextRequest(identifier) {
  };
  TextRequest = pc.inherits(TextRequest, pc.resources.ResourceRequest);
  TextRequest.prototype.type = "text";
  TextRequest.prototype.Type = Object;
  return{TextResourceHandler:TextResourceHandler, TextRequest:TextRequest}
}());
pc.extend(pc.resources, function() {
  var ImageResourceHandler = function() {
  };
  ImageResourceHandler = pc.inherits(ImageResourceHandler, pc.resources.ResourceHandler);
  ImageResourceHandler.prototype.load = function(request, options) {
    var self = this;
    var promise = new pc.promise.Promise(function(resolve, reject) {
      var image = new Image;
      image.onload = function() {
        resolve(image)
      };
      image.onerror = function(event) {
        var element = event.srcElement;
        reject(pc.string.format("Error loading Image from: '{0}'", element.src))
      };
      image.src = request.canonical
    });
    return promise
  };
  ImageResourceHandler.prototype.open = function(data, request, options) {
    return data
  };
  var ImageRequest = function ImageRequest(identifier) {
  };
  ImageRequest = pc.inherits(ImageRequest, pc.resources.ResourceRequest);
  ImageRequest.prototype.type = "image";
  ImageRequest.prototype.Type = Image;
  return{ImageResourceHandler:ImageResourceHandler, ImageRequest:ImageRequest}
}());
pc.extend(pc.resources, function() {
  function arrayBufferCopy(src, dst, dstByteOffset, numBytes) {
    dst32Offset = dstByteOffset / 4;
    var tail = numBytes % 4;
    var src32 = new Uint32Array(src.buffer, 0, (numBytes - tail) / 4);
    var dst32 = new Uint32Array(dst.buffer);
    for(var i = 0;i < src32.length;i++) {
      dst32[dst32Offset + i] = src32[i]
    }
    for(var i = numBytes - tail;i < numBytes;i++) {
      dst[dstByteOffset + i] = src[i]
    }
  }
  var TextureResourceHandler = function(device) {
    this._device = device
  };
  TextureResourceHandler = pc.inherits(TextureResourceHandler, pc.resources.ResourceHandler);
  TextureResourceHandler.prototype.load = function(request, options) {
    var identifier = request.canonical;
    var promise = new pc.promise.Promise(function(resolve, reject) {
      var ext = pc.path.getExtension(identifier).toLowerCase();
      if(ext === ".dds" || ext === ".crn") {
        options = options || {};
        options.binary = true;
        options.directory = pc.path.getDirectory(identifier);
        options.crn = ext === ".crn";
        pc.net.http.get(identifier, function(response) {
          resolve(response)
        }, {cache:false})
      }else {
        if(ext === ".jpg" || ext === ".jpeg" || ext === ".gif" || ext === ".png") {
          var image = new Image;
          image.onload = function() {
            resolve(image)
          };
          image.onerror = function(event) {
            var element = event.srcElement;
            reject(pc.string.format("Error loading Texture from: '{0}'", element.src))
          };
          image.src = identifier
        }
      }
    });
    return promise
  };
  TextureResourceHandler.prototype.open = function(data, request, options) {
    var texture;
    if(data instanceof Image) {
      var img = data;
      if(request.result) {
        texture = request.result
      }else {
        texture = new pc.gfx.Texture(this._device, {width:img.width, height:img.height, format:pc.gfx.PIXELFORMAT_R8_G8_B8_A8})
      }
      texture.setSource(img)
    }else {
      if(data instanceof ArrayBuffer) {
        if(options.crn) {
          var srcSize = data.byteLength;
          var bytes = new Uint8Array(data);
          var src = Module._malloc(srcSize);
          arrayBufferCopy(bytes, Module.HEAPU8, src, srcSize);
          var dst = Module._crn_decompress_get_data(src, srcSize);
          var dstSize = Module._crn_decompress_get_size(src, srcSize);
          data = Module.HEAPU8.buffer.slice(dst, dst + dstSize)
        }
        texture = loadDDS(data)
      }
    }
    return texture
  };
  var TextureRequest = function TextureRequest(identifier) {
  };
  TextureRequest = pc.inherits(TextureRequest, pc.resources.ResourceRequest);
  TextureRequest.prototype.type = "texture";
  TextureRequest.prototype.Type = pc.gfx.Texture;
  return{TextureResourceHandler:TextureResourceHandler, TextureRequest:TextureRequest}
}());
pc.extend(pc.resources, function() {
  var jsonToPrimitiveType = {"points":pc.gfx.PRIMITIVE_POINTS, "lines":pc.gfx.PRIMITIVE_LINES, "linestrip":pc.gfx.PRIMITIVE_LINESTRIP, "triangles":pc.gfx.PRIMITIVE_TRIANGLES, "trianglestrip":pc.gfx.PRIMITIVE_TRISTRIP};
  var jsonToVertexElementType = {"int8":pc.gfx.ELEMENTTYPE_INT8, "uint8":pc.gfx.ELEMENTTYPE_UINT8, "int16":pc.gfx.ELEMENTTYPE_INT16, "uint16":pc.gfx.ELEMENTTYPE_UINT16, "int32":pc.gfx.ELEMENTTYPE_INT32, "uint32":pc.gfx.ELEMENTTYPE_UINT32, "float32":pc.gfx.ELEMENTTYPE_FLOAT32};
  var jsonToLightType = {"directional":pc.scene.LIGHTTYPE_DIRECTIONAL, "point":pc.scene.LIGHTTYPE_POINT, "spot":pc.scene.LIGHTTYPE_SPOT};
  var jsonToProjectionType = {"perspective":pc.scene.Projection.PERSPECTIVE, "orthographic":pc.scene.Projection.ORTHOGRAPHIC};
  var ModelResourceHandler = function(device, assetRegistry) {
    this._device = device;
    this._assets = assetRegistry
  };
  ModelResourceHandler = pc.inherits(ModelResourceHandler, pc.resources.ResourceHandler);
  ModelResourceHandler.prototype.load = function(request, options) {
    var self = this;
    if(request.data) {
      var asset;
      var materials = [];
      var mapping = request.data;
      for(var i = 0;i < mapping.length;i++) {
        if(mapping[i].material) {
          asset = this._assets.getAssetByResourceId(mapping[i].material);
          if(asset) {
            materials.push(asset)
          }
        }
      }
    }
    var promise = new pc.promise.Promise(function(resolve, reject) {
      var url = request.canonical;
      options = options || {};
      options.directory = pc.path.getDirectory(url);
      pc.net.http.get(url, function(response) {
        if(materials.length) {
          self._assets.load(materials).then(function() {
            resolve(response)
          })
        }else {
          resolve(response)
        }
      }, {cache:options.cache, error:function(status, xhr, e) {
        reject(pc.string.format("Error loading model: {0} [{1}]", url, status))
      }})
    });
    return promise
  };
  ModelResourceHandler.prototype.open = function(data, request, options) {
    options = options || {};
    options.directory = options.directory || "";
    options.parent = request;
    var model = null;
    if(data.model.version <= 1) {
      logERROR(pc.string.format("Asset: {0}, is an old model format. Upload source assets to re-import.", request.canonical))
    }else {
      if(data.model.version >= 2) {
        model = this._loadModelJson(data, request.data, options)
      }
    }
    return model
  };
  ModelResourceHandler.prototype.clone = function(model) {
    return model.clone()
  };
  ModelResourceHandler.prototype._loadModelJson = function(data, mapping, options) {
    var modelData = data.model;
    var i, j;
    var nodes = [];
    for(i = 0;i < modelData.nodes.length;i++) {
      var nodeData = modelData.nodes[i];
      var node = new pc.scene.GraphNode;
      node.setName(nodeData.name);
      node.setLocalPosition(nodeData.position[0], nodeData.position[1], nodeData.position[2]);
      node.setLocalEulerAngles(nodeData.rotation[0], nodeData.rotation[1], nodeData.rotation[2]);
      node.setLocalScale(nodeData.scale[0], nodeData.scale[1], nodeData.scale[2]);
      nodes.push(node)
    }
    for(i = 1;i < modelData.parents.length;i++) {
      nodes[modelData.parents[i]].addChild(nodes[i])
    }
    if(!this._device.supportsBoneTextures && modelData.skins.length > 0) {
      var boneLimit = this._device.getBoneLimit();
      pc.scene.partitionSkin(modelData, mapping, boneLimit)
    }
    var skins = [];
    var skinInstances = [];
    for(i = 0;i < modelData.skins.length;i++) {
      var skinData = modelData.skins[i];
      var inverseBindMatrices = [];
      for(j = 0;j < skinData.inverseBindMatrices.length;j++) {
        var ibm = skinData.inverseBindMatrices[j];
        inverseBindMatrices[j] = new pc.Mat4(ibm[0], ibm[1], ibm[2], ibm[3], ibm[4], ibm[5], ibm[6], ibm[7], ibm[8], ibm[9], ibm[10], ibm[11], ibm[12], ibm[13], ibm[14], ibm[15])
      }
      var skin = new pc.scene.Skin(this._device, inverseBindMatrices, skinData.boneNames);
      skins.push(skin);
      var skinInstance = new pc.scene.SkinInstance(skin);
      var bones = [];
      for(j = 0;j < skin.boneNames.length;j++) {
        var boneName = skin.boneNames[j];
        var bone = nodes[0].findByName(boneName);
        bones.push(bone)
      }
      skinInstance.bones = bones;
      skinInstances.push(skinInstance)
    }
    var vertexBuffers = [];
    var attribute, attributeName;
    var attributeMap = {position:pc.gfx.SEMANTIC_POSITION, normal:pc.gfx.SEMANTIC_NORMAL, tangent:pc.gfx.SEMANTIC_TANGENT, blendWeight:pc.gfx.SEMANTIC_BLENDWEIGHT, blendIndices:pc.gfx.SEMANTIC_BLENDINDICES, color:pc.gfx.SEMANTIC_COLOR, texCoord0:pc.gfx.SEMANTIC_TEXCOORD0, texCoord1:pc.gfx.SEMANTIC_TEXCOORD1, texCoord2:pc.gfx.SEMANTIC_TEXCOORD2, texCoord3:pc.gfx.SEMANTIC_TEXCOORD3, texCoord4:pc.gfx.SEMANTIC_TEXCOORD4, texCoord5:pc.gfx.SEMANTIC_TEXCOORD5, texCoord6:pc.gfx.SEMANTIC_TEXCOORD6, texCoord7:pc.gfx.SEMANTIC_TEXCOORD7};
    for(i = 0;i < modelData.vertices.length;i++) {
      var vertexData = modelData.vertices[i];
      if(vertexData.position && vertexData.normal && vertexData.texCoord0) {
        var indices = [];
        for(j = 0;j < modelData.meshes.length;j++) {
          if(modelData.meshes[j].vertices === i) {
            indices = indices.concat(modelData.meshes[j].indices)
          }
        }
        tangents = pc.scene.procedural.calculateTangents(vertexData.position.data, vertexData.normal.data, vertexData.texCoord0.data, indices);
        vertexData.tangent = {type:"float32", components:4, data:tangents}
      }
      var formatDesc = [];
      for(attributeName in vertexData) {
        attribute = vertexData[attributeName];
        var attribType = attribute.type;
        if(!this._device.supportsUnsignedByte) {
          if(attribType === "uint8") {
            attribType = "float32"
          }
          if(attribType === "int8") {
            attribType = "float32"
          }
        }
        formatDesc.push({semantic:attributeMap[attributeName], components:attribute.components, type:jsonToVertexElementType[attribType], normalize:false})
      }
      var vertexFormat = new pc.gfx.VertexFormat(this._device, formatDesc);
      var numVertices = vertexData.position.data.length / vertexData.position.components;
      var vertexBuffer = new pc.gfx.VertexBuffer(this._device, vertexFormat, numVertices);
      var iterator = new pc.gfx.VertexIterator(vertexBuffer);
      for(j = 0;j < numVertices;j++) {
        for(attributeName in vertexData) {
          attribute = vertexData[attributeName];
          switch(attribute.components) {
            case 1:
              iterator.element[attributeMap[attributeName]].set(attribute.data[j]);
              break;
            case 2:
              iterator.element[attributeMap[attributeName]].set(attribute.data[j * 2], attribute.data[j * 2 + 1]);
              break;
            case 3:
              iterator.element[attributeMap[attributeName]].set(attribute.data[j * 3], attribute.data[j * 3 + 1], attribute.data[j * 3 + 2]);
              break;
            case 4:
              iterator.element[attributeMap[attributeName]].set(attribute.data[j * 4], attribute.data[j * 4 + 1], attribute.data[j * 4 + 2], attribute.data[j * 4 + 3]);
              break
          }
        }
        iterator.next()
      }
      iterator.end();
      vertexBuffers.push(vertexBuffer)
    }
    var numIndices = 0;
    for(i = 0;i < modelData.meshes.length;i++) {
      var meshData = modelData.meshes[i];
      if(typeof meshData.indices !== "undefined") {
        numIndices += meshData.indices.length
      }
    }
    var indexBuffer = null;
    var indexData = null;
    var indexBase = 0;
    if(numIndices > 0) {
      indexBuffer = new pc.gfx.IndexBuffer(this._device, pc.gfx.INDEXFORMAT_UINT16, numIndices);
      indexData = new Uint16Array(indexBuffer.lock())
    }
    var meshes = [];
    for(i = 0;i < modelData.meshes.length;i++) {
      var meshData = modelData.meshes[i];
      var min = meshData.aabb.min;
      var max = meshData.aabb.max;
      var aabb = new pc.shape.Aabb(new pc.Vec3((max[0] + min[0]) * 0.5, (max[1] + min[1]) * 0.5, (max[2] + min[2]) * 0.5), new pc.Vec3((max[0] - min[0]) * 0.5, (max[1] - min[1]) * 0.5, (max[2] - min[2]) * 0.5));
      var indexed = typeof meshData.indices !== "undefined";
      var mesh = new pc.scene.Mesh;
      mesh.vertexBuffer = vertexBuffers[meshData.vertices];
      mesh.indexBuffer[0] = indexed ? indexBuffer : null;
      mesh.primitive[0].type = jsonToPrimitiveType[meshData.type];
      mesh.primitive[0].base = indexed ? meshData.base + indexBase : meshData.base;
      mesh.primitive[0].count = meshData.count;
      mesh.primitive[0].indexed = indexed;
      mesh.skin = typeof meshData.skin !== "undefined" ? skins[meshData.skin] : null;
      mesh.aabb = aabb;
      if(indexed) {
        indexData.set(meshData.indices, indexBase);
        indexBase += meshData.indices.length
      }
      meshes.push(mesh)
    }
    if(numIndices > 0) {
      indexBuffer.unlock()
    }
    var meshInstances = [];
    var defaultMaterial = new pc.scene.PhongMaterial;
    for(i = 0;i < modelData.meshInstances.length;i++) {
      var meshInstanceData = modelData.meshInstances[i];
      var node = nodes[meshInstanceData.node];
      var mesh = meshes[meshInstanceData.mesh];
      var material = this._getMaterial(i, mapping, options);
      if(!material) {
        material = defaultMaterial
      }
      var meshInstance = new pc.scene.MeshInstance(node, mesh, material);
      if(mesh.skin) {
        var skinIndex = skins.indexOf(mesh.skin);
        if(skinIndex === -1) {
          throw new Error("Mesh's skin does not appear in skin array.");
        }
        meshInstance.skinInstance = skinInstances[skinIndex]
      }
      meshInstances.push(meshInstance)
    }
    var model = new pc.scene.Model;
    model.graph = nodes[0];
    model.meshInstances = meshInstances;
    model.skinInstances = skinInstances;
    model.getGraph().syncHierarchy();
    var meshInstances = model.meshInstances;
    for(i = 0;i < meshInstances.length;i++) {
      meshInstances[i].syncAabb()
    }
    return model
  };
  ModelResourceHandler.prototype._getMaterial = function(meshInstanceIndex, mapping, options) {
    var material;
    if(mapping && mapping.length > meshInstanceIndex) {
      if(mapping[meshInstanceIndex].material) {
        var asset = this._assets.getAssetByResourceId(mapping[meshInstanceIndex].material);
        if(!asset) {
          console.error("Reference to material not in asset list. Try reloading.");
          return null
        }else {
          if(!asset.resource) {
            console.error(pc.string.format("Material asset '{0}' is not loaded.", asset.name));
            return null
          }
        }
        material = asset.resource
      }else {
        if(mapping[meshInstanceIndex].path) {
          var path = pc.path.split(options.parent.canonical)[0];
          path = pc.path.join(path, mapping[meshInstanceIndex].path);
          var asset = this._assets.getAssetByUrl(path);
          if(asset) {
            material = asset.resource
          }
        }
      }
    }
    return material
  };
  var ModelRequest = function ModelRequest(identifier) {
  };
  ModelRequest = pc.inherits(ModelRequest, pc.resources.ResourceRequest);
  ModelRequest.prototype.type = "model";
  ModelRequest.prototype.Type = pc.scene.Model;
  return{ModelResourceHandler:ModelResourceHandler, ModelRequest:ModelRequest}
}());
pc.extend(pc.resources, function() {
  var jsonToAddressMode = {"repeat":pc.gfx.ADDRESS_REPEAT, "clamp":pc.gfx.ADDRESS_CLAMP_TO_EDGE, "mirror":pc.gfx.ADDRESS_MIRRORED_REPEAT};
  var jsonToFilterMode = {"nearest":pc.gfx.FILTER_NEAREST, "linear":pc.gfx.FILTER_LINEAR, "nearest_mip_nearest":pc.gfx.FILTER_NEAREST_MIPMAP_NEAREST, "linear_mip_nearest":pc.gfx.FILTER_LINEAR_MIPMAP_NEAREST, "nearest_mip_linear":pc.gfx.FILTER_NEAREST_MIPMAP_LINEAR, "linear_mip_linear":pc.gfx.FILTER_LINEAR_MIPMAP_LINEAR};
  var MaterialResourceHandler = function(device, assets) {
    this._assets = assets;
    this._device = device
  };
  MaterialResourceHandler = pc.inherits(MaterialResourceHandler, pc.resources.ResourceHandler);
  MaterialResourceHandler.prototype.load = function(request, options) {
    var promise = null;
    if(pc.string.startsWith(request.canonical, "asset://")) {
      promise = new pc.promise.Promise(function(resolve, reject) {
        var asset = this._getAssetFromRequest(request);
        if(!asset) {
          reject(pc.string("Can't load material, asset %s not found", request.canonical))
        }
        resolve(asset.data)
      }.bind(this))
    }else {
      promise = new pc.promise.Promise(function(resolve, reject) {
        pc.net.http.get(request.canonical, function(response) {
          if(response.mapping_format === "path") {
            var textures = this._listTextures(response);
            var assets = [];
            if(textures.length) {
              textures.forEach(function(texturePath) {
                var filename = pc.path.getBasename(texturePath);
                var textureUrl = pc.path.join(pc.path.split(request.canonical)[0], texturePath);
                assets.push(new pc.asset.Asset(filename, "texture", {url:textureUrl}))
              });
              this._assets.load(assets).then(function(responses) {
                resolve(response)
              })
            }else {
              resolve(response)
            }
          }else {
            resolve(response)
          }
        }.bind(this), {error:function() {
          reject()
        }})
      }.bind(this))
    }
    return promise
  };
  MaterialResourceHandler.prototype.open = function(data, request, options) {
    var material = new pc.scene.PhongMaterial;
    this._updatePhongMaterial(material, data, request);
    var asset = this._getAssetFromRequest(request);
    asset.on("change", function(asset, attribute, value) {
      if(attribute === "data") {
        this._updatePhongMaterial(material, value)
      }
    }, this);
    return material
  };
  MaterialResourceHandler.prototype._listTextures = function(data) {
    var i, n = data.parameters.length;
    var param;
    var textures = [];
    for(i = 0;i < n;i++) {
      param = data.parameters[i];
      if(param.type === "texture" && param.data) {
        textures.push(param.data)
      }
    }
    return textures
  };
  MaterialResourceHandler.prototype._updatePhongMaterial = function(material, data, request) {
    for(var i = 0;i < data.parameters.length;i++) {
      var param = data.parameters[i];
      if(param.type === "texture" && param.data && !(param.data instanceof pc.gfx.Texture)) {
        param.data = this._loadTexture(param.data, request)
      }
    }
    material.init(data)
  };
  MaterialResourceHandler.prototype._loadTexture = function(textureId, request) {
    var asset = this._assets.getAssetByResourceId(textureId);
    if(!asset) {
      var url = pc.path.join(pc.path.split(request.canonical)[0], textureId);
      asset = this._assets.getAssetByUrl(url)
    }
    if(!asset) {
      return null
    }
    if(asset.resource) {
      return asset.resource
    }
    var url = asset.getFileUrl();
    if(!url) {
      return null
    }
    var textureData = asset.data;
    var texture = this._assets.loader.getFromCache(url);
    if(!texture) {
      var texture = new pc.gfx.Texture(this._device, {format:pc.gfx.PIXELFORMAT_R8_G8_B8_A8});
      texture.name = textureData.name;
      texture.addressU = jsonToAddressMode[textureData.addressu];
      texture.addressV = jsonToAddressMode[textureData.addressv];
      texture.magFilter = jsonToFilterMode[textureData.magfilter];
      texture.minFilter = jsonToFilterMode[textureData.minfilter]
    }
    this._assets.load([asset], [texture], {});
    return texture
  };
  MaterialResourceHandler.prototype._getAssetFromRequest = function(request) {
    if(pc.string.startsWith(request.canonical, "asset://")) {
      return this._assets.getAssetByResourceId(request.canonical.slice(8))
    }else {
      return this._assets.getAssetByUrl(request.canonical)
    }
  };
  var MaterialRequest = function MaterialRequest(identifier) {
  };
  MaterialRequest = pc.inherits(MaterialRequest, pc.resources.ResourceRequest);
  MaterialRequest.prototype.type = "material";
  MaterialRequest.prototype.Type = pc.scene.Material;
  return{MaterialRequest:MaterialRequest, MaterialResourceHandler:MaterialResourceHandler}
}());
pc.anim = {};
pc.anim.Key = function Key(time, position, rotation, scale) {
  this.time = time;
  this.position = position;
  this.rotation = rotation;
  this.scale = scale
};
pc.anim.Node = function Node() {
  this._name = "";
  this._keys = []
};
pc.extend(pc.anim, function() {
  var Animation = function Animation() {
    this._name = "";
    this._duration = 0;
    this._nodes = [];
    this._nodeDict = {}
  };
  Animation.prototype.getDuration = function() {
    return this._duration
  };
  Animation.prototype.getName = function() {
    return this._name
  };
  Animation.prototype.getNode = function(name) {
    return this._nodeDict[name]
  };
  Animation.prototype.getNodes = function() {
    return this._nodes
  };
  Animation.prototype.setDuration = function(duration) {
    this._duration = duration
  };
  Animation.prototype.setName = function(name) {
    this._name = name
  };
  Animation.prototype.addNode = function(node) {
    this._nodes.push(node);
    this._nodeDict[node._name] = node
  };
  return{Animation:Animation}
}());
pc.extend(pc.anim, function() {
  function InterpolatedKey() {
    this._written = false;
    this._name = "";
    this._keyFrames = [];
    this._quat = new pc.Quat;
    this._pos = new pc.Vec3;
    this._scale = new pc.Vec3;
    this._targetNode = null
  }
  InterpolatedKey.prototype = {getTarget:function() {
    return this._targetNode
  }, setTarget:function(node) {
    this._targetNode = node
  }};
  var Skeleton = function Skeleton(graph) {
    this._animation = null;
    this._time = 0;
    this.looping = true;
    this._interpolatedKeys = [];
    this._interpolatedKeyDict = {};
    this._currKeyIndices = {};
    this.graph = null;
    var self = this;
    function addInterpolatedKeys(node) {
      var name = node.getName();
      var interpKey = new InterpolatedKey;
      interpKey._name = name;
      self._interpolatedKeys.push(interpKey);
      self._interpolatedKeyDict[name] = interpKey;
      self._currKeyIndices[name] = 0;
      var children = node.getChildren();
      for(var i = 0;i < children.length;i++) {
        addInterpolatedKeys(children[i])
      }
    }
    addInterpolatedKeys(graph)
  };
  Skeleton.prototype.addTime = function(delta) {
    if(this._animation !== null) {
      if(this._time === duration && !this.looping) {
        return
      }
      var i;
      var node, nodeName;
      var keys, interpKey;
      var k1, k2, alpha;
      var nodes = this._animation.getNodes();
      this._time += delta;
      var duration = this._animation.getDuration();
      if(this._time > duration) {
        this._time = this.looping ? 0 : duration;
        for(i = 0;i < nodes.length;i++) {
          node = nodes[i];
          nodeName = node._name;
          this._currKeyIndices[nodeName] = 0
        }
      }
      for(i = 0;i < nodes.length;i++) {
        node = nodes[i];
        nodeName = node._name;
        keys = node._keys;
        interpKey = this._interpolatedKeyDict[nodeName];
        if(keys.length === 1) {
          interpKey._pos.copy(keys[0].position);
          interpKey._quat.copy(keys[0].rotation);
          interpKey._scale(keys[0].scale)
        }else {
          for(var currKeyIndex = this._currKeyIndices[nodeName];currKeyIndex < keys.length - 1;currKeyIndex++) {
            k1 = keys[currKeyIndex];
            k2 = keys[currKeyIndex + 1];
            if(k1.time <= this._time && k2.time >= this._time) {
              alpha = (this._time - k1.time) / (k2.time - k1.time);
              interpKey._pos.lerp(k1.position, k2.position, alpha);
              interpKey._quat.slerp(k1.rotation, k2.rotation, alpha);
              interpKey._scale.lerp(k1.scale, k2.scale, alpha);
              interpKey._written = true;
              this._currKeyIndices[nodeName] = currKeyIndex;
              continue
            }
          }
        }
      }
    }
  };
  Skeleton.prototype.blend = function(skel1, skel2, alpha) {
    var numNodes = this._interpolatedKeys.length;
    for(var i = 0;i < numNodes;i++) {
      var key1 = skel1._interpolatedKeys[i];
      var key2 = skel2._interpolatedKeys[i];
      var dstKey = this._interpolatedKeys[i];
      if(key1._written && key2._written) {
        dstKey._quat.slerp(key1._quat, skel2._interpolatedKeys[i]._quat, alpha);
        dstKey._pos.lerp(key1._pos, skel2._interpolatedKeys[i]._pos, alpha);
        dstKey._scale.lerp(key1._scale, key2._scale, alpha);
        dstKey._written = true
      }else {
        if(key1._written) {
          dstKey._quat.copy(key1._quat);
          dstKey._pos.copy(key1._pos);
          dstKey._scale.copy(key1._scale);
          dstKey._written = true
        }else {
          if(key2._written) {
            dstKey._quat.copy(key2._quat);
            dstKey._pos.copy(key2._pos);
            dstKey._scale.copy(key2._scale);
            dstKey._written = true
          }
        }
      }
    }
  };
  Skeleton.prototype.getAnimation = function() {
    return this._animation
  };
  Skeleton.prototype.getCurrentTime = function() {
    return this._time
  };
  Skeleton.prototype.setCurrentTime = function(time) {
    this._time = time;
    var numNodes = this._interpolatedKeys.length;
    for(var i = 0;i < numNodes;i++) {
      var node = this._interpolatedKeys[i];
      var nodeName = node._name;
      this._currKeyIndices[nodeName] = 0
    }
    this.addTime(0);
    this.updateGraph()
  };
  Skeleton.prototype.getNumNodes = function() {
    return this._interpolatedKeys.length
  };
  Skeleton.prototype.setAnimation = function(animation) {
    this._animation = animation;
    this.setCurrentTime(0)
  };
  Skeleton.prototype.setGraph = function(graph) {
    var i;
    this.graph = graph;
    if(graph) {
      for(i = 0;i < this._interpolatedKeys.length;i++) {
        var interpKey = this._interpolatedKeys[i];
        var graphNode = graph.findByName(interpKey._name);
        this._interpolatedKeys[i].setTarget(graphNode)
      }
    }else {
      for(i = 0;i < this._interpolatedKeys.length;i++) {
        this._interpolatedKeys[i].setTarget(null)
      }
    }
  };
  Skeleton.prototype.updateGraph = function() {
    if(this.graph) {
      for(var i = 0;i < this._interpolatedKeys.length;i++) {
        var interpKey = this._interpolatedKeys[i];
        if(interpKey._written) {
          var transform = interpKey.getTarget();
          transform.localPosition.copy(interpKey._pos);
          transform.localRotation.copy(interpKey._quat);
          transform.localScale.copy(interpKey._scale);
          transform.dirtyLocal = true;
          interpKey._written = false
        }
      }
    }
  };
  Skeleton.prototype.setLooping = function(looping) {
    this.looping = looping
  };
  Skeleton.prototype.getLooping = function() {
    return this.looping
  };
  return{Skeleton:Skeleton}
}());
pc.extend(pc.resources, function() {
  var AnimationResourceHandler = function() {
  };
  AnimationResourceHandler = pc.inherits(AnimationResourceHandler, pc.resources.ResourceHandler);
  AnimationResourceHandler.prototype.load = function(request, options) {
    var promise = new pc.promise.Promise(function(resolve, reject) {
      var url = request.canonical;
      var dir = pc.path.getDirectory(url);
      pc.net.http.get(url, function(response) {
        try {
          resolve(response)
        }catch(e) {
          reject(pc.string.format("An error occured while loading animation from: '{0}'", url))
        }
      }.bind(this), {cache:options.cache, error:function(errors) {
        reject(errors)
      }})
    });
    return promise
  };
  AnimationResourceHandler.prototype.open = function(data, request, options) {
    return this["_loadAnimationV" + data.animation.version](data)
  };
  AnimationResourceHandler.prototype._loadAnimationV3 = function(data) {
    var animData = data.animation;
    var anim = new pc.anim.Animation;
    anim.setName(animData.name);
    anim.setDuration(animData.duration);
    for(var i = 0;i < animData.nodes.length;i++) {
      var node = new pc.anim.Node;
      var n = animData.nodes[i];
      node._name = n.name;
      for(var j = 0;j < n.keys.length;j++) {
        var k = n.keys[j];
        var t = k.time;
        var p = k.pos;
        var r = k.rot;
        var s = k.scale;
        var pos = new pc.Vec3(p[0], p[1], p[2]);
        var rot = (new pc.Quat).setFromEulerAngles(r[0], r[1], r[2]);
        var scl = new pc.Vec3(s[0], s[1], s[2]);
        var key = new pc.anim.Key(t, pos, rot, scl);
        node._keys.push(key)
      }
      anim.addNode(node)
    }
    return anim
  };
  AnimationResourceHandler.prototype._loadAnimationV4 = function(data) {
    var animData = data.animation;
    var anim = new pc.anim.Animation;
    anim.setName(animData.name);
    anim.setDuration(animData.duration);
    for(var i = 0;i < animData.nodes.length;i++) {
      var node = new pc.anim.Node;
      var n = animData.nodes[i];
      node._name = n.name;
      var defPos = n.defaults.p;
      var defRot = n.defaults.r;
      var defScl = n.defaults.s;
      for(var j = 0;j < n.keys.length;j++) {
        var k = n.keys[j];
        var t = k.t;
        var p = defPos ? defPos : k.p;
        var r = defRot ? defRot : k.r;
        var s = defScl ? defScl : k.s;
        var pos = new pc.Vec3(p[0], p[1], p[2]);
        var rot = (new pc.Quat).setFromEulerAngles(r[0], r[1], r[2]);
        var scl = new pc.Vec3(s[0], s[1], s[2]);
        var key = new pc.anim.Key(t, pos, rot, scl);
        node._keys.push(key)
      }
      anim.addNode(node)
    }
    return anim
  };
  var AnimationRequest = function AnimationRequest(identifier) {
  };
  AnimationRequest = pc.inherits(AnimationRequest, pc.resources.ResourceRequest);
  AnimationRequest.prototype.type = "animation";
  AnimationRequest.prototype.Type = pc.anim.Animation;
  return{AnimationResourceHandler:AnimationResourceHandler, AnimationRequest:AnimationRequest}
}());
pc.audio = function() {
  var AudioManager = function() {
    if(pc.audio.hasAudioContext()) {
      if(typeof AudioContext !== "undefined") {
        this.context = new AudioContext
      }else {
        if(typeof webkitAudioContext !== "undefined") {
          this.context = new webkitAudioContext
        }
      }
    }
    this.listener = new pc.audio.Listener(this);
    this.volume = 1;
    this.suspended = false;
    pc.events.attach(this)
  };
  AudioManager.prototype = {createSound:function(url, success, error) {
    var sound = null;
    if(pc.audio.Sound) {
      sound = new pc.audio.Sound(this, url, success, error)
    }else {
      error()
    }
    return sound
  }, playSound:function(sound, options) {
    options = options || {};
    var channel = null;
    if(pc.audio.Channel) {
      channel = new pc.audio.Channel(this, sound, options);
      channel.play()
    }
    return channel
  }, playSound3d:function(sound, position, options) {
    options = options || {};
    var channel = null;
    if(pc.audio.Channel3d) {
      channel = new pc.audio.Channel3d(this, sound, options);
      channel.setPosition(position);
      if(options.volume) {
        channel.setVolume(options.volume)
      }
      if(options.loop) {
        channel.setLoop(options.loop)
      }
      if(options.maxDistance) {
        channel.setMaxDistance(options.maxDistance)
      }
      if(options.minDistance) {
        channel.setMinDistance(options.minDistance)
      }
      if(options.rollOffFactor) {
        channel.setRollOffFactor(options.rollOffFactor)
      }
      channel.play()
    }
    return channel
  }, getListener:function() {
    return this.listener
  }, getVolume:function() {
    return this.volume
  }, setVolume:function(volume) {
    this.volume = volume;
    this.fire("volumechange", volume)
  }, suspend:function() {
    this.suspended = true;
    this.fire("suspend")
  }, resume:function() {
    this.suspended = false;
    this.fire("resume")
  }};
  return{AudioManager:AudioManager, hasAudio:function() {
    return typeof Audio !== "undefined"
  }, hasAudioContext:function() {
    return!!(typeof AudioContext !== "undefined" || typeof webkitAudioContext !== "undefined")
  }, isSupported:function(url, audio) {
    var toMIME = {".ogg":"audio/ogg", ".mp3":"audio/mpeg", ".wav":"audio/x-wav"};
    var ext = pc.path.getExtension(url);
    if(toMIME[ext]) {
      if(!audio) {
        audio = new Audio
      }
      return audio.canPlayType(toMIME[ext]) !== ""
    }else {
      return false
    }
  }}
}();
pc.extend(pc.audio, function() {
  var Sound;
  if(pc.audio.hasAudioContext()) {
    Sound = function(manager, url, success, error) {
      this.buffer = null;
      this.isLoaded = false;
      if(!pc.audio.isSupported(url, this.audio)) {
        setTimeout(function() {
          error(pc.string.format("Audio format for {0} not supported", url))
        }, 0)
      }else {
        if(manager.context) {
          pc.net.http.get(url, function(response) {
            manager.context.decodeAudioData(response, function(buffer) {
              this.buffer = buffer;
              this.isLoaded = true;
              success(this)
            }.bind(this), error)
          }.bind(this), {error:error})
        }
      }
    }
  }else {
    if(pc.audio.hasAudio()) {
      Sound = function(manager, url, success, error) {
        this.isLoaded = false;
        this.audio = new Audio;
        if(!pc.audio.isSupported(url, this.audio)) {
          setTimeout(function() {
            error(pc.string.format("Audio format for {0} not supported", url))
          }, 0);
          this.audio = null;
          return
        }
        this.audio.addEventListener("stalled", function() {
          logDEBUG("stalled: " + this.audio.src)
        }.bind(this), false);
        this.audio.addEventListener("suspend", function() {
          logDEBUG("suspend: " + this.audio.src)
        }.bind(this), false);
        this.audio.addEventListener("abort", function() {
          logDEBUG("abort: " + this.audio.src)
        }.bind(this), false);
        this.audio.addEventListener("pause", function() {
          logDEBUG("pause: " + this.audio.src)
        }.bind(this), false);
        this.audio.addEventListener("canplay", function() {
          logDEBUG("canplay: " + this.audio.src)
        }.bind(this), false);
        this.audio.addEventListener("progress", function() {
          logDEBUG("progress " + url)
        }.bind(this));
        this.audio.addEventListener("loadstart", function() {
          logDEBUG("loadstart: " + this.audio.src);
          if(!this.isLoaded) {
            this.isLoaded = true;
            success(this)
          }
        }.bind(this), false);
        this.audio.addEventListener("canplaythrough", function() {
          logDEBUG("canplaythrough: " + this.audio.src);
          if(!this.isLoaded) {
            this.isLoaded = true;
            success(this)
          }
        }.bind(this), false);
        this.audio.addEventListener("loadeddata", function() {
          logDEBUG("loadeddata: " + url);
          if(!this.isLoaded) {
            this.isLoaded = true;
            success(this)
          }
        }.bind(this), false);
        this.audio.addEventListener("error", function(e) {
          logERROR("error loading: " + url);
          error(pc.string.format("Error loading Sound from: '{0}'", url))
        }.bind(this), false);
        this.audio.src = url;
        logDEBUG("loading: " + url)
      }
    }
  }
  return{Sound:Sound}
}());
pc.extend(pc.audio, function() {
  var Listener;
  if(pc.audio.hasAudioContext()) {
    Listener = function(manager) {
      this.position = new pc.Vec3;
      this.velocity = new pc.Vec3;
      this.orientation = new pc.Mat4;
      this.listener = manager.context.listener
    };
    Listener.prototype.getPosition = function() {
      return this.position
    };
    Listener.prototype.setPosition = function(position) {
      this.position.copy(position);
      this.listener.setPosition(position.x, position.y, position.z)
    };
    Listener.prototype.getVelocity = function() {
      return this.velocity
    };
    Listener.prototype.setVelocity = function(velocity) {
      this.velocity.copy(velocity);
      this.listener.setPosition(velocity.x, velocity.y, velocity.z)
    };
    Listener.prototype.setOrientation = function(orientation) {
      this.orientation.copy(orientation);
      this.listener.setOrientation(-orientation.data[8], -orientation.data[9], -orientation.data[10], orientation.data[4], orientation.data[5], orientation.data[6])
    };
    Listener.prototype.getOrientation = function() {
      return this.orientation
    }
  }else {
    Listener = function(manager) {
      this.position = new pc.Vec3;
      this.velocity = new pc.Vec3;
      this.orientation = new pc.Mat4
    };
    Listener.prototype.getPosition = function() {
      return this.position
    };
    Listener.prototype.setPosition = function(position) {
      this.position.copy(position)
    };
    Listener.prototype.getVelocity = function() {
      return this.velocity
    };
    Listener.prototype.setVelocity = function(velocity) {
      this.velocity.copy(velocity)
    };
    Listener.prototype.setOrientation = function(orientation) {
      this.orientation.copy(orientation)
    };
    Listener.prototype.getOrientation = function() {
      return this.orientation
    }
  }
  return{Listener:Listener}
}());
pc.extend(pc.audio, function() {
  var Channel;
  if(pc.audio.hasAudioContext()) {
    Channel = function(manager, sound, options) {
      options = options || {};
      this.volume = typeof options.volume === "undefined" ? 1 : options.volume;
      this.loop = typeof options.loop === "undefined" ? false : options.loop;
      this.pitch = typeof options.pitch === "undefined" ? 1 : options.pitch;
      this.sound = sound;
      this.paused = false;
      this.suspended = false;
      this.startTime = 0;
      this.startOffset = 0;
      this.manager = manager;
      this.source = null;
      var context = manager.context;
      this.gain = context.createGain()
    };
    Channel.prototype = {play:function() {
      if(this.source) {
        throw new Error("Call stop() before calling play()");
      }
      this._createSource();
      this.setVolume(this.volume);
      this.setLoop(this.loop);
      this.setPitch(this.pitch);
      this.startTime = this.manager.context.currentTime;
      this.source.start(0, this.startOffset % this.source.buffer.duration);
      this.manager.on("volumechange", this.onManagerVolumeChange, this);
      this.manager.on("suspend", this.onManagerSuspend, this);
      this.manager.on("resume", this.onManagerResume, this)
    }, pause:function() {
      if(this.source) {
        this.paused = true;
        this.startOffset += this.manager.context.currentTime - this.startTime;
        this.source.stop(0);
        this.source = null
      }
    }, unpause:function() {
      if(this.source || !this.paused) {
        throw new Error("Call pause() before unpausing.");
      }
      this._createSource();
      this.setVolume(this.volume);
      this.setLoop(this.loop);
      this.setPitch(this.pitch);
      this.startTime = this.manager.context.currentTime;
      this.source.start(0, this.startOffset % this.source.buffer.duration);
      this.paused = false
    }, stop:function() {
      if(this.source) {
        this.source.stop(0);
        this.source = null
      }
      this.manager.off("volumechange", this.onManagerVolumeChange, this);
      this.manager.off("suspend", this.onManagerSuspend, this);
      this.manager.off("resume", this.onManagerResume, this)
    }, setLoop:function(loop) {
      this.loop = loop;
      if(this.source) {
        this.source.loop = loop
      }
    }, setVolume:function(volume) {
      this.volume = volume;
      if(this.gain) {
        this.gain.gain.value = volume * this.manager.getVolume()
      }
    }, setPitch:function(pitch) {
      this.pitch = pitch;
      if(this.source) {
        this.source.playbackRate.value = pitch
      }
    }, isPlaying:function() {
      return!this.paused && this.source.playbackState === this.source.PLAYING_STATE
    }, getDuration:function() {
      if(this.source) {
        return this.source.buffer.duration
      }else {
        return 0
      }
    }, _createSource:function() {
      var context = this.manager.context;
      this.source = context.createBufferSource();
      this.source.buffer = this.sound.buffer;
      this.source.connect(this.gain);
      this.gain.connect(context.destination)
    }}
  }else {
    if(pc.audio.hasAudio()) {
      Channel = function(manager, sound, options) {
        this.volume = options.volume || 1;
        this.loop = options.loop || false;
        this.sound = sound;
        this.pitch = typeof options.pitch !== "undefined" ? options.pitch : 1;
        this.paused = false;
        this.suspended = false;
        this.manager = manager;
        this.source = sound.audio.cloneNode(false);
        this.source.pause()
      };
      Channel.prototype = {play:function() {
        if(this.source) {
          this.paused = false;
          this.setVolume(this.volume);
          this.setLoop(this.loop);
          this.setPitch(this.pitch);
          this.source.play()
        }
        this.manager.on("volumechange", this.onManagerVolumeChange, this);
        this.manager.on("suspend", this.onManagerSuspend, this);
        this.manager.on("resume", this.onManagerResume, this)
      }, pause:function() {
        if(this.source) {
          this.paused = true;
          this.source.pause()
        }
      }, unpause:function() {
        if(this.source) {
          this.paused = false;
          this.source.play()
        }
      }, stop:function() {
        if(this.source) {
          this.source.pause();
          this.source.currentTime = 0
        }
        this.manager.off("volumechange", this.onManagerVolumeChange, this);
        this.manager.off("suspend", this.onManagerSuspend, this);
        this.manager.off("resume", this.onManagerResume, this)
      }, setVolume:function(volume) {
        this.volume = volume;
        if(this.source) {
          this.source.volume = volume * this.manager.getVolume()
        }
      }, setLoop:function(loop) {
        this.loop = loop;
        if(this.source) {
          this.source.loop = loop
        }
      }, setPitch:function(pitch) {
        this.pitch = pitch;
        if(this.source) {
          this.source.playbackRate = pitch
        }
      }, getDuration:function() {
        if(this.source) {
          var d = this.source.duration;
          if(d === d) {
            return d
          }
        }
        return 0
      }, isPlaying:function() {
        return!this.source.paused
      }}
    }else {
      console.warn("No support for 2D audio found");
      Channel = function() {
      }
    }
  }
  pc.extend(Channel.prototype, {getVolume:function() {
    return this.volume
  }, getLoop:function() {
    return this.loop
  }, getPitch:function() {
    return this.pitch
  }, onManagerVolumeChange:function() {
    this.setVolume(this.getVolume())
  }, onManagerSuspend:function() {
    if(this.isPlaying() && !this.suspended) {
      this.suspended = true;
      this.pause()
    }
  }, onManagerResume:function() {
    if(this.suspended) {
      this.suspended = false;
      this.unpause()
    }
  }});
  return{Channel:Channel}
}());
pc.extend(pc.audio, function() {
  var MAX_DISTANCE = 1E4;
  var Channel3d;
  if(pc.audio.hasAudioContext()) {
    Channel3d = function(manager, sound, options) {
      this.position = new pc.Vec3;
      this.velocity = new pc.Vec3;
      var context = manager.context;
      this.panner = context.createPanner()
    };
    Channel3d = pc.inherits(Channel3d, pc.audio.Channel);
    Channel3d.prototype = pc.extend(Channel3d.prototype, {getPosition:function() {
      return this.position
    }, setPosition:function(position) {
      this.position.copy(position);
      this.panner.setPosition(position.x, position.y, position.z)
    }, getVelocity:function() {
      return this.velocity
    }, setVelocity:function(velocity) {
      this.velocity.copy(velocity);
      this.panner.setVelocity(velocity.x, velocity.y, velocity.z)
    }, getMaxDistance:function() {
      return this.panner.maxDistance
    }, setMaxDistance:function(max) {
      this.panner.maxDistance = max
    }, getMinDistance:function() {
      return this.panner.refDistance
    }, setMinDistance:function(min) {
      this.panner.refDistance = min
    }, getRollOffFactor:function() {
      return this.panner.rolloffFactor
    }, setRollOffFactor:function(factor) {
      this.panner.rolloffFactor = factor
    }, _createSource:function() {
      var context = this.manager.context;
      this.source = context.createBufferSource();
      this.source.buffer = this.sound.buffer;
      this.source.connect(this.panner);
      this.panner.connect(this.gain);
      this.gain.connect(context.destination)
    }})
  }else {
    if(pc.audio.hasAudio()) {
      var offset = new pc.Vec3;
      var distance;
      var fallOff = function(posOne, posTwo, refDistance, maxDistance, rolloffFactor) {
        var min = 0;
        offset = offset.sub2(posOne, posTwo);
        distance = offset.length();
        if(distance < refDistance) {
          return 1
        }else {
          if(distance > maxDistance) {
            return 0
          }else {
            var numerator = refDistance + rolloffFactor * (distance - refDistance);
            if(numerator !== 0) {
              return refDistance / numerator
            }else {
              return 1
            }
          }
        }
      };
      Channel3d = function(manager, sound) {
        this.position = new pc.Vec3;
        this.velocity = new pc.Vec3;
        this.maxDistance = MAX_DISTANCE;
        this.minDistance = 1;
        this.rollOffFactor = 1
      };
      Channel3d = pc.inherits(Channel3d, pc.audio.Channel);
      Channel3d.prototype = pc.extend(Channel3d.prototype, {getPosition:function() {
        return this.position
      }, setPosition:function(position) {
        this.position.copy(position);
        if(this.source) {
          var listener = this.manager.getListener();
          var lpos = listener.getPosition();
          var factor = fallOff(lpos, this.position, this.minDistance, this.maxDistance, this.rollOffFactor);
          var v = this.getVolume();
          this.source.volume = v * factor
        }
      }, getVelocity:function() {
        return this.velocity
      }, setVelocity:function(velocity) {
        this.velocity.copy(velocity)
      }, getMaxDistance:function() {
        return this.maxDistance
      }, setMaxDistance:function(max) {
        this.maxDistance = max
      }, getMinDistance:function() {
        return this.minDistance
      }, setMinDistance:function(min) {
        this.minDistance = min
      }, getRollOffFactor:function() {
        return this.rolloffFactor
      }, setRollOffFactor:function(factor) {
        this.rolloffFactor = factor
      }})
    }else {
      console.warn("No support for 3D audio found");
      Channel3d = function() {
      }
    }
  }
  return{Channel3d:Channel3d}
}());
pc.extend(pc.resources, function() {
  var AudioResourceHandler = function(manager) {
    this.manager = manager
  };
  AudioResourceHandler = pc.inherits(AudioResourceHandler, pc.resources.ResourceHandler);
  AudioResourceHandler.prototype.load = function(request, options) {
    var self = this;
    var promise = new pc.promise.Promise(function(resolve, reject) {
      var sound = self.manager.createSound(request.canonical, function(sound) {
        resolve(sound)
      }, function(error) {
        logERROR(error);
        resolve(sound)
      })
    });
    return promise
  };
  AudioResourceHandler.prototype.open = function(data, request, options) {
    return data
  };
  var AudioRequest = function(identifier) {
  };
  AudioRequest = pc.inherits(AudioRequest, pc.resources.ResourceRequest);
  AudioRequest.prototype.type = "audio";
  AudioRequest.prototype.Type = pc.audio.Sound;
  return{AudioResourceHandler:AudioResourceHandler, AudioRequest:AudioRequest}
}());
pc.input = {};
pc.extend(pc.input, function() {
  var MouseEvent = function(mouse, event) {
    var coords = {x:0, y:0};
    if(event) {
      if(event instanceof MouseEvent) {
        throw Error("Expected MouseEvent");
      }
      coords = pc.input.getTargetCoords(event)
    }else {
      event = {}
    }
    this.x = coords.x;
    this.y = coords.y;
    if(event.detail) {
      this.wheel = -1 * event.detail
    }else {
      if(event.wheelDelta) {
        this.wheel = event.wheelDelta / 120
      }else {
        this.wheel = 0
      }
    }
    if(pc.input.Mouse.isPointerLocked()) {
      this.dx = event.movementX || event.webkitMovementX || event.mozMovementX || 0;
      this.dy = event.movementY || event.webkitMovementY || event.mozMovementY || 0
    }else {
      this.dx = this.x - mouse._lastX;
      this.dy = this.y - mouse._lastY
    }
    if(event.type === "mousedown" || event.type === "mouseup") {
      this.button = event.button
    }else {
      this.button = pc.input.MOUSEBUTTON_NONE
    }
    this.buttons = mouse._buttons.slice(0);
    this.element = event.target;
    this.ctrlKey = event.ctrlKey || false;
    this.altKey = event.altKey || false;
    this.shiftKey = event.shiftKey || false;
    this.metaKey = event.metaKey || false;
    this.event = event
  };
  var Mouse = function(element) {
    this._lastX = 0;
    this._lastY = 0;
    this._buttons = [false, false, false];
    this._lastbuttons = [false, false, false];
    this._upHandler = this._handleUp.bind(this);
    this._downHandler = this._handleDown.bind(this);
    this._moveHandler = this._handleMove.bind(this);
    this._wheelHandler = this._handleWheel.bind(this);
    this._contextMenuHandler = function(event) {
      event.preventDefault()
    };
    this._element = null;
    if(element) {
      this.attach(element)
    }
    pc.events.attach(this)
  };
  Mouse.isPointerLocked = function() {
    return!!document.pointerLockElement
  };
  Mouse.prototype = {attach:function(element) {
    if(this._element) {
      this.detach()
    }
    this._element = element;
    this._element.addEventListener("mouseup", this._upHandler, false);
    this._element.addEventListener("mousedown", this._downHandler, false);
    this._element.addEventListener("mousemove", this._moveHandler, false);
    this._element.addEventListener("mousewheel", this._wheelHandler, false);
    this._element.addEventListener("DOMMouseScroll", this._wheelHandler, false)
  }, detach:function() {
    this._element.removeEventListener("mouseup", this._upHandler);
    this._element.removeEventListener("mousedown", this._downHandler);
    this._element.removeEventListener("mousemove", this._moveHandler);
    this._element.removeEventListener("mousewheel", this._wheelHandler);
    this._element.removeEventListener("DOMMouseScroll", this._wheelHandler);
    this._element = null
  }, disableContextMenu:function() {
    this._element.addEventListener("contextmenu", this._contextMenuHandler)
  }, enableContextMenu:function() {
    this._element.removeEventListener("contextmenu", this._contextMenuHandler)
  }, enablePointerLock:function(success, error) {
    var s = function() {
      success();
      document.removeEventListener("pointerlockchange", s)
    };
    var e = function() {
      error();
      document.removeEventListener("pointerlockerror", e)
    };
    if(success) {
      document.addEventListener("pointerlockchange", s, false)
    }
    if(error) {
      document.addEventListener("pointerlockerror", e, false)
    }
    this._element.requestPointerLock()
  }, disablePointerLock:function(success) {
    var s = function() {
      success();
      document.removeEventListener("pointerlockchange", s)
    };
    if(success) {
      document.addEventListener("pointerlockchange", s, false)
    }
    document.exitPointerLock()
  }, update:function(dt) {
    this._lastbuttons[0] = this._buttons[0];
    this._lastbuttons[1] = this._buttons[1];
    this._lastbuttons[2] = this._buttons[2]
  }, isPressed:function(button) {
    return this._buttons[button]
  }, wasPressed:function(button) {
    return this._buttons[button] && !this._lastbuttons[button]
  }, wasReleased:function(button) {
    return!this._buttons[button] && this._lastbuttons[button]
  }, _handleUp:function(event) {
    this._buttons[event.button] = false;
    this.fire(pc.input.EVENT_MOUSEUP, new MouseEvent(this, event))
  }, _handleDown:function(event) {
    this._buttons[event.button] = true;
    this.fire(pc.input.EVENT_MOUSEDOWN, new MouseEvent(this, event))
  }, _handleMove:function(event) {
    var e = new MouseEvent(this, event);
    this.fire(pc.input.EVENT_MOUSEMOVE, e);
    this._lastX = e.x;
    this._lastY = e.y
  }, _handleWheel:function(event) {
    this.fire(pc.input.EVENT_MOUSEWHEEL, new MouseEvent(this, event))
  }};
  (function() {
    if(typeof navigator === "undefined" || typeof document === "undefined") {
      return
    }
    navigator.pointer = navigator.pointer || navigator.webkitPointer || navigator.mozPointer;
    var pointerlockchange = function() {
      var e = document.createEvent("CustomEvent");
      e.initCustomEvent("pointerlockchange", true, false, null);
      document.dispatchEvent(e)
    };
    var pointerlockerror = function() {
      var e = document.createEvent("CustomEvent");
      e.initCustomEvent("pointerlockerror", true, false, null);
      document.dispatchEvent(e)
    };
    document.addEventListener("webkitpointerlockchange", pointerlockchange, false);
    document.addEventListener("webkitpointerlocklost", pointerlockchange, false);
    document.addEventListener("mozpointerlockchange", pointerlockchange, false);
    document.addEventListener("mozpointerlocklost", pointerlockchange, false);
    document.addEventListener("webkitpointerlockerror", pointerlockerror, false);
    document.addEventListener("mozpointerlockerror", pointerlockerror, false);
    if(!document.pointerLockElement) {
      Object.defineProperty(document, "pointerLockElement", {enumerable:true, configurable:false, get:function() {
        return document.webkitPointerLockElement || document.mozPointerLockElement
      }})
    }
    if(Element.prototype.mozRequestPointerLock) {
      Element.prototype.requestPointerLock = function() {
        this.mozRequestPointerLock()
      }
    }else {
      Element.prototype.requestPointerLock = Element.prototype.requestPointerLock || Element.prototype.webkitRequestPointerLock || Element.prototype.mozRequestPointerLock
    }
    if(!Element.prototype.requestPointerLock && navigator.pointer) {
      Element.prototype.requestPointerLock = function() {
        var el = this;
        document.pointerLockElement = el;
        navigator.pointer.lock(el, pointerlockchange, pointerlockerror)
      }
    }
    document.exitPointerLock = document.exitPointerLock || document.webkitExitPointerLock || document.mozExitPointerLock;
    if(!document.exitPointerLock) {
      document.exitPointerLock = function() {
        if(navigator.pointer) {
          document.pointerLockElement = null;
          navigator.pointer.unlock()
        }
      }
    }
  })();
  return{Mouse:Mouse, MouseEvent:MouseEvent, EVENT_MOUSEDOWN:"mousedown", EVENT_MOUSEMOVE:"mousemove", EVENT_MOUSEUP:"mouseup", EVENT_MOUSEWHEEL:"mousewheel", MOUSEBUTTON_NONE:-1, MOUSEBUTTON_LEFT:0, MOUSEBUTTON_MIDDLE:1, MOUSEBUTTON_RIGHT:2, getTargetCoords:function getTargetCoords(event) {
    var coords = {x:0, y:0};
    var element = event.currentTarget;
    var totalOffsetLeft = 0;
    var totalOffsetTop = 0;
    while(element.offsetParent) {
      totalOffsetLeft += element.offsetLeft;
      totalOffsetTop += element.offsetTop;
      element = element.offsetParent
    }
    coords.x = event.pageX - totalOffsetLeft;
    coords.y = event.pageY - totalOffsetTop;
    return coords
  }}
}());
pc.extend(pc.input, function() {
  var KeyboardEvent = function(keyboard, event) {
    this.key = event.keyCode;
    this.element = event.target;
    this.event = event
  };
  function toKeyCode(s) {
    if(typeof s == "string") {
      return s.toUpperCase().charCodeAt(0)
    }else {
      return s
    }
  }
  var _keyCodeToKeyIdentifier = {9:"Tab", 13:"Enter", 16:"Shift", 17:"Control", 18:"Alt", 27:"Escape", 37:"Left", 38:"Up", 39:"Right", 40:"Down", 46:"Delete", 91:"Win"};
  var Keyboard = function(element, options) {
    options = options || {};
    this._element = null;
    this._keyDownHandler = this._handleKeyDown.bind(this);
    this._keyUpHandler = this._handleKeyUp.bind(this);
    this._keyPressHandler = this._handleKeyPress.bind(this);
    pc.events.attach(this);
    this._keymap = {};
    this._lastmap = {};
    if(element) {
      this.attach(element)
    }
    this.preventDefault = options.preventDefault || false;
    this.stopPropagation = options.stopPropagation || false
  };
  Keyboard.prototype.attach = function(element) {
    if(this._element) {
      this.detach()
    }
    this._element = element;
    this._element.addEventListener("keydown", this._keyDownHandler, false);
    this._element.addEventListener("keypress", this._keyPressHandler, false);
    this._element.addEventListener("keyup", this._keyUpHandler, false)
  };
  Keyboard.prototype.detach = function() {
    this._element.removeEventListener("keydown", this._keyDownHandler);
    this._element.removeEventListener("keypress", this._keyPressHandler);
    this._element.removeEventListener("keyup", this._keyUpHandler);
    this._element = null
  };
  Keyboard.prototype.toKeyIdentifier = function(keyCode) {
    keyCode = toKeyCode(keyCode);
    var count;
    var hex;
    var length;
    var id = _keyCodeToKeyIdentifier[keyCode.toString()];
    if(id) {
      return id
    }
    hex = keyCode.toString(16).toUpperCase();
    length = hex.length;
    for(count = 0;count < 4 - length;count++) {
      hex = "0" + hex
    }
    return"U+" + hex
  };
  Keyboard.prototype._handleKeyDown = function(event) {
    var code = event.keyCode || event.charCode;
    var id = event.keyIdentifier || this.toKeyIdentifier(code);
    this._keymap[id] = true;
    this.fire("keydown", new KeyboardEvent(this, event));
    if(this.preventDefault) {
      event.preventDefault()
    }
    if(this.stopPropagation) {
      event.stopPropagation()
    }
  };
  Keyboard.prototype._handleKeyUp = function(event) {
    var code = event.keyCode || event.charCode;
    var id = event.keyIdentifier || this.toKeyIdentifier(code);
    delete this._keymap[id];
    this.fire("keyup", new KeyboardEvent(this, event));
    if(this.preventDefault) {
      event.preventDefault()
    }
    if(this.stopPropagation) {
      event.stopPropagation()
    }
  };
  Keyboard.prototype._handleKeyPress = function(event) {
    var code = event.keyCode || event.charCode;
    var id = event.keyIdentifier || this.toKeyIdentifier(code);
    this.fire("keypress", new KeyboardEvent(this, event));
    if(this.preventDefault) {
      event.preventDefault()
    }
    if(this.stopPropagation) {
      event.stopPropagation()
    }
  };
  Keyboard.prototype.update = function(dt) {
    var prop;
    this._lastmap = {};
    for(prop in this._keymap) {
      if(this._keymap.hasOwnProperty(prop)) {
        this._lastmap[prop] = this._keymap[prop]
      }
    }
  };
  Keyboard.prototype.isPressed = function(key) {
    var keyCode = toKeyCode(key);
    var id = this.toKeyIdentifier(keyCode);
    return!!this._keymap[id]
  };
  Keyboard.prototype.wasPressed = function(key) {
    var keyCode = toKeyCode(key);
    var id = this.toKeyIdentifier(keyCode);
    return!!this._keymap[id] && !!!this._lastmap[id]
  };
  Keyboard.prototype.wasReleased = function(key) {
    var keyCode = toKeyCode(key);
    var id = this.toKeyIdentifier(keyCode);
    return!!!this._keymap[id] && !!this._lastmap[id]
  };
  return{Keyboard:Keyboard, EVENT_KEYDOWN:"keydown", EVENT_KEYUP:"keyup", KEY_BACKSPACE:8, KEY_TAB:9, KEY_RETURN:13, KEY_ENTER:14, KEY_SHIFT:16, KEY_CONTROL:17, KEY_ALT:18, KEY_PAUSE:19, KEY_CAPS_LOCK:20, KEY_ESCAPE:27, KEY_SPACE:32, KEY_PAGE_UP:33, KEY_PAGE_DOWN:34, KEY_END:35, KEY_HOME:36, KEY_LEFT:37, KEY_UP:38, KEY_RIGHT:39, KEY_DOWN:40, KEY_PRINT_SCREEN:44, KEY_INSERT:45, KEY_DELETE:46, KEY_0:48, KEY_1:49, KEY_2:50, KEY_3:51, KEY_4:52, KEY_5:53, KEY_6:54, KEY_7:55, KEY_8:56, KEY_9:57, KEY_SEMICOLON:59, 
  KEY_EQUAL:61, KEY_A:65, KEY_B:66, KEY_C:67, KEY_D:68, KEY_E:69, KEY_F:70, KEY_G:71, KEY_H:72, KEY_I:73, KEY_J:74, KEY_K:75, KEY_L:76, KEY_M:77, KEY_N:78, KEY_O:79, KEY_P:80, KEY_Q:81, KEY_R:82, KEY_S:83, KEY_T:84, KEY_U:85, KEY_V:86, KEY_W:87, KEY_X:88, KEY_Y:89, KEY_Z:90, KEY_WINDOWS:91, KEY_CONTEXT_MENU:93, KEY_NUMPAD_0:96, KEY_NUMPAD_1:97, KEY_NUMPAD_2:98, KEY_NUMPAD_3:99, KEY_NUMPAD_4:100, KEY_NUMPAD_5:101, KEY_NUMPAD_6:102, KEY_NUMPAD_7:103, KEY_NUMPAD_8:104, KEY_NUMPAD_9:105, KEY_MULTIPLY:106, 
  KEY_ADD:107, KEY_SEPARATOR:108, KEY_SUBTRACT:109, KEY_DECIMAL:110, KEY_DIVIDE:111, KEY_F1:112, KEY_F2:113, KEY_F3:114, KEY_F4:115, KEY_F5:116, KEY_F6:117, KEY_F7:118, KEY_F8:119, KEY_F9:120, KEY_F10:121, KEY_F11:122, KEY_F12:123, KEY_COMMA:188, KEY_PERIOD:190, KEY_SLASH:191, KEY_OPEN_BRACKET:219, KEY_BACK_SLASH:220, KEY_CLOSE_BRACKET:221, KEY_META:224}
}());
pc.extend(pc.input, function() {
  var GamePads = function() {
    this.gamepadsSupported = !!navigator.webkitGetGamepads;
    this.current = [];
    this.previous = [];
    this.deadZone = 0.25
  };
  var MAPS = {DEFAULT:{buttons:["PAD_FACE_1", "PAD_FACE_2", "PAD_FACE_3", "PAD_FACE_4", "PAD_L_SHOULDER_1", "PAD_R_SHOULDER_1", "PAD_L_SHOULDER_2", "PAD_R_SHOULDER_2", "PAD_SELECT", "PAD_START", "PAD_L_STICK_BUTTON", "PAD_R_STICK_BUTTON", "PAD_UP", "PAD_DOWN", "PAD_LEFT", "PAD_RIGHT", "PAD_VENDOR"], axes:["PAD_L_STICK_X", "PAD_L_STICK_Y", "PAD_R_STICK_X", "PAD_R_STICK_Y"]}, PS3:{buttons:["PAD_FACE_1", "PAD_FACE_2", "PAD_FACE_4", "PAD_FACE_3", "PAD_L_SHOULDER_1", "PAD_R_SHOULDER_1", "PAD_L_SHOULDER_2", 
  "PAD_R_SHOULDER_2", "PAD_SELECT", "PAD_START", "PAD_L_STICK_BUTTON", "PAD_R_STICK_BUTTON", "PAD_UP", "PAD_DOWN", "PAD_LEFT", "PAD_RIGHT", "PAD_VENDOR"], axes:["PAD_L_STICK_X", "PAD_L_STICK_Y", "PAD_R_STICK_X", "PAD_R_STICK_Y"]}};
  var PRODUCT_CODES = {"Product: 0268":"PS3"};
  GamePads.prototype = {update:function(dt) {
    var pads = this.poll();
    var i, len = pads.length;
    for(i = 0;i < len;i++) {
      this.previous[i] = this.current[i];
      this.current[i] = pads[i]
    }
  }, poll:function() {
    var pads = [];
    if(this.gamepadsSupported) {
      var padDevices = navigator.webkitGetGamepads();
      var i, len = padDevices.length;
      for(i = 0;i < len;i++) {
        if(padDevices[i]) {
          pads.push({map:this.getMap(padDevices[i]), pad:padDevices[i]})
        }
      }
    }
    return pads
  }, getMap:function(pad) {
    for(var code in PRODUCT_CODES) {
      if(pad.id.indexOf(code) >= 0) {
        return MAPS[PRODUCT_CODES[code]]
      }
    }
    return MAPS.DEFAULT
  }, isPressed:function(index, button) {
    if(!this.current[index]) {
      return false
    }
    var key = this.current[index].map.buttons[button];
    return this.current[index].pad.buttons[pc.input[key]]
  }, wasPressed:function(index, button) {
    if(!this.current[index]) {
      return false
    }
    var key = this.current[index].map.buttons[button];
    var i = pc.input[key];
    return this.current[index].pad.buttons[i] && !this.previous[index].pad.buttons[i]
  }, getAxis:function(index, axes) {
    if(!this.current[index]) {
      return false
    }
    var key = this.current[index].map.axes[axes];
    var value = this.current[index].pad.axes[pc.input[key]];
    if(Math.abs(value) < this.deadZone) {
      value = 0
    }
    return value
  }};
  return{PAD_1:0, PAD_2:1, PAD_3:2, PAD_4:3, PAD_FACE_1:0, PAD_FACE_2:1, PAD_FACE_3:2, PAD_FACE_4:3, PAD_L_SHOULDER_1:4, PAD_R_SHOULDER_1:5, PAD_L_SHOULDER_2:6, PAD_R_SHOULDER_2:7, PAD_SELECT:8, PAD_START:9, PAD_L_STICK_BUTTON:10, PAD_R_STICK_BUTTON:11, PAD_UP:12, PAD_DOWN:13, PAD_LEFT:14, PAD_RIGHT:15, PAD_VENDOR:16, PAD_L_STICK_X:0, PAD_L_STICK_Y:1, PAD_R_STICK_X:2, PAD_R_STICK_Y:3, GamePads:GamePads}
}());
pc.extend(pc.input, function() {
  var TouchEvent = function(device, event) {
    this.element = event.target;
    this.event = event;
    this.touches = [];
    this.changedTouches = [];
    if(event) {
      var i, l = event.touches.length;
      for(i = 0;i < l;i++) {
        this.touches.push(new Touch(event.touches[i]))
      }
      l = event.changedTouches.length;
      for(i = 0;i < l;i++) {
        this.changedTouches.push(new Touch(event.changedTouches[i]))
      }
    }
  };
  TouchEvent.prototype = {getTouchById:function(id, list) {
    var i, l = list.length;
    for(i = 0;i < l;i++) {
      if(list[i].id === id) {
        return list[i]
      }
    }
    return null
  }};
  var Touch = function(touch) {
    var coords = pc.input.getTouchTargetCoords(touch);
    this.id = touch.identifier;
    this.x = coords.x;
    this.y = coords.y;
    this.target = touch.target;
    this.touch = touch
  };
  var TouchDevice = function(element) {
    this._startHandler = this._handleTouchStart.bind(this);
    this._endHandler = this._handleTouchEnd.bind(this);
    this._moveHandler = this._handleTouchMove.bind(this);
    this._cancelHandler = this._handleTouchCancel.bind(this);
    this.attach(element);
    pc.events.attach(this)
  };
  TouchDevice.prototype = {attach:function(element) {
    if(this._element) {
      this.detach()
    }
    this._element = element;
    this._element.addEventListener("touchstart", this._startHandler, false);
    this._element.addEventListener("touchend", this._endHandler, false);
    this._element.addEventListener("touchmove", this._moveHandler, false);
    this._element.addEventListener("touchcancel", this._cancelHandler, false)
  }, detach:function() {
    if(this._element) {
      this._element.removeEventListener("touchstart", this._startHandler, false);
      this._element.removeEventListener("touchend", this._endHandler, false);
      this._element.removeEventListener("touchmove", this._moveHandler, false);
      this._element.removeEventListener("touchcancel", this._cancelHandler, false)
    }
    this._element = null
  }, _handleTouchStart:function(e) {
    this.fire("touchstart", new TouchEvent(this, e))
  }, _handleTouchEnd:function(e) {
    this.fire("touchend", new TouchEvent(this, e))
  }, _handleTouchMove:function(e) {
    e.preventDefault();
    this.fire("touchmove", new TouchEvent(this, e))
  }, _handleTouchCancel:function(e) {
    this.fire("touchcancel", new TouchEvent(this, e))
  }};
  return{EVENT_TOUCHSTART:"touchstart", EVENT_TOUCHEND:"touchend", EVENT_TOUCHMOVE:"touchmove", EVENT_TOUCHCANCEL:"touchcancel", getTouchTargetCoords:function(touch) {
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var target = touch.target;
    while(!(target instanceof HTMLElement)) {
      target = target.parentNode
    }
    var currentElement = target;
    do {
      totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
      totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
      currentElement = currentElement.offsetParent
    }while(currentElement);
    return{x:touch.pageX - totalOffsetX, y:touch.pageY - totalOffsetY}
  }, TouchDevice:TouchDevice}
}());
pc.extend(pc.input, function() {
  var Controller = function(element, options) {
    options = options || {};
    this._keyboard = options.keyboard || null;
    this._mouse = options.mouse || null;
    this._gamepads = options.gamepads || null;
    this._element = null;
    this._actions = {};
    this._axes = {};
    this._axesValues = {};
    if(element) {
      this.attach(element)
    }
  };
  Controller.prototype.attach = function(element) {
    this._element = element;
    if(this._keyboard) {
      this._keyboard.attach(element)
    }
    if(this._mouse) {
      this._mouse.attach(element)
    }
  };
  Controller.prototype.detach = function() {
    if(this._keyboard) {
      this._keyboard.detach()
    }
    if(this._mouse) {
      this._mouse.detach()
    }
    this._element = null
  };
  Controller.prototype.disableContextMenu = function() {
    if(!this._mouse) {
      this._enableMouse()
    }
    this._mouse.disableContextMenu()
  };
  Controller.prototype.enableContextMenu = function() {
    if(!this._mouse) {
      this._enableMouse()
    }
    this._mouse.enableContextMenu()
  };
  Controller.prototype.update = function(dt) {
    if(this._keyboard) {
      this._keyboard.update(dt)
    }
    if(this._mouse) {
      this._mouse.update(dt)
    }
    if(this._gamepads) {
      this._gamepads.update(dt)
    }
    this._axesValues = {};
    for(var key in this._axes) {
      this._axesValues[key] = []
    }
  };
  Controller.prototype.registerKeys = function(action, keys) {
    if(!this._keyboard) {
      this._enableKeyboard()
    }
    if(this._actions[action]) {
      throw new Error(pc.string.format("Action: {0} already registered", action));
    }
    if(typeof keys === "undefined") {
      throw new Error("Invalid button");
    }
    if(!keys.length) {
      keys = [keys]
    }
    if(this._actions[action]) {
      this._actions[action].push({type:pc.input.ACTION_KEYBOARD, keys:keys})
    }else {
      this._actions[action] = [{type:pc.input.ACTION_KEYBOARD, keys:keys}]
    }
  };
  Controller.prototype.registerMouse = function(action, button) {
    if(!this._mouse) {
      this._enableMouse()
    }
    if(typeof button === "undefined") {
      throw new Error("Invalid button");
    }
    if(this._actions[action]) {
      this._actions[action].push({type:pc.input.ACTION_MOUSE, button:button})
    }else {
      this._actions[action] = [{type:pc.input.ACTION_MOUSE, button:-button}]
    }
  };
  Controller.prototype.registerPadButton = function(action, pad, button) {
    if(typeof button === "undefined") {
      throw new Error("Invalid button");
    }
    if(this._actions[action]) {
      this._actions[action].push({type:pc.input.ACTION_GAMEPAD, button:button, pad:pad})
    }else {
      this._actions[action] = [{type:pc.input.ACTION_GAMEPAD, button:button, pad:pad}]
    }
  };
  Controller.prototype.registerAxis = function(options) {
    var name = options.name;
    if(!this._axes[name]) {
      this._axes[name] = []
    }
    var i = this._axes[name].push(name);
    options = options || {};
    options.pad = options.pad || pc.input.PAD_1;
    var bind = function(controller, source, value, key) {
      switch(source) {
        case "mousex":
          controller._mouse.on(pc.input.EVENT_MOUSEMOVE, function(e) {
            controller._axesValues[name][i] = e.dx / 10
          });
          break;
        case "mousey":
          controller._mouse.on(pc.input.EVENT_MOUSEMOVE, function(e) {
            controller._axesValues[name][i] = e.dy / 10
          });
          break;
        case "key":
          controller._axes[name].push(function() {
            return controller._keyboard.isPressed(key) ? value : 0
          });
          break;
        case "padrx":
          controller._axes[name].push(function() {
            return controller._gamepads.getAxis(options.pad, pc.input.PAD_R_STICK_X)
          });
          break;
        case "padry":
          controller._axes[name].push(function() {
            return controller._gamepads.getAxis(options.pad, pc.input.PAD_R_STICK_Y)
          });
          break;
        case "padlx":
          controller._axes[name].push(function() {
            return controller._gamepads.getAxis(options.pad, pc.input.PAD_L_STICK_X)
          });
          break;
        case "padly":
          controller._axes[name].push(function() {
            return controller._gamepads.getAxis(options.pad, pc.input.PAD_L_STICK_Y)
          });
          break;
        default:
          throw new Error("Unknown axis");
      }
    };
    bind(this, options.positive, 1, options.positiveKey);
    if(options.negativeKey || options.negative !== options.positive) {
      bind(this, options.negative, -1, options.negativeKey)
    }
  };
  Controller.prototype.isPressed = function(actionName) {
    if(!this._actions[actionName]) {
      return false
    }
    var action;
    var index = 0;
    var length = this._actions[actionName].length;
    for(index = 0;index < length;++index) {
      action = this._actions[actionName][index];
      switch(action.type) {
        case pc.input.ACTION_KEYBOARD:
          if(this._keyboard) {
            var i, len = action.keys.length;
            for(i = 0;i < len;i++) {
              if(this._keyboard.isPressed(action.keys[i])) {
                return true
              }
            }
          }
          break;
        case pc.input.ACTION_MOUSE:
          if(this._mouse && this._mouse.isPressed(action.button)) {
            return true
          }
          break;
        case pc.input.ACTION_GAMEPAD:
          if(this._gamepads && this._gamepads.isPressed(action.pad, action.button)) {
            return true
          }
          break
      }
    }
    return false
  };
  Controller.prototype.wasPressed = function(actionName) {
    if(!this._actions[actionName]) {
      return false
    }
    var index = 0;
    var length = this._actions[actionName].length;
    for(index = 0;index < length;++index) {
      var action = this._actions[actionName][index];
      switch(action.type) {
        case pc.input.ACTION_KEYBOARD:
          if(this._keyboard) {
            var i, len = action.keys.length;
            for(i = 0;i < len;i++) {
              if(this._keyboard.wasPressed(action.keys[i])) {
                return true
              }
            }
          }
          break;
        case pc.input.ACTION_MOUSE:
          if(this._mouse && this._mouse.wasPressed(action.button)) {
            return true
          }
          break;
        case pc.input.ACTION_GAMEPAD:
          if(this._gamepads && this._gamepads.wasPressed(action.pad, action.button)) {
            return true
          }
          break
      }
    }
    return false
  };
  Controller.prototype.getAxis = function(name) {
    var value = 0;
    if(this._axes[name]) {
      var i, len = this._axes[name].length;
      for(i = 0;i < len;i++) {
        if(pc.type(this._axes[name][i]) === "function") {
          var v = this._axes[name][i]();
          if(Math.abs(v) > Math.abs(value)) {
            value = v
          }
        }else {
          if(this._axesValues[name]) {
            if(Math.abs(this._axesValues[name][i]) > Math.abs(value)) {
              value = this._axesValues[name][i]
            }
          }
        }
      }
    }
    return value
  };
  Controller.prototype._enableMouse = function() {
    this._mouse = new pc.input.Mouse;
    if(!this._element) {
      throw new Error("Controller must be attached to a DOMElement");
    }
    this._mouse.attach(this._element)
  };
  Controller.prototype._enableKeyboard = function() {
    this._keyboard = new pc.input.Keyboard;
    if(!this._element) {
      throw new Error("Controller must be attached to a DOMElement");
    }
    this._keyboard.attach(this._element)
  };
  return{ACTION_MOUSE:"mouse", ACTION_KEYBOARD:"keyboard", ACTION_GAMEPAD:"gamepad", AXIS_MOUSE_X:"mousex", AXIS_MOUSE_Y:"mousey", AXIS_PAD_L_X:"padlx", AXIS_PAD_L_Y:"padly", AXIS_PAD_R_X:"padrx", AXIS_PAD_R_Y:"padry", AXIS_KEY:"key", Controller:Controller}
}());
pc.net = function() {
  return{}
}();
pc.extend(pc.net, function() {
  var Http = function Http() {
  };
  Http.ContentType = {FORM_URLENCODED:"application/x-www-form-urlencoded", GIF:"image/gif", JPEG:"image/jpeg", JSON:"application/json", PNG:"image/png", TEXT:"text/plain", XML:"application/xml", WAV:"audio/x-wav", OGG:"audio/ogg", MP3:"audio/mpeg", BIN:"application/octet-stream"};
  Http.ResponseType = {TEXT:"text", ARRAY_BUFFER:"arraybuffer", BLOB:"blob", DOCUMENT:"document"};
  Http.binaryExtensions = [".model", ".wav", ".ogg", ".mp3"];
  Http.prototype = {ContentType:Http.ContentType, ResponseType:Http.ResponseType, binaryExtensions:Http.binaryExtensions, get:function(url, success, options, xhr) {
    options = options || {};
    options.success = success;
    return this.request("GET", url, options, xhr)
  }, post:function(url, success, data, options, xhr) {
    options = options || {};
    options.success = success;
    options.postdata = data;
    return this.request("POST", url, options, xhr)
  }, put:function(url, success, data, options, xhr) {
    options = options || {};
    options.success = success;
    options.postdata = data;
    return this.request("PUT", url, options, xhr)
  }, del:function(url, success, options, xhr) {
    options = options || {};
    options.success = success;
    return this.request("DELETE", url, options, xhr)
  }, request:function(method, url, options, xhr) {
    var uri, query, timestamp, postdata;
    var errored = false;
    options = options || {};
    if(options.success == null) {
      options.success = function() {
      }
    }
    if(options.error == null) {
      options.error = function() {
      }
    }
    if(options.async == null) {
      options.async = true
    }
    if(options.headers == null) {
      options.headers = {}
    }
    if(options.postdata != null) {
      if(options.postdata instanceof Document) {
        postdata = options.postdata
      }else {
        if(options.postdata instanceof FormData) {
          postdata = options.postdata
        }else {
          if(options.postdata instanceof Object) {
            var contentType = options.headers["Content-Type"];
            if(!pc.isDefined(contentType)) {
              options.headers["Content-Type"] = Http.ContentType.FORM_URLENCODED;
              contentType = options.headers["Content-Type"]
            }
            switch(contentType) {
              case Http.ContentType.FORM_URLENCODED:
                postdata = "";
                var bFirstItem = true;
                for(var key in options.postdata) {
                  if(options.postdata.hasOwnProperty(key)) {
                    if(bFirstItem) {
                      bFirstItem = false
                    }else {
                      postdata += "&"
                    }
                    postdata += escape(key) + "=" + escape(options.postdata[key])
                  }
                }
                break;
              case Http.ContentType.JSON:
              ;
              default:
                if(contentType == null) {
                  options.headers["Content-Type"] = Http.ContentType.JSON
                }
                postdata = JSON.stringify(options.postdata);
                break
            }
          }else {
            postdata = options.postdata
          }
        }
      }
    }
    if(!xhr) {
      xhr = new XMLHttpRequest
    }
    if(options.cache === false) {
      timestamp = pc.time.now();
      uri = new pc.URI(url);
      if(!uri.query) {
        uri.query = "ts=" + timestamp
      }else {
        uri.query = uri.query + "&ts=" + timestamp
      }
      url = uri.toString()
    }
    if(options.query) {
      uri = new pc.URI(url);
      query = pc.extend(uri.getQuery(), options.query);
      uri.setQuery(query);
      url = uri.toString()
    }
    xhr.open(method, url, options.async);
    xhr.withCredentials = true;
    xhr.responseType = options.responseType || this.guessResponseType(url);
    for(var header in options.headers) {
      if(options.headers.hasOwnProperty(header)) {
        xhr.setRequestHeader(header, options.headers[header])
      }
    }
    xhr.onreadystatechange = function() {
      this.onReadyStateChange(method, url, options, xhr)
    }.bind(this);
    xhr.onerror = function() {
      this.onError(method, url, options, xhr);
      errored = true
    }.bind(this);
    try {
      xhr.send(postdata)
    }catch(e) {
      if(!errored) {
        options.error(xhr.status, xhr, e)
      }
    }
    return xhr
  }, guessResponseType:function(url) {
    var uri = new pc.URI(url);
    var ext = pc.path.getExtension(uri.path);
    if(Http.binaryExtensions.indexOf(ext) >= 0) {
      return Http.ResponseType.ARRAY_BUFFER
    }
    return Http.ResponseType.TEXT
  }, isBinaryContentType:function(contentType) {
    var binTypes = [Http.ContentType.WAV, Http.ContentType.OGG, Http.ContentType.MP3, Http.ContentType.BIN];
    if(binTypes.indexOf(contentType) >= 0) {
      return true
    }
    return false
  }, onReadyStateChange:function(method, url, options, xhr) {
    if(xhr.readyState === 4) {
      switch(xhr.status) {
        case 0:
          break;
        case 200:
        ;
        case 201:
        ;
        case 206:
        ;
        case 304:
          this.onSuccess(method, url, options, xhr);
          break;
        default:
          this.onError(method, url, options, xhr);
          break
      }
    }
  }, onSuccess:function(method, url, options, xhr) {
    var response;
    var header;
    var contentType;
    var parameter;
    var parts;
    header = xhr.getResponseHeader("Content-Type");
    if(header) {
      parts = header.split(";");
      contentType = parts[0].trim();
      if(parts[1]) {
        parameter = parts[1].trim()
      }
    }
    if(contentType === this.ContentType.JSON || pc.string.endsWith(url, ".json")) {
      response = JSON.parse(xhr.responseText)
    }else {
      if(this.isBinaryContentType(contentType)) {
        response = xhr.response
      }else {
        if(xhr.responseType === Http.ResponseType.ARRAY_BUFFER) {
          logWARNING(pc.string.format("responseType: {0} being served with Content-Type: {1}", Http.ResponseType.ARRAY_BUFFER, contentType));
          response = xhr.response
        }else {
          if(xhr.responseType === Http.ResponseType.DOCUMENT || contentType === this.ContentType.XML) {
            response = xhr.responseXML
          }else {
            response = xhr.responseText
          }
        }
      }
    }
    options.success(response, xhr.status, xhr)
  }, onError:function(method, url, options, xhr) {
    options.error(xhr.status, xhr, null)
  }};
  Http.prototype.delete_ = Http.prototype.del;
  return{Http:Http, http:new Http}
}());
pc.extend(pc.net, function() {
  var refreshCounter = 0;
  var OAuth = function OAuth(endpoint, redirectUrl, origin, clientId, scope) {
    this.clientId = clientId;
    this.endpoint = endpoint;
    this.redirectUrl = redirectUrl;
    this.origin = origin;
    this.scope = scope;
    this.responseType = "token";
    this.accessToken = null;
    this.OAUTH_IFRAME_ID_BASE = "pc-oauth-access-token-"
  };
  OAuth = pc.inherits(OAuth, pc.net.Http);
  OAuth.prototype.refreshAccessToken = function(success) {
    var id = this.OAUTH_IFRAME_ID_BASE + refreshCounter++;
    var handleMessage = function handleMessage(msg) {
      if(msg.origin !== this.origin) {
        return
      }
      if(msg.data.access_token) {
        var iframe = document.getElementById(id);
        if(iframe) {
          iframe.parentNode.removeChild(iframe)
        }
        this.accessToken = msg.data.access_token;
        success(msg.data.access_token)
      }else {
        if(msg.data.error) {
          logERROR(msg.data.error)
        }else {
          logWARNING("Invalid message posted to Corazon API")
        }
      }
      clearEvent()
    }.bind(this);
    window.addEventListener("message", handleMessage, false);
    var clearEvent = function() {
      window.removeEventListener("message", handleMessage)
    };
    var params = {client_id:this.clientId, redirect_url:this.redirectUrl, scope:this.scope, response_type:this.responseType};
    var url = new pc.URI(this.endpoint);
    url.setQuery(params);
    var iframe = document.getElementById(id);
    if(iframe) {
      throw new Error("accessToken request already in progress");
    }
    iframe = document.createElement("iframe");
    iframe.src = url.toString();
    iframe.id = id;
    iframe.style.display = "none";
    document.body.appendChild(iframe)
  };
  OAuth.prototype.request = function(method, url, options, xhr) {
    options.query = options.query || {};
    options.query = pc.extend(options.query, {"access_token":this.accessToken});
    return pc.net.OAuth._super.request.call(this, method, url, options, xhr)
  };
  OAuth.prototype.onError = function(method, url, options, xhr) {
    if(xhr.status == 401) {
      this.refreshAccessToken(function(accessToken) {
        options.query.access_token = accessToken;
        this.request(method, url, options, xhr)
      }.bind(this))
    }else {
      options.error(xhr.status, xhr, null)
    }
  };
  return{OAuth:OAuth, oauth:new OAuth}
}());
pc.extend(pc.net, function() {
  var Socket = function(url) {
    this._ws = new WebSocket(url);
    this._ws.onopen = this._handleOpen.bind(this);
    this._ws.onerror = this._handleError.bind(this);
    this._ws.onmessage = this._handleMessage.bind(this);
    this._ws.onclose = this._handleClose.bind(this)
  };
  Socket.prototype = {onopen:null, onerror:null, onmessage:null, get binaryType() {
    return this._ws.binaryType
  }, set binaryType(type) {
    this._ws.binaryType = type
  }, get readyState() {
    return this._ws.readyState
  }, get bufferedAmount() {
    return this._ws.bufferedAmount
  }, get extensions() {
    return this._ws.extensions
  }, get protocol() {
    return this._ws.protocol
  }, _handleOpen:function() {
    if(this.onopen) {
      this.onopen()
    }
  }, _handleError:function(error) {
    if(this.onerror) {
      this.onerror(error)
    }
  }, _handleMessage:function(msg) {
    if(this.onmessage) {
      this.onmessage(msg)
    }
  }, _handleClose:function() {
    if(this.onclose) {
      this.onclose()
    }
  }, send:function(msg) {
    this._ws.send(msg)
  }};
  return{Socket:Socket}
}());
pc.script = function() {
  var _main = null;
  var _loader = null;
  var script = {main:function(callback) {
    if(_main) {
      throw new Error("'main' Object already registered");
    }
    _main = callback
  }, setLoader:function(loader) {
    if(loader && _loader) {
      throw new Error("pc.script already has loader object.");
    }
    _loader = loader
  }, create:function(name, callback) {
    if(typeof callback === "undefined") {
      callback = attributes
    }
    this.fire("created", name, callback)
  }, attribute:function(name, type, defaultValue, options) {
  }, start:function() {
    _main()
  }};
  pc.events.attach(script);
  return script
}();
pc.extend(pc.resources, function() {
  var ScriptResourceHandler = function(context, prefix) {
    this._context = context;
    this._prefix = prefix || "";
    this._queue = [];
    this._pending = [];
    this._loaded = {};
    this._loading = null;
    pc.script.on("created", this._onScriptCreated, this)
  };
  ScriptResourceHandler = pc.inherits(ScriptResourceHandler, pc.resources.ResourceHandler);
  ScriptResourceHandler.prototype.load = function(request, options) {
    options = options || {};
    options.timeout = options.timeout || 6E4;
    options.cache = true;
    var promise = new pc.promise.Promise(function(resolve, reject) {
      var processedUrl = request.canonical;
      if(!options.cache) {
        processedUrl = this._appendTimestampToUrl(processedUrl)
      }
      var url = new pc.URI(processedUrl);
      url.path = pc.path.join(this._prefix, url.path);
      url = url.toString();
      if(this._loaded[url]) {
        if(this._loaded[url] !== true) {
          resolve(this._loaded[url])
        }else {
          resolve(null)
        }
      }else {
        if(this._loading) {
          this._queue.push({url:url.toString(), success:resolve, error:reject})
        }else {
          this._addScriptTag(url.toString(), resolve, reject)
        }
      }
      if(options.timeout) {
        (function() {
          setTimeout(function() {
            if(!this._loaded[url]) {
              reject(pc.string.format("Loading script {0} timed out after {1}s", url, options.timeout / 1E3))
            }
          }.bind(this), options.timeout)
        }).call(this)
      }
    }.bind(this));
    return promise
  };
  ScriptResourceHandler.prototype.open = function(data, request, options) {
    return data
  };
  ScriptResourceHandler.prototype._appendTimestampToUrl = function(url) {
    timestamp = pc.time.now();
    uri = new pc.URI(url);
    if(!uri.query) {
      uri.query = "ts=" + timestamp
    }else {
      uri.query = uri.query + "&ts=" + timestamp
    }
    url = uri.toString();
    return url
  };
  ScriptResourceHandler.prototype._onScriptCreated = function(name, callback) {
    this._pending.push({name:name, callback:callback})
  };
  ScriptResourceHandler.prototype._addScriptTag = function(url, success, error) {
    var self = this;
    var head = document.getElementsByTagName("head")[0];
    var element = document.createElement("script");
    this._loading = element;
    element.addEventListener("error", function(e) {
      error(pc.string.format("Error loading script from '{0}'", e.target.src))
    });
    var done = false;
    element.onload = element.onreadystatechange = function() {
      if(!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
        done = true;
        var script = self._pending.shift();
        if(script) {
          var ScriptType = script.callback(self._context);
          if(ScriptType._pcScriptName) {
            throw Error("Attribute _pcScriptName is reserved on ScriptTypes for ResourceLoader use");
          }
          ScriptType._pcScriptName = script.name;
          self._loaded[url] = ScriptType;
          success(ScriptType)
        }else {
          self._loaded[url] = true;
          success(null)
        }
        self._loading = null;
        if(self._queue.length) {
          var loadable = self._queue.shift();
          self._addScriptTag(loadable.url, loadable.success, loadable.error)
        }
      }
    };
    element.src = url;
    head.appendChild(element)
  };
  var ScriptRequest = function ScriptRequest() {
  };
  ScriptRequest = pc.inherits(ScriptRequest, pc.resources.ResourceRequest);
  ScriptRequest.prototype.type = "script";
  return{ScriptResourceHandler:ScriptResourceHandler, ScriptRequest:ScriptRequest}
}());
pc.fw = {};
var editor = editor || {};
pc.extend(editor, function() {
  var LinkInterface = function() {
    this.exposed = {};
    this.added = {};
    this.scripts = {};
    this.systems = []
  };
  LinkInterface.prototype = {addComponentType:function() {
  }, expose:function() {
  }, add:function() {
  }, scriptexpose:function() {
  }};
  return{LinkInterface:LinkInterface, link:new LinkInterface}
}());
pc.extend(editor, function() {
  var LinkInterface = function() {
    this.exposed = {};
    this.added = {};
    this.scripts = {};
    this.systems = []
  };
  LinkInterface.prototype.addComponentType = function(componentSystem) {
    var name = componentSystem.id;
    var i;
    var systems = this.systems;
    var length = systems.length;
    var exists = false;
    for(i = 0;i < length;i++) {
      if(systems[i].name === name) {
        exists = true;
        break
      }
    }
    if(!exists) {
      this.systems.push({"name":name, "description":componentSystem.description})
    }
    if(!this.exposed[name]) {
      this.exposed[name] = {}
    }
  };
  LinkInterface.prototype.expose = function(system, details) {
    if(!details.name) {
      throw new Error("Missing option 'name'");
    }
    details.options = details.options || {};
    if(details.type === "vector") {
      details.array = true;
      if(details.defaultValue) {
        switch(details.defaultValue.length) {
          case 2:
            details.RuntimeType = pc.Vec2;
            break;
          case 3:
            details.RuntimeType = pc.Vec3;
            break;
          case 4:
            details.RuntimeType = pc.Vec4;
            break
        }
      }else {
        details.RuntimeType = pc.Vec3
      }
    }
    if(details.type === "rgb" || details.type === "rgba") {
      details.array = true;
      details.RuntimeType = pc.Color
    }
    if(!this.exposed[system][details.name]) {
      this.exposed[system][details.name] = {}
    }
    this.exposed[system][details.name] = details
  };
  LinkInterface.prototype.add = function(details) {
    logASSERT(details.system, "Missing option: 'system'");
    logASSERT(details.variable, "Missing option: 'variable'");
    if(!this.added[details.system]) {
      this.added[details.system] = {}
    }
    if(!this.added[details.system][details.variable]) {
      this.added[details.system][details.variable] = {}
    }
    this.added[details.system][details.variable] = details
  };
  LinkInterface.prototype.scriptexpose = function(details) {
    this.scripts[details.script] = details
  };
  return{LinkInterface:LinkInterface, link:new LinkInterface}
}());
pc.extend(pc.fw, function() {
  var ContentFile = function(data) {
    this.packs = data.packs || {};
    this.appProperties = data.application_properties || {};
    this.toc = data.toc || {}
  };
  return{ContentFile:ContentFile}
}());
pc.extend(pc.fw, function() {
  var Pack = function(data) {
    this.hierarchy = data.hierarchy;
    this.settings = data.settings
  };
  Pack.prototype = {};
  return{Pack:Pack}
}());
pc.extend(pc.fw, function() {
  var ApplicationContext = function(loader, scene, graphicsDevice, registry, options) {
    this.loader = loader;
    this.scene = scene;
    this.graphicsDevice = graphicsDevice;
    this.root = new pc.fw.Entity;
    var prefix = options.depot ? options.depot.assets.getServer().getBaseUrl() : null;
    this.assets = new pc.asset.AssetRegistry(this.loader, prefix);
    this.systems = registry;
    options = options || {};
    this.controller = options.controller;
    this.keyboard = options.keyboard;
    this.mouse = options.mouse;
    this.touch = options.touch;
    this.gamepads = options.gamepads
  };
  return{ApplicationContext:ApplicationContext}
}());
pc.extend(pc.fw, function() {
  var time;
  var Application = function(canvas, options) {
    options = options || {};
    this._inTools = false;
    pc.events.attach(this);
    this.canvas = canvas;
    this.fillMode = pc.fw.FillMode.KEEP_ASPECT;
    this.resolutionMode = pc.fw.ResolutionMode.FIXED;
    this.librariesLoaded = false;
    this._link = new pc.fw.LiveLink("application");
    this._link.addDestinationWindow(window);
    this._link.listen(this._handleMessage.bind(this));
    pc.log.open();
    this.graphicsDevice = new pc.gfx.Device(canvas);
    this.graphicsDevice.enableValidation(false);
    var registry = new pc.fw.ComponentSystemRegistry;
    this.audioManager = new pc.audio.AudioManager;
    var loader = new pc.resources.ResourceLoader;
    if(options.cache === false) {
      loader.cache = false
    }
    if(options.displayLoader) {
      var loaderdisplay = new pc.resources.ResourceLoaderDisplay(document.body, loader)
    }
    this.context = new pc.fw.ApplicationContext(loader, new pc.scene.Scene, this.graphicsDevice, registry, options);
    if(options.content) {
      this.content = options.content;
      Object.keys(this.content.toc).forEach(function(key) {
        this.context.assets.addGroup(key, this.content.toc[key])
      }.bind(this))
    }
    var textureCache = new pc.resources.TextureCache(loader);
    loader.registerHandler(pc.resources.JsonRequest, new pc.resources.JsonResourceHandler);
    loader.registerHandler(pc.resources.TextRequest, new pc.resources.TextResourceHandler);
    loader.registerHandler(pc.resources.ImageRequest, new pc.resources.ImageResourceHandler);
    loader.registerHandler(pc.resources.MaterialRequest, new pc.resources.MaterialResourceHandler(this.graphicsDevice, this.context.assets));
    loader.registerHandler(pc.resources.TextureRequest, new pc.resources.TextureResourceHandler(this.graphicsDevice));
    loader.registerHandler(pc.resources.ModelRequest, new pc.resources.ModelResourceHandler(this.graphicsDevice, this.context.assets));
    loader.registerHandler(pc.resources.AnimationRequest, new pc.resources.AnimationResourceHandler);
    loader.registerHandler(pc.resources.PackRequest, new pc.resources.PackResourceHandler(registry, options.depot));
    loader.registerHandler(pc.resources.AudioRequest, new pc.resources.AudioResourceHandler(this.audioManager));
    this.renderer = new pc.scene.ForwardRenderer(this.graphicsDevice);
    loader.registerHandler(pc.resources.ScriptRequest, new pc.resources.ScriptResourceHandler(this.context, options.scriptPrefix));
    var rigidbodysys = new pc.fw.RigidBodyComponentSystem(this.context);
    var collisionsys = new pc.fw.CollisionComponentSystem(this.context);
    var ballsocketjointsys = new pc.fw.BallSocketJointComponentSystem(this.context);
    var animationsys = new pc.fw.AnimationComponentSystem(this.context);
    var modelsys = new pc.fw.ModelComponentSystem(this.context);
    var camerasys = new pc.fw.CameraComponentSystem(this.context);
    var cubemapsys = new pc.fw.CubeMapComponentSystem(this.context);
    var staticcubemapsys = new pc.fw.StaticCubeMapComponentSystem(this.context);
    var lightsys = new pc.fw.LightComponentSystem(this.context);
    var packsys = new pc.fw.PackComponentSystem(this.context);
    var skyboxsys = new pc.fw.SkyboxComponentSystem(this.context);
    var scriptsys = new pc.fw.ScriptComponentSystem(this.context);
    var picksys = new pc.fw.PickComponentSystem(this.context);
    var audiosourcesys = new pc.fw.AudioSourceComponentSystem(this.context, this.audioManager);
    var audiolistenersys = new pc.fw.AudioListenerComponentSystem(this.context, this.audioManager);
    var designersys = new pc.fw.DesignerComponentSystem(this.context);
    this.on("librariesloaded", this.onLibrariesLoaded, this);
    if(options.libraries && options.libraries.length) {
      var requests = options.libraries.map(function(url) {
        return new pc.resources.ScriptRequest(url)
      });
      loader.request(requests).then(function(resources) {
        this.fire("librariesloaded", this);
        this.librariesLoaded = true
      }.bind(this))
    }else {
      this.fire("librariesloaded", this);
      this.librariesLoaded = true
    }
    if(typeof document.hidden !== "undefined") {
      this._hiddenAttr = "hidden";
      document.addEventListener("visibilitychange", this.onVisibilityChange.bind(this), false)
    }else {
      if(typeof document.mozHidden !== "undefined") {
        this._hiddenAttr = "mozHidden";
        document.addEventListener("mozvisibilitychange", this.onVisibilityChange.bind(this), false)
      }else {
        if(typeof document.msHidden !== "undefined") {
          this._hiddenAttr = "msHidden";
          document.addEventListener("msvisibilitychange", this.onVisibilityChange.bind(this), false)
        }else {
          if(typeof document.webkitHidden !== "undefined") {
            this._hiddenAttr = "webkitHidden";
            document.addEventListener("webkitvisibilitychange", this.onVisibilityChange.bind(this), false)
          }
        }
      }
    }
    Application._applications[this.canvas.id] = this
  };
  Application._applications = {};
  Application.getApplication = function(id) {
    return Application._applications[id]
  };
  Application.prototype = {loadFromToc:function(name, success, error, progress) {
    if(!this.content) {
      error("No content")
    }
    var toc = this.content.toc[name];
    success = success || function() {
    };
    error = error || function() {
    };
    progress = progress || function() {
    };
    var requests = [];
    var guid = toc.packs[0];
    var onLoaded = function(resources) {
      this.context.loader.request(new pc.resources.PackRequest(guid)).then(function(resources) {
        var pack = resources[0];
        this.context.root.addChild(pack.hierarchy);
        pc.fw.ComponentSystem.initialize(pack.hierarchy);
        pc.fw.ComponentSystem.postInitialize(pack.hierarchy);
        if(this.context.systems.rigidbody && typeof Ammo !== "undefined") {
          var gravity = pack.settings.physics.gravity;
          this.context.systems.rigidbody.setGravity(gravity[0], gravity[1], gravity[2])
        }
        var ambientLight = pack.settings.render.global_ambient;
        this.context.scene.ambientLight = new pc.Color(ambientLight[0], ambientLight[1], ambientLight[2]);
        this.context.scene.fog = pack.settings.render.fog;
        var fogColor = pack.settings.render.fog_color;
        this.context.scene.fogColor = new pc.Color(fogColor[0], fogColor[1], fogColor[2]);
        this.context.scene.fogStart = pack.settings.render.fog_start;
        this.context.scene.fogEnd = pack.settings.render.fog_end;
        this.context.scene.fogDensity = pack.settings.render.fog_density;
        this.context.scene.shadowDistance = pack.settings.render.shadow_distance;
        success(pack);
        this.context.loader.off("progress", progress)
      }.bind(this), function(msg) {
        error(msg)
      }).then(null, function(error) {
        setTimeout(function() {
          throw error;
        }, 0)
      })
    }.bind(this);
    var load = function() {
      var assets = this.context.assets.list(guid);
      this.context.loader.on("progress", progress);
      if(assets.length) {
        this.context.assets.load(assets).then(function(resources) {
          onLoaded(resources)
        })
      }else {
        setTimeout(function() {
          onLoaded([])
        }, 0)
      }
    }.bind(this);
    if(!this.librariesLoaded) {
      this.on("librariesloaded", function() {
        load()
      })
    }else {
      load()
    }
  }, start:function() {
    if(!this.librariesLoaded) {
      this.on("librariesloaded", function() {
        this.tick()
      }, this)
    }else {
      this.tick()
    }
  }, update:function(dt) {
    var context = this.context;
    pc.fw.ComponentSystem.fixedUpdate(1 / 60, context, this._inTools);
    pc.fw.ComponentSystem.update(dt, context, this._inTools);
    pc.fw.ComponentSystem.postUpdate(dt, context, this._inTools);
    this.fire("update", dt);
    if(context.controller) {
      context.controller.update(dt)
    }
    if(context.mouse) {
      context.mouse.update(dt)
    }
    if(context.keyboard) {
      context.keyboard.update(dt)
    }
    if(context.gamepads) {
      context.gamepads.update(dt)
    }
  }, render:function() {
    var context = this.context;
    var cameras = context.systems.camera.cameras;
    var camera = null;
    var renderer = this.renderer;
    context.root.syncHierarchy();
    for(var i = 0, len = cameras.length;i < len;i++) {
      camera = cameras[i];
      camera.frameBegin();
      renderer.render(context.scene, camera.camera);
      camera.frameEnd()
    }
  }, tick:function() {
    requestAnimationFrame(this.tick.bind(this), this.canvas);
    var now = window.performance && window.performance.now ? performance.now() : Date.now();
    var dt = (now - (time || now)) / 1E3;
    time = now;
    dt = pc.math.clamp(dt, 0, 0.1);
    this.update(dt);
    this.render()
  }, setCanvasFillMode:function(mode, width, height) {
    this.fillMode = mode;
    this.resizeCanvas(width, height)
  }, setCanvasResolution:function(mode, width, height) {
    this.resolutionMode = mode;
    if(mode === pc.fw.ResolutionMode.AUTO && width === undefined) {
      width = this.canvas.clientWidth;
      height = this.canvas.clientHeight
    }
    this.graphicsDevice.resizeCanvas(width, height)
  }, isFullscreen:function() {
    return!!document.fullscreenElement
  }, enableFullscreen:function(element, success, error) {
    element = element || this.canvas;
    var s = function() {
      success();
      document.removeEventListener("fullscreenchange", s)
    };
    var e = function() {
      error();
      document.removeEventListener("fullscreenerror", e)
    };
    if(success) {
      document.addEventListener("fullscreenchange", s, false)
    }
    if(error) {
      document.addEventListener("fullscreenerror", e, false)
    }
    element.requestFullscreen()
  }, disableFullscreen:function(success) {
    var s = function() {
      success();
      document.removeEventListener("fullscreenchange", s)
    };
    if(success) {
      document.addEventListener("fullscreenchange", s, false)
    }
    document.exitFullscreen()
  }, isHidden:function() {
    return document[this._hiddenAttr]
  }, onVisibilityChange:function(e) {
    if(this.isHidden()) {
      this.audioManager.suspend()
    }else {
      this.audioManager.resume()
    }
  }, resizeCanvas:function(width, height) {
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    if(navigator.isCocoonJS) {
      width = windowWidth;
      height = windowHeight;
      var ratio = window.devicePixelRatio;
      this.graphicsDevice.resizeCanvas(width * ratio, height * ratio)
    }else {
      if(this.fillMode === pc.fw.FillMode.KEEP_ASPECT) {
        var r = this.canvas.width / this.canvas.height;
        var winR = windowWidth / windowHeight;
        if(r > winR) {
          width = windowWidth;
          height = width / r
        }else {
          height = windowHeight;
          width = height * r
        }
      }else {
        if(this.fillMode === pc.fw.FillMode.FILL_WINDOW) {
          width = windowWidth;
          height = windowHeight
        }else {
        }
      }
      this.canvas.style.width = width + "px";
      this.canvas.style.height = height + "px";
      if(this.resolutionMode === pc.fw.ResolutionMode.AUTO) {
        this.setCanvasResolution(pc.fw.ResolutionMode.AUTO)
      }
    }
    return{width:width, height:height}
  }, onLibrariesLoaded:function() {
    this.context.systems.rigidbody.onLibraryLoaded();
    this.context.systems.collision.onLibraryLoaded()
  }, _handleMessage:function(msg) {
    var entity;
    switch(msg.type) {
      case pc.fw.LiveLinkMessageType.UPDATE_COMPONENT:
        this._linkUpdateComponent(msg.content.id, msg.content.component, msg.content.attribute, msg.content.value);
        break;
      case pc.fw.LiveLinkMessageType.UPDATE_ENTITY:
        this._linkUpdateEntity(msg.content.id, msg.content.components);
        break;
      case pc.fw.LiveLinkMessageType.UPDATE_ENTITY_TRANSFORM:
        this._linkUpdateEntityTransform(msg.content.id, msg.content.position, msg.content.rotation, msg.content.scale);
        break;
      case pc.fw.LiveLinkMessageType.UPDATE_ENTITY_NAME:
        entity = this.context.root.findOne("getGuid", msg.content.id);
        entity.setName(msg.content.name);
        break;
      case pc.fw.LiveLinkMessageType.UPDATE_ENTITY_ENABLED:
        entity = this.context.root.findOne("getGuid", msg.content.id);
        entity.enabled = msg.content.enabled;
        break;
      case pc.fw.LiveLinkMessageType.REPARENT_ENTITY:
        this._linkReparentEntity(msg.content.id, msg.content.newParentId, msg.content.index);
        break;
      case pc.fw.LiveLinkMessageType.CLOSE_ENTITY:
        entity = this.context.root.findOne("getGuid", msg.content.id);
        if(entity) {
          logDEBUG(pc.string.format("RT: Removed '{0}' from parent {1}", msg.content.id, entity.getParent().getGuid()));
          entity.destroy()
        }
        break;
      case pc.fw.LiveLinkMessageType.OPEN_PACK:
        var pack = this.context.loader.open(pc.resources.PackRequest, msg.content.pack);
        var entity = pack.hierarchy;
        if(entity.__parent) {
          parent = this.context.root.findByGuid(entity.__parent);
          parent.addChild(entity)
        }else {
          this.context.root.addChild(entity)
        }
        break;
      case pc.fw.LiveLinkMessageType.OPEN_ENTITY:
        var parent;
        var entities = {};
        var guid = null;
        if(msg.content.entity) {
          var pack = {application_data:{}, hierarchy:msg.content.entity};
          pack = this.context.loader.open(pc.resources.PackRequest, pack);
          entity = pack.hierarchy;
          if(entity.__parent) {
            parent = this.context.root.findByGuid(entity.__parent);
            parent.addChild(entity)
          }else {
            this.context.root.addChild(entity)
          }
        }
        break;
      case pc.fw.LiveLinkMessageType.UPDATE_ASSET:
        this._linkUpdateAsset(msg.content.id, msg.content.attribute, msg.content.value);
        break;
      case pc.fw.LiveLinkMessageType.UPDATE_ASSETCACHE:
        var resourceId;
        for(resourceId in msg.content.assets) {
          var asset = this.context.assets.getAssetByResourceId(resourceId);
          if(!asset) {
            var assetData = msg.content.assets[resourceId];
            this.context.assets.createAndAddAsset(resourceId, assetData)
          }else {
            pc.extend(asset, msg.content.assets[resourceId])
          }
        }
        for(resourceId in msg.content.deleted) {
          var asset = this.context.assets.getAssetByResourceId(resourceId);
          if(asset) {
            this.context.assets.removeAsset(asset)
          }
        }
        break;
      case pc.fw.LiveLinkMessageType.UPDATE_PACK_SETTINGS:
        this._linkUpdatePackSettings(msg.content.settings);
        break
    }
  }, _linkUpdateComponent:function(guid, componentName, attributeName, value) {
    var entity = this.context.root.findOne("getGuid", guid);
    var attribute;
    if(entity) {
      if(componentName) {
        if(entity[componentName]) {
          attribute = editor.link.exposed[componentName][attributeName];
          if(editor && attribute) {
            if(attribute.RuntimeType) {
              if(attribute.RuntimeType === pc.Vec3) {
                entity[componentName][attributeName] = new attribute.RuntimeType(value[0], value[1], value[2])
              }else {
                if(attribute.RuntimeType === pc.Vec4) {
                  entity[componentName][attributeName] = new attribute.RuntimeType(value[0], value[1], value[2], value[3])
                }else {
                  if(attribute.RuntimeType === pc.Vec2) {
                    entity[componentName][attributeName] = new attribute.RuntimeType(value[0], value[1])
                  }else {
                    if(attribute.RuntimeType === pc.Color) {
                      if(value.length === 3) {
                        entity[componentName][attributeName] = new attribute.RuntimeType(value[0], value[1], value[2])
                      }else {
                        entity[componentName][attributeName] = new attribute.RuntimeType(value[0], value[1], value[2], value[3])
                      }
                    }else {
                      entity[componentName][attributeName] = new attribute.RuntimeType(value)
                    }
                  }
                }
              }
            }else {
              entity[componentName][attributeName] = value
            }
          }else {
            entity[componentName][attributeName] = value
          }
        }else {
          logWARNING(pc.string.format("No component system called '{0}' exists", componentName))
        }
      }else {
        entity[attributeName] = value
      }
    }
  }, _linkUpdateEntityTransform:function(guid, position, rotation, scale) {
    var entity = this.context.root.findByGuid(guid);
    if(entity) {
      entity.setLocalPosition(position[0], position[1], position[2]);
      entity.setLocalEulerAngles(rotation[0], rotation[1], rotation[2]);
      entity.setLocalScale(scale[0], scale[1], scale[2]);
      entity.fire("livelink:updatetransform", position, rotation, scale)
    }
  }, _linkReparentEntity:function(guid, parentId, index) {
    var entity = this.context.root.findByGuid(guid);
    var parent = this.context.root.findByGuid(parentId);
    entity.reparent(parent)
  }, _linkUpdateEntity:function(guid, components) {
    var type;
    var entity = this.context.root.findOne("getGuid", guid);
    if(entity) {
      var order = this.context.systems.getComponentSystemOrder();
      var i, len = order.length;
      for(i = 0;i < len;i++) {
        type = order[i];
        if(components.hasOwnProperty(type) && this.context.systems.hasOwnProperty(type)) {
          if(!entity[type]) {
            this.context.systems[type].addComponent(entity, {})
          }
        }
      }
      for(type in this.context.systems) {
        if(type === "gizmo" || type === "pick") {
          continue
        }
        if(this.context.systems.hasOwnProperty(type)) {
          if(!components.hasOwnProperty(type) && entity[type]) {
            this.context.systems[type].removeComponent(entity)
          }
        }
      }
    }
  }, _linkUpdateAsset:function(guid, attribute, value) {
    var asset = this.context.assets.getAssetByResourceId(guid);
    if(asset) {
      asset[attribute] = value;
      asset.fire("change", asset, attribute, value)
    }
  }, _linkUpdatePackSettings:function(settings) {
    var ambient = settings.render.global_ambient;
    this.context.scene.ambientLight.set(ambient[0], ambient[1], ambient[2]);
    if(this.context.systems.rigidbody && typeof Ammo !== "undefined") {
      var gravity = settings.physics.gravity;
      this.context.systems.rigidbody.setGravity(gravity[0], gravity[1], gravity[2])
    }
    this.context.scene.fog = settings.render.fog;
    this.context.scene.fogStart = settings.render.fog_start;
    this.context.scene.fogEnd = settings.render.fog_end;
    var fog = settings.render.fog_color;
    this.context.scene.fogColor = new pc.Color(fog[0], fog[1], fog[2]);
    this.context.scene.fogDensity = settings.render.fog_density;
    this.context.scene.shadowDistance = settings.render.shadow_distance
  }};
  return{FillMode:{NONE:"NONE", FILL_WINDOW:"FILL_WINDOW", KEEP_ASPECT:"KEEP_ASPECT"}, ResolutionMode:{AUTO:"AUTO", FIXED:"FIXED"}, Application:Application}
}());
pc.extend(pc.resources, function() {
  var PackResourceHandler = function(registry, depot) {
    this._registry = registry;
    this._depot = depot
  };
  PackResourceHandler = pc.inherits(PackResourceHandler, pc.resources.ResourceHandler);
  PackResourceHandler.prototype.load = function(request, options) {
    options = options || {};
    var promise = new pc.promise.Promise(function(resolve, reject) {
      var guid = request.canonical;
      if(guid in pc.content.packs) {
        setTimeout(function() {
          resolve(pc.content.packs[guid])
        }, 0)
      }else {
        this._depot.packs.getOne(guid, function(pack) {
          resolve(pack)
        }.bind(this), function(errors) {
          reject(errors)
        })
      }
    }.bind(this));
    return promise
  };
  PackResourceHandler.prototype.open = function(data, request, options) {
    var pack = this.openPack(data, request);
    return pack
  };
  PackResourceHandler.prototype.openPack = function(data, request) {
    var d = pc.extend({}, data);
    d.hierarchy = this.openEntity(d.hierarchy, request);
    return new pc.fw.Pack(d)
  };
  PackResourceHandler.prototype.openEntity = function(data, request) {
    var hierarchy;
    hierarchy = this.openEntityHierarchy(data, request);
    hierarchy.syncHierarchy();
    hierarchy = this.openComponentData(hierarchy, data, request);
    return hierarchy
  };
  PackResourceHandler.prototype.openEntityHierarchy = function(data, request) {
    var entity = new pc.fw.Entity;
    var p = data.position;
    var r = data.rotation;
    var s = data.scale;
    entity.setName(data.name);
    entity.setGuid(data.resource_id);
    entity.setLocalPosition(p[0], p[1], p[2]);
    entity.setLocalEulerAngles(r[0], r[1], r[2]);
    entity.setLocalScale(s[0], s[1], s[2]);
    entity._enabled = data.enabled !== undefined ? data.enabled : true;
    entity._enabledInHierarchy = entity._enabled;
    if(data.labels) {
      data.labels.forEach(function(label) {
        entity.addLabel(label)
      })
    }
    entity.__parent = data.parent;
    entity.__children = data.children;
    entity.name = data.name;
    entity.template = data.template;
    var i, child, length = data.children.length;
    for(i = 0;i < length;i++) {
      child = this.openEntityHierarchy(data.children[i], request);
      entity.addChild(child)
    }
    return entity
  };
  PackResourceHandler.prototype.openComponentData = function(entity, data, request) {
    entity.setRequest(request);
    var systems = this._registry.list();
    var i, len = systems.length;
    for(i = 0;i < len;i++) {
      var componentData = data.components[systems[i].id];
      if(componentData) {
        this._registry[systems[i].id].addComponent(entity, componentData)
      }
    }
    entity.setRequest(null);
    var child, length = data.children.length;
    var children = entity.getChildren();
    for(i = 0;i < length;i++) {
      children[i] = this.openComponentData(children[i], data.children[i], request)
    }
    return entity
  };
  var PackRequest = function PackRequest(identifier) {
  };
  PackRequest = pc.inherits(PackRequest, pc.resources.ResourceRequest);
  PackRequest.prototype.type = "pack";
  PackRequest.prototype.Type = pc.fw.Pack;
  return{PackResourceHandler:PackResourceHandler, PackRequest:PackRequest}
}());
pc.extend(pc.fw, function() {
  var ComponentSystemRegistry = function() {
  };
  ComponentSystemRegistry.prototype = {add:function(name, system) {
    if(!this[name]) {
      this[name] = system;
      system.name = name
    }else {
      throw new Error(pc.string.format("ComponentSystem name '{0}' already registered or not allowed", name));
    }
  }, remove:function(name) {
    if(!this[name]) {
      throw new Error(pc.string.format("No ComponentSystem named '{0}' registered", name));
    }
    delete this[name]
  }, list:function() {
    var list = Object.keys(this);
    var defaultPriority = 1;
    var priorities = {"collisionrect":0.5, "collisioncircle":0.5};
    list.sort(function(a, b) {
      var pa = priorities[a] || defaultPriority;
      var pb = priorities[b] || defaultPriority;
      if(pa < pb) {
        return-1
      }else {
        if(pa > pb) {
          return 1
        }
      }
      return 0
    });
    return list.map(function(key) {
      return this[key]
    }, this)
  }, getComponentSystemOrder:function() {
    var index;
    var names = Object.keys(this);
    index = names.indexOf("collisionrect");
    names.splice(index, 1);
    names.unshift("collisionrect");
    index = names.indexOf("collisioncircle");
    names.splice(index, 1);
    names.unshift("collisioncircle");
    return names
  }};
  return{ComponentSystemRegistry:ComponentSystemRegistry}
}());
pc.extend(pc.fw, function() {
  var ComponentSystem = function(context) {
    this.context = context;
    this.dataStore = {};
    this.schema = [];
    pc.events.attach(this)
  };
  pc.extend(ComponentSystem, {initialize:function(root) {
    ComponentSystem.fire("initialize", root)
  }, postInitialize:function(root) {
    ComponentSystem.fire("postInitialize", root)
  }, update:function(dt, context, inTools) {
    if(inTools) {
      ComponentSystem.fire("toolsUpdate", dt)
    }else {
      ComponentSystem.fire("update", dt)
    }
  }, fixedUpdate:function(dt) {
    ComponentSystem.fire("fixedUpdate", dt)
  }, postUpdate:function(dt) {
    ComponentSystem.fire("postUpdate", dt)
  }});
  ComponentSystem.prototype = {get store() {
    return this.dataStore
  }, addComponent:function(entity, data) {
    var component = new this.ComponentType(this, entity);
    var componentData = new this.DataType;
    data = data || {};
    this.dataStore[entity.getGuid()] = {entity:entity, data:componentData};
    entity[this.id] = component;
    entity.c[this.id] = component;
    this.initializeComponentData(component, data, []);
    this.fire("add", entity, component);
    return component
  }, removeComponent:function(entity) {
    var record = this.dataStore[entity.getGuid()];
    var component = entity.c[this.id];
    this.fire("beforeremove", entity, component);
    delete this.dataStore[entity.getGuid()];
    delete entity[this.id];
    delete entity.c[this.id];
    this.fire("remove", entity, record.data)
  }, cloneComponent:function(entity, clone) {
    var src = this.dataStore[entity.getGuid()];
    return this.addComponent(clone, src.data)
  }, initializeComponentData:function(component, data, properties) {
    data = data || {};
    properties.forEach(function(value) {
      if(typeof data[value] !== "undefined") {
        component[value] = data[value]
      }else {
        component[value] = component.data[value]
      }
    }, this);
    if(component.enabled && component.entity.enabled) {
      component.onEnable()
    }
  }, exposeProperties:function() {
    editor.link.addComponentType(this);
    this.schema.forEach(function(prop) {
      if(prop.exposed !== false) {
        editor.link.expose(this.id, prop)
      }
    }.bind(this))
  }};
  pc.events.attach(ComponentSystem);
  return{ComponentSystem:ComponentSystem}
}());
pc.extend(pc.fw, function() {
  var Component = function(system, entity) {
    this.system = system;
    this.entity = entity;
    pc.events.attach(this);
    this.buildAccessors(this.system.schema);
    this.on("set", function(name, oldValue, newValue) {
      this.fire("set_" + name, name, oldValue, newValue)
    });
    this.on("set_enabled", this.onSetEnabled, this)
  };
  Component.prototype = {get data() {
    var record = this.system.store[this.entity.getGuid()];
    if(record) {
      return record.data
    }else {
      return null
    }
  }, buildAccessors:function(schema) {
    schema.forEach(function(prop) {
      var set;
      if(prop.readOnly) {
        Object.defineProperty(this, prop.name, {get:function() {
          return this.data[prop.name]
        }, configurable:true})
      }else {
        Object.defineProperty(this, prop.name, {get:function() {
          return this.data[prop.name]
        }, set:function(value) {
          var data = this.data;
          var oldValue = data[prop.name];
          data[prop.name] = value;
          this.fire("set", prop.name, oldValue, value)
        }, configurable:true})
      }
    }.bind(this))
  }, onSetEnabled:function(name, oldValue, newValue) {
    if(oldValue !== newValue) {
      if(this.entity.enabled) {
        if(newValue) {
          this.onEnable()
        }else {
          this.onDisable()
        }
      }
    }
  }, onEnable:function() {
  }, onDisable:function() {
  }};
  return{Component:Component}
}());
pc.extend(pc.fw, function() {
  var ComponentData = function() {
  };
  return{ComponentData:ComponentData}
}());
pc.extend(pc.fw, function() {
  var AnimationComponent = function(system, entity) {
    this.on("set_animations", this.onSetAnimations, this);
    this.on("set_assets", this.onSetAssets, this);
    this.on("set_loop", this.onSetLoop, this)
  };
  AnimationComponent = pc.inherits(AnimationComponent, pc.fw.Component);
  pc.extend(AnimationComponent.prototype, {play:function(name, blendTime) {
    if(!this.data.animations[name]) {
      console.error(pc.string.format("Trying to play animation '{0}' which doesn't exist", name));
      return
    }
    if(!this.enabled || !this.entity.enabled) {
      return
    }
    blendTime = blendTime || 0;
    var data = this.data;
    data.prevAnim = data.currAnim;
    data.currAnim = name;
    if(data.model) {
      data.blending = blendTime > 0;
      if(data.blending) {
        data.blendTime = blendTime;
        data.blendTimeRemaining = blendTime;
        data.fromSkel.setAnimation(data.animations[data.prevAnim]);
        data.fromSkel.addTime(data.skeleton.getCurrentTime());
        data.toSkel.setAnimation(data.animations[data.currAnim])
      }else {
        data.skeleton.setAnimation(data.animations[data.currAnim])
      }
    }
    data.playing = true
  }, getAnimation:function(name) {
    return this.data.animations[name]
  }, setModel:function(model) {
    var data = this.data;
    if(model) {
      var graph = model.getGraph();
      data.fromSkel = new pc.anim.Skeleton(graph);
      data.toSkel = new pc.anim.Skeleton(graph);
      data.skeleton = new pc.anim.Skeleton(graph);
      data.skeleton.setLooping(data.loop);
      data.skeleton.setGraph(graph)
    }
    data.model = model;
    if(data.animations && data.currAnim && data.animations[data.currAnim]) {
      this.play(data.currAnim)
    }
  }, loadAnimationAssets:function(guids) {
    if(!guids || !guids.length) {
      return
    }
    var options = {parent:this.entity.getRequest()};
    var assets = guids.map(function(guid) {
      return this.system.context.assets.getAssetByResourceId(guid)
    }, this);
    var names = [];
    var requests = assets.map(function(asset) {
      if(!asset) {
        logERROR(pc.string.format("Trying to load animation component before assets {0} are loaded", guids))
      }else {
        names.push(asset.name);
        return new pc.resources.AnimationRequest(asset.getFileUrl())
      }
    });
    this.system.context.loader.request(requests, options).then(function(animResources) {
      var animations = {};
      for(var i = 0;i < requests.length;i++) {
        animations[names[i]] = animResources[i]
      }
      this.animations = animations
    }.bind(this))
  }, onSetAnimations:function(name, oldValue, newValue) {
    var data = this.data;
    var modelComponent = this.entity.model;
    if(modelComponent) {
      var m = modelComponent.model;
      if(m) {
        this.entity.animation.setModel(m)
      }
    }
    for(var animName in data.animations) {
      if(data.activate && data.enabled && this.entity.enabled) {
        this.play(animName, 0)
      }
      break
    }
  }, onSetAssets:function(name, oldValue, newValue) {
    this.loadAnimationAssets(newValue)
  }, onSetLoop:function(name, oldValue, newValue) {
    if(this.data.skeleton) {
      this.data.skeleton.setLooping(this.data.loop)
    }
  }, onSetCurrentTime:function(name, oldValue, newValue) {
    this.data.skeleton.setCurrentTime(newValue);
    this.data.skeleton.addTime(0);
    this.data.skeleton.updateGraph()
  }, onEnable:function() {
    AnimationComponent._super.onEnable.call(this);
    if(this.data.activate && !this.data.currAnim) {
      for(var animName in this.data.animations) {
        this.play(animName, 0);
        break
      }
    }
  }});
  Object.defineProperties(AnimationComponent.prototype, {currentTime:{get:function() {
    return this.data.skeleton.getCurrentTime()
  }, set:function(currentTime) {
    this.data.skeleton.setCurrentTime(currentTime);
    this.data.skeleton.addTime(0);
    this.data.skeleton.updateGraph()
  }}, duration:{get:function() {
    return this.data.animations[this.data.currAnim].getDuration()
  }}});
  return{AnimationComponent:AnimationComponent}
}());
pc.extend(pc.fw, function() {
  var AnimationComponentSystem = function AnimationComponentSystem(context) {
    this.id = "animation";
    this.description = "Specifies the animation assets that can run on the model specified by the Entity's model Component.";
    context.systems.add(this.id, this);
    this.ComponentType = pc.fw.AnimationComponent;
    this.DataType = pc.fw.AnimationComponentData;
    this.schema = [{name:"enabled", displayName:"Enabled", description:"Disabled animation components do not play any animations", type:"boolean", defaultValue:true}, {name:"assets", displayName:"Asset", description:"Animation Asset", type:"asset", options:{max:100, type:"animation"}, defaultValue:[]}, {name:"speed", displayName:"Speed Factor", description:"Scale the animation playback speed", type:"number", options:{min:0, step:0.1}, defaultValue:1}, {name:"loop", displayName:"Loop", description:"Loop the animation back to the start on completion", 
    type:"boolean", defaultValue:true}, {name:"activate", displayName:"Activate", description:"Play the configured animation on load", type:"boolean", defaultValue:true}, {name:"animations", exposed:false}, {name:"skeleton", exposed:false, readOnly:true}, {name:"model", exposed:false, readOnly:true}, {name:"prevAnim", exposed:false, readOnly:true}, {name:"currAnim", exposed:false, readOnly:true}, {name:"fromSkel", exposed:false, readOnly:true}, {name:"toSkel", exposed:false, readOnly:true}, {name:"blending", 
    exposed:false, readOnly:true}, {name:"blendTime", exposed:false, readOnly:true}, {name:"blendTimeRemaining", exposed:false, readOnly:true}, {name:"playing", exposed:false, readOnly:true}];
    this.exposeProperties();
    this.on("remove", this.onRemove, this);
    this.on("update", this.onUpdate, this);
    pc.fw.ComponentSystem.on("update", this.onUpdate, this)
  };
  AnimationComponentSystem = pc.inherits(AnimationComponentSystem, pc.fw.ComponentSystem);
  pc.extend(AnimationComponentSystem.prototype, {initializeComponentData:function(component, data, properties) {
    properties = ["activate", "loop", "speed", "assets", "enabled"];
    AnimationComponentSystem._super.initializeComponentData.call(this, component, data, properties)
  }, cloneComponent:function(entity, clone) {
    var component = this.addComponent(clone, {});
    clone.animation.data.assets = pc.extend([], entity.animation.assets);
    clone.animation.data.speed = entity.animation.speed;
    clone.animation.data.loop = entity.animation.loop;
    clone.animation.data.activate = entity.animation.activate;
    clone.animation.data.enabled = entity.animation.enabled;
    clone.animation.animations = pc.extend({}, entity.animation.animations)
  }, onRemove:function(entity, data) {
    delete data.animation;
    delete data.skeleton;
    delete data.fromSkel;
    delete data.toSkel
  }, onUpdate:function(dt) {
    var components = this.store;
    for(var id in components) {
      if(components.hasOwnProperty(id)) {
        var component = components[id];
        var componentData = component.data;
        if(componentData.enabled && componentData.playing && component.entity.enabled) {
          var skeleton = componentData.skeleton;
          if(skeleton !== null && componentData.model !== null) {
            if(componentData.blending) {
              componentData.blendTimeRemaining -= dt;
              if(componentData.blendTimeRemaining < 0) {
                componentData.blendTimeRemaining = 0
              }
              var alpha = 1 - componentData.blendTimeRemaining / componentData.blendTime;
              skeleton.blend(componentData.fromSkel, componentData.toSkel, alpha)
            }else {
              var delta = dt * componentData.speed;
              skeleton.addTime(delta);
              if(skeleton.getCurrentTime() === skeleton.getAnimation().getDuration() && !componentData.loop) {
                componentData.playing = false
              }
            }
            if(componentData.blending && componentData.blendTimeRemaining === 0) {
              componentData.blending = false;
              skeleton.setAnimation(componentData.toSkel.getAnimation())
            }
            skeleton.updateGraph()
          }
        }
      }
    }
  }});
  return{AnimationComponentSystem:AnimationComponentSystem}
}());
pc.extend(pc.fw, function() {
  var AnimationComponentData = function() {
    this.assets = [];
    this.speed = 1;
    this.loop = true;
    this.activate = true;
    this.enabled = true;
    this.animations = null;
    this.skeleton = null;
    this.model = null;
    this.prevAnim = null;
    this.currAnim = null;
    this.fromSkel = null;
    this.toSkel = null;
    this.blending = false;
    this.blendTime = 0;
    this.blendTimeRemaining = 0;
    this.playing = false
  };
  AnimationComponentData = pc.inherits(AnimationComponentData, pc.fw.ComponentData);
  return{AnimationComponentData:AnimationComponentData}
}());
pc.extend(pc.fw, function() {
  var ModelComponentSystem = function ModelComponentSystem(context) {
    this.id = "model";
    this.description = "Renders a 3D model at the location of the Entity.";
    context.systems.add(this.id, this);
    this.ComponentType = pc.fw.ModelComponent;
    this.DataType = pc.fw.ModelComponentData;
    this.schema = [{name:"enabled", displayName:"Enabled", description:"Enable or disable rendering of the Model", type:"boolean", defaultValue:true}, {name:"type", displayName:"Type", description:"Type of model", type:"enumeration", options:{enumerations:[{name:"Asset", value:"asset"}, {name:"Box", value:"box"}, {name:"Capsule", value:"capsule"}, {name:"Sphere", value:"sphere"}, {name:"Cylinder", value:"cylinder"}, {name:"Cone", value:"cone"}]}, defaultValue:"asset"}, {name:"asset", displayName:"Asset", 
    description:"Model Asset to render", type:"asset", options:{max:1, type:"model"}, defaultValue:null, filter:{type:"asset"}}, {name:"materialAsset", displayName:"Material", description:"The material of the model", type:"asset", options:{max:1, type:"material"}, defaultValue:null, filter:{type:function(value) {
      return false
    }}}, {name:"castShadows", displayName:"Cast shadows", description:"Occlude light from shadow casting lights", type:"boolean", defaultValue:false}, {name:"receiveShadows", displayName:"Receive shadows", description:"Receive shadows cast from occluders", type:"boolean", defaultValue:true}, {name:"material", exposed:false}, {name:"model", exposed:false}];
    this.exposeProperties();
    var gd = context.graphicsDevice;
    this.box = pc.scene.procedural.createBox(gd, {halfExtents:new pc.Vec3(0.5, 0.5, 0.5)});
    this.capsule = pc.scene.procedural.createCapsule(gd, {radius:0.5, height:2});
    this.sphere = pc.scene.procedural.createSphere(gd, {radius:0.5});
    this.cone = pc.scene.procedural.createCone(gd, {baseRadius:0.5, peakRadius:0, height:1});
    this.cylinder = pc.scene.procedural.createCylinder(gd, {radius:0.5, height:1});
    this.defaultMaterial = new pc.scene.PhongMaterial
  };
  ModelComponentSystem = pc.inherits(ModelComponentSystem, pc.fw.ComponentSystem);
  pc.extend(ModelComponentSystem.prototype, {initializeComponentData:function(component, data, properties) {
    data.material = this.defaultMaterial;
    properties = ["material", "materialAsset", "asset", "castShadows", "receiveShadows", "type", "enabled"];
    ModelComponentSystem._super.initializeComponentData.call(this, component, data, properties)
  }, removeComponent:function(entity) {
    var data = entity.model.data;
    entity.model.asset = null;
    if(data.type !== "asset" && data.model) {
      this.context.scene.removeModel(data.model);
      entity.removeChild(data.model.getGraph());
      data.model = null
    }
    ModelComponentSystem._super.removeComponent.call(this, entity)
  }, cloneComponent:function(entity, clone) {
    var component = this.addComponent(clone, {});
    clone.model.data.type = entity.model.type;
    clone.model.data.materialAsset = entity.model.materialAsset;
    clone.model.data.asset = entity.model.asset;
    clone.model.data.castShadows = entity.model.castShadows;
    clone.model.data.receiveShadows = entity.model.receiveShadows;
    clone.model.data.material = entity.model.material;
    clone.model.data.enabled = entity.model.enabled;
    if(entity.model.model) {
      clone.model.model = entity.model.model.clone()
    }
  }});
  return{ModelComponentSystem:ModelComponentSystem}
}());
pc.extend(pc.fw, function() {
  var ModelComponent = function ModelComponent(system, entity) {
    this.on("set_type", this.onSetType, this);
    this.on("set_asset", this.onSetAsset, this);
    this.on("set_castShadows", this.onSetCastShadows, this);
    this.on("set_model", this.onSetModel, this);
    this.on("set_receiveShadows", this.onSetReceiveShadows, this);
    this.on("set_material", this.onSetMaterial, this);
    Object.defineProperty(this, "materialAsset", {set:this.setMaterialAsset.bind(this), get:this.getMaterialAsset.bind(this)})
  };
  ModelComponent = pc.inherits(ModelComponent, pc.fw.Component);
  pc.extend(ModelComponent.prototype, {setVisible:function(visible) {
    console.warn("WARNING: setVisible: Function is deprecated. Set enabled property instead.");
    this.enabled = visible
  }, loadModelAsset:function(guid) {
    var options = {parent:this.entity.getRequest()};
    var asset = this.system.context.assets.getAssetByResourceId(guid);
    if(!asset) {
      logERROR(pc.string.format("Trying to load model before asset {0} is loaded.", guid));
      return
    }
    function _onLoad(resources) {
      var model = resources[0];
      if(this.system.context.designer) {
        model.generateWireframe()
      }
      asset.on("change", this.onAssetChange, this);
      if(this.data.type === "asset") {
        this.model = model
      }
    }
    if(asset.resource) {
      setTimeout(function() {
        var model = asset.resource.clone();
        _onLoad.call(this, [model])
      }.bind(this), 0)
    }else {
      this.system.context.assets.load(asset, [], options).then(_onLoad.bind(this))
    }
  }, onSetType:function(name, oldValue, newValue) {
    var data = this.data;
    if(newValue) {
      var mesh = null;
      if(newValue === "asset") {
        if(this.data.asset) {
          this.loadModelAsset(this.data.asset)
        }else {
          this.model = null
        }
      }else {
        switch(newValue) {
          case "box":
            mesh = this.system.box;
            break;
          case "capsule":
            mesh = this.system.capsule;
            break;
          case "sphere":
            mesh = this.system.sphere;
            break;
          case "cone":
            mesh = this.system.cone;
            break;
          case "cylinder":
            mesh = this.system.cylinder;
            break;
          default:
            throw new Error("Invalid model type: " + newValue);
        }
        var node = new pc.scene.GraphNode;
        var model = new pc.scene.Model;
        model.graph = node;
        model.meshInstances = [new pc.scene.MeshInstance(node, mesh, data.material)];
        if(this.system.context.designer) {
          model.generateWireframe()
        }
        this.model = model
      }
    }
  }, onSetAsset:function(name, oldValue, newValue) {
    if(oldValue) {
      var asset = this.system.context.assets.getAssetByResourceId(oldValue);
      if(asset) {
        asset.off("change", this.onAssetChange, this)
      }
    }
    if(this.data.type === "asset") {
      if(newValue) {
        if(newValue instanceof pc.asset.Asset) {
          this.data.asset = newValue.resourceId;
          this.loadModelAsset(newValue.resourceId)
        }else {
          this.loadModelAsset(newValue)
        }
      }else {
        this.model = null
      }
    }
  }, onSetCastShadows:function(name, oldValue, newValue) {
    var model = this.data.model;
    if(model) {
      var scene = this.system.context.scene;
      var inScene = scene.containsModel(model);
      if(inScene) {
        scene.removeModel(model)
      }
      var meshInstances = model.meshInstances;
      for(var i = 0;i < meshInstances.length;i++) {
        meshInstances[i].castShadow = newValue
      }
      if(inScene) {
        scene.addModel(model)
      }
    }
  }, onSetModel:function(name, oldValue, newValue) {
    if(oldValue) {
      this.system.context.scene.removeModel(oldValue);
      this.entity.removeChild(oldValue.getGraph());
      delete oldValue._entity
    }
    if(newValue) {
      var componentData = this.data;
      var meshInstances = newValue.meshInstances;
      for(var i = 0;i < meshInstances.length;i++) {
        meshInstances[i].castShadow = componentData.castShadows;
        meshInstances[i].receiveShadow = componentData.receiveShadows
      }
      this.entity.addChild(newValue.graph);
      if(this.enabled && this.entity.enabled) {
        this.system.context.scene.addModel(newValue)
      }
      newValue._entity = this.entity;
      if(this.entity.animation) {
        this.entity.animation.setModel(newValue)
      }
    }
  }, setMaterialAsset:function(newValue) {
    var guid = typeof newValue === "string" || !newValue ? newValue : newValue.resourceId;
    var material;
    if(guid) {
      var asset = this.system.context.assets.getAssetByResourceId(guid);
      if(asset) {
        if(asset.resource) {
          material = asset.resource;
          this.material = material
        }else {
          this.system.context.assets.load(asset).then(function(materials) {
            this.material = materials[0]
          }.bind(this))
        }
      }else {
        console.error(pc.string.format("Entity '{0}' is trying to load Material Asset {1} which no longer exists. Maybe this model was once a primitive shape?", this.entity.getName(), guid))
      }
    }
    if(!material) {
      material = this.system.defaultMaterial
    }
    this.material = material;
    var oldValue = this.data.materialAsset;
    this.data.materialAsset = guid;
    this.fire("set", "materialAsset", oldValue, guid)
  }, getMaterialAsset:function() {
    return this.system.context.assets.getAssetByResourceId(this.data.materialAsset)
  }, onSetMaterial:function(name, oldValue, newValue) {
    if(newValue !== oldValue) {
      this.data.material = newValue;
      if(this.data.model && this.data.type !== "asset") {
        var meshInstances = this.data.model.meshInstances;
        for(var i = 0;i < meshInstances.length;i++) {
          meshInstances[i].material = newValue
        }
      }
    }
  }, onSetReceiveShadows:function(name, oldValue, newValue) {
    if(newValue !== undefined) {
      var componentData = this.data;
      if(componentData.model) {
        var meshInstances = componentData.model.meshInstances;
        for(var i = 0;i < meshInstances.length;i++) {
          meshInstances[i].receiveShadow = newValue
        }
      }
    }
  }, onEnable:function() {
    ModelComponent._super.onEnable.call(this);
    var model = this.data.model;
    if(model) {
      var inScene = this.system.context.scene.containsModel(model);
      if(!inScene) {
        this.system.context.scene.addModel(model)
      }
    }
  }, onDisable:function() {
    ModelComponent._super.onDisable.call(this);
    var model = this.data.model;
    if(model) {
      var inScene = this.system.context.scene.containsModel(model);
      if(inScene) {
        this.system.context.scene.removeModel(model)
      }
    }
  }, onAssetChange:function(asset) {
    asset.resource = null;
    this.system.context.loader.removeFromCache(asset.getFileUrl());
    this.asset = null;
    this.asset = asset.resourceId
  }});
  return{ModelComponent:ModelComponent}
}());
pc.extend(pc.fw, function() {
  var ModelComponentData = function() {
    this.enabled = true;
    this.type = "asset";
    this.asset = null;
    this.castShadows = false;
    this.receiveShadows = true;
    this.materialAsset = null;
    this.material = null;
    this.model = null
  };
  ModelComponentData = pc.inherits(ModelComponentData, pc.fw.ComponentData);
  return{ModelComponentData:ModelComponentData}
}());
pc.extend(pc.fw, function() {
  var SkyboxComponentSystem = function SkyboxComponentSystem(context) {
    this.id = "skybox";
    this.description = "Renders a skybox in the scene.";
    context.systems.add(this.id, this);
    this.ComponentType = pc.fw.SkyboxComponent;
    this.DataType = pc.fw.SkyboxComponentData;
    this.schema = [{name:"enabled", displayName:"Enabled", description:"Enables or disables the component", type:"boolean", defaultValue:true}, {name:"posx", displayName:"POSX", description:"URL of the positive X face of skybox cubemap", type:"asset", options:{max:1, type:"texture"}, defaultValue:null}, {name:"negx", displayName:"NEGX", description:"URL of the negative X face of skybox cubemap", type:"asset", options:{max:1, type:"texture"}, defaultValue:null}, {name:"posy", displayName:"POSY", description:"URL of the positive Y face of skybox cubemap", 
    type:"asset", options:{max:1, type:"texture"}, defaultValue:null}, {name:"negy", displayName:"NEGY", description:"URL of the negative Y face of skybox cubemap", type:"asset", options:{max:1, type:"texture"}, defaultValue:null}, {name:"posz", displayName:"POSZ", description:"URL of the positive Z face of skybox cubemap", type:"asset", options:{max:1, type:"texture"}, defaultValue:null}, {name:"negz", displayName:"NEGZ", description:"URL of the negative Z face of skybox cubemap", type:"asset", 
    options:{max:1, type:"texture"}, defaultValue:null}, {name:"model", exposed:false, readOnly:true}, {name:"assets", exposed:false, readOnly:true}];
    this.exposeProperties();
    this.on("remove", this.onRemove, this)
  };
  SkyboxComponentSystem = pc.inherits(SkyboxComponentSystem, pc.fw.ComponentSystem);
  pc.extend(SkyboxComponentSystem.prototype, {initializeComponentData:function(component, data, properties) {
    var properties = ["enabled", "posx", "negx", "posy", "negy", "posz", "negz"];
    SkyboxComponentSystem._super.initializeComponentData.call(this, component, data, properties)
  }, onRemove:function(entity, data) {
    if(data.model) {
      this.context.scene.removeModel(data.model);
      entity.removeChild(data.model.getGraph());
      data.model = null
    }
  }});
  return{SkyboxComponentSystem:SkyboxComponentSystem}
}());
pc.extend(pc.fw, function() {
  var SkyboxComponent = function SkyboxComponent(system, entity) {
    this.on("set", this.onSet, this)
  };
  SkyboxComponent = pc.inherits(SkyboxComponent, pc.fw.Component);
  pc.extend(SkyboxComponent.prototype, {onSet:function(name, oldValue, newValue) {
    function _loadTextureAsset(name, guid) {
      if(!guid) {
        return
      }
      var index = CUBE_MAP_NAMES.indexOf(name);
      var assets = this.entity.skybox.assets;
      this.data.model = null;
      if(guid) {
        assets[index] = this.system.context.assets.getAssetByResourceId(guid);
        if(!assets[index]) {
          logERROR(pc.string.format("Trying to load skybox component before asset {0} has loaded", guid));
          return
        }
        this.data.assets = assets;
        if(assets[0] && assets[1] && assets[2] && assets[3] && assets[4] && assets[5]) {
          var urls = assets.map(function(asset) {
            return asset.getFileUrl()
          });
          this.data.model = _createSkybox(this.entity, this.system.context, urls);
          if(this.enabled && this.entity.enabled) {
            this.system.context.scene.addModel(this.data.model);
            this.entity.addChild(this.data.model.graph)
          }
        }
      }else {
        delete assets[index]
      }
    }
    var functions = {"posx":function(entity, name, oldValue, newValue) {
      _loadTextureAsset.call(this, name, newValue)
    }, "negx":function(entity, name, oldValue, newValue) {
      _loadTextureAsset.call(this, name, newValue)
    }, "posy":function(entity, name, oldValue, newValue) {
      _loadTextureAsset.call(this, name, newValue)
    }, "negy":function(entity, name, oldValue, newValue) {
      _loadTextureAsset.call(this, name, newValue)
    }, "posz":function(entity, name, oldValue, newValue) {
      _loadTextureAsset.call(this, name, newValue)
    }, "negz":function(entity, name, oldValue, newValue) {
      _loadTextureAsset.call(this, name, newValue)
    }};
    if(functions[name]) {
      functions[name].call(this, this.entity, name, oldValue, newValue)
    }
  }, onEnable:function() {
    SkyboxComponent._super.onEnable.call(this);
    if(this.data.model) {
      if(!this.system.context.scene.containsModel(this.data.model)) {
        this.system.context.scene.addModel(this.data.model);
        this.entity.addChild(this.data.model.graph)
      }
    }
  }, onDisable:function() {
    SkyboxComponent._super.onDisable.call(this);
    if(this.data.model) {
      if(this.system.context.scene.containsModel(this.data.model)) {
        this.entity.removeChild(this.data.model.graph);
        this.system.context.scene.removeModel(this.data.model)
      }
    }
  }});
  var _createSkybox = function(entity, context, urls) {
    var gd = context.graphicsDevice;
    var texture = new pc.gfx.Texture(gd, {format:pc.gfx.PIXELFORMAT_R8_G8_B8, cubemap:true});
    texture.minFilter = pc.gfx.FILTER_LINEAR_MIPMAP_LINEAR;
    texture.magFilter = pc.gfx.FILTER_LINEAR;
    texture.addressU = pc.gfx.ADDRESS_CLAMP_TO_EDGE;
    texture.addressV = pc.gfx.ADDRESS_CLAMP_TO_EDGE;
    var options = {parent:entity.getRequest()};
    var requests = urls.map(function(url) {
      return new pc.resources.ImageRequest(url)
    });
    context.loader.request(requests, options).then(function(resources) {
      texture.setSource(resources)
    });
    var library = gd.getProgramLibrary();
    var shader = library.getProgram("skybox");
    var material = new pc.scene.Material;
    material.setShader(shader);
    material.setParameter("texture_cubeMap", texture);
    material.cull = pc.gfx.CULLFACE_NONE;
    var node = new pc.scene.GraphNode;
    var mesh = pc.scene.procedural.createBox(gd);
    var meshInstance = new pc.scene.MeshInstance(node, mesh, material);
    var model = new pc.scene.Model;
    model.graph = node;
    model.meshInstances = [meshInstance];
    return model
  };
  var CUBE_MAP_NAMES = ["posx", "negx", "posy", "negy", "posz", "negz"];
  return{SkyboxComponent:SkyboxComponent}
}());
pc.extend(pc.fw, function() {
  var SkyboxComponentData = function() {
    this.enabled = true;
    this.posx = null;
    this.negx = null;
    this.posy = null;
    this.negy = null;
    this.posz = null;
    this.negz = null;
    this.assets = [];
    this.model = null
  };
  SkyboxComponentData = pc.inherits(SkyboxComponentData, pc.fw.ComponentData);
  return{SkyboxComponentData:SkyboxComponentData}
}());
pc.extend(pc.fw, function() {
  var REMOTE_CAMERA_NEAR_CLIP = 0.5;
  var REMOTE_CAMERA_FAR_CLIP = 2;
  var CameraComponentSystem = function(context) {
    this.id = "camera";
    this.description = "Renders the scene from the location of the Entity.";
    context.systems.add(this.id, this);
    this.ComponentType = pc.fw.CameraComponent;
    this.DataType = pc.fw.CameraComponentData;
    this.schema = [{name:"enabled", displayName:"Enabled", description:"Disabled cameras do not render anything", type:"boolean", defaultValue:true}, {name:"clearColorBuffer", displayName:"Clear Color Buffer", description:"Clear color buffer", type:"boolean", defaultValue:true}, {name:"clearColor", displayName:"Clear Color", description:"Clear Color", type:"rgba", defaultValue:[0.7294117647058823, 0.7294117647058823, 0.6941176470588235, 1], filter:{clearColorBuffer:true}}, {name:"clearDepthBuffer", 
    displayName:"Clear Depth Buffer", description:"Clear depth buffer", type:"boolean", defaultValue:true}, {name:"projection", displayName:"Projection", description:"Projection type of camera", type:"enumeration", options:{enumerations:[{name:"Perspective", value:0}, {name:"Orthographic", value:1}]}, defaultValue:0}, {name:"fov", displayName:"Field of View", description:"Field of view in Y axis", type:"number", defaultValue:45, options:{min:0, max:90}, filter:{projection:0}}, {name:"orthoHeight", 
    displayName:"Ortho Height", description:"View window half extent of camera in Y axis", type:"number", defaultValue:100, filter:{projection:1}}, {name:"nearClip", displayName:"Near Clip", description:"Near clipping distance", type:"number", defaultValue:0.3, options:{min:1E-4, decimalPrecision:5}}, {name:"farClip", displayName:"Far Clip", description:"Far clipping distance", type:"number", defaultValue:1E3, options:{min:1E-4, decimalPrecision:5}}, {name:"priority", displayName:"Priority", description:"Controls which camera will be rendered first. Smaller numbers are rendered first.", 
    type:"number", defaultValue:0}, {name:"rect", displayName:"Viewport", description:"Controls where on the screen the camera will be rendered in normalized coordinates.", type:"vector", defaultValue:[0, 0, 1, 1]}, {name:"camera", exposed:false}, {name:"aspectRatio", exposed:false}, {name:"model", exposed:false}, {name:"renderTarget", exposed:false}];
    this.exposeProperties();
    this.cameras = [];
    this.on("remove", this.onRemove, this);
    pc.fw.ComponentSystem.on("toolsUpdate", this.toolsUpdate, this)
  };
  CameraComponentSystem = pc.inherits(CameraComponentSystem, pc.fw.ComponentSystem);
  pc.extend(CameraComponentSystem.prototype, {initializeComponentData:function(component, data, properties) {
    data = data || {};
    if(data.clearColor && pc.type(data.clearColor) === "array") {
      var c = data.clearColor;
      data.clearColor = new pc.Color(c[0], c[1], c[2], c[3])
    }
    if(data.rect && pc.type(data.rect) === "array") {
      var rect = data.rect;
      data.rect = new pc.Vec4(rect[0], rect[1], rect[2], rect[3])
    }
    if(data.activate) {
      console.warn("WARNING: activate: Property is deprecated. Set enabled property instead.");
      data.enabled = data.activate
    }
    data.camera = new pc.scene.CameraNode;
    data.postEffects = new pc.posteffect.PostEffectQueue(this.context, component);
    if(this.context.designer && this.displayInTools(component.entity)) {
      var material = new pc.scene.BasicMaterial;
      material.color = new pc.Color(1, 1, 0, 1);
      material.update();
      var indexBuffer = new pc.gfx.IndexBuffer(this.context.graphicsDevice, pc.gfx.INDEXFORMAT_UINT8, 24);
      var indices = new Uint8Array(indexBuffer.lock());
      indices.set([0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 4, 1, 5, 2, 6, 3, 7]);
      indexBuffer.unlock();
      var format = new pc.gfx.VertexFormat(this.context.graphicsDevice, [{semantic:pc.gfx.SEMANTIC_POSITION, components:3, type:pc.gfx.ELEMENTTYPE_FLOAT32}]);
      var vertexBuffer = new pc.gfx.VertexBuffer(this.context.graphicsDevice, format, 8, pc.gfx.BUFFER_DYNAMIC);
      var mesh = new pc.scene.Mesh;
      mesh.vertexBuffer = vertexBuffer;
      mesh.indexBuffer[0] = indexBuffer;
      mesh.primitive[0].type = pc.gfx.PRIMITIVE_LINES;
      mesh.primitive[0].base = 0;
      mesh.primitive[0].count = indexBuffer.getNumIndices();
      mesh.primitive[0].indexed = true;
      var model = new pc.scene.Model;
      model.graph = data.camera;
      model.meshInstances = [new pc.scene.MeshInstance(model.graph, mesh, material)];
      this.context.scene.addModel(model);
      data.model = model
    }
    properties = ["postEffects", "enabled", "model", "camera", "aspectRatio", "renderTarget", "clearColor", "fov", "orthoHeight", "nearClip", "farClip", "projection", "priority", "clearColorBuffer", "clearDepthBuffer", "rect"];
    CameraComponentSystem._super.initializeComponentData.call(this, component, data, properties)
  }, onRemove:function(entity, data) {
    if(this.context.designer && this.displayInTools(entity)) {
      if(this.context.scene.containsModel(data.model)) {
        this.context.scene.removeModel(data.model)
      }
    }
    entity.removeChild(data.camera);
    data.camera = null
  }, toolsUpdate:function(fn) {
    var components = this.store;
    for(var id in components) {
      if(components.hasOwnProperty(id)) {
        var entity = components[id].entity;
        var data = components[id].data;
        if(this.displayInTools(entity)) {
          this._updateGfx(entity.camera)
        }
      }
    }
  }, _updateGfx:function(component) {
    if(component.model && component.model.meshInstances.length) {
      var vertexBuffer = component.model.meshInstances[0].mesh.vertexBuffer;
      var aspectRatio = component.camera.getAspectRatio();
      var nearClip = this.isToolsCamera(component.entity) ? REMOTE_CAMERA_NEAR_CLIP : component.nearClip;
      var farClip = this.isToolsCamera(component.entity) ? REMOTE_CAMERA_FAR_CLIP : component.farClip;
      var fov = component.fov * Math.PI / 180;
      var projection = component.projection;
      var x, y;
      if(projection === pc.scene.Projection.PERSPECTIVE) {
        y = Math.tan(fov / 2) * nearClip
      }else {
        y = component.camera.getOrthoHeight()
      }
      x = y * aspectRatio;
      var positions = new Float32Array(vertexBuffer.lock());
      positions[0] = x;
      positions[1] = -y;
      positions[2] = -nearClip;
      positions[3] = x;
      positions[4] = y;
      positions[5] = -nearClip;
      positions[6] = -x;
      positions[7] = y;
      positions[8] = -nearClip;
      positions[9] = -x;
      positions[10] = -y;
      positions[11] = -nearClip;
      if(projection === pc.scene.Projection.PERSPECTIVE) {
        y = Math.tan(fov / 2) * farClip;
        x = y * aspectRatio
      }
      positions[12] = x;
      positions[13] = -y;
      positions[14] = -farClip;
      positions[15] = x;
      positions[16] = y;
      positions[17] = -farClip;
      positions[18] = -x;
      positions[19] = y;
      positions[20] = -farClip;
      positions[21] = -x;
      positions[22] = -y;
      positions[23] = -farClip;
      vertexBuffer.unlock()
    }
  }, addCamera:function(camera) {
    this.cameras.push(camera);
    this.sortCamerasByPriority();
    if(this.context.designer) {
      var model = camera.data.model;
      if(model) {
        var scene = this.context.scene;
        if(!scene.containsModel(model)) {
          scene.addModel(model)
        }
      }
    }
  }, removeCamera:function(camera) {
    var index = this.cameras.indexOf(camera);
    if(index >= 0) {
      this.cameras.splice(index, 1);
      this.sortCamerasByPriority();
      if(this.context.designer) {
        var model = camera.data.model;
        if(model) {
          this.context.scene.removeModel(model)
        }
      }
    }
  }, sortCamerasByPriority:function() {
    this.cameras.sort(function(a, b) {
      return a.priority - b.priority
    })
  }, isToolsCamera:function(entity) {
    return entity.hasLabel("pc:designer")
  }, displayInTools:function(entity) {
    return!this.isToolsCamera(entity) || entity.getName() === "Perspective"
  }});
  return{CameraComponentSystem:CameraComponentSystem}
}());
pc.extend(pc.fw, function() {
  var CameraComponent = function CameraComponent(system, entity) {
    this.on("set_aspectRatio", this.onSetAspectRatio, this);
    this.on("set_camera", this.onSetCamera, this);
    this.on("set_clearColor", this.onSetClearColor, this);
    this.on("set_fov", this.onSetFov, this);
    this.on("set_orthoHeight", this.onSetOrthoHeight, this);
    this.on("set_nearClip", this.onSetNearClip, this);
    this.on("set_farClip", this.onSetFarClip, this);
    this.on("set_projection", this.onSetProjection, this);
    this.on("set_priority", this.onSetPriority, this);
    this.on("set_clearColorBuffer", this.updateClearFlags, this);
    this.on("set_clearDepthBuffer", this.updateClearFlags, this);
    this.on("set_renderTarget", this.onSetRenderTarget, this);
    this.on("set_rect", this.onSetRect, this)
  };
  CameraComponent = pc.inherits(CameraComponent, pc.fw.Component);
  Object.defineProperty(CameraComponent.prototype, "activate", {get:function() {
    console.warn("WARNING: activate: Property is deprecated. Query enabled property instead.");
    return this.enabled
  }, set:function(value) {
    console.warn("WARNING: activate: Property is deprecated. Set enabled property instead.");
    this.enabled = value
  }});
  pc.extend(CameraComponent.prototype, {screenToWorld:function(x, y, z, worldCoord) {
    var device = this.system.context.graphicsDevice;
    var width = parseInt(device.canvas.style.width);
    var height = parseInt(device.canvas.style.height);
    return this.data.camera.screenToWorld(x, y, z, width, height, worldCoord)
  }, onSetAspectRatio:function(name, oldValue, newValue) {
    this.data.camera.setAspectRatio(newValue)
  }, onSetCamera:function(name, oldValue, newValue) {
    if(oldValue) {
      this.entity.removeChild(oldValue)
    }
    this.entity.addChild(newValue)
  }, onSetClearColor:function(name, oldValue, newValue) {
    var clearOptions = this.data.camera.getClearOptions();
    clearOptions.color[0] = newValue.r;
    clearOptions.color[1] = newValue.g;
    clearOptions.color[2] = newValue.b
  }, onSetFov:function(name, oldValue, newValue) {
    this.data.camera.setFov(newValue)
  }, onSetOrthoHeight:function(name, oldValue, newValue) {
    this.data.camera.setOrthoHeight(newValue)
  }, onSetNearClip:function(name, oldValue, newValue) {
    this.data.camera.setNearClip(newValue)
  }, onSetFarClip:function(name, oldValue, newValue) {
    this.data.camera.setFarClip(newValue)
  }, onSetProjection:function(name, oldValue, newValue) {
    this.data.camera.setProjection(newValue)
  }, onSetPriority:function(name, oldValue, newValue) {
    this.system.sortCamerasByPriority()
  }, updateClearFlags:function() {
    var clearOptions = this.data.camera.getClearOptions();
    var flags = 0;
    if(this.clearColorBuffer) {
      flags = flags | pc.gfx.CLEARFLAG_COLOR
    }
    if(this.clearDepthBuffer) {
      flags = flags | pc.gfx.CLEARFLAG_DEPTH
    }
    clearOptions.flags = flags
  }, onSetRenderTarget:function(name, oldValue, newValue) {
    this.data.camera.setRenderTarget(newValue)
  }, onSetRect:function(name, oldValue, newValue) {
    this.data.camera.setRect(newValue.data[0], newValue.data[1], newValue.data[2], newValue.data[3]);
    this._resetAspectRatio()
  }, onEnable:function() {
    CameraComponent._super.onEnable.call(this);
    this.system.addCamera(this);
    this.postEffects.enable()
  }, onDisable:function() {
    CameraComponent._super.onDisable.call(this);
    this.postEffects.disable();
    this.system.removeCamera(this)
  }, _resetAspectRatio:function() {
    var camera = this.camera;
    if(camera) {
      var device = this.system.context.graphicsDevice;
      var rect = this.rect;
      var aspect = device.width * rect.z / (device.height * rect.w);
      if(aspect !== camera.getAspectRatio()) {
        camera.setAspectRatio(aspect)
      }
    }
  }, frameBegin:function() {
    this._resetAspectRatio();
    this.data.isRendering = true
  }, frameEnd:function() {
    this.data.isRendering = false
  }});
  return{CameraComponent:CameraComponent}
}());
pc.extend(pc.fw, function() {
  CameraComponentData = function() {
    this.clearColor = new pc.Color(0.729411780834198, 0.729411780834198, 0.6941176652908325, 1);
    this.clearColorBuffer = true;
    this.clearDepthBuffer = true;
    this.nearClip = 0.1;
    this.farClip = 1E3;
    this.fov = 45;
    this.orthoHeight = 100;
    this.projection = pc.scene.Projection.PERSPECTIVE;
    this.priority = 0;
    this.rect = new pc.Vec4(0, 0, 1, 1);
    this.enabled = true;
    this.camera = null;
    this.aspectRatio = 16 / 9;
    this.renderTarget = null;
    this.postEffects = null;
    this.isRendering = false
  };
  CameraComponentData = pc.inherits(CameraComponentData, pc.fw.ComponentData);
  return{CameraComponentData:CameraComponentData}
}());
pc.extend(pc.fw, function() {
  var CubeMapComponentSystem = function(context) {
    this.id = "cubemap";
    context.systems.add(this.id, this);
    this.ComponentType = pc.fw.CubeMapComponent;
    this.DataType = pc.fw.CubeMapComponentData;
    this.schema = [{name:"enabled", type:"boolean", defaultValue:true}, {name:"cubemap", exposed:false}, {name:"camera", exposed:false}, {name:"targets", exposed:false}];
    this.exposeProperties();
    pc.fw.ComponentSystem.on("update", this.onUpdate, this)
  };
  CubeMapComponentSystem = pc.inherits(CubeMapComponentSystem, pc.fw.ComponentSystem);
  pc.extend(CubeMapComponentSystem.prototype, {initializeComponentData:function(component, data, properties) {
    var cubemap = new pc.gfx.Texture(this.context.graphicsDevice, {format:pc.gfx.PIXELFORMAT_R8_G8_B8, width:256, height:256, cubemap:true});
    cubemap.minFilter = pc.gfx.FILTER_LINEAR;
    cubemap.magFilter = pc.gfx.FILTER_LINEAR;
    cubemap.addressU = pc.gfx.ADDRESS_CLAMP_TO_EDGE;
    cubemap.addressV = pc.gfx.ADDRESS_CLAMP_TO_EDGE;
    var targets = [];
    for(var i = 0;i < 6;i++) {
      var target = new pc.gfx.RenderTarget(this.context.graphicsDevice, cubemap, {face:i, depth:true});
      targets.push(target)
    }
    var camera = new pc.scene.CameraNode;
    camera.setNearClip(0.01);
    camera.setFarClip(1E4);
    camera.setAspectRatio(1);
    data.cubemap = cubemap;
    data.targets = targets;
    data.camera = camera;
    CubeMapComponentSystem._super.initializeComponentData.call(this, component, data, ["enabled", "targets", "cubemap", "camera"])
  }, onUpdate:function(dt) {
    var id;
    var entity;
    var componentData;
    var components = this.store;
    var transform;
    for(id in components) {
      if(components.hasOwnProperty(id)) {
        entity = components[id].entity;
        componentData = components[id].data;
        var model;
        if(entity.model) {
          model = entity.model.model
        }
        if(model) {
          var scene = this.context.scene;
          scene.removeModel(model);
          var lookAts = [{target:[1, 0, 0], up:[0, -1, 0]}, {target:[-1, 0, 0], up:[0, -1, 0]}, {target:[0, 1, 0], up:[0, 0, 1]}, {target:[0, -1, 0], up:[0, 0, -1]}, {target:[0, 0, 1], up:[0, -1, 0]}, {target:[0, 0, -1], up:[0, -1, 0]}];
          var pos = entity.getPosition();
          var camera = componentData.camera;
          for(var face = 0;face < 6;face++) {
            camera.setRenderTarget(componentData.targets[face]);
            camera.setPosition(pos);
            camera.lookAt(lookAts[face].target, lookAts[face].up);
            camera.syncHierarchy();
            scene.render(camera, this.context.graphicsDevice)
          }
          scene.addModel(model)
        }
      }
    }
  }});
  return{CubeMapComponentSystem:CubeMapComponentSystem}
}());
pc.extend(pc.fw, function() {
  var CubeMapComponent = function() {
  };
  CubeMapComponent = pc.inherits(CubeMapComponent, pc.fw.Component);
  return{CubeMapComponent:CubeMapComponent}
}());
pc.extend(pc.fw, function() {
  CubeMapComponentData = function() {
    this.camera = null;
    this.nearClip = 1;
    this.farClip = 1E5;
    this.width = 256;
    this.height = 256;
    this.enabled = true
  };
  CubeMapComponentData = pc.inherits(CubeMapComponentData, pc.fw.ComponentData);
  return{CubeMapComponentData:CubeMapComponentData}
}());
pc.extend(pc.fw, function() {
  var StaticCubeMapComponentSystem = function StaticCubeMapComponentSystem(context) {
    this.id = "staticcubemap";
    context.systems.add(this.id, this);
    this.schema = [{name:"enabled", displayName:"Enabled", description:"Enables or disables the component", type:"boolean", defaultValue:true}, {name:"posx", displayName:"POSX", description:"URL of the positive X face of cubemap", type:"asset", options:{max:1, type:"texture"}, defaultValue:null}, {name:"negx", displayName:"NEGX", description:"URL of the negative X face of cubemap", type:"asset", options:{max:1, type:"texture"}, defaultValue:null}, {name:"posy", displayName:"POSY", description:"URL of the positive Y face of cubemap", 
    type:"asset", options:{max:1, type:"texture"}, defaultValue:null}, {name:"negy", displayName:"NEGY", description:"URL of the negative Y face of cubemap", type:"asset", options:{max:1, type:"texture"}, defaultValue:null}, {name:"posz", displayName:"POSZ", description:"URL of the positive Z face of cubemap", type:"asset", options:{max:1, type:"texture"}, defaultValue:null}, {name:"negz", displayName:"NEGZ", description:"URL of the negative Z face of cubemap", type:"asset", options:{max:1, type:"texture"}, 
    defaultValue:null}, {name:"assets", exposed:false}, {name:"cubemap", exposed:false}];
    this.exposeProperties();
    this.ComponentType = pc.fw.StaticCubeMapComponent;
    this.DataType = pc.fw.StaticCubeMapComponentData
  };
  StaticCubeMapComponentSystem = pc.inherits(StaticCubeMapComponentSystem, pc.fw.ComponentSystem);
  pc.extend(StaticCubeMapComponentSystem.prototype, {initializeComponentData:function(component, data, properties) {
    properties = ["enabled", "posx", "negx", "posy", "negy", "posz", "negz"];
    StaticCubeMapComponentSystem._super.initializeComponentData.call(this, component, data, properties)
  }});
  return{StaticCubeMapComponentSystem:StaticCubeMapComponentSystem}
}());
pc.extend(pc.fw, function() {
  var StaticCubeMapComponent = function StaticCubeMapComponent(system, entity) {
    this.on("set", this.onSet, this)
  };
  StaticCubeMapComponent = pc.inherits(StaticCubeMapComponent, pc.fw.Component);
  pc.extend(StaticCubeMapComponent.prototype, {onSet:function(name, oldValue, newValue) {
    function _loadTextureAsset(name, guid) {
      if(!guid) {
        return
      }
      var index = CUBE_MAP_NAMES.indexOf(name);
      var assets = this.assets;
      this.cubemap = null;
      if(guid) {
        assets[index] = this.system.context.assets.getAssetByResourceId(guid);
        this.assets = assets;
        if(assets[0] && assets[1] && assets[2] && assets[3] && assets[4] && assets[5]) {
          var urls = assets.map(function(asset) {
            return asset.getFileUrl()
          });
          var cubemap = _createCubemap(this.entity, this.system.context, urls);
          this.cubemap = cubemap
        }
      }else {
        delete assets[index]
      }
    }
    var functions = {"posx":function(name, oldValue, newValue) {
      _loadTextureAsset.call(this, name, newValue)
    }, "negx":function(name, oldValue, newValue) {
      _loadTextureAsset.call(this, name, newValue)
    }, "posy":function(name, oldValue, newValue) {
      _loadTextureAsset.call(this, name, newValue)
    }, "negy":function(name, oldValue, newValue) {
      _loadTextureAsset.call(this, name, newValue)
    }, "posz":function(name, oldValue, newValue) {
      _loadTextureAsset.call(this, name, newValue)
    }, "negz":function(name, oldValue, newValue) {
      _loadTextureAsset.call(this, name, newValue)
    }};
    if(functions[name]) {
      functions[name].call(this, name, oldValue, newValue)
    }
  }});
  var CUBE_MAP_NAMES = ["posx", "negx", "posy", "negy", "posz", "negz"];
  var _createCubemap = function(entity, context, urls) {
    var texture = new pc.gfx.Texture(context.graphicsDevice, {format:pc.gfx.PIXELFORMAT_R8_G8_B8, cubemap:true});
    texture.minFilter = pc.gfx.FILTER_LINEAR_MIPMAP_LINEAR;
    texture.magFilter = pc.gfx.FILTER_LINEAR;
    texture.addressU = pc.gfx.ADDRESS_CLAMP_TO_EDGE;
    texture.addressV = pc.gfx.ADDRESS_CLAMP_TO_EDGE;
    var requests = urls.map(function(url) {
      return new pc.resources.ImageRequest(url)
    });
    var options = {parent:entity.getRequest()};
    context.loader.request(requests, options).then(function(resources) {
      texture.setSource(resources)
    });
    return texture
  };
  return{StaticCubeMapComponent:StaticCubeMapComponent}
}());
pc.extend(pc.fw, function() {
  var StaticCubeMapComponentData = function() {
    this.enabled = true;
    this.posx = null;
    this.negx = null;
    this.posy = null;
    this.negy = null;
    this.posz = null;
    this.negz = null;
    this.assets = [];
    this.cubemap = null
  };
  StaticCubeMapComponentData = pc.inherits(StaticCubeMapComponentData, pc.fw.ComponentData);
  return{StaticCubeMapComponentData:StaticCubeMapComponentData}
}());
pc.extend(pc.fw, function() {
  var LightComponentSystem = function(context) {
    this.id = "light";
    this.description = "Enables the Entity to emit light.";
    context.systems.add(this.id, this);
    this.ComponentType = pc.fw.LightComponent;
    this.DataType = pc.fw.LightComponentData;
    this.schema = [{name:"enabled", displayName:"Enabled", description:"Enable or disable the light", type:"boolean", defaultValue:true}, {name:"type", displayName:"Type", description:"The type of the light", type:"enumeration", options:{enumerations:[{name:"Directional", value:"directional"}, {name:"Point", value:"point"}, {name:"Spot", value:"spot"}]}, defaultValue:"directional"}, {name:"color", displayName:"Color", description:"Light Color", type:"rgb", defaultValue:[1, 1, 1]}, {name:"intensity", 
    displayName:"Intensity", description:"Factors the light color", type:"number", defaultValue:1, options:{min:0, max:10, step:0.05}}, {name:"castShadows", displayName:"Cast Shadows", description:"Cast shadows from this light", type:"boolean", defaultValue:false, filter:{type:["directional", "spot"]}}, {name:"shadowResolution", displayName:"Shadow Resolution", description:"Resolution of shadowmap generated by this light", type:"enumeration", options:{enumerations:[{name:"256", value:256}, {name:"512", 
    value:512}, {name:"1024", value:1024}, {name:"2048", value:2048}]}, defaultValue:1024, filter:{type:["directional", "spot"]}}, {name:"range", displayName:"Range", description:"The distance from the light where its contribution falls to zero", type:"number", defaultValue:10, options:{min:0}, filter:{type:["point", "spot"]}}, {name:"innerConeAngle", displayName:"Inner Cone Angle", description:"Spotlight inner cone angle", type:"number", defaultValue:40, options:{min:0, max:90}, filter:{type:"spot"}}, 
    {name:"outerConeAngle", displayName:"Outer Cone Angle", description:"Spotlight outer cone angle", type:"number", defaultValue:45, options:{min:0, max:90}, filter:{type:"spot"}}, {name:"model", exposed:false}];
    this.exposeProperties();
    this.implementations = {};
    this.on("remove", this.onRemove, this);
    pc.fw.ComponentSystem.on("toolsUpdate", this.toolsUpdate, this)
  };
  LightComponentSystem = pc.inherits(LightComponentSystem, pc.fw.ComponentSystem);
  pc.extend(LightComponentSystem.prototype, {initializeComponentData:function(component, data, properties) {
    if(!data.type) {
      data.type = component.data.type
    }
    component.data.type = data.type;
    if(data.color && pc.type(data.color) === "array") {
      data.color = new pc.Color(data.color[0], data.color[1], data.color[2])
    }
    if(data.enable) {
      console.warn("WARNING: enable: Property is deprecated. Set enabled property instead.");
      data.enabled = data.enable
    }
    var implementation = this._createImplementation(data.type);
    implementation.initialize(component, data);
    properties = ["type", "model", "enabled", "color", "intensity", "range", "innerConeAngle", "outerConeAngle", "castShadows", "shadowResolution"];
    LightComponentSystem._super.initializeComponentData.call(this, component, data, properties)
  }, _createImplementation:function(type) {
    var implementation = this.implementations[type];
    if(!implementation) {
      switch(type) {
        case "directional":
          implementation = new DirectionalLightImplementation(this);
          break;
        case "point":
          implementation = new PointLightImplementation(this);
          break;
        case "spot":
          implementation = new SpotLightImplementation(this);
          break;
        default:
          throw new Error("Invalid light type: " + type);
      }
      this.implementations[type] = implementation
    }
    return implementation
  }, onRemove:function(entity, data) {
    this.implementations[data.type].remove(entity, data)
  }, cloneComponent:function(entity, clone) {
    var data = {type:entity.light.type, enabled:entity.light.enabled, color:[entity.light.color.r, entity.light.color.g, entity.light.color.b], intensity:entity.light.intensity, range:entity.light.range, innerConeAngle:entity.light.innerConeAngle, outerConeAngle:entity.light.outerConeAngle, castShadows:entity.light.castShadows, shadowResolution:entity.light.shadowResolution};
    this.addComponent(clone, data)
  }, toolsUpdate:function(fn) {
    var components = this.store;
    for(var id in components) {
      if(components.hasOwnProperty(id)) {
        var entity = components[id].entity;
        var componentData = components[id].data;
        var implementation = this.implementations[componentData.type];
        if(implementation) {
          implementation.toolsUpdate(componentData)
        }
      }
    }
  }, changeType:function(component, oldType, newType) {
    this.implementations[oldType].remove(component.entity, component.data);
    this._createImplementation(newType).initialize(component, component.data)
  }});
  LightComponentImplementation = function(system) {
    this.system = system
  };
  LightComponentImplementation.prototype = {initialize:function(component, data) {
    var node = this._createLightNode(component, data);
    this._createDebugShape(component, data, node)
  }, _createLightNode:function(component, data) {
    var node = new pc.scene.LightNode;
    node.setName(data.type + "light");
    node.setType(this._getLightType());
    return node
  }, _getLightType:function() {
    return undefined
  }, _createDebugShape:function(component, data, node) {
    var context = this.system.context;
    var model = new pc.scene.Model;
    model.graph = node;
    model.lights = [node];
    if(context.designer) {
      this.mesh = this._createDebugMesh();
      if(!this.material) {
        this.material = this._createDebugMaterial()
      }
      model.meshInstances = [new pc.scene.MeshInstance(node, this.mesh, this.material)]
    }
    context.scene.addModel(model);
    component.entity.addChild(node);
    data = data || {};
    data.model = model
  }, _createDebugMesh:function() {
    return undefined
  }, _createDebugMaterial:function() {
    return undefined
  }, remove:function(entity, data) {
    var context = this.system.context;
    entity.removeChild(data.model.graph);
    context.scene.removeModel(data.model);
    delete data.model
  }, toolsUpdate:function(data) {
  }};
  DirectionalLightImplementation = function(system) {
  };
  DirectionalLightImplementation = pc.inherits(DirectionalLightImplementation, LightComponentImplementation);
  DirectionalLightImplementation.prototype = pc.extend(DirectionalLightImplementation.prototype, {_getLightType:function() {
    return pc.scene.LIGHTTYPE_DIRECTIONAL
  }, _createDebugMesh:function() {
    if(this.mesh) {
      return this.mesh
    }
    var context = this.system.context;
    var format = new pc.gfx.VertexFormat(context.graphicsDevice, [{semantic:pc.gfx.SEMANTIC_POSITION, components:3, type:pc.gfx.ELEMENTTYPE_FLOAT32}]);
    vertexData = [0, 0, 0, 0, -8, 0, -0.5, -8, 0, 0.5, -8, 0, 0.5, -8, 0, 0, -10, 0, 0, -10, 0, -0.5, -8, 0, 0, 0, -2, 0, -8, -2, -0.25, -8, -2, 0.25, -8, -2, 0.25, -8, -2, 0, -10, -2, 0, -10, -2, -0.25, -8, -2, 0, 0, 2, 0, -8, 2, -0.25, -8, 2, 0.25, -8, 2, 0.25, -8, 2, 0, -10, 2, 0, -10, 2, -0.25, -8, 2];
    var rot = (new pc.Mat4).setFromAxisAngle(pc.Vec3.UP, 120);
    var i;
    for(i = 0;i < 24;i++) {
      var pos = new pc.Vec3(vertexData[(i + 8) * 3], vertexData[(i + 8) * 3 + 1], vertexData[(i + 8) * 3 + 2]);
      var posRot = rot.transformPoint(pos, pos);
      vertexData[(i + 24) * 3] = posRot[0];
      vertexData[(i + 24) * 3 + 1] = posRot[1];
      vertexData[(i + 24) * 3 + 2] = posRot[2]
    }
    var vertexBuffer = new pc.gfx.VertexBuffer(context.graphicsDevice, format, 32);
    var positions = new Float32Array(vertexBuffer.lock());
    for(i = 0;i < vertexData.length;i++) {
      positions[i] = vertexData[i]
    }
    vertexBuffer.unlock();
    var mesh = new pc.scene.Mesh;
    mesh.vertexBuffer = vertexBuffer;
    mesh.indexBuffer[0] = null;
    mesh.primitive[0].type = pc.gfx.PRIMITIVE_LINES;
    mesh.primitive[0].base = 0;
    mesh.primitive[0].count = vertexBuffer.getNumVertices();
    mesh.primitive[0].indexed = false;
    return mesh
  }, _createDebugMaterial:function() {
    var material = new pc.scene.BasicMaterial;
    material.color = new pc.Color(1, 1, 0, 1);
    material.update();
    return material
  }});
  PointLightImplementation = function(system) {
  };
  PointLightImplementation = pc.inherits(PointLightImplementation, LightComponentImplementation);
  PointLightImplementation.prototype = pc.extend(PointLightImplementation.prototype, {_getLightType:function() {
    return pc.scene.LIGHTTYPE_POINT
  }, _createDebugMesh:function() {
    if(this.mesh) {
      return this.mesh
    }
    var context = this.system.context;
    return pc.scene.procedural.createSphere(context.graphicsDevice, {radius:0.1})
  }, _createDebugMaterial:function() {
    var material = new pc.scene.BasicMaterial;
    material.color = new pc.Color(1, 1, 0, 1);
    material.update();
    return material
  }});
  SpotLightImplementation = function(system) {
  };
  SpotLightImplementation = pc.inherits(SpotLightImplementation, LightComponentImplementation);
  SpotLightImplementation.prototype = pc.extend(SpotLightImplementation.prototype, {_getLightType:function() {
    return pc.scene.LIGHTTYPE_SPOT
  }, _createDebugMesh:function() {
    var context = this.system.context;
    var indexBuffer = this.indexBuffer;
    if(!indexBuffer) {
      var indexBuffer = new pc.gfx.IndexBuffer(context.graphicsDevice, pc.gfx.INDEXFORMAT_UINT8, 88);
      var inds = new Uint8Array(indexBuffer.lock());
      inds[0] = 0;
      inds[1] = 1;
      inds[2] = 0;
      inds[3] = 11;
      inds[4] = 0;
      inds[5] = 21;
      inds[6] = 0;
      inds[7] = 31;
      for(var i = 0;i < 40;i++) {
        inds[8 + i * 2 + 0] = i + 1;
        inds[8 + i * 2 + 1] = i + 2
      }
      indexBuffer.unlock();
      this.indexBuffer = indexBuffer
    }
    var vertexFormat = new pc.gfx.VertexFormat(context.graphicsDevice, [{semantic:pc.gfx.SEMANTIC_POSITION, components:3, type:pc.gfx.ELEMENTTYPE_FLOAT32}]);
    var vertexBuffer = new pc.gfx.VertexBuffer(context.graphicsDevice, vertexFormat, 42, pc.gfx.BUFFER_DYNAMIC);
    var mesh = new pc.scene.Mesh;
    mesh.vertexBuffer = vertexBuffer;
    mesh.indexBuffer[0] = indexBuffer;
    mesh.primitive[0].type = pc.gfx.PRIMITIVE_LINES;
    mesh.primitive[0].base = 0;
    mesh.primitive[0].count = indexBuffer.getNumIndices();
    mesh.primitive[0].indexed = true;
    return mesh
  }, _createDebugMaterial:function() {
    return new pc.scene.BasicMaterial
  }, toolsUpdate:function(data) {
    var model = data.model;
    var meshInstance = model.meshInstances[0];
    var vertexBuffer = meshInstance.mesh.vertexBuffer;
    var oca = Math.PI * data.outerConeAngle / 180;
    var ae = data.range;
    var y = -ae * Math.cos(oca);
    var r = ae * Math.sin(oca);
    var positions = new Float32Array(vertexBuffer.lock());
    positions[0] = 0;
    positions[1] = 0;
    positions[2] = 0;
    var numVerts = vertexBuffer.getNumVertices();
    for(var i = 0;i < numVerts - 1;i++) {
      var theta = 2 * Math.PI * (i / (numVerts - 2));
      var x = r * Math.cos(theta);
      var z = r * Math.sin(theta);
      positions[(i + 1) * 3 + 0] = x;
      positions[(i + 1) * 3 + 1] = y;
      positions[(i + 1) * 3 + 2] = z
    }
    vertexBuffer.unlock()
  }});
  return{LightComponentSystem:LightComponentSystem}
}());
pc.extend(pc.fw, function() {
  var LightComponent = function LightComponent(system, entity) {
    this.on("set_type", this.onSetType, this);
    this.on("set_color", this.onSetColor, this);
    this.on("set_intensity", this.onSetIntensity, this);
    this.on("set_castShadows", this.onSetCastShadows, this);
    this.on("set_shadowResolution", this.onSetShadowResolution, this);
    this.on("set_range", this.onSetRange, this);
    this.on("set_innerConeAngle", this.onSetInnerConeAngle, this);
    this.on("set_outerConeAngle", this.onSetOuterConeAngle, this)
  };
  LightComponent = pc.inherits(LightComponent, pc.fw.Component);
  Object.defineProperty(LightComponent.prototype, "enable", {get:function() {
    console.warn("WARNING: enable: Property is deprecated. Query enabled property instead.");
    return this.enabled
  }, set:function(value) {
    console.warn("WARNING: enable: Property is deprecated. Set enabled property instead.");
    this.enabled = value
  }});
  pc.extend(LightComponent.prototype, {onSetType:function(name, oldValue, newValue) {
    if(oldValue !== newValue) {
      this.system.changeType(this, oldValue, newValue);
      this.refreshProperties()
    }
  }, refreshProperties:function() {
    this.onSetCastShadows("castShadows", this.castShadows, this.castShadows);
    this.onSetColor("color", this.color, this.color);
    this.onSetIntensity("intensity", this.intensity, this.intensity);
    this.onSetShadowResolution("shadowResolution", this.shadowResolution, this.shadowResolution);
    this.onSetRange("range", this.range, this.range);
    this.onSetInnerConeAngle("innerConeAngle", this.innerConeAngle, this.innerConeAngle);
    this.onSetOuterConeAngle("outerConeAngle", this.outerConeAngle, this.outerConeAngle);
    if(this.enabled && this.entity.enabled) {
      this.onEnable()
    }
  }, onSetCastShadows:function(name, oldValue, newValue) {
    if(this.data.type === "directional" || this.data.type === "spot") {
      var light = this.data.model.lights[0];
      light.setCastShadows(newValue)
    }
  }, onSetColor:function(name, oldValue, newValue) {
    var light = this.data.model.lights[0];
    light.setColor(newValue)
  }, onSetIntensity:function(name, oldValue, newValue) {
    var light = this.data.model.lights[0];
    light.setIntensity(newValue)
  }, onSetShadowResolution:function(name, oldValue, newValue) {
    if(this.data.type === "directional" || this.data.type === "spot") {
      var light = this.data.model.lights[0];
      light.setShadowResolution(newValue)
    }
  }, onSetRange:function(name, oldValue, newValue) {
    if(this.data.type === "point" || this.data.type === "spot") {
      var light = this.data.model.lights[0];
      light.setAttenuationEnd(newValue)
    }
  }, onSetInnerConeAngle:function(name, oldValue, newValue) {
    if(this.data.type === "spot") {
      var light = this.data.model.lights[0];
      light.setInnerConeAngle(newValue)
    }
  }, onSetOuterConeAngle:function(name, oldValue, newValue) {
    if(this.data.type === "spot") {
      var light = this.data.model.lights[0];
      light.setOuterConeAngle(newValue)
    }
  }, onEnable:function() {
    LightComponent._super.onEnable.call(this);
    var model = this.data.model;
    var light = model.lights[0];
    light.setEnabled(true);
    var scene = this.system.context.scene;
    if(!scene.containsModel(model)) {
      scene.addModel(model)
    }
  }, onDisable:function() {
    LightComponent._super.onDisable.call(this);
    var model = this.data.model;
    var light = model.lights[0];
    light.setEnabled(false);
    this.system.context.scene.removeModel(model)
  }});
  return{LightComponent:LightComponent}
}());
pc.extend(pc.fw, function() {
  var LightComponentData = function() {
    this.type = "directional";
    this.enabled = true;
    this.color = new pc.Color(1, 1, 1);
    this.intensity = 1;
    this.castShadows = false;
    this.shadowResolution = 1024;
    this.range = 10;
    this.innerConeAngle = 40;
    this.outerConeAngle = 45;
    this.model = null
  };
  LightComponentData = pc.inherits(LightComponentData, pc.fw.ComponentData);
  return{LightComponentData:LightComponentData}
}());
pc.extend(pc.fw, function() {
  var INITIALIZE = "initialize";
  var POST_INITIALIZE = "postInitialize";
  var UPDATE = "update";
  var POST_UPDATE = "postUpdate";
  var FIXED_UPDATE = "fixedUpdate";
  var TOOLS_UPDATE = "toolsUpdate";
  var ON_ENABLE = "onEnable";
  var ON_DISABLE = "onDisable";
  var ScriptComponentSystem = function ScriptComponentSystem(context) {
    this.id = "script";
    this.description = "Allows the Entity to run JavaScript fragments to implement custom behavior.";
    context.systems.add(this.id, this);
    this.ComponentType = pc.fw.ScriptComponent;
    this.DataType = pc.fw.ScriptComponentData;
    this.schema = [{name:"enabled", displayName:"Enabled", description:"Disabled components are not updated", type:"boolean", defaultValue:true}, {name:"scripts", displayName:"URLs", description:"Attach scripts to this Entity", type:"script", defaultValue:[]}, {name:"instances", exposed:false}, {name:"runInTools", description:"Allows scripts to be loaded and executed while in the tools", defaultValue:false, exposed:false}];
    this.exposeProperties();
    this.instancesWithUpdate = [];
    this.instancesWithFixedUpdate = [];
    this.instancesWithPostUpdate = [];
    this.instancesWithToolsUpdate = [];
    this.on("beforeremove", this.onBeforeRemove, this);
    pc.fw.ComponentSystem.on(INITIALIZE, this.onInitialize, this);
    pc.fw.ComponentSystem.on(POST_INITIALIZE, this.onPostInitialize, this);
    pc.fw.ComponentSystem.on(UPDATE, this.onUpdate, this);
    pc.fw.ComponentSystem.on(FIXED_UPDATE, this.onFixedUpdate, this);
    pc.fw.ComponentSystem.on(POST_UPDATE, this.onPostUpdate, this);
    pc.fw.ComponentSystem.on(TOOLS_UPDATE, this.onToolsUpdate, this)
  };
  ScriptComponentSystem = pc.inherits(ScriptComponentSystem, pc.fw.ComponentSystem);
  pc.extend(ScriptComponentSystem.prototype, {initializeComponentData:function(component, data, properties) {
    properties = ["runInTools", "enabled", "scripts"];
    ScriptComponentSystem._super.initializeComponentData.call(this, component, data, properties)
  }, cloneComponent:function(entity, clone) {
    var src = this.dataStore[entity.getGuid()];
    var data = {runInTools:src.data.runInTools, scripts:pc.extend([], src.data.scripts), enabled:src.data.enabled};
    return this.addComponent(clone, data)
  }, onBeforeRemove:function(entity, component) {
    if(component.enabled) {
      this._disableScriptComponent(component)
    }
    this._destroyScriptComponent(component)
  }, onInitialize:function(root) {
    this._registerInstances(root);
    if(root.enabled) {
      if(root.script && root.script.enabled) {
        this._initializeScriptComponent(root.script)
      }
      var children = root.getChildren();
      var i, len = children.length;
      for(i = 0;i < len;i++) {
        if(children[i] instanceof pc.fw.Entity) {
          this.onInitialize(children[i])
        }
      }
    }
  }, onPostInitialize:function(root) {
    if(root.enabled) {
      if(root.script && root.script.enabled) {
        this._postInitializeScriptComponent(root.script)
      }
      var children = root.getChildren();
      var i, len = children.length;
      for(i = 0;i < len;i++) {
        if(children[i] instanceof pc.fw.Entity) {
          this.onPostInitialize(children[i])
        }
      }
    }
  }, _callInstancesMethod:function(script, method) {
    var instances = script.data.instances;
    for(var name in instances) {
      if(instances.hasOwnProperty(name)) {
        var instance = instances[name].instance;
        if(instance[method]) {
          instance[method].call(instance)
        }
      }
    }
  }, _initializeScriptComponent:function(script) {
    this._callInstancesMethod(script, INITIALIZE);
    script.data.initialized = true;
    if(script.enabled && script.entity.enabled) {
      this._enableScriptComponent(script)
    }
  }, _enableScriptComponent:function(script) {
    this._callInstancesMethod(script, ON_ENABLE)
  }, _disableScriptComponent:function(script) {
    this._callInstancesMethod(script, ON_DISABLE)
  }, _destroyScriptComponent:function(script) {
    var index;
    var instances = script.data.instances;
    for(var name in instances) {
      if(instances.hasOwnProperty(name)) {
        var instance = instances[name].instance;
        if(instance.destroy) {
          instance.destroy()
        }
        if(instance.update) {
          index = this.instancesWithUpdate.indexOf(instance);
          if(index >= 0) {
            this.instancesWithUpdate.splice(index, 1)
          }
        }
        if(instance.fixedUpdate) {
          index = this.instancesWithFixedUpdate.indexOf(instance);
          if(index >= 0) {
            this.instancesWithFixedUpdate.splice(index, 1)
          }
        }
        if(instance.postUpdate) {
          index = this.instancesWithPostUpdate.indexOf(instance);
          if(index >= 0) {
            this.instancesWithPostUpdate.splice(index, 1)
          }
        }
        if(instance.toolsUpdate) {
          index = this.instancesWithToolsUpdate.indexOf(instance);
          if(index >= 0) {
            this.instancesWithToolsUpdate.splice(index, 1)
          }
        }
        if(script.instances[name].instance === script[name]) {
          delete script[name]
        }
        delete script.instances[name]
      }
    }
  }, _postInitializeScriptComponent:function(script) {
    this._callInstancesMethod(script, POST_INITIALIZE);
    script.data.postInitialized = true
  }, _updateInstances:function(method, updateList, dt) {
    var item;
    for(var i = 0, len = updateList.length;i < len;i++) {
      item = updateList[i];
      if(item && item.entity.script.enabled && item.entity.enabled) {
        item[method].call(item, dt)
      }
    }
  }, onUpdate:function(dt) {
    this._updateInstances(UPDATE, this.instancesWithUpdate, dt)
  }, onFixedUpdate:function(dt) {
    this._updateInstances(FIXED_UPDATE, this.instancesWithFixedUpdate, dt)
  }, onPostUpdate:function(dt) {
    this._updateInstances(POST_UPDATE, this.instancesWithPostUpdate, dt)
  }, onToolsUpdate:function(dt) {
    this._updateInstances(TOOLS_UPDATE, this.instancesWithToolsUpdate, dt)
  }, broadcast:function(name, functionName) {
    var args = pc.makeArray(arguments).slice(2);
    var id, data, fn;
    var dataStore = this.store;
    for(id in dataStore) {
      if(dataStore.hasOwnProperty(id)) {
        data = dataStore[id].data;
        if(data.instances[name]) {
          fn = data.instances[name].instance[functionName];
          if(fn) {
            fn.apply(data.instances[name].instance, args)
          }
        }
      }
    }
  }, _preRegisterInstance:function(entity, url, name, instance) {
    if(entity.script) {
      entity.script.data._instances = entity.script.data._instances || {};
      if(entity.script.data._instances[name]) {
        throw Error(pc.string.format("Script name collision '{0}'. Scripts from '{1}' and '{2}' {{3}}", name, url, entity.script.data._instances[name].url, entity.getGuid()));
      }
      entity.script.data._instances[name] = {url:url, name:name, instance:instance}
    }
  }, _registerInstances:function(entity) {
    var preRegistered, instance, instanceName;
    if(entity.script) {
      if(entity.script.data._instances) {
        entity.script.instances = entity.script.data._instances;
        for(instanceName in entity.script.instances) {
          preRegistered = entity.script.instances[instanceName];
          instance = preRegistered.instance;
          pc.events.attach(instance);
          if(instance.update) {
            this.instancesWithUpdate.push(instance)
          }
          if(instance.fixedUpdate) {
            this.instancesWithFixedUpdate.push(instance)
          }
          if(instance.postUpdate) {
            this.instancesWithPostUpdate.push(instance)
          }
          if(instance.toolsUpdate) {
            this.instancesWithToolsUpdate.push(instance)
          }
          if(entity.script.scripts) {
            this._createAccessors(entity, preRegistered)
          }
          if(entity.script[instanceName]) {
            throw Error(pc.string.format("Script with name '{0}' is already attached to Script Component", instanceName));
          }else {
            entity.script[instanceName] = instance
          }
        }
        delete entity.script.data._instances
      }
    }
    var children = entity.getChildren();
    var i, len = children.length;
    for(i = 0;i < len;i++) {
      if(children[i] instanceof pc.fw.Entity) {
        this._registerInstances(children[i])
      }
    }
  }, _createAccessors:function(entity, instance) {
    var self = this;
    var i;
    var len = entity.script.scripts.length;
    var url = instance.url;
    for(i = 0;i < len;i++) {
      var script = entity.script.scripts[i];
      if(script.url === url) {
        var attributes = script.attributes;
        if(script.name && attributes) {
          attributes.forEach(function(attribute, index) {
            self._createAccessor(attribute, instance)
          });
          entity.script.data.attributes[script.name] = pc.extend([], attributes)
        }
        break
      }
    }
  }, _createAccessor:function(attribute, instance) {
    var self = this;
    self._convertAttributeValue(attribute);
    Object.defineProperty(instance.instance, attribute.name, {get:function() {
      return attribute.value
    }, set:function(value) {
      var oldValue = attribute.value;
      attribute.value = value;
      self._convertAttributeValue(attribute);
      instance.instance.fire("set", attribute.name, oldValue, attribute.value)
    }, configurable:true})
  }, _updateAccessors:function(entity, instance) {
    var self = this;
    var i, k, h;
    var len = entity.script.scripts.length;
    var url = instance.url;
    var scriptComponent, script, name, attributes;
    var removedAttributes;
    var previousAttributes;
    var oldAttribute, newAttribute;
    for(i = 0;i < len;i++) {
      scriptComponent = entity.script;
      script = scriptComponent.scripts[i];
      if(script.url === url) {
        name = script.name;
        attributes = script.attributes;
        if(name) {
          if(attributes) {
            attributes.forEach(function(attribute, index) {
              self._createAccessor(attribute, instance)
            })
          }
          previousAttributes = scriptComponent.data.attributes[name];
          if(previousAttributes) {
            k = previousAttributes.length;
            while(k--) {
              oldAttribute = previousAttributes[k];
              newAttribute = null;
              h = attributes.length;
              while(h--) {
                if(oldAttribute.name === attributes[h].name) {
                  newAttribute = attributes[h];
                  break
                }
              }
              if(!newAttribute) {
                delete instance.instance[oldAttribute.name]
              }else {
                if(oldAttribute.value !== newAttribute.value) {
                  if(instance.instance.onAttributeChanged) {
                    instance.instance.onAttributeChanged(oldAttribute.name, oldAttribute.value, newAttribute.value)
                  }
                }
              }
            }
          }
          if(attributes) {
            scriptComponent.data.attributes[name] = pc.extend([], attributes)
          }else {
            delete scriptComponent.data.attributes[name]
          }
        }
        break
      }
    }
  }, _convertAttributeValue:function(attribute) {
    if(attribute.type === "rgb" || attribute.type === "rgba") {
      if(pc.type(attribute.value) === "array") {
        attribute.value = attribute.value.length === 3 ? new pc.Color(attribute.value[0], attribute.value[1], attribute.value[2]) : new pc.Color(attribute.value[0], attribute.value[1], attribute.value[2], attribute.value[3])
      }
    }else {
      if(attribute.type === "vector") {
        if(pc.type(attribute.value) === "array") {
          attribute.value = new pc.Vec3(attribute.value[0], attribute.value[1], attribute.value[2])
        }
      }
    }
  }});
  return{ScriptComponentSystem:ScriptComponentSystem}
}());
pc.extend(pc.fw, function() {
  var ScriptComponent = function ScriptComponent(system, entity) {
    this.on("set_scripts", this.onSetScripts, this)
  };
  ScriptComponent = pc.inherits(ScriptComponent, pc.fw.Component);
  pc.extend(ScriptComponent.prototype, {send:function(name, functionName) {
    var args = pc.makeArray(arguments).slice(2);
    var instances = this.entity.script.instances;
    var fn;
    if(instances && instances[name]) {
      fn = instances[name].instance[functionName];
      if(fn) {
        return fn.apply(instances[name].instance, args)
      }
    }
  }, onEnable:function() {
    ScriptComponent._super.onEnable.call(this);
    if(this.data.areScriptsLoaded) {
      if(!this.data.initialized) {
        this.system._initializeScriptComponent(this)
      }else {
        this.system._enableScriptComponent(this)
      }
      if(!this.data.postInitialized) {
        this.system._postInitializeScriptComponent(this)
      }
    }
  }, onDisable:function() {
    ScriptComponent._super.onDisable.call(this);
    this.system._disableScriptComponent(this)
  }, onSetScripts:function(name, oldValue, newValue) {
    if(!this.system._inTools || this.runInTools) {
      var onlyUpdateAttributes = true;
      if(oldValue.length !== newValue.length) {
        onlyUpdateAttributes = false
      }else {
        var i;
        len = newValue.length;
        for(i = 0;i < len;i++) {
          if(oldValue[i].url !== newValue[i].url) {
            onlyUpdateAttributes = false;
            break
          }
        }
      }
      if(onlyUpdateAttributes) {
        for(var key in this.instances) {
          if(this.instances.hasOwnProperty(key)) {
            this.system._updateAccessors(this.entity, this.instances[key])
          }
        }
        return
      }
      if(this.enabled) {
        this.system._disableScriptComponent(this)
      }
      this.system._destroyScriptComponent(this);
      this.data.areScriptsLoaded = false;
      var scripts = newValue;
      var urls = scripts.map(function(s) {
        return s.url
      });
      var requests = urls.map(function(url) {
        return new pc.resources.ScriptRequest(url)
      });
      var options = {parent:this.entity.getRequest()};
      var promise = this.system.context.loader.request(requests, options);
      promise.then(function(resources) {
        resources.forEach(function(ScriptType, index) {
          if(ScriptType && this.entity.script) {
            if(!this.entity.script.instances[ScriptType._pcScriptName]) {
              var instance = new ScriptType(this.entity);
              this.system._preRegisterInstance(this.entity, urls[index], ScriptType._pcScriptName, instance)
            }
          }
        }, this);
        if(this.data) {
          this.data.areScriptsLoaded = true
        }
        if(!options.parent) {
          this.system.onInitialize(this.entity);
          this.system.onPostInitialize(this.entity)
        }
      }.bind(this)).then(null, function(error) {
        setTimeout(function() {
          throw error;
        })
      })
    }
  }});
  return{ScriptComponent:ScriptComponent}
}());
pc.extend(pc.fw, function() {
  var ScriptComponentData = function() {
    this.scripts = [];
    this.enabled = true;
    this.instances = {};
    this._instances = {};
    this.runInTools = false;
    this.attributes = {};
    this.initialized = false;
    this.postInitialized = false;
    this.areScriptsLoaded = false
  };
  ScriptComponentData = pc.inherits(ScriptComponentData, pc.fw.ComponentData);
  return{ScriptComponentData:ScriptComponentData}
}());
pc.extend(pc.fw, function() {
  var PackComponentSystem = function PackComponentSystem(context) {
    this.id = "pack";
    context.systems.add(this.id, this);
    this.ComponentType = pc.fw.PackComponent;
    this.DataType = pc.fw.PackComponentData;
    this.schema = []
  };
  PackComponentSystem = pc.inherits(PackComponentSystem, pc.fw.ComponentSystem);
  return{PackComponentSystem:PackComponentSystem}
}());
pc.extend(pc.fw, function() {
  var PackComponent = function PackComponent(system, entity) {
  };
  PackComponent = pc.inherits(PackComponent, pc.fw.Component);
  return{PackComponent:PackComponent}
}());
pc.extend(pc.fw, function() {
  var PackComponentData = function() {
  };
  PackComponentData = pc.inherits(PackComponentData, pc.fw.ComponentData);
  return{PackComponentData:PackComponentData}
}());
pc.extend(pc.fw, function() {
  var PickComponentSystem = function PickComponentSystem(context) {
    this.id = "pick";
    context.systems.add(this.id, this);
    this.ComponentType = pc.fw.PickComponent;
    this.DataType = pc.fw.PickComponentData;
    this.schema = [{name:"layer", exposed:false}, {name:"shapes", exposed:false}, {name:"material", exposed:false}];
    this.layers = {"default":[]};
    this.display = false;
    this.on("remove", this.onRemove, this)
  };
  PickComponentSystem = pc.inherits(PickComponentSystem, pc.fw.ComponentSystem);
  pc.extend(PickComponentSystem.prototype, {initializeComponentData:function(component, data, properties) {
    data.material = new pc.scene.PhongMaterial;
    properties = ["material"];
    PickComponentSystem._super.initializeComponentData.call(this, component, data, properties)
  }, onRemove:function(entity, data) {
    this.deleteShapes(data.layer, data.shapes)
  }, addShape:function(layer, shape) {
    if(this.layers[layer] === undefined) {
      this.layers[layer] = []
    }
    this.layers[layer].push(shape.model);
    if(this.display) {
      this.context.scene.addModel(shape.model)
    }
  }, deleteShapes:function(layer, shapes) {
    var layerModels = this.layers[layer];
    for(var i = 0;i < shapes.length;i++) {
      var model = shapes[i].model;
      var index = layerModels.indexOf(model);
      if(index !== -1) {
        layerModels.splice(index, 1)
      }
      if(this.display) {
        this.context.scene.removeModel(model)
      }
    }
  }, getLayerModels:function(layerName) {
    return this.layers[layerName]
  }});
  return{PickComponentSystem:PickComponentSystem}
}());
pc.extend(pc.fw, function() {
  var PickComponent = function PickComponent(system, entity) {
  };
  PickComponent = pc.inherits(PickComponent, pc.fw.Component);
  pc.extend(PickComponent.prototype, {addShape:function(shape, shapeName) {
    var material = this.data.material;
    var mesh = null;
    switch(shape.type) {
      case pc.shape.Type.BOX:
        mesh = pc.scene.procedural.createBox(this.system.context.graphicsDevice, {halfExtents:shape.halfExtents});
        break;
      case pc.shape.Type.SPHERE:
        mesh = pc.scene.procedural.createSphere(this.system.context.graphicsDevice, {radius:shape.radius});
        break;
      case pc.shape.Type.TORUS:
        mesh = pc.scene.procedural.createTorus(this.system.context.graphicsDevice, {tubeRadius:shape.iradius, ringRadius:shape.oradius});
        break
    }
    var node = new pc.scene.GraphNode;
    var meshInstance = new pc.scene.MeshInstance(node, mesh, material);
    meshInstance._entity = this.entity;
    var model = new pc.scene.Model;
    model.graph = node;
    model.meshInstances = [meshInstance];
    var shape = {shape:shape, shapeName:shapeName, model:model};
    this.data.shapes.push(shape);
    this.system.addShape(this.data.layer, shape)
  }, deleteShapes:function() {
    this.system.deleteShapes(this.data.layer, this.data.shapes);
    this.data.shapes = []
  }});
  return{PickComponent:PickComponent}
}());
pc.extend(pc.fw, function() {
  function PickComponentData() {
    this.layer = "default";
    this.shapes = [];
    this.material = null
  }
  PickComponentData = pc.inherits(PickComponentData, pc.fw.ComponentData);
  return{PickComponentData:PickComponentData}
}());
pc.extend(pc.fw, function() {
  var AudioSourceComponentSystem = function(context, manager) {
    this.id = "audiosource";
    this.description = "Specifies audio assets that can be played at the position of the Entity.";
    context.systems.add(this.id, this);
    this.ComponentType = pc.fw.AudioSourceComponent;
    this.DataType = pc.fw.AudioSourceComponentData;
    this.schema = [{name:"enabled", displayName:"Enabled", description:"Disabled audiosource components do not play any sounds", type:"boolean", defaultValue:true}, {name:"assets", displayName:"Assets", description:"Audio assets", type:"asset", options:{max:100, type:"audio"}, defaultValue:[]}, {name:"volume", displayName:"Volume", description:"The sound volume", type:"number", options:{max:1, min:0, step:0.1}, defaultValue:1}, {name:"pitch", displayName:"Pitch", description:"The sound pitch", type:"number", 
    defaultValue:1, options:{min:0.01, step:0.01}}, {name:"loop", displayName:"Loop", description:"Set whether sound loops or not", type:"boolean", defaultValue:false}, {name:"activate", displayName:"Activate", description:"Play first audio sample when scene loads", type:"boolean", defaultValue:true}, {name:"3d", displayName:"3d", description:"3d sounds are positioned in space, and their sound is dependent on listener position/orientation. Non-3d sounds are uniform aross space", type:"boolean", defaultValue:true}, 
    {name:"minDistance", displayName:"Min Distance", description:"Distance from listener under which the sound is at full volume", type:"number", defaultValue:1, options:{min:0}}, {name:"maxDistance", displayName:"Max Distance", description:"Distance from listener over which the sound cannot be heard", type:"number", defaultValue:1E4, options:{min:0}}, {name:"rollOffFactor", displayName:"Roll-off factor", description:"Strength of the roll off", type:"number", defaultValue:1, options:{min:0}}, {name:"sources", 
    exposed:false, readOnly:true}, {name:"currentSource", exposed:false, readOnly:true}, {name:"channel", exposed:false, readOnly:true}];
    this.exposeProperties();
    this.manager = manager;
    pc.fw.ComponentSystem.on("initialize", this.onInitialize, this);
    pc.fw.ComponentSystem.on("update", this.onUpdate, this)
  };
  AudioSourceComponentSystem = pc.inherits(AudioSourceComponentSystem, pc.fw.ComponentSystem);
  pc.extend(AudioSourceComponentSystem.prototype, {initializeComponentData:function(component, data, properties) {
    properties = ["enabled", "assets", "volume", "pitch", "loop", "activate", "3d", "minDistance", "maxDistance", "rollOffFactor"];
    AudioSourceComponentSystem._super.initializeComponentData.call(this, component, data, properties);
    component.paused = !(component.enabled && data.activate)
  }, onInitialize:function(root) {
    if(root.audiosource && root.enabled && root.audiosource.enabled && root.audiosource.activate) {
      root.audiosource.play(root.audiosource.currentSource)
    }
    var children = root.getChildren();
    var i, len = children.length;
    for(i = 0;i < len;i++) {
      if(children[i] instanceof pc.fw.Entity) {
        this.onInitialize(children[i])
      }
    }
  }, onUpdate:function(dt) {
    var components = this.store;
    for(var id in components) {
      if(components.hasOwnProperty(id)) {
        var component = components[id];
        var entity = component.entity;
        var componentData = component.data;
        if(componentData.enabled && entity.enabled && componentData.channel instanceof pc.audio.Channel3d) {
          var pos = entity.getPosition();
          componentData.channel.setPosition(pos)
        }
      }
    }
  }, setVolume:function(volume) {
    this.manager.setVolume(volume)
  }});
  return{AudioSourceComponentSystem:AudioSourceComponentSystem}
}());
pc.extend(pc.fw, function() {
  var AudioSourceComponent = function(system, entity) {
    this.on("set_assets", this.onSetAssets, this);
    this.on("set_loop", this.onSetLoop, this);
    this.on("set_volume", this.onSetVolume, this);
    this.on("set_pitch", this.onSetPitch, this);
    this.on("set_minDistance", this.onSetMinDistance, this);
    this.on("set_maxDistance", this.onSetMaxDistance, this);
    this.on("set_rollOffFactor", this.onSetRollOffFactor, this)
  };
  AudioSourceComponent = pc.inherits(AudioSourceComponent, pc.fw.Component);
  pc.extend(AudioSourceComponent.prototype, {play:function(name) {
    if(!this.enabled || !this.entity.enabled) {
      return
    }
    if(this.channel) {
      this.stop()
    }
    var channel;
    var componentData = this.data;
    if(componentData.sources[name]) {
      if(!componentData.sources[name].isLoaded) {
        logWARNING(pc.string.format("Audio asset '{0}' is not loaded (probably an unsupported format) and will not be played", name));
        return
      }
      if(!componentData["3d"]) {
        channel = this.system.manager.playSound(componentData.sources[name], componentData);
        componentData.currentSource = name;
        componentData.channel = channel
      }else {
        var pos = this.entity.getPosition();
        channel = this.system.manager.playSound3d(componentData.sources[name], pos, componentData);
        componentData.currentSource = name;
        componentData.channel = channel
      }
    }
  }, pause:function() {
    if(this.channel) {
      this.channel.pause()
    }
  }, unpause:function() {
    if(this.channel && this.channel.paused) {
      this.channel.unpause()
    }
  }, stop:function() {
    if(this.channel) {
      this.channel.stop();
      this.channel = null
    }
  }, onSetAssets:function(name, oldValue, newValue) {
    var componentData = this.data;
    var newAssets = [];
    var i, len = newValue.length;
    if(len) {
      for(i = 0;i < len;i++) {
        if(oldValue.indexOf(newValue[i]) < 0) {
          newAssets.push(newValue[i])
        }
      }
    }
    if(!this.system._inTools && newAssets.length) {
      this.loadAudioSourceAssets(newAssets)
    }
  }, onSetLoop:function(name, oldValue, newValue) {
    if(oldValue != newValue) {
      if(this.channel) {
        this.channel.setLoop(newValue)
      }
    }
  }, onSetVolume:function(name, oldValue, newValue) {
    if(oldValue != newValue) {
      if(this.channel) {
        this.channel.setVolume(newValue)
      }
    }
  }, onSetPitch:function(name, oldValue, newValue) {
    if(oldValue != newValue) {
      if(this.channel) {
        this.channel.setPitch(newValue)
      }
    }
  }, onSetMaxDistance:function(name, oldValue, newValue) {
    if(oldValue != newValue) {
      if(this.channel instanceof pc.audio.Channel3d) {
        this.channel.setMaxDistance(newValue)
      }
    }
  }, onSetMinDistance:function(name, oldValue, newValue) {
    if(oldValue != newValue) {
      if(this.channel instanceof pc.audio.Channel3d) {
        this.channel.setMinDistance(newValue)
      }
    }
  }, onSetRollOffFactor:function(name, oldValue, newValue) {
    if(oldValue != newValue) {
      if(this.channel instanceof pc.audio.Channel3d) {
        this.channel.setRollOffFactor(newValue)
      }
    }
  }, onEnable:function() {
    AudioSourceComponent._super.onEnable.call(this);
    if(this.data.activate && !this.channel) {
      this.play(this.currentSource)
    }else {
      this.unpause()
    }
  }, onDisable:function() {
    AudioSourceComponent._super.onDisable.call(this);
    this.pause()
  }, loadAudioSourceAssets:function(guids) {
    var options = {parent:this.entity.getRequest()};
    var assets = guids.map(function(guid) {
      return this.system.context.assets.getAssetByResourceId(guid)
    }, this);
    var requests = [];
    var names = [];
    assets.forEach(function(asset) {
      if(!asset) {
        logERROR(pc.string.format("Trying to load audiosource component before assets {0} are loaded", guids))
      }else {
        requests.push(new pc.resources.AudioRequest(asset.getFileUrl()));
        names.push(asset.name)
      }
    });
    this.system.context.loader.request(requests, options).then(function(audioResources) {
      var sources = {};
      for(var i = 0;i < requests.length;i++) {
        sources[names[i]] = audioResources[i]
      }
      if(names.length) {
        this.data.currentSource = names[0]
      }
      this.data.sources = sources;
      if(!options.parent && this.activate) {
        this.play(names[0])
      }
    }.bind(this))
  }});
  return{AudioSourceComponent:AudioSourceComponent}
}());
pc.fw.AudioSourceComponentData = function AudioSourceComponentData() {
  this.enabled = true;
  this.assets = [];
  this.activate = true;
  this.volume = 1;
  this.pitch = 1;
  this.loop = false;
  this["3d"] = true;
  this.minDistance = 1;
  this.maxDistance = 1E4;
  this.rollOffFactor = 1;
  this.paused = true;
  this.sources = {};
  this.currentSource = null;
  this.channel = null
};
pc.extend(pc.fw, function() {
  var AudioListenerComponentSystem = function(context, manager) {
    this.id = "audiolistener";
    this.description = "Specifies the location of the listener for 3D audio playback.";
    context.systems.add(this.id, this);
    this.ComponentType = pc.fw.AudioListenerComponent;
    this.DataType = pc.fw.AudioListenerComponentData;
    this.schema = [{name:"enabled", displayName:"Enabled", description:"Disabled audio listener components do not affect audiosources", type:"boolean", defaultValue:true}];
    this.exposeProperties();
    this.manager = manager;
    this.current = null;
    pc.fw.ComponentSystem.on("update", this.onUpdate, this)
  };
  AudioListenerComponentSystem = pc.inherits(AudioListenerComponentSystem, pc.fw.ComponentSystem);
  pc.extend(AudioListenerComponentSystem.prototype, {initializeComponentData:function(component, data, properties) {
    properties = ["enabled"];
    AudioListenerComponentSystem._super.initializeComponentData.call(this, component, data, properties)
  }, onUpdate:function(dt) {
    if(this.current) {
      var position = this.current.getPosition();
      this.manager.listener.setPosition(position);
      var wtm = this.current.getWorldTransform();
      this.manager.listener.setOrientation(wtm)
    }
  }});
  return{AudioListenerComponentSystem:AudioListenerComponentSystem}
}());
pc.extend(pc.fw, function() {
  var AudioListenerComponent = function(system, entity) {
  };
  AudioListenerComponent = pc.inherits(AudioListenerComponent, pc.fw.Component);
  pc.extend(AudioListenerComponent.prototype, {setCurrentListener:function() {
    if(this.enabled && this.entity.audiolistener && this.entity.enabled) {
      this.system.current = this.entity;
      var position = this.system.current.getPosition();
      this.system.manager.listener.setPosition(position)
    }
  }, onEnable:function() {
    AudioListenerComponent._super.onEnable.call(this);
    this.setCurrentListener()
  }, onDisable:function() {
    AudioListenerComponent._super.onDisable.call(this);
    if(this.system.current === this.entity) {
      this.system.current = null
    }
  }});
  return{AudioListenerComponent:AudioListenerComponent}
}());
pc.extend(pc.fw, function() {
  var AudioListenerComponentData = function() {
    this.enabled = true
  };
  AudioListenerComponentData = pc.inherits(AudioListenerComponentData, pc.fw.ComponentData);
  return{AudioListenerComponentData:AudioListenerComponentData}
}());
pc.extend(pc.fw, function() {
  var DesignerComponentSystem = function(context) {
    context.systems.add("designer", this)
  };
  DesignerComponentSystem = pc.inherits(DesignerComponentSystem, pc.fw.ComponentSystem);
  DesignerComponentSystem.prototype.createComponent = function(entity, data) {
    var componentData = new pc.fw.DesignerComponentData;
    this.initializeComponent(entity, componentData, data, ["fillWindow", "width", "height"]);
    return componentData
  };
  return{DesignerComponentSystem:DesignerComponentSystem}
}());
pc.extend(pc.fw, function() {
  DesignerComponentData = function() {
    this.fillWindow = true;
    this.width = 800;
    this.height = 450
  };
  DesignerComponentData = pc.inherits(DesignerComponentData, pc.fw.ComponentData);
  return{DesignerComponentData:DesignerComponentData}
}());
pc.extend(pc.fw, function() {
  var position = new pc.Vec3;
  var rotation = new pc.Vec3;
  var pos2d;
  var b2World, b2Vec2, b2Body, b2BodyDef, b2FixtureDef, b2PolygonShape, b2CircleShape;
  function unpack() {
    b2World = Box2D.Dynamics.b2World;
    b2Vec2 = Box2D.Common.Math.b2Vec2;
    b2Body = Box2D.Dynamics.b2Body;
    b2BodyDef = Box2D.Dynamics.b2BodyDef;
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
    pos2d = new b2Vec2
  }
  var Body2dComponentSystem = function Body2dComponentSystem(context) {
    if(typeof Box2D !== "undefined" && !b2World) {
      unpack()
    }
    this.id = "body2d";
    context.systems.add(this.id, this);
    this.ComponentType = pc.fw.Body2dComponent;
    this.DataType = pc.fw.Body2dComponentData;
    this.schema = [{name:"static", displayName:"Static", description:"Static bodies are immovable and do not collide with other static bodies.", type:"boolean", defaultValue:true}, {name:"body", exposed:false, readOnly:true}, {name:"bodyDef", exposed:false, readOnly:true}];
    this.exposeProperties();
    this._rayStart = new pc.Vec3;
    this._rayEnd = new pc.Vec3;
    this.time = 0;
    this.step = 1 / 60;
    this.xi = 0;
    this.yi = 2;
    this.ri = 1;
    if(b2World) {
      this.b2World = new b2World(new b2Vec2(0, 0), true);
      pc.fw.ComponentSystem.on("update", this.onUpdate, this)
    }
    this.on("remove", this.onRemove, this)
  };
  Body2dComponentSystem = pc.inherits(Body2dComponentSystem, pc.fw.ComponentSystem);
  pc.extend(Body2dComponentSystem.prototype, {initializeComponentData:function(component, data, properties) {
    properties = ["static"];
    Body2dComponentSystem._super.initializeComponentData.call(this, component, data, properties);
    if(typeof Box2D !== "undefined") {
      this.createBody(component)
    }
  }, createBody:function(component) {
    if(component.entity.collisionrect || component.entity.collisioncircle) {
      var bodyDef = new b2BodyDef;
      position.copy(component.entity.getPosition());
      rotation.copy(component.entity.getEulerAngles());
      bodyDef.type = component.static ? b2Body.b2_staticBody : b2Body.b2_dynamicBody;
      bodyDef.position.Set(position.data[this.xi], position.data[this.yi]);
      var angle = component._eulersToAngle(rotation);
      bodyDef.angle = -angle * pc.math.DEG_TO_RAD;
      bodyDef.userData = component.entity;
      component.data.bodyDef = bodyDef
    }
    if(component.data.body) {
      this.removeBody(component.entity, component.data.body)
    }
    if(component.entity.collisionrect) {
      component.data.body = this.addBody(component.bodyDef, component.entity.collisionrect.fixtureDef)
    }else {
      if(component.entity.collisioncircle) {
        component.data.body = this.addBody(component.bodyDef, component.entity.collisioncircle.fixtureDef)
      }else {
        component.data.body = null
      }
    }
  }, onRemove:function(entity, data) {
    if(data.body) {
      this.removeBody(entity, data.body)
    }
    data.body = null
  }, to2d:function(vec3, vec2) {
    vec2 = vec2 || new b2Vec2;
    return vec2.Set(vec3[this.xi], vec3[this.yi])
  }, addBody:function(bodyDef, fixtureDef) {
    var body = this.b2World.CreateBody(bodyDef);
    body.CreateFixture(fixtureDef);
    return body
  }, removeBody:function(entity, body) {
    this.b2World.DestroyBody(body);
    if(entity.body2d.body) {
      entity.body2d.data.body = null
    }
  }, setGravity:function(x, y) {
    pos2d.Set(x, y);
    this.b2World.SetGravity(pos2d)
  }, raycast:function(callback, start, end) {
    var s = new b2Vec2;
    var e = new b2Vec2;
    this.to2d(start, s);
    this.to2d(end, e);
    this._rayStart.vec3.copy(start);
    this._rayEnd.vec3.copy(end);
    this.b2World.RayCast(callback, s, e)
  }, raycastFirst:function(start, end, ignore) {
    var result;
    var fraction = 1;
    this.raycast(function(fixture, point, normal, f) {
      var e = fixture.GetUserData();
      if(e !== ignore && f < fraction) {
        result = e;
        fraction = f
      }
      return 1
    }, start, end);
    return result
  }, onUpdate:function(dt) {
    var velocityIterations = 6;
    var positionIterations = 2;
    var components = this.store;
    for(var id in components) {
      if(components.hasOwnProperty(id)) {
        var entity = components[id].entity;
        var componentData = components[id].data;
        if(componentData.body && !componentData.static) {
          entity.body2d.updateTransform(componentData.body)
        }
      }
    }
    this.time += dt;
    while(this.time > this.step) {
      this.b2World.Step(this.step, velocityIterations, positionIterations);
      this.time -= this.step
    }
  }});
  return{Body2dComponentSystem:Body2dComponentSystem}
}());
pc.extend(pc.fw, function() {
  var transform = new pc.Mat4;
  var position = new pc.Vec3;
  var rotation = new pc.Vec3;
  var b2World, b2Vec2, b2Body, b2BodyDef, b2FixtureDef, b2PolygonShape, b2CircleShape;
  function unpack() {
    var b2World = Box2D.Dynamics.b2World;
    var b2Vec2 = Box2D.Common.Math.b2Vec2;
    var b2Body = Box2D.Dynamics.b2Body;
    var b2BodyDef = Box2D.Dynamics.b2BodyDef;
    var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
    var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
    var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
  }
  var Body2dComponent = function Body2dComponent(system, entity) {
    if(typeof Box2D !== "undefined" && !b2World) {
      unpack()
    }
    this.on("set_static", this.onSetStatic, this);
    entity.on("livelink:updatetransform", this.onLiveLinkUpdateTransform, this)
  };
  Body2dComponent = pc.inherits(Body2dComponent, pc.fw.Component);
  pc.extend(Body2dComponent.prototype, {applyForce:function(force, point) {
    var body = this.entity.body2d.body;
    if(body) {
      if(!point) {
        point = position;
        point[this.system.xi] = body.GetPosition().x;
        point[this.system.yi] = body.GetPosition().y
      }
      body.ApplyForce({x:force[this.system.xi], y:force[this.system.yi]}, {x:point[this.system.xi], y:point[this.system.yi]})
    }
  }, applyImpulse:function(impulse, point) {
    var body = this.entity.body2d.body;
    if(body) {
      if(!point) {
        point = position;
        point[this.system.xi] = body.GetPosition().x;
        point[this.system.yi] = body.GetPosition().y
      }
      body.ApplyImpulse({x:impulse[this.system.xi], y:impulse[this.system.yi]}, {x:point[this.system.xi], y:point[this.system.yi]})
    }
  }, setLinearVelocity:function(x, y) {
    var body = this.entity.body2d.body;
    if(body) {
      var vel = body.GetLinearVelocity();
      vel.x = x;
      vel.y = y;
      body.SetLinearVelocity(vel)
    }
  }, setAngularVelocity:function(a) {
    var body = this.entity.body2d.body;
    if(body) {
      body.SetAngularVelocity(a)
    }
  }, setTransform:function(transform) {
    transform.getTranslation(position);
    transform.getEulerAngles(rotation);
    var angle = this._eulersToAngle(rotation);
    this.setPositionAndAngle(position.data[this.system.xi], position.data[this.system.yi], -angle)
  }, setPosition:function(x, y) {
    var body = this.entity.body2d.body;
    if(body) {
      body.SetAwake(true);
      var pos = body.GetPosition();
      pos.x = x;
      pos.y = y;
      body.SetPosition(pos);
      this.updateTransform(body)
    }
  }, setAngle:function(a) {
    var body = this.entity.body2d.body;
    if(body) {
      body.SetAwake(true);
      body.SetAngle(a * pc.math.DEG_TO_RAD);
      this.updateTransform(body)
    }
  }, setPositionAndAngle:function(x, y, a) {
    var body = this.entity.body2d.body;
    if(body) {
      body.SetAwake(true);
      var pos = body.GetPosition();
      pos.x = x;
      pos.y = y;
      body.SetPositionAndAngle(pos, a * pc.math.DEG_TO_RAD);
      this.updateTransform(body)
    }
  }, getAngle:function() {
    return this.entity.body2d.body.GetAngle() * pc.math.RAD_TO_DEG
  }, setLinearDamping:function(entity, damping) {
    var body = this.entity.body2d.body;
    if(body) {
      body.SetLinearDamping(damping)
    }
  }, updateTransform:function(body) {
    var entityPos = this.entity.getPosition();
    var angles = this.entity.getLocalEulerAngles();
    var position2d = body.GetPosition();
    position.data[this.system.xi] = position2d.x;
    position.data[this.system.ri] = entityPos.y;
    position.data[this.system.yi] = position2d.y;
    rotation.data[this.system.xi] = 0;
    rotation.data[this.system.ri] = -body.GetAngle() * pc.math.RAD_TO_DEG;
    rotation.data[this.system.yi] = 0;
    this.entity.setPosition(position);
    this.entity.setEulerAngles(rotation)
  }, onSetStatic:function(name, oldValue, newValue) {
    var body = this.entity.body2d.body;
    if(body) {
      if(newValue) {
        body.SetType(b2Body.b2_staticBody)
      }else {
        body.SetType(b2Body.b2_dynamicBody)
      }
    }
  }, onLiveLinkUpdateTransform:function(position, rotation, scale) {
    this.setTransform(this.entity.getWorldTransform());
    this.setLinearVelocity(0, 0);
    this.setAngularVelocity(0)
  }, _eulersToAngle:function(rotation) {
    var angle = rotation[this.system.ri];
    if(rotation[this.system.xi] > 179.9 && rotation[this.system.yi] > 179.9) {
      angle = 180 - rotation[this.system.ri]
    }
    return angle
  }});
  return{Body2dComponent:Body2dComponent}
}());
pc.extend(pc.fw, function() {
  var Body2dComponentData = function() {
    this.density = 1;
    this.friction = 0.5;
    this.restitution = 0;
    this.static = true;
    this.shape = pc.shape.Type.RECT;
    this.bodyDef = null;
    this.body = null
  };
  Body2dComponentData = pc.inherits(Body2dComponentData, pc.fw.ComponentData);
  return{Body2dComponentData:Body2dComponentData}
}());
pc.extend(pc.fw, function() {
  var b2World, b2Vec2, b2Body, b2BodyDef, b2FixtureDef, b2PolygonShape, b2CircleShape;
  function unpack() {
    b2World = Box2D.Dynamics.b2World;
    b2Vec2 = Box2D.Common.Math.b2Vec2;
    b2Body = Box2D.Dynamics.b2Body;
    b2BodyDef = Box2D.Dynamics.b2BodyDef;
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
  }
  var CollisionRectComponentSystem = function CollisionRectComponentSystem(context) {
    if(typeof Box2D !== "undefined" && !b2World) {
      unpack()
    }
    this.id = "collisionrect";
    context.systems.add(this.id, this);
    this.ComponentType = pc.fw.CollisionRectComponent;
    this.DataType = pc.fw.CollisionRectComponentData;
    this.schema = [{name:"density", displayName:"Density", description:"The density of the body, this determine the mass", type:"number", options:{min:0, step:0.01}, defaultValue:1}, {name:"friction", displayName:"Friction", description:"The friction when the body slides along another body", type:"number", options:{min:0, step:0.01}, defaultValue:0.5}, {name:"restitution", displayName:"Restitution", description:"The restitution determines the elasticity of collisions. 0 means an object doesn't bounce at all, a value of 1 will be a perfect reflection", 
    type:"number", options:{min:0, step:0.01}, defaultValue:0}, {name:"x", displayName:"Size: X", description:"The size of the Rect in the x-axis", type:"number", options:{min:0, step:0.1}, defaultValue:0.5}, {name:"y", displayName:"Size: Y", description:"The size of the Rect in the y-axis", type:"number", options:{min:0, step:0.1}, defaultValue:0.5}, {name:"model", expose:false}];
    this.exposeProperties();
    var gd = context.graphicsDevice;
    var format = new pc.gfx.VertexFormat(gd, [{semantic:pc.gfx.SEMANTIC_POSITION, components:3, type:pc.gfx.ELEMENTTYPE_FLOAT32}]);
    var vertexBuffer = new pc.gfx.VertexBuffer(gd, format, 4);
    var positions = new Float32Array(vertexBuffer.lock());
    positions.set([-0.5, 0, -0.5, -0.5, 0, 0.5, 0.5, 0, 0.5, 0.5, 0, -0.5]);
    vertexBuffer.unlock();
    var indexBuffer = new pc.gfx.IndexBuffer(gd, pc.gfx.INDEXFORMAT_UINT8, 8);
    var indices = new Uint8Array(indexBuffer.lock());
    indices.set([0, 1, 1, 2, 2, 3, 3, 0]);
    indexBuffer.unlock();
    this.mesh = new pc.scene.Mesh;
    this.mesh.vertexBuffer = vertexBuffer;
    this.mesh.indexBuffer[0] = indexBuffer;
    this.mesh.primitive[0].type = pc.gfx.PRIMITIVE_LINES;
    this.mesh.primitive[0].base = 0;
    this.mesh.primitive[0].count = indexBuffer.getNumIndices();
    this.mesh.primitive[0].indexed = true;
    this.material = new pc.scene.BasicMaterial;
    this.material.color = new pc.Color(0, 0, 1, 1);
    this.material.update();
    this.debugRender = false;
    this.on("remove", this.onRemove, this);
    pc.fw.ComponentSystem.on("update", this.onUpdate, this);
    pc.fw.ComponentSystem.on("toolsUpdate", this.onToolsUpdate, this)
  };
  CollisionRectComponentSystem = pc.inherits(CollisionRectComponentSystem, pc.fw.ComponentSystem);
  CollisionRectComponentSystem.prototype = pc.extend(CollisionRectComponentSystem.prototype, {initializeComponentData:function(component, data, properties) {
    data.model = new pc.scene.Model;
    data.model.graph = new pc.scene.GraphNode;
    data.model.meshInstances = [new pc.scene.MeshInstance(data.model.graph, this.mesh, this.material)];
    properties = ["density", "friction", "restitution", "x", "y", "model"];
    CollisionRectComponentSystem._super.initializeComponentData.call(this, component, data, properties);
    if(typeof Box2D !== "undefined") {
      component.fixtureDef = this.createFixtureDef(component.entity, component);
      if(component.entity.body2d) {
        this.context.systems.body2d.createBody(component.entity.body2d)
      }
    }
  }, createFixtureDef:function(entity, componentData) {
    var fixtureDef = new b2FixtureDef;
    fixtureDef.density = componentData.density;
    fixtureDef.friction = componentData.friction;
    fixtureDef.restitution = componentData.restitution;
    fixtureDef.shape = new b2PolygonShape;
    fixtureDef.shape.SetAsBox(componentData.x, componentData.y);
    fixtureDef.userData = entity;
    return fixtureDef
  }, onRemove:function(entity, data) {
    if(entity.body2d && entity.body2d.body) {
      this.context.systems.body2d.removeBody(entity, entity.body2d.body)
    }
    if(this.context.scene.containsModel(data.model)) {
      this.context.scene.removeModel(data.model);
      this.context.root.removeChild(data.model.graph)
    }
  }, setDebugRender:function(value) {
    this.debugRender = value
  }, onUpdate:function(dt) {
    if(this.debugRender) {
      this.updateDebugShapes()
    }
  }, onToolsUpdate:function(dt) {
    this.updateDebugShapes()
  }, updateDebugShapes:function() {
    var components = this.store;
    var xi = this.context.systems.body2d.xi;
    var yi = this.context.systems.body2d.yi;
    var ri = this.context.systems.body2d.ri;
    for(var id in components) {
      var entity = components[id].entity;
      var data = components[id].data;
      if(!this.context.scene.containsModel(data.model)) {
        this.context.scene.addModel(data.model);
        this.context.root.addChild(data.model.graph)
      }
      var s = [];
      s[xi] = data.x * 2;
      s[yi] = data.y * 2;
      s[ri] = 0.5 * 2;
      var model = data.model;
      var root = model.graph;
      root.setPosition(entity.getPosition());
      root.setRotation(entity.getRotation());
      root.setLocalScale(s[0], s[1], s[2])
    }
  }});
  return{CollisionRectComponentSystem:CollisionRectComponentSystem}
}());
pc.extend(pc.fw, function() {
  var CollisionRectComponent = function CollisionRectComponent() {
    this.on("set_density", this.onSetDensity, this);
    this.on("set_friction", this.onSetFriction, this);
    this.on("set_restitution", this.onSetRestitution, this);
    this.on("set_x", this.onSetX, this);
    this.on("set_y", this.onSetY, this)
  };
  CollisionRectComponent = pc.inherits(CollisionRectComponent, pc.fw.Component);
  pc.extend(CollisionRectComponent.prototype, {onSetDensity:function(name, oldValue, newValue) {
    if(!this.entity.body2d) {
      return
    }
    if(this.entity.body2d.body) {
      var fixture = this.entity.body2d.body.GetFixtureList();
      fixture.SetDensity(newValue);
      this.entity.body2d.body.ResetMassData()
    }
  }, onSetFriction:function(name, oldValue, newValue) {
    if(!this.entity.body2d) {
      return
    }
    if(this.entity.body2d.body) {
      var fixture = this.entity.body2d.body.GetFixtureList();
      fixture.SetFriction(newValue);
      this.entity.body2d.body.ResetMassData()
    }
  }, onSetRestitution:function(name, oldValue, newValue) {
    if(!this.entity.body2d) {
      return
    }
    if(this.entity.body2d.body) {
      var fixture = this.entity.body2d.body.GetFixtureList();
      fixture.SetRestitution(newValue);
      this.entity.body2d.body.ResetMassData()
    }
  }, onSetX:function(name, oldValue, newValue) {
    if(!this.entity.body2d) {
      return
    }
    var body = this.entity.body2d.body;
    if(body) {
      var fixture = body.GetFixtureList();
      var shape = fixture.GetShape();
      shape.SetAsBox(newValue, this.y);
      body.SetAwake(true)
    }
  }, onSetY:function(name, oldValue, newValue) {
    if(!this.entity.body2d) {
      return
    }
    var body = this.entity.body2d.body;
    if(body) {
      var fixture = body.GetFixtureList();
      var shape = fixture.GetShape();
      shape.SetAsBox(this.x, newValue);
      body.SetAwake(true)
    }
  }});
  return{CollisionRectComponent:CollisionRectComponent}
}());
pc.extend(pc.fw, function() {
  var CollisionRectComponentData = function() {
    this.density = 1;
    this.friction = 0.5;
    this.restitution = 0;
    this.x = 0.5;
    this.y = 0.5
  };
  CollisionRectComponentData = pc.inherits(CollisionRectComponentData, pc.fw.ComponentData);
  return{CollisionRectComponentData:CollisionRectComponentData}
}());
pc.extend(pc.fw, function() {
  var b2World, b2Vec2, b2Body, b2BodyDef, b2FixtureDef, b2PolygonShape, b2CircleShape;
  function unpack() {
    b2World = Box2D.Dynamics.b2World;
    b2Vec2 = Box2D.Common.Math.b2Vec2;
    b2Body = Box2D.Dynamics.b2Body;
    b2BodyDef = Box2D.Dynamics.b2BodyDef;
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
  }
  var CollisionCircleComponentSystem = function CollisionCircleComponentSystem(context) {
    if(typeof Box2D !== "undefined" && !b2World) {
      unpack()
    }
    this.id = "collisioncircle";
    context.systems.add(this.id, this);
    this.ComponentType = pc.fw.CollisionCircleComponent;
    this.DataType = pc.fw.CollisionCircleComponentData;
    this.schema = [{name:"density", displayName:"Density", description:"The density of the body, this determine the mass", type:"number", options:{min:0, step:0.01}, defaultValue:1}, {name:"friction", displayName:"Friction", description:"The friction when the body slides along another body", type:"number", options:{min:0, step:0.01}, defaultValue:0.5}, {name:"restitution", displayName:"Restitution", description:"The restitution determines the elasticity of collisions. 0 means an object doesn't bounce at all, a value of 1 will be a perfect reflection", 
    type:"number", options:{min:0, step:0.01}, defaultValue:0}, {name:"radius", displayName:"Radius", description:"The size of the Rect in the x-axis", type:"number", options:{min:0, step:0.1}, defaultValue:1}, {name:"model", exposed:false}];
    this.exposeProperties();
    var gd = context.graphicsDevice;
    var format = new pc.gfx.VertexFormat(gd, [{semantic:pc.gfx.SEMANTIC_POSITION, components:3, type:pc.gfx.ELEMENTTYPE_FLOAT32}]);
    var vertexBuffer = new pc.gfx.VertexBuffer(gd, format, 41);
    var positions = new Float32Array(vertexBuffer.lock());
    var r = 0.5;
    var i;
    var numVerts = vertexBuffer.getNumVertices();
    for(i = 0;i < numVerts - 1;i++) {
      var theta = 2 * Math.PI * (i / (numVerts - 2));
      var x = r * Math.cos(theta);
      var z = r * Math.sin(theta);
      positions[i * 3 + 0] = x;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = z
    }
    vertexBuffer.unlock();
    var indexBuffer = new pc.gfx.IndexBuffer(gd, pc.gfx.INDEXFORMAT_UINT8, 80);
    var inds = new Uint8Array(indexBuffer.lock());
    for(i = 0;i < 40;i++) {
      inds[i * 2 + 0] = i;
      inds[i * 2 + 1] = i + 1
    }
    indexBuffer.unlock();
    this.mesh = new pc.scene.Mesh;
    this.mesh.vertexBuffer = vertexBuffer;
    this.mesh.indexBuffer[0] = indexBuffer;
    this.mesh.primitive[0].type = pc.gfx.PRIMITIVE_LINES;
    this.mesh.primitive[0].base = 0;
    this.mesh.primitive[0].count = indexBuffer.getNumIndices();
    this.mesh.primitive[0].indexed = true;
    this.material = new pc.scene.BasicMaterial;
    this.material.color = pc.Color(0, 0, 1, 1);
    this.material.update();
    this.debugRender = false;
    this.on("remove", this.onRemove, this);
    pc.fw.ComponentSystem.on("update", this.onUpdate, this);
    pc.fw.ComponentSystem.on("toolsUpdate", this.onToolsUpdate, this)
  };
  CollisionCircleComponentSystem = pc.inherits(CollisionCircleComponentSystem, pc.fw.ComponentSystem);
  pc.extend(CollisionCircleComponentSystem.prototype, {initializeComponentData:function(component, data, properties) {
    data.model = new pc.scene.Model;
    data.model.graph = new pc.scene.GraphNode;
    data.model.meshInstances = [new pc.scene.MeshInstance(data.model.graph, this.mesh, this.material)];
    properties = ["density", "friction", "restitution", "radius", "model"];
    CollisionCircleComponentSystem._super.initializeComponentData.call(this, component, data, properties);
    if(typeof Box2D !== "undefined") {
      component.fixtureDef = this.createFixtureDef(component.entity, component);
      if(component.entity.body2d) {
        this.context.systems.body2d.createBody(component.entity.body2d)
      }
    }
  }, createFixtureDef:function(entity, component) {
    var fixtureDef = new b2FixtureDef;
    fixtureDef.density = component.density;
    fixtureDef.friction = component.friction;
    fixtureDef.restitution = component.restitution;
    fixtureDef.shape = new b2CircleShape;
    fixtureDef.shape.SetRadius(component.radius);
    fixtureDef.userData = entity;
    return fixtureDef
  }, onRemove:function(entity, data) {
    if(entity.body2d && entity.body2d.body) {
      this.context.systems.body2d.removeBody(entity, entity.body2d.body)
    }
    if(this.context.scene.containsModel(data.model)) {
      this.context.scene.removeModel(data.model);
      this.context.root.removeChild(data.model.graph)
    }
  }, setDebugRender:function(value) {
    this.debugRender = value
  }, onUpdate:function(dt) {
    if(this.debugRender) {
      this.updateDebugShapes()
    }
  }, onToolsUpdate:function(dt) {
    this.updateDebugShapes()
  }, updateDebugShapes:function() {
    var components = this.store;
    for(var id in components) {
      var entity = components[id].entity;
      var data = components[id].data;
      if(!this.context.scene.containsModel(data.model)) {
        this.context.scene.addModel(data.model);
        this.context.root.addChild(data.model.graph)
      }
      var r = data.radius;
      var model = data.model;
      var root = model.graph;
      root.setPosition(entity.getPosition());
      root.setRotation(entity.getRotation());
      root.setLocalScale(r / 0.5, r / 0.5, r / 0.5)
    }
  }});
  return{CollisionCircleComponentSystem:CollisionCircleComponentSystem}
}());
pc.extend(pc.fw, function() {
  var CollisionCircleComponent = function CollisionCircleComponent() {
    this.on("set_density", this.onSetDensity, this);
    this.on("set_friction", this.onSetFriction, this);
    this.on("set_restitution", this.onSetRestitution, this);
    this.on("set_radius", this.onSetRadius, this)
  };
  CollisionCircleComponent = pc.inherits(CollisionCircleComponent, pc.fw.Component);
  pc.extend(CollisionCircleComponent.prototype, {onSetDensity:function(name, oldValue, newValue) {
    if(!this.entity.body2d) {
      return
    }
    var body = this.entity.body2d.body;
    if(body) {
      var fixture = body.GetFixtureList();
      fixture.SetDensity(newValue);
      body.ResetMassData()
    }
  }, onSetFriction:function(name, oldValue, newValue) {
    if(!this.entity.body2d) {
      return
    }
    var body = this.entity.body2d.body;
    if(body) {
      var fixture = body.GetFixtureList();
      fixture.SetFriction(newValue);
      body.ResetMassData()
    }
  }, onSetRestitution:function(name, oldValue, newValue) {
    if(!this.entity.body2d) {
      return
    }
    var body = this.entity.body2d.body;
    if(body) {
      var fixture = body.GetFixtureList();
      fixture.SetRestitution(newValue);
      body.ResetMassData()
    }
  }, onSetRadius:function(name, oldValue, newValue) {
    if(!this.entity.body2d) {
      return
    }
    var body = this.entity.body2d.body;
    if(body) {
      var fixture = body.GetFixtureList();
      var shape = fixture.GetShape();
      shape.SetRadius(this.radius);
      body.SetAwake(true)
    }
  }});
  return{CollisionCircleComponent:CollisionCircleComponent}
}());
pc.extend(pc.fw, function() {
  var CollisionCircleComponentData = function() {
    this.density = 1;
    this.friction = 0.5;
    this.restitution = 0;
    this.radius = 1
  };
  CollisionCircleComponentData = pc.inherits(CollisionCircleComponentData, pc.fw.ComponentData);
  return{CollisionCircleComponentData:CollisionCircleComponentData}
}());
pc.extend(pc.fw, function() {
  var transform = new pc.Mat4;
  var newWtm = new pc.Mat4;
  var position = new pc.Vec3;
  var rotation = new pc.Vec3;
  var scale = new pc.Vec3;
  var ammoRayStart, ammoRayEnd;
  var collisions = {};
  var frameCollisions = {};
  var contacts0 = [];
  var contacts1 = [];
  var EVENT_CONTACT = "contact";
  var EVENT_COLLISION_START = "collisionstart";
  var EVENT_COLLISION_END = "collisionend";
  var EVENT_TRIGGER_ENTER = "triggerenter";
  var EVENT_TRIGGER_LEAVE = "triggerleave";
  var FLAG_CONTACT = 1;
  var FLAG_COLLISION_START = 2;
  var FLAG_COLLISION_END = 4;
  var FLAG_TRIGGER_ENTER = 8;
  var FLAG_TRIGGER_LEAVE = 16;
  var FLAG_GLOBAL_CONTACT = 32;
  var collision_table = [[0, FLAG_GLOBAL_CONTACT | FLAG_CONTACT | FLAG_COLLISION_START | FLAG_COLLISION_END, 0], [FLAG_GLOBAL_CONTACT | FLAG_CONTACT | FLAG_COLLISION_START | FLAG_COLLISION_END, FLAG_GLOBAL_CONTACT | FLAG_CONTACT | FLAG_COLLISION_START | FLAG_COLLISION_END, FLAG_TRIGGER_ENTER | FLAG_TRIGGER_LEAVE], [0, FLAG_TRIGGER_ENTER | FLAG_TRIGGER_LEAVE, 0]];
  var RaycastResult = function(entity, point, normal) {
    this.entity = entity;
    this.point = point;
    this.normal = normal
  };
  var SingleContactResult = function(a, b, contactPoint) {
    this.a = a;
    this.b = b;
    this.localPointA = contactPoint.localPoint;
    this.localPointB = contactPoint.localPointOther;
    this.pointA = contactPoint.point;
    this.pointB = contactPoint.pointOther;
    this.normal = contactPoint.normal
  };
  var ContactPoint = function(localPoint, localPointOther, point, pointOther, normal) {
    this.localPoint = localPoint;
    this.localPointOther = localPointOther;
    this.point = point;
    this.pointOther = pointOther;
    this.normal = normal
  };
  var ContactResult = function(other, contacts) {
    this.other = other;
    this.contacts = contacts
  };
  var RigidBodyComponentSystem = function RigidBodyComponentSystem(context) {
    this.id = "rigidbody";
    this.description = "Adds the entity to the scene's physical simulation.";
    context.systems.add(this.id, this);
    this.ComponentType = pc.fw.RigidBodyComponent;
    this.DataType = pc.fw.RigidBodyComponentData;
    this.schema = [{name:"enabled", displayName:"Enabled", description:"Enables or disables the rigid body", type:"boolean", defaultValue:true}, {name:"type", displayName:"Type", description:"The type of body determines how it moves and collides with other bodies. Dynamic is a normal body. Static will never move. Kinematic can be moved in code, but will not respond to collisions.", type:"enumeration", options:{enumerations:[{name:"Static", value:pc.fw.RIGIDBODY_TYPE_STATIC}, {name:"Dynamic", value:pc.fw.RIGIDBODY_TYPE_DYNAMIC}, 
    {name:"Kinematic", value:pc.fw.RIGIDBODY_TYPE_KINEMATIC}]}, defaultValue:pc.fw.RIGIDBODY_TYPE_STATIC}, {name:"mass", displayName:"Mass", description:"The mass of the body", type:"number", options:{min:0, step:1}, defaultValue:1, filter:{"type":[pc.fw.RIGIDBODY_TYPE_DYNAMIC, pc.fw.RIGIDBODY_TYPE_KINEMATIC]}}, {name:"linearDamping", displayName:"Linear Damping", description:"The linear damping applied to the body", type:"number", options:{min:0, step:1}, defaultValue:0, filter:{"type":[pc.fw.RIGIDBODY_TYPE_DYNAMIC, 
    pc.fw.RIGIDBODY_TYPE_KINEMATIC]}}, {name:"angularDamping", displayName:"Angular Damping", description:"The angular damping applied to the body", type:"number", options:{min:0, step:1}, defaultValue:0, filter:{"type":[pc.fw.RIGIDBODY_TYPE_DYNAMIC, pc.fw.RIGIDBODY_TYPE_KINEMATIC]}}, {name:"linearFactor", displayName:"Linear Factor", description:"The linear factor applied to the linear motion of the body, used to contrain linear movement in each axis", type:"vector", options:{min:0, step:0.1}, defaultValue:[1, 
    1, 1], filter:{"type":[pc.fw.RIGIDBODY_TYPE_DYNAMIC, pc.fw.RIGIDBODY_TYPE_KINEMATIC]}}, {name:"angularFactor", displayName:"Angular Factor", description:"The angular factor applied to the angular motion of the body, used to contrain angular movement in each axis", type:"vector", options:{min:0, step:0.1}, defaultValue:[1, 1, 1], filter:{"type":[pc.fw.RIGIDBODY_TYPE_DYNAMIC, pc.fw.RIGIDBODY_TYPE_KINEMATIC]}}, {name:"friction", displayName:"Friction", description:"The friction when the body slides along another body", 
    type:"number", options:{min:0, step:0.01}, defaultValue:0.5}, {name:"restitution", displayName:"Restitution", description:"The restitution determines the elasticity of collisions. 0 means an object doesn't bounce at all, a value of 1 will be a perfect reflection", type:"number", options:{min:0, step:0.01}, defaultValue:0}, {name:"body", exposed:false}];
    this.exposeProperties();
    this.maxSubSteps = 10;
    this.fixedTimeStep = 1 / 60;
    this.on("remove", this.onRemove, this);
    pc.fw.ComponentSystem.on("update", this.onUpdate, this)
  };
  RigidBodyComponentSystem = pc.inherits(RigidBodyComponentSystem, pc.fw.ComponentSystem);
  pc.extend(RigidBodyComponentSystem.prototype, {onLibraryLoaded:function() {
    if(typeof Ammo !== "undefined") {
      var collisionConfiguration = new Ammo.btDefaultCollisionConfiguration;
      var dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
      var overlappingPairCache = new Ammo.btDbvtBroadphase;
      var solver = new Ammo.btSequentialImpulseConstraintSolver;
      this.dynamicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
      this._ammoGravity = new Ammo.btVector3(0, -9.82, 0);
      this.dynamicsWorld.setGravity(this._ammoGravity);
      ammoRayStart = new Ammo.btVector3;
      ammoRayEnd = new Ammo.btVector3
    }else {
      pc.fw.ComponentSystem.off("update", this.onUpdate, this)
    }
  }, initializeComponentData:function(component, data, properties) {
    if(data.bodyType) {
      data.type = data.bodyType;
      console.warn("WARNING: rigidbody.bodyType: Property is deprecated. Use type instead.")
    }
    if(data.linearFactor && pc.type(data.linearFactor) === "array") {
      data.linearFactor = new pc.Vec3(data.linearFactor[0], data.linearFactor[1], data.linearFactor[2])
    }
    if(data.angularFactor && pc.type(data.angularFactor) === "array") {
      data.angularFactor = new pc.Vec3(data.angularFactor[0], data.angularFactor[1], data.angularFactor[2])
    }
    properties = ["enabled", "mass", "linearDamping", "angularDamping", "linearFactor", "angularFactor", "friction", "restitution", "type"];
    RigidBodyComponentSystem._super.initializeComponentData.call(this, component, data, properties)
  }, cloneComponent:function(entity, clone) {
    var data = {enabled:entity.rigidbody.enabled, mass:entity.rigidbody.mass, linearDamping:entity.rigidbody.linearDamping, angularDamping:entity.rigidbody.angularDamping, linearFactor:[entity.rigidbody.linearFactor.x, entity.rigidbody.linearFactor.y, entity.rigidbody.linearFactor.z], angularFactor:[entity.rigidbody.angularFactor.x, entity.rigidbody.angularFactor.y, entity.rigidbody.angularFactor.z], friction:entity.rigidbody.friction, restitution:entity.rigidbody.restitution, type:entity.rigidbody.type};
    this.addComponent(clone, data)
  }, onRemove:function(entity, data) {
    if(data.body) {
      this.removeBody(data.body);
      Ammo.destroy(data.body)
    }
    data.body = null
  }, addBody:function(body) {
    this.dynamicsWorld.addRigidBody(body);
    return body
  }, removeBody:function(body) {
    this.dynamicsWorld.removeRigidBody(body)
  }, addConstraint:function(constraint) {
    this.dynamicsWorld.addConstraint(constraint);
    return constraint
  }, removeConstraint:function(constraint) {
    this.dynamicsWorld.removeConstraint(constraint)
  }, setGravity:function() {
    var x, y, z;
    if(arguments.length === 1) {
      x = arguments[0].x;
      y = arguments[0].y;
      z = arguments[0].z
    }else {
      x = arguments[0];
      y = arguments[1];
      z = arguments[2]
    }
    this._ammoGravity.setValue(x, y, z);
    this.dynamicsWorld.setGravity(this._ammoGravity)
  }, raycastFirst:function(start, end, callback) {
    ammoRayStart.setValue(start.x, start.y, start.z);
    ammoRayEnd.setValue(end.x, end.y, end.z);
    var rayCallback = new Ammo.ClosestRayResultCallback(ammoRayStart, ammoRayEnd);
    this.dynamicsWorld.rayTest(ammoRayStart, ammoRayEnd, rayCallback);
    if(rayCallback.hasHit()) {
      var collisionObjPtr = rayCallback.get_m_collisionObject();
      var collisionObj = Ammo.wrapPointer(collisionObjPtr, Ammo.btCollisionObject);
      var body = Ammo.castObject(collisionObj, Ammo.btRigidBody);
      var point = rayCallback.get_m_hitPointWorld();
      var normal = rayCallback.get_m_hitNormalWorld();
      if(body) {
        callback(new RaycastResult(body.entity, new pc.Vec3(point.x(), point.y(), point.z()), new pc.Vec3(normal.x(), normal.y(), normal.z())))
      }
    }
    Ammo.destroy(rayCallback)
  }, _storeCollision:function(entity, other) {
    var isNewCollision = false;
    var guid = entity.getGuid();
    collisions[guid] = collisions[guid] || {others:[], entity:entity};
    if(collisions[guid].others.indexOf(other) < 0) {
      collisions[guid].others.push(other);
      isNewCollision = true
    }
    frameCollisions[guid] = frameCollisions[guid] || {others:[], entity:entity};
    frameCollisions[guid].others.push(other);
    return isNewCollision
  }, _handleEntityCollision:function(entity, other, contactPoints, collisionFlags) {
    var result;
    if(collisionFlags & FLAG_CONTACT) {
      result = new ContactResult(other, contactPoints);
      entity.collision.fire(EVENT_CONTACT, result)
    }
    if(collisionFlags & (FLAG_COLLISION_START | FLAG_TRIGGER_ENTER | FLAG_COLLISION_END | FLAG_TRIGGER_LEAVE)) {
      if(this._storeCollision(entity, other)) {
        if(collisionFlags & FLAG_COLLISION_START) {
          result = result || new ContactResult(other, contactPoints);
          entity.collision.fire(EVENT_COLLISION_START, result)
        }
        if(collisionFlags & FLAG_TRIGGER_ENTER) {
          entity.collision.fire(EVENT_TRIGGER_ENTER, other)
        }
      }
    }
  }, _createContactPointFromAmmo:function(contactPoint) {
    var localPointA = new pc.Vec3(contactPoint.get_m_localPointA().x(), contactPoint.get_m_localPointA().y(), contactPoint.get_m_localPointA().z());
    var localPointB = new pc.Vec3(contactPoint.get_m_localPointB().x(), contactPoint.get_m_localPointB().y(), contactPoint.get_m_localPointB().z());
    var pointA = new pc.Vec3(contactPoint.getPositionWorldOnA().x(), contactPoint.getPositionWorldOnA().y(), contactPoint.getPositionWorldOnA().z());
    var pointB = new pc.Vec3(contactPoint.getPositionWorldOnB().x(), contactPoint.getPositionWorldOnB().y(), contactPoint.getPositionWorldOnB().z());
    var normal = new pc.Vec3(contactPoint.get_m_normalWorldOnB().x(), contactPoint.get_m_normalWorldOnB().y(), contactPoint.get_m_normalWorldOnB().z());
    return new ContactPoint(localPointA, localPointB, pointA, pointB, normal)
  }, _createReverseContactPointFromAmmo:function(contactPoint) {
    var localPointA = new pc.Vec3(contactPoint.get_m_localPointA().x(), contactPoint.get_m_localPointA().y(), contactPoint.get_m_localPointA().z());
    var localPointB = new pc.Vec3(contactPoint.get_m_localPointB().x(), contactPoint.get_m_localPointB().y(), contactPoint.get_m_localPointB().z());
    var pointA = new pc.Vec3(contactPoint.getPositionWorldOnA().x(), contactPoint.getPositionWorldOnA().y(), contactPoint.getPositionWorldOnA().z());
    var pointB = new pc.Vec3(contactPoint.getPositionWorldOnB().x(), contactPoint.getPositionWorldOnB().y(), contactPoint.getPositionWorldOnB().z());
    var normal = new pc.Vec3(-contactPoint.get_m_normalWorldOnB().x(), -contactPoint.get_m_normalWorldOnB().y(), -contactPoint.get_m_normalWorldOnB().z());
    return new ContactPoint(localPointB, localPointA, pointB, pointA, normal)
  }, _cleanOldCollisions:function() {
    for(var guid in collisions) {
      if(collisions.hasOwnProperty(guid)) {
        var entity = collisions[guid].entity;
        var entityCollision = entity.collision;
        var others = collisions[guid].others;
        var length = others.length;
        var i = length;
        while(i--) {
          var other = others[i];
          if(!frameCollisions[guid] || frameCollisions[guid].others.indexOf(other) < 0) {
            others.splice(i, 1);
            if(entityCollision && other.collision) {
              var flags = this._getCollisionFlags(entity, other);
              if(flags & FLAG_COLLISION_END) {
                entityCollision.fire(EVENT_COLLISION_END, other)
              }
              if(flags & FLAG_TRIGGER_LEAVE) {
                entityCollision.fire(EVENT_TRIGGER_LEAVE, other)
              }
            }
          }
        }
        if(others.length === 0) {
          delete collisions[guid]
        }
      }
    }
  }, _getCollisionFlags:function(entity, other) {
    var entityRb = entity.rigidbody;
    var otherRb = other.rigidbody;
    var entityIsTrigger = !entityRb;
    var otherIsTrigger = !otherRb;
    if(entityIsTrigger && otherIsTrigger) {
      return 0
    }
    var store = this.store;
    var entityIsNonStaticRb = entityRb && store[entity.getGuid()].data.type !== pc.fw.RIGIDBODY_TYPE_STATIC;
    var otherIsNonStaticRb = otherRb && store[other.getGuid()].data.type !== pc.fw.RIGIDBODY_TYPE_STATIC;
    var row = 0;
    var col = 0;
    if(entityIsNonStaticRb) {
      row = 1
    }else {
      if(entityIsTrigger) {
        row = 2
      }
    }
    if(otherIsNonStaticRb) {
      col = 1
    }else {
      if(otherIsTrigger) {
        col = 2
      }
    }
    var flags = collision_table[row][col];
    if(flags) {
      var collision = entity.collision;
      if(!this.hasEvent(EVENT_CONTACT)) {
        flags = flags & ~FLAG_GLOBAL_CONTACT
      }
      if(!collision.hasEvent(EVENT_CONTACT)) {
        flags = flags & ~FLAG_CONTACT
      }
      if(!collision.hasEvent(EVENT_COLLISION_START)) {
        flags = flags & ~FLAG_COLLISION_START
      }
      if(!collision.hasEvent(EVENT_COLLISION_END)) {
        flags = flags & ~FLAG_COLLISION_END
      }
      if(!collision.hasEvent(EVENT_TRIGGER_ENTER)) {
        flags = flags & ~FLAG_TRIGGER_ENTER
      }
      if(!collision.hasEvent(EVENT_TRIGGER_LEAVE)) {
        flags = flags & ~FLAG_TRIGGER_LEAVE
      }
    }
    return flags
  }, onUpdate:function(dt) {
    this.dynamicsWorld.stepSimulation(dt, this.maxSubSteps, this.fixedTimeStep);
    var components = this.store;
    for(var id in components) {
      if(components.hasOwnProperty(id)) {
        var entity = components[id].entity;
        var componentData = components[id].data;
        if(componentData.body && componentData.body.isActive() && componentData.enabled && entity.enabled) {
          if(componentData.type === pc.fw.RIGIDBODY_TYPE_DYNAMIC) {
            entity.rigidbody.syncBodyToEntity()
          }else {
            if(componentData.type === pc.fw.RIGIDBODY_TYPE_KINEMATIC) {
              entity.rigidbody.updateKinematic(dt)
            }
          }
        }
      }
    }
    var dispatcher = this.dynamicsWorld.getDispatcher();
    var numManifolds = dispatcher.getNumManifolds();
    var i, j;
    frameCollisions = {};
    for(i = 0;i < numManifolds;i++) {
      var manifold = dispatcher.getManifoldByIndexInternal(i);
      var body0 = manifold.getBody0();
      var body1 = manifold.getBody1();
      var wb0 = Ammo.castObject(body0, Ammo.btRigidBody);
      var wb1 = Ammo.castObject(body1, Ammo.btRigidBody);
      var e0 = wb0.entity;
      var e1 = wb1.entity;
      if(!e0 || !e1) {
        continue
      }
      var collisionFlags0 = this._getCollisionFlags(e0, e1);
      var collisionFlags1 = this._getCollisionFlags(e1, e0);
      if(collisionFlags0 || collisionFlags1) {
        var numContacts = manifold.getNumContacts();
        if(numContacts > 0) {
          var cachedContactPoint, cachedContactResult;
          var useContacts0 = collisionFlags0 & FLAG_COLLISION_START || collisionFlags0 & FLAG_CONTACT;
          var useContacts1 = collisionFlags1 & FLAG_COLLISION_START || collisionFlags1 & FLAG_CONTACT;
          contacts0.length = 0;
          contacts1.length = 0;
          for(j = 0;j < numContacts;j++) {
            var contactPoint = manifold.getContactPoint(j);
            if(collisionFlags0 & FLAG_GLOBAL_CONTACT) {
              cachedContactPoint = this._createContactPointFromAmmo(contactPoint);
              this.fire(EVENT_CONTACT, new SingleContactResult(e0, e1, cachedContactPoint))
            }
            if(useContacts0) {
              cachedContactPoint = cachedContactPoint || this._createContactPointFromAmmo(contactPoint);
              contacts0.push(cachedContactPoint)
            }
            if(useContacts1) {
              contacts1.push(this._createReverseContactPointFromAmmo(contactPoint))
            }
          }
          this._handleEntityCollision(e0, e1, contacts0, collisionFlags0);
          this._handleEntityCollision(e1, e0, contacts1, collisionFlags1)
        }
      }
    }
    this._cleanOldCollisions()
  }});
  return{RIGIDBODY_TYPE_STATIC:"static", RIGIDBODY_TYPE_DYNAMIC:"dynamic", RIGIDBODY_TYPE_KINEMATIC:"kinematic", RIGIDBODY_CF_STATIC_OBJECT:1, RIGIDBODY_CF_KINEMATIC_OBJECT:2, RIGIDBODY_CF_NORESPONSE_OBJECT:4, RIGIDBODY_ACTIVE_TAG:1, RIGIDBODY_ISLAND_SLEEPING:2, RIGIDBODY_WANTS_DEACTIVATION:3, RIGIDBODY_DISABLE_DEACTIVATION:4, RIGIDBODY_DISABLE_SIMULATION:5, RigidBodyComponentSystem:RigidBodyComponentSystem}
}());
pc.extend(pc.fw, function() {
  var ammoTransform;
  var ammoVec1, ammoVec2, ammoQuat, ammoOrigin;
  var RigidBodyComponent = function RigidBodyComponent(system, entity) {
    if(typeof Ammo !== "undefined" && !ammoTransform) {
      ammoTransform = new Ammo.btTransform;
      ammoVec1 = new Ammo.btVector3;
      ammoVec2 = new Ammo.btVector3;
      ammoQuat = new Ammo.btQuaternion;
      ammoOrigin = new Ammo.btVector3(0, 0, 0)
    }
    this.on("set_mass", this.onSetMass, this);
    this.on("set_linearDamping", this.onSetLinearDamping, this);
    this.on("set_angularDamping", this.onSetAngularDamping, this);
    this.on("set_linearFactor", this.onSetLinearFactor, this);
    this.on("set_angularFactor", this.onSetAngularFactor, this);
    this.on("set_friction", this.onSetFriction, this);
    this.on("set_restitution", this.onSetRestitution, this);
    this.on("set_type", this.onSetType, this);
    this.on("set_body", this.onSetBody, this);
    entity.on("livelink:updatetransform", this.onLiveLinkUpdateTransform, this);
    this.system.on("beforeremove", this.onBeforeRemove, this);
    this._displacement = new pc.Vec3(0, 0, 0);
    this._linearVelocity = new pc.Vec3(0, 0, 0);
    this._angularVelocity = new pc.Vec3(0, 0, 0)
  };
  RigidBodyComponent = pc.inherits(RigidBodyComponent, pc.fw.Component);
  Object.defineProperty(RigidBodyComponent.prototype, "bodyType", {get:function() {
    console.warn("WARNING: bodyType: Function is deprecated. Query type property instead.");
    return this.type
  }, set:function(type) {
    console.warn("WARNING: bodyType: Function is deprecated. Set type property instead.");
    this.type = type
  }});
  Object.defineProperty(RigidBodyComponent.prototype, "linearVelocity", {get:function() {
    if(!this.isKinematic()) {
      if(this.body) {
        var vel = this.body.getLinearVelocity();
        this._linearVelocity.set(vel.x(), vel.y(), vel.z());
        return this._linearVelocity
      }
    }else {
      return this._linearVelocity
    }
  }, set:function(lv) {
    this.activate();
    if(!this.isKinematic()) {
      var body = this.body;
      if(body) {
        ammoVec1.setValue(lv.x, lv.y, lv.z);
        body.setLinearVelocity(ammoVec1)
      }
    }else {
      this._linearVelocity.copy(lv)
    }
  }});
  Object.defineProperty(RigidBodyComponent.prototype, "angularVelocity", {get:function() {
    if(!this.isKinematic()) {
      if(this.body) {
        var vel = this.body.getAngularVelocity();
        this._angularVelocity.set(vel.x(), vel.y(), vel.z());
        return this._angularVelocity
      }
    }else {
      return this._angularVelocity
    }
  }, set:function(av) {
    this.activate();
    if(!this.isKinematic()) {
      var body = this.body;
      if(body) {
        ammoVec1.setValue(av.x, av.y, av.z);
        body.setAngularVelocity(ammoVec1)
      }
    }else {
      this._angularVelocity.copy(av)
    }
  }});
  pc.extend(RigidBodyComponent.prototype, {createBody:function() {
    var entity = this.entity;
    var shape;
    if(entity.collision) {
      shape = entity.collision.shape;
      if(entity.trigger) {
        entity.trigger.destroy();
        delete entity.trigger
      }
    }
    if(shape) {
      if(this.body) {
        this.system.removeBody(this.body);
        Ammo.destroy(this.body)
      }
      var isStaticOrKinematic = this.isStaticOrKinematic();
      var mass = isStaticOrKinematic ? 0 : this.mass;
      var localInertia = new Ammo.btVector3(0, 0, 0);
      if(!isStaticOrKinematic) {
        shape.calculateLocalInertia(mass, localInertia)
      }
      var pos = entity.getPosition();
      var rot = entity.getRotation();
      ammoQuat.setValue(rot.x, rot.y, rot.z, rot.w);
      var startTransform = new Ammo.btTransform;
      startTransform.setIdentity();
      startTransform.getOrigin().setValue(pos.x, pos.y, pos.z);
      startTransform.setRotation(ammoQuat);
      var motionState = new Ammo.btDefaultMotionState(startTransform);
      var bodyInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
      var body = new Ammo.btRigidBody(bodyInfo);
      body.setRestitution(this.restitution);
      body.setFriction(this.friction);
      body.setDamping(this.linearDamping, this.angularDamping);
      var v;
      v = this.linearFactor;
      ammoVec1.setValue(v.x, v.y, v.z);
      body.setLinearFactor(ammoVec1);
      v = this.angularFactor;
      ammoVec1.setValue(v.x, v.y, v.z);
      body.setAngularFactor(ammoVec1);
      body.entity = entity;
      if(this.isKinematic()) {
        body.setCollisionFlags(body.getCollisionFlags() | pc.fw.RIGIDBODY_CF_KINEMATIC_OBJECT);
        body.setActivationState(pc.fw.RIGIDBODY_DISABLE_DEACTIVATION)
      }
      entity.rigidbody.body = body;
      if(this.enabled && this.entity.enabled) {
        this.enableSimulation()
      }
    }
  }, isActive:function() {
    if(this.body) {
      return this.body.isActive()
    }
    return false
  }, activate:function() {
    if(this.body) {
      this.body.activate()
    }
  }, enableSimulation:function() {
    if(this.entity.collision && this.entity.collision.enabled && !this.data.simulationEnabled) {
      var body = this.body;
      if(body) {
        this.system.addBody(body);
        if(this.isKinematic()) {
          body.forceActivationState(pc.fw.RIGIDBODY_DISABLE_DEACTIVATION);
          body.activate()
        }else {
          body.forceActivationState(pc.fw.RIGIDBODY_ACTIVE_TAG);
          this.syncEntityToBody()
        }
        this.data.simulationEnabled = true
      }
    }
  }, disableSimulation:function() {
    var body = this.body;
    if(body && this.data.simulationEnabled) {
      this.system.removeBody(body);
      body.forceActivationState(pc.fw.RIGIDBODY_DISABLE_SIMULATION);
      this.data.simulationEnabled = false
    }
  }, applyForce:function() {
    var x, y, z;
    var px, py, pz;
    switch(arguments.length) {
      case 1:
        x = arguments[0].x;
        y = arguments[0].y;
        z = arguments[0].z;
        break;
      case 2:
        x = arguments[0].x;
        y = arguments[0].y;
        z = arguments[0].z;
        px = arguments[1].x;
        py = arguments[1].y;
        pz = arguments[1].z;
        break;
      case 3:
        x = arguments[0];
        y = arguments[1];
        z = arguments[2];
        break;
      case 6:
        x = arguments[0];
        y = arguments[1];
        z = arguments[2];
        px = arguments[3];
        py = arguments[4];
        pz = arguments[5];
        break
    }
    var body = this.body;
    if(body) {
      body.activate();
      ammoVec1.setValue(x, y, z);
      if(typeof px !== "undefined") {
        ammoVec2.setValue(px, py, pz);
        body.applyForce(ammoVec1, ammoVec2)
      }else {
        body.applyForce(ammoVec1, ammoOrigin)
      }
    }
  }, applyTorque:function() {
    var x, y, z;
    switch(arguments.length) {
      case 1:
        x = arguments[0].x;
        y = arguments[0].y;
        z = arguments[0].z;
        break;
      case 3:
        x = arguments[0];
        y = arguments[1];
        z = arguments[2];
        break;
      default:
        console.error("ERROR: applyTorque: function takes 1 or 3 arguments");
        return
    }
    var body = this.body;
    if(body) {
      body.activate();
      ammoVec1.setValue(x, y, z);
      body.applyTorque(ammoVec1)
    }
  }, applyImpulse:function() {
    var x, y, z;
    var px, py, pz;
    switch(arguments.length) {
      case 1:
        x = arguments[0].x;
        y = arguments[0].y;
        z = arguments[0].z;
        break;
      case 2:
        x = arguments[0].x;
        y = arguments[0].y;
        z = arguments[0].z;
        px = arguments[1].x;
        py = arguments[1].y;
        pz = arguments[1].z;
        break;
      case 3:
        x = arguments[0];
        y = arguments[1];
        z = arguments[2];
        break;
      case 6:
        x = arguments[0];
        y = arguments[1];
        z = arguments[2];
        px = arguments[0];
        py = arguments[1];
        pz = arguments[2];
        break
    }
    var body = this.body;
    if(body) {
      body.activate();
      ammoVec1.setValue(x, y, z);
      if(typeof px !== "undefined") {
        ammoVec2.setValue(px, py, pz);
        body.applyImpulse(ammoVec1, ammoVec2)
      }else {
        body.applyImpulse(ammoVec1, ammoOrigin)
      }
    }
  }, applyTorqueImpulse:function() {
    var x, y, z;
    switch(arguments.length) {
      case 1:
        x = arguments[0].x;
        y = arguments[0].y;
        z = arguments[0].z;
        break;
      case 3:
        x = arguments[0];
        y = arguments[1];
        z = arguments[2];
        break;
      default:
        console.error("ERROR: applyTorqueImpulse: function takes 1 or 3 arguments");
        return
    }
    var body = this.body;
    if(body) {
      body.activate();
      ammoVec1.setValue(x, y, z);
      body.applyTorqueImpulse(ammoVec1)
    }
  }, isStatic:function() {
    return this.type === pc.fw.RIGIDBODY_TYPE_STATIC
  }, isStaticOrKinematic:function() {
    return this.type === pc.fw.RIGIDBODY_TYPE_STATIC || this.type === pc.fw.RIGIDBODY_TYPE_KINEMATIC
  }, isKinematic:function() {
    return this.type === pc.fw.RIGIDBODY_TYPE_KINEMATIC
  }, syncEntityToBody:function() {
    var body = this.body;
    if(body) {
      var pos = this.entity.getPosition();
      var rot = this.entity.getRotation();
      var transform = body.getWorldTransform();
      transform.getOrigin().setValue(pos.x, pos.y, pos.z);
      ammoQuat.setValue(rot.x, rot.y, rot.z, rot.w);
      transform.setRotation(ammoQuat);
      body.activate()
    }
  }, syncBodyToEntity:function() {
    var body = this.body;
    if(body.isActive() && body.getMotionState()) {
      body.getMotionState().getWorldTransform(ammoTransform);
      var p = ammoTransform.getOrigin();
      var q = ammoTransform.getRotation();
      this.entity.setPosition(p.x(), p.y(), p.z());
      this.entity.setRotation(q.x(), q.y(), q.z(), q.w())
    }
  }, updateKinematic:function(dt) {
    this._displacement.copy(this._linearVelocity).scale(dt);
    this.entity.translate(this._displacement);
    this._displacement.copy(this._angularVelocity).scale(dt);
    this.entity.rotate(this._displacement.x, this._displacement.y, this._displacement.z);
    if(this.body.getMotionState()) {
      var pos = this.entity.getPosition();
      var rot = this.entity.getRotation();
      ammoTransform.getOrigin().setValue(pos.x, pos.y, pos.z);
      ammoQuat.setValue(rot.x, rot.y, rot.z, rot.w);
      ammoTransform.setRotation(ammoQuat);
      this.body.getMotionState().setWorldTransform(ammoTransform)
    }
  }, onEnable:function() {
    RigidBodyComponent._super.onEnable.call(this);
    if(!this.body) {
      this.createBody()
    }
    this.enableSimulation()
  }, onDisable:function() {
    RigidBodyComponent._super.onDisable.call(this);
    this.disableSimulation()
  }, onSetMass:function(name, oldValue, newValue) {
    var body = this.data.body;
    if(body) {
      var isEnabled = this.enabled && this.entity.enabled;
      if(isEnabled) {
        this.disableSimulation()
      }
      var mass = newValue;
      var localInertia = new Ammo.btVector3(0, 0, 0);
      body.getCollisionShape().calculateLocalInertia(mass, localInertia);
      body.setMassProps(mass, localInertia);
      body.updateInertiaTensor();
      if(isEnabled) {
        this.enableSimulation()
      }
    }
  }, onSetLinearDamping:function(name, oldValue, newValue) {
    var body = this.data.body;
    if(body) {
      body.setDamping(newValue, this.data.angularDamping)
    }
  }, onSetAngularDamping:function(name, oldValue, newValue) {
    var body = this.data.body;
    if(body) {
      body.setDamping(this.data.linearDamping, newValue)
    }
  }, onSetLinearFactor:function(name, oldValue, newValue) {
    var body = this.data.body;
    if(body) {
      ammoVec1.setValue(newValue.x, newValue.y, newValue.z);
      body.setLinearFactor(ammoVec1)
    }
  }, onSetAngularFactor:function(name, oldValue, newValue) {
    var body = this.data.body;
    if(body) {
      ammoVec1.setValue(newValue.x, newValue.y, newValue.z);
      body.setAngularFactor(ammoVec1)
    }
  }, onSetFriction:function(name, oldValue, newValue) {
    var body = this.data.body;
    if(body) {
      body.setFriction(newValue)
    }
  }, onSetRestitution:function(name, oldValue, newValue) {
    var body = this.data.body;
    if(body) {
      body.setRestitution(newValue)
    }
  }, onSetType:function(name, oldValue, newValue) {
    if(newValue !== oldValue) {
      this.disableSimulation();
      this.createBody()
    }
  }, onSetBody:function(name, oldValue, newValue) {
    if(this.body && this.data.simulationEnabled) {
      this.body.activate()
    }
  }, onLiveLinkUpdateTransform:function(position, rotation, scale) {
    this.syncEntityToBody();
    this.linearVelocity = pc.Vec3.ZERO;
    this.angularVelocity = pc.Vec3.ZERO
  }, onBeforeRemove:function(entity, component) {
    if(this === component) {
      entity.off("livelink:updatetransform", this.onLiveLinkUpdateTransform, this);
      this.system.off("beforeremove", this.onBeforeRemove, this)
    }
  }});
  return{RigidBodyComponent:RigidBodyComponent}
}());
pc.extend(pc.fw, function() {
  var RigidBodyComponentData = function() {
    this.enabled = true;
    this.mass = 1;
    this.linearDamping = 0;
    this.angularDamping = 0;
    this.linearFactor = new pc.Vec3(1, 1, 1);
    this.angularFactor = new pc.Vec3(1, 1, 1);
    this.friction = 0.5;
    this.restitution = 0;
    this.type = pc.fw.RIGIDBODY_TYPE_STATIC;
    this.body = null;
    this.simulationEnabled = false
  };
  RigidBodyComponentData = pc.inherits(RigidBodyComponentData, pc.fw.ComponentData);
  return{RigidBodyComponentData:RigidBodyComponentData}
}());
pc.extend(pc.fw, function() {
  var ammoVec1, ammoQuat;
  var Trigger = function Trigger(context, component, data) {
    this.entity = component.entity;
    this.component = component;
    this.context = context;
    if(typeof Ammo !== "undefined") {
      ammoVec1 = new Ammo.btVector3;
      ammoQuat = new Ammo.btQuaternion
    }
    this.initialize(data)
  };
  Trigger.prototype = {initialize:function(data) {
    var entity = this.entity;
    var shape = data.shape;
    if(shape && typeof Ammo !== "undefined") {
      if(entity.trigger) {
        entity.trigger.destroy()
      }
      var mass = 1;
      var localInertia = new Ammo.btVector3(0, 0, 0);
      shape.calculateLocalInertia(mass, localInertia);
      var pos = entity.getPosition();
      var rot = entity.getRotation();
      ammoQuat.setValue(rot.x, rot.y, rot.z, rot.w);
      var startTransform = new Ammo.btTransform;
      startTransform.setIdentity();
      startTransform.getOrigin().setValue(pos.x, pos.y, pos.z);
      startTransform.setRotation(ammoQuat);
      var motionState = new Ammo.btDefaultMotionState(startTransform);
      var bodyInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
      var body = new Ammo.btRigidBody(bodyInfo);
      this.body = body;
      body.setRestitution(0);
      body.setFriction(0);
      body.setDamping(0, 0);
      ammoVec1.setValue(0, 0, 0);
      body.setLinearFactor(ammoVec1);
      body.setAngularFactor(ammoVec1);
      body.setCollisionFlags(body.getCollisionFlags() | pc.fw.RIGIDBODY_CF_NORESPONSE_OBJECT);
      body.entity = entity;
      if(this.component.enabled && entity.enabled) {
        this.enable()
      }
    }
  }, destroy:function() {
    if(this.body) {
      this.context.systems.rigidbody.removeBody(this.body)
    }
  }, syncEntityToBody:function() {
    var body = this.body;
    if(body) {
      var position = this.entity.getPosition();
      var rotation = this.entity.getRotation();
      var transform = body.getWorldTransform();
      transform.getOrigin().setValue(position.x, position.y, position.z);
      ammoQuat.setValue(rotation.x, rotation.y, rotation.z, rotation.w);
      transform.setRotation(ammoQuat);
      body.activate()
    }
  }, enable:function() {
    var body = this.body;
    this.context.systems.rigidbody.addBody(body);
    body.forceActivationState(pc.fw.RIGIDBODY_ACTIVE_TAG);
    body.activate()
  }, disable:function() {
    var body = this.body;
    this.context.systems.rigidbody.removeBody(body);
    body.forceActivationState(pc.fw.RIGIDBODY_DISABLE_SIMULATION)
  }};
  return{Trigger:Trigger}
}());
pc.extend(pc.fw, function() {
  var CollisionComponentSystem = function CollisionComponentSystem(context) {
    this.id = "collision";
    this.description = "Specifies a collision volume.";
    context.systems.add(this.id, this);
    this.ComponentType = pc.fw.CollisionComponent;
    this.DataType = pc.fw.CollisionComponentData;
    this.schema = [{name:"enabled", displayName:"Enabled", description:"Enables or disables the collision", type:"boolean", defaultValue:true}, {name:"type", displayName:"Type", description:"The type of the collision volume", type:"enumeration", options:{enumerations:[{name:"Box", value:"box"}, {name:"Sphere", value:"sphere"}, {name:"Capsule", value:"capsule"}, {name:"Cylinder", value:"cylinder"}, {name:"Mesh", value:"mesh"}]}, defaultValue:"box"}, {name:"halfExtents", displayName:"Half Extents", 
    description:"The half-extents of the box", type:"vector", options:{min:0, step:0.1}, defaultValue:[0.5, 0.5, 0.5], filter:{type:"box"}}, {name:"radius", displayName:"Radius", description:"The radius of the collision volume", type:"number", options:{min:0, step:0.1}, defaultValue:0.5, filter:{type:["sphere", "capsule", "cylinder"]}}, {name:"axis", displayName:"Axis", description:"Major axis of the volume", type:"enumeration", options:{enumerations:[{name:"X", value:0}, {name:"Y", value:1}, {name:"Z", 
    value:2}]}, defaultValue:1, filter:{type:["capsule", "cylinder"]}}, {name:"height", displayName:"Height", description:"Height of the volume", type:"number", options:{min:0, step:0.1}, defaultValue:2, filter:{type:["capsule", "cylinder"]}}, {name:"asset", displayName:"Asset", description:"Collision mesh asset", type:"asset", options:{max:1, type:"model"}, defaultValue:null, filter:{type:"mesh"}}, {name:"shape", exposed:false}, {name:"model", exposed:false}];
    this.exposeProperties();
    this.implementations = {};
    this.debugRender = false;
    this.on("remove", this.onRemove, this);
    pc.fw.ComponentSystem.on("update", this.onUpdate, this);
    pc.fw.ComponentSystem.on("toolsUpdate", this.onToolsUpdate, this)
  };
  CollisionComponentSystem = pc.inherits(CollisionComponentSystem, pc.fw.ComponentSystem);
  CollisionComponentSystem.prototype = pc.extend(CollisionComponentSystem.prototype, {onLibraryLoaded:function() {
    if(typeof Ammo !== "undefined") {
    }else {
      pc.fw.ComponentSystem.off("update", this.onUpdate, this)
    }
  }, initializeComponentData:function(component, data, properties) {
    if(!data.type) {
      data.type = component.data.type
    }
    component.data.type = data.type;
    if(data.halfExtents && pc.type(data.halfExtents) === "array") {
      data.halfExtents = new pc.Vec3(data.halfExtents[0], data.halfExtents[1], data.halfExtents[2])
    }
    var impl = this._createImplementation(data.type);
    impl.beforeInitialize(component, data);
    properties = ["type", "halfExtents", "radius", "axis", "height", "shape", "model", "asset", "enabled"];
    CollisionComponentSystem._super.initializeComponentData.call(this.system, component, data, properties);
    impl.afterInitialize(component, data)
  }, _createImplementation:function(type) {
    if(typeof this.implementations[type] === "undefined") {
      var impl;
      switch(type) {
        case "box":
          impl = new CollisionBoxSystemImpl(this);
          break;
        case "sphere":
          impl = new CollisionSphereSystemImpl(this);
          break;
        case "capsule":
          impl = new CollisionCapsuleSystemImpl(this);
          break;
        case "cylinder":
          impl = new CollisionCylinderSystemImpl(this);
          break;
        case "mesh":
          impl = new CollisionMeshSystemImpl(this);
          break;
        default:
          throw"Invalid collision system type: " + type;break
      }
      this.implementations[type] = impl
    }
    return this.implementations[type]
  }, _getImplementation:function(entity) {
    return this.implementations[entity.collision.data.type]
  }, cloneComponent:function(entity, clone) {
    return this._getImplementation(entity).clone(entity, clone)
  }, onRemove:function(entity, data) {
    this.implementations[data.type].remove(entity, data)
  }, onUpdate:function(dt) {
    var id, entity, data;
    var components = this.store;
    for(id in components) {
      entity = components[id].entity;
      data = components[id].data;
      if(data.enabled && entity.enabled) {
        if(!entity.rigidbody) {
          entity.trigger.syncEntityToBody()
        }
      }
      if(this.debugRender) {
        this.updateDebugShape(entity, data, this._getImplementation(entity))
      }
    }
  }, updateDebugShape:function(entity, data, impl) {
    var context = this.context;
    if(typeof impl !== "undefined") {
      if(impl.hasDebugShape) {
        if(data.model) {
          if(!context.scene.containsModel(data.model)) {
            if(entity.enabled && data.enabled) {
              context.scene.addModel(data.model);
              context.root.addChild(data.model.graph)
            }
          }else {
            if(!data.enabled || !entity.enabled) {
              context.root.removeChild(data.model.graph);
              context.scene.removeModel(data.model)
            }
          }
        }
        if(data.enabled && entity.enabled) {
          impl.updateDebugShape(entity, data)
        }
      }
    }
  }, onTransformChanged:function(component, position, rotation, scale) {
    this.implementations[component.data.type].updateTransform(component, position, rotation, scale)
  }, onToolsUpdate:function(dt) {
    var id, entity;
    var components = this.store;
    for(id in components) {
      entity = components[id].entity;
      this.updateDebugShape(entity, components[id].data, this._getImplementation(entity))
    }
  }, setDebugRender:function(value) {
    this.debugRender = value
  }, changeType:function(component, previousType, newType) {
    this.implementations[previousType].remove(component.entity, component.data);
    this._createImplementation(newType).reset(component, component.data)
  }, recreatePhysicalShapes:function(component) {
    this.implementations[component.data.type].recreatePhysicalShapes(component)
  }});
  CollisionSystemImpl = function(system) {
    this.system = system;
    this.hasDebugShape = true
  };
  CollisionSystemImpl.prototype = {beforeInitialize:function(component, data) {
    data.shape = this.createPhysicalShape(component.entity, data);
    data.model = new pc.scene.Model;
    data.model.graph = new pc.scene.GraphNode;
    data.model.meshInstances = [this.createDebugMesh(data)]
  }, afterInitialize:function(component, data) {
    this.recreatePhysicalShapes(component);
    component.data.initialized = true
  }, reset:function(component, data) {
    this.beforeInitialize(component, data);
    this.afterInitialize(component, data)
  }, recreatePhysicalShapes:function(component) {
    var entity = component.entity;
    var data = component.data;
    if(typeof Ammo !== "undefined") {
      data.shape = this.createPhysicalShape(component.entity, data);
      if(entity.rigidbody) {
        entity.rigidbody.createBody()
      }else {
        if(!entity.trigger) {
          entity.trigger = new pc.fw.Trigger(this.system.context, component, data)
        }else {
          entity.trigger.initialize(data)
        }
      }
    }
  }, createDebugMesh:function(data) {
    return undefined
  }, createPhysicalShape:function(entity, data) {
    return undefined
  }, updateDebugShape:function(entity, data) {
  }, updateTransform:function(component, position, rotation, scale) {
    if(component.entity.trigger) {
      component.entity.trigger.syncEntityToBody()
    }
  }, remove:function(entity, data) {
    var context = this.system.context;
    if(entity.rigidbody && entity.rigidbody.body) {
      context.systems.rigidbody.removeBody(entity.rigidbody.body)
    }
    if(entity.trigger) {
      entity.trigger.destroy();
      delete entity.trigger
    }
    if(context.scene.containsModel(data.model)) {
      context.root.removeChild(data.model.graph);
      context.scene.removeModel(data.model)
    }
  }, clone:function(entity, clone) {
    var src = this.system.dataStore[entity.getGuid()];
    var data = {enabled:src.data.enabled, type:src.data.type, halfExtents:[src.data.halfExtents.x, src.data.halfExtents.y, src.data.halfExtents.z], radius:src.data.radius, axis:src.data.axis, height:src.data.height, asset:src.data.asset, model:src.data.model};
    return this.system.addComponent(clone, data)
  }};
  CollisionBoxSystemImpl = function(system) {
  };
  CollisionBoxSystemImpl = pc.inherits(CollisionBoxSystemImpl, CollisionSystemImpl);
  CollisionBoxSystemImpl.prototype = pc.extend(CollisionBoxSystemImpl.prototype, {createDebugMesh:function(data) {
    if(!this.mesh) {
      var gd = this.system.context.graphicsDevice;
      var format = new pc.gfx.VertexFormat(gd, [{semantic:pc.gfx.SEMANTIC_POSITION, components:3, type:pc.gfx.ELEMENTTYPE_FLOAT32}]);
      var vertexBuffer = new pc.gfx.VertexBuffer(gd, format, 8);
      var positions = new Float32Array(vertexBuffer.lock());
      positions.set([-0.5, -0.5, -0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5]);
      vertexBuffer.unlock();
      var indexBuffer = new pc.gfx.IndexBuffer(gd, pc.gfx.INDEXFORMAT_UINT8, 24);
      var indices = new Uint8Array(indexBuffer.lock());
      indices.set([0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 4, 1, 5, 2, 6, 3, 7]);
      indexBuffer.unlock();
      var mesh = new pc.scene.Mesh;
      mesh.vertexBuffer = vertexBuffer;
      mesh.indexBuffer[0] = indexBuffer;
      mesh.primitive[0].type = pc.gfx.PRIMITIVE_LINES;
      mesh.primitive[0].base = 0;
      mesh.primitive[0].count = indexBuffer.getNumIndices();
      mesh.primitive[0].indexed = true;
      this.mesh = mesh
    }
    if(!this.material) {
      var material = new pc.scene.BasicMaterial;
      material.color = new pc.Color(0, 0, 1, 1);
      material.update();
      this.material = material
    }
    return new pc.scene.MeshInstance(data.model.graph, this.mesh, this.material)
  }, createPhysicalShape:function(entity, data) {
    if(typeof Ammo !== "undefined") {
      var he = data.halfExtents;
      var ammoHe = new Ammo.btVector3(he.x, he.y, he.z);
      return new Ammo.btBoxShape(ammoHe)
    }else {
      return undefined
    }
  }, updateDebugShape:function(entity, data) {
    var he = data.halfExtents;
    var x = he.x;
    var y = he.y;
    var z = he.z;
    var root = data.model.graph;
    root.setPosition(entity.getPosition());
    root.setRotation(entity.getRotation());
    root.setLocalScale(x * 2, y * 2, z * 2)
  }});
  CollisionSphereSystemImpl = function(system) {
  };
  CollisionSphereSystemImpl = pc.inherits(CollisionSphereSystemImpl, CollisionSystemImpl);
  CollisionSphereSystemImpl.prototype = pc.extend(CollisionSphereSystemImpl.prototype, {createDebugMesh:function(data) {
    if(!this.mesh) {
      var context = this.system.context;
      var gd = context.graphicsDevice;
      var format = new pc.gfx.VertexFormat(gd, [{semantic:pc.gfx.SEMANTIC_POSITION, components:3, type:pc.gfx.ELEMENTTYPE_FLOAT32}]);
      var vertexBuffer = new pc.gfx.VertexBuffer(gd, format, 240);
      var positions = new Float32Array(vertexBuffer.lock());
      var i, x = 0;
      var theta;
      for(var ring = 0;ring < 3;ring++) {
        var xo = 0;
        var yo = 1;
        var zo = 2;
        if(ring === 1) {
          xo = 1;
          yo = 0;
          zo = 2
        }else {
          if(ring === 2) {
            xo = 0;
            yo = 2;
            zo = 1
          }
        }
        for(i = 0;i < 40;i++) {
          theta = 2 * Math.PI * (i / 40);
          positions[x + xo] = 0.5 * Math.cos(theta);
          positions[x + yo] = 0;
          positions[x + zo] = 0.5 * Math.sin(theta);
          x += 3;
          theta = 2 * Math.PI * ((i + 1) / 40);
          positions[x + xo] = 0.5 * Math.cos(theta);
          positions[x + yo] = 0;
          positions[x + zo] = 0.5 * Math.sin(theta);
          x += 3
        }
      }
      vertexBuffer.unlock();
      var mesh = new pc.scene.Mesh;
      mesh.vertexBuffer = vertexBuffer;
      mesh.primitive[0].type = pc.gfx.PRIMITIVE_LINES;
      mesh.primitive[0].base = 0;
      mesh.primitive[0].count = vertexBuffer.getNumVertices();
      mesh.primitive[0].indexed = false;
      this.mesh = mesh
    }
    if(!this.material) {
      var material = new pc.scene.BasicMaterial;
      material.color = new pc.Color(0, 0, 1, 1);
      material.update();
      this.material = material
    }
    return new pc.scene.MeshInstance(data.model.graph, this.mesh, this.material)
  }, createPhysicalShape:function(entity, data) {
    if(typeof Ammo !== "undefined") {
      return new Ammo.btSphereShape(data.radius)
    }else {
      return undefined
    }
  }, updateDebugShape:function(entity, data) {
    var root = data.model.graph;
    root.setPosition(entity.getPosition());
    root.setRotation(entity.getRotation());
    var s = data.radius * 2;
    root.setLocalScale(s, s, s)
  }});
  CollisionCapsuleSystemImpl = function(system) {
  };
  CollisionCapsuleSystemImpl = pc.inherits(CollisionCapsuleSystemImpl, CollisionSystemImpl);
  CollisionCapsuleSystemImpl.prototype = pc.extend(CollisionCapsuleSystemImpl.prototype, {createDebugMesh:function(data) {
    if(data.model && data.model.meshInstances && data.model.meshInstances.length) {
      return data.model.meshInstances[0]
    }else {
      var gd = this.system.context.graphicsDevice;
      var format = new pc.gfx.VertexFormat(gd, [{semantic:pc.gfx.SEMANTIC_POSITION, components:3, type:pc.gfx.ELEMENTTYPE_FLOAT32}]);
      var vertexBuffer = new pc.gfx.VertexBuffer(gd, format, 328, pc.gfx.BUFFER_DYNAMIC);
      this.updateCapsuleShape(data, vertexBuffer);
      var mesh = new pc.scene.Mesh;
      mesh.vertexBuffer = vertexBuffer;
      mesh.primitive[0].type = pc.gfx.PRIMITIVE_LINES;
      mesh.primitive[0].base = 0;
      mesh.primitive[0].count = vertexBuffer.getNumVertices();
      mesh.primitive[0].indexed = false;
      this.mesh = mesh
    }
    if(!this.material) {
      var material = new pc.scene.BasicMaterial;
      material.color = new pc.Color(0, 0, 1, 1);
      material.update();
      this.material = material
    }
    return new pc.scene.MeshInstance(data.model.graph, mesh, this.material)
  }, updateCapsuleShape:function(data, vertexBuffer) {
    var axis = typeof data.axis !== "undefined" ? data.axis : 1;
    var radius = data.radius || 0.5;
    var height = Math.max((data.height || 2) - 2 * radius, 0);
    var positions = new Float32Array(vertexBuffer.lock());
    var xo = 0;
    var yo = 1;
    var zo = 2;
    if(axis === 0) {
      xo = 1;
      yo = 0;
      zo = 2
    }else {
      if(axis === 2) {
        xo = 0;
        yo = 2;
        zo = 1
      }
    }
    var i, x = 0;
    var theta;
    for(cap = -1;cap < 2;cap += 2) {
      for(i = 0;i < 40;i++) {
        theta = 2 * Math.PI * (i / 40);
        positions[x + xo] = radius * Math.cos(theta);
        positions[x + yo] = cap * height * 0.5;
        positions[x + zo] = radius * Math.sin(theta);
        x += 3;
        theta = 2 * Math.PI * ((i + 1) / 40);
        positions[x + xo] = radius * Math.cos(theta);
        positions[x + yo] = cap * height * 0.5;
        positions[x + zo] = radius * Math.sin(theta);
        x += 3
      }
      for(i = 0;i < 20;i++) {
        theta = Math.PI * (i / 20) + Math.PI * 1.5;
        positions[x + xo] = 0;
        positions[x + yo] = cap * (height * 0.5 + radius * Math.cos(theta));
        positions[x + zo] = cap * radius * Math.sin(theta);
        x += 3;
        theta = Math.PI * ((i + 1) / 20) + Math.PI * 1.5;
        positions[x + xo] = 0;
        positions[x + yo] = cap * (height * 0.5 + radius * Math.cos(theta));
        positions[x + zo] = cap * radius * Math.sin(theta);
        x += 3
      }
      for(i = 0;i < 20;i++) {
        theta = Math.PI * (i / 20) + Math.PI * 1.5;
        positions[x + xo] = cap * radius * Math.sin(theta);
        positions[x + yo] = cap * (height * 0.5 + radius * Math.cos(theta));
        positions[x + zo] = 0;
        x += 3;
        theta = Math.PI * ((i + 1) / 20) + Math.PI * 1.5;
        positions[x + xo] = cap * radius * Math.sin(theta);
        positions[x + yo] = cap * (height * 0.5 + radius * Math.cos(theta));
        positions[x + zo] = 0;
        x += 3
      }
    }
    for(i = 0;i < 4;i++) {
      theta = 2 * Math.PI * (i / 4);
      positions[x + xo] = radius * Math.cos(theta);
      positions[x + yo] = height * 0.5;
      positions[x + zo] = radius * Math.sin(theta);
      x += 3;
      theta = 2 * Math.PI * (i / 4);
      positions[x + xo] = radius * Math.cos(theta);
      positions[x + yo] = -height * 0.5;
      positions[x + zo] = radius * Math.sin(theta);
      x += 3
    }
    vertexBuffer.unlock()
  }, createPhysicalShape:function(entity, data) {
    var shape = null;
    var axis = typeof data.axis !== "undefined" ? data.axis : 1;
    var radius = data.radius || 0.5;
    var height = Math.max((data.height || 2) - 2 * radius, 0);
    if(typeof Ammo !== "undefined") {
      switch(axis) {
        case 0:
          shape = new Ammo.btCapsuleShapeX(radius, height);
          break;
        case 1:
          shape = new Ammo.btCapsuleShape(radius, height);
          break;
        case 2:
          shape = new Ammo.btCapsuleShapeZ(radius, height);
          break
      }
    }
    return shape
  }, updateDebugShape:function(entity, data) {
    var root = data.model.graph;
    root.setPosition(entity.getPosition());
    root.setRotation(entity.getRotation());
    root.setLocalScale(1, 1, 1)
  }, recreatePhysicalShapes:function(component) {
    var model = component.data.model;
    if(model) {
      var vertexBuffer = this.createDebugMesh(component.data).mesh.vertexBuffer;
      this.updateCapsuleShape(component.data, vertexBuffer);
      CollisionCapsuleSystemImpl._super.recreatePhysicalShapes.call(this, component)
    }
  }});
  CollisionCylinderSystemImpl = function(system) {
  };
  CollisionCylinderSystemImpl = pc.inherits(CollisionCylinderSystemImpl, CollisionSystemImpl);
  CollisionCylinderSystemImpl.prototype = pc.extend(CollisionCylinderSystemImpl.prototype, {createDebugMesh:function(data) {
    if(data.model && data.model.meshInstances && data.model.meshInstances.length) {
      return data.model.meshInstances[0]
    }else {
      var gd = this.system.context.graphicsDevice;
      var format = new pc.gfx.VertexFormat(gd, [{semantic:pc.gfx.SEMANTIC_POSITION, components:3, type:pc.gfx.ELEMENTTYPE_FLOAT32}]);
      var vertexBuffer = new pc.gfx.VertexBuffer(gd, format, 168, pc.gfx.BUFFER_DYNAMIC);
      this.updateCylinderShape(data, vertexBuffer);
      var mesh = new pc.scene.Mesh;
      mesh.vertexBuffer = vertexBuffer;
      mesh.primitive[0].type = pc.gfx.PRIMITIVE_LINES;
      mesh.primitive[0].base = 0;
      mesh.primitive[0].count = vertexBuffer.getNumVertices();
      mesh.primitive[0].indexed = false;
      if(!this.material) {
        var material = new pc.scene.BasicMaterial;
        material.color = new pc.Color(0, 0, 1, 1);
        material.update();
        this.material = material
      }
      return new pc.scene.MeshInstance(data.model.graph, mesh, this.material)
    }
  }, updateCylinderShape:function(data, vertexBuffer) {
    var axis = typeof data.axis !== "undefined" ? data.axis : 1;
    var radius = typeof data.radius !== "undefined" ? data.radius : 0.5;
    var height = typeof data.height !== "undefined" ? data.height : 1;
    var positions = new Float32Array(vertexBuffer.lock());
    var xo = 0;
    var yo = 1;
    var zo = 2;
    if(axis === 0) {
      xo = 1;
      yo = 0;
      zo = 2
    }else {
      if(axis === 2) {
        xo = 0;
        yo = 2;
        zo = 1
      }
    }
    var i, x = 0;
    var theta;
    for(cap = -1;cap < 2;cap += 2) {
      for(i = 0;i < 40;i++) {
        theta = 2 * Math.PI * (i / 40);
        positions[x + xo] = radius * Math.cos(theta);
        positions[x + yo] = cap * height * 0.5;
        positions[x + zo] = radius * Math.sin(theta);
        x += 3;
        theta = 2 * Math.PI * ((i + 1) / 40);
        positions[x + xo] = radius * Math.cos(theta);
        positions[x + yo] = cap * height * 0.5;
        positions[x + zo] = radius * Math.sin(theta);
        x += 3
      }
    }
    for(i = 0;i < 4;i++) {
      theta = 2 * Math.PI * (i / 4);
      positions[x + xo] = radius * Math.cos(theta);
      positions[x + yo] = height * 0.5;
      positions[x + zo] = radius * Math.sin(theta);
      x += 3;
      theta = 2 * Math.PI * (i / 4);
      positions[x + xo] = radius * Math.cos(theta);
      positions[x + yo] = -height * 0.5;
      positions[x + zo] = radius * Math.sin(theta);
      x += 3
    }
    vertexBuffer.unlock()
  }, createPhysicalShape:function(entity, data) {
    var halfExtents = null;
    var shape = null;
    var axis = typeof data.axis !== "undefined" ? data.axis : 1;
    var radius = typeof data.radius !== "undefined" ? data.radius : 0.5;
    var height = typeof data.height !== "undefined" ? data.height : 1;
    if(typeof Ammo !== "undefined") {
      switch(axis) {
        case 0:
          halfExtents = new Ammo.btVector3(height * 0.5, radius, radius);
          shape = new Ammo.btCylinderShapeX(halfExtents);
          break;
        case 1:
          halfExtents = new Ammo.btVector3(radius, height * 0.5, radius);
          shape = new Ammo.btCylinderShape(halfExtents);
          break;
        case 2:
          halfExtents = new Ammo.btVector3(radius, radius, height * 0.5);
          shape = new Ammo.btCylinderShapeZ(halfExtents);
          break
      }
    }
    return shape
  }, updateDebugShape:function(entity, data) {
    var root = data.model.graph;
    root.setPosition(entity.getPosition());
    root.setRotation(entity.getRotation());
    root.setLocalScale(1, 1, 1)
  }, recreatePhysicalShapes:function(component) {
    var model = component.data.model;
    if(model) {
      var vertexBuffer = this.createDebugMesh(component.data).mesh.vertexBuffer;
      this.updateCylinderShape(component.data, vertexBuffer);
      CollisionCylinderSystemImpl._super.recreatePhysicalShapes.call(this, component)
    }
  }});
  CollisionMeshSystemImpl = function(system) {
    this.hasDebugShape = false
  };
  CollisionMeshSystemImpl = pc.inherits(CollisionMeshSystemImpl, CollisionSystemImpl);
  CollisionMeshSystemImpl.prototype = pc.extend(CollisionMeshSystemImpl.prototype, {beforeInitialize:function(component, data) {
  }, createPhysicalShape:function(entity, data) {
    if(typeof Ammo !== "undefined" && data.model) {
      var model = data.model;
      var shape = new Ammo.btCompoundShape;
      var i, j;
      for(i = 0;i < model.meshInstances.length;i++) {
        var meshInstance = model.meshInstances[i];
        var mesh = meshInstance.mesh;
        var ib = mesh.indexBuffer[pc.scene.RENDERSTYLE_SOLID];
        var vb = mesh.vertexBuffer;
        var format = vb.getFormat();
        var stride = format.size / 4;
        var positions;
        for(j = 0;j < format.elements.length;j++) {
          var element = format.elements[j];
          if(element.name === pc.gfx.SEMANTIC_POSITION) {
            positions = new Float32Array(vb.lock(), element.offset)
          }
        }
        var indices = new Uint16Array(ib.lock());
        var numTriangles = mesh.primitive[0].count / 3;
        var v1 = new Ammo.btVector3;
        var v2 = new Ammo.btVector3;
        var v3 = new Ammo.btVector3;
        var i1, i2, i3;
        var base = mesh.primitive[0].base;
        var triMesh = new Ammo.btTriangleMesh;
        for(j = 0;j < numTriangles;j++) {
          i1 = indices[base + j * 3] * stride;
          i2 = indices[base + j * 3 + 1] * stride;
          i3 = indices[base + j * 3 + 2] * stride;
          v1.setValue(positions[i1], positions[i1 + 1], positions[i1 + 2]);
          v2.setValue(positions[i2], positions[i2 + 1], positions[i2 + 2]);
          v3.setValue(positions[i3], positions[i3 + 1], positions[i3 + 2]);
          triMesh.addTriangle(v1, v2, v3, true)
        }
        var useQuantizedAabbCompression = true;
        var triMeshShape = new Ammo.btBvhTriangleMeshShape(triMesh, useQuantizedAabbCompression);
        var wtm = meshInstance.node.getWorldTransform();
        var scl = wtm.getScale();
        triMeshShape.setLocalScaling(new Ammo.btVector3(scl.x, scl.y, scl.z));
        var pos = meshInstance.node.getPosition();
        var rot = meshInstance.node.getRotation();
        var transform = new Ammo.btTransform;
        transform.setIdentity();
        transform.getOrigin().setValue(pos.x, pos.y, pos.z);
        var ammoQuat = new Ammo.btQuaternion;
        ammoQuat.setValue(rot.x, rot.y, rot.z, rot.w);
        transform.setRotation(ammoQuat);
        shape.addChildShape(transform, triMeshShape)
      }
      var entityTransform = entity.getWorldTransform();
      var scale = entityTransform.getScale();
      var vec = new Ammo.btVector3;
      vec.setValue(scale.x, scale.y, scale.z);
      shape.setLocalScaling(vec);
      return shape
    }else {
      return undefined
    }
  }, recreatePhysicalShapes:function(component) {
    var data = component.data;
    if(data.asset) {
      this.loadModelAsset(component)
    }else {
      data.model = null;
      this.doRecreatePhysicalShape(component)
    }
  }, loadModelAsset:function(component) {
    var guid = component.data.asset;
    var entity = component.entity;
    var data = component.data;
    var options = {parent:entity.getRequest()};
    var asset = this.system.context.assets.getAssetByResourceId(guid);
    if(!asset) {
      logERROR(pc.string.format("Trying to load model before asset {0} is loaded.", guid));
      return
    }
    this.system.context.assets.load(asset, [], options).then(function(resources) {
      var model = resources[0];
      data.model = model;
      this.doRecreatePhysicalShape(component)
    }.bind(this))
  }, doRecreatePhysicalShape:function(component) {
    var entity = component.entity;
    var data = component.data;
    if(data.model) {
      if(data.shape) {
        Ammo.destroy(data.shape)
      }
      data.shape = this.createPhysicalShape(entity, data);
      if(entity.rigidbody) {
        entity.rigidbody.createBody()
      }else {
        if(!entity.trigger) {
          entity.trigger = new pc.fw.Trigger(this.system.context, component, data)
        }else {
          entity.trigger.initialize(data)
        }
      }
    }else {
      this.remove(entity, data)
    }
  }, updateTransform:function(component, position, rotation, scale) {
    if(component.shape) {
      var entityTransform = component.entity.getWorldTransform();
      var worldScale = entityTransform.getScale();
      var previousScale = component.shape.getLocalScaling();
      if(worldScale.x !== previousScale.x() || worldScale.y !== previousScale.y() || worldScale.z !== previousScale.z()) {
        this.doRecreatePhysicalShape(component)
      }
    }
    CollisionMeshSystemImpl._super.updateTransform.call(this, component, position, rotation, scale)
  }});
  return{CollisionComponentSystem:CollisionComponentSystem}
}());
pc.extend(pc.fw, function() {
  var CollisionComponent = function CollisionComponent(system, entity) {
    this.on("set_type", this.onSetType, this);
    this.on("set_halfExtents", this.onSetHalfExtents, this);
    this.on("set_radius", this.onSetRadius, this);
    this.on("set_height", this.onSetHeight, this);
    this.on("set_axis", this.onSetAxis, this);
    this.on("set_asset", this.onSetAsset, this);
    entity.on("livelink:updatetransform", this.onLiveLinkUpdateTransform, this);
    system.on("beforeremove", this.onBeforeRemove, this)
  };
  CollisionComponent = pc.inherits(CollisionComponent, pc.fw.Component);
  pc.extend(CollisionComponent.prototype, {onSetType:function(name, oldValue, newValue) {
    if(oldValue !== newValue) {
      this.system.changeType(this, oldValue, newValue)
    }
  }, onSetHalfExtents:function(name, oldValue, newValue) {
    if(this.data.initialized && this.data.type === "box") {
      this.system.recreatePhysicalShapes(this)
    }
  }, onSetRadius:function(name, oldValue, newValue) {
    if(this.data.initialized && (this.data.type === "sphere" || this.data.type === "capsule" || this.data.type === "cylinder")) {
      this.system.recreatePhysicalShapes(this)
    }
  }, onSetHeight:function(name, oldValue, newValue) {
    if(this.data.initialized && (this.data.type === "capsule" || this.data.type === "cylinder")) {
      this.system.recreatePhysicalShapes(this)
    }
  }, onSetAxis:function(name, oldValue, newValue) {
    if(this.data.initialized && (this.data.type === "capsule" || this.data.type === "cylinder")) {
      this.system.recreatePhysicalShapes(this)
    }
  }, onSetAsset:function(name, oldValue, newValue) {
    if(this.data.initialized && this.data.type === "mesh") {
      this.system.recreatePhysicalShapes(this)
    }
  }, onEnable:function() {
    CollisionComponent._super.onEnable.call(this);
    if(this.entity.trigger) {
      this.entity.trigger.enable()
    }else {
      if(this.entity.rigidbody) {
        if(this.entity.rigidbody.enabled) {
          this.entity.rigidbody.enableSimulation()
        }
      }
    }
  }, onDisable:function() {
    CollisionComponent._super.onDisable.call(this);
    if(this.entity.trigger) {
      this.entity.trigger.disable()
    }else {
      if(this.entity.rigidbody) {
        this.entity.rigidbody.disableSimulation()
      }
    }
  }, onLiveLinkUpdateTransform:function(position, rotation, scale) {
    if(this.enabled && this.entity.enabled) {
      this.system.onTransformChanged(this, position, rotation, scale)
    }
  }, onBeforeRemove:function(entity, component) {
    if(this === component) {
      entity.off("livelink:updatetransform", this.onLiveLinkUpdateTransform, this);
      this.system.off("beforeremove", this.onBeforeRemove, this)
    }
  }});
  return{CollisionComponent:CollisionComponent}
}());
pc.extend(pc.fw, function() {
  var CollisionComponentData = function() {
    this.enabled = true;
    this.type = "box";
    this.halfExtents = new pc.Vec3(0.5, 0.5, 0.5);
    this.radius = 0.5;
    this.axis = 1;
    this.height = 2;
    this.asset = null;
    this.shape = null;
    this.model = null;
    this.initialized = false
  };
  CollisionComponentData = pc.inherits(CollisionComponentData, pc.fw.ComponentData);
  return{CollisionComponentData:CollisionComponentData}
}());
pc.extend(pc.fw, function() {
  var BallSocketJointComponentSystem = function BallSocketJointComponentSystem(context) {
    this.id = "ballsocketjoint";
    context.systems.add(this.id, this);
    this.ComponentType = pc.fw.BallSocketJointComponent;
    this.DataType = pc.fw.BallSocketJointComponentData;
    this.schema = [{name:"pivot", displayName:"Pivot", description:"Local space pivot", type:"vector", options:{min:0, step:0.1}, defaultValue:[0, 0, 0]}, {name:"position", displayName:"Position", description:"World space joint position", type:"vector", options:{min:0, step:0.1}, defaultValue:[0, 0, 0]}, {name:"tau", displayName:"Tau", description:"TBD", type:"number", defaultValue:0.001, options:{min:0, max:1}}, {name:"damping", displayName:"Damping", description:"Damping", type:"number", defaultValue:1, 
    options:{min:0, max:1}}, {name:"impulseClamp", displayName:"Impulse Clamp", description:"Impulse Clamp", type:"number", defaultValue:0, options:{min:0, max:100}}, {name:"constraint", exposed:false}];
    this.debugRender = false;
    this.on("remove", this.onRemove, this);
    pc.fw.ComponentSystem.on("update", this.onUpdate, this);
    pc.fw.ComponentSystem.on("toolsUpdate", this.onToolsUpdate, this)
  };
  BallSocketJointComponentSystem = pc.inherits(BallSocketJointComponentSystem, pc.fw.ComponentSystem);
  BallSocketJointComponentSystem.prototype = pc.extend(BallSocketJointComponentSystem.prototype, {onLibraryLoaded:function() {
    if(typeof Ammo !== "undefined") {
    }else {
      pc.fw.ComponentSystem.off("update", this.onUpdate, this)
    }
  }, initializeComponentData:function(component, data, properties) {
    if(typeof Ammo !== "undefined") {
      if(component.entity.rigidbody) {
        if(data.pivot && pc.type(data.pivot) === "array") {
          data.pivot = new pc.Vec3(data.pivot[0], data.pivot[1], data.pivot[2])
        }
        if(data.position && pc.type(data.position) === "array") {
          data.position = new pc.Vec3(data.position[0], data.position[1], data.position[2])
        }
        var pivotA = new Ammo.btVector3(data.pivot.x, data.pivot.y, data.pivot.z);
        var body = component.entity.rigidbody.body;
        data.constraint = new Ammo.btPoint2PointConstraint(body, pivotA);
        var pivotB = data.constraint.getPivotInB();
        data.position = [pivotB.x(), pivotB.y(), pivotB.z()];
        var context = this.context;
        context.systems.rigidbody.addConstraint(data.constraint)
      }
    }
    properties = ["constraint", "pivot", "position", "tau", "damping", "impulseClamp"];
    BallSocketJointComponentSystem._super.initializeComponentData.call(this, component, data, properties)
  }, cloneComponent:function(entity, clone) {
    var data = {pivot:[entity.ballsocketjoint.pivot.x, entity.ballsocketjoint.pivot.y, entity.ballsocketjoint.pivot.z], position:[entity.ballsocketjoint.position.x, entity.ballsocketjoint.position.y, entity.ballsocketjoint.position.z], tau:entity.ballsocketjoint.tau, damping:entity.ballsocketjoint.damping, impulseClamp:entity.ballsocketjoint.impulseClamp};
    return this.addComponent(clone, data)
  }, onRemove:function(entity, data) {
    if(data.constraint) {
      this.context.systems.rigidbody.removeConstraint(data.constraint)
    }
  }, setDebugRender:function(value) {
    this.debugRender = value
  }, onUpdate:function(dt) {
    if(this.debugRender) {
      this.updateDebugShapes()
    }
  }, onToolsUpdate:function(dt) {
    this.updateDebugShapes()
  }, updateDebugShapes:function() {
    var components = this.store;
    for(var id in components) {
      var entity = components[id].entity;
      var data = components[id].data
    }
  }});
  return{BallSocketJointComponentSystem:BallSocketJointComponentSystem}
}());
pc.extend(pc.fw, function() {
  var BallSocketJointComponent = function BallSocketJointComponent(system, entity) {
    this.on("set_pivot", this.onSetPivot, this);
    this.on("set_position", this.onSetPosition, this);
    this.on("set_tau", this.onSetTau, this);
    this.on("set_damping", this.onSetDamping, this);
    this.on("set_impulseClamp", this.onSetImpulseClamp, this)
  };
  BallSocketJointComponent = pc.inherits(BallSocketJointComponent, pc.fw.Component);
  pc.extend(BallSocketJointComponent.prototype, {onSetPivot:function(name, oldValue, newValue) {
    if(typeof Ammo !== "undefined") {
      if(this.data.constraint) {
        var pivotA = new Ammo.btVector3(newValue.x, newValue.y, newValue.z);
        this.data.constraint.setPivotA(pivotA)
      }
    }
  }, onSetPosition:function(name, oldValue, newValue) {
    if(typeof Ammo !== "undefined") {
      if(this.data.constraint) {
        var pivotB = new Ammo.btVector3(newValue.x, newValue.y, newValue.z);
        this.data.constraint.setPivotB(pivotB)
      }
    }
  }, onSetTau:function(name, oldValue, newValue) {
    if(typeof Ammo !== "undefined") {
      if(this.data.constraint) {
        this.data.constraint.get_m_setting().set_m_tau(newValue)
      }
    }
  }, onSetDamping:function(name, oldValue, newValue) {
    if(typeof Ammo !== "undefined") {
      if(this.data.constraint) {
        this.data.constraint.get_m_setting().set_m_damping(newValue)
      }
    }
  }, onSetImpulseClamp:function(name, oldValue, newValue) {
    if(typeof Ammo !== "undefined") {
      if(this.data.constraint) {
        this.data.constraint.get_m_setting().set_m_impulseClamp(newValue)
      }
    }
  }});
  return{BallSocketJointComponent:BallSocketJointComponent}
}());
pc.extend(pc.fw, function() {
  var BallSocketJointComponentData = function() {
    this.pivot = new pc.Vec3(0, 0, 0);
    this.position = new pc.Vec3(0, 0, 0);
    this.tau = 0.3;
    this.damping = 1;
    this.impulseClamp = 0;
    this.constraint = null
  };
  BallSocketJointComponentData = pc.inherits(BallSocketJointComponentData, pc.fw.ComponentData);
  return{BallSocketJointComponentData:BallSocketJointComponentData}
}());
pc.extend(pc.fw, function() {
  var LiveLink = function(senderIdPrefix) {
    senderIdPrefix = senderIdPrefix || "";
    this._destinations = [];
    this._callbacks = {};
    this._linkid = senderIdPrefix + "-" + pc.guid.create();
    this._listener = null;
    this._handler = this._handleMessage.bind(this);
    window.addEventListener("message", this._handler, false);
    if(!pc.livelinks) {
      pc.livelinks = []
    }
    pc.livelinks.push(this)
  };
  LiveLink.prototype.detach = function() {
    this._listener = null;
    window.removeEventListener("message", this._handler, false)
  };
  LiveLink.prototype.addDestinationWindow = function(_window) {
    this._destinations.push(_window)
  };
  LiveLink.prototype.removeDestinationWindow = function(window) {
    var i;
    for(i = 0;i < this._destinations.length;++i) {
      if(this._destinations[i] == window) {
        this._destinations.splice(i, 1);
        break
      }
    }
  };
  LiveLink.prototype.send = function(msg, success) {
    success = success || function() {
    };
    var i, length = this._destinations.length;
    var closed = [];
    for(i = 0;i < length;i++) {
      var w = this._destinations[i];
      if(!w.closed) {
        var origin = w.location.protocol + "//" + w.location.host;
        this._send(msg, success, w, origin)
      }else {
        closed.push(w)
      }
    }
    length = closed.length;
    for(i = 0;i < length;i++) {
      this.removeDestinationWindow(closed[i])
    }
  };
  LiveLink.prototype._send = function(msg, success, _window, origin) {
    msg.senderid = this._linkid;
    if(this._callbacks[msg.id]) {
      this._callbacks[msg.id].count++
    }else {
      this._callbacks[msg.id] = {count:1, callback:success ? success.bind(this) : function() {
      }}
    }
    var data = pc.fw.LiveLinkMessage.serialize(msg);
    if(_window === window) {
      pc.livelinks.forEach(function(link) {
        link._handleMessage({source:window, data:data})
      })
    }else {
      _window.postMessage(data, origin)
    }
  };
  LiveLink.prototype.listen = function(callback, _window) {
    if(this._listener) {
      throw new Error("LiveLink already listening");
    }
    this._listener = callback
  };
  LiveLink.prototype._handleMessage = function(event) {
    var msg, newmsg;
    var data = pc.fw.LiveLinkMessage.deserialize(event.data);
    if(!data) {
      return
    }
    msg = new pc.fw.LiveLinkMessage(data, event.source);
    if(this._linkid === msg.senderid) {
      return
    }
    if(msg.type == pc.fw.LiveLinkMessageType.RECEIVED) {
      if(msg.content.received_from == this._linkid) {
        this._callbacks[msg.content.id].count--;
        if(this._callbacks[msg.content.id].count === 0) {
          this._callbacks[msg.content.id].callback();
          delete this._callbacks[msg.content.id]
        }
      }
    }else {
      if(this._listener) {
        this._listener(msg);
        newmsg = new pc.fw.LiveLinkMessage;
        newmsg.type = pc.fw.LiveLinkMessageType.RECEIVED;
        newmsg.content = {id:msg.id, received_from:msg.senderid};
        this._send(newmsg, null, event.source, event.origin)
      }else {
      }
    }
  };
  return{LiveLink:LiveLink}
}());
pc.extend(pc.fw, function() {
  var LiveLinkMessage = function(data, source) {
    data = data || {};
    this.type = data.type || pc.fw.LiveLinkMessageType.NO_TYPE;
    this.content = data.content || {};
    this.id = data.id || pc.guid.create();
    this.senderid = data.senderid || null;
    this.source = source || null
  };
  LiveLinkMessage.register = function(type) {
    pc.fw.LiveLinkMessageType[type] = type
  };
  LiveLinkMessage.serialize = function(msg) {
    var o = {type:msg.type, content:msg.content, id:msg.id, senderid:msg.senderid};
    return JSON.stringify(o, function(key, value) {
      if(this[key] instanceof Float32Array) {
        return pc.makeArray(this[key])
      }else {
        return this[key]
      }
    })
  };
  LiveLinkMessage.deserialize = function(data) {
    try {
      var o = JSON.parse(data);
      return o
    }catch(e) {
      return null
    }
  };
  return{LiveLinkMessage:LiveLinkMessage, LiveLinkMessageRegister:{}, LiveLinkMessageType:{NO_TYPE:"NO_TYPE", RECEIVED:"RECEIVED"}}
}());
pc.extend(pc.fw, function() {
  var LiveLinkUpdateComponentMessage = function(id, component, attribute, value) {
    this.type = pc.fw.LiveLinkMessageType.UPDATE_COMPONENT;
    this.content = {id:id, component:component, attribute:attribute, value:value}
  };
  LiveLinkUpdateComponentMessage = pc.inherits(LiveLinkUpdateComponentMessage, pc.fw.LiveLinkMessage);
  pc.fw.LiveLinkMessage.register("UPDATE_COMPONENT");
  return{LiveLinkUpdateComponentMessage:LiveLinkUpdateComponentMessage}
}());
pc.extend(pc.fw, function() {
  var LiveLinkUpdateEntityMessage = function(id, components) {
    this.type = pc.fw.LiveLinkMessageType.UPDATE_ENTITY;
    this.content = {id:id, components:components}
  };
  LiveLinkUpdateEntityMessage = pc.inherits(LiveLinkUpdateEntityMessage, pc.fw.LiveLinkMessage);
  pc.fw.LiveLinkMessage.register("UPDATE_ENTITY");
  var LiveLinkUpdateEntityTransformMessage = function(id, position, rotation, scale) {
    this.type = pc.fw.LiveLinkMessageType.UPDATE_ENTITY_TRANSFORM;
    this.content = {id:id, position:position, rotation:rotation, scale:scale}
  };
  LiveLinkUpdateEntityTransformMessage = pc.inherits(LiveLinkUpdateEntityTransformMessage, pc.fw.LiveLinkMessage);
  pc.fw.LiveLinkMessage.register("UPDATE_ENTITY_TRANSFORM");
  var LiveLinkUpdateEntityNameMessage = function(id, name) {
    this.type = pc.fw.LiveLinkMessageType.UPDATE_ENTITY_NAME;
    this.content = {id:id, name:name}
  };
  LiveLinkUpdateEntityNameMessage = pc.inherits(LiveLinkUpdateEntityNameMessage, pc.fw.LiveLinkMessage);
  pc.fw.LiveLinkMessage.register("UPDATE_ENTITY_NAME");
  var LiveLinkUpdateEntityEnabledMessage = function(id, enabled) {
    this.type = pc.fw.LiveLinkMessageType.UPDATE_ENTITY_ENABLED;
    this.content = {id:id, enabled:enabled}
  };
  LiveLinkUpdateEntityEnabledMessage = pc.inherits(LiveLinkUpdateEntityEnabledMessage, pc.fw.LiveLinkMessage);
  pc.fw.LiveLinkMessage.register("UPDATE_ENTITY_ENABLED");
  var LiveLinkReparentEntityMessage = function(id, oldParentId, newParentId, index) {
    this.type = pc.fw.LiveLinkMessageType.REPARENT_ENTITY;
    this.content = {id:id, oldParentId:oldParentId, newParentId:newParentId, index:index}
  };
  LiveLinkReparentEntityMessage = pc.inherits(LiveLinkReparentEntityMessage, pc.fw.LiveLinkMessage);
  pc.fw.LiveLinkMessage.register("REPARENT_ENTITY");
  return{LiveLinkUpdateEntityMessage:LiveLinkUpdateEntityMessage, LiveLinkUpdateEntityNameMessage:LiveLinkUpdateEntityNameMessage, LiveLinkUpdateEntityEnabledMessage:LiveLinkUpdateEntityEnabledMessage, LiveLinkUpdateEntityTransformMessage:LiveLinkUpdateEntityTransformMessage, LiveLinkReparentEntityMessage:LiveLinkReparentEntityMessage}
}());
pc.extend(pc.fw, function() {
  var LiveLinkCloseEntityMessage = function(id) {
    this.type = pc.fw.LiveLinkMessageType.CLOSE_ENTITY;
    this.content = {id:id}
  };
  LiveLinkCloseEntityMessage = pc.inherits(LiveLinkCloseEntityMessage, pc.fw.LiveLinkMessage);
  pc.fw.LiveLinkMessage.register("CLOSE_ENTITY");
  return{LiveLinkCloseEntityMessage:LiveLinkCloseEntityMessage}
}());
pc.extend(pc.fw, function() {
  var LiveLinkOpenEntityMessage = function(entity) {
    this.type = pc.fw.LiveLinkMessageType.OPEN_ENTITY;
    this.content = {entity:entity}
  };
  LiveLinkOpenEntityMessage = pc.inherits(LiveLinkOpenEntityMessage, pc.fw.LiveLinkMessage);
  pc.fw.LiveLinkMessage.register("OPEN_ENTITY");
  var LiveLinkOpenPackMessage = function(hierarchy, pack) {
    this.type = pc.fw.LiveLinkMessageType.OPEN_PACK;
    this.content = {pack:pc.extend({}, pack.getData())};
    this.content.pack.hierarchy = PCD.model.Entity.toData(hierarchy)
  };
  LiveLinkOpenPackMessage = pc.inherits(LiveLinkOpenPackMessage, pc.fw.LiveLinkMessage);
  pc.fw.LiveLinkMessage.register("OPEN_PACK");
  return{LiveLinkOpenEntityMessage:LiveLinkOpenEntityMessage, LiveLinkOpenPackMessage:LiveLinkOpenPackMessage}
}());
pc.extend(pc.fw, function() {
  var LiveLinkUpdateAssetMessage = function(id, attribute, value) {
    this.type = pc.fw.LiveLinkMessageType.UPDATE_ASSET;
    this.content = {id:id, attribute:attribute, value:value}
  };
  LiveLinkUpdateAssetMessage = pc.inherits(LiveLinkUpdateAssetMessage, pc.fw.LiveLinkMessage);
  pc.fw.LiveLinkMessage.register("UPDATE_ASSET");
  return{LiveLinkUpdateAssetMessage:LiveLinkUpdateAssetMessage}
}());
pc.extend(pc.fw, function() {
  var LiveLinkUpdatePackSettings = function(settings) {
    this.type = pc.fw.LiveLinkMessageType.UPDATE_PACK_SETTINGS;
    this.content = {settings:settings}
  };
  LiveLinkUpdatePackSettings = pc.inherits(LiveLinkUpdatePackSettings, pc.fw.LiveLinkMessage);
  pc.fw.LiveLinkMessage.register("UPDATE_PACK_SETTINGS");
  return{LiveLinkUpdatePackSettings:LiveLinkUpdatePackSettings}
}());
pc.extend(pc.fw, function() {
  var LiveLinkUpdateAssetCacheMessage = function(assets, deletedAssets) {
    this.type = pc.fw.LiveLinkMessageType.UPDATE_ASSETCACHE;
    this.content = {assets:assets, deleted:deletedAssets}
  };
  LiveLinkUpdateAssetCacheMessage = pc.inherits(LiveLinkUpdateAssetCacheMessage, pc.fw.LiveLinkMessage);
  pc.fw.LiveLinkMessage.register("UPDATE_ASSETCACHE");
  return{LiveLinkUpdateAssetCacheMessage:LiveLinkUpdateAssetCacheMessage}
}());
pc.extend(pc.fw, function() {
  var Entity = function() {
    this._guid = pc.guid.create();
    this._batchHandle = null;
    this.c = {};
    pc.events.attach(this)
  };
  Entity = pc.inherits(Entity, pc.scene.GraphNode);
  Entity.prototype.getGuid = function() {
    return this._guid
  };
  Entity.prototype.setGuid = function(guid) {
    this._guid = guid
  };
  Entity.prototype._onHierarchyStateChanged = function(enabled) {
    pc.fw.Entity._super._onHierarchyStateChanged.call(this, enabled);
    var component;
    var components = this.c;
    for(type in components) {
      if(components.hasOwnProperty(type)) {
        component = components[type];
        if(component.enabled) {
          if(enabled) {
            component.onEnable()
          }else {
            component.onDisable()
          }
        }
      }
    }
  };
  Entity.prototype.setRequest = function(request) {
    this._request = request
  };
  Entity.prototype.getRequest = function() {
    return this._request
  };
  Entity.prototype.addChild = function(child) {
    if(child instanceof pc.fw.Entity) {
      var _debug = true;
      if(_debug) {
        var root = this.getRoot();
        var dupe = root.findOne("getGuid", child.getGuid());
        if(dupe) {
          throw new Error("GUID already exists in graph");
        }
      }
    }
    pc.scene.GraphNode.prototype.addChild.call(this, child)
  };
  Entity.prototype.findByGuid = function(guid) {
    if(this._guid === guid) {
      return this
    }
    for(var i = 0;i < this._children.length;i++) {
      if(this._children[i].findByGuid) {
        var found = this._children[i].findByGuid(guid);
        if(found !== null) {
          return found
        }
      }
    }
    return null
  };
  Entity.prototype.destroy = function() {
    var parent = this.getParent();
    var childGuids;
    for(var name in this.c) {
      this.c[name].enabled = false
    }
    for(var name in this.c) {
      this.c[name].system.removeComponent(this)
    }
    if(parent) {
      parent.removeChild(this)
    }
    var children = this.getChildren();
    var length = children.length;
    var child = children.shift();
    while(child) {
      if(child instanceof pc.fw.Entity) {
        child.destroy()
      }
      child = children.shift()
    }
  };
  Entity.prototype.clone = function() {
    var type;
    var c = new pc.fw.Entity;
    pc.fw.Entity._super._cloneInternal.call(this, c);
    for(type in this.c) {
      var component = this.c[type];
      component.system.cloneComponent(this, c)
    }
    var i;
    for(i = 0;i < this.getChildren().length;i++) {
      var child = this.getChildren()[i];
      if(child instanceof pc.fw.Entity) {
        c.addChild(child.clone())
      }
    }
    return c
  };
  Entity.deserialize = function(data) {
    var template = pc.json.parse(data.template);
    var parent = pc.json.parse(data.parent);
    var children = pc.json.parse(data.children);
    var transform = pc.json.parse(data.transform);
    var components = pc.json.parse(data.components);
    var labels = pc.json.parse(data.labels);
    var model = {_id:data._id, resource_id:data.resource_id, _rev:data._rev, name:data.name, enabled:data.enabled, labels:labels, template:template, parent:parent, children:children, transform:transform, components:components};
    return model
  };
  Entity.serialize = function(model) {
    var data = {_id:model._id, resource_id:model.resource_id, name:model.name, enabled:model.enabled, labels:pc.json.stringify(model.labels), template:pc.json.stringify(model.template), parent:pc.json.stringify(model.parent), children:pc.json.stringify(model.children), transform:pc.json.stringify(model.transform), components:pc.json.stringify(model.components)};
    if(model._rev) {
      data._rev = model._rev
    }
    return data
  };
  return{Entity:Entity}
}());
pc.asset = {};
pc.extend(pc.asset, function() {
  var Asset = function(name, type, file, data, prefix) {
    var file, data, prefix;
    this.resourceId = pc.guid.create();
    this.name = arguments[0];
    this.type = arguments[1];
    this.file = arguments[2] ? {filename:file.filename, size:file.size, hash:file.hash, url:file.url} : null;
    this.data = arguments[3] || {};
    this.prefix = arguments[4] || "";
    this.resource = null;
    pc.events.attach(this)
  };
  Asset.prototype = {getFileUrl:function() {
    if(!this.file) {
      return null
    }
    var url = this.file.url;
    var prefix = "";
    if(this.prefix) {
      prefix = this.prefix
    }
    return pc.path.join(prefix, url)
  }};
  return{Asset:Asset, ASSET_ANIMATION:"animation", ASSET_AUDIO:"audio", ASSET_IMAGE:"image", ASSET_JSON:"json", ASSET_MODEL:"model", ASSET_MATERIAL:"material", ASSET_TEXT:"text", ASSET_TEXTURE:"texture"}
}());
pc.extend(pc.asset, function() {
  var AssetRegistry = function(loader, prefix) {
    if(!loader) {
      throw new Error("Must provide a ResourceLoader instance for AssetRegistry");
    }
    this.loader = loader;
    this._prefix = prefix || "";
    this._cache = {};
    this._names = {};
    this._urls = {};
    this._groups = {}
  };
  AssetRegistry.prototype = {addGroup:function(name, toc) {
    if(!this._groups[name]) {
      this._groups[name] = []
    }
    for(var resourceId in toc.assets) {
      var asset = this.getAssetByResourceId(resourceId);
      if(!asset) {
        var assetData = toc.assets[resourceId];
        asset = this.createAndAddAsset(resourceId, assetData)
      }else {
        pc.extend(asset, toc.assets[resourceId])
      }
      this._groups[name].push(asset.resourceId)
    }
  }, createAndAddAsset:function(resourceId, assetData) {
    var asset = new pc.asset.Asset(assetData.name, assetData.type, assetData.file, assetData.data, this._prefix);
    asset.resourceId = resourceId;
    this.addAsset(asset);
    if(asset.file) {
      this.loader.registerHash(asset.file.hash, asset.getFileUrl())
    }
    return asset
  }, all:function() {
    return Object.keys(this._cache).map(function(resourceId) {
      return this.getAssetByResourceId(resourceId)
    }, this)
  }, list:function(groupName) {
    if(groupName) {
      if(this._groups[groupName]) {
        return this._groups[groupName].map(function(resourceId) {
          return this.getAssetByResourceId(resourceId)
        }, this)
      }
    }else {
      return Object.keys(this._cache).map(function(resourceId) {
        return this.getAssetByResourceId(resourceId)
      }, this)
    }
  }, addAsset:function(asset) {
    this._cache[asset.resourceId] = asset;
    if(!this._names[asset.name]) {
      this._names[asset.name] = []
    }
    this._names[asset.name].push(asset.resourceId);
    if(asset.file) {
      this._urls[asset.file.url] = asset.resourceId
    }
  }, removeAsset:function(asset) {
    delete this._cache[asset.resourceId];
    delete this._names[asset.name];
    if(asset.file) {
      delete this._urls[asset.file.url]
    }
  }, findAll:function(name, type) {
    var self = this;
    var ids = this._names[name];
    var assets;
    if(ids) {
      assets = ids.map(function(id) {
        return self._cache[id]
      });
      if(type) {
        return assets.filter(function(asset) {
          return asset.type === type
        })
      }else {
        return assets
      }
    }else {
      return[]
    }
  }, find:function(name, type) {
    var asset = this.findAll(name, type);
    return asset ? asset[0] : null
  }, getAssetByResourceId:function(resourceId) {
    return this._cache[resourceId]
  }, getAssetByUrl:function(url) {
    var resourceId = this._urls[url];
    return this._cache[resourceId]
  }, getAssetByName:function(name) {
    console.warn("WARNING: getAssetByName: Function is deprecated. Use find() or findAll() instead.");
    return this.find(name)
  }, load:function(assets, results, options) {
    if(assets && !assets.length) {
      assets = [assets]
    }
    if(typeof options === "undefined") {
      options = results;
      results = []
    }
    var requests = [];
    assets.forEach(function(asset, index) {
      var existing = this.getAssetByResourceId(asset.resourceId);
      if(!existing) {
        this.addAsset(asset)
      }
      switch(asset.type) {
        case pc.asset.ASSET_MODEL:
          requests.push(this._createModelRequest(asset));
          break;
        case pc.asset.ASSET_TEXTURE:
          requests.push(this._createTextureRequest(asset, results[index]));
          break;
        case pc.asset.ASSET_MATERIAL:
          requests.push(this._createMaterialRequest(asset));
          break;
        default:
          requests.push(this._createAssetRequest(asset));
          break
      }
    }, this);
    return this.loader.request(requests.filter(function(r) {
      return r !== null
    }), options).then(function(resources) {
      var promise = new pc.promise.Promise(function(resolve, reject) {
        var index = 0;
        requests.forEach(function(r, i) {
          if(r) {
            assets[i].resource = resources[index++]
          }
        });
        resolve(resources)
      });
      return promise
    }, function(error) {
      setTimeout(function() {
        throw error;
      }, 0)
    })
  }, loadFromUrl:function(url, type) {
    if(!type) {
      throw Error("type required");
    }
    if(type === "model") {
      return this._loadModel(url)
    }
    var dir = pc.path.getDirectory(url);
    var basename = pc.path.getBasename(url);
    var name = basename.replace(".json", "");
    var asset = new pc.asset.Asset(name, type, {url:url});
    var promise = new pc.promise.Promise(function(resolve, reject) {
      this.load(asset).then(function(resource) {
        resolve({resource:resource, asset:asset})
      })
    }.bind(this));
    return promise
  }, _loadModel:function(url) {
    var self = this;
    var dir = pc.path.getDirectory(url);
    var basename = pc.path.getBasename(url);
    var name = basename.replace(".json", "");
    var mappingUrl = pc.path.join(dir, basename.replace(".json", ".mapping.json"));
    var modelAsset = new pc.asset.Asset(name, "model", {url:url});
    var mappingAsset = new pc.asset.Asset(name + ".mapping", "json", {url:mappingUrl});
    var promise = new pc.promise.Promise(function(resolve, reject) {
      self.load([modelAsset, mappingAsset]).then(function(resources) {
        var model = resources[0];
        var mapping = resources[1];
        modelAsset.data = mapping;
        var materialAssets = [];
        mapping.mapping.forEach(function(map) {
          materialAssets.push(new pc.asset.Asset(pc.path.getBasename(map.path), "material", {url:pc.path.join(dir, map.path)}))
        });
        if(materialAssets.length) {
          var promise = self.load(materialAssets);
          promise.then(function(materials) {
            for(var i = 0, n = model.meshInstances.length;i < n;i++) {
              model.meshInstances[i].material = materials[i]
            }
            resolve({resource:model, asset:modelAsset})
          });
          return promise
        }else {
          resolve({resource:model, asset:modelAsset})
        }
      })
    });
    return promise
  }, _createAssetRequest:function(asset, result) {
    var url = asset.getFileUrl();
    if(url) {
      return this.loader.createFileRequest(url, asset.type)
    }else {
      return null
    }
  }, _createModelRequest:function(asset) {
    var url = asset.getFileUrl();
    var mapping = asset.data && asset.data.mapping ? asset.data.mapping : [];
    return new pc.resources.ModelRequest(url, mapping)
  }, _createTextureRequest:function(asset, texture) {
    return new pc.resources.TextureRequest(asset.getFileUrl(), null, texture)
  }, _createMaterialRequest:function(asset) {
    var url = asset.getFileUrl();
    if(url) {
      return new pc.resources.MaterialRequest(url)
    }else {
      return new pc.resources.MaterialRequest("asset://" + asset.resourceId)
    }
  }};
  return{AssetRegistry:AssetRegistry}
}());
!function(a) {
  var b, c;
  !function() {
    var a = {}, d = {};
    b = function(b, c, d) {
      a[b] = {deps:c, callback:d}
    }, c = function(b) {
      function e(a) {
        if("." !== a.charAt(0)) {
          return a
        }
        for(var c = a.split("/"), d = b.split("/").slice(0, -1), e = 0, f = c.length;f > e;e++) {
          var g = c[e];
          if(".." === g) {
            d.pop()
          }else {
            if("." === g) {
              continue
            }
            d.push(g)
          }
        }
        return d.join("/")
      }
      if(d[b]) {
        return d[b]
      }
      if(d[b] = {}, !a[b]) {
        throw new Error("Could not find module " + b);
      }
      for(var f, g = a[b], h = g.deps, i = g.callback, j = [], k = 0, l = h.length;l > k;k++) {
        j.push("exports" === h[k] ? f = {} : c(e(h[k])))
      }
      var m = i.apply(this, j);
      return d[b] = f || m
    }, c.entries = a
  }(), b("rsvp/all-settled", ["./promise", "./utils", "exports"], function(a, b, c) {
    function d(a) {
      return{state:"fulfilled", value:a}
    }
    function e(a) {
      return{state:"rejected", reason:a}
    }
    var f = a["default"], g = b.isArray, h = b.isNonThenable;
    c["default"] = function(a, b) {
      return new f(function(b) {
        function c(a) {
          return function(b) {
            j(a, d(b))
          }
        }
        function i(a) {
          return function(b) {
            j(a, e(b))
          }
        }
        function j(a, c) {
          m[a] = c, 0 === --l && b(m)
        }
        if(!g(a)) {
          throw new TypeError("You must pass an array to allSettled.");
        }
        var k, l = a.length;
        if(0 === l) {
          return void b([])
        }
        for(var m = new Array(l), n = 0;n < a.length;n++) {
          k = a[n], h(k) ? j(n, d(k)) : f.resolve(k).then(c(n), i(n))
        }
      }, b)
    }
  }), b("rsvp/all", ["./promise", "exports"], function(a, b) {
    var c = a["default"];
    b["default"] = function(a, b) {
      return c.all(a, b)
    }
  }), b("rsvp/asap", ["exports"], function(a) {
    function b() {
      return function() {
        process.nextTick(e)
      }
    }
    function c() {
      var a = 0, b = new h(e), c = document.createTextNode("");
      return b.observe(c, {characterData:!0}), function() {
        c.data = a = ++a % 2
      }
    }
    function d() {
      return function() {
        setTimeout(e, 1)
      }
    }
    function e() {
      for(var a = 0;a < i.length;a++) {
        var b = i[a], c = b[0], d = b[1];
        c(d)
      }
      i.length = 0
    }
    a["default"] = function(a, b) {
      var c = i.push([a, b]);
      1 === c && f()
    };
    var f, g = "undefined" != typeof window ? window : {}, h = g.MutationObserver || g.WebKitMutationObserver, i = [];
    f = "undefined" != typeof process && "[object process]" === {}.toString.call(process) ? b() : h ? c() : d()
  }), b("rsvp/config", ["./events", "exports"], function(a, b) {
    function c(a, b) {
      return"onerror" === a ? void e.on("error", b) : 2 !== arguments.length ? e[a] : void(e[a] = b)
    }
    var d = a["default"], e = {instrument:!1};
    d.mixin(e), b.config = e, b.configure = c
  }), b("rsvp/defer", ["./promise", "exports"], function(a, b) {
    var c = a["default"];
    b["default"] = function(a) {
      var b = {};
      return b.promise = new c(function(a, c) {
        b.resolve = a, b.reject = c
      }, a), b
    }
  }), b("rsvp/events", ["exports"], function(a) {
    function b(a, b) {
      for(var c = 0, d = a.length;d > c;c++) {
        if(a[c] === b) {
          return c
        }
      }
      return-1
    }
    function c(a) {
      var b = a._promiseCallbacks;
      return b || (b = a._promiseCallbacks = {}), b
    }
    a["default"] = {mixin:function(a) {
      return a.on = this.on, a.off = this.off, a.trigger = this.trigger, a._promiseCallbacks = void 0, a
    }, on:function(a, d) {
      var e, f = c(this);
      e = f[a], e || (e = f[a] = []), -1 === b(e, d) && e.push(d)
    }, off:function(a, d) {
      var e, f, g = c(this);
      return d ? (e = g[a], f = b(e, d), void(-1 !== f && e.splice(f, 1))) : void(g[a] = [])
    }, trigger:function(a, b) {
      var d, e, f = c(this);
      if(d = f[a]) {
        for(var g = 0;g < d.length;g++) {
          (e = d[g])(b)
        }
      }
    }}
  }), b("rsvp/filter", ["./promise", "./utils", "exports"], function(a, b, c) {
    var d = a["default"], e = b.isFunction;
    c["default"] = function(a, b, c) {
      return d.all(a, c).then(function(a) {
        if(!e(b)) {
          throw new TypeError("You must pass a function as filter's second argument.");
        }
        for(var f = a.length, g = new Array(f), h = 0;f > h;h++) {
          g[h] = b(a[h])
        }
        return d.all(g, c).then(function(b) {
          for(var c = new Array(f), d = 0, e = 0;f > e;e++) {
            b[e] === !0 && (c[d] = a[e], d++)
          }
          return c.length = d, c
        })
      })
    }
  }), b("rsvp/hash-settled", ["./promise", "./utils", "exports"], function(a, b, c) {
    function d(a) {
      return{state:"fulfilled", value:a}
    }
    function e(a) {
      return{state:"rejected", reason:a}
    }
    var f = a["default"], g = b.isNonThenable, h = b.keysOf;
    c["default"] = function(a) {
      return new f(function(b) {
        function c(a) {
          return function(b) {
            j(a, d(b))
          }
        }
        function i(a) {
          return function(b) {
            j(a, e(b))
          }
        }
        function j(a, c) {
          m[a] = c, 0 === --o && b(m)
        }
        var k, l, m = {}, n = h(a), o = n.length;
        if(0 === o) {
          return void b(m)
        }
        for(var p = 0;p < n.length;p++) {
          l = n[p], k = a[l], g(k) ? j(l, d(k)) : f.resolve(k).then(c(l), i(l))
        }
      })
    }
  }), b("rsvp/hash", ["./promise", "./utils", "exports"], function(a, b, c) {
    var d = a["default"], e = b.isNonThenable, f = b.keysOf;
    c["default"] = function(a) {
      return new d(function(b, c) {
        function g(a) {
          return function(c) {
            k[a] = c, 0 === --m && b(k)
          }
        }
        function h(a) {
          m = 0, c(a)
        }
        var i, j, k = {}, l = f(a), m = l.length;
        if(0 === m) {
          return void b(k)
        }
        for(var n = 0;n < l.length;n++) {
          j = l[n], i = a[j], e(i) ? (k[j] = i, 0 === --m && b(k)) : d.resolve(i).then(g(j), h)
        }
      })
    }
  }), b("rsvp/instrument", ["./config", "./utils", "exports"], function(a, b, c) {
    var d = a.config, e = b.now;
    c["default"] = function(a, b, c) {
      try {
        d.trigger(a, {guid:b._guidKey + b._id, eventName:a, detail:b._detail, childGuid:c && b._guidKey + c._id, label:b._label, timeStamp:e(), stack:(new Error(b._label)).stack})
      }catch(f) {
        setTimeout(function() {
          throw f;
        }, 0)
      }
    }
  }), b("rsvp/map", ["./promise", "./utils", "exports"], function(a, b, c) {
    var d = a["default"], e = (b.isArray, b.isFunction);
    c["default"] = function(a, b, c) {
      return d.all(a, c).then(function(a) {
        if(!e(b)) {
          throw new TypeError("You must pass a function as map's second argument.");
        }
        for(var f = a.length, g = new Array(f), h = 0;f > h;h++) {
          g[h] = b(a[h])
        }
        return d.all(g, c)
      })
    }
  }), b("rsvp/node", ["./promise", "./utils", "exports"], function(a, b, c) {
    var d = a["default"], e = b.isArray;
    c["default"] = function(a, b) {
      function c() {
        for(var c = arguments.length, e = new Array(c), h = 0;c > h;h++) {
          e[h] = arguments[h]
        }
        var i;
        return f || g || !b ? i = this : (console.warn('Deprecation: RSVP.denodeify() doesn\'t allow setting the "this" binding anymore. Use yourFunction.bind(yourThis) instead.'), i = b), d.all(e).then(function(c) {
          function e(d, e) {
            function h() {
              for(var a = arguments.length, c = new Array(a), h = 0;a > h;h++) {
                c[h] = arguments[h]
              }
              var i = c[0], j = c[1];
              if(i) {
                e(i)
              }else {
                if(f) {
                  d(c.slice(1))
                }else {
                  if(g) {
                    var k, l, m = {}, n = c.slice(1);
                    for(l = 0;l < b.length;l++) {
                      k = b[l], m[k] = n[l]
                    }
                    d(m)
                  }else {
                    d(j)
                  }
                }
              }
            }
            c.push(h), a.apply(i, c)
          }
          return new d(e)
        })
      }
      var f = b === !0, g = e(b);
      return c.__proto__ = a, c
    }
  }), b("rsvp/promise", ["./config", "./events", "./instrument", "./utils", "./promise/cast", "./promise/all", "./promise/race", "./promise/resolve", "./promise/reject", "exports"], function(a, b, c, d, e, f, g, h, i, j) {
    function k() {
    }
    function l(a, b) {
      if(!z(a)) {
        throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");
      }
      if(!(this instanceof l)) {
        throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
      }
      this._id = H++, this._label = b, this._subscribers = [], w.instrument && x("created", this), k !== a && m(a, this)
    }
    function m(a, b) {
      function c(a) {
        r(b, a)
      }
      function d(a) {
        t(b, a)
      }
      try {
        a(c, d)
      }catch(e) {
        d(e)
      }
    }
    function n(a, b, c, d) {
      var e = a._subscribers, f = e.length;
      e[f] = b, e[f + K] = c, e[f + L] = d
    }
    function o(a, b) {
      var c, d, e = a._subscribers, f = a._detail;
      w.instrument && x(b === K ? "fulfilled" : "rejected", a);
      for(var g = 0;g < e.length;g += 3) {
        c = e[g], d = e[g + b], p(b, c, d, f)
      }
      a._subscribers = null
    }
    function p(a, b, c, d) {
      var e, f, g, h, i = z(c);
      if(i) {
        try {
          e = c(d), g = !0
        }catch(j) {
          h = !0, f = j
        }
      }else {
        e = d, g = !0
      }
      q(b, e) || (i && g ? r(b, e) : h ? t(b, f) : a === K ? r(b, e) : a === L && t(b, e))
    }
    function q(a, b) {
      var c, d = null;
      try {
        if(a === b) {
          throw new TypeError("A promises callback cannot return that same promise.");
        }
        if(y(b) && (d = b.then, z(d))) {
          return d.call(b, function(d) {
            return c ? !0 : (c = !0, void(b !== d ? r(a, d) : s(a, d)))
          }, function(b) {
            return c ? !0 : (c = !0, void t(a, b))
          }, "Settle: " + (a._label || " unknown promise")), !0
        }
      }catch(e) {
        return c ? !0 : (t(a, e), !0)
      }
      return!1
    }
    function r(a, b) {
      a === b ? s(a, b) : q(a, b) || s(a, b)
    }
    function s(a, b) {
      a._state === I && (a._state = J, a._detail = b, w.async(u, a))
    }
    function t(a, b) {
      a._state === I && (a._state = J, a._detail = b, w.async(v, a))
    }
    function u(a) {
      o(a, a._state = K)
    }
    function v(a) {
      a._onerror && a._onerror(a._detail), o(a, a._state = L)
    }
    var w = a.config, x = (b["default"], c["default"]), y = d.objectOrFunction, z = d.isFunction, A = d.now, B = e["default"], C = f["default"], D = g["default"], E = h["default"], F = i["default"], G = "rsvp_" + A() + "-", H = 0;
    j["default"] = l, l.cast = B, l.all = C, l.race = D, l.resolve = E, l.reject = F;
    var I = void 0, J = 0, K = 1, L = 2;
    l.prototype = {constructor:l, _id:void 0, _guidKey:G, _label:void 0, _state:void 0, _detail:void 0, _subscribers:void 0, _onerror:function(a) {
      w.trigger("error", a)
    }, then:function(a, b, c) {
      var d = this;
      this._onerror = null;
      var e = new this.constructor(k, c);
      if(this._state) {
        var f = arguments;
        w.async(function() {
          p(d._state, e, f[d._state - 1], d._detail)
        })
      }else {
        n(this, e, a, b)
      }
      return w.instrument && x("chained", d, e), e
    }, "catch":function(a, b) {
      return this.then(null, a, b)
    }, "finally":function(a, b) {
      var c = this.constructor;
      return this.then(function(b) {
        return c.resolve(a()).then(function() {
          return b
        })
      }, function(b) {
        return c.resolve(a()).then(function() {
          throw b;
        })
      }, b)
    }}
  }), b("rsvp/promise/all", ["../utils", "exports"], function(a, b) {
    var c = a.isArray, d = a.isNonThenable;
    b["default"] = function(a, b) {
      var e = this;
      return new e(function(b, f) {
        function g(a) {
          return function(c) {
            k[a] = c, 0 === --j && b(k)
          }
        }
        function h(a) {
          j = 0, f(a)
        }
        if(!c(a)) {
          throw new TypeError("You must pass an array to all.");
        }
        var i, j = a.length, k = new Array(j);
        if(0 === j) {
          return void b(k)
        }
        for(var l = 0;l < a.length;l++) {
          i = a[l], d(i) ? (k[l] = i, 0 === --j && b(k)) : e.resolve(i).then(g(l), h)
        }
      }, b)
    }
  }), b("rsvp/promise/cast", ["exports"], function(a) {
    a["default"] = function(a, b) {
      var c = this;
      return a && "object" == typeof a && a.constructor === c ? a : new c(function(b) {
        b(a)
      }, b)
    }
  }), b("rsvp/promise/race", ["../utils", "exports"], function(a, b) {
    var c = a.isArray, d = (a.isFunction, a.isNonThenable);
    b["default"] = function(a, b) {
      var e, f = this;
      return new f(function(b, g) {
        function h(a) {
          j && (j = !1, b(a))
        }
        function i(a) {
          j && (j = !1, g(a))
        }
        if(!c(a)) {
          throw new TypeError("You must pass an array to race.");
        }
        for(var j = !0, k = 0;k < a.length;k++) {
          if(e = a[k], d(e)) {
            return j = !1, void b(e)
          }
          f.resolve(e).then(h, i)
        }
      }, b)
    }
  }), b("rsvp/promise/reject", ["exports"], function(a) {
    a["default"] = function(a, b) {
      var c = this;
      return new c(function(b, c) {
        c(a)
      }, b)
    }
  }), b("rsvp/promise/resolve", ["exports"], function(a) {
    a["default"] = function(a, b) {
      var c = this;
      return a && "object" == typeof a && a.constructor === c ? a : new c(function(b) {
        b(a)
      }, b)
    }
  }), b("rsvp/race", ["./promise", "exports"], function(a, b) {
    var c = a["default"];
    b["default"] = function(a, b) {
      return c.race(a, b)
    }
  }), b("rsvp/reject", ["./promise", "exports"], function(a, b) {
    var c = a["default"];
    b["default"] = function(a, b) {
      return c.reject(a, b)
    }
  }), b("rsvp/resolve", ["./promise", "exports"], function(a, b) {
    var c = a["default"];
    b["default"] = function(a, b) {
      return c.resolve(a, b)
    }
  }), b("rsvp/rethrow", ["exports"], function(a) {
    a["default"] = function(a) {
      throw setTimeout(function() {
        throw a;
      }), a;
    }
  }), b("rsvp/utils", ["exports"], function(a) {
    function b(a) {
      return"function" == typeof a || "object" == typeof a && null !== a
    }
    function c(a) {
      return"function" == typeof a
    }
    function d(a) {
      return!b(a)
    }
    a.objectOrFunction = b, a.isFunction = c, a.isNonThenable = d;
    var e;
    e = Array.isArray ? Array.isArray : function(a) {
      return"[object Array]" === Object.prototype.toString.call(a)
    };
    var f = e;
    a.isArray = f;
    var g = Date.now || function() {
      return(new Date).getTime()
    };
    a.now = g;
    var h = Object.keys || function(a) {
      var b = [];
      for(var c in a) {
        b.push(c)
      }
      return b
    };
    a.keysOf = h
  }), b("rsvp", ["./rsvp/promise", "./rsvp/events", "./rsvp/node", "./rsvp/all", "./rsvp/all-settled", "./rsvp/race", "./rsvp/hash", "./rsvp/hash-settled", "./rsvp/rethrow", "./rsvp/defer", "./rsvp/config", "./rsvp/map", "./rsvp/resolve", "./rsvp/reject", "./rsvp/filter", "./rsvp/asap", "exports"], function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q) {
    function r(a, b) {
      E.async(a, b)
    }
    function s() {
      E.on.apply(E, arguments)
    }
    function t() {
      E.off.apply(E, arguments)
    }
    var u = a["default"], v = b["default"], w = c["default"], x = d["default"], y = e["default"], z = f["default"], A = g["default"], B = h["default"], C = i["default"], D = j["default"], E = k.config, F = k.configure, G = l["default"], H = m["default"], I = n["default"], J = o["default"], K = p["default"];
    if(E.async = K, "undefined" != typeof window && "object" == typeof window.__PROMISE_INSTRUMENTATION__) {
      var L = window.__PROMISE_INSTRUMENTATION__;
      F("instrument", !0);
      for(var M in L) {
        L.hasOwnProperty(M) && s(M, L[M])
      }
    }
    q.Promise = u, q.EventTarget = v, q.all = x, q.allSettled = y, q.race = z, q.hash = A, q.hashSettled = B, q.rethrow = C, q.defer = D, q.denodeify = w, q.configure = F, q.on = s, q.off = t, q.resolve = H, q.reject = I, q.async = r, q.map = G, q.filter = J
  }), a.RSVP = c("rsvp")
}(window);
pc.promise = {Promise:window.RSVP.Promise, all:window.RSVP.all};

