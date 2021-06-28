import { getIntegrationOfAttachedProton } from './getIntegrationOfAttachedProton';

export function formatCorrelations(correlations) {
  //add indirect links, if a carbon C1 is attached to a proton H1 that correlating
  //with carbon C2, so the carbon C1 and C2 are also correlating
  for (let i = 0; i < correlations.length; i++) {
    if (!correlations[i].match) continue;
    let indirectLinks = {};
    for (let match of correlations[i].match) {
      const links = correlations[match].link;
      for (let link of links) {
        indirectLinks[link.signal.id] = link;
      }
    }
    correlations[i].indirectLinks = Object.values(indirectLinks);
  }
  //formatting correlation by atomType
  const targets = {};
  for (const correlation of correlations) {
    const { signal, atomType } = correlation;
    if (!targets[atomType]) targets[atomType] = {};
    targets[atomType][signal.id] = correlation;
    targets[atomType][signal.id].integration = getIntegrationOfAttachedProton(
      correlation,
      correlations,
    );
  }

  return targets;
}
