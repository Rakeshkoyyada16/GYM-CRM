import { motion } from 'framer-motion'
import { Trash2, X, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { LeadStatus } from '../types/lead.types'
import { STATUS_LABELS } from '../utils/leadUtils'

interface BulkActionsProps {
  count: number
  onDelete: () => void
  onStatusChange: (status: LeadStatus) => void
  onClear: () => void
}

export function BulkActions({ count, onDelete, onStatusChange, onClear }: BulkActionsProps) {
  if (count === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="flex items-center gap-3 rounded-lg border border-brand-200 bg-brand-50 px-4 py-2.5"
    >
      <span className="text-[13px] font-medium text-brand-700">
        {count} lead{count !== 1 ? 's' : ''} selected
      </span>
      <div className="flex items-center gap-1.5 ml-auto">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-brand-600">Move to:</span>
          <Select onValueChange={v => onStatusChange(v as LeadStatus)}>
            <SelectTrigger className="w-[140px] h-7 text-[11px] bg-white"><SelectValue placeholder="Select status" /></SelectTrigger>
            <SelectContent>
              {Object.entries(STATUS_LABELS).filter(([k]) => k !== 'converted' && k !== 'lost').map(([k, l]) => (
                <SelectItem key={k} value={k}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm" className="h-7 text-[12px] bg-white text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={onDelete}>
          <Trash2 className="mr-1 h-3 w-3" /> Delete
        </Button>
        <Button variant="ghost" size="icon-sm" className="h-7 w-7 text-gray-400" onClick={onClear}>
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </motion.div>
  )
}
