import { CircleNotch } from 'phosphor-react'

export function Loader() {
  return (
    <div className="fixed left-0 top-0 z-[60] flex size-full items-center justify-center bg-gray-900/60">
      <CircleNotch
        weight="bold"
        className="animate-spin text-cyan-800"
        size={ 40 }
      />
    </div>
  )
}
