import type { PromotionsFacet, IFacets } from 'frn.promotions'

export function getFacetFromPromotions(facets: IFacets, name: string) {
  let result = {}

  if (name === 'collection') {
    result = {
      key: 'productClusterIds',
      value: facets.id,
    } as PromotionsFacet
  }

  if (name === 'category') {
    result = {
      key: 'c',
      value: facets.id,
    } as PromotionsFacet
  }

  if (name === 'skus') {
    result = {
      key: 'sku',
      value: facets.id,
    } as PromotionsFacet
  }

  return Array(result)
}
