import type { PreferenceType } from '../utils'

interface PromotionsShelfProps {
  id?: string
  categoryId?: string
  sellerId?: string
  maxItems?: number
  hideUnavailableItems?: boolean
  preferredSKU?: PreferenceType
  promotionId?: string
}
