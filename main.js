"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UNDEF = {};
function split(toSplit, by) {
    const result = [];
    let buffer = [];
    for (let i = 0, j = toSplit.length; i < j; ++i) {
        const c = toSplit[i];
        if (c === "\\") {
            buffer.push(toSplit[++i]);
        }
        else if (c === by) {
            result.push(buffer.join(""));
            buffer = [];
        }
        else {
            buffer.push(c);
        }
    }
    result.push(buffer.join(""));
    return result;
}
function sort(items, comparator = natural) {
    const tmp = items;
    for (let i = 0, j = items.length; i < j; ++i) {
        tmp[i] = tmp[i] !== undefined ? tmp[i] : UNDEF;
    }
    tmp.sort((lhs, rhs) => {
        return comparator(lhs !== UNDEF ? lhs : undefined, rhs !== UNDEF ? rhs : undefined);
    });
    for (let i = 0, j = tmp.length; i < j; ++i) {
        tmp[i] = tmp[i] !== UNDEF ? tmp[i] : undefined;
    }
}
exports.sort = sort;
function sortStable(items, comparator = natural) {
    const tmp = items;
    for (let i = 0, j = items.length; i < j; ++i) {
        tmp[i] = {
            i,
            v: tmp[i],
        };
    }
    tmp.sort((lhs, rhs) => {
        const result = comparator(lhs.v, rhs.v);
        return result !== 0 ? result : lhs.i - rhs.i;
    });
    for (let i = 0, j = tmp.length; i < j; ++i) {
        tmp[i] = tmp[i].v;
    }
}
exports.sortStable = sortStable;
function sortBy(items, keyExtractor, comparator = natural) {
    const tmp = items;
    for (let i = 0, j = items.length; i < j; ++i) {
        tmp[i] = {
            k: keyExtractor(tmp[i]),
            v: tmp[i],
        };
    }
    tmp.sort((lhs, rhs) => {
        return comparator(lhs.k, rhs.k);
    });
    for (let i = 0, j = tmp.length; i < j; ++i) {
        tmp[i] = tmp[i].v;
    }
}
exports.sortBy = sortBy;
function sortStableBy(items, keyExtractor, comparator = natural) {
    const tmp = items;
    for (let i = 0, j = items.length; i < j; ++i) {
        tmp[i] = {
            i,
            k: keyExtractor(tmp[i]),
            v: tmp[i],
        };
    }
    tmp.sort((lhs, rhs) => {
        const result = comparator(lhs.k, rhs.k);
        return result !== 0 ? result : lhs.i - rhs.i;
    });
    for (let i = 0, j = tmp.length; i < j; ++i) {
        tmp[i] = tmp[i].v;
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
    return lhs !== undefined ?
        (rhs !== undefined ?
            (lhs < rhs ? -1 : lhs > rhs ? 1 : 0) :
            1) :
        (rhs !== undefined ? -1 : 0);
}
exports.natural = natural;
function inverse(lhs, rhs) {
    return lhs !== undefined ?
        (rhs !== undefined ?
            (lhs < rhs ? 1 : lhs > rhs ? -1 : 0) :
            1) :
        (rhs !== undefined ? -1 : 0);
}
exports.inverse = inverse;
function invert(comparator) {
    return (lhs, rhs) => {
        if (lhs === undefined || rhs === undefined) {
            return comparator(lhs, rhs);
        }
        return -comparator(lhs, rhs);
    };
}
exports.invert = invert;
function byKey(keyExtractor, keyComparator = natural) {
    return (lhs, rhs) => {
        if (lhs === undefined) {
            return rhs === undefined ? 0 : -1;
        }
        return rhs === undefined ? 1 : keyComparator(keyExtractor(lhs), keyExtractor(rhs));
    };
}
exports.byKey = byKey;
function byProp(keySpecifier, comparator) {
    if (keySpecifier.indexOf(".") < 0) {
        return byKey(x => x[keySpecifier], comparator);
    }
    const fields = split(keySpecifier, ".");
    const keyExtractor = (object) => {
        let value = object;
        for (let i = 0, j = fields.length; i < j && value !== undefined; ++i) {
            value = value[fields[i]];
        }
        return value;
    };
    return byKey(keyExtractor, comparator);
}
exports.byProp = byProp;
function combine(...comparators) {
    return (lhs, rhs) => {
        for (let i = 0, j = comparators.length; i < j; ++i) {
            const result = comparators[i](lhs, rhs);
            if (result !== 0) {
                return result;
            }
        }
        return 0;
    };
}
exports.combine = combine;
exports.ignoreCase = byKey(item => item.toLowerCase());
function byThreshold(threshold = 1E-12) {
    threshold = Math.max(0, threshold);
    return (lhs, rhs) => {
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
        return isNaN(rhs) ? (isNaN(lhs) ? 0 : -1) : lhs - rhs < threshold ? 0 : 1;
    };
}
exports.byThreshold = byThreshold;
function equals(comparator = natural) {
    return (lhs, rhs) => comparator(lhs, rhs) === 0;
}
exports.equals = equals;
function equalTo(item, test = natural) {
    return (x) => test(item, x) === 0;
}
exports.equalTo = equalTo;
function within(lower, upper, { comparator = natural, mode = "[]", } = {}) {
    switch (mode) {
        case "[]":
            return item => comparator(lower, item) <= 0 && comparator(item, upper) <= 0;
        case "()":
        case "][":
            return item => comparator(lower, item) < 0 && comparator(item, upper) < 0;
        case "[)":
        case "[[":
            return item => comparator(lower, item) <= 0 && comparator(item, upper) < 0;
        case "(]":
        case "]]":
            return item => comparator(lower, item) < 0 && comparator(item, upper) <= 0;
    }
    throw new Error(`invalid mode ${mode}, must be one of [] () [) (]`);
}
exports.within = within;
