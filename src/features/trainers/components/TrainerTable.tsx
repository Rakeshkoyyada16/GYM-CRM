import { motion } from 'framer-motion'
import { MoreVertical, Eye, Edit, Trash2, Star, Users, Award } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import type { Trainer } from '../types/trainer.types'
import { getTrainerInitials, getStatusVariant, STATUS_LABELS, SPECIALIZATION_LABELS, formatSalary } from '../utils/trainerUtils'

interface TrainerTableProps {
  trainers: Trainer[]
  isLoading: boolean
  onView: (t: Trainer) => void
  onEdit: (t: Trainer) => void
  onDelete: (t: Trainer) => void
}

export function TrainerTable({ trainers, isLoading, onView, onEdit, onDelete }: TrainerTableProps) {
  if (isLoading) {
    return (
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <Table>
          <TableHeader><TableRow className="hover:bg-transparent bg-gray-50/80">
            <TableHead>Trainer</TableHead><TableHead>Specializations</TableHead><TableHead>Experience</TableHead>
            <TableHead>Rating</TableHead><TableHead>Clients</TableHead><TableHead>Salary</TableHead>
            <TableHead>Status</TableHead><TableHead className="w-10"></TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                <TableCell><div className="flex items-center gap-2"><Skeleton className="h-8 w-8 rounded-full" /><div className="space-y-1.5"><Skeleton className="h-3.5 w-24" /><Skeleton className="h-2.5 w-32" /></div></div></TableCell>
                <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-3.5 w-8" /></TableCell>
                <TableCell><Skeleton className="h-3.5 w-8" /></TableCell>
                <TableCell><Skeleton className="h-3.5 w-8" /></TableCell>
                <TableCell><Skeleton className="h-3.5 w-16" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-7 w-7 rounded" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (trainers.length === 0) return null

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent bg-gray-50/80">
            <TableHead>Trainer</TableHead><TableHead>Specializations</TableHead><TableHead>Experience</TableHead>
            <TableHead>Rating</TableHead><TableHead>Clients</TableHead><TableHead>Salary</TableHead>
            <TableHead>Status</TableHead><TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trainers.map((trainer, i) => (
            <motion.tr key={trainer.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.15, delay: i * 0.02 }}
              className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors cursor-pointer"
              onClick={() => onView(trainer)}>
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-gray-100 text-gray-600 text-[10px] font-semibold">
                      {getTrainerInitials(trainer)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-gray-900 truncate">{trainer.firstName} {trainer.lastName}</p>
                    <p className="text-[11px] text-gray-400 truncate">{trainer.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {trainer.specializations.slice(0, 2).map(s => (
                    <Badge key={s} variant="gray" className="text-[9px]">{SPECIALIZATION_LABELS[s]}</Badge>
                  ))}
                  {trainer.specializations.length > 2 && (
                    <Badge variant="gray" className="text-[9px]">+{trainer.specializations.length - 2}</Badge>
                  )}
                </div>
              </TableCell>
              <TableCell><span className="text-[13px] text-gray-700">{trainer.experience} years</span></TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-[13px] font-semibold text-gray-900">{trainer.rating}</span>
                </div>
              </TableCell>
              <TableCell><span className="text-[13px] text-gray-700">{trainer.totalClients}</span></TableCell>
              <TableCell><span className="text-[13px] font-semibold text-gray-900">{formatSalary(trainer.salary)}</span></TableCell>
              <TableCell><Badge variant={getStatusVariant(trainer.status)} className="text-[10px]">{STATUS_LABELS[trainer.status]}</Badge></TableCell>
              <TableCell onClick={e => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm" className="text-gray-400 h-7 w-7">
                      <MoreVertical className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(trainer)}><Eye className="mr-2 h-3.5 w-3.5" /> View Profile</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(trainer)}><Edit className="mr-2 h-3.5 w-3.5" /> Edit</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onDelete(trainer)} className="text-red-600"><Trash2 className="mr-2 h-3.5 w-3.5" /> Delete</DropdownMenuItem>
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
