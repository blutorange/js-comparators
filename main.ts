interface Comparator<T> {
    (lhs: T, rhs: T) : number;
}

interface KeyExtractor<S,T> {
    (item: S) : T;
}

/**
 * Compare objects by their id property:
 * <pre>byKey(item => item.id)</pre>
 * <pre>byField("id")</pre>
 * 
 * Compare objects by their data->id property in descending order:
 * <pre>byField("data.id", naturalInverse)</pre>
 * <pre>invert(byField("data.id"))</pre>
 * <pre>byKey(item => - item.data.id)</pre>
 * <pre>byKey(item => item.data.id, naturalInverse)</pre>
 * 
 * Compare objects by their lastName property first, then firstName, then age.
 * <pre>
 *   combine(
 *     byField("lastName"),
 *     byField("firstName"),
 *     byField("age")
 *   )
 * </pre>
 */

/**
 * Natural comparator, ie. by using the &lt; and &gt; operators.
 */
function natural<T>(lhs: T, rhs: T) : number {
    if (lhs < rhs) return -1;
    if (lhs > rhs) return 1;
    return 0;
};

/**
 * Natural comparator in inverse order, ie. by using the &lt; and &gt; operators.
 */
function naturalInverse<T>(lhs: T, rhs: T) : number {
    if (lhs < rhs) return 1;
    if (lhs > rhs) return -1;
    return 0;
};


/**
 * Creates a new comparator that is the inverse of the given compartor.
 * @param {Comparator} comparator - Comparator to invert.
 * @return {Comparator} - Inverted comparator.
 */
function invert<T>(comparator: Comparator<T>) : Comparator<T> {
    return (lhs, rhs) => - comparator(lhs,rhs);
}

/**
 * Compares two objects computing a key for each object.
 * @param keyExtractor - Takes one argument, the object, and returns the key to compare by.
 * @param keyComparator - Compares two keys as extracted by keyExtractor.
 * @return The comparator comparing by key.
 */
function byKey<ITEM,KEY>(
    keyExtractor: KeyExtractor<ITEM,KEY>,
    keyComparator: Comparator<KEY> = natural) : Comparator<ITEM> {
    return (lhs: ITEM, rhs: ITEM) => keyComparator(keyExtractor(lhs), keyExtractor(rhs));
}

/**
 * Compares objects by accessing a property of the objects. For example,
 * to compare objects by their name property, pass "name" as the keySpecifier.
 * To compare objects by the id property of the object's parent property, pass "parent.name".
 * @param keySpecifier - How to access access the field to compare by, eg "name" or "parent.id". 
 * @param comparator - How to compare the fields. Defaults to natural order.
 */
function byField<T>(keySpecifier: string, comparator?: Comparator<any>) : Comparator<T> {
    const fields = keySpecifier.split(".");
    const keyExtractor = (object:T) => fields.reduce((obj, field) => obj[field], object);
    return byKey(keyExtractor, comparator);
}

function access<T,K extends keyof T>(object: T, key: K) : T[K] {
    return object[key];
}

/**
 * Compare by multiple criteria. If the first comparator
 * deems two objects equals, the second iterator is used.
 * If it deems the two objects equal as well, the third
 * iterator is used etc. The two objects are equal iff
 * all comparators deem them equal.
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
    natural,
    naturalInverse,
    invert,
    byKey,
    byField,
    combine
};