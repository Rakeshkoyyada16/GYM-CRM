import { memo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface SkeletonCardsProps {
  count?: number
  height?: string
  cols?: string
}

/**
 * Reusable skeleton grid for stat cards / metric cards.
 */
export const SkeletonCards = memo(function SkeletonCards({
  count = 6, height = 'h-14', cols = 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
}: SkeletonCardsProps) {
  return (
    <div className={`grid ${cols} gap-3`}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}><CardContent className="p-4"><Skeleton className={`${height} w-full`} /></CardContent></Card>
      ))}
    </div>
  )
})
