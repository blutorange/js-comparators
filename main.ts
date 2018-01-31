/**
 * A comparator that takes two objects and compares them.
 * @typeparam T Type of the objects to compare.
 */
interface Comparator<T> {
    /**
      * @param lhs The first (left-hand side) object to compare.
      * @param rhs The second (right-hand side) object to compare.
      * @return A negative number iff lhs is strictly smaller than rhs, a positive number iff lhs is strictly greate than rhs; or 0 otherwise, when both objects are equal.
      */
    (lhs: T, rhs: T) : number;
}

/**
 * Extracts a key from an object used for comparing the object to other objects.
 * @typeparam T Type of the objects to compare.
 * @typeparam K The type of the extracted key.
 */
interface KeyExtractor<T,K> {
    /**
      * @param object Object to extract a key from.
      * @return The key for the object.
      */ 
    (item: T) : K;
}

/**
 * Natural comparator, ie. by using the &lt; and &gt; operators.
 * @typeparam T Type of the objects to compare.
 */
function natural<T>(lhs: T, rhs: T) : number {
    if (lhs < rhs) return -1;
    if (lhs > rhs) return 1;
    return 0;
};

/**
 * Natural comparator in inverse order, ie. by using the &lt; and &gt; operators.
 * @typeparam T Type of the objects to compare.
 */
function naturalInverse<T>(lhs: T, rhs: T) : number {
    if (lhs < rhs) return 1;
    if (lhs > rhs) return -1;
    return 0;
};


/**
 * Creates a new comparator that is the inverse of the given compartor.
 * @typeparam T Type of the objects to compare.
 * @param {Comparator} comparator - Comparator to invert.
 * @return {Comparator} - Inverted comparator.
 */
function invert<T>(comparator: Comparator<T>) : Comparator<T> {
    return (lhs, rhs) => - comparator(lhs,rhs);
}

/**
 * Compares two objects computing a key for each object.
 * @typeparam T Type of the objects to compare.
 * @typeparam K Type of the key produces by the given key extractor.
 * @param keyExtractor - Takes one argument, the object, and returns the key to compare by.
 * @param keyComparator - Compares two keys as extracted by keyExtractor.
 * @return The comparator comparing by key.
 */
function byKey<T,K>(
    keyExtractor: KeyExtractor<T,K>,
    keyComparator: Comparator<K> = natural) : Comparator<T> {
    return (lhs: T, rhs: T) => keyComparator(keyExtractor(lhs), keyExtractor(rhs));
}

/**
 * Compares objects by accessing a property of the objects. For example,
 * to compare objects by their name property, pass "name" as the keySpecifier.
 * To compare objects by the id property of the object's parent property, pass "parent.name".
 * @typeparam T Type of the objects to compare.
 * @param keySpecifier - How to access access the field to compare by, eg "name" or "parent.id". 
 * @param comparator - How to compare the fields. Defaults to natural order.
 */
function byField<T>(keySpecifier: string, comparator?: Comparator<any>) : Comparator<T> {
    const fields = keySpecifier.split(".");
    const keyExtractor = (object:T) => fields.reduce((obj, field) => obj[field], object);
    return byKey(keyExtractor, comparator);
}

/**
 * Compare by multiple criteria. If the first comparator
 * deems two objects equals, the second iterator is used.
 * If it deems the two objects equal as well, the third
 * iterator is used etc. The two objects are equal iff
 * all comparators deem them equal.
 * @typeparam T Type of the objects to compare.
 * @param comparators - Comparators to compare by.
 * @return The combined comparator.
 */
function combine<T>(...comparators: Comparator<T>[]): Comparator<T> {
    return (lhs: T, rhs: T) => {
        for (let comparator of comparators) {
            const result = comparator(lhs, rhs);
            if (result !== 0) {
                return result;
            }
        }
        return 0;
    };
}

export {
    Comparator,
    KeyExtractor,
    natural,
    naturalInverse,
    invert,
    byKey,
    byField,
    combine
};
