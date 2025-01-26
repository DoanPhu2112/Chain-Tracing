import mongoose from 'mongoose';
const { Schema } = mongoose;

export type Account = {
  tag: AccountTag,
  type: AccountType,
}

export enum AccountType {
  MINER = "MINER",
  EOA_ACTIVE = "EOA_ACTIVE",
  EOA_INACTIVE = "EOA_INACTIVE",
  EOA_EXCHANGE = "EOA_EXCHANGE",
  CONTRACT_EXCHANGE = "CONTRACT_EXCHANGE",
  CONTRACT_NORMAL = "CONTRACT_NORMAL",
  ROUTER = "ROUTER",
  CONTRACT_TOKEN = "CONTRACT_TOKEN",
  INVALID = "INVALID",
  TARGET = "TARGET",
}

export enum AccountTag {
  fraud,
  money_laundering
}

const AccountSchema = new Schema({
  address: {
    type: String,
    required: true,
    unique: true
  },
  balance: {
    type: String,
    required: [true, 'To address is required'],
    min: ["0", 'Balance must be non-negative']
  },
  accountType :{
    type: String,
    enum: AccountType
  },
  tag: {
    type: String,
    enum: AccountTag
  }
});

const Account = mongoose.model('Account', AccountSchema);
export default Account;