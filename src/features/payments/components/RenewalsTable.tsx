import { motion } from 'framer-motion'
import { RefreshCw, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { getInitials, cn } from '@/lib/utils'
import type { RenewalRecord } from '../types/payment.types'
import { formatCurrency, getRenewalStatusVariant, getRenewalStatusLabel } from '../utils/paymentUtils'

interface RenewalsTableProps {
  renewals: RenewalRecord[]
  isLoading: boolean
  onRenew?: (record: RenewalRecord) => void
}

export function RenewalsTable({ renewals, isLoading, onRenew }: RenewalsTableProps) {
  if (isLoading) {
    return <Card><CardHeader><Skeleton className="h-4 w-36" /></CardHeader><CardContent className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}
    </CardContent></Card>
  }

  const sorted = [...renewals].sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry)
  const urgent = sorted.filter(r => r.status === 'expired' || r.status === 'overdue' || (r.status === 'expiring_soon' && r.daysUntilExpiry <= 7))

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.6 }}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-0">
          <div>
            <CardTitle className="text-[13px]">Membership Renewals</CardTitle>
            {urgent.length > 0 && (
              <p className="text-[11px] text-amber-600 mt-0.5 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> {urgent.length} need attention
              </p>
            )}
          </div>
          <Badge variant="gray">{renewals.length} total</Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sorted.map((record, i) => (
              <motion.div key={record.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: 0.7 + i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors group">
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback className="bg-gray-100 text-gray-600 text-[10px] font-semibold">
                    {getInitials(record.memberName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-medium text-gray-900 truncate">{record.memberName}</p>
                    <Badge variant={getRenewalStatusVariant(record.status)} className="text-[9px]">
                      {getRenewalStatusLabel(record.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[11px] text-gray-400">{record.currentPlan}</span>
                    <span className="text-[11px] text-gray-400">·</span>
                    <span className={cn('text-[11px] tabular-nums',
                      record.daysUntilExpiry < 0 ? 'text-red-500 font-medium' :
                      record.daysUntilExpiry <= 7 ? 'text-amber-500 font-medium' : 'text-gray-400'
                    )}>
                      {record.daysUntilExpiry < 0
                        ? `${Math.abs(record.daysUntilExpiry)}d overdue`
                        : `${record.daysUntilExpiry}d left`}
                    </span>
                    <span className="text-[11px] text-gray-400">·</span>
                    <span className="text-[11px] text-gray-500">{formatCurrency(record.lastPayment)}</span>
                    {record.autoRenew && (
                      <span className="flex items-center gap-0.5 text-[10px] text-green-600">
                        <RefreshCw className="h-2.5 w-2.5" /> Auto
                      </span>
                    )}
                  </div>
                </div>
                {(record.status === 'expired' || record.status === 'expiring_soon') && (
                  <Button variant="outline" size="sm" className="h-7 text-[11px] px-2.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onRenew?.(record)}>
                    <RefreshCw className="mr-1 h-3 w-3" /> Renew
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
