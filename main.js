"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function natural(lhs, rhs) {
    if (lhs < rhs)
        return -1;
    if (lhs > rhs)
        return 1;
    return 0;
}
exports.natural = natural;
;
function naturalInverse(lhs, rhs) {
    if (lhs < rhs)
        return 1;
    if (lhs > rhs)
        return -1;
    return 0;
}
exports.naturalInverse = naturalInverse;
;
function invert(comparator) {
    return function (lhs, rhs) { return -comparator(lhs, rhs); };
}
exports.invert = invert;
function byKey(keyExtractor, keyComparator) {
    if (keyComparator === void 0) { keyComparator = natural; }
    return function (lhs, rhs) { return keyComparator(keyExtractor(lhs), keyExtractor(rhs)); };
}
exports.byKey = byKey;
function byField(keySpecifier, comparator) {
    var fields = keySpecifier.split(".");
    var keyExtractor = function (object) { return fields.reduce(function (obj, field) { return obj[field]; }, object); };
    return byKey(keyExtractor, comparator);
}
exports.byField = byField;
function combine() {
    var comparators = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        comparators[_i] = arguments[_i];
    }
    return function (lhs, rhs) {
        for (var _i = 0, comparators_1 = comparators; _i < comparators_1.length; _i++) {
            var comparator = comparators_1[_i];
            var result = comparator(lhs, rhs);
            if (result !== 0) {
                return result;
            }
        }
        return 0;
    };
}
exports.combine = combine;
