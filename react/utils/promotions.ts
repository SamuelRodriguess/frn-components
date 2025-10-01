import { PromotionList, PromotionsFacet } from 'frn.promotions'

export function getPromotionName(promotions: PromotionList | null) {
  if (!promotions || promotions.length === 0) {
    return ''
  }

  return promotions.map((promotion) => promotion.name).join(', ')
}

export function getFacetFromPromotions(promotions: PromotionList | null) {
  if (!promotions || promotions.length === 0) {
    return null
  }

  const collectionFacet = promotions
    .flatMap((promotion) => promotion.collections ?? [])
    .find(Boolean)

  if (collectionFacet) {
    return {
      key: 'productClusterIds',
      value: collectionFacet.id,
    } as PromotionsFacet
  }

  const categoryFacet = promotions
    .flatMap((promotion) => promotion.categories ?? [])
    .find(Boolean)

  if (categoryFacet) {
    return { key: 'c', value: categoryFacet.id } as PromotionsFacet
  }

  return null
}

export function buildSelectedFacets(
  baseFacet: PromotionsFacet | null,
  sellerId?: string,
  fallbackCategoryId?: string
) {
  const facets: PromotionsFacet[] = []

  if (baseFacet) {
    facets.push(baseFacet)
  } else if (fallbackCategoryId) {
    facets.push({ key: 'c', value: fallbackCategoryId })
  }

  if (sellerId) {
    facets.push({ key: 'sellerIds', value: sellerId })
  }

  return facets
}
