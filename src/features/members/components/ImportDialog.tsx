import { useState, useRef } from 'react'
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { parseCSVToMembers } from '../utils/memberUtils'
import type { Member } from '../types/member.types'

interface ImportDialogProps {
  open: boolean
  onClose: () => void
  onImport: (members: Partial<Member>[]) => void
}

export function ImportDialog({ open, onClose, onImport }: ImportDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<Partial<Member>[]>([])
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    if (!selected.name.endsWith('.csv')) {
      setError('Please select a CSV file')
      return
    }
    setFile(selected)
    setError(null)

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string
        const parsed = parseCSVToMembers(text)
        if (parsed.length === 0) {
          setError('No valid records found in CSV')
          return
        }
        setPreview(parsed)
      } catch {
        setError('Failed to parse CSV file')
      }
    }
    reader.readAsText(selected)
  }

  const handleImport = () => {
    onImport(preview)
    setFile(null)
    setPreview([])
    onClose()
  }

  const reset = () => {
    setFile(null)
    setPreview([])
    setError(null)
  }

  return (
    <Dialog open={open} onOpenChange={() => { reset(); onClose() }}>
      <DialogContent className="max-w-md p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Import Members</DialogTitle>
          <DialogDescription>Upload a CSV file to bulk-import members.</DialogDescription>
        </DialogHeader>

        <div className="px-6 space-y-4">
          {!file ? (
            <button
              onClick={() => inputRef.current?.click()}
              className="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-gray-200 hover:border-brand-300 hover:bg-brand-50/30 transition-colors cursor-pointer"
            >
              <Upload className="h-8 w-8 text-gray-300 mb-2" />
              <p className="text-[13px] text-gray-500">Click to upload CSV</p>
              <p className="text-[11px] text-gray-400 mt-0.5">.csv files only</p>
            </button>
          ) : (
            <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50">
              <FileText className="h-8 w-8 text-brand-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-[11px] text-gray-400">{preview.length} records found</p>
              </div>
              <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-100">
              <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
              <p className="text-[12px] text-red-600">{error}</p>
            </div>
          )}

          {preview.length > 0 && (
            <div className="max-h-40 overflow-y-auto rounded-lg border border-gray-200">
              <table className="w-full text-[12px]">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-gray-500">Name</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500">Email</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500">Phone</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {preview.slice(0, 10).map((m, i) => (
                    <tr key={i}>
                      <td className="px-3 py-1.5 text-gray-700">{m.firstName} {m.lastName}</td>
                      <td className="px-3 py-1.5 text-gray-500">{m.email}</td>
                      <td className="px-3 py-1.5 text-gray-500">{m.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {preview.length > 10 && (
                <p className="text-center text-[11px] text-gray-400 py-1.5 border-t border-gray-100">
                  +{preview.length - 10} more records
                </p>
              )}
            </div>
          )}

          <input ref={inputRef} type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
        </div>

        <DialogFooter className="px-6 pb-6">
          <Button variant="outline" onClick={() => { reset(); onClose() }}>Cancel</Button>
          <Button disabled={preview.length === 0} onClick={handleImport}>
            Import {preview.length > 0 ? `(${preview.length})` : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
