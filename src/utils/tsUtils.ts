export const exhaustiveMatchingGuard = (value: never) => {
  throw new Error("exhaustive matching error");
};

export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
