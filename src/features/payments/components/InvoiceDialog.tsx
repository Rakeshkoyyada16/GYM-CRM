import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Download, Printer } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import type { Invoice } from '../types/payment.types'
import { formatCurrency, getStatusVariant, STATUS_LABELS, METHOD_LABELS } from '../utils/paymentUtils'

interface InvoiceDialogProps {
  invoice: Invoice | null
  isLoading: boolean
  open: boolean
  onClose: () => void
  onDownload: () => void
}

export function InvoiceDialog({ invoice, isLoading, open, onClose, onDownload }: InvoiceDialogProps) {
  if (!open) return null

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl overflow-hidden max-h-[85vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50/50">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Invoice</h2>
            {invoice && <p className="text-[11px] text-gray-400 font-mono">{invoice.invoiceNumber}</p>}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onDownload}>
              <Download className="mr-1.5 h-3.5 w-3.5" /> Download
            </Button>
            <Button variant="outline" size="sm" onClick={onDownload}>
              <Printer className="mr-1.5 h-3.5 w-3.5" /> Print
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={onClose} className="text-gray-400">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : invoice ? (
          <div className="p-6 space-y-6">
            {/* Gym Info + Invoice Meta */}
            <div className="flex justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{invoice.gymName}</h3>
                <p className="text-[12px] text-gray-500 mt-0.5">{invoice.gymAddress}</p>
                <p className="text-[12px] text-gray-500">{invoice.gymEmail} · {invoice.gymPhone}</p>
              </div>
              <div className="text-right">
                <p className="text-[20px] font-bold text-gray-900">{invoice.invoiceNumber}</p>
                <p className="text-[12px] text-gray-500 mt-0.5">
                  Issued: {new Date(invoice.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <p className="text-[12px] text-gray-500">
                  Due: {new Date(invoice.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <Badge variant={getStatusVariant(invoice.status)} className="mt-1.5">{STATUS_LABELS[invoice.status]}</Badge>
              </div>
            </div>

            <Separator />

            {/* Bill To */}
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Bill To</p>
              <p className="text-[14px] font-semibold text-gray-900">{invoice.memberName}</p>
              <p className="text-[12px] text-gray-500">{invoice.memberEmail} · {invoice.memberPhone}</p>
            </div>

            {/* Items Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-4 py-2.5 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Qty</th>
                    <th className="px-4 py-2.5 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Unit Price</th>
                    <th className="px-4 py-2.5 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invoice.items.map((item, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3 text-[13px] text-gray-900">{item.description}</td>
                      <td className="px-4 py-3 text-[13px] text-gray-600 text-center">{item.quantity}</td>
                      <td className="px-4 py-3 text-[13px] text-gray-600 text-right tabular-nums">{formatCurrency(item.unitPrice)}</td>
                      <td className="px-4 py-3 text-[13px] font-semibold text-gray-900 text-right tabular-nums">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-900 tabular-nums">{formatCurrency(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-500">GST ({invoice.taxRate}%)</span>
                  <span className="text-gray-900 tabular-nums">{formatCurrency(invoice.tax)}</span>
                </div>
                {invoice.discount > 0 && (
                  <div className="flex justify-between text-[13px]">
                    <span className="text-gray-500">Discount</span>
                    <span className="text-green-600 tabular-nums">-{formatCurrency(invoice.discount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-[16px] font-bold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900 tabular-nums">{formatCurrency(invoice.total)}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            {invoice.paidDate && (
              <div className="rounded-lg bg-green-50 border border-green-100 p-3">
                <div className="flex items-center gap-2">
                  <Badge variant="success">Paid</Badge>
                  <span className="text-[12px] text-green-700">
                    Paid on {new Date(invoice.paidDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    {' '}via {METHOD_LABELS[invoice.method]}
                  </span>
                </div>
              </div>
            )}

            {/* Notes */}
            {invoice.notes && (
              <p className="text-[12px] text-gray-400 text-center">{invoice.notes}</p>
            )}
          </div>
        ) : null}
      </motion.div>
    </>
  )
}
