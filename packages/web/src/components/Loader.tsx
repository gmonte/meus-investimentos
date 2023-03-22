import { CircleNotch } from 'phosphor-react'

export function Loader() {
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-60 flex items-center justify-center z-[60]">
      <CircleNotch
        weight="bold"
        className="animate-spin text-cyan-800"
        size={ 40 }
      />
    </div>
  )
}
