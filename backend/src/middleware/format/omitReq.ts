import { Request, Response, NextFunction } from 'express';
import omitIsNil from '../../utils/omit';
import { IncomingHttpHeaders } from 'http';
import { ParsedQs } from 'qs';
import { ParamsDictionary } from 'express-serve-static-core';

const omitReq = (req: Request, res: Response, next: NextFunction): void => {
  req.body = omitIsNil(req.body, { deep: true });
  req.headers = omitIsNil(req.headers, { deep: true }) as IncomingHttpHeaders;
  req.query = omitIsNil(req.query, { deep: true }) as ParsedQs;
  req.params = omitIsNil(req.params, { deep: true }) as ParamsDictionary;

  next();
};

export default omitReq;
