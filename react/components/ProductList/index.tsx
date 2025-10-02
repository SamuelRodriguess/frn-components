import React, { useMemo, useState } from 'react'
import { useQuery } from 'react-apollo'
import { Product } from 'vtex.product-context/react/ProductTypes'
import { ProductTypes } from 'vtex.product-context'
import { ExtensionPoint } from 'vtex.render-runtime'
import { IFacets } from 'frn.promotions'

import styles from './productList.module.css'
import PromotionsShelfQuery from '../../graphql/PromotionsShelf.graphql'
import {
  getFacetFromPromotions,
  mapCatalogProductToProductSummary,
  NormalizedProductSummary,
  PreferenceType,
} from '../../utils'
import { ITEMS_PER_PAGE } from '../../consts/shelf'

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
  const [currentPage, setCurrentPage] = useState(0)

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

  const totalPages = Math.ceil(allProducts.length / ITEMS_PER_PAGE)

  const visibleProducts = useMemo(() => {
    const start = currentPage * ITEMS_PER_PAGE

    return allProducts.slice(start, start + ITEMS_PER_PAGE)
  }, [currentPage, allProducts])

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
      <div className="frn-shelf-promotions__empty">
        Nenhum produto encontrado
      </div>
    )
  }

  return (
    <section
      className={`relative flex flex-row items-center ${styles.productListSection}`}
    >
      <button
        onClick={handlePrev}
        disabled={currentPage === 0}
        aria-label="Produtos anteriores"
        className={`${styles.arrowButtonBaseStyles} ${styles.productArrowLeft}`}
      >
        &#8592;
      </button>
      <div className={styles.productListCard}>
        {visibleProducts.map((product, index) => (
          <ExtensionPoint
            id="product-summary"
            key={product.cacheId ?? product.productId ?? index}
            product={product}
            listName="PromotionsShelf"
          />
        ))}
      </div>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages - 1}
        aria-label="Próximos produtos"
        className={`${styles.arrowButtonBaseStyles} ${styles.productArrowRight}`}
      >
        &#8594;
      </button>
    </section>
  )
}

export default ProductList
