import prisma from 'prisma/prismaClient';

export async function getLabel(address: string): Promise<string[]> {
  const eoaLabel = await prisma.eoa.findMany({
    where: { hash: address },
    select: {
      name_tag: true
    }
  });

  const scLabel = await prisma.smartcontract.findMany({
    where: { address },
    select: {
      name_tag: true
    }
  });

  const normalizedSc = scLabel.map((item) => ({
    name_tag: item.name_tag
  }));

  const combined = [...eoaLabel, ...normalizedSc];
  const result = combined
    .map((item) => item.name_tag)
    .filter((tag): tag is string => tag !== null && tag !== 'null' && tag !== '');

  const uniqueLabels = new Set(result);
  return Array.from(uniqueLabels);
}
