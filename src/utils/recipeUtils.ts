export const formatAmount = (
  amount: number | null | undefined,
  decimals: number = 2,
  defaultValue: string = "0",
): string =>
  amount ? `${parseFloat(amount.toFixed(decimals))}` : defaultValue;
