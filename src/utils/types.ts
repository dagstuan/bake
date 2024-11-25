export type ArrayElement<T> = T extends (infer E)[] ? E : never;

export type OmitStrict<ObjectType, KeysType extends keyof ObjectType> = Pick<
  ObjectType,
  Exclude<keyof ObjectType, KeysType>
>;

export type Nullable<T> = T | null | undefined;
