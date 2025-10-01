import React from 'react'

import { usePromotions } from '../../hooks/usePromotions'
import { PreferenceType, promotionParser } from '../../utils'
import {
  DEFAULT_MAX_ITEMS,
  DEFAULT_PROMOTION_ID,
  SKU_INITIAL,
} from '../../consts/shelf'
import ProductList from '../ProductList'

interface PromotionsShelfProps {
  id?: string
  categoryId?: string
  sellerId?: string
  maxItems?: number
  hideUnavailableItems?: boolean
  preferredSKU?: PreferenceType
  promotionId?: string
}

const PromotionsShelf: StorefrontFunctionComponent<PromotionsShelfProps> = ({
  id,
  maxItems = DEFAULT_MAX_ITEMS,
  preferredSKU = SKU_INITIAL,
  hideUnavailableItems = true,
  promotionId = '',
}: PromotionsShelfProps) => {
  const {
    promotions,
    loading: promotionsLoading,
    error: promotionsError,
  } = usePromotions(promotionId)

  const allPromotions = promotionParser(promotions)

  if (promotionsError || promotionsLoading || !allPromotions.length) {
    return <div className="frn-shelf-promotions__loading">Carregando...</div>
  }

  return (
    <div id={id} className="frn-shelf-promotions">
      {allPromotions?.map((facets, idx) => {
        return (
          <>
            <h2>{facets.name}</h2>
            <ProductList
              key={idx}
              facets={facets}
              maxItems={maxItems}
              hideUnavailableItems={hideUnavailableItems}
              preferredSKU={preferredSKU}
            />
          </>
        )
      })}
    </div>
  )
}

PromotionsShelf.schema = {
  title: 'Promotions Shelf',
  description: 'Shelf de promoções usando store-resources',
  type: 'object',
  properties: {
    promotionId: {
      title: 'Promotion ID',
      type: 'string',
      default: DEFAULT_PROMOTION_ID,
    },
    maxItems: {
      title: 'Maximum items',
      type: 'number',
      default: DEFAULT_MAX_ITEMS,
    },
    hideUnavailableItems: {
      title: 'Hide unavailable items',
      type: 'boolean',
      default: true,
    },
    preferredSKU: {
      title: 'Preferred SKU strategy',
      type: 'string',
      enum: ['FIRST_AVAILABLE', 'PRICE_ASC', 'PRICE_DESC', 'LAST_AVAILABLE'],
      default: 'FIRST_AVAILABLE',
    },
  },
}

export default PromotionsShelf
