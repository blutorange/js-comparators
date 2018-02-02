interface Comparator<T> {
    (lhs: T, rhs: T): number;
}
interface KeyExtractor<T, K> {
    (item: T): K;
}
declare function natural<T>(lhs: T, rhs: T): number;
declare function naturalInverse<T>(lhs: T, rhs: T): number;
declare function invert<T>(comparator: Comparator<T>): Comparator<T>;
declare function byKey<T, K>(keyExtractor: KeyExtractor<T, K>, keyComparator?: Comparator<K>): Comparator<T>;
declare function byField<T>(keySpecifier: string, comparator?: Comparator<any>): Comparator<T>;
declare function combine<T>(...comparators: Comparator<T>[]): Comparator<T>;
export { Comparator, KeyExtractor, natural, naturalInverse, invert, byKey, byField, combine };
