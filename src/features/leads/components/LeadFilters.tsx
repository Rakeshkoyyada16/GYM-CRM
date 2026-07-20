import { Search, X, SlidersHorizontal, UserPlus, LayoutGrid, List } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { LeadFilters as Filters, LeadStatus, LeadSource, LeadPriority } from '../types/lead.types'
import { SOURCE_LABELS, PRIORITY_LABELS, STATUS_LABELS } from '../utils/leadUtils'
import { getStaff } from '../utils/mockData'

interface LeadFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  onAddLead: () => void
  resultCount: number
  viewMode: 'pipeline' | 'table'
  onViewModeChange: (mode: 'pipeline' | 'table') => void
}

const staff = getStaff()

export function LeadFilters({
  filters, onFiltersChange, onAddLead, resultCount, viewMode, onViewModeChange,
}: LeadFiltersProps) {
  const activeFilterCount = [
    filters.status !== 'all',
    filters.source !== 'all',
    filters.priority !== 'all',
    filters.assignedTo !== 'all',
  ].filter(Boolean).length

  const clearFilters = () => {
    onFiltersChange({ search: '', status: 'all', source: 'all', priority: 'all', assignedTo: 'all', dateRange: 'all' })
  }

  return (
    <div className="space-y-3">
      {/* Top row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search leads by name, email, phone…"
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

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-gray-200 bg-white p-0.5">
            <button
              onClick={() => onViewModeChange('pipeline')}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-colors ${viewMode === 'pipeline' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <LayoutGrid className="h-3.5 w-3.5" /> Pipeline
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-colors ${viewMode === 'table' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <List className="h-3.5 w-3.5" /> Table
            </button>
          </div>
          <Button size="sm" onClick={onAddLead}>
            <UserPlus className="mr-1.5 h-3.5 w-3.5" /> Add Lead
          </Button>
        </div>
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 text-[13px] text-gray-500">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Filters</span>
        </div>

        <Select value={filters.status} onValueChange={v => onFiltersChange({ ...filters, status: v as LeadStatus | 'all' })}>
          <SelectTrigger className="w-[140px] h-8 text-[12px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.source} onValueChange={v => onFiltersChange({ ...filters, source: v as LeadSource | 'all' })}>
          <SelectTrigger className="w-[140px] h-8 text-[12px]"><SelectValue placeholder="Source" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {Object.entries(SOURCE_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.priority} onValueChange={v => onFiltersChange({ ...filters, priority: v as LeadPriority | 'all' })}>
          <SelectTrigger className="w-[130px] h-8 text-[12px]"><SelectValue placeholder="Priority" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.assignedTo} onValueChange={v => onFiltersChange({ ...filters, assignedTo: v })}>
          <SelectTrigger className="w-[150px] h-8 text-[12px]"><SelectValue placeholder="Assigned" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Staff</SelectItem>
            <SelectItem value="unassigned">Unassigned</SelectItem>
            {staff.map(s => (
              <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-[12px] text-gray-500">
            <X className="mr-1 h-3 w-3" /> Clear ({activeFilterCount})
          </Button>
        )}

        <span className="ml-auto text-[12px] text-gray-400">{resultCount} lead{resultCount !== 1 ? 's' : ''}</span>
      </div>
    </div>
  )
}
