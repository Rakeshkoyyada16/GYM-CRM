import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold transition-colors select-none',
  {
    variants: {
      variant: {
        default:   'bg-brand-50 text-brand-700 ring-1 ring-brand-200',
        gray:      'bg-gray-50 text-gray-600 ring-1 ring-gray-200',
        success:   'bg-green-50 text-green-700 ring-1 ring-green-200',
        warning:   'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
        error:     'bg-red-50 text-red-700 ring-1 ring-red-200',
        info:      'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
        premium:   'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-800 ring-1 ring-amber-200',
        vip:       'bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 ring-1 ring-purple-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
