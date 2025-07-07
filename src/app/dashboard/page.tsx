import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import PipelineBoard from '@/components/vc/PipelineBoard'

export default async function DashboardPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Deal Pipeline</h1>
        <p className="text-gray-600">Manage your founder screening process</p>
      </div>
      
      <PipelineBoard />
    </div>
  )
}