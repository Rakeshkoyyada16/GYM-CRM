import { motion } from 'framer-motion'
import {
  X, Edit, Trash2, RefreshCw, Phone, Mail, MapPin, Calendar,
  Shield, Heart, User, Clock, Star, CreditCard, ClipboardCheck,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import type { Member } from '../types/member.types'
import { useMemberAttendance, useMemberPayments } from '../hooks/useMembers'
import { getMemberInitials, getStatusVariant, getMembershipVariant, daysUntilExpiry } from '../utils/memberUtils'

interface MemberProfileProps {
  member: Member | null
  open: boolean
  onClose: () => void
  onEdit: (member: Member) => void
  onDelete: (member: Member) => void
  onRenew: (member: Member) => void
}

export function MemberProfile({ member, open, onClose, onEdit, onDelete, onRenew }: MemberProfileProps) {
  const { records: attendance, isLoading: attendanceLoading } = useMemberAttendance(member?.id)
  const { records: payments, isLoading: paymentsLoading } = useMemberPayments(member?.id)

  if (!open || !member) return null

  const expiryDays = daysUntilExpiry(member.membership.endDate)
  const isExpiringSoon = expiryDays > 0 && expiryDays <= 30
  const isExpired = expiryDays <= 0

  const methodLabels: Record<string, string> = {
    upi: 'UPI', card: 'Card', netbanking: 'Net Banking', cash: 'Cash', wallet: 'Wallet', cheque: 'Cheque',
  }
  const payStatusVariant: Record<string, 'success' | 'warning' | 'error'> = {
    paid: 'success', pending: 'warning', unpaid: 'error',
  }
  const attStatusVariant: Record<string, 'success' | 'warning' | 'gray'> = {
    present: 'success', late: 'warning', absent: 'gray', excused: 'gray',
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Slide-over Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 z-50 h-full w-full max-w-2xl bg-white shadow-2xl overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Member Profile</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(member)}>
                <Edit className="mr-1.5 h-3.5 w-3.5" /> Edit
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={onClose} className="text-gray-400">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Header */}
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 shrink-0">
              <AvatarFallback className="bg-gray-100 text-gray-600 text-lg font-bold">
                {getMemberInitials(member)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-gray-900">
                  {member.firstName} {member.lastName}
                </h3>
                <Badge variant={getStatusVariant(member.status)} className="capitalize">{member.status}</Badge>
              </div>
              <p className="text-[12px] text-gray-400 font-mono mt-0.5">{member.memberId}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[12px] text-gray-500">
                <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {member.email}</span>
                <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {member.phone}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Total Visits', value: member.totalVisits, icon: ClipboardCheck },
              { label: 'Plan', value: member.membership.type.toUpperCase(), icon: Star },
              { label: 'Amount', value: formatCurrency(member.membership.price), icon: CreditCard },
              { label: 'Last Visit', value: member.lastVisit ? formatDate(member.lastVisit) : 'Never', icon: Clock },
            ].map(stat => (
              <div key={stat.label} className="rounded-lg border border-gray-200 p-3 text-center">
                <stat.icon className="h-4 w-4 text-gray-400 mx-auto mb-1" />
                <p className="text-[13px] font-bold text-gray-900">{stat.value}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="membership" className="space-y-4">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="membership">Membership</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            {/* Membership Tab */}
            <TabsContent value="membership">
              <Card>
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[13px] font-semibold text-gray-900">{member.membership.planName}</p>
                      <p className="text-[12px] text-gray-400 capitalize">{member.membership.type} Plan</p>
                    </div>
                    <Badge variant={getMembershipVariant(member.membership.type)} className="text-[11px]">
                      {member.membership.type}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[11px] text-gray-400 mb-0.5">Start Date</p>
                      <p className="text-[13px] text-gray-900">{formatDate(member.membership.startDate)}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-400 mb-0.5">End Date</p>
                      <p className={cn('text-[13px] font-medium', isExpired ? 'text-red-600' : isExpiringSoon ? 'text-amber-600' : 'text-gray-900')}>
                        {formatDate(member.membership.endDate)}
                        {isExpired && <span className="text-[10px] ml-1">(Expired)</span>}
                        {isExpiringSoon && <span className="text-[10px] ml-1">({expiryDays}d left)</span>}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-400 mb-0.5">Price</p>
                      <p className="text-[13px] font-semibold text-gray-900">{formatCurrency(member.membership.price)}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-400 mb-0.5">Auto-renew</p>
                      <p className="text-[13px] text-gray-900">{member.membership.autoRenew ? 'Yes' : 'No'}</p>
                    </div>
                  </div>

                  {member.membership.sessionsRemaining !== undefined && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-[11px] text-gray-400">Sessions</p>
                        <p className="text-[12px] text-gray-600 font-medium">
                          {member.membership.sessionsRemaining} / {member.membership.totalSessions} remaining
                        </p>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-brand-500 transition-all duration-500"
                          style={{ width: `${((member.membership.sessionsRemaining || 0) / (member.membership.totalSessions || 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {(isExpired || isExpiringSoon) && (
                    <Button className="w-full" onClick={() => onRenew(member)}>
                      <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                      Renew Membership
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Attendance Tab */}
            <TabsContent value="attendance">
              <Card>
                <CardContent className="p-0">
                  {attendanceLoading ? (
                    <div className="p-5 space-y-3">
                      {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent bg-gray-50/80">
                          <TableHead>Date</TableHead>
                          <TableHead>Check In</TableHead>
                          <TableHead>Check Out</TableHead>
                          <TableHead>Class</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {attendance.map(record => (
                          <TableRow key={record.id} className="hover:bg-transparent">
                            <TableCell className="text-[12px]">{formatDate(record.date)}</TableCell>
                            <TableCell className="text-[12px] tabular-nums">{record.checkIn}</TableCell>
                            <TableCell className="text-[12px] tabular-nums">{record.checkOut || '—'}</TableCell>
                            <TableCell className="text-[12px]">{record.className || '—'}</TableCell>
                            <TableCell>
                              <Badge variant={attStatusVariant[record.status]} className="text-[10px] capitalize">{record.status}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments">
              <Card>
                <CardContent className="p-0">
                  {paymentsLoading ? (
                    <div className="p-5 space-y-3">
                      {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent bg-gray-50/80">
                          <TableHead>Invoice</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Method</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payments.map(record => (
                          <TableRow key={record.id} className="hover:bg-transparent">
                            <TableCell className="text-[11px] font-mono text-gray-500">{record.invoiceNumber}</TableCell>
                            <TableCell className="text-[12px]">{record.description}</TableCell>
                            <TableCell className="text-[13px] font-semibold tabular-nums">{formatCurrency(record.amount)}</TableCell>
                            <TableCell className="text-[12px]">{methodLabels[record.method]}</TableCell>
                            <TableCell>
                              <Badge variant={payStatusVariant[record.status]} className="text-[10px] capitalize">{record.status}</Badge>
                            </TableCell>
                            <TableCell className="text-[12px]">{formatDate(record.date)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details">
              <div className="space-y-4">
                {/* Emergency Contact */}
                <Card>
                  <CardHeader className="pb-0">
                    <CardTitle className="flex items-center gap-2 text-[13px]">
                      <Shield className="h-4 w-4 text-gray-400" />
                      Emergency Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-[11px] text-gray-400">Name</p>
                        <p className="text-[13px] text-gray-900">{member.emergencyContact.name || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-gray-400">Phone</p>
                        <p className="text-[13px] text-gray-900">{member.emergencyContact.phone || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-gray-400">Relationship</p>
                        <p className="text-[13px] text-gray-900">{member.emergencyContact.relationship || '—'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Medical Notes */}
                {member.medicalNotes && (
                  <Card>
                    <CardHeader className="pb-0">
                      <CardTitle className="flex items-center gap-2 text-[13px]">
                        <Heart className="h-4 w-4 text-red-400" />
                        Medical Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[13px] text-gray-700 leading-relaxed">{member.medicalNotes}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Assigned Trainer */}
                {member.assignedTrainer && (
                  <Card>
                    <CardHeader className="pb-0">
                      <CardTitle className="flex items-center gap-2 text-[13px]">
                        <User className="h-4 w-4 text-gray-400" />
                        Assigned Trainer
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gray-100 text-gray-600 text-[11px] font-semibold">
                            {member.assignedTrainer.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-[13px] font-medium text-gray-900">{member.assignedTrainer.name}</p>
                          <p className="text-[11px] text-gray-400">{member.assignedTrainer.specialization}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Address */}
                {member.address && (
                  <Card>
                    <CardHeader className="pb-0">
                      <CardTitle className="flex items-center gap-2 text-[13px]">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        Address
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[13px] text-gray-700">
                        {member.address.street}, {member.address.city}, {member.address.state} {member.address.pincode}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Notes */}
                {member.notes && (
                  <Card>
                    <CardHeader className="pb-0">
                      <CardTitle className="text-[13px]">Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[13px] text-gray-700 leading-relaxed">{member.notes}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Tags */}
                {member.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {member.tags.map(tag => (
                      <Badge key={tag} variant="gray" className="text-[10px]">{tag}</Badge>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Danger Zone */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] text-gray-500">Joined {formatDate(member.joinDate)}</p>
              </div>
              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => onDelete(member)}>
                <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
