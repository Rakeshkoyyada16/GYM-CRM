import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, Dumbbell, Calendar, CreditCard,
  ClipboardCheck, BarChart3, Settings, ChevronLeft, ChevronRight, Search, Funnel,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface NavItem { label: string; href: string; icon: React.ElementType; badge?: number }

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Members', href: '/members', icon: Users, badge: 623 },
  { label: 'Leads', href: '/leads', icon: Funnel, badge: 12 },
  { label: 'Trainers', href: '/trainers', icon: Dumbbell },
  { label: 'Classes', href: '/classes', icon: Calendar },
  { label: 'Payments', href: '/payments', icon: CreditCard, badge: 12 },
  { label: 'Attendance', href: '/attendance', icon: ClipboardCheck },
  { label: 'Reports', href: '/reports', icon: BarChart3 },
  { label: 'Settings', href: '/settings', icon: Settings },
]

interface SidebarProps { collapsed: boolean; onToggle: () => void }

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation()

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-gray-200 bg-white"
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-4 shrink-0">
          <AnimatePresence mode="wait">
            {!collapsed ? (
              <motion.div
                key="full-logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-3"
              >
                <img src="/gym_logo.jpg" alt="GOAAL Fitness" className="h-8 w-auto" />
              </motion.div>
            ) : (
              <motion.div
                key="icon-logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mx-auto"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500">
                  <Dumbbell className="h-4 w-4 text-white" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Separator />

        {/* Search */}
        {!collapsed && (
          <div className="px-3 pt-3 pb-1">
            <button className="flex h-8 w-full items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 text-xs text-gray-400 hover:border-gray-300 hover:bg-white transition-colors">
              <Search className="h-3.5 w-3.5" />
              <span>Search…</span>
              <kbd className="ml-auto rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-400">⌘K</kbd>
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.href)
            const Icon = item.icon

            const link = (
              <NavLink
                key={item.href}
                to={item.href}
                className={cn(
                  'group flex items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-all duration-150',
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600')} />
                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex-1 truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {!collapsed && item.badge && (
                  <span className={cn(
                    'flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold tabular-nums',
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                  )}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            )

            return collapsed ? (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            ) : link
          })}
        </nav>

        <Separator />

        {/* User */}
        <div className="p-3">
          <div className={cn('flex items-center gap-2.5 rounded-lg p-2 hover:bg-gray-50 transition-colors cursor-pointer', collapsed && 'justify-center')}>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-brand-100 text-brand-700 text-[10px] font-bold">AK</AvatarFallback>
            </Avatar>
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-[13px] font-medium text-gray-900 truncate leading-none">Admin Kumar</p>
                  <p className="text-[11px] text-gray-400 truncate mt-0.5">admin@gymflow.com</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Collapse button */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 shadow-sm hover:text-gray-600 hover:border-gray-300 transition-colors"
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </motion.aside>
    </TooltipProvider>
  )
}
