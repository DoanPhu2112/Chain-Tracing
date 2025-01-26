import Field from "./fieldValidate.middleware";

import Joi from 'joi';

const userAssetSchema = Joi.object({
  address: Joi.string().length(42).custom(Field.validateAddress, 'Ethereum Address Validation').required(),

  chain_id: Joi.string().pattern(/^0x[0-9a-fA-F]+$/),

  page: Joi.string().pattern(/^\d+$/),

  page_size: Joi.string().pattern(/^\d+$/),

  start_timestamp: Joi.number().integer().min(0),

  end_timestamp: Joi.number().integer().min(0),

  token_addresses: Joi.alternatives().try(
    Joi.array().items(Joi.string().custom(Field.validateAddress, 'Ethereum Address Validation')),
    Joi.string().custom(Field.validateAddress, 'Ethereum Address Validation'),
    Joi.any().valid(undefined)
  )
})

module.exports = userAssetSchema;