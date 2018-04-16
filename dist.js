(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Kagura = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.array.sort");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var UNDEF = {};

function split(toSplit, by) {
  var result = [];
  var buffer = [];

  for (var i = 0, j = toSplit.length; i < j; ++i) {
    var c = toSplit[i];

    if (c === "\\") {
      buffer.push(toSplit[++i]);
    } else if (c === by) {
      result.push(buffer.join(""));
      buffer = [];
    } else {
      buffer.push(c);
    }
  }

  result.push(buffer.join(""));
  return result;
}

function sort(items) {
  var comparator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : natural;
  var tmp = items;

  for (var i = 0, j = items.length; i < j; ++i) {
    tmp[i] = tmp[i] !== undefined ? tmp[i] : UNDEF;
  }

  tmp.sort(function (lhs, rhs) {
    return comparator(lhs !== UNDEF ? lhs : undefined, rhs !== UNDEF ? rhs : undefined);
  });

  for (var _i = 0, _j = tmp.length; _i < _j; ++_i) {
    tmp[_i] = tmp[_i] !== UNDEF ? tmp[_i] : undefined;
  }
}

exports.sort = sort;

function sortStable(items) {
  var comparator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : natural;
  var tmp = items;

  for (var i = 0, j = items.length; i < j; ++i) {
    tmp[i] = {
      i: i,
      v: tmp[i]
    };
  }

  tmp.sort(function (lhs, rhs) {
    var result = comparator(lhs.v, rhs.v);
    return result !== 0 ? result : lhs.i - rhs.i;
  });

  for (var _i2 = 0, _j2 = tmp.length; _i2 < _j2; ++_i2) {
    tmp[_i2] = tmp[_i2].v;
  }
}

exports.sortStable = sortStable;

function sortBy(items, keyExtractor) {
  var comparator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : natural;
  var tmp = items;

  for (var i = 0, j = items.length; i < j; ++i) {
    tmp[i] = {
      k: keyExtractor(tmp[i]),
      v: tmp[i]
    };
  }

  tmp.sort(function (lhs, rhs) {
    return comparator(lhs.k, rhs.k);
  });

  for (var _i3 = 0, _j3 = tmp.length; _i3 < _j3; ++_i3) {
    tmp[_i3] = tmp[_i3].v;
  }
}

exports.sortBy = sortBy;

function sortStableBy(items, keyExtractor) {
  var comparator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : natural;
  var tmp = items;

  for (var i = 0, j = items.length; i < j; ++i) {
    tmp[i] = {
      i: i,
      k: keyExtractor(tmp[i]),
      v: tmp[i]
    };
  }

  tmp.sort(function (lhs, rhs) {
    var result = comparator(lhs.k, rhs.k);
    return result !== 0 ? result : lhs.i - rhs.i;
  });

  for (var _i4 = 0, _j4 = tmp.length; _i4 < _j4; ++_i4) {
    tmp[_i4] = tmp[_i4].v;
  }
}

exports.sortStableBy = sortStableBy;

function comparable(lhs, rhs) {
  if (lhs === undefined) {
    return rhs === undefined ? 0 : -1;
  }

  return rhs === undefined ? 1 : lhs.compareTo(rhs);
}

exports.comparable = comparable;

function natural(lhs, rhs) {
  return lhs !== undefined ? rhs !== undefined ? lhs < rhs ? -1 : lhs > rhs ? 1 : 0 : 1 : rhs !== undefined ? -1 : 0;
}

exports.natural = natural;

function inverse(lhs, rhs) {
  return lhs !== undefined ? rhs !== undefined ? lhs < rhs ? 1 : lhs > rhs ? -1 : 0 : 1 : rhs !== undefined ? -1 : 0;
}

exports.inverse = inverse;

function invert(comparator) {
  return function (lhs, rhs) {
    if (lhs === undefined || rhs === undefined) {
      return comparator(lhs, rhs);
    }

    return -comparator(lhs, rhs);
  };
}

exports.invert = invert;

function byKey(keyExtractor) {
  var keyComparator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : natural;
  return function (lhs, rhs) {
    if (lhs === undefined) {
      return rhs === undefined ? 0 : -1;
    }

    return rhs === undefined ? 1 : keyComparator(keyExtractor(lhs), keyExtractor(rhs));
  };
}

exports.byKey = byKey;

function byProp(keySpecifier, comparator) {
  if (keySpecifier.indexOf(".") < 0) {
    return byKey(function (x) {
      return x[keySpecifier];
    }, comparator);
  }

  var fields = split(keySpecifier, ".");

  var keyExtractor = function keyExtractor(object) {
    var value = object;

    for (var i = 0, j = fields.length; i < j && value !== undefined; ++i) {
      value = value[fields[i]];
    }

    return value;
  };

  return byKey(keyExtractor, comparator);
}

exports.byProp = byProp;

function combine() {
  for (var _len = arguments.length, comparators = new Array(_len), _key = 0; _key < _len; _key++) {
    comparators[_key] = arguments[_key];
  }

  return function (lhs, rhs) {
    for (var i = 0, j = comparators.length; i < j; ++i) {
      var result = comparators[i](lhs, rhs);

      if (result !== 0) {
        return result;
      }
    }

    return 0;
  };
}

exports.combine = combine;
exports.ignoreCase = byKey(function (item) {
  return item.toLowerCase();
});

function byThreshold() {
  var threshold = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1E-12;
  threshold = Math.max(0, threshold);
  return function (lhs, rhs) {
    if (lhs === rhs) {
      return 0;
    }

    if (lhs === undefined) {
      return -1;
    }

    if (rhs === undefined) {
      return 1;
    }

    if (lhs < rhs) {
      return rhs - lhs < threshold ? 0 : -1;
    }

    return isNaN(rhs) ? isNaN(lhs) ? 0 : -1 : lhs - rhs < threshold ? 0 : 1;
  };
}

exports.byThreshold = byThreshold;

function equals() {
  var comparator = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : natural;
  return function (lhs, rhs) {
    return comparator(lhs, rhs) === 0;
  };
}

exports.equals = equals;

function equalTo(item) {
  var test = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : natural;
  return function (x) {
    return test(item, x) === 0;
  };
}

exports.equalTo = equalTo;

function within(lower, upper) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$comparator = _ref.comparator,
      comparator = _ref$comparator === void 0 ? natural : _ref$comparator,
      _ref$mode = _ref.mode,
      mode = _ref$mode === void 0 ? "[]" : _ref$mode;

  switch (mode) {
    case "[]":
      return function (item) {
        return comparator(lower, item) <= 0 && comparator(item, upper) <= 0;
      };

    case "()":
    case "][":
      return function (item) {
        return comparator(lower, item) < 0 && comparator(item, upper) < 0;
      };

    case "[)":
    case "[[":
      return function (item) {
        return comparator(lower, item) <= 0 && comparator(item, upper) < 0;
      };

    case "(]":
    case "]]":
      return function (item) {
        return comparator(lower, item) < 0 && comparator(item, upper) <= 0;
      };
  }

  throw new Error("invalid mode ".concat(mode, ", must be one of [] () [) (]"));
}

