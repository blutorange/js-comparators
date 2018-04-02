import {
    Comparable,
    Comparator,
    Equator,
    KeyExtractor,
    Maybe,
    Predicate,
} from "andross";

const UNDEF = {};

function split(toSplit: string, by: string): string[] {
    const result: string[] = [];
    let buffer: string[] = [];
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

/**
 * A wrapper for the built-in sort function that respects the comparator even
 * if any item is `undefined`.
 *
 * ```javascript
 * // Comparator "natural" sorts undefind before any other value.
 * // But the built-in function always puts undefined last.
 * [1,2,undefined,3].sort(natural);
 * // => [1,2,3,undefined]
 *
 * sort([1,2,undefined,3], natural)
 * // => [undefined, 1, 2, 3]
 * ```
 *
 * @typeparam T Type of the items to be sorted.
 * @param items Array to sort.
 * @param comparator Comparator to use for the comparison.
 */
export function sort<T>(items: T[], comparator: Comparator<T> = natural): void {
    const tmp: any[] = items;
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

/**
 * Similar to {@link sort}, but additionally ensures that the sort is stable, ie.
 * that items that are equal retain their relative position in the array.
 * @typeparam T Type of the items to be sorted.
 * @param items Array to sort.
 * @param comparator Comparator to use for the comparison.
 * @see {@link sort}
 */
export function sortStable<T>(items: T[], comparator: Comparator<T> = natural): void {
    const tmp: any[] = items;
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

/**
 * Similar to {@link sort}, but allows specifying a custom key extractor. This also
 * caches the key and should be used when extracting the key is computationally
 * expensive.
 * @typeparam T Type of the items to be sorted.
 * @param items Array to sort.
 * @param keyExtractor Extracts the key to be used for comparing the items.
 * @param comparator Comparator to use for comparing the keys.
 * @see {@link sort}
 */
export function sortBy<T, K>(items: T[], keyExtractor: KeyExtractor<T, K>, comparator: Comparator<K> = natural): void {
    const tmp: any[] = items;
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

/**
 * Similar to {@link sortBy}, but allows specifying a custom key extractor.
 * @typeparam T Type of the items to be sorted.
 * @param items Array to sort.
 * @param keyExtractor Extracts the key to be used for comparing the items.
 * @param comparator Comparator to use for comparing the keys.
 * @see {@link sort}
 */
export function sortStableBy<T, K>(
        items: T[], keyExtractor: KeyExtractor<T, K>,
        comparator: Comparator<K> = natural): void {
    const tmp: any[] = items;
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

/**
 * Comparator for comparable objects, ie. by using their 'compareTo' method.
 * `undefined` gets sorted before any other value.
 *
 * ```typescript
 * class Vector implements Comparable<Vector> {
 *    // ...
 *   compareTo(vector: Vector) {
 *     return this.abs2() - vector.abs2();
 *   }
 * }
 * ```
 *
 * ```javascript
 * // sort vectors by their length
 * [new Vector(5,12), new Vector(3,4)].sort(comparable)
 * // => [new Vector(3,4), new Vector(5,12)]
 * ```
 *
 * @typeparam T Type of the objects to compare.
 */
export function comparable<T extends Comparable<T>>(lhs: Maybe<T>, rhs: Maybe<T>): number {
    if (lhs === undefined) {
        return rhs === undefined ? 0 : -1;
    }
    return rhs === undefined ? 1 : lhs.compareTo(rhs);
}

/**
 * Natural comparator, ie. by using the &lt; and &gt; operators.
 * `undefined` gets sorted before any other value.
 *
 * ```javascript
 * [9,8,7,6,5,4,3,2,1,0].sort(natural)
 * // => [0,1,2,3,4,5,6,7,8,9]
 * ```
 *
 * @typeparam T Type of the objects to compare.
 */
export function natural<T>(lhs: Maybe<T>, rhs: Maybe<T>): number {
    return lhs !== undefined ?
        (rhs !== undefined ?
            (lhs < rhs ? -1 : lhs > rhs ? 1 : 0) :
            1
        ) :
        (rhs !== undefined ? -1 : 0);
}

/**
 * Natural comparator in inverse order, ie. by using the &lt; and &gt; operators.
 * `undefined` gets sorted before any other value.
 *
 * ```javascript
 * [0,1,2,3,4,5,6,7,8,9].sort(inverse)
 * // => [9,8,7,6,5,4,3,2,1,0]
 * ```
 *
 * @typeparam T Type of the objects to compare.
 */
export function inverse<T>(lhs: Maybe<T>, rhs: Maybe<T>): number {
    return lhs !== undefined ?
        (rhs !== undefined ?
            (lhs < rhs ? 1 : lhs > rhs ? -1 : 0) :
            1
        ) :
        (rhs !== undefined ? -1 : 0);
}

/**
 * Creates a new comparator that is the inverse of the given compartor.
 * `undefined` gets sorted before any other value.
 *
 * ```javascript
 * // Sort objects by their foo property in reverse order.
 *
 * const people = [ {name: "Bob"}, {name: "Zoe"}]
 *
 * people.sort(invert(byProp("name"))
 *
 * // => [ {name: "Zoe"}, {name: "Bob"}]
 * ```
 *
 * @typeparam T Type of the objects to compare.
 * @param {Comparator} comparator - Comparator to invert.
 * @return {Comparator} - Inverted comparator.
 */
export function invert<T>(comparator: Comparator<T>): Comparator<T> {
    return (lhs, rhs) => {
        if (lhs === undefined || rhs === undefined) {
            return comparator(lhs, rhs);
        }
        return -comparator(lhs, rhs);
    };
}

/**
 * Compares two objects by computing a key for each object, and the
 * comparing these keys against each other.
 * `undefined` gets sorted before any other value.
 *
 * ```javascript
 * const games = [
 *   { title: "Bus adventure", reviews: { ign: 8, USGamer: 7} },
 *   { title: "jump kicking", reviews: { ign: 4, USGamer: 6} },
 *   { title: "The abyss 6", reviews: { ign: 7}, USGamer: 9} }
 * ]
 *
 * const byRating = byKey(game => game.reviews.ign + game.reviews.USGamer);
 *
 * // sort games by their combined rating
 * games.sort(byRating)
 * // => "jump kicking", "Bus adventure", "The abyss 6"
 *
 * // sort games by their combined rating, inverse order
 * games.sort(inverse(byRating))
 * // => "The abyss 6", "Bus adventure", "jump kicking"
 *
 * // sort games by their name, ignoring case
 * games.sort(byRating, byKey(game => game.title, ignoreCase))
 * // => "Bus adventure", "jump kicking", "The abyss 6"
 * ```
 *
 * Use it to group notebook by their sceen type:
 *
 * ```javascript
 * const notebooks = [
 *   {name: "Mason 42-1", screen: "LED"}
 *   {name: "Lolipop 4", screen: "PLASMA"},
 *   {name: "Zimbabwe AXR", screen: "OLED"},
 *   {name: "Powerlancer 4K", screen: "OLED"},
 *   {name: "Clay HiPx 9", screen: "PLASMA"},
 *   {name: "Officestation KX-72-3", screen: "LED"}
 * ]
 *
 * // index notebooks by screen
 * import { Methods } from "elbe";
 * Methods.group(notebooks, byKey("screen"))
 * // => {LED: [...], PLASMA: [...], OLED: [...]}
 * ```
 *
 * @typeparam T Type of the objects to compare.
 * @typeparam K Type of the key produces by the given key extractor.
 * @param keyExtractor - Takes one argument, the object, and returns the key to compare by.
 * @param keyComparator - Compares the two keys extracted by keyExtractor. Default to the
 * natural order, eg. by using &lt; and &gt;.
 * @return The comparator comparing by key.
 */
export function byKey<T, K>(
        keyExtractor: KeyExtractor<T, K>,
        keyComparator: Comparator<K> = natural,
): Comparator<Maybe<T>> {
    return (lhs: Maybe<T>, rhs: Maybe<T>) => {
        if (lhs === undefined) {
            return rhs === undefined ? 0 : -1;
        }
        return rhs === undefined ? 1 : keyComparator(keyExtractor(lhs), keyExtractor(rhs));
    };
}

/**
 * Compares objects by accessing a property of the objects. For example,
 * to compare objects by their name property, use "name" as the keySpecifier.
 * Use a dot to compare by a nested property, eg. to compare objects by the id
 * property of the object's parent property, use "parent.name".
 *
 * ```javascript
 * // sorts books by their isbn property
 * const books = [ { isbn: "2454396543965" }, { isbn: "2147865437664" } ]
 * books.sort(byProp("isbn"))
 * // => [ { isbn: "2147865437664" }, { isbn: "2454396543965" } ]
 *
 * // sort kids by their parent -> name property
 * const kids = [ { parent: { name: "Sam"} }, { parent: {name: "Carly"} } ];
 * kids.sort(byProp("parent.name"))
 * // => [ { parent: { name: "Carly"} }, { parent: {name: "Sam"} } ]
 *
 * // sort employees by their 'department.manager' property
 * const employees = [ { "department.manager": "Joe" }, { "department.manager": "Amy"} ]
 * employees.sort(byProp("department\\.manager"))
 * // => [ { "department.manager": "Amy" }, { "department.manager": "Joe"} ]
 *
 * // sort chairs by their material, case-insensitive
 * const chairs = [ {material: "Wood"}, {material: "plastic"} ]
 * chairs.sort(byProp("material", ignoreCase))
 * // => [ {material: "plastic"}, {material: "Wood"} ]
 * ```
 *
 * @typeparam T Type of the objects to compare.
 * @param keySpecifier - How to access access the property to compare by, eg "name", "parent.id".
 * @param comparator - How to compare the fields. Defaults to natural order.
 */
export function byProp<T>(keySpecifier: string, comparator?: Comparator<any>): Comparator<Maybe<T>> {
    if (keySpecifier.indexOf(".") < 0) {
        return byKey(x => (x as any)[keySpecifier], comparator);
    }
    const fields = split(keySpecifier, ".");
    const keyExtractor: KeyExtractor<T, Maybe<any>> = (object: T) => {
        let value: Maybe<any> = object;
        for (let i = 0, j = fields.length; i < j && value !== undefined; ++i) {
            value = value[fields[i]];
        }
        return value;
    };
    return byKey(keyExtractor, comparator);
}

/**
 * Compare by multiple criteria. If the first comparator
 * deems two objects equals, the second iterator is used.
 * If it deems the two objects equal as well, the third
 * iterator is used etc. The two objects are equal iff
 * all comparators deem them equal.
 *
 * ```javascript
 * const data = [ {country: "Japan", city: "Tokyo"}, {country: "Japan", city: "Kyoto"} ]
 *
 * data.sort(combine(byProp("country"), byProp("city")))
 * // => [ {country: "Japan", city: "Kyoto"}, {country: "Japan", city: "Tokyo"} ]
 * ```
 *
 * @typeparam T Type of the objects to compare.
 * @param comparators - List of comparators to compare by.
 * @return The combined comparator.
 */
export function combine<T>(...comparators: Comparator<T>[]): Comparator<T> {
    return (lhs: T, rhs: T) => {
        for (let i = 0, j = comparators.length; i < j; ++i) {
            const result = comparators[i](lhs, rhs);
            if (result !== 0) {
                return result;
            }
        }
        return 0;
    };
}

/**
 * A comparator for comparing strings without regards to case.
 *
 * ```javascript
 * // capitals come before lower-case letters
 * ["Dave", "eve", "Eve", "dave"].sort()
 * // => ["Dave", "Eve", "dave", "eve"]
 *
 * // case-insensitive sort
 * // equal names have no order
 * ["Dave", "eve", "Eve", "dave"].sort(ignoreCase)
 * // => ["Dave", "dave", "eve", "Eve"]
 *
 * // case-insensitive sort
 * // if two names are equal, list lower-case first
 * ["Dave", "eve", "Eve", "dave"].sort(combine(ignoreCase, inverse))
 * // => ["dave", "Dave", "eve", "Eve"]
 * ```
 */
export const ignoreCase: Comparator<Maybe<string>> = byKey<string, string>(item => item.toLowerCase());

/**
 * Compares two numbers with a treshold. If the difference
 * between two numbers is smaller than the treshold, they
 * compare as equal. `undefined` is sorted before any other
 * value. `NaN` is sorted after any other value.
 *
 * ```javascript
 * [2, 3, 0, Infinity, undefined, -Infinity, NaN, NaN, -9].sort(byThreshold(0.5))
 * // => [ undefined, -Infinity, -9, 0, 2, 3, Infinity, NaN, NaN ]
 *
 * const animals = [
 *   { name: "alligator", lifeExpectancy: 68},
 *   { name: "turtle", lifeExpectancy: 123}
 *   { name: "ant", lifeExpectancy: 0.5}
 *   { name: "elephant", lifeExpectancy: 70}
 *   { name: "beaver", lifeExpectancy: 20}
 *   { name: "bee", lifeExpectancy: 1}
 *   { name: "swan", lifeExpectancy: 10}
 *   { name: "leopard", lifeExpectancy: 17}
 *   { name: "mosquitofish", lifeExpectancy: 2}
 * ]
 *
 * data.filter(equalTo(byTreshold(0.5), 1))
 * // => "ant", "bee"
 *
 * data.filter(equalTo(byTreshold(10), 70))
 * // => "alligator", "elephant"
 * ```
 *
 * This comparator is not transitive and should not be used
 * for sorting items:
 *
 * ```javascript
 * const comparator = byThreshold(0.5);
 *
 * comparator(0, 0.3) // => 0
 * comparator(0.3, 0.6) // => 0
 * comparator(0, 0.6) // => -1
 *
 * [0.6, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7].sort(comparator)
 * // => [ 0, 0.1, 0.6, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7 ]
 * // The exact order may be dependent on the implementation.
 * ```
 *
 * @param threshold Threshold for checking equality between two numbers. Defaults to 1E-12.
 */
export function byThreshold(threshold: number = 1E-12): Comparator<Maybe<number>> {
    threshold = Math.max(0, threshold);
    return (lhs: Maybe<number>, rhs: Maybe<number>): number => {
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

/**
 * Transforms a comparator into an Equator, ie. into
 * a function return true if its two arguments are equal.
 *
 * ```javascript
 * const cars = [
 *   {maker: "Opal"}
 *   {maker: "Marzipan"},
 *   {maker: "Opal"},
 * ]
 *
 * const sameMaker = equals(byKey("maker"))
 * sameScreen(cars[0], cars[1]) // = false
 * sameScreen(cars[0], cars[2]) // = true
 * ```
 *
 * @typeparam T Type of the objects to compare.
 * @param comparator Comparator for checking equality between two items.
 * @return An equator returning true for two items iff the given comparator considers them equal.
 */
export function equals<T>(comparator: Comparator<T> = natural): Equator<T> {
    return (lhs: T, rhs: T) => comparator(lhs, rhs) === 0;
}

/**
 * Transforms a comparator or Equator into a predicate for
 * testing whether an items equals the given argument.
 *
 * ```javascript
 * const notebooks = [
 *   {name: "Mason 42-1", screen: "LED"}
 *   {name: "Lolipop 4", screen: "PLASMA"},
 *   {name: "Zimbabwe AXR", screen: "OLED"},
 *   {name: "Powerlancer 4K", screen: "OLED"},
 *   {name: "Clay HiPx 9", screen: "PLASMA"},
 *   {name: "Officestation KX-72-3", screen: "LED"}
 * ]
 *
 * // get notebooks with OLED screen
 * notebooks.filter(equalTo("OLED", byKey("screen")))
 * // => "Zimbabwe AXR", "Powerlancer 4K"
 *
 * ```
 *
 * @typeparam T Type of the objects to compare.
 * @param comparator Comparator for checking equality between two items.
 * @return A predicate that returns true iff it is passed a value equal to the given item.
 */
export function equalTo<T>(item: T, test: Comparator<T> = natural): Predicate<T> {
    return (x: T) => test(item, x) === 0;
}

/**
 * Creates a predicate that checks whether it is passed a value between
 * the given lower and upper bounds. Whether the predicate returns true
 * for the lower and upper bounds is controlled by the given mode:
 *
 * * [] Includes the lower and upper bound.
 * * () Excluded the lower and upper bound.
 * * [) Includes the lower bound and exclude the upper bound.
 * * (] Excludes the lower bound and includes the upper bound.
 *
 * ```javascript
 * const foods = [
 *     {name: "fish & chips", bestBefore: new Date(2002, 05, 09)}
 *     {name: "chocolate", bestBefore: new Date(2006, 01, 04)}
 *     {name: "strawberry cake", bestBefore: new Date(2002, 05, 08)}
 *     {name: "bottled tomatoes", bestBefore: new Date(2005, 11, 26)}
 *     {name: "onion bread", bestBefore: new Date(2002, 05, 10)}
 * ]
 *
 * // foods I should not eat
 * foods.filter(within(new Date(2010), new Date(2015,05,08), byKey("bestBefore"))
 * // => "strawberry cake"
 *
 * // foods I should eat soon
 * foods.filter(within(new Date(2015, 05, 09), new Date(2015,05,10), byKey("bestBefore"))
 * // "fish & chips", "onion bread"
 *
 * // all foods I could eat
 * foods.filter(within(new Date(2015, 05, 09), new Date(2015,05,10), byKey("bestBefore"))
 * // "fish & chips", "chocolate", "bottled tomatoes", "onion bread"
 * ```
 *
 * @typeparam T Type of the objects to compare.
 * @param lower Lower bound.
 * @param upper Upper bound.
 * @param comparator Comparator for comparing items. Defaults to the natural comparator.
 * @param mode Whether to include the left and right hand side. Must be one of [] () [) (].
 * Defaults to []. Also allows the notation ][ for (), [[ for [), and ]] for (].
 */
export function within<T>(lower: T, upper: T, {
        comparator = natural,
        mode = "[]",
    }: {
        comparator?: Comparator<T>,
        mode?: "[]" | "()" | "[)" | "(]" | "[[" | "]]" | "][",
    } = {}): Predicate<T> {
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
