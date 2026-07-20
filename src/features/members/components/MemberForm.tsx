import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import type { Member, MemberFormData } from '../types/member.types'

const memberSchema = z.object({
  firstName: z.string().min(2, 'Min 2 characters'),
  lastName: z.string().min(2, 'Min 2 characters'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Min 10 digits'),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']),
  dateOfBirth: z.string().min(1, 'Required'),
  membershipType: z.enum(['basic', 'standard', 'premium', 'vip', 'custom']),
  planName: z.string().min(1, 'Required'),
  startDate: z.string().min(1, 'Required'),
  endDate: z.string().min(1, 'Required'),
  price: z.number().min(0, 'Must be positive'),
  autoRenew: z.boolean(),
  emergencyContactName: z.string().min(2, 'Required'),
  emergencyContactPhone: z.string().min(10, 'Required'),
  emergencyContactRelationship: z.string().min(2, 'Required'),
  address: z.string().default(''),
  city: z.string().default(''),
  state: z.string().default(''),
  pincode: z.string().default(''),
  medicalNotes: z.string().default(''),
  notes: z.string().default(''),
  tags: z.array(z.string()).default([]),
})

interface MemberFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: MemberFormData) => Promise<void>
  initialData?: Member | null
  isLoading?: boolean
}

export function MemberForm({ open, onClose, onSubmit, initialData, isLoading }: MemberFormProps) {
  const isEdit = !!initialData

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(memberSchema) as any,
    defaultValues: {
      gender: 'male', membershipType: 'standard', autoRenew: false,
      firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '',
      planName: '', startDate: '', endDate: '', price: 0,
      emergencyContactName: '', emergencyContactPhone: '', emergencyContactRelationship: '',
      address: '', city: '', state: '', pincode: '', medicalNotes: '', notes: '', tags: [],
    },
  })

  useEffect(() => {
    if (initialData) {
      const formData = {
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        email: initialData.email,
        phone: initialData.phone,
        gender: initialData.gender,
        dateOfBirth: initialData.dateOfBirth,
        membershipType: initialData.membership.type,
        planName: initialData.membership.planName,
        startDate: initialData.membership.startDate,
        endDate: initialData.membership.endDate,
        price: initialData.membership.price,
        autoRenew: initialData.membership.autoRenew,
        emergencyContactName: initialData.emergencyContact.name,
        emergencyContactPhone: initialData.emergencyContact.phone,
        emergencyContactRelationship: initialData.emergencyContact.relationship,
        address: initialData.address?.street || '',
        city: initialData.address?.city || '',
        state: initialData.address?.state || '',
        pincode: initialData.address?.pincode || '',
        medicalNotes: initialData.medicalNotes || '',
        notes: initialData.notes || '',
        tags: initialData.tags || [],
      }
      reset(formData as any)
    } else {
      reset()
    }
  }, [initialData, reset])

  const handleFormSubmit = async (data: MemberFormData) => {
    await onSubmit(data)
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle>{isEdit ? 'Edit Member' : 'Add New Member'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the member details below.' : 'Fill in the details to register a new gym member.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit as any)} className="px-6 pb-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h4 className="text-[13px] font-semibold text-gray-900 mb-3">Personal Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="First Name" {...register('firstName')} error={errors.firstName?.message} required />
              <Input label="Last Name" {...register('lastName')} error={errors.lastName?.message} required />
              <Input label="Email" type="email" {...register('email')} error={errors.email?.message} required />
              <Input label="Phone" {...register('phone')} error={errors.phone?.message} required />
              <div className="space-y-1.5">
                <label className="block text-[13px] font-medium text-gray-700">Gender <span className="text-red-500">*</span></label>
                <Select value={watch('gender')} onValueChange={v => setValue('gender', v as MemberFormData['gender'])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-xs text-red-500">{errors.gender.message}</p>}
              </div>
              <Input label="Date of Birth" type="date" {...register('dateOfBirth')} error={errors.dateOfBirth?.message} required />
            </div>
          </div>

          <Separator />

          {/* Membership */}
          <div>
            <h4 className="text-[13px] font-semibold text-gray-900 mb-3">Membership Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-[13px] font-medium text-gray-700">Plan Type <span className="text-red-500">*</span></label>
                <Select value={watch('membershipType')} onValueChange={v => setValue('membershipType', v as MemberFormData['membershipType'])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input label="Plan Name" {...register('planName')} error={errors.planName?.message} required />
              <Input label="Start Date" type="date" {...register('startDate')} error={errors.startDate?.message} required />
              <Input label="End Date" type="date" {...register('endDate')} error={errors.endDate?.message} required />
              <Input label="Price (₹)" type="number" {...register('price', { valueAsNumber: true })} error={errors.price?.message} required />
              <div className="flex items-center gap-3 pt-6">
                <Switch checked={watch('autoRenew')} onCheckedChange={v => setValue('autoRenew', v)} />
                <span className="text-[13px] text-gray-700">Auto-renew</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Emergency Contact */}
          <div>
            <h4 className="text-[13px] font-semibold text-gray-900 mb-3">Emergency Contact</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Contact Name" {...register('emergencyContactName')} error={errors.emergencyContactName?.message} required />
              <Input label="Contact Phone" {...register('emergencyContactPhone')} error={errors.emergencyContactPhone?.message} required />
              <Input label="Relationship" {...register('emergencyContactRelationship')} error={errors.emergencyContactRelationship?.message} required />
            </div>
          </div>

          <Separator />

          {/* Address */}
          <div>
            <h4 className="text-[13px] font-semibold text-gray-900 mb-3">Address <span className="text-gray-400 font-normal">(Optional)</span></h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <Input label="Street Address" {...register('address')} />
              </div>
              <Input label="City" {...register('city')} />
              <Input label="State" {...register('state')} />
              <Input label="PIN Code" {...register('pincode')} />
            </div>
          </div>

          <Separator />

          {/* Medical & Notes */}
          <div className="space-y-3">
            <Textarea label="Medical Notes" placeholder="Allergies, injuries, conditions…" {...register('medicalNotes')} />
            <Textarea label="Notes" placeholder="Any additional notes…" {...register('notes')} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" loading={isLoading}>
              {isEdit ? 'Save Changes' : 'Create Member'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
