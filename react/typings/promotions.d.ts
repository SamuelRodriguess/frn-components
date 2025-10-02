declare module 'frn.promotions' {
  export interface PromotionEntity {
    id: string
    name: string
  }
  export interface Promotion {
    id?: string
    name: string
    description?: string
    categories?: PromotionEntity[]
    collections?: PromotionEntity[]
    skus?: PromotionEntity[]
    beginDate: string
    endDate: string
    [key: string]: unknown
  }

  export type PromotionList = Promotion[]
  export type PromotionId = string

  export interface PromotionsFacet {
    key: string
    value: string
  }
  export interface IFacets {
    id: string
    name: string
    type: string
    namepromo: string
  }
}
