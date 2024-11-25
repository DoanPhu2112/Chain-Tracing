import { Entity } from "../types/entity"
import { NativeToken } from "../types/token"

export type NativeTransfer = {
  from_entity: Entity,
  to_entity: Entity,
  token: NativeToken
  value_formatted: string,
  block_timestamp?: string,
  direction?: string,

}