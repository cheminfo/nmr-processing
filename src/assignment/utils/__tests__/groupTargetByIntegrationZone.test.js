import groupTargetByIntegrationZone from '../groupTargetByIntegrationZone';

const targets = {
  c5: {
    attachment: {},
  },
  c1: {
    attachment: {
      H: [8, 7],
    },
  },
  c3: {
    attachment: {
      H: [2, 3],
    },
  },
  c4: {
    attachment: {},
  },

  c2: {
    attachment: {
      H: [7],
    },
  },
};

const activeDomainOnTarget = Object.keys(targets);

describe('group targets by integration', () => {
  it('simple test', () => {
    const result = groupTargetByIntegrationZone(activeDomainOnTarget, targets);
    expect(result).toStrictEqual([['c5'], ['c1', 'c2'], ['c3'], ['c4']]);
  });
});
