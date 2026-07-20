import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary'
import { LoadingState } from '@/components/feedback/LoadingState'

/**
 * Lazy-loaded feature pages.
 * Each feature becomes its own JS chunk — only loaded when the user navigates to it.
 * Initial bundle drops from ~1MB to ~200KB.
 */
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage').then(m => ({ default: m.DashboardPage })))
const MembersPage = lazy(() => import('@/features/members/pages/MembersPage').then(m => ({ default: m.MembersPage })))
const LeadsPage = lazy(() => import('@/features/leads/pages/LeadsPage').then(m => ({ default: m.LeadsPage })))
const TrainersPage = lazy(() => import('@/features/trainers/pages/TrainersPage').then(m => ({ default: m.TrainersPage })))
const ClassesPage = lazy(() => import('@/features/classes/pages/ClassesPage').then(m => ({ default: m.ClassesPage })))
const PaymentsPage = lazy(() => import('@/features/payments/pages/PaymentsPage').then(m => ({ default: m.PaymentsPage })))
const AttendancePage = lazy(() => import('@/features/attendance/pages/AttendancePage').then(m => ({ default: m.AttendancePage })))
const ReportsPage = lazy(() => import('@/features/reports/pages/ReportsPage').then(m => ({ default: m.ReportsPage })))
const SettingsPage = lazy(() => import('@/features/settings/pages/SettingsPage').then(m => ({ default: m.SettingsPage })))

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-32">
      <LoadingState text="Loading page…" />
    </div>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorBoundary level="route"><div className="p-8"><LoadingState /></div></ErrorBoundary>,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      {
        path: 'dashboard',
        element: <Suspense fallback={<PageLoader />}><ErrorBoundary level="route"><DashboardPage /></ErrorBoundary></Suspense>,
      },
      {
        path: 'members/*',
        element: <Suspense fallback={<PageLoader />}><ErrorBoundary level="route"><MembersPage /></ErrorBoundary></Suspense>,
      },
      {
        path: 'leads/*',
        element: <Suspense fallback={<PageLoader />}><ErrorBoundary level="route"><LeadsPage /></ErrorBoundary></Suspense>,
      },
      {
        path: 'trainers/*',
        element: <Suspense fallback={<PageLoader />}><ErrorBoundary level="route"><TrainersPage /></ErrorBoundary></Suspense>,
      },
      {
        path: 'classes/*',
        element: <Suspense fallback={<PageLoader />}><ErrorBoundary level="route"><ClassesPage /></ErrorBoundary></Suspense>,
      },
      {
        path: 'payments/*',
        element: <Suspense fallback={<PageLoader />}><ErrorBoundary level="route"><PaymentsPage /></ErrorBoundary></Suspense>,
      },
      {
        path: 'attendance/*',
        element: <Suspense fallback={<PageLoader />}><ErrorBoundary level="route"><AttendancePage /></ErrorBoundary></Suspense>,
      },
      {
        path: 'reports/*',
        element: <Suspense fallback={<PageLoader />}><ErrorBoundary level="route"><ReportsPage /></ErrorBoundary></Suspense>,
      },
      {
        path: 'settings/*',
        element: <Suspense fallback={<PageLoader />}><ErrorBoundary level="route"><SettingsPage /></ErrorBoundary></Suspense>,
      },
      {
        path: '*',
        element: <Navigate to="/dashboard" replace />,
      },
    ],
  },
])
