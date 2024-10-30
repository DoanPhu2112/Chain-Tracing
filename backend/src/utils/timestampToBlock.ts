import Moralis from "moralis";


async function timestampToBlock(timestamp: string, chainID: string): Promise<number> {
  const response = await Moralis.EvmApi.block.getDateToBlock({
    "chain": chainID,
    "date": timestamp
  });
  return response.result.block
}
export default timestampToBlock