import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getInitials, formatCurrency } from '@/lib/utils'
import type { RecentMember } from '../types/dashboard.types'

interface RecentMembersProps {
  data: RecentMember[] | null
  isLoading: boolean
}

const planBadge: Record<string, 'default' | 'gray' | 'premium' | 'vip'> = {
  basic: 'gray', standard: 'default', premium: 'premium', vip: 'vip',
}

const statusBadge: Record<string, 'success' | 'warning' | 'error'> = {
  active: 'success', pending: 'warning', expired: 'error',
}

export function RecentMembers({ data, isLoading }: RecentMembersProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-4 w-28" /></CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-2.5 w-40" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
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
      transition={{ duration: 0.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-0">
          <CardTitle>Recent Members</CardTitle>
          <Button variant="ghost" size="sm" className="text-[12px] text-gray-400 h-7 px-2 gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-gray-100">
            {data.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 + i * 0.06 }}
                className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 group cursor-pointer"
              >
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback className="bg-gray-100 text-gray-600 text-[11px] font-semibold">
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-medium text-gray-900 truncate">{member.name}</p>
                    <Badge variant={planBadge[member.planType]} className="text-[9px] shrink-0">
                      {member.planType}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-gray-400 truncate">{member.plan} · {member.joinedAt}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[13px] font-semibold text-gray-900 tabular-nums">{formatCurrency(member.amount)}</p>
                  <Badge variant={statusBadge[member.status]} className="text-[9px] mt-0.5">
                    {member.status}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
