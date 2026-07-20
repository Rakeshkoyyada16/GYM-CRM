import { motion } from 'framer-motion'
import { UserPlus, CreditCard, ClipboardCheck, Calendar, FileDown, Send } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const actions = [
  { label: 'Add Member', icon: UserPlus, color: 'bg-brand-50 text-brand-600 hover:bg-brand-100' },
  { label: 'Record Payment', icon: CreditCard, color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' },
  { label: 'Check-in', icon: ClipboardCheck, color: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
  { label: 'Book Class', icon: Calendar, color: 'bg-purple-50 text-purple-600 hover:bg-purple-100' },
  { label: 'Export Data', icon: FileDown, color: 'bg-amber-50 text-amber-600 hover:bg-amber-100' },
  { label: 'Send SMS', icon: Send, color: 'bg-pink-50 text-pink-600 hover:bg-pink-100' },
]

export function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card>
        <CardHeader className="pb-0">
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {actions.map((action, i) => {
              const Icon = action.icon
              return (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-xl p-3 transition-colors cursor-pointer border border-transparent hover:border-gray-200',
                    action.color
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[11px] font-medium">{action.label}</span>
                </motion.button>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
