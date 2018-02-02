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
    return (lhs, rhs) => -comparator(lhs, rhs);
}
exports.invert = invert;
function byKey(keyExtractor, keyComparator = natural) {
    return (lhs, rhs) => keyComparator(keyExtractor(lhs), keyExtractor(rhs));
}
exports.byKey = byKey;
function byField(keySpecifier, comparator) {
    const fields = keySpecifier.split(".");
    const keyExtractor = (object) => fields.reduce((obj, field) => obj[field], object);
    return byKey(keyExtractor, comparator);
}
exports.byField = byField;
function combine(...comparators) {
    return (lhs, rhs) => {
        for (let comparator of comparators) {
            const result = comparator(lhs, rhs);
            if (result !== 0) {
                return result;
            }
        }
        return 0;
    };
}
exports.combine = combine;
