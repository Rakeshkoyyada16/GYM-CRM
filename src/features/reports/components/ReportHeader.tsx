import { motion } from 'framer-motion'
import { Download, FileText, FileSpreadsheet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ReportPeriod } from '../types/report.types'
import { PERIOD_LABELS } from '../utils/reportUtils'

interface ReportHeaderProps {
  title: string
  description: string
  currentPeriod: ReportPeriod
  onPeriodChange: (period: ReportPeriod) => void
  onExportPDF: () => void
  onExportCSV: () => void
}

const periods: ReportPeriod[] = ['7d', '30d', '90d', '12m']

export function ReportHeader({ title, description, currentPeriod, onPeriodChange, onExportPDF, onExportCSV }: ReportHeaderProps) {
  return (
    <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h1>
        <p className="text-[13px] text-gray-500 mt-0.5">{description}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-lg border border-gray-200 bg-white p-0.5">
          {periods.map(p => (
            <button key={p} onClick={() => onPeriodChange(p)}
              className={`rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors ${currentPeriod === p ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-700'}`}>
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={onExportCSV}>
          <FileSpreadsheet className="mr-1.5 h-3.5 w-3.5" /> Excel
        </Button>
        <Button variant="outline" size="sm" onClick={onExportPDF}>
          <FileText className="mr-1.5 h-3.5 w-3.5" /> PDF
        </Button>
      </div>
    </motion.div>
  )
}
