import prisma from "prisma/prismaClient";

export async function getLabel(address: string): Promise<string[]> {
  const eoaLabel = await prisma.eoa.findMany({
    where: { hash: address },
    select: {
      label: true,
      name_tag: true,
    },
  });

  const scLabel = await prisma.smartcontract.findMany({
    where: { address },
    select: {
      name_tag: true,
    },
  });

  const normalizedSc = scLabel.map((item) => ({
    label: null,
    name_tag: item.name_tag,
  }));

  const combined = [...eoaLabel, ...normalizedSc];

  const result = Array.from(
    new Set(
      combined
        .flatMap(({ label, name_tag }) => [label, name_tag])
        .filter((x): x is string => Boolean(x?.trim()))
    )
  );
 
  return result;
}
