import { motion } from 'framer-motion'
import { Users, Star, Award, IndianRupee, Calendar, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { Trainer } from '../types/trainer.types'
import { formatSalary } from '../utils/trainerUtils'

interface TrainerStatsBarProps {
  trainers: Trainer[]
  isLoading: boolean
}

export function TrainerStatsBar({ trainers, isLoading }: TrainerStatsBarProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}><CardContent className="p-4"><Skeleton className="h-14 w-full" /></CardContent></Card>
        ))}
      </div>
    )
  }

  const active = trainers.filter(t => t.status === 'active')
  const avgRating = active.length > 0 ? (active.reduce((s, t) => s + t.rating, 0) / active.length).toFixed(1) : '0'
  const totalClients = active.reduce((s, t) => s + t.totalClients, 0)
  const avgExperience = active.length > 0 ? Math.round(active.reduce((s, t) => s + t.experience, 0) / active.length) : 0
  const totalSalary = trainers.reduce((s, t) => s + t.salary, 0)
  const onLeave = trainers.filter(t => t.status === 'on_leave').length

  const cards = [
    { label: 'Active Trainers', value: String(active.length), icon: Users, color: 'text-brand-600', bg: 'bg-brand-50' },
    { label: 'Avg Rating', value: avgRating, icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Total Clients', value: String(totalClients), icon: Award, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Avg Experience', value: `${avgExperience}y`, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Monthly Payroll', value: formatSalary(totalSalary), icon: IndianRupee, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'On Leave', value: String(onLeave), icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card, i) => {
        const Icon = card.icon
        return (
          <motion.div key={card.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}>
            <Card className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-2.5">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.bg}`}>
                    <Icon className={`h-4 w-4 ${card.color}`} />
                  </div>
                  <div>
                    <p className="text-[18px] font-bold text-gray-900 tabular-nums leading-none">{card.value}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{card.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
