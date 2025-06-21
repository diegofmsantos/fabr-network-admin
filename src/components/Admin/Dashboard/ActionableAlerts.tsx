import React from 'react'
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react'
import { useAdminStats } from '@/hooks/useAdminStats'

export const ActionableAlerts: React.FC = () => {
  const { data: stats } = useAdminStats()

  const priorityAlerts = stats?.alertas?.filter(alert => alert.prioridade === 'alta') || []

  if (priorityAlerts.length === 0) {
    return (
      <div className="bg-[#1C1C24] border border-[#63E300] rounded-lg p-6">
        <div className="flex items-center">
          <CheckCircle className="w-6 h-6 text-[#63E300] mr-3" />
          <div>
            <h3 className="text-lg font-medium text-white">
              Sistema em Ordem
            </h3>
            <p className="text-gray-400">
              Não há alertas críticos no momento
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#272731] rounded-lg shadow border border-gray-700">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center">
          <AlertTriangle className="w-6 h-6 text-red-400 mr-3" />
          <h3 className="text-lg font-medium text-white">
            Ações Urgentes ({priorityAlerts.length})
          </h3>
        </div>
      </div>

      <div className="divide-y divide-gray-700">
        {priorityAlerts.map((alert) => (
          <div key={alert.id} className="p-6 hover:bg-[#1C1C24] transition-colors">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Clock className="w-5 h-5 text-orange-400 mt-0.5" />
              </div>
              <div className="ml-3 flex-1">
                <h4 className="text-sm font-medium text-white">
                  {alert.titulo}
                </h4>
                <p className="text-sm text-gray-400 mt-1">
                  {alert.descricao}
                </p>
                <div className="mt-3">
                  <button className="text-sm font-medium text-[#63E300] hover:text-[#50B800] transition-colors">
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