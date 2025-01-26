import { Entity } from "../types/entity"
import { NativeToken } from "../types/token"

export type NativeTransfer = {
  from: Entity,
  to: Entity,
  token: NativeToken
  direction?: string,
  valueFormatted: string,
  blockTimestamp?: string,
}