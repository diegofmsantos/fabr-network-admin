import React from 'react'
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react'
import { useAdminStats } from '@/hooks/useAdminStats'

export const ActionableAlerts: React.FC = () => {
  const { data: stats } = useAdminStats()

  const priorityAlerts = stats?.alertas?.filter(alert => alert.prioridade === 'alta') || []
  
  if (priorityAlerts.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center">
          <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
          <div>
            <h3 className="text-lg font-medium text-green-900">
              Sistema em Ordem
            </h3>
            <p className="text-green-700">
              Não há alertas críticos no momento
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow border">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
          <h3 className="text-lg font-medium text-gray-900">
            Ações Urgentes ({priorityAlerts.length})
          </h3>
        </div>
      </div>
      
      <div className="divide-y divide-gray-200">
        {priorityAlerts.map((alert) => (
          <div key={alert.id} className="p-6 hover:bg-gray-50">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Clock className="w-5 h-5 text-orange-500 mt-0.5" />
              </div>
              <div className="ml-3 flex-1">
                <h4 className="text-sm font-medium text-gray-900">
                  {alert.titulo}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {alert.descricao}
                </p>
                <div className="mt-3">
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    Resolver agora →
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}