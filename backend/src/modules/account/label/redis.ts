import redis from '~/redis';

export async function getLabel(address: string): Promise<string | null> {
  let labels: string | null = await redis.hget('label', address);

  return labels;
}
