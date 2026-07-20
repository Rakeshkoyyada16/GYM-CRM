import { motion } from 'framer-motion'
import {
  X, Edit, Trash2, Star, Users, Award, Mail, Phone, Calendar,
  Clock, IndianRupee, TrendingUp, MapPin,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import type { Trainer } from '../types/trainer.types'
import {
  getTrainerInitials, getStatusVariant, STATUS_LABELS,
  SPECIALIZATION_LABELS, SPECIALIZATION_EMOJIS, formatSalary,
} from '../utils/trainerUtils'

interface TrainerProfileProps {
  trainer: Trainer | null
  open: boolean
  onClose: () => void
  onEdit: (t: Trainer) => void
  onDelete: (t: Trainer) => void
}

export function TrainerProfile({ trainer, open, onClose, onEdit, onDelete }: TrainerProfileProps) {
  if (!open || !trainer) return null

  const perf = trainer.performance
  const classGrowth = perf.classesThisMonth > perf.classesLastMonth
    ? Math.round(((perf.classesThisMonth - perf.classesLastMonth) / perf.classesLastMonth) * 100)
    : 0

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 z-50 h-full w-full max-w-2xl bg-white shadow-2xl overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Trainer Profile</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(trainer)}><Edit className="mr-1.5 h-3.5 w-3.5" /> Edit</Button>
              <Button variant="ghost" size="icon-sm" onClick={onClose} className="text-gray-400"><X className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Header */}
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 shrink-0">
              <AvatarFallback className="bg-gray-100 text-gray-600 text-lg font-bold">{getTrainerInitials(trainer)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-gray-900">{trainer.firstName} {trainer.lastName}</h3>
                <Badge variant={getStatusVariant(trainer.status)} className="text-[10px]">{STATUS_LABELS[trainer.status]}</Badge>
              </div>
              <p className="text-[12px] text-gray-400 font-mono">{trainer.trainerId}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-[12px] text-gray-500">
                <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {trainer.email}</span>
                <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {trainer.phone}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Rating', value: trainer.rating.toFixed(1), icon: Star, color: 'text-amber-500' },
              { label: 'Clients', value: String(trainer.totalClients), icon: Users, color: 'text-brand-600' },
              { label: 'Experience', value: `${trainer.experience}y`, icon: Award, color: 'text-green-600' },
              { label: 'Salary', value: formatSalary(trainer.salary), icon: IndianRupee, color: 'text-purple-600' },
            ].map(stat => (
              <div key={stat.label} className="rounded-lg border border-gray-200 p-3 text-center">
                <stat.icon className={cn('h-4 w-4 mx-auto mb-1', stat.color)} />
                <p className="text-[14px] font-bold text-gray-900">{stat.value}</p>
                <p className="text-[10px] text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="text-[13px] font-semibold text-gray-900 mb-2">About</h4>
                    <p className="text-[13px] text-gray-600 leading-relaxed">{trainer.bio}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="text-[13px] font-semibold text-gray-900 mb-3">Specializations</h4>
                    <div className="flex flex-wrap gap-2">
                      {trainer.specializations.map(spec => (
                        <span key={spec} className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1.5 text-[12px] font-medium text-gray-700">
                          {SPECIALIZATION_EMOJIS[spec]} {SPECIALIZATION_LABELS[spec]}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="text-[13px] font-semibold text-gray-900 mb-3">Certifications</h4>
                    <div className="space-y-2">
                      {trainer.certifications.map((cert, i) => (
                        <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-gray-50">
                          <Award className="h-4 w-4 text-brand-500 shrink-0" />
                          <span className="text-[13px] text-gray-700">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Schedule Tab */}
            <TabsContent value="schedule">
              <Card>
                <CardContent className="p-4 space-y-3">
                  {trainer.availability.map(day => (
                    <div key={day.dayOfWeek} className={cn('rounded-lg border p-3 transition-colors',
                      day.isAvailable ? 'border-gray-200 hover:border-gray-300' : 'border-gray-100 bg-gray-50/50 opacity-50')}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[13px] font-semibold text-gray-900">{day.dayName}</span>
                        {day.isAvailable ? (
                          <span className="text-[11px] text-gray-500 tabular-nums">{day.startTime} - {day.endTime}</span>
                        ) : (
                          <Badge variant="gray" className="text-[9px]">Off</Badge>
                        )}
                      </div>
                      {day.classes.length > 0 && (
                        <div className="space-y-1.5">
                          {day.classes.map(cls => (
                            <div key={cls.id} className="flex items-center justify-between p-2 rounded-md bg-white border border-gray-100">
                              <div>
                                <p className="text-[12px] font-medium text-gray-700">{cls.name}</p>
                                <p className="text-[10px] text-gray-400 flex items-center gap-1"><MapPin className="h-2.5 w-2.5" /> {cls.room}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-[11px] text-gray-600 tabular-nums">{cls.startTime} - {cls.endTime}</p>
                                <p className="text-[10px] text-gray-400">{cls.enrolled}/{cls.capacity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Members Tab */}
            <TabsContent value="members">
              <Card>
                <CardContent className="p-4">
                  {trainer.assignedMembers.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-[13px] text-gray-500">No assigned members</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {trainer.assignedMembers.map(member => {
                        const pct = Math.round((member.sessionsCompleted / member.totalSessions) * 100)
                        return (
                          <div key={member.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                            <Avatar className="h-9 w-9 shrink-0">
                              <AvatarFallback className="bg-gray-100 text-gray-600 text-[10px] font-semibold">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-medium text-gray-900 truncate">{member.name}</p>
                              <p className="text-[11px] text-gray-400">{member.plan}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Progress value={pct} className="flex-1 h-1.5" />
                                <span className="text-[10px] text-gray-400 tabular-nums shrink-0">
                                  {member.sessionsCompleted}/{member.totalSessions}
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-[11px] text-gray-400 mb-1">Client Retention</p>
                      <p className="text-[22px] font-bold text-gray-900">{perf.clientRetention}%</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-[11px] text-gray-400 mb-1">Attendance Rate</p>
                      <p className="text-[22px] font-bold text-gray-900">{perf.attendanceRate}%</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-[11px] text-gray-400 mb-1">Classes This Month</p>
                      <div className="flex items-center justify-center gap-1">
                        <p className="text-[22px] font-bold text-gray-900">{perf.classesThisMonth}</p>
                        {classGrowth > 0 && (
                          <span className="text-[11px] text-green-600 font-medium">+{classGrowth}%</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-[11px] text-gray-400 mb-1">Revenue Generated</p>
                      <p className="text-[22px] font-bold text-gray-900">{formatCurrency(perf.revenueGenerated)}</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="pb-0">
                    <CardTitle className="text-[13px]">Monthly Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end gap-2 h-32">
                      {perf.monthlyTrend.map((m, i) => {
                        const maxClasses = Math.max(...perf.monthlyTrend.map(x => x.classes))
                        const h = (m.classes / maxClasses) * 100
                        return (
                          <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                            <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }}
                              transition={{ duration: 0.5, delay: i * 0.08 }}
                              className="w-full rounded-t-md bg-brand-200 hover:bg-brand-400 transition-colors cursor-pointer" />
                            <span className="text-[10px] text-gray-400">{m.month}</span>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Danger Zone */}
          <Separator />
          <div className="flex items-center justify-between">
            <p className="text-[12px] text-gray-400">Joined {formatDate(trainer.joinDate)}</p>
            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => onDelete(trainer)}>
              <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  )
}
