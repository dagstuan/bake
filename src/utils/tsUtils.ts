export type ArrayElement<T> = T extends Array<infer E> ? E : never;
