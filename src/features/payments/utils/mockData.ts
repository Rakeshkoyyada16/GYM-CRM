import type {
  Payment, Invoice, PaymentStats, RevenueByMonth,
  PaymentMethodBreakdown, PaymentTypeBreakdown, RenewalRecord, InvoiceItem,
} from '../types/payment.types'

const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

// ============================================
// Mock Payments
// ============================================

const MOCK_PAYMENTS: Payment[] = [
  { id: 'p1', invoiceNumber: 'INV-2026-051', memberId: '1', memberName: 'Rahul Sharma', memberEmail: 'rahul@email.com', amount: 24999, currency: 'INR', status: 'paid', method: 'upi', type: 'membership', description: 'Premium Annual Membership', dueDate: '2026-07-15', paidDate: '2026-07-15', createdAt: '2026-07-15T10:00:00Z', updatedAt: '2026-07-15T10:00:00Z' },
  { id: 'p2', invoiceNumber: 'INV-2026-050', memberId: '3', memberName: 'Arjun Reddy', memberEmail: 'arjun@email.com', amount: 49999, currency: 'INR', status: 'paid', method: 'netbanking', type: 'membership', description: 'VIP Annual Membership', dueDate: '2026-07-10', paidDate: '2026-07-10', createdAt: '2026-07-10T09:00:00Z', updatedAt: '2026-07-10T09:00:00Z' },
  { id: 'p3', invoiceNumber: 'INV-2026-049', memberId: '2', memberName: 'Sneha Patel', memberEmail: 'sneha@email.com', amount: 8999, currency: 'INR', status: 'paid', method: 'card', type: 'membership', description: 'Standard Quarterly Membership', dueDate: '2026-07-01', paidDate: '2026-07-01', createdAt: '2026-07-01T08:00:00Z', updatedAt: '2026-07-01T08:00:00Z' },
  { id: 'p4', invoiceNumber: 'INV-2026-048', memberId: '4', memberName: 'Kavya Nair', memberEmail: 'kavya@email.com', amount: 2999, currency: 'INR', status: 'pending', method: 'upi', type: 'membership', description: 'Basic Monthly Membership', dueDate: '2026-07-05', createdAt: '2026-07-05T10:00:00Z', updatedAt: '2026-07-05T10:00:00Z' },
  { id: 'p5', invoiceNumber: 'INV-2026-047', memberId: '9', memberName: 'Deepak Joshi', memberEmail: 'deepak@email.com', amount: 24999, currency: 'INR', status: 'paid', method: 'netbanking', type: 'membership', description: 'Premium Annual Membership', dueDate: '2026-06-15', paidDate: '2026-06-15', createdAt: '2026-06-15T10:00:00Z', updatedAt: '2026-06-15T10:00:00Z' },
  { id: 'p6', invoiceNumber: 'INV-2026-046', memberId: '6', memberName: 'Ananya Gupta', memberEmail: 'ananya@email.com', amount: 19999, currency: 'INR', status: 'paid', method: 'card', type: 'membership', description: 'Premium Semi-Annual', dueDate: '2026-06-01', paidDate: '2026-06-01', createdAt: '2026-06-01T09:00:00Z', updatedAt: '2026-06-01T09:00:00Z' },
  { id: 'p7', invoiceNumber: 'INV-2026-045', memberId: '7', memberName: 'Ravi Kumar', memberEmail: 'ravi@email.com', amount: 15999, currency: 'INR', status: 'paid', method: 'upi', type: 'membership', description: 'Standard Annual Membership', dueDate: '2026-05-10', paidDate: '2026-05-10', createdAt: '2026-05-10T08:00:00Z', updatedAt: '2026-05-10T08:00:00Z' },
  { id: 'p8', invoiceNumber: 'INV-2026-044', memberId: '8', memberName: 'Meera Iyer', memberEmail: 'meera@email.com', amount: 2999, currency: 'INR', status: 'unpaid', method: 'upi', type: 'membership', description: 'Basic Monthly Membership', dueDate: '2026-07-15', createdAt: '2026-07-15T10:00:00Z', updatedAt: '2026-07-15T10:00:00Z' },
  { id: 'p9', invoiceNumber: 'INV-2026-043', memberId: '10', memberName: 'Priya Menon', memberEmail: 'priya@email.com', amount: 8999, currency: 'INR', status: 'paid', method: 'card', type: 'membership', description: 'Standard Quarterly Membership', dueDate: '2026-04-20', paidDate: '2026-04-20', createdAt: '2026-04-20T10:00:00Z', updatedAt: '2026-04-20T10:00:00Z' },
  { id: 'p10', invoiceNumber: 'INV-2026-042', memberId: '1', memberName: 'Rahul Sharma', memberEmail: 'rahul@email.com', amount: 5000, currency: 'INR', status: 'paid', method: 'cash', type: 'personal_training', description: 'Personal Training — 10 Sessions', dueDate: '2026-03-01', paidDate: '2026-03-01', createdAt: '2026-03-01T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z' },
  { id: 'p11', invoiceNumber: 'INV-2026-041', memberId: '11', memberName: 'Amit Verma', memberEmail: 'amit@email.com', amount: 49999, currency: 'INR', status: 'paid', method: 'netbanking', type: 'membership', description: 'VIP Annual Membership', dueDate: '2026-06-01', paidDate: '2026-06-01', createdAt: '2026-06-01T11:00:00Z', updatedAt: '2026-06-01T11:00:00Z' },
  { id: 'p12', invoiceNumber: 'INV-2026-040', memberId: '5', memberName: 'Vikram Singh', memberEmail: 'vikram@email.com', amount: 14999, currency: 'INR', status: 'overdue', method: 'upi', type: 'renewal', description: 'Standard Semi-Annual Renewal', dueDate: '2026-05-20', createdAt: '2026-05-20T10:00:00Z', updatedAt: '2026-05-20T10:00:00Z' },
  { id: 'p13', invoiceNumber: 'INV-2026-039', memberId: '3', memberName: 'Arjun Reddy', memberEmail: 'arjun@email.com', amount: 5000, currency: 'INR', status: 'paid', method: 'cash', type: 'personal_training', description: 'Personal Training — 10 Sessions', dueDate: '2026-04-15', paidDate: '2026-04-15', createdAt: '2026-04-15T10:00:00Z', updatedAt: '2026-04-15T10:00:00Z' },
  { id: 'p14', invoiceNumber: 'INV-2026-038', memberId: '2', memberName: 'Sneha Patel', memberEmail: 'sneha@email.com', amount: 1200, currency: 'INR', status: 'paid', method: 'upi', type: 'merchandise', description: 'Gym T-shirt + Water Bottle', dueDate: '2026-06-10', paidDate: '2026-06-10', createdAt: '2026-06-10T14:00:00Z', updatedAt: '2026-06-10T14:00:00Z' },
  { id: 'p15', invoiceNumber: 'INV-2026-037', memberId: '9', memberName: 'Deepak Joshi', memberEmail: 'deepak@email.com', amount: 3500, currency: 'INR', status: 'partial', method: 'card', type: 'class_package', description: 'Boxing Class Package (20 sessions)', dueDate: '2026-07-01', createdAt: '2026-07-01T10:00:00Z', updatedAt: '2026-07-01T10:00:00Z' },
]

