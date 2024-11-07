export type BalanceReturnType = {
  metadata: {
    total_data: number,
    page: {
      index: number,
      size:number
    }
    block: {
      start: number,
      end: number | undefined,
    }
    timestamp: {
      start: string,
      end: string,
    }
    datetime: {
      start: Date,
      end: Date | string, 
    }
  },
  result: unknown[],
}