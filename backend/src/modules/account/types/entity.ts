import { AccountType } from "~/models/account.model";

export type Entity = {
  address?: string;
  address_entity?: string;
  address_entity_logo?: string;
  address_entity_label?: string;
  type: AccountType[];
};
