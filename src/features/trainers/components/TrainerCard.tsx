import { motion } from 'framer-motion'
import { Star, Users, Award, MoreVertical, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { Trainer } from '../types/trainer.types'
import { getTrainerInitials, getStatusVariant, STATUS_LABELS, SPECIALIZATION_LABELS, SPECIALIZATION_EMOJIS, formatSalary, getTodaySchedule } from '../utils/trainerUtils'

interface TrainerCardProps {
  trainer: Trainer
  index: number
  onView: (t: Trainer) => void
  onEdit: (t: Trainer) => void
  onDelete: (t: Trainer) => void
}

export function TrainerCard({ trainer, index, onView, onEdit, onDelete }: TrainerCardProps) {
  const todaySchedule = getTodaySchedule(trainer)
  const isOnLeave = trainer.status === 'on_leave'

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}>
      <Card className={cn('hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer group',
        isOnLeave && 'opacity-60')} onClick={() => onView(trainer)}>
        <CardContent className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 shrink-0">
                <AvatarFallback className="bg-gray-100 text-gray-600 text-sm font-bold">
                  {getTrainerInitials(trainer)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h3 className="text-[14px] font-semibold text-gray-900 truncate">
                  {trainer.firstName} {trainer.lastName}
                </h3>
                <p className="text-[11px] text-gray-400 font-mono">{trainer.trainerId}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
              <Badge variant={getStatusVariant(trainer.status)} className="text-[9px]">
                {STATUS_LABELS[trainer.status]}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm" className="h-7 w-7 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView(trainer)}>View Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(trainer)}>Edit Trainer</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onDelete(trainer)} className="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Specializations */}
          <div className="flex flex-wrap gap-1.5">
            {trainer.specializations.slice(0, 3).map(spec => (
              <span key={spec} className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                {SPECIALIZATION_EMOJIS[spec]} {SPECIALIZATION_LABELS[spec]}
              </span>
            ))}
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center p-2 rounded-lg bg-gray-50">
              <div className="flex items-center gap-0.5 text-amber-500">
                <Star className="h-3 w-3 fill-amber-400" />
                <span className="text-[13px] font-bold">{trainer.rating}</span>
              </div>
              <span className="text-[9px] text-gray-400 mt-0.5">Rating</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-lg bg-gray-50">
              <div className="flex items-center gap-0.5 text-brand-600">
                <Users className="h-3 w-3" />
                <span className="text-[13px] font-bold">{trainer.totalClients}</span>
              </div>
              <span className="text-[9px] text-gray-400 mt-0.5">Clients</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-lg bg-gray-50">
              <div className="flex items-center gap-0.5 text-green-600">
                <Award className="h-3 w-3" />
                <span className="text-[13px] font-bold">{trainer.experience}y</span>
              </div>
              <span className="text-[9px] text-gray-400 mt-0.5">Exp</span>
            </div>
          </div>

          {/* Today's Schedule */}
          {todaySchedule && todaySchedule.isAvailable && todaySchedule.classes.length > 0 && (
            <div className="pt-3 border-t border-gray-100">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1.5">Today</p>
              <div className="space-y-1">
                {todaySchedule.classes.slice(0, 2).map(cls => (
                  <div key={cls.id} className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-700 font-medium">{cls.name}</span>
                    <span className="text-gray-400 tabular-nums">{cls.startTime} - {cls.endTime}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-[12px] font-semibold text-gray-700">{formatSalary(trainer.salary)}/mo</span>
            <span className="text-[11px] text-gray-400">{trainer.totalClasses} classes taught</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
