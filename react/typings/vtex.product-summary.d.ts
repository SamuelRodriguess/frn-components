/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'vtex.product-summary/ProductSummaryCustom' {
  const ProductSummary: any

  export default ProductSummary
}

declare module 'vtex.product-summary' {
  import type { FunctionComponent, ReactNode } from 'react'

  interface ProductSummaryListProps {
    products?: unknown[]
    listName?: string
    children?: ReactNode
  }

  export const ProductSummaryList: FunctionComponent<ProductSummaryListProps>
}
