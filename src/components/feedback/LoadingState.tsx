import { motion } from 'framer-motion'

interface LoadingStateProps {
  text?: string
}

export function LoadingState({ text = 'Loading…' }: LoadingStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col items-center justify-center py-20"
    >
      <div className="relative mb-4">
        <div className="h-8 w-8 rounded-full border-[2.5px] border-gray-200 border-t-brand-500 animate-spin" />
      </div>
      <p className="text-[13px] text-gray-400">{text}</p>
    </motion.div>
  )
}
