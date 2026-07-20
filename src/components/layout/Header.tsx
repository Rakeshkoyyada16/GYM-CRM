import { Fragment } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Bell, Menu, ChevronRight, Inbox, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/useTheme'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean)
  const crumbs: { label: string; href?: string }[] = []
  let path = ''
  segments.forEach((seg, i) => {
    path += `/${seg}`
    crumbs.push({
      label: seg.charAt(0).toUpperCase() + seg.slice(1),
      href: i < segments.length - 1 ? path : undefined,
    })
  })
  return crumbs
}

interface HeaderProps { onMenuClick?: () => void }

export function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation()
  const { resolvedTheme, toggleTheme } = useTheme()
  const crumbs = getBreadcrumbs(location.pathname)
  const isDark = resolvedTheme === 'dark'

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/95 backdrop-blur-sm px-6"
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" className="lg:hidden" onClick={onMenuClick}>
          <Menu className="h-4 w-4" />
        </Button>

        <nav className="hidden md:flex items-center text-[13px]">
          <a href="/dashboard" className="text-gray-400 hover:text-gray-600 transition-colors">Home</a>
          {crumbs.map((crumb, i) => (
            <Fragment key={crumb.label}>
              <ChevronRight className="mx-1.5 h-3.5 w-3.5 text-gray-300" />
              {crumb.href ? (
                <a href={crumb.href} className="text-gray-400 hover:text-gray-600 transition-colors">{crumb.label}</a>
              ) : (
                <span className="font-medium text-gray-900">{crumb.label}</span>
              )}
            </Fragment>
          ))}
        </nav>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" className="hidden md:flex text-gray-400 hover:text-gray-600">
          <Search className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          className="text-gray-400 hover:text-gray-600"
          onClick={toggleTheme}
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
          aria-pressed={isDark}
          title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
        >
          {isDark ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
        </Button>

        <Button variant="ghost" size="icon-sm" className="relative text-gray-400 hover:text-gray-600">
          <Inbox className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[9px] font-bold text-white">
            3
          </span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="relative text-gray-400 hover:text-gray-600">
              <Bell className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
              <span className="text-[13px] font-semibold text-gray-900">Notifications</span>
              <Badge variant="default">3 new</Badge>
            </div>
            {[
              { title: 'New member registered', desc: 'Rahul Sharma joined Premium', time: '2m' },
              { title: 'Payment received', desc: '₹24,999 from Arjun Reddy', time: '15m' },
              { title: 'Class full', desc: 'HIIT Blast at capacity', time: '1h' },
            ].map((n, i) => (
              <DropdownMenuItem key={i} className="flex flex-col items-start gap-0.5 p-3 cursor-pointer">
                <div className="flex w-full items-center justify-between">
                  <span className="text-[13px] font-medium text-gray-900">{n.title}</span>
                  <span className="text-[11px] text-gray-400">{n.time}</span>
                </div>
                <span className="text-[12px] text-gray-500">{n.desc}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="ml-2 pl-2 border-l border-gray-200">
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarFallback className="bg-gray-900 text-white text-[10px] font-bold">AK</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </motion.header>
  )
}
