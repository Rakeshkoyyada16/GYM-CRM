import { motion } from 'framer-motion'
import {
  MoreHorizontal, Eye, Edit, Trash2, ArrowUpDown, ArrowUp, ArrowDown,
  UserCheck, Phone, Mail, Calendar,
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
import { cn } from '@/lib/utils'
import type { Lead, LeadStatus } from '../types/lead.types'
import {
  getLeadInitials, getPriorityVariant, getStatusVariant,
  PRIORITY_LABELS, STATUS_LABELS, SOURCE_LABELS, formatCurrencyShort,
  isFollowUpDue, isFollowUpSoon,
} from '../utils/leadUtils'

interface LeadTableProps {
  leads: Lead[]
  isLoading: boolean
  sortField: string
  sortDir: 'asc' | 'desc'
  onSort: (field: string) => void
  selectedIds: Set<string>
  onToggleSelect: (id: string) => void
  onToggleSelectAll: () => void
  onView: (lead: Lead) => void
  onEdit: (lead: Lead) => void
  onDelete: (lead: Lead) => void
  onConvert: (lead: Lead) => void
  onStatusChange: (lead: Lead, status: LeadStatus) => void
}

const columns: { key: string; label: string }[] = [
  { key: 'name', label: 'Lead' },
  { key: 'status', label: 'Status' },
  { key: 'source', label: 'Source' },
  { key: 'priority', label: 'Priority' },
  { key: 'value', label: 'Value' },
  { key: 'assignedTo', label: 'Assigned' },
  { key: 'followUpDate', label: 'Follow-up' },
  { key: 'createdAt', label: 'Created' },
]

export function LeadTable({
  leads, isLoading, sortField, sortDir, onSort,
  selectedIds, onToggleSelect, onToggleSelectAll,
  onView, onEdit, onDelete, onConvert, onStatusChange,
}: LeadTableProps) {
  const allSelected = leads.length > 0 && selectedIds.size === leads.length

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 text-gray-300" />
    return sortDir === 'asc' ? <ArrowUp className="h-3 w-3 text-brand-600" /> : <ArrowDown className="h-3 w-3 text-brand-600" />
  }

  if (isLoading) {
    return (
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent bg-gray-50/80">
              <TableHead className="w-10 pl-4"><Skeleton className="h-4 w-4 rounded" /></TableHead>
              {columns.map(c => <TableHead key={c.key}><Skeleton className="h-3.5 w-16" /></TableHead>)}
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 6 }).map((_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                <TableCell className="pl-4"><Skeleton className="h-4 w-4 rounded" /></TableCell>
                <TableCell><div className="flex items-center gap-2"><Skeleton className="h-8 w-8 rounded-full" /><div className="space-y-1.5"><Skeleton className="h-3.5 w-24" /><Skeleton className="h-2.5 w-32" /></div></div></TableCell>
                <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-5 w-12 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-3.5 w-16" /></TableCell>
                <TableCell><Skeleton className="h-6 w-6 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-3.5 w-16" /></TableCell>
                <TableCell><Skeleton className="h-3.5 w-16" /></TableCell>
                <TableCell><Skeleton className="h-7 w-7 rounded" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (leads.length === 0) return null

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent bg-gray-50/80">
            <TableHead className="w-10 pl-4">
              <Checkbox checked={allSelected} onCheckedChange={onToggleSelectAll} />
            </TableHead>
            {columns.map(col => (
              <TableHead key={col.key}>
                <button
                  className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => onSort(col.key)}
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
          {leads.map((lead, i) => {
            const isSelected = selectedIds.has(lead.id)
            const due = isFollowUpDue(lead)
            const soon = isFollowUpSoon(lead)

            return (
              <motion.tr
                key={lead.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15, delay: i * 0.02 }}
                className={cn(
                  'border-b border-gray-100 transition-colors cursor-pointer',
                  isSelected ? 'bg-brand-50/50' : 'hover:bg-gray-50/60'
                )}
                onClick={() => onView(lead)}
              >
                <TableCell className="pl-4" onClick={e => e.stopPropagation()}>
                  <Checkbox checked={isSelected} onCheckedChange={() => onToggleSelect(lead.id)} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-gray-100 text-gray-600 text-[10px] font-semibold">
                        {getLeadInitials(lead)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-gray-900 truncate">{lead.firstName} {lead.lastName}</p>
                      <p className="text-[11px] text-gray-400 truncate">{lead.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(lead.status)} className="text-[10px]">
                    {STATUS_LABELS[lead.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-[12px] text-gray-500">{SOURCE_LABELS[lead.source]}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={getPriorityVariant(lead.priority)} className="text-[10px]">
                    {PRIORITY_LABELS[lead.priority]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-[13px] font-semibold text-gray-900 tabular-nums">
                    {formatCurrencyShort(lead.estimatedValue)}
                  </span>
                </TableCell>
                <TableCell>
                  {lead.assignedTo ? (
                    <div className="flex items-center gap-1.5">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="bg-gray-100 text-[8px] font-bold text-gray-500">
                          {lead.assignedTo.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-[11px] text-gray-500 truncate max-w-[80px]">{lead.assignedTo.name.split(' ')[0]}</span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-gray-300">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {lead.followUpDate ? (
                    <span className={cn(
                      'flex items-center gap-1 text-[11px]',
                      due ? 'text-red-500 font-semibold' : soon ? 'text-amber-500 font-medium' : 'text-gray-500'
                    )}>
                      <Calendar className="h-3 w-3" />
                      {new Date(lead.followUpDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  ) : (
                    <span className="text-[11px] text-gray-300">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-[11px] text-gray-400">
                    {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
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
                      <DropdownMenuItem onClick={() => onView(lead)}>
                        <Eye className="mr-2 h-3.5 w-3.5" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(lead)}>
                        <Edit className="mr-2 h-3.5 w-3.5" /> Edit Lead
                      </DropdownMenuItem>
                      {lead.status !== 'converted' && (
                        <DropdownMenuItem onClick={() => onConvert(lead)} className="text-green-600">
                          <UserCheck className="mr-2 h-3.5 w-3.5" /> Convert to Member
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onDelete(lead)} className="text-red-600">
                        <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete Lead
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
  )
}