exports.within = within;

},{"core-js/modules/es6.array.sort":23}],2:[function(require,module,exports){
module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],3:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":15}],4:[function(require,module,exports){
var core = module.exports = { version: '2.5.5' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],5:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":2}],6:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],7:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_fails":10}],8:[function(require,module,exports){
var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":11,"./_is-object":15}],9:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var hide = require('./_hide');
var redefine = require('./_redefine');
var ctx = require('./_ctx');
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;

},{"./_core":4,"./_ctx":5,"./_global":11,"./_hide":13,"./_redefine":18}],10:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],11:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],12:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],13:[function(require,module,exports){
var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":7,"./_object-dp":16,"./_property-desc":17}],14:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_descriptors":7,"./_dom-create":8,"./_fails":10}],15:[function(require,module,exports){
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],16:[function(require,module,exports){
var anObject = require('./_an-object');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var toPrimitive = require('./_to-primitive');
var dP = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":3,"./_descriptors":7,"./_ie8-dom-define":14,"./_to-primitive":21}],17:[function(require,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],18:[function(require,module,exports){
var global = require('./_global');
var hide = require('./_hide');
var has = require('./_has');
var SRC = require('./_uid')('src');
var TO_STRING = 'toString';
var $toString = Function[TO_STRING];
var TPL = ('' + $toString).split(TO_STRING);

require('./_core').inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});

},{"./_core":4,"./_global":11,"./_has":12,"./_hide":13,"./_uid":22}],19:[function(require,module,exports){
'use strict';
var fails = require('./_fails');

module.exports = function (method, arg) {
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call
    arg ? method.call(null, function () { /* empty */ }, 1) : method.call(null);
  });
};

},{"./_fails":10}],20:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":6}],21:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"./_is-object":15}],22:[function(require,module,exports){
var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],23:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var aFunction = require('./_a-function');
var toObject = require('./_to-object');
var fails = require('./_fails');
var $sort = [].sort;
var test = [1, 2, 3];

$export($export.P + $export.F * (fails(function () {
  // IE8-
  test.sort(undefined);
}) || !fails(function () {
  // V8 bug
  test.sort(null);
  // Old WebKit
}) || !require('./_strict-method')($sort)), 'Array', {
  // 22.1.3.25 Array.prototype.sort(comparefn)
  sort: function sort(comparefn) {
    return comparefn === undefined
      ? $sort.call(toObject(this))
      : $sort.call(toObject(this), aFunction(comparefn));
  }
});

},{"./_a-function":2,"./_export":9,"./_fails":10,"./_strict-method":19,"./_to-object":20}]},{},[1])(1)
});
