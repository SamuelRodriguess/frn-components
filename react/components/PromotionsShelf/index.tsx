import React, { useMemo } from 'react'
import { useQuery } from 'react-apollo'
import { ExtensionPoint } from 'vtex.render-runtime'
import { ProductTypes } from 'vtex.product-context'

import PromotionsShelfQuery from '../../graphql/PromotionsShelf.graphql'
import { usePromotions } from '../../hooks/usePromotions'
import {
  NormalizedProductSummary,
  PreferenceType,
  mapCatalogProductToProductSummary,
  getFacetFromPromotions,
  getPromotionName,
  buildSelectedFacets,
} from '../../utils'
import {
  DEFAULT_MAX_ITEMS,
  DEFAULT_PROMOTION_ID,
  SKU_INITIAL,
} from '../../consts/shelf'
import { Product } from '../../typings/products'

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
  categoryId,
  sellerId,
  maxItems = DEFAULT_MAX_ITEMS,
  preferredSKU = SKU_INITIAL,
  hideUnavailableItems = true,
  promotionId,
}: PromotionsShelfProps) => {
  const {
    promotions,
    loading: promotionsLoading,
    error: promotionsError,
  } = usePromotions(promotionId)

  const promotionName = useMemo(() => getPromotionName(promotions), [
    promotions,
  ])

  const baseFacet = useMemo(() => getFacetFromPromotions(promotions), [
    promotions,
  ])

  const selectedFacets = useMemo(
    () => buildSelectedFacets(baseFacet, sellerId, categoryId),
    [baseFacet, categoryId, sellerId]
  )

  const { data, loading, error } = useQuery(PromotionsShelfQuery, {
    skip: selectedFacets.length === 0,
    variables: {
      from: 0,
      to: maxItems - 1,
      hideUnavailableItems,
      selectedFacets,
    },
  })

  const products = useMemo(() => {
    const productsData: Product[] = data?.productSearch?.products ?? []

    return productsData
      .map((product: Product) =>
        mapCatalogProductToProductSummary(
          (product as unknown) as ProductTypes.Product,
          preferredSKU
        )
      )
      .filter((summary) => Boolean(summary))
  }, [data, preferredSKU])

  if (promotionsError || error || promotionsLoading || loading) {
    return <div className="frn-shelf-promotions__loading">Carregando...</div>
  }

  if (!products || products.length === 0) {
    return (
      <div className="frn-shelf-promotions__empty">
        Nenhum produto encontrado
      </div>
    )
  }

  return (
    <div id={id} className="frn-shelf-promotions">
      {promotionName && <h2>{promotionName}</h2>}

      <section className="flex">
        {products.map((product: NormalizedProductSummary, index: number) => (
          <ExtensionPoint
            id="product-summary"
            key={product.cacheId ?? product.productId ?? index}
            product={product}
            listName="PromotionsShelf"
          />
        ))}
      </section>
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
