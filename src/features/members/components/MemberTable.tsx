import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  MoreHorizontal, Eye, Edit, Trash2, UserCheck, ArrowUpDown,
  ArrowUp, ArrowDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import type { Member, SortConfig, PaginationConfig } from '../types/member.types'
import { getMemberInitials, getStatusVariant, getMembershipVariant, daysUntilExpiry } from '../utils/memberUtils'

interface MemberTableProps {
  members: Member[]
  isLoading: boolean
  sort: SortConfig
  onSortChange: (sort: SortConfig) => void
  pagination: PaginationConfig & { totalPages: number }
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  selectedIds: Set<string>
  onToggleSelect: (id: string) => void
  onToggleSelectAll: () => void
  onView: (member: Member) => void
  onEdit: (member: Member) => void
  onDelete: (member: Member) => void
  onCheckIn: (member: Member) => void
}

const sortableColumns: { key: SortConfig['field']; label: string }[] = [
  { key: 'name', label: 'Member' },
  { key: 'status', label: 'Status' },
  { key: 'membershipType', label: 'Plan' },
  { key: 'amount', label: 'Amount' },
  { key: 'joinDate', label: 'Joined' },
  { key: 'lastVisit', label: 'Last Visit' },
]

export function MemberTable({
  members, isLoading, sort, onSortChange, pagination, onPageChange, onPageSizeChange,
  selectedIds, onToggleSelect, onToggleSelectAll,
  onView, onEdit, onDelete, onCheckIn,
}: MemberTableProps) {
  const allSelected = members.length > 0 && selectedIds.size === members.length

  const handleSort = (field: SortConfig['field']) => {
    if (sort.field === field) {
      onSortChange({ field, direction: sort.direction === 'asc' ? 'desc' : 'asc' })
    } else {
      onSortChange({ field, direction: 'asc' })
    }
  }

  const SortIcon = ({ field }: { field: SortConfig['field'] }) => {
    if (sort.field !== field) return <ArrowUpDown className="h-3 w-3 text-gray-300" />
    return sort.direction === 'asc'
      ? <ArrowUp className="h-3 w-3 text-brand-600" />
      : <ArrowDown className="h-3 w-3 text-brand-600" />
  }

  if (isLoading) {
    return (
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10"><Skeleton className="h-4 w-4 rounded" /></TableHead>
              <TableHead>Member</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Last Visit</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 8 }).map((_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                <TableCell><Skeleton className="h-4 w-4 rounded" /></TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-3.5 w-28" />
                      <Skeleton className="h-2.5 w-36" />
                    </div>
                  </div>
                </TableCell>
                <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-3.5 w-16" /></TableCell>
                <TableCell><Skeleton className="h-3.5 w-20" /></TableCell>
                <TableCell><Skeleton className="h-3.5 w-20" /></TableCell>
                <TableCell><Skeleton className="h-7 w-7 rounded" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (members.length === 0) {
    return null // Handled by parent EmptyState
  }

  return (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent bg-gray-50/80">
              <TableHead className="w-10 pl-4">
                <Checkbox checked={allSelected} onCheckedChange={onToggleSelectAll} />
              </TableHead>
              {sortableColumns.map(col => (
                <TableHead key={col.key}>
                  <button
                    className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={() => handleSort(col.key)}
                  >
                    {col.label}
                    <SortIcon field={col.key} />
                  </button>
                </TableHead>
              ))}
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member, i) => {
              const isSelected = selectedIds.has(member.id)
              const expiryDays = daysUntilExpiry(member.membership.endDate)
              const isExpiringSoon = expiryDays > 0 && expiryDays <= 30

              return (
                <motion.tr
                  key={member.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  className={cn(
                    'border-b border-gray-100 transition-colors cursor-pointer',
                    isSelected ? 'bg-brand-50/50' : 'hover:bg-gray-50/60'
                  )}
                  onClick={() => onView(member)}
                >
                  <TableCell className="pl-4" onClick={e => e.stopPropagation()}>
                    <Checkbox checked={isSelected} onCheckedChange={() => onToggleSelect(member.id)} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="bg-gray-100 text-gray-600 text-[10px] font-semibold">
                          {getMemberInitials(member)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-gray-900 truncate">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="text-[11px] text-gray-400 truncate">{member.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(member.status)} className="text-[10px] capitalize">
                      {member.status}
                    </Badge>
                    {isExpiringSoon && (
                      <span className="block text-[10px] text-amber-600 mt-0.5">
                        Expires in {expiryDays}d
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getMembershipVariant(member.membership.type)} className="text-[10px]">
                      {member.membership.planName}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-[13px] font-semibold text-gray-900 tabular-nums">
                      {formatCurrency(member.membership.price)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-[12px] text-gray-500">{formatDate(member.joinDate)}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-[12px] text-gray-500">
                      {member.lastVisit ? formatDate(member.lastVisit) : '—'}
                    </span>
                  </TableCell>
                  <TableCell onClick={e => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" className="text-gray-400">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(member)}>
                          <Eye className="mr-2 h-3.5 w-3.5" /> View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(member)}>
                          <Edit className="mr-2 h-3.5 w-3.5" /> Edit Member
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onCheckIn(member)}>
                          <UserCheck className="mr-2 h-3.5 w-3.5" /> Quick Check-in
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onDelete(member)} className="text-red-600 focus:text-red-600">
                          <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete Member
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-gray-500">
            Showing {((pagination.page - 1) * pagination.pageSize) + 1}–{Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total}
          </span>
          <select
            value={pagination.pageSize}
            onChange={e => onPageSizeChange(Number(e.target.value))}
            className="h-7 rounded-md border border-gray-200 bg-white px-2 text-[12px] text-gray-600"
          >
            {[10, 20, 50].map(size => (
              <option key={size} value={size}>{size} / page</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon-sm" onClick={() => onPageChange(1)} disabled={pagination.page === 1}>
            <ChevronsLeft className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="icon-sm" onClick={() => onPageChange(pagination.page - 1)} disabled={pagination.page === 1}>
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>

          {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
            let pageNum: number
            if (pagination.totalPages <= 5) {
              pageNum = i + 1
            } else if (pagination.page <= 3) {
              pageNum = i + 1
            } else if (pagination.page >= pagination.totalPages - 2) {
              pageNum = pagination.totalPages - 4 + i
            } else {
              pageNum = pagination.page - 2 + i
            }
            return (
              <Button
                key={pageNum}
                variant={pageNum === pagination.page ? 'default' : 'outline'}
                size="icon-sm"
                onClick={() => onPageChange(pageNum)}
                className="text-[12px]"
              >
                {pageNum}
              </Button>
            )
          })}

          <Button variant="outline" size="icon-sm" onClick={() => onPageChange(pagination.page + 1)} disabled={pagination.page === pagination.totalPages}>
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="icon-sm" onClick={() => onPageChange(pagination.totalPages)} disabled={pagination.page === pagination.totalPages}>
            <ChevronsRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