// ============================================
// Mock Revenue Data
// ============================================

const MOCK_REVENUE: RevenueByMonth[] = [
  { month: 'Aug', revenue: 320000, expenses: 180000, profit: 140000 },
  { month: 'Sep', revenue: 335000, expenses: 185000, profit: 150000 },
  { month: 'Oct', revenue: 310000, expenses: 175000, profit: 135000 },
  { month: 'Nov', revenue: 345000, expenses: 190000, profit: 155000 },
  { month: 'Dec', revenue: 380000, expenses: 200000, profit: 180000 },
  { month: 'Jan', revenue: 420000, expenses: 210000, profit: 210000 },
  { month: 'Feb', revenue: 395000, expenses: 205000, profit: 190000 },
  { month: 'Mar', revenue: 410000, expenses: 215000, profit: 195000 },
  { month: 'Apr', revenue: 385000, expenses: 195000, profit: 190000 },
  { month: 'May', revenue: 370000, expenses: 190000, profit: 180000 },
  { month: 'Jun', revenue: 390000, expenses: 200000, profit: 190000 },
  { month: 'Jul', revenue: 385000, expenses: 195000, profit: 190000 },
]

// ============================================
// Mock Renewals
// ============================================

const MOCK_RENEWALS: RenewalRecord[] = [
  { id: 'r1', memberId: '4', memberName: 'Kavya Nair', currentPlan: 'Basic Monthly', expiryDate: '2026-08-05', daysUntilExpiry: 16, lastPayment: 2999, autoRenew: false, status: 'expiring_soon' },
  { id: 'r2', memberId: '8', memberName: 'Meera Iyer', currentPlan: 'Basic Monthly', expiryDate: '2026-08-15', daysUntilExpiry: 26, lastPayment: 2999, autoRenew: true, status: 'expiring_soon' },
  { id: 'r3', memberId: '2', memberName: 'Sneha Patel', currentPlan: 'Standard Quarterly', expiryDate: '2026-10-01', daysUntilExpiry: 73, lastPayment: 8999, autoRenew: true, status: 'renewed' },
  { id: 'r4', memberId: '6', memberName: 'Ananya Gupta', currentPlan: 'Premium Semi-Annual', expiryDate: '2026-12-01', daysUntilExpiry: 134, lastPayment: 19999, autoRenew: true, status: 'renewed' },
  { id: 'r5', memberId: '5', memberName: 'Vikram Singh', currentPlan: 'Standard Semi-Annual', expiryDate: '2026-05-20', daysUntilExpiry: -61, lastPayment: 14999, autoRenew: false, status: 'expired' },
  { id: 'r6', memberId: '12', memberName: 'Divya Krishnan', currentPlan: 'Standard Annual', expiryDate: '2026-08-15', daysUntilExpiry: 26, lastPayment: 15999, autoRenew: false, status: 'expiring_soon' },
]

