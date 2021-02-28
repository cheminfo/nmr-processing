export function signalsToRanges(signals, options = {}) {
  const { tolerance = 0.05, frequency = 400 } = options;
  let wrapped = signals.map((signal) => ({
    original: signal,
  }));
  wrapped.forEach((signal) => {
    let halfWidth =
      (signal.original.j || []).reduce(
        (total, j) => (total += j.coupling / frequency),
        0,
      ) /
        2 +
      tolerance;
    signal.from = signal.original.delta - halfWidth;
    signal.to = signal.original.delta + halfWidth;
  });
  wrapped = wrapped.sort((signal1, signal2) => signal1.from - signal2.from);
  let ranges = [];
  let range = {};
  for (let signal of wrapped) {
    if (range.from === undefined || signal.from > range.to) {
      range = {
        from: signal.from,
        to: signal.to,
        integral: signal.original.nbAtoms,
        signal: [signal.original],
      };
      ranges.push(range);
    } else {
      range.integral += signal.original.nbAtoms;
      if (signal.to > range.to) range.to = signal.to;
      range.signal.push(signal.original);
    }
  }
  return ranges;
}
