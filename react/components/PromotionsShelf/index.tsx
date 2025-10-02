import './styles/promotions-shelf.css'
import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

import { usePromotions } from '../../hooks/usePromotions'
import { promotionParser } from '../../utils'
import {
  DEFAULT_MAX_ITEMS,
  DEFAULT_PROMOTION_ID,
  SKU_INITIAL,
} from '../../consts/shelf'
import ProductList from '../ProductList'
import { PromotionsShelfProps } from '../../typings/promotionsShelf'

const CSS_HANDLES = [
  'promotionsShelf',
  'promotionsShelfLoading',
  'promotionsShelfGroup',
  'promotionsShelfTitle',
] as const

const PromotionsShelf: StorefrontFunctionComponent<PromotionsShelfProps> = ({
  id,
  maxItems = DEFAULT_MAX_ITEMS,
  preferredSKU = SKU_INITIAL,
  hideUnavailableItems = true,
  promotionId = '',
}: PromotionsShelfProps) => {
  const { handles: cssHandles } = useCssHandles(CSS_HANDLES)
  const {
    promotions,
    loading: promotionsLoading,
    error: promotionsError,
  } = usePromotions(promotionId)

  const allPromotions = promotionParser(promotions)

  if (promotionsError || promotionsLoading || !allPromotions.length) {
    return (
      <div className={`${cssHandles.promotionsShelfLoading}`}>
        Carregando...
      </div>
    )
  }

  return (
    <div id={id} className={`${cssHandles.promotionsShelf}`}>
      {allPromotions?.map((facets, idx) => {
        const promotionKey = facets?.id ?? facets?.name ?? idx
        const promotionName = facets?.name ?? ''

        return (
          <div key={promotionKey} className={cssHandles.promotionsShelfGroup}>
            {promotionName ? (
              <h2 className={cssHandles.promotionsShelfTitle}>
                {promotionName}
              </h2>
            ) : null}
            <ProductList
              facets={facets}
              maxItems={maxItems}
              hideUnavailableItems={hideUnavailableItems}
              preferredSKU={preferredSKU}
            />
          </div>
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
