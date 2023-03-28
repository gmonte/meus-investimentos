import { Outlet } from 'react-router-dom'

import { Navbar } from './components/Navbar'

export function AuthenticatedLayout() {
  return (
    <div className="w-screen min-h-screen bg-gray-900 flex flex-col">
      <Navbar />
      <Outlet />
    </div>
  )
}
