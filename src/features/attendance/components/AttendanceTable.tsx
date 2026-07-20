import { useState } from 'react'
import { motion } from 'framer-motion'
import { LogOut, Clock, MoreHorizontal, Eye } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { getInitials, cn } from '@/lib/utils'
import type { AttendanceRecord } from '../types/attendance.types'
import { getStatusVariant, STATUS_LABELS, formatDuration, formatTime12 } from '../utils/attendanceUtils'

interface AttendanceTableProps {
  records: AttendanceRecord[]
  isLoading: boolean
  showDate?: boolean
  onCheckOut?: (recordId: string) => void
}

export function AttendanceTable({ records, isLoading, showDate = false, onCheckOut }: AttendanceTableProps) {
  if (isLoading) {
    return (
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent bg-gray-50/80">
              <TableHead>Member</TableHead>
              {showDate && <TableHead>Date</TableHead>}
              <TableHead>Class</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 6 }).map((_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                <TableCell><div className="flex items-center gap-2"><Skeleton className="h-8 w-8 rounded-full" /><div className="space-y-1.5"><Skeleton className="h-3.5 w-24" /><Skeleton className="h-2.5 w-32" /></div></div></TableCell>
                {showDate && <TableCell><Skeleton className="h-3.5 w-20" /></TableCell>}
                <TableCell><Skeleton className="h-3.5 w-24" /></TableCell>
                <TableCell><Skeleton className="h-3.5 w-16" /></TableCell>
                <TableCell><Skeleton className="h-3.5 w-16" /></TableCell>
                <TableCell><Skeleton className="h-3.5 w-12" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-7 w-7 rounded" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (records.length === 0) return null

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent bg-gray-50/80">
            <TableHead>Member</TableHead>
            {showDate && <TableHead>Date</TableHead>}
            <TableHead>Class</TableHead>
            <TableHead>Check In</TableHead>
            <TableHead>Check Out</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record, i) => (
            <motion.tr
              key={record.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15, delay: i * 0.02 }}
              className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors"
            >
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-gray-100 text-gray-600 text-[10px] font-semibold">
                      {getInitials(record.memberName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-gray-900 truncate">{record.memberName}</p>
                    <p className="text-[11px] text-gray-400 truncate">{record.memberEmail}</p>
                  </div>
                </div>
              </TableCell>
              {showDate && (
                <TableCell>
                  <span className="text-[12px] text-gray-500">
                    {new Date(record.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </TableCell>
              )}
              <TableCell>
                {record.className ? (
                  <div>
                    <p className="text-[12px] text-gray-700">{record.className}</p>
                    {record.trainerName && <p className="text-[10px] text-gray-400">{record.trainerName}</p>}
                  </div>
                ) : (
                  <span className="text-[11px] text-gray-300">General visit</span>
                )}
              </TableCell>
              <TableCell>
                <span className={cn(
                  'text-[13px] tabular-nums font-medium',
                  record.status === 'late' ? 'text-amber-600' : 'text-gray-700'
                )}>
                  {formatTime12(record.checkIn)}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-[13px] tabular-nums text-gray-500">
                  {record.checkOut ? formatTime12(record.checkOut) : '—'}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-[12px] text-gray-500 tabular-nums">
                  {formatDuration(record.duration)}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(record.status)} className="text-[10px]">
                  {STATUS_LABELS[record.status]}
                </Badge>
              </TableCell>
              <TableCell>
                {!record.checkOut && onCheckOut ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[11px] px-2"
                    onClick={() => onCheckOut(record.id)}
                  >
                    <LogOut className="mr-1 h-3 w-3" /> Check out
                  </Button>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm" className="text-gray-400 h-7 w-7">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Eye className="mr-2 h-3.5 w-3.5" /> View Details</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
