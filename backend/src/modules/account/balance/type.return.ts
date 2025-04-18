export type BalanceReturnType = {
  metadata: {
    total_data: number,
    chainID: string,
    page: {
      index: number,
      size:number
    }
    block: {
      start: number,
      end: number | undefined,
    }
    timestamp: {
      start: number,
      end: number,
    }
    datetime: {
      start: Date,
      end: Date | string, 
    }
  },
  result: unknown[],
}