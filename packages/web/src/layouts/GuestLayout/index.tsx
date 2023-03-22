import { Outlet } from 'react-router-dom'

export function GuestLayout () {
  return (
    <div className="w-screen h-screen bg-gray-900 flex flex-col">
      <Outlet />
    </div>
  )
}
