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
  'productListarrowButtonBase',
  'productListArrowButton',
  'productListArrowLeft',
  'productListArrowRight',
  'productListEmptyState',
  'productListItem',
  'productListContent',
  'productListPagination',
  'productListPaginationDot',
  'productListPaginationDotActive',
] as const

const ProductList = ({
  facets,
  maxItems,
  hideUnavailableItems,
  preferredSKU,
}: ProductListProps) => {
  const { handles: cssHandles } = useCssHandles(CSS_HANDLES)
  const [currentPage, setCurrentPage] = useState(0)
  const { isMobile, device } = useDevice()

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

  const quantityItems =
    isMobile || device === 'tablet' ? allProducts.length : ITEMS_PER_PAGE

  const totalPages = Math.max(1, Math.ceil(allProducts.length / quantityItems))

  const paginationPages = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index),
    [totalPages]
  )

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
      className={`relative flex flex-col items-center ${cssHandles.productListContainer} ${cssHandles.productListSection}`}
    >
      <div
        className={`${cssHandles.productListContent} productListContent flex w-full flex-row items-center`}
      >
        <div className={`${cssHandles.productListArrowButton}`}>
          <button
            onClick={handlePrev}
            disabled={currentPage === 0}
            aria-label="Produtos anteriores"
            className={`${cssHandles.productListarrowButtonBase} ${cssHandles.productListArrowLeft}`}
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
        <div className={`${cssHandles.productListArrowButton}`}>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages - 1}
            aria-label="Próximos produtos"
            className={`${cssHandles.productListarrowButtonBase} ${cssHandles.productListArrowRight}`}
          >
            &#8594;
          </button>
        </div>
      </div>
      {totalPages > 1 ? (
        <div
          className={`${cssHandles.productListPagination} productListPagination`}
        >
          {paginationPages.map((pageIndex) => {
            const isActive = currentPage === pageIndex

            return (
              <button
                key={`product-list-page-${pageIndex}`}
                type="button"
                onClick={() => setCurrentPage(pageIndex)}
                aria-label={`Ir para página ${pageIndex + 1}`}
                aria-current={isActive ? 'page' : undefined}
                className={`${
                  cssHandles.productListPaginationDot
                } productListPaginationDot${
                  isActive
                    ? ` ${cssHandles.productListPaginationDotActive} productListPaginationDotActive`
                    : ''
                }`}
              />
            )
          })}
        </div>
      ) : null}
    </section>
  )
}

export default memo(ProductList)
