import { Request, Response, NextFunction } from 'express';
import Field from './fieldValidate.middleware';
import Joi, { CustomHelpers } from 'joi'
import CustomError from '~/errors/CustomError';
import codes from '~/errors/codes';


const schema = Joi.object({
  address: Joi.string().length(42).custom(Field.validateAddress, 'Ethereum Address Validation').required(),

  chainId: Joi.string().pattern(/^0x[0-9a-fA-F]+$/),

  page: Joi.string().pattern(/^\d+$/),

  pageSize: Joi.string().pattern(/^\d+$/),

  startTimestamp: Joi.number().integer().min(0).max(Date.now()),

  endTimestamp: Joi.number().integer().min(0).max(Date.now()),

  tokenAddresses: Joi.alternatives().try(
    Joi.array().items(Joi.string().custom(Field.validateAddress, 'Ethereum Address Validation')),
    Joi.string().custom(Field.validateAddress, 'Ethereum Address Validation').optional(),
  ),
  toTimestamp: Joi.string().optional() // Optional, and doesn’t need .allow('')

})

export function validateGetBalanceParam(req: Request, res: Response, next: NextFunction) {
  console.log("validateGetBalanceParam")

  // Validate request query
  const { error, value } = schema.validate(req.query, { convert: true });
  console.log("value", value)
  console.log("error", error)
  if (error) {
    // Send validation error response
    throw new CustomError(codes.BAD_REQUEST, error)
  }

  // Replace query with validated values to ensure correct types
  req.query = value;

  // Proceed to the next middleware or controller
  next();
};

