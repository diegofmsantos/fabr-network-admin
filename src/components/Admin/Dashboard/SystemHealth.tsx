import React from 'react'
import { Activity, Database, Server, Wifi } from 'lucide-react'

export const SystemHealth: React.FC = () => {
  const healthMetrics = [
    { name: 'API Status', status: 'healthy', icon: Server, value: '99.9%' },
    { name: 'Database', status: 'healthy', icon: Database, value: '2ms' },
    { name: 'Connection', status: 'healthy', icon: Wifi, value: 'Stable' },
    { name: 'Performance', status: 'warning', icon: Activity, value: '78%' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'error': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow border p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Status do Sistema
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {healthMetrics.map((metric) => {
          const Icon = metric.icon
          return (
            <div key={metric.name} className="flex items-center">
              <div className={`p-2 rounded-lg ${getStatusColor(metric.status)}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">
                  {metric.name}
                </div>
                <div className="text-sm text-gray-600">
                  {metric.value}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}