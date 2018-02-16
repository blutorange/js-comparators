export interface Predicate<T> {
    (item: T) : boolean; 
}

export interface Equator<T> {
    (lhs: T, rhs: T) : boolean; 
}

/**
 * A comparator that takes two objects and compares them.
 * 
 * ```javascript
 * const myComparator = (lhs, rhs) => lhs < rhs ? -1 : lhs > rhs ? 1 : 0;
 * [3, 2, 1].sort(myComparator);
 * // => [1, 2, 3]
 * ```
 * 
 * @typeparam T Type of the objects to compare.
 */
export interface Comparator<T> {
    /**
      * @param lhs The first (left-hand side) object to compare.
      * @param rhs The second (right-hand side) object to compare.
      * @return A negative number iff lhs is strictly smaller than rhs, a positive number iff lhs is strictly greate than rhs; or 0 otherwise, when both objects are equal.
      */
    (lhs: T, rhs: T) : number;
}

/**
 * Extracts a key from an object used for comparing the object to other objects.
 * 
 * ```javascript
 * const idExtractor = customer => customer.id;
 * ```
 * 
 * @typeparam T Type of the objects to compare.
 * @typeparam K The type of the extracted key.
 */
export interface KeyExtractor<T,K> {
    /**
      * @param object Object to extract a key from.
      * @return The key for the object.
      */ 
    (item: T) : K;
}

/**
 * An interface for comparable objects of the same type.
 * They are compared via a special method 'compareTo'.
 * @typeparam T Type of the objects to compare.
 * 
 * ```typescript
 * class Vector implements Comparable<Vector> {
 *   constructor(private x: number, private y: number) {}
 *   add(vector: Vector) :number {
 *     return new Vector(this.x + vector.x, this.y + vectory.y)
 *   }
 *   abs2() : number {
 *     return this.x*this.x + this.y*this.y;
 *   }
 *   abs() : number {
 *     return Math.sqrt(this.x*this.x + this.y*this.y);
 *   }
 *   compareTo(vector: Vector) {
 *     return this.abs2() - vector.abs2();
 *   }
 * }
 * ```
 */
export interface Comparable<T> {
    compareTo(rhs: T) : number;
}

/**
 * Comparator for comparable objects, ie. by using their 'compareTo' method.
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
export function comparable<T extends Comparable<T>>(lhs: T, rhs: T) : number {
    return lhs.compareTo(rhs);
}

/**
 * Natural comparator, ie. by using the &lt; and &gt; operators.
 * 
 * ```javascript
 * [9,8,7,6,5,4,3,2,1,0].sort(natural)
 * // => [0,1,2,3,4,5,6,7,8,9]
 * ```
 * 
 * @typeparam T Type of the objects to compare.
 */
export function natural<T>(lhs: T, rhs: T) : number {
    if (lhs < rhs) return -1;
    if (lhs > rhs) return 1;
    return 0;
};

/**
 * Natural comparator in inverse order, ie. by using the &lt; and &gt; operators.
 * 
 * ```javascript
 * [0,1,2,3,4,5,6,7,8,9].sort(inverse)
 * // => [9,8,7,6,5,4,3,2,1,0]
 * ```
 * 
 * @typeparam T Type of the objects to compare.
 */
export function inverse<T>(lhs: T, rhs: T) : number {
    if (lhs < rhs) return 1;
    if (lhs > rhs) return -1;
    return 0;
};

/**
 * Creates a new comparator that is the inverse of the given compartor.
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
export function invert<T>(comparator: Comparator<T>) : Comparator<T> {
    return (lhs, rhs) => - comparator(lhs,rhs);
}

/**
 * Compares two objects by computing a key for each object, and the
 * comparing these keys against each other.
 * 
 * ```javascript
 * const games = [
 *   { title: "Bus adventure", reviews: { ign: 8}, { USGamer: 7} }
 *   { title: "jump kicking", reviews: { ign: 4}, { USGamer: 6} }
 *   { title:" "The abyss 6", reviews: { ign: 7}, { USGamer: 9} }
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
 *
 * 
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
 * @param keyComparator - Compares the two keys extracted by keyExtractor. Default to the natural order, eg. by using &lt; and &gt;.
 * @return The comparator comparing by key.
 */
