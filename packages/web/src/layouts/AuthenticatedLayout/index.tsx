import { Outlet } from 'react-router-dom'

import { Navbar } from './components/Navbar'

export function AuthenticatedLayout() {
  return (
    <div className="flex min-h-screen w-screen flex-col bg-gray-900">
      <Navbar />
      <Outlet />
    </div>
  )
}
