import './styles/product-list.css'
import React, { memo, useMemo, useState } from 'react'
import { useQuery } from 'react-apollo'
import { Product } from 'vtex.product-context/react/ProductTypes'
import { ProductTypes } from 'vtex.product-context'
import { ExtensionPoint } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'
import { useDevice } from 'vtex.device-detector'

import PromotionsShelfQuery from '../../graphql/PromotionsShelf.graphql'
import {
  getFacetFromPromotions,
  mapCatalogProductToProductSummary,
  NormalizedProductSummary,
} from '../../utils'
import { ITEMS_PER_PAGE } from '../../consts/shelf'
import { ProductListProps } from '../../typings/productList'

const CSS_HANDLES = [
  'productListSection',
  'productListContainer',
  'productListCarousel',
  'productListArrowButton',
  'productListArrowLeft',
  'productListArrowRight',
  'productListEmptyState',
  'productListItem',
] as const

const ProductList = ({
  facets,
  maxItems,
  hideUnavailableItems,
  preferredSKU,
}: ProductListProps) => {
  const { handles: cssHandles } = useCssHandles(CSS_HANDLES)
  const [currentPage, setCurrentPage] = useState(0)
  const { isMobile } = useDevice()

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
      .map((product: Product) =>
        mapCatalogProductToProductSummary(
          (product as unknown) as ProductTypes.Product,
          preferredSKU
        )
      )
      .filter(Boolean) as NormalizedProductSummary[]
  }, [data, preferredSKU])

  const quantityItems = isMobile ? allProducts.length : ITEMS_PER_PAGE

  const totalPages = Math.ceil(allProducts.length / ITEMS_PER_PAGE)

  const visibleProducts = useMemo(() => {
    const start = currentPage * quantityItems

    return allProducts.slice(start, start + quantityItems)
  }, [currentPage, quantityItems, allProducts])

  const handlePrev = () => {
    const isAfterFirstPage = currentPage > 0

    if (isAfterFirstPage) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNext = () => {
    const isBeforeLastPage = currentPage < totalPages - 1

    if (isBeforeLastPage) {
      setCurrentPage(currentPage + 1)
    }
  }

  if (loading || error || !allProducts.length) {
    return (
      <div
        className={`${cssHandles.productListEmptyState} frn-shelf-promotions__empty`}
      >
        Nenhum produto encontrado
      </div>
    )
  }

  return (
    <section
      className={`relative flex flex-row items-center ${cssHandles.productListContainer}`}
    >
      <div className={`shadow-lg ${cssHandles.productListArrowButton}`}>
        <button
          onClick={handlePrev}
          disabled={currentPage === 0}
          aria-label="Produtos anteriores"
          className={`${cssHandles.productListArrowLeft}`}
        >
          &#8592;
        </button>
      </div>

      <div className={`${cssHandles.productListCarousel}`}>
        {visibleProducts.map((product, index) => (
          <div
            className={cssHandles.productListItem}
            key={product.cacheId ?? product.productId ?? index}
          >
            <ExtensionPoint
              id="product-summary"
              product={product}
              listName="PromotionsShelf"
            />
          </div>
        ))}
      </div>
      <div className={`shadow-lg ${cssHandles.productListArrowButton}`}>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages - 1}
          aria-label="Próximos produtos"
          className={`${cssHandles.productListArrowRight}`}
        >
          &#8594;
        </button>
      </div>
    </section>
  )
}

export default memo(ProductList)
