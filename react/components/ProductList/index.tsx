import React, { useMemo } from 'react'
import { useQuery } from 'react-apollo'
import { Product } from 'vtex.product-context/react/ProductTypes'
import { ProductTypes } from 'vtex.product-context'
import { ExtensionPoint } from 'vtex.render-runtime'
import { IFacets } from 'frn.promotions'

import PromotionsShelfQuery from '../../graphql/PromotionsShelf.graphql'
import {
  getFacetFromPromotions,
  mapCatalogProductToProductSummary,
  NormalizedProductSummary,
  PreferenceType,
} from '../../utils'

interface ProductListProps {
  facets: IFacets
  maxItems: number
  hideUnavailableItems?: boolean
  preferredSKU: PreferenceType
}

const ProductList = ({
  facets,
  maxItems,
  hideUnavailableItems,
  preferredSKU,
}: ProductListProps) => {
  const selectedFacets = useMemo(
    () => getFacetFromPromotions(facets, facets.type),
    [facets]
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

  const allProducts = useMemo(() => {
    const productsData: Product[] = data?.productSearch?.products ?? []

    return productsData
      ?.map((product: Product) =>
        mapCatalogProductToProductSummary(
          (product as unknown) as ProductTypes.Product,
          preferredSKU
        )
      )
      .filter((summary) => Boolean(summary))
  }, [data, preferredSKU])

  if (!allProducts || loading || error || !allProducts.length) {
    return (
      <div className="frn-shelf-promotions__empty">
        Nenhum produto encontrado
      </div>
    )
  }

  return (
    <section className="flex">
      {allProducts.map((product: NormalizedProductSummary, index: number) => (
        <ExtensionPoint
          id="product-summary"
          key={product.cacheId ?? product.productId ?? index}
          product={product}
          listName="PromotionsShelf"
        />
      ))}
    </section>
  )
}

export default ProductList
