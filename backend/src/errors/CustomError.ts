class CustomError extends Error {
  code: number;

  constructor(code: number, ...params: any) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
    this.code = code;
  }
}

export default CustomError;