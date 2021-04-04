export function splitPatterns(multiplet) {
  return multiplet
    .split(/(quint|hex|sept|hept|oct|nona|non|s|d|t|q|h|o|n)/)
    .filter((entry) => entry);
}
