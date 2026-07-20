import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { CreditCard } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EmptyState } from '@/components/feedback/EmptyState'

import { PaymentStatsBar } from '../components/PaymentStatsBar'
import { RevenueChart } from '../components/RevenueChart'
import { PaymentMethodsChart, TypeBreakdown } from '../components/PaymentBreakdown'
import { TransactionTable } from '../components/TransactionTable'
import { PaymentFilters } from '../components/PaymentFilters'
import { RenewalsTable } from '../components/RenewalsTable'
import { InvoiceDialog } from '../components/InvoiceDialog'

import {
  usePayments, usePaymentStats, useRevenueChart,
  usePaymentMethodBreakdown, usePaymentTypeBreakdown, useRenewals, useInvoice,
} from '../hooks/usePayments'
import type { Payment } from '../types/payment.types'

export function PaymentsPage() {
  const { payments, isLoading, filters, setFilters, sortField, sortDir, handleSort, exportAll } = usePayments()
  const stats = usePaymentStats()
  const revenue = useRevenueChart()
  const methods = usePaymentMethodBreakdown()
  const types = usePaymentTypeBreakdown()
  const renewals = useRenewals()
  const invoice = useInvoice()

  const [activeTab, setActiveTab] = useState('transactions')
  const [invoiceOpen, setInvoiceOpen] = useState(false)

  const handleViewInvoice = useCallback(async (payment: Payment) => {
    await invoice.loadInvoice(payment.id)
    setInvoiceOpen(true)
  }, [invoice])

  const handleDownloadInvoice = useCallback(() => {
    invoice.downloadPDF()
    toast.success('Invoice downloaded')
  }, [invoice])

  const handleRenew = useCallback(() => {
    toast.success('Membership renewed successfully')
    renewals.renewals // trigger re-render
  }, [renewals])

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Payments</h1>
        <p className="text-[13px] text-gray-500 mt-0.5">Track transactions, invoices, and revenue analytics.</p>
      </motion.div>

      {/* Stats */}
      <PaymentStatsBar stats={stats.stats} isLoading={stats.isLoading} />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="renewals">Renewals</TabsTrigger>
        </TabsList>

        {/* ── Transactions Tab ── */}
        <TabsContent value="transactions">
          <div className="space-y-4 mt-4">
            <PaymentFilters
              filters={filters}
              onFiltersChange={setFilters}
              onExport={exportAll}
              resultCount={payments.length}
            />

            {payments.length === 0 && !isLoading ? (
              <Card><CardContent className="p-0">
                <EmptyState
                  icon={CreditCard}
                  title="No transactions match your filters"
                  description="Try adjusting your search or filters."
                />
              </CardContent></Card>
            ) : (
              <TransactionTable
                payments={payments}
                isLoading={isLoading}
                sortField={sortField}
                sortDir={sortDir}
                onSort={handleSort}
                onViewInvoice={handleViewInvoice}
              />
            )}
          </div>
        </TabsContent>

        {/* ── Analytics Tab ── */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
            <div className="lg:col-span-8">
              <RevenueChart data={revenue.data} isLoading={revenue.isLoading} />
            </div>
            <div className="lg:col-span-4 space-y-4">
              <PaymentMethodsChart data={methods.data} isLoading={methods.isLoading} />
              <TypeBreakdown data={types.data} isLoading={types.isLoading} />
            </div>
          </div>
        </TabsContent>

        {/* ── Renewals Tab ── */}
        <TabsContent value="renewals">
          <div className="mt-4">
            <RenewalsTable renewals={renewals.renewals} isLoading={renewals.isLoading} onRenew={handleRenew} />
          </div>
        </TabsContent>
      </Tabs>

      {/* Invoice Dialog */}
      <InvoiceDialog
        invoice={invoice.invoice}
        isLoading={invoice.isLoading}
        open={invoiceOpen}
        onClose={() => { setInvoiceOpen(false); invoice.clearInvoice() }}
        onDownload={handleDownloadInvoice}
      />
    </div>
  )
}