export function byKey<T,K>(
    keyExtractor: KeyExtractor<T,K>,
    keyComparator: Comparator<K> = natural) : Comparator<T> {
    return (lhs: T, rhs: T) => keyComparator(keyExtractor(lhs), keyExtractor(rhs));
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
export function byProp<T>(keySpecifier: string, comparator?: Comparator<any>) : Comparator<T> {
    const fields = keySpecifier.indexOf("\\.") >= 0 ? split(keySpecifier, '.') : keySpecifier.split('.');
    const keyExtractor = (object:T) => fields.reduce((obj:{[s:string]:any}, field) => obj[field], object);
    return byKey(keyExtractor, comparator);
}

function split(string: string, by: string) : string[] {
    const result : string[] = [];
    let buffer : string[] = [];
    for (let i = 0, j = string.length; i < j ; ++i) {
        const c = string[i];
        if (c === '\\') {
            buffer.push(string[++i]);
        }
        else if (c === by) {
            if (buffer.length > 0) {
                result.push(buffer.join(''));
                buffer = [];
            }
        }
        else {
            buffer.push(c);
        }
    }
    if (buffer.length > 0) {
        result.push(buffer.join(''));
    }
    return result;
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
 * data.sort(combine(byProp("foo"), byProp("bar")))
 * // => [ {country: "Japan", city: "Kyoto"}, {country: "Japan", city: "Tokyo"} ]
 * ```
 * 
 * @typeparam T Type of the objects to compare.
 * @param comparators - List of comparators to compare by.
 * @return The combined comparator.
 */
export function combine<T>(...comparators: Comparator<T>[]): Comparator<T> {
    return (lhs: T, rhs: T) => {
        for (let comparator of comparators) {
            const result = comparator(lhs, rhs);
            if (result !== 0) {
                return result;
            }
        }
        return 0;
    };
};

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
export const ignoreCase : Comparator<string> = byKey<string, string>(item => item.toLowerCase());

/**
 * Compares two numbers with a treshold. If the difference
 * between two numbers is smaller than the treshold, they
 * compare as equal.
 * 
 * ```javascript
 * [2, 3, 0, Infinity, -Infinity, NaN, -9].sort(byThreshold(0.5))
 * // => [ -Infinity, -9, 0, 2, 3, Infinity, NaN ]
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
 * @param threshold Threshold for checking equality between two numbers. Defaults to 1E-12.
 */
export function byThreshold(threshold: number = 1E-12) : Comparator<number> {
    threshold = Math.max(0, threshold);
    return (lhs: number, rhs: number) : number => {
        if (lhs === rhs) return 0;
        if (lhs < rhs) return rhs - lhs < threshold ? 0 : -1;
        return isNaN(rhs) ? -1 : lhs - rhs < threshold ? 0 : 1
    };
};

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
export function equals<T>(comparator: Comparator<T> = natural) : Equator<T> {
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
export function equalTo<T>(item: T, test: Comparator<T> = natural) : Predicate<T> {    
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
 * @param comparator Comparator for comparing items.
 * @param lower Lower bound.
 * @param upper Upper bound.
 * @param mode Whether to include the left and right hand side. Must be one of [] () [) (]. Defaults to [].
 */
export function within<T>(lower: T, upper: T, comparator: Comparator<T> = natural, mode: "[]"|"()"|"[)"|"(]" = "[]") : Predicate<T> {
    switch (mode) {
        case "[]": return item => comparator(lower, item) <= 0 && comparator(item, upper) <= 0;
        case "[)": return item => comparator(lower, item) <= 0 && comparator(item, upper) < 0;
        case "(]": return item => comparator(lower, item) < 0 && comparator(item, upper) <= 0;
        case "()": return item => comparator(lower, item) < 0 && comparator(item, upper) < 0;
    } 
    throw new Error(`invalid mode ${mode}, must be one of [] () [) (]`);
}