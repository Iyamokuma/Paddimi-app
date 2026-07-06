import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { AffidavitRequestPage } from './pages/AffidavitRequestPage'
import { NewspaperRequestPage } from './pages/NewspaperRequestPage'
import { TrackRequestPage } from './pages/TrackRequestPage'
import { AdminGuard } from './admin/AdminGuard'
import { AdminLayout } from './admin/AdminLayout'
import { AdminLoginPage } from './admin/pages/AdminLoginPage'
import { AdminDashboardPage } from './admin/pages/AdminDashboardPage'
import { AdminRequestsPage } from './admin/pages/AdminRequestsPage'
import { AdminRequestDetailPage } from './admin/pages/AdminRequestDetailPage'
import { AdminNotificationsPage } from './admin/pages/AdminNotificationsPage'
import { AdminStaffPage } from './admin/pages/AdminStaffPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public site */}
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="affidavit" element={<AffidavitRequestPage />} />
          <Route path="newspaper" element={<NewspaperRequestPage />} />
          <Route path="track" element={<TrackRequestPage />} />
        </Route>

        {/* Admin backoffice */}
        <Route path="admin/login" element={<AdminLoginPage />} />
        <Route path="admin" element={<AdminGuard />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="requests" element={<AdminRequestsPage />} />
            <Route path="requests/:id" element={<AdminRequestDetailPage />} />
            <Route path="notifications" element={<AdminNotificationsPage />} />
            <Route path="staff" element={<AdminStaffPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
