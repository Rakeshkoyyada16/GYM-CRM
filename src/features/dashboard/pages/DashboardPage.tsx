import { motion } from 'framer-motion'
import {
  Users, UserCheck, IndianRupee, TrendingUp,
  UserPlus, AlertCircle, Clock, Sparkles, ClipboardCheck,
} from 'lucide-react'

import { MetricCard, MetricCardSkeleton } from '../components/MetricCard'
import { DashboardDatePicker } from '../components/DashboardDatePicker'
import { RevenueChart } from '../components/RevenueChart'
import { AttendanceChart } from '../components/AttendanceChart'
import { MembershipGrowthChart } from '../components/MembershipGrowthChart'
import { RecentMembers } from '../components/RecentMembers'
import { RecentPayments } from '../components/RecentPayments'
import { TopTrainers } from '../components/TopTrainers'
import { ActivityFeed } from '../components/ActivityFeed'
import { CalendarWidget } from '../components/CalendarWidget'
import { Announcements } from '../components/Announcements'
import { TodayClasses } from '../components/TodayClasses'
import { QuickActions } from '../components/QuickActions'

import {
  useDashboardStats, useRevenueChart, useAttendanceChart,
  useMembershipGrowth, useRecentMembers, useRecentPayments,
  useTopTrainers, useActivityFeed, useCalendarEvents,
  useAnnouncements, useTodayClasses,
} from '../hooks/useDashboard'

import { getGreeting } from '@/lib/utils'

/**
 * Premium Dashboard Page
 *
 * Layout: 12-column grid
 * ┌─────────────────────────────────────────────────────┐
 * │  Header (greeting + date + actions)                 │
 * ├─────────────────────────────────────────────────────┤
 * │  8× Metric Cards (2 rows × 4 cols)                 │
 * ├──────────────────────────┬──────────────────────────┤
 * │  Revenue Chart (8col)    │  Quick Actions (4col)    │
 * ├──────────────────────────┼──────────────────────────┤
 * │  Attendance Chart (8col) │  Today's Classes (4col)  │
 * ├──────────────────────────┼──────────────────────────┤
 * │  Membership Growth (4col)│  Calendar (4col)         │
 * │  Announcements (4col)    │  Top Trainers (4col)     │
 * ├──────────────────────────┼──────────────────────────┤
 * │  Recent Members (6col)   │  Recent Payments (6col)  │
 * ├──────────────────────────┴──────────────────────────┤
 * │  Activity Feed (full width)                         │
 * └─────────────────────────────────────────────────────┘
 */
export function DashboardPage() {
  const stats = useDashboardStats()
  const revenue = useRevenueChart()
  const attendance = useAttendanceChart()
  const membership = useMembershipGrowth()
  const recentMembers = useRecentMembers()
  const recentPayments = useRecentPayments()
  const trainers = useTopTrainers()
  const activity = useActivityFeed()
  const calendar = useCalendarEvents()
  const announcements = useAnnouncements()
  const todayClasses = useTodayClasses()

  const isLoading = stats.isLoading

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              {getGreeting()}, Admin
            </h1>
            <Sparkles className="h-5 w-5 text-amber-400" />
          </div>
          <p className="text-[13px] text-gray-500">
            Here's what's happening at your gym today.
          </p>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <DashboardDatePicker />
        </div>
      </motion.div>

      {/* ── Metric Cards Row 1 ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
          </>
        ) : (
          <>
            <MetricCard
              title="Today's Revenue"
              value={stats.data?.todayRevenue ?? 0}
              change={stats.data?.revenueGrowth}
              changeLabel="vs yesterday"
              icon={IndianRupee}
              format="currency"
              variant="default"
              index={0}
            />
            <MetricCard
              title="Monthly Revenue"
              value={stats.data?.monthlyRevenue ?? 0}
              change={stats.data?.revenueGrowth}
              changeLabel="vs last month"
              icon={TrendingUp}
              format="currency"
              variant="success"
              index={1}
            />
            <MetricCard
              title="Active Members"
              value={stats.data?.activeMembers ?? 0}
              change={stats.data?.memberGrowth}
              changeLabel="vs last month"
              icon={UserCheck}
              format="number"
              variant="info"
              index={2}
            />
            <MetricCard
              title="Total Members"
              value={stats.data?.totalMembers ?? 0}
              change={stats.data?.memberGrowth}
              changeLabel="vs last month"
              icon={Users}
              format="number"
              variant="default"
              index={3}
            />
          </>
        )}
      </div>

      {/* ── Metric Cards Row 2 ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
          </>
        ) : (
          <>
            <MetricCard
              title="Today's Attendance"
              value={stats.data?.todayAttendance ?? 0}
              change={stats.data?.attendanceGrowth}
              changeLabel="vs yesterday"
              icon={ClipboardCheck}
              format="number"
              variant="success"
              index={4}
            />
            <MetricCard
              title="Expiring Memberships"
              value={stats.data?.expiringMemberships ?? 0}
              subtitle="This month"
              icon={Clock}
              format="number"
              variant="warning"
              index={5}
            />
            <MetricCard
              title="New Leads"
              value={stats.data?.newLeads ?? 0}
              subtitle="This week"
              icon={UserPlus}
              format="number"
              variant="info"
              index={6}
            />
            <MetricCard
              title="Pending Payments"
              value={stats.data?.pendingPayments ?? 0}
              subtitle={`${stats.data?.pendingAmount ? `₹${(stats.data.pendingAmount / 1000).toFixed(1)}K` : ''} due`}
              icon={AlertCircle}
              format="number"
              variant="danger"
              index={7}
            />
          </>
        )}
      </div>

      {/* ── Revenue Chart + Quick Actions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8">
          <RevenueChart data={revenue.data} isLoading={revenue.isLoading} />
        </div>
        <div className="lg:col-span-4">
          <QuickActions />
        </div>
      </div>

      {/* ── Attendance Chart + Today's Classes ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8">
          <AttendanceChart data={attendance.data} isLoading={attendance.isLoading} />
        </div>
        <div className="lg:col-span-4">
          <TodayClasses data={todayClasses.data} isLoading={todayClasses.isLoading} />
        </div>
      </div>

      {/* ── Membership Growth + Calendar + Announcements + Top Trainers ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-4">
          <MembershipGrowthChart data={membership.data} isLoading={membership.isLoading} />
        </div>
        <div className="lg:col-span-4">
          <CalendarWidget data={calendar.data} isLoading={calendar.isLoading} />
        </div>
        <div className="lg:col-span-4">
          <TopTrainers data={trainers.data} isLoading={trainers.isLoading} />
        </div>
      </div>

      {/* ── Announcements (full width) ── */}
      <Announcements data={announcements.data} isLoading={announcements.isLoading} />

      {/* ── Recent Members + Recent Payments ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentMembers data={recentMembers.data} isLoading={recentMembers.isLoading} />
        <RecentPayments data={recentPayments.data} isLoading={recentPayments.isLoading} />
      </div>

      {/* ── Activity Feed (full width) ── */}
      <ActivityFeed data={activity.data} isLoading={activity.isLoading} />
    </div>
  )
}
