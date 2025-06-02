import { Request, Response, NextFunction } from 'express';
import Field from '../../../middleware/fieldValidate.middleware';
import Joi, { CustomHelpers } from 'joi';
import CustomError from '~/errors/CustomError';
import codes from '~/errors/codes';
import {
  DEFAULT_CHAIN_ID,
  LATEST_QUERY_TIMESTAMP_STRING,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE
} from '~/constants/defaultvalue';
const paramsSchema = Joi.object({
  // address: Joi.string().length(42).custom(Field.validateAddress, 'Ethereum Address Validation').required(),
  address: Joi.string().length(42).required()
});
const querySchema = Joi.object({
  chainId: Joi.string()
    .empty('')
    .default(DEFAULT_CHAIN_ID)
    .pattern(/^0x[0-9a-fA-F]+$/),

  page: Joi.string().empty('').default(DEFAULT_PAGE).min(0),

  pageSize: Joi.string().empty('').default(DEFAULT_PAGE_SIZE),

  startTimestamp: Joi.string().default('0'),

  endTimestamp: Joi.string()
    .default(() => LATEST_QUERY_TIMESTAMP_STRING)
    .custom((value) => {
      const max = LATEST_QUERY_TIMESTAMP_STRING;
      if (value > max) {
        return max;
      }
    }),

  tokenAddresses: Joi.alternatives()
    .default(null)
    .try(
      Joi.string()
        .empty('')
        .custom(Field.validateAddress, 'Ethereum Address Validation')
        .custom((value) => [value], 'Convert string to array'),
      Joi.array().items(Joi.string().custom(Field.validateAddress, 'Ethereum Address Validation'))
    )
});

export function validateTransactionParam(req: Request, res: Response, next: NextFunction) {
  const { error: ParamError } = paramsSchema.validate(req.params, { convert: true });
  const { error: QueryError, value: QueryValue } = querySchema.validate(req.query, {
    convert: true
  });
  if (ParamError) {
    throw new CustomError(codes.BAD_REQUEST, ParamError);
  }
  if (QueryError) {
    throw new CustomError(codes.BAD_REQUEST, QueryError);
  }
  req.query = QueryValue;

  next();
}
