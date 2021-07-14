function groupTargetByIntegrationZone(activeDomainOnTarget, targets) {
  let targetID = activeDomainOnTarget[0];

  let { H: attachments = [] } = targets[targetID].attachment;

  let targetByIntegral = [
    { targetIDs: [targetID], attachments: new Set(attachments) },
  ];

  for (let i = 1; i < activeDomainOnTarget.length; i++) {
    let targetID = activeDomainOnTarget[i];
    let target = targets[targetID];
    let { H: attachments = [] } = target.attachment;
    // const key = attachment.sort((a,b) => a - b).join('-') | 'quaternary';
    let alone = true;
    for (let group of targetByIntegral) {
      const pertain = attachments.some((attachment) =>
        group.attachments.has(attachment),
      );
      if (pertain) {
        alone = false;
        group.targetIDs.push(targetID);
        for (let attachment of attachments) {
          group.attachments.add(attachment);
        }
        break;
      }
    }
    if (alone) {
      targetByIntegral.push({
        targetIDs: [targetID],
        attachments: new Set(attachments),
      });
    }
  }
  return targetByIntegral.map((t) => ({
    targetIDs: t.targetIDs,
    attachments: Array.from(t.attachments),
  }));
}

export default groupTargetByIntegrationZone;
