import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { PaymentMethodBreakdown, PaymentTypeBreakdown } from '../types/payment.types'
import { formatCurrencyShort, METHOD_LABELS, TYPE_LABELS } from '../utils/paymentUtils'

interface PaymentMethodsChartProps {
  data: PaymentMethodBreakdown[]
  isLoading: boolean
}

const METHOD_COLORS: Record<string, string> = {
  upi: '#4361ee', netbanking: '#37b24d', card: '#f59f00', cash: '#868e96', wallet: '#748ffc', cheque: '#adb5bd',
}
const TYPE_COLORS = ['#4361ee', '#37b24d', '#f59f00', '#748ffc', '#868e96']

export function PaymentMethodsChart({ data, isLoading }: PaymentMethodsChartProps) {
  if (isLoading) {
    return <Card><CardHeader><Skeleton className="h-4 w-32" /></CardHeader><CardContent><Skeleton className="h-40 w-full" /></CardContent></Card>
  }

  const activeMethods = data.filter(d => d.count > 0)

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.4 }}>
      <Card>
        <CardHeader className="pb-0"><CardTitle className="text-[13px]">Payment Methods</CardTitle></CardHeader>
        <CardContent className="space-y-3 pt-4">
          {activeMethods.map((method, i) => (
            <div key={method.method} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-gray-700">{METHOD_LABELS[method.method]}</span>
                <span className="text-[12px] text-gray-500 tabular-nums">{formatCurrencyShort(method.amount)} · {method.count} txns</span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${method.percentage}%` }}
                  transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
                  className="h-full rounded-full" style={{ backgroundColor: METHOD_COLORS[method.method] || '#4361ee' }} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface TypeBreakdownProps {
  data: PaymentTypeBreakdown[]
  isLoading: boolean
}

export function TypeBreakdown({ data, isLoading }: TypeBreakdownProps) {
  if (isLoading) {
    return <Card><CardHeader><Skeleton className="h-4 w-28" /></CardHeader><CardContent><Skeleton className="h-40 w-full" /></CardContent></Card>
  }

  const activeTypes = data.filter(d => d.count > 0)

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.5 }}>
      <Card>
        <CardHeader className="pb-0"><CardTitle className="text-[13px]">Revenue by Type</CardTitle></CardHeader>
        <CardContent className="space-y-3 pt-4">
          {activeTypes.map((item, i) => (
            <div key={item.type} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-gray-700">{TYPE_LABELS[item.type]}</span>
                <span className="text-[12px] text-gray-500 tabular-nums">{formatCurrencyShort(item.amount)}</span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${item.percentage}%` }}
                  transition={{ duration: 0.6, delay: 0.6 + i * 0.1 }}
                  className="h-full rounded-full" style={{ backgroundColor: TYPE_COLORS[i % TYPE_COLORS.length] }} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )
}
