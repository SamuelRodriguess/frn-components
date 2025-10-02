import { IFacets } from 'frn.promotions'
import { PreferenceType } from '../utils'

interface ProductListProps {
  facets: IFacets
  maxItems: number
  hideUnavailableItems?: boolean
  preferredSKU: PreferenceType
}
