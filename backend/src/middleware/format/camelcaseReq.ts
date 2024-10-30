import { Request, Response, NextFunction } from 'express';

const camelCaseReq = async (req: Request, res: Response, next: NextFunction) => {
  const camelcaseKeys = (await import('camelcase-keys')).default;

  req.query = camelcaseKeys(req.query, { deep: true });
  req.body = camelcaseKeys(req.body, { deep: true });
  next();
};

export default camelCaseReq;