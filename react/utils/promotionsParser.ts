import type { IFacets, PromotionList } from 'frn.promotions'

/**
 * Extracts promotion targets (categories, collections, and SKUs) from a promotions list.
 *
 * Each target is normalized into a common shape with a `type` property:
 * - `category` → Category target
 * - `collection` → Collection target
 * - `sku` → SKU target
 *
 * @param {Array} promotions - The list of promotion objects.
 * @returns {IFacets[] } An array of normalized targets with their type and properties.
 *
 * @example
 * const promotions = [
 *   { categories: [{ id: "6", name: "Hats" }], collections: [], skus: [] },
 *   { categories: [], collections: [{ id: "150", name: "Launch" }], skus: [] },
 * ]
 *
 * const result = extractPromotionTargets(promotions)
 * // [
 * //   { type: "category", id: "6", name: "Hats" },
 * //   { type: "collection", id: "150", name: "Launch" }
 * // ]
 */
export function promotionParser(promotions: PromotionList): IFacets[] {
  if (!promotions?.length) {
    return []
  }

  return promotions?.reduce<IFacets[]>((acc, promo) => {
    if (promo.categories?.length) {
      acc.push(
        ...promo.categories.map((elemcat) => ({
          type: 'category',
          namepromo: promo.name,
          ...elemcat,
        }))
      )
    }

    if (promo.collections?.length) {
      acc.push(
        ...promo.collections.map((elemcol) => ({
          type: 'collection',
          namepromo: promo.name,
          ...elemcol,
        }))
      )
    }

    if (promo.skus?.length) {
      acc.push(
        ...promo.skus.map((elemskus) => ({
          type: 'sku',
          namepromo: promo.name,
          ...elemskus,
        }))
      )
    }

    return acc
  }, [])
}
