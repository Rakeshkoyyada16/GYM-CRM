import { Search, X, Download, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { AttendanceFilters as Filters, AttendanceStatus } from '../types/attendance.types'
import { STATUS_LABELS } from '../utils/attendanceUtils'
import { getClasses } from '../utils/mockData'

interface AttendanceFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  onExport: () => void
  resultCount: number
}

const classes = getClasses()

export function AttendanceFilters({ filters, onFiltersChange, onExport, resultCount }: AttendanceFiltersProps) {
  const activeCount = [
    filters.status !== 'all',
    filters.classFilter !== 'all',
    !!filters.dateFrom,
    !!filters.dateTo,
  ].filter(Boolean).length

  const clear = () => {
    onFiltersChange({ search: '', status: 'all', dateFrom: '', dateTo: '', classFilter: 'all' })
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by member name, email, or class…"
            value={filters.search}
            onChange={e => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-9 pr-8 h-9"
          />
          {filters.search && (
            <button onClick={() => onFiltersChange({ ...filters, search: '' })} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="mr-1.5 h-3.5 w-3.5" /> Export CSV
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 text-[13px] text-gray-500">
          <Filter className="h-3.5 w-3.5" />
          <span>Filters</span>
        </div>

        <Select value={filters.status} onValueChange={v => onFiltersChange({ ...filters, status: v as AttendanceStatus | 'all' })}>
          <SelectTrigger className="w-[130px] h-8 text-[12px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {Object.entries(STATUS_LABELS).map(([k, l]) => <SelectItem key={k} value={k}>{l}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={filters.classFilter} onValueChange={v => onFiltersChange({ ...filters, classFilter: v })}>
          <SelectTrigger className="w-[160px] h-8 text-[12px]"><SelectValue placeholder="Class" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>

        <Input
          type="date"
          value={filters.dateFrom}
          onChange={e => onFiltersChange({ ...filters, dateFrom: e.target.value })}
          className="w-[140px] h-8 text-[12px]"
          placeholder="From"
        />
        <Input
          type="date"
          value={filters.dateTo}
          onChange={e => onFiltersChange({ ...filters, dateTo: e.target.value })}
          className="w-[140px] h-8 text-[12px]"
          placeholder="To"
        />

        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clear} className="h-8 text-[12px] text-gray-500">
            <X className="mr-1 h-3 w-3" /> Clear ({activeCount})
          </Button>
        )}

        <span className="ml-auto text-[12px] text-gray-400">{resultCount} record{resultCount !== 1 ? 's' : ''}</span>
      </div>
    </div>
  )
}
