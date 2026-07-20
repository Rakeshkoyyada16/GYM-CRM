import { motion } from 'framer-motion'
import { Settings } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { EmptyState } from '@/components/feedback/EmptyState'

/**
 * Settings page.
 * Placeholder until the Settings module is built.
 */
export function SettingsPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Settings</h1>
        <p className="text-surface-600 mt-1">Manage your gym settings and preferences.</p>
      </motion.div>
      <Card>
        <CardContent className="p-0">
          <EmptyState icon={Settings} title="Settings module loading" description="General settings, notifications, billing, security, and team management will be built in the Settings module." />
        </CardContent>
      </Card>
    </div>
  )
}
