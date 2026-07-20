import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  icon: React.ElementType
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

/**
 * Professional empty state with subtle illustration.
 * Used when a list or section has no data.
 */
export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center py-20"
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-2xl bg-gray-100 blur-xl scale-150 opacity-50" />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-xs">
          <Icon className="h-6 w-6 text-gray-300" />
        </div>
      </div>
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 max-w-xs text-center text-[13px] text-gray-500 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button className="mt-6" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}
