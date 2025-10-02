import React, { useMemo } from 'react'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = [
  'productListPagination',
  'productListPaginationDot',
  'productListPaginationDotActive',
] as const

interface BulletsProps {
  totalPages: number
  currentPage: number
  setCurrentPage: (e: number) => void
}

const Bullets = ({ totalPages, currentPage, setCurrentPage }: BulletsProps) => {
  const { handles: cssHandles } = useCssHandles(CSS_HANDLES)

  const paginationPages = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index),
    [totalPages]
  )

  return (
    <>
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
    </>
  )
}

export default Bullets
