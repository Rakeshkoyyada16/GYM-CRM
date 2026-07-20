import { useState } from 'react'
import { motion } from 'framer-motion'
import { UserCheck, Search, Loader2, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { getMembers, getClasses } from '../utils/mockData'
import { getInitials } from '@/lib/utils'
import type { CheckInPayload } from '../types/attendance.types'

interface CheckInPanelProps {
  onCheckIn: (payload: CheckInPayload) => Promise<unknown>
  isCheckingIn: boolean
}

const members = getMembers()
const classes = getClasses()

export function CheckInPanel({ onCheckIn, isCheckingIn }: CheckInPanelProps) {
  const [search, setSearch] = useState('')
  const [selectedMember, setSelectedMember] = useState<string>('')
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [success, setSuccess] = useState(false)

  const filteredMembers = search
    ? members.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase()))
    : members

  const handleCheckIn = async () => {
    if (!selectedMember) return
    await onCheckIn({
      memberId: selectedMember,
      classId: selectedClass || undefined,
      method: 'manual',
    })
    setSuccess(true)
    setTimeout(() => { setSuccess(false); setSelectedMember(''); setSelectedClass(''); setSearch('') }, 2000)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="flex items-center gap-2 text-[13px]">
            <UserCheck className="h-4 w-4 text-brand-500" />
            Quick Check-in
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Search member */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search member by name or email…"
              value={search}
              onChange={e => { setSearch(e.target.value); setSelectedMember('') }}
              className="pl-9 h-9"
            />
          </div>

          {/* Member results */}
          {search && !selectedMember && (
            <div className="max-h-40 overflow-y-auto rounded-lg border border-gray-200 divide-y divide-gray-100">
              {filteredMembers.slice(0, 5).map(m => (
                <button
                  key={m.id}
                  onClick={() => { setSelectedMember(m.id); setSearch(m.name) }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 hover:bg-gray-50 transition-colors text-left"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-gray-100 text-gray-600 text-[9px] font-bold">
                      {getInitials(m.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-[13px] font-medium text-gray-900">{m.name}</p>
                    <p className="text-[11px] text-gray-400">{m.email}</p>
                  </div>
                </button>
              ))}
              {filteredMembers.length === 0 && (
                <p className="px-3 py-4 text-[12px] text-gray-400 text-center">No members found</p>
              )}
            </div>
          )}

          {/* Selected member */}
          {selectedMember && (
            <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-brand-50 border border-brand-100">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-brand-100 text-brand-700 text-[10px] font-bold">
                  {getInitials(search)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-gray-900 truncate">{search}</p>
                <p className="text-[11px] text-brand-600">Selected for check-in</p>
              </div>
              <button onClick={() => { setSelectedMember(''); setSearch('') }} className="text-gray-400 hover:text-gray-600 text-[11px]">
                Change
              </button>
            </div>
          )}

          {/* Class selection */}
          <div className="space-y-1.5">
            <label className="block text-[12px] font-medium text-gray-600">Class (Optional)</label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="h-9 text-[13px]">
                <SelectValue placeholder="General visit (no class)" />
              </SelectTrigger>
              <SelectContent>
                {classes.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name} — {c.trainer}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Submit */}
          <Button
            className="w-full"
            disabled={!selectedMember || isCheckingIn}
            loading={isCheckingIn}
            onClick={handleCheckIn}
          >
            {success ? (
              <><CheckCircle2 className="mr-1.5 h-4 w-4" /> Checked In!</>
            ) : (
              <><UserCheck className="mr-1.5 h-4 w-4" /> Check In Member</>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
