// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const exhaustiveMatchingGuard = (_: never) => {
  throw new Error("exhaustive matching error");
};

export function capitalize(str: string | null | undefined): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function unCapitalize(str: string | null | undefined): string {
  if (!str) return "";
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export function isDefined<T>(
  value: T | null | undefined,
): value is NonNullable<T> {
  return value !== null && value !== undefined;
}
