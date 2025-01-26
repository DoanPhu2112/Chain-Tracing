import { Request, Response, NextFunction } from 'express';
import Field from '../../../middleware/fieldValidate.middleware';
import Joi, { CustomHelpers } from 'joi'
import CustomError from '~/errors/CustomError';
import codes from '~/errors/codes';
import { DEFAULT_CHAIN_ID, DEFAULT_LATEST_TIMESTAMP, DEFAULT_LATEST_TIMESTAMP_STRING, DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '~/constants/defaultvalue';
const paramsSchema = Joi.object({
  // address: Joi.string().length(42).custom(Field.validateAddress, 'Ethereum Address Validation').required(),
  address: Joi.string().length(42).required(),
})
const querySchema = Joi.object({

  chainId: Joi.string().empty('').default(DEFAULT_CHAIN_ID).pattern(/^0x[0-9a-fA-F]+$/),

  page: Joi.number().empty('').default(DEFAULT_PAGE).min(0),

  pageSize: Joi.number().empty('').default(DEFAULT_PAGE_SIZE).min(0),

  startTimestamp: Joi.string().empty('').default("0")
    .custom((value, helpers) => {
      const numValue = Number(value); // Convert the string to a number
      const min = 0;
      if (numValue < min) {
        // return helpers.error('any.invalid'); // Return an error if out of range
        throw new CustomError(codes.BAD_REQUEST, 'Larger than current latest timestamp')
      }

      return value; // Valid string timestamp
    }, 'timestamp validation'),

  endTimestamp: Joi.string()
    .empty('')
    .default(() => DEFAULT_LATEST_TIMESTAMP_STRING)
    .custom((value, helpers) => {
      if (Number(value) < 0) {
        // return helpers.error('any.invalid'); // Return an error if out of range
        throw new CustomError(codes.BAD_REQUEST, 'Larger than current latest timestamp')
      }

      return value; // Valid string timestamp
    }, 'timestamp validation'),
  tokenAddresses: Joi.alternatives().default(null).try(
    Joi.string().empty('').custom(Field.validateAddress, 'Ethereum Address Validation').custom((value) => [value], 'Convert string to array'),
    Joi.array().items(Joi.string().custom(Field.validateAddress, 'Ethereum Address Validation')),
  ),
})

export function validateTransactionParam(req: Request, res: Response, next: NextFunction) {
  const { error: ParamError } = paramsSchema.validate(req.params, { convert: true })
  const { error: QueryError, value: QueryValue } = querySchema.validate(req.query, { convert: true });
  if (ParamError) {
    throw new CustomError(codes.BAD_REQUEST, ParamError)
  }
  if (QueryError) {
    throw new CustomError(codes.BAD_REQUEST, QueryError)
  }
  req.query = QueryValue;

  next();
};


