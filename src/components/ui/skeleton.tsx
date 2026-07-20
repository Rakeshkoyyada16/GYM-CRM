import { cn } from '@/lib/utils'

/**
 * Professional loading skeleton with shimmer animation.
 * Uses the .animate-shimmer class defined in index.css.
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-lg animate-shimmer', className)}
      {...props}
    />
  )
}

export { Skeleton }
