(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Kagura = f()}})(function(){var define,module,exports;return (function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

},{}]},{},[1])(1)
});