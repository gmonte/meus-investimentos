import { Outlet } from 'react-router-dom'

export function GuestLayout() {
  return (
    <div className="flex h-screen w-screen flex-col bg-gray-900">
      <Outlet />
    </div>
  )
}
