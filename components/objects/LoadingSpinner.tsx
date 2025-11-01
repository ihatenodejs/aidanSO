import { Loader2 } from 'lucide-react'

const LoadingSpinner: React.FC = () => {
  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <Loader2 className="h-12 w-12 animate-spin text-white" />
    </div>
  )
}

export default LoadingSpinner
