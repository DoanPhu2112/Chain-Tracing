import Moralis from "moralis";


async function timestampToBlock(timestamp: string, chainID: string): Promise<number> {
  const timestampDate = new Date(parseInt(timestamp) * 1000);
  try {
    const response = await Moralis.EvmApi.block.getDateToBlock({
      "chain": chainID,
      "date": timestampDate
    });
    if (response.result.block === 0) {
      return 1
    }
    return response.result.block
  } catch( err) {
    console.log("err", err);
    return -1
  }
}
function timestampToDateTime(timestamp: string): Date {
  return new Date(parseInt(timestamp) * 1000);
}
function toVNDateTime(date: Date): string {
  const vietnamOffset = 7 * 60 * 60 * 1000; 
  const vietnamTime = new Date(date.getTime() + vietnamOffset);
  
  // Convert to ISO format and remove the 'Z' at the end (indicating UTC)
  return vietnamTime.toISOString();
}
export { timestampToBlock, timestampToDateTime, toVNDateTime }
