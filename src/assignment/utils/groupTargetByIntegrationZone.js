function groupTargetByIntegrationZone(activeDomainOnTarget, targets) {
  let targetID = activeDomainOnTarget[0];
  console.log(targetID)
  let target = targets[targetID];
  let { H: attachments = [] } = target.attachment;
  let targetByIntegral = [{ targetIDs: [targetID], attachments }];
  for (let i = 1; i < activeDomainOnTarget.length; i++) {
    let targetID = activeDomainOnTarget[i];
    let target = targets[targetID];
    let { H: attachments = [] } = target.attachment;
    // const key = attachment.sort((a,b) => a - b).join('-') | 'quaternary';
    let alone = true;
    for (let group of targetByIntegral) {
      const pertain = attachments.some((attachment) =>
        group.attachments.includes(attachment),
      );
      if (pertain) {
        alone = false;
        group.targetIDs.push(targetID);
        group.attachments.push(...attachments);
        break;
      }
    }
    if (alone) {
      targetByIntegral.push({
        targetIDs: [targetID],
        attachments: attachments,
      });
    }
  }
  return targetByIntegral;
}

export default groupTargetByIntegrationZone;
