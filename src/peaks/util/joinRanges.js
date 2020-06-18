export function joinRanges(ranges) {
  ranges.sort((a, b) => a.from - b.from);
  for (let i = 0; i < ranges.length - 1; i++) {
    if (ranges[i].to > ranges[i + 1].from) {
      ranges[i].to = ranges[i + 1].to;
      ranges[i].signal = ranges[i].signal.concat(ranges[i + 1].signal);
      ranges[i].integral += ranges[i + 1].integral;
      ranges.splice(i + 1, 1);
    }
  }
  return ranges;
}
