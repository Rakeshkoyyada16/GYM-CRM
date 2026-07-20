import { Search, X, LayoutGrid, List, UserPlus, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { TrainerFilters as Filters, TrainerStatus, Specialization } from '../types/trainer.types'
import { STATUS_LABELS, SPECIALIZATION_LABELS } from '../utils/trainerUtils'

interface TrainerFiltersProps {
  filters: Filters
  onFiltersChange: (f: Filters) => void
  onAdd: () => void
  resultCount: number
  viewMode: 'grid' | 'table'
  onViewModeChange: (m: 'grid' | 'table') => void
}

export function TrainerFilters({ filters, onFiltersChange, onAdd, resultCount, viewMode, onViewModeChange }: TrainerFiltersProps) {
  const activeCount = [filters.status !== 'all', filters.specialization !== 'all'].filter(Boolean).length
  const clear = () => onFiltersChange({ search: '', status: 'all', specialization: 'all' })

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search trainers by name, email, or specialization…"
            value={filters.search} onChange={e => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-9 pr-8 h-9" />
          {filters.search && (
            <button onClick={() => onFiltersChange({ ...filters, search: '' })} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-gray-200 bg-white p-0.5">
            <button onClick={() => onViewModeChange('grid')}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-colors ${viewMode === 'grid' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-700'}`}>
              <LayoutGrid className="h-3.5 w-3.5" /> Grid
            </button>
            <button onClick={() => onViewModeChange('table')}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-colors ${viewMode === 'table' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-700'}`}>
              <List className="h-3.5 w-3.5" /> Table
            </button>
          </div>
          <Button size="sm" onClick={onAdd}><UserPlus className="mr-1.5 h-3.5 w-3.5" /> Add Trainer</Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 text-[13px] text-gray-500"><SlidersHorizontal className="h-3.5 w-3.5" /><span>Filters</span></div>
        <Select value={filters.status} onValueChange={v => onFiltersChange({ ...filters, status: v as TrainerStatus | 'all' })}>
          <SelectTrigger className="w-[130px] h-8 text-[12px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {Object.entries(STATUS_LABELS).map(([k, l]) => <SelectItem key={k} value={k}>{l}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filters.specialization} onValueChange={v => onFiltersChange({ ...filters, specialization: v as Specialization | 'all' })}>
          <SelectTrigger className="w-[150px] h-8 text-[12px]"><SelectValue placeholder="Specialization" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Specializations</SelectItem>
            {Object.entries(SPECIALIZATION_LABELS).map(([k, l]) => <SelectItem key={k} value={k}>{l}</SelectItem>)}
          </SelectContent>
        </Select>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clear} className="h-8 text-[12px] text-gray-500">
            <X className="mr-1 h-3 w-3" /> Clear ({activeCount})
          </Button>
        )}
        <span className="ml-auto text-[12px] text-gray-400">{resultCount} trainer{resultCount !== 1 ? 's' : ''}</span>
      </div>
    </div>
  )
}
