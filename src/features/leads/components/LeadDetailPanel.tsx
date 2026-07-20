import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  X, Edit, Trash2, UserCheck, Phone, Mail, Calendar,
  Clock, IndianRupee, Tag, Send, MessageSquare,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import type { Lead } from '../types/lead.types'
import { useLeadNotes } from '../hooks/useLeads'
import {
  getLeadInitials, getStatusVariant, getPriorityVariant,
  STATUS_LABELS, PRIORITY_LABELS, SOURCE_LABELS,
  formatCurrencyShort, isFollowUpDue, isFollowUpSoon,
  PIPELINE_COLUMNS,
} from '../utils/leadUtils'

interface LeadDetailPanelProps {
  lead: Lead | null
  open: boolean
  onClose: () => void
  onEdit: (lead: Lead) => void
  onDelete: (lead: Lead) => void
  onConvert: (lead: Lead) => void
}

export function LeadDetailPanel({ lead, open, onClose, onEdit, onDelete, onConvert }: LeadDetailPanelProps) {
  const { notes, isLoading: notesLoading, addNote } = useLeadNotes(lead?.id)
  const [newNote, setNewNote] = useState('')
  const [sendingNote, setSendingNote] = useState(false)

  if (!open || !lead) return null

  const due = isFollowUpDue(lead)
  const soon = isFollowUpSoon(lead)
  const col = PIPELINE_COLUMNS.find(c => c.id === lead.status)

  const handleAddNote = async () => {
    if (!newNote.trim()) return
    setSendingNote(true)
    await addNote(newNote.trim())
    setNewNote('')
    setSendingNote(false)
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 z-50 h-full w-full max-w-lg bg-white shadow-2xl overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-gray-900">Lead Details</h2>
              <Badge variant={getStatusVariant(lead.status)} className="text-[10px]">{STATUS_LABELS[lead.status]}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(lead)}>
                <Edit className="mr-1.5 h-3.5 w-3.5" /> Edit
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={onClose} className="text-gray-400">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile */}
          <div className="flex items-start gap-4">
            <Avatar className="h-14 w-14 shrink-0">
              <AvatarFallback className="bg-gray-100 text-gray-600 text-lg font-bold">{getLeadInitials(lead)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900">{lead.firstName} {lead.lastName}</h3>
              <p className="text-[12px] text-gray-400 font-mono">{lead.leadId}</p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[12px] text-gray-500">
                <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {lead.email}</span>
                <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {lead.phone}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-gray-200 p-3 text-center">
              <IndianRupee className="h-4 w-4 text-gray-400 mx-auto mb-1" />
              <p className="text-[14px] font-bold text-gray-900">{formatCurrencyShort(lead.estimatedValue)}</p>
              <p className="text-[10px] text-gray-400">Est. Value</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-3 text-center">
              <Tag className="h-4 w-4 text-gray-400 mx-auto mb-1" />
              <p className="text-[14px] font-bold text-gray-900 capitalize">{SOURCE_LABELS[lead.source]}</p>
              <p className="text-[10px] text-gray-400">Source</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-3 text-center">
              <Clock className="h-4 w-4 text-gray-400 mx-auto mb-1" />
              <p className="text-[14px] font-bold text-gray-900 capitalize">{PRIORITY_LABELS[lead.priority]}</p>
              <p className="text-[10px] text-gray-400">Priority</p>
            </div>
          </div>

          {/* Details */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[11px] text-gray-400">Status</p>
                  <Badge variant={getStatusVariant(lead.status)} className="text-[10px] mt-0.5">{STATUS_LABELS[lead.status]}</Badge>
                </div>
                <div>
                  <p className="text-[11px] text-gray-400">Pipeline Stage</p>
                  <p className={cn('text-[13px] font-medium mt-0.5', col?.color)}>{col?.label}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-400">Interested Plan</p>
                  <p className="text-[13px] text-gray-900">{lead.interestedPlan || '—'}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-400">Assigned To</p>
                  {lead.assignedTo ? (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Avatar className="h-5 w-5"><AvatarFallback className="bg-gray-100 text-[8px] font-bold text-gray-500">{lead.assignedTo.name.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>
                      <span className="text-[13px] text-gray-900">{lead.assignedTo.name}</span>
                    </div>
                  ) : (
                    <p className="text-[13px] text-gray-400">Unassigned</p>
                  )}
                </div>
                <div>
                  <p className="text-[11px] text-gray-400">Follow-up Date</p>
                  {lead.followUpDate ? (
                    <p className={cn('text-[13px] font-medium', due ? 'text-red-500' : soon ? 'text-amber-500' : 'text-gray-900')}>
                      {formatDate(lead.followUpDate)}
                      {due && <span className="text-[10px] ml-1">(Overdue)</span>}
                    </p>
                  ) : <p className="text-[13px] text-gray-400">—</p>}
                </div>
                <div>
                  <p className="text-[11px] text-gray-400">Created</p>
                  <p className="text-[13px] text-gray-900">{formatDate(lead.createdAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="flex items-center gap-2 text-[13px]">
                <MessageSquare className="h-4 w-4 text-gray-400" />
                Notes & Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {lead.notes && (
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-[12px] text-gray-700 leading-relaxed">{lead.notes}</p>
                </div>
              )}

              {notesLoading ? (
                <div className="space-y-2">{Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
              ) : (
                notes.map(note => (
                  <div key={note.id} className="flex gap-2.5">
                    <Avatar className="h-6 w-6 shrink-0 mt-0.5">
                      <AvatarFallback className="bg-gray-100 text-[8px] font-bold text-gray-500">
                        {note.createdBy.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-medium text-gray-700">{note.createdBy}</span>
                        <span className="text-[10px] text-gray-400">{formatDate(note.createdAt)}</span>
                      </div>
                      <p className="text-[12px] text-gray-600 mt-0.5">{note.content}</p>
                    </div>
                  </div>
                ))
              )}

              {/* Add note */}
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <Input
                  placeholder="Add a note…"
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  className="h-8 text-[12px]"
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddNote() } }}
                />
                <Button size="sm" className="h-8 px-3" onClick={handleAddNote} disabled={!newNote.trim()} loading={sendingNote}>
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          {lead.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {lead.tags.map(tag => <Badge key={tag} variant="gray" className="text-[10px]">{tag}</Badge>)}
            </div>
          )}

          {/* Actions */}
          <Separator />
          <div className="flex items-center gap-2">
            {lead.status !== 'converted' && (
              <Button className="flex-1" onClick={() => onConvert(lead)}>
                <UserCheck className="mr-1.5 h-3.5 w-3.5" /> Convert to Member
              </Button>
            )}
            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => onDelete(lead)}>
              <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  )
}
