import { useEffect, useState } from 'react'
import type { PromotionId, PromotionList } from 'frn.promotions'

import { DEFAULT_PROMOTION_ID } from '../consts/shelf'

const PROMOTIONS_ENDPOINT = '/_v/custom-promotions/'

interface UsePromotionsResponse {
  promotions: PromotionList | null
  loading: boolean
  error: Error | null
}

export function usePromotions(
  promotionId: PromotionId = DEFAULT_PROMOTION_ID
): UsePromotionsResponse {
  const [promotions, setPromotions] = useState<PromotionList | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    async function fetchPromotions() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(
          `${PROMOTIONS_ENDPOINT}?id=${encodeURIComponent(promotionId)}`
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = (await response.json()) as PromotionList

        if (isMounted) {
          setPromotions(data)
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchPromotions()

    return () => {
      isMounted = false
    }
  }, [promotionId])

  return {
    promotions,
    loading,
    error,
  }
}
