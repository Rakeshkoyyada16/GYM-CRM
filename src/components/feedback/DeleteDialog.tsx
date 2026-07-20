import { memo } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface DeleteDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
  itemName?: string
  itemCount?: number
  isLoading?: boolean
}

/**
 * Shared delete confirmation dialog.
 * Used by Members, Leads, Trainers, and any future feature.
 */
export const DeleteDialog = memo(function DeleteDialog({
  open, onClose, onConfirm, title, description, itemName, itemCount, isLoading,
}: DeleteDialogProps) {
  const isBulk = (itemCount ?? 0) > 1

  const resolvedTitle = title || (isBulk ? `Delete ${itemCount} items?` : 'Delete item?')
  const resolvedDescription = description || (isBulk
    ? `You are about to permanently delete ${itemCount} items. This cannot be undone.`
    : `You are about to permanently delete ${itemName || 'this item'}. This cannot be undone.`)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm p-0" aria-describedby="delete-dialog-desc">
        <DialogHeader className="px-6 pt-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 mb-3">
            <AlertTriangle className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
          <DialogTitle>{resolvedTitle}</DialogTitle>
          <DialogDescription id="delete-dialog-desc">{resolvedDescription}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="px-6 pb-6">
          <Button variant="outline" onClick={onClose} autoFocus>Cancel</Button>
          <Button variant="destructive" loading={isLoading} onClick={onConfirm} aria-label={resolvedTitle}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})
