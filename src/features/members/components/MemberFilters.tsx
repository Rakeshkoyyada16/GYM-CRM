import { Search, X, SlidersHorizontal, Download, Upload, UserPlus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { MemberFilters as Filters, MemberStatus, MembershipType, Gender } from '../types/member.types'

interface MemberFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  onAddMember: () => void
  onExport: () => void
  onImport: () => void
  resultCount: number
}

export function MemberFilters({
  filters, onFiltersChange, onAddMember, onExport, onImport, resultCount,
}: MemberFiltersProps) {
  const activeFilterCount = [
    filters.status !== 'all',
    filters.membershipType !== 'all',
    filters.gender !== 'all',
    filters.dateRange !== 'all',
  ].filter(Boolean).length

  const clearFilters = () => {
    onFiltersChange({ search: '', status: 'all', membershipType: 'all', gender: 'all', dateRange: 'all' })
  }

  return (
    <div className="space-y-3">
      {/* Top row: Search + Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, email, phone, or ID…"
              value={filters.search}
              onChange={e => onFiltersChange({ ...filters, search: e.target.value })}
              className="pl-9 pr-8 h-9"
            />
            {filters.search && (
              <button
                onClick={() => onFiltersChange({ ...filters, search: '' })}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onImport}>
            <Upload className="mr-1.5 h-3.5 w-3.5" />
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Export
          </Button>
          <Button size="sm" onClick={onAddMember}>
            <UserPlus className="mr-1.5 h-3.5 w-3.5" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 text-[13px] text-gray-500">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Filters</span>
        </div>

        <Select value={filters.status} onValueChange={v => onFiltersChange({ ...filters, status: v as MemberStatus | 'all' })}>
          <SelectTrigger className="w-[130px] h-8 text-[12px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.membershipType} onValueChange={v => onFiltersChange({ ...filters, membershipType: v as MembershipType | 'all' })}>
          <SelectTrigger className="w-[140px] h-8 text-[12px]">
            <SelectValue placeholder="Plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value="basic">Basic</SelectItem>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
            <SelectItem value="vip">VIP</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.gender} onValueChange={v => onFiltersChange({ ...filters, gender: v as Gender | 'all' })}>
          <SelectTrigger className="w-[130px] h-8 text-[12px]">
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Gender</SelectItem>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-[12px] text-gray-500">
            <X className="mr-1 h-3 w-3" />
            Clear ({activeFilterCount})
          </Button>
        )}

        <span className="ml-auto text-[12px] text-gray-400">
          {resultCount} member{resultCount !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  )
}
