import { useState } from 'react'
import { motion } from 'framer-motion'
import { MoreHorizontal, Calendar, Phone, Mail, IndianRupee } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Lead, LeadStatus } from '../types/lead.types'
import {
  PIPELINE_COLUMNS, getLeadInitials, getPriorityVariant,
  PRIORITY_LABELS, formatCurrencyShort, isFollowUpDue, isFollowUpSoon,
  SOURCE_LABELS,
} from '../utils/leadUtils'

interface LeadPipelineProps {
  leads: Lead[]
  isLoading: boolean
  onView: (lead: Lead) => void
  onEdit: (lead: Lead) => void
  onDelete: (lead: Lead) => void
  onStatusChange: (lead: Lead, status: LeadStatus) => void
  onConvert: (lead: Lead) => void
}

export function LeadPipeline({
  leads, isLoading, onView, onEdit, onDelete, onStatusChange, onConvert,
}: LeadPipelineProps) {
  const [expandedCol, setExpandedCol] = useState<LeadStatus | null>(null)

  // Group leads by status
  const grouped: Record<LeadStatus, Lead[]> = {
    new: [], contacted: [], follow_up: [], trial_scheduled: [],
    trial_completed: [], proposal_sent: [], converted: [], lost: [],
  }
  leads.forEach(l => { grouped[l.status].push(l) })

  if (isLoading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-4">
        {PIPELINE_COLUMNS.slice(0, 6).map(col => (
          <div key={col.id} className="min-w-[260px] w-[260px] shrink-0">
            <Skeleton className="h-8 w-full rounded-lg mb-3" />
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg mb-2" />
            ))}
          </div>
        ))}
      </div>
    )
  }

  return (
    <ScrollArea className="w-full">
      <div className="flex gap-3 pb-4 min-w-max">
        {PIPELINE_COLUMNS.filter(c => c.id !== 'converted' && c.id !== 'lost').map((col, colIdx) => {
          const columnLeads = grouped[col.id]
          const totalValue = columnLeads.reduce((s, l) => s + l.estimatedValue, 0)

          return (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: colIdx * 0.06 }}
              className="min-w-[260px] w-[260px] shrink-0"
            >
              {/* Column Header */}
              <div className={`flex items-center justify-between rounded-lg border ${col.borderColor} ${col.bgColor} px-3 py-2 mb-3`}>
                <div className="flex items-center gap-2">
                  <span className={`text-[12px] font-semibold ${col.color}`}>{col.label}</span>
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white px-1.5 text-[10px] font-bold text-gray-600 shadow-xs">
                    {columnLeads.length}
                  </span>
                </div>
                <span className="text-[10px] text-gray-400 font-medium">
                  {formatCurrencyShort(totalValue)}
                </span>
              </div>

              {/* Cards */}
              <div className="space-y-2">
                {columnLeads.map((lead, cardIdx) => {
                  const due = isFollowUpDue(lead)
                  const soon = isFollowUpSoon(lead)

                  return (
                    <motion.div
                      key={lead.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: cardIdx * 0.04 }}
                    >
                      <Card
                        className="cursor-pointer hover:shadow-md hover:border-gray-300 transition-all duration-200 group"
                        onClick={() => onView(lead)}
                      >
                        <CardContent className="p-3 space-y-2">
                          {/* Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2 min-w-0">
                              <Avatar className="h-7 w-7 shrink-0">
                                <AvatarFallback className="bg-gray-100 text-gray-600 text-[9px] font-bold">
                                  {getLeadInitials(lead)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="text-[13px] font-medium text-gray-900 truncate">
                                  {lead.firstName} {lead.lastName}
                                </p>
                                <p className="text-[10px] text-gray-400">{SOURCE_LABELS[lead.source]}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                              <Badge variant={getPriorityVariant(lead.priority)} className="text-[9px]">
                                {PRIORITY_LABELS[lead.priority]}
                              </Badge>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon-sm" className="h-6 w-6 opacity-0 group-hover:opacity-100 text-gray-400">
                                    <MoreHorizontal className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => onView(lead)}>View Details</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => onEdit(lead)}>Edit Lead</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => onConvert(lead)} className="text-green-600">Convert to Member</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => onDelete(lead)} className="text-red-600">Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>

                          {/* Plan + Value */}
                          {lead.interestedPlan && (
                            <p className="text-[11px] text-gray-500 truncate">{lead.interestedPlan}</p>
                          )}

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                            <span className="text-[12px] font-semibold text-gray-700 tabular-nums">
                              {formatCurrencyShort(lead.estimatedValue)}
                            </span>
                            <div className="flex items-center gap-2">
                              {lead.assignedTo && (
                                <Avatar className="h-5 w-5">
                                  <AvatarFallback className="bg-gray-100 text-[8px] font-bold text-gray-500">
                                    {lead.assignedTo.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              {lead.followUpDate && (
                                <span className={`flex items-center gap-0.5 text-[10px] ${due ? 'text-red-500 font-semibold' : soon ? 'text-amber-500' : 'text-gray-400'}`}>
                                  <Calendar className="h-3 w-3" />
                                  {new Date(lead.followUpDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                </span>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}

                {columnLeads.length === 0 && (
                  <div className="flex items-center justify-center h-20 rounded-lg border border-dashed border-gray-200">
                    <p className="text-[11px] text-gray-400">No leads</p>
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}

        {/* Closed columns */}
        <div className="min-w-[260px] w-[260px] shrink-0 space-y-3">
          {['converted', 'lost'].map(status => {
            const col = PIPELINE_COLUMNS.find(c => c.id === status)!
            const columnLeads = grouped[status as LeadStatus]
            return (
              <div key={status}>
                <div className={`flex items-center justify-between rounded-lg border ${col.borderColor} ${col.bgColor} px-3 py-2 mb-2`}>
                  <span className={`text-[12px] font-semibold ${col.color}`}>{col.label}</span>
                  <span className="text-[10px] font-bold text-gray-500">{columnLeads.length}</span>
                </div>
                {columnLeads.slice(0, 3).map(lead => (
                  <div key={lead.id} onClick={() => onView(lead)} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer mb-1">
                    <Avatar className="h-6 w-6"><AvatarFallback className="bg-gray-100 text-[8px] font-bold text-gray-500">{getLeadInitials(lead)}</AvatarFallback></Avatar>
                    <span className="text-[12px] text-gray-600 truncate">{lead.firstName} {lead.lastName}</span>
                    <span className="ml-auto text-[11px] text-gray-400 tabular-nums">{formatCurrencyShort(lead.estimatedValue)}</span>
                  </div>
                ))}
                {columnLeads.length > 3 && (
                  <p className="text-[10px] text-gray-400 text-center py-1">+{columnLeads.length - 3} more</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