// ============================================
// API Functions
// ============================================

export async function fetchPayments(): Promise<Payment[]> {
  await delay(300)
  return [...MOCK_PAYMENTS]
}

export async function fetchPaymentStats(): Promise<PaymentStats> {
  await delay(200)
  const paid = MOCK_PAYMENTS.filter(p => p.status === 'paid')
  const pending = MOCK_PAYMENTS.filter(p => p.status === 'pending' || p.status === 'unpaid')
  const overdue = MOCK_PAYMENTS.filter(p => p.status === 'overdue')
  return {
    totalRevenue: paid.reduce((s, p) => s + p.amount, 0),
    monthlyRevenue: 385000,
    revenueGrowth: 12.5,
    pendingAmount: pending.reduce((s, p) => s + p.amount, 0),
    pendingCount: pending.length,
    overdueCount: overdue.length,
    collectedThisMonth: 84997,
    avgPaymentValue: Math.round(paid.reduce((s, p) => s + p.amount, 0) / paid.length),
    totalTransactions: MOCK_PAYMENTS.length,
  }
}

export async function fetchRevenueByMonth(): Promise<RevenueByMonth[]> {
  await delay(350)
  return [...MOCK_REVENUE]
}

export async function fetchPaymentMethodBreakdown(): Promise<PaymentMethodBreakdown[]> {
  await delay(200)
  return [
    { method: 'upi', count: 6, amount: 75995, percentage: 35 },
    { method: 'netbanking', count: 3, amount: 89997, percentage: 41 },
    { method: 'card', count: 4, amount: 39197, percentage: 18 },
    { method: 'cash', count: 2, amount: 6200, percentage: 3 },
    { method: 'wallet', count: 0, amount: 0, percentage: 0 },
    { method: 'cheque', count: 0, amount: 0, percentage: 0 },
  ]
}

export async function fetchPaymentTypeBreakdown(): Promise<PaymentTypeBreakdown[]> {
  await delay(200)
  return [
    { type: 'membership', count: 11, amount: 206989, percentage: 82 },
    { type: 'personal_training', count: 2, amount: 10000, percentage: 4 },
    { type: 'class_package', count: 1, amount: 3500, percentage: 1 },
    { type: 'merchandise', count: 1, amount: 1200, percentage: 0.5 },
    { type: 'renewal', count: 1, amount: 14999, percentage: 6 },
  ]
}

export async function fetchRenewals(): Promise<RenewalRecord[]> {
  await delay(250)
  return [...MOCK_RENEWALS]
}

export async function fetchInvoice(paymentId: string): Promise<Invoice> {
  await delay(200)
  const payment = MOCK_PAYMENTS.find(p => p.id === paymentId) || MOCK_PAYMENTS[0]
  const items: InvoiceItem[] = [
    { description: payment.description, quantity: 1, unitPrice: payment.amount, amount: payment.amount },
  ]
  const taxRate = 18
  const subtotal = payment.amount
  const tax = Math.round(subtotal * taxRate / 100)
  return {
    id: `inv-${payment.id}`,
    invoiceNumber: payment.invoiceNumber,
    memberName: payment.memberName,
    memberEmail: payment.memberEmail,
    memberPhone: '+91 98765 43210',
    gymName: 'GymFlow Fitness Center',
    gymAddress: '123 Jubilee Hills, Hyderabad, Telangana 500033',
    gymEmail: 'billing@gymflow.com',
    gymPhone: '+91 40 1234 5678',
    items, subtotal, taxRate, tax, discount: 0,
    total: subtotal + tax,
    status: payment.status,
    method: payment.method,
    dueDate: payment.dueDate,
    paidDate: payment.paidDate,
    createdAt: payment.createdAt,
    notes: 'Thank you for your membership!',
  }
}

