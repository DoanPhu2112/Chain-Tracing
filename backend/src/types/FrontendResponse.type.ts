export type FrontEndResponsesType = {
  metadata: {
    total_data: number,
    page: number;
    page_size: number;
  };
  result: any;
};