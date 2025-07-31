export type Empty = undefined | null | void | never;
export type IsEmptyUnion<T> =
    T extends Empty
    ? Exclude<T, Empty> extends never
    ? true
    : false
    : false;
export type NonEmptyUnion<T> = Exclude<T, Empty>;
export type UseDefault<T, D> = NonNullable<IsEmptyUnion<T> extends true ? D : T>;
export type UnionToIntersection<U> =
    (U extends any ? (k: U) => void : never) extends (k: infer I) => void
    ? I
    : never;