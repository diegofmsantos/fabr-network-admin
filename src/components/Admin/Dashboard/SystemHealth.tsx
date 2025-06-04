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
      case 'healthy': return 'text-[#63E300] bg-[#1C1C24]'
      case 'warning': return 'text-yellow-400 bg-[#1C1C24]'
      case 'error': return 'text-red-400 bg-[#1C1C24]'
      default: return 'text-gray-400 bg-[#1C1C24]'
    }
  }

  return (
    <div className="bg-[#272731] rounded-lg shadow border border-gray-700 p-6">
      <h3 className="text-lg font-medium text-white mb-4">
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
                <div className="text-sm font-medium text-white">
                  {metric.name}
                </div>
                <div className="text-sm text-gray-400">
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