import { Comparable, Comparator, Equator, KeyExtractor, Maybe, Predicate } from "andross";
export declare function comparable<T extends Comparable<T>>(lhs: Maybe<T>, rhs: Maybe<T>): number;
export declare function natural<T>(lhs: Maybe<T>, rhs: Maybe<T>): number;
export declare function inverse<T>(lhs: Maybe<T>, rhs: Maybe<T>): number;
export declare function invert<T>(comparator: Comparator<Maybe<T>>): Comparator<Maybe<T>>;
export declare function byKey<T, K>(keyExtractor: KeyExtractor<T, Maybe<K>>, keyComparator?: Comparator<Maybe<K>>): Comparator<Maybe<T>>;
export declare function byProp<T>(keySpecifier: string, comparator?: Comparator<Maybe<any>>): Comparator<Maybe<T>>;
export declare function combine<T>(...comparators: Comparator<Maybe<T>>[]): Comparator<Maybe<T>>;
export declare const ignoreCase: Comparator<Maybe<string>>;
export declare function byThreshold(threshold?: number): Comparator<Maybe<number>>;
export declare function equals<T>(comparator?: Comparator<Maybe<T>>): Equator<Maybe<T>>;
export declare function equalTo<T>(item: Maybe<T>, test?: Comparator<Maybe<T>>): Predicate<Maybe<T>>;
export declare function within<T>(lower: T, upper: T, {comparator, mode}?: {
    comparator?: Comparator<Maybe<T>>;
    mode?: "[]" | "()" | "[)" | "(]" | "[[" | "]]" | "][";
}): Predicate<Maybe<T>>;
