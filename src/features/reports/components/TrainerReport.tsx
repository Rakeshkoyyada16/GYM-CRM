import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { BarChart } from './ChartCard'
import { KPICards } from './KPICards'
import { useTrainerReport } from '../hooks/useReports'
import { formatCurrencyShort } from '@/lib/utils'
import type { KPIMetric } from '../types/report.types'

export function TrainerReport() {
  const { data, summary } = useTrainerReport()

  const kpis: KPIMetric[] = [
    { label: 'Total Trainers', value: summary.data?.totalTrainers || 0, format: 'number' },
    { label: 'Avg Rating', value: summary.data?.avgRating?.toFixed(1) || '0', format: 'number' },
    { label: 'Avg Retention', value: summary.data?.avgClientRetention || 0, format: 'percentage', suffix: '%' },
    { label: 'Classes This Period', value: summary.data?.totalClassesThisPeriod || 0, format: 'number' },
    { label: 'Top Performer', value: summary.data?.topPerformer || '—', format: 'number' },
  ]

  return (
    <div className="space-y-4">
      <KPICards metrics={kpis} isLoading={summary.isLoading} cols={5} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BarChart
          title="Classes by Trainer"
          isLoading={data.isLoading}
          data={(data.data || []).map(d => ({ label: d.name.split(' ')[0], value: d.classes }))}
          delay={0.2}
        />
        <BarChart
          title="Revenue by Trainer"
          isLoading={data.isLoading}
          data={(data.data || []).map(d => ({ label: d.name.split(' ')[0], value: d.revenue }))}
          format="currency"
          delay={0.3}
        />
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.4 }}>
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-[13px]">Trainer Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {data.isLoading ? (
              <div className="space-y-3">{Array.from({length:4}).map((_,i)=><Skeleton key={i} className="h-14 w-full"/>)}</div>
            ) : (
              <div className="space-y-2">
                {(data.data || []).map((trainer, i) => (
                  <div key={trainer.name} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                    <span className="text-[11px] font-bold text-gray-300 w-4 text-center">{i + 1}</span>
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarFallback className="bg-gray-100 text-gray-600 text-[10px] font-semibold">
                        {trainer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-gray-900 truncate">{trainer.name}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-0.5 text-[11px] text-amber-600">
                          <Star className="h-3 w-3 fill-amber-400" /> {trainer.rating}
                        </span>
                        <span className="text-[11px] text-gray-400">{trainer.clients} clients</span>
                        <span className="text-[11px] text-gray-400">{trainer.classes} classes</span>
                        <span className="text-[11px] text-gray-400">{trainer.retention}% retention</span>
                      </div>
                    </div>
                    <span className="text-[13px] font-semibold text-gray-900 tabular-nums">{formatCurrencyShort(trainer.revenue)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
