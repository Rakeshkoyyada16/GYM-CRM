import { motion } from 'framer-motion'
import { MoreHorizontal, Eye, FileText, Download, ArrowUpDown, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { getInitials, cn } from '@/lib/utils'
import type { Payment } from '../types/payment.types'
import { getStatusVariant, STATUS_LABELS, METHOD_LABELS, TYPE_LABELS, formatCurrency, getMethodIcon } from '../utils/paymentUtils'

interface TransactionTableProps {
  payments: Payment[]
  isLoading: boolean
  sortField: string
  sortDir: 'asc' | 'desc'
  onSort: (field: string) => void
  onViewInvoice: (payment: Payment) => void
}

const columns = [
  { key: 'invoiceNumber', label: 'Invoice' },
  { key: 'memberName', label: 'Member' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status' },
  { key: 'method', label: 'Method' },
  { key: 'type', label: 'Type' },
  { key: 'dueDate', label: 'Due Date' },
  { key: 'paidDate', label: 'Paid Date' },
]

export function TransactionTable({ payments, isLoading, sortField, sortDir, onSort, onViewInvoice }: TransactionTableProps) {
  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 text-gray-300" />
    return sortDir === 'asc' ? <ArrowUp className="h-3 w-3 text-brand-600" /> : <ArrowDown className="h-3 w-3 text-brand-600" />
  }

  if (isLoading) {
    return (
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <Table>
          <TableHeader><TableRow className="hover:bg-transparent bg-gray-50/80">
            {columns.map(c => <TableHead key={c.key}><Skeleton className="h-3.5 w-16" /></TableHead>)}
            <TableHead className="w-10"></TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {Array.from({ length: 8 }).map((_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                <TableCell><Skeleton className="h-3.5 w-20" /></TableCell>
                <TableCell><div className="flex items-center gap-2"><Skeleton className="h-8 w-8 rounded-full" /><div className="space-y-1.5"><Skeleton className="h-3.5 w-24" /><Skeleton className="h-2.5 w-32" /></div></div></TableCell>
                <TableCell><Skeleton className="h-3.5 w-16" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-5 w-14 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-3.5 w-20" /></TableCell>
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

  if (payments.length === 0) return null

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent bg-gray-50/80">
            {columns.map(col => (
              <TableHead key={col.key}>
                <button className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => onSort(col.key)}>
                  {col.label} <SortIcon field={col.key} />
                </button>
              </TableHead>
            ))}
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment, i) => (
            <motion.tr key={payment.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.15, delay: i * 0.02 }}
              className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors cursor-pointer">
              <TableCell>
                <span className="text-[11px] font-mono text-gray-500">{payment.invoiceNumber}</span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-gray-100 text-gray-600 text-[10px] font-semibold">
                      {getInitials(payment.memberName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-gray-900 truncate">{payment.memberName}</p>
                    <p className="text-[11px] text-gray-400 truncate">{payment.description}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-[13px] font-semibold text-gray-900 tabular-nums">{formatCurrency(payment.amount)}</span>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(payment.status)} className="text-[10px]">{STATUS_LABELS[payment.status]}</Badge>
              </TableCell>
              <TableCell>
                <span className="flex items-center gap-1 text-[12px] text-gray-500">
                  <span>{getMethodIcon(payment.method)}</span>
                  {METHOD_LABELS[payment.method]}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-[11px] text-gray-500">{TYPE_LABELS[payment.type]}</span>
              </TableCell>
              <TableCell>
                <span className={cn('text-[12px]', payment.status === 'overdue' ? 'text-red-500 font-medium' : 'text-gray-500')}>
                  {new Date(payment.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-[12px] text-gray-400">
                  {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
                </span>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm" className="text-gray-400 h-7 w-7">
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewInvoice(payment)}>
                      <FileText className="mr-2 h-3.5 w-3.5" /> View Invoice
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onViewInvoice(payment)}>
                      <Download className="mr-2 h-3.5 w-3.5" /> Download Receipt
                    </DropdownMenuItem>
                    {payment.status !== 'paid' && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem><RefreshCw className="mr-2 h-3.5 w-3.5" /> Send Reminder</DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
