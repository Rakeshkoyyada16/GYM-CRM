import { motion } from 'framer-motion'
import { Plus, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { EmptyState } from '@/components/feedback/EmptyState'

/**
 * Classes list page.
 * Placeholder until the Classes module is built.
 */
export function ClassesPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Classes</h1>
          <p className="text-surface-600 mt-1">Manage your gym classes and schedules.</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />Create Class</Button>
      </motion.div>
      <Card>
        <CardContent className="p-0">
          <EmptyState icon={Calendar} title="Classes module loading" description="The full classes grid, calendar, and forms will be built in the Classes module." />
        </CardContent>
      </Card>
    </div>
  )
}
