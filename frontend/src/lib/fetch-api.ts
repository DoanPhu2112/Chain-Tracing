import ky from 'ky'

import { CONFIG } from '@/constants/config'

export const fetchApiV1 = ky.create({
  prefixUrl: CONFIG.NEXT_PUBLIC_API_V1_ENDPOINT,
})
