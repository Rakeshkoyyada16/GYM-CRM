import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

import { ReportHeader } from '../components/ReportHeader'
import { RevenueReport } from '../components/RevenueReport'
import { AttendanceReport } from '../components/AttendanceReport'
import { MembershipReport } from '../components/MembershipReport'
import { LeadReport } from '../components/LeadReport'
import { TrainerReport } from '../components/TrainerReport'
import { PaymentReport } from '../components/PaymentReport'

import { useDateRange } from '../hooks/useReports'
import { exportToCSV, exportToPDF } from '../utils/mockData'
import { PERIOD_LABELS } from '../utils/reportUtils'

const TAB_CONFIG = [
  { id: 'revenue', label: 'Revenue' },
  { id: 'attendance', label: 'Attendance' },
  { id: 'memberships', label: 'Memberships' },
  { id: 'leads', label: 'Leads' },
  { id: 'trainers', label: 'Trainers' },
  { id: 'payments', label: 'Payments' },
]

export function ReportsPage() {
  const { dateRange, setPeriod } = useDateRange()
  const [activeTab, setActiveTab] = useState('revenue')

  const handleExportPDF = useCallback(() => {
    exportToPDF({
      title: `${TAB_CONFIG.find(t => t.id === activeTab)?.label || 'Gym'} Report`,
      period: `${PERIOD_LABELS[dateRange.period]} (${dateRange.from} to ${dateRange.to})`,
      generatedAt: new Date().toLocaleString('en-IN'),
      sections: [
        {
          heading: 'Summary',
          data: [{ Metric: 'Report Period', Value: PERIOD_LABELS[dateRange.period] }, { Metric: 'Generated', Value: new Date().toLocaleString('en-IN') }],
        },
      ],
    })
    toast.success('PDF exported')
  }, [activeTab, dateRange])

  const handleExportCSV = useCallback(() => {
    exportToCSV(
      `${activeTab}-report`,
      ['Metric', 'Value'],
      [
        ['Report Period', PERIOD_LABELS[dateRange.period]],
        ['From', dateRange.from],
        ['To', dateRange.to],
        ['Generated', new Date().toLocaleString('en-IN')],
      ]
    )
    toast.success('CSV exported')
  }, [activeTab, dateRange])

  return (
    <div className="space-y-6">
      <ReportHeader
        title="Reports & Analytics"
        description="Comprehensive insights into your gym's performance."
        currentPeriod={dateRange.period}
        onPeriodChange={setPeriod}
        onExportPDF={handleExportPDF}
        onExportCSV={handleExportCSV}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <ScrollArea className="w-full">
          <TabsList className="inline-flex w-max">
            {TAB_CONFIG.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <TabsContent value="revenue">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <RevenueReport />
          </motion.div>
        </TabsContent>

        <TabsContent value="attendance">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <AttendanceReport />
          </motion.div>
        </TabsContent>

        <TabsContent value="memberships">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <MembershipReport />
          </motion.div>
        </TabsContent>

        <TabsContent value="leads">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <LeadReport />
          </motion.div>
        </TabsContent>

        <TabsContent value="trainers">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <TrainerReport />
          </motion.div>
        </TabsContent>

        <TabsContent value="payments">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <PaymentReport />
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
