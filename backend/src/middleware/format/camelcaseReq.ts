import { Request, Response, NextFunction } from 'express';
import camelcaseKeys from 'camelcase-keys';
// import camelCase from 'camelcase'
const camelCaseReq = async (req: Request, res: Response, next: NextFunction) => {
  req.params = camelcaseKeys(req.params);
  req.query = camelcaseKeys(req.query);
  req.body = camelcaseKeys(req.body);
  next();
};

export default camelCaseReq;