import { memo } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from '@/components/ui/table'

interface SkeletonTableProps {
  rows?: number
  columns: number
  hasCheckbox?: boolean
  hasActions?: boolean
}

/**
 * Reusable table skeleton loader.
 * Eliminates duplicate skeleton JSX across Members, Payments, Attendance, Trainers, Leads.
 */
export const SkeletonTable = memo(function SkeletonTable({
  rows = 6, columns, hasCheckbox = false, hasActions = false,
}: SkeletonTableProps) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent bg-gray-50/80">
            {hasCheckbox && <TableHead className="w-10 pl-4"><Skeleton className="h-4 w-4 rounded" /></TableHead>}
            {Array.from({ length: columns }).map((_, i) => (
              <TableHead key={i}><Skeleton className="h-3.5 w-16" /></TableHead>
            ))}
            {hasActions && <TableHead className="w-10"><Skeleton className="h-7 w-7 rounded" /></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, row) => (
            <TableRow key={row} className="hover:bg-transparent">
              {hasCheckbox && <TableCell className="pl-4"><Skeleton className="h-4 w-4 rounded" /></TableCell>}
              {Array.from({ length: columns }).map((_, col) => (
                <TableCell key={col}>
                  {col === 0 ? (
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-1.5"><Skeleton className="h-3.5 w-24" /><Skeleton className="h-2.5 w-32" /></div>
                    </div>
                  ) : (
                    <Skeleton className="h-3.5 w-16" />
                  )}
                </TableCell>
              ))}
              {hasActions && <TableCell><Skeleton className="h-7 w-7 rounded" /></TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
})