export async function exportPaymentsCSV(payments: Payment[]): Promise<void> {
  await delay(200)
  const headers = ['Invoice', 'Member', 'Email', 'Amount', 'Status', 'Method', 'Type', 'Description', 'Due Date', 'Paid Date']
  const rows = payments.map(p => [
    p.invoiceNumber, p.memberName, p.memberEmail, p.amount.toString(),
    p.status, p.method, p.type, p.description, p.dueDate, p.paidDate || '—',
  ])
  const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `payments-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export function downloadInvoicePDF(invoice: Invoice): void {
  // In production this would generate a real PDF
  // For now we create a printable HTML page
  const html = `<!DOCTYPE html><html><head><title>${invoice.invoiceNumber}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Inter,system-ui,sans-serif;padding:40px;color:#1a1a1a}
.header{display:flex;justify-content:space-between;margin-bottom:40px;border-bottom:2px solid #eee;padding-bottom:20px}
.header h1{font-size:28px;color:#4361ee}
.header .invoice-info{text-align:right}
.header .invoice-info p{font-size:13px;color:#666;margin:2px 0}
.section{margin-bottom:24px}
.section h3{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#999;margin-bottom:8px}
.section p{font-size:13px;color:#333;line-height:1.6}
table{width:100%;border-collapse:collapse;margin:20px 0}
th{text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#999;border-bottom:2px solid #eee;padding:8px 0}
td{font-size:13px;color:#333;padding:10px 0;border-bottom:1px solid #f5f5f5}
.total-section{display:flex;justify-content:flex-end}
.total-box{width:250px}
.total-row{display:flex;justify-content:space-between;padding:6px 0;font-size:13px;color:#666}
.total-row.grand{font-size:16px;font-weight:700;color:#1a1a1a;border-top:2px solid #eee;padding-top:12px;margin-top:8px}
.footer{margin-top:60px;text-align:center;font-size:11px;color:#999}
.badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600}
.badge-paid{background:#ecfdf3;color:#027a48}
.badge-pending{background:#fffbeb;color:#b45309}
</style></head><body>
<div class="header">
<div><h1>GymFlow</h1><p style="font-size:13px;color:#666">Fitness Center</p></div>
<div class="invoice-info"><p style="font-size:20px;font-weight:700;color:#1a1a1a">${invoice.invoiceNumber}</p><p>Date: ${new Date(invoice.createdAt).toLocaleDateString('en-IN')}</p><p>Due: ${new Date(invoice.dueDate).toLocaleDateString('en-IN')}</p></div>
</div>
<div style="display:flex;gap:60px;margin-bottom:30px">
<div class="section"><h3>From</h3><p>${invoice.gymName}</p><p>${invoice.gymAddress}</p><p>${invoice.gymEmail}</p><p>${invoice.gymPhone}</p></div>
<div class="section"><h3>Bill To</h3><p>${invoice.memberName}</p><p>${invoice.memberEmail}</p><p>${invoice.memberPhone}</p></div>
</div>
<table><thead><tr><th>Description</th><th>Qty</th><th style="text-align:right">Unit Price</th><th style="text-align:right">Amount</th></tr></thead>
<tbody>${invoice.items.map(item => `<tr><td>${item.description}</td><td>${item.quantity}</td><td style="text-align:right">₹${item.unitPrice.toLocaleString('en-IN')}</td><td style="text-align:right">₹${item.amount.toLocaleString('en-IN')}</td></tr>`).join('')}</tbody></table>
<div class="total-section"><div class="total-box">
<div class="total-row"><span>Subtotal</span><span>₹${invoice.subtotal.toLocaleString('en-IN')}</span></div>
<div class="total-row"><span>GST (${invoice.taxRate}%)</span><span>₹${invoice.tax.toLocaleString('en-IN')}</span></div>
${invoice.discount > 0 ? `<div class="total-row"><span>Discount</span><span>-₹${invoice.discount.toLocaleString('en-IN')}</span></div>` : ''}
<div class="total-row grand"><span>Total</span><span>₹${invoice.total.toLocaleString('en-IN')}</span></div>
</div></div>
<div style="margin-top:30px"><span class="badge badge-${invoice.status === 'paid' ? 'paid' : 'pending'}">${invoice.status === 'paid' ? 'PAID' : 'PENDING'}</span>
${invoice.paidDate ? `<span style="font-size:12px;color:#666;margin-left:8px">Paid on ${new Date(invoice.paidDate).toLocaleDateString('en-IN')} via ${invoice.method.toUpperCase()}</span>` : ''}</div>
${invoice.notes ? `<div class="footer"><p>${invoice.notes}</p></div>` : ''}
<script>window.print()</script></body></html>`
  const win = window.open('', '_blank')
  if (win) { win.document.write(html); win.document.close() }
}
