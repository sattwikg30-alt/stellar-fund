/**
 * Shortens a Stellar address for display (e.g., GABC...XYZ)
 */
export const shortenAddress = (address: string): string => {
  if (!address) return "";
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

/**
 * Formats XLM amounts with consistent decimals
 */
export const formatXLM = (amount: number | bigint): string => {
  const num = typeof amount === "bigint" ? Number(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
};
