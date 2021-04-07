export function splitPatterns(multiplet) {
  let result = multiplet.match(
    / *(quint|hex|sept|hept|oct|nona|non|s|d|t|q|h|o|n) */g,
  );
  if (result) result = result.map((entry) => entry.trim());
  return result;
}
