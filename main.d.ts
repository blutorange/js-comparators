export declare type Predicate<T> = (item: T) => boolean;
export declare type Equator<T> = (lhs: T, rhs: T) => boolean;
export declare type Comparator<T> = (lhs: T, rhs: T) => number;
export declare type KeyExtractor<T, K> = (item: T) => K;
export interface Comparable<T> {
    compareTo(rhs: T): number;
}
export declare function comparable<T extends Comparable<T>>(lhs: T, rhs: T): number;
export declare function natural<T>(lhs: T, rhs: T): number;
export declare function inverse<T>(lhs: T, rhs: T): number;
export declare function invert<T>(comparator: Comparator<T>): Comparator<T>;
export declare function byKey<T, K>(keyExtractor: KeyExtractor<T, K>, keyComparator?: Comparator<K>): Comparator<T>;
export declare function byProp<T>(keySpecifier: string, comparator?: Comparator<any>): Comparator<T>;
export declare function combine<T>(...comparators: Comparator<T>[]): Comparator<T>;
export declare const ignoreCase: Comparator<string>;
export declare function byThreshold(threshold?: number): Comparator<number>;
export declare function equals<T>(comparator?: Comparator<T>): Equator<T>;
export declare function equalTo<T>(item: T, test?: Comparator<T>): Predicate<T>;
export declare function within<T>(lower: T, upper: T, {comparator, mode}?: {
    comparator?: Comparator<T>;
    mode?: "[]" | "()" | "[)" | "(]" | "[[" | "]]" | "][";
}): Predicate<T>;
