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
import { Checkbox } from '@/components/ui/checkbox'
import type { Trainer, TrainerFormData, Specialization } from '../types/trainer.types'
import { SPECIALIZATION_LABELS } from '../utils/trainerUtils'

const trainerSchema = z.object({
  firstName: z.string().min(2, 'Min 2 characters'),
  lastName: z.string().min(2, 'Min 2 characters'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Min 10 digits'),
  gender: z.enum(['male', 'female', 'other']),
  dateOfBirth: z.string().min(1, 'Required'),
  specializations: z.array(z.string()).min(1, 'Select at least one'),
  certifications: z.array(z.string()).default([]),
  experience: z.number().min(0),
  salary: z.number().min(0),
  bio: z.string().default(''),
})

const ALL_SPECIALIZATIONS: Specialization[] = [
  'strength', 'cardio', 'yoga', 'pilates', 'crossfit', 'boxing', 'zumba', 'hiit', 'spinning', 'nutrition', 'rehabilitation',
]

interface TrainerFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: TrainerFormData) => Promise<void>
  initialData?: Trainer | null
  isLoading?: boolean
}

export function TrainerForm({ open, onClose, onSubmit, initialData, isLoading }: TrainerFormProps) {
  const isEdit = !!initialData

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(trainerSchema) as any,
    defaultValues: {
      firstName: '', lastName: '', email: '', phone: '',
      gender: 'male' as const, dateOfBirth: '',
      specializations: [] as string[], certifications: [] as string[],
      experience: 0, salary: 0, bio: '',
    },
  })

  const selectedSpecs = watch('specializations') || []

  useEffect(() => {
    if (initialData) {
      reset({
        firstName: initialData.firstName, lastName: initialData.lastName,
        email: initialData.email, phone: initialData.phone,
        gender: initialData.gender, dateOfBirth: initialData.dateOfBirth,
        specializations: initialData.specializations, certifications: initialData.certifications,
        experience: initialData.experience, salary: initialData.salary, bio: initialData.bio,
      } as any)
    } else {
      reset({ firstName: '', lastName: '', email: '', phone: '', gender: 'male', dateOfBirth: '', specializations: [], certifications: [], experience: 0, salary: 0, bio: '' } as any)
    }
  }, [initialData, reset])

  const toggleSpec = (spec: Specialization) => {
    const current = selectedSpecs as string[]
    if (current.includes(spec)) {
      setValue('specializations', current.filter(s => s !== spec) as any)
    } else {
      setValue('specializations', [...current, spec] as any)
    }
  }

  const handleFormSubmit = async (data: any) => {
    await onSubmit(data as TrainerFormData)
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle>{isEdit ? 'Edit Trainer' : 'Add New Trainer'}</DialogTitle>
          <DialogDescription>{isEdit ? 'Update trainer details.' : 'Add a new trainer to your gym.'}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit as any)} className="px-6 pb-6 space-y-5">
          <div>
            <h4 className="text-[13px] font-semibold text-gray-900 mb-3">Personal Information</h4>
            <div className="grid grid-cols-2 gap-3">
              <Input label="First Name" {...register('firstName')} error={errors.firstName?.message} required />
              <Input label="Last Name" {...register('lastName')} error={errors.lastName?.message} required />
              <Input label="Email" type="email" {...register('email')} error={errors.email?.message} required />
              <Input label="Phone" {...register('phone')} error={errors.phone?.message} required />
              <div className="space-y-1.5">
                <label className="block text-[13px] font-medium text-gray-700">Gender</label>
                <Select value={watch('gender')} onValueChange={v => setValue('gender', v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input label="Date of Birth" type="date" {...register('dateOfBirth')} error={errors.dateOfBirth?.message} required />
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-[13px] font-semibold text-gray-900 mb-3">Professional Details</h4>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Experience (years)" type="number" {...register('experience', { valueAsNumber: true })} />
              <Input label="Salary (₹/month)" type="number" {...register('salary', { valueAsNumber: true })} />
            </div>

            <div className="mt-3 space-y-1.5">
              <label className="block text-[13px] font-medium text-gray-700">
                Specializations <span className="text-red-500">*</span>
              </label>
              {errors.specializations && <p className="text-xs text-red-500">{errors.specializations.message}</p>}
              <div className="grid grid-cols-3 gap-2 mt-1.5">
                {ALL_SPECIALIZATIONS.map(spec => (
                  <label key={spec} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <Checkbox checked={selectedSpecs.includes(spec)} onCheckedChange={() => toggleSpec(spec)} />
                    <span className="text-[12px] text-gray-700">{SPECIALIZATION_LABELS[spec]}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          <Textarea label="Bio" placeholder="Tell us about this trainer's background and expertise…" {...register('bio')} />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" loading={isLoading}>{isEdit ? 'Save Changes' : 'Add Trainer'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
