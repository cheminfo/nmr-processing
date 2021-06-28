export function getIntegrationOfAttachedProton(target, correlations) {
  const { H: attachment = [] } = target.attachment;
  // console.log('target', attachment);
  let integration = 0;
  for (const match of attachment) {
    const correlation = correlations[match];
    integration += Number(correlation.integration);
  }
  // console.log('integration', integration)
  return integration;
}
