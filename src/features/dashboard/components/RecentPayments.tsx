import { motion } from 'framer-motion'
import { ArrowRight, CreditCard, Smartphone, Building2, Banknote } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/utils'
import type { RecentPayment } from '../types/dashboard.types'

interface RecentPaymentsProps {
  data: RecentPayment[] | null
  isLoading: boolean
}

const methodIcons: Record<string, React.ElementType> = {
  upi: Smartphone, card: CreditCard, netbanking: Building2, cash: Banknote,
}

const methodLabels: Record<string, string> = {
  upi: 'UPI', card: 'Card', netbanking: 'Net Banking', cash: 'Cash',
}

const statusBadge: Record<string, 'success' | 'warning' | 'error'> = {
  paid: 'success', pending: 'warning', unpaid: 'error',
}

export function RecentPayments({ data, isLoading }: RecentPaymentsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-4 w-32" /></CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-2.5 w-32" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (!data) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-0">
          <CardTitle>Recent Payments</CardTitle>
          <Button variant="ghost" size="sm" className="text-[12px] text-gray-400 h-7 px-2 gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-gray-100">
            {data.map((payment, i) => {
              const MethodIcon = methodIcons[payment.method] || CreditCard
              return (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.8 + i * 0.06 }}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 cursor-pointer"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 shrink-0">
                    <MethodIcon className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-gray-900 truncate">{payment.memberName}</p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-gray-400">{methodLabels[payment.method]}</span>
                      <span className="text-[11px] text-gray-300">·</span>
                      <span className="text-[11px] text-gray-400 font-mono">{payment.invoiceNumber}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[13px] font-semibold text-gray-900 tabular-nums">{formatCurrency(payment.amount)}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Badge variant={statusBadge[payment.status]} className="text-[9px]">{payment.status}</Badge>
                      <span className="text-[10px] text-gray-400">{payment.date}</span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
