import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import type { Lead, LeadFormData } from '../types/lead.types'
import { SOURCE_LABELS, PRIORITY_LABELS, STATUS_LABELS } from '../utils/leadUtils'
import { getStaff } from '../utils/mockData'

const leadSchema = z.object({
  firstName: z.string().min(2, 'Min 2 characters'),
  lastName: z.string().min(2, 'Min 2 characters'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Min 10 digits'),
  status: z.enum(['new', 'contacted', 'follow_up', 'trial_scheduled', 'trial_completed', 'proposal_sent', 'converted', 'lost']),
  source: z.enum(['walk_in', 'website', 'social_media', 'referral', 'google_ads', 'instagram', 'facebook', 'phone_call', 'event', 'other']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  assignedToId: z.string().optional(),
  interestedPlan: z.string().optional(),
  estimatedValue: z.number().min(0),
  followUpDate: z.string().optional(),
  notes: z.string().default(''),
  tags: z.array(z.string()).default([]),
})

const staff = getStaff()
const PLAN_OPTIONS = ['Basic Monthly', 'Standard Quarterly', 'Standard Annual', 'Premium Semi-Annual', 'Premium Annual', 'VIP Annual']

interface LeadFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: LeadFormData) => Promise<void>
  initialData?: Lead | null
  isLoading?: boolean
}

export function LeadForm({ open, onClose, onSubmit, initialData, isLoading }: LeadFormProps) {
  const isEdit = !!initialData

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(leadSchema) as any,
    defaultValues: {
      firstName: '', lastName: '', email: '', phone: '',
      status: 'new', source: 'other', priority: 'medium',
      assignedToId: '', interestedPlan: '', estimatedValue: 0,
      followUpDate: '', notes: '', tags: [],
    },
  })

  useEffect(() => {
    if (initialData) {
      const fd = {
        firstName: initialData.firstName, lastName: initialData.lastName,
        email: initialData.email, phone: initialData.phone,
        status: initialData.status, source: initialData.source, priority: initialData.priority,
        assignedToId: initialData.assignedTo?.id || '',
        interestedPlan: initialData.interestedPlan || '',
        estimatedValue: initialData.estimatedValue,
        followUpDate: initialData.followUpDate || '',
        notes: initialData.notes, tags: initialData.tags,
      }
      reset(fd as any)
    } else {
      reset({ firstName: '', lastName: '', email: '', phone: '', status: 'new', source: 'other', priority: 'medium', assignedToId: '', interestedPlan: '', estimatedValue: 0, followUpDate: '', notes: '', tags: [] } as any)
    }
  }, [initialData, reset])

  const handleFormSubmit = async (data: any) => {
    await onSubmit(data as LeadFormData)
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle>{isEdit ? 'Edit Lead' : 'Add New Lead'}</DialogTitle>
          <DialogDescription>{isEdit ? 'Update lead details.' : 'Capture a new sales lead.'}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit as any)} className="px-6 pb-6 space-y-5">
          <div>
            <h4 className="text-[13px] font-semibold text-gray-900 mb-3">Contact Information</h4>
            <div className="grid grid-cols-2 gap-3">
              <Input label="First Name" {...register('firstName')} error={errors.firstName?.message} required />
              <Input label="Last Name" {...register('lastName')} error={errors.lastName?.message} required />
              <Input label="Email" type="email" {...register('email')} error={errors.email?.message} required />
              <Input label="Phone" {...register('phone')} error={errors.phone?.message} required />
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-[13px] font-semibold text-gray-900 mb-3">Lead Details</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-[13px] font-medium text-gray-700">Status</label>
                <Select value={watch('status')} onValueChange={v => setValue('status', v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(STATUS_LABELS).map(([k, l]) => <SelectItem key={k} value={k}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[13px] font-medium text-gray-700">Source</label>
                <Select value={watch('source')} onValueChange={v => setValue('source', v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(SOURCE_LABELS).map(([k, l]) => <SelectItem key={k} value={k}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[13px] font-medium text-gray-700">Priority</label>
                <Select value={watch('priority')} onValueChange={v => setValue('priority', v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(PRIORITY_LABELS).map(([k, l]) => <SelectItem key={k} value={k}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[13px] font-medium text-gray-700">Assign To</label>
                <Select value={watch('assignedToId')} onValueChange={v => setValue('assignedToId', v)}>
                  <SelectTrigger><SelectValue placeholder="Unassigned" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Unassigned</SelectItem>
                    {staff.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[13px] font-medium text-gray-700">Interested Plan</label>
                <Select value={watch('interestedPlan')} onValueChange={v => setValue('interestedPlan', v)}>
                  <SelectTrigger><SelectValue placeholder="Select plan" /></SelectTrigger>
                  <SelectContent>
                    {PLAN_OPTIONS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Input label="Estimated Value (₹)" type="number" {...register('estimatedValue', { valueAsNumber: true })} />
              <Input label="Follow-up Date" type="date" {...register('followUpDate')} />
            </div>
          </div>

          <Separator />

          <Textarea label="Notes" placeholder="Any notes about this lead…" {...register('notes')} />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" loading={isLoading}>{isEdit ? 'Save Changes' : 'Create Lead'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
