import correlationData from '../../data/correlations';
import { formatCorrelations } from '../formatCorrelations';
import { getIntegrationOfAttachedProton } from '../getIntegrationOfAttachedProton';

describe('getIntegrationOfAttachedProton', () => {
  const { targets, correlations } = formatCorrelations(correlationData);
  it('simple test', () => {
    const carbonTarget = Object.values(targets.C);
    const expectedResult = [0,0,2];
    for (let i = 0; i < carbonTarget.length; i++) {
      const target = carbonTarget[i];
      const integration = getIntegrationOfAttachedProton(target, correlationData);
      expect(integration).toBe(expectedResult[i])
    }
  });
});
