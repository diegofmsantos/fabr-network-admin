// src/components/Admin/RecentActivity.tsx
import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { 
  Trophy, 
  Calendar, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  ExternalLink 
} from 'lucide-react'

interface RecentActivityItem {
  id: string
  type: string
  message: string
  timestamp: string
  user?: string
  link?: string
}

interface RecentActivityProps {
  activities: RecentActivityItem[]
  maxItems?: number
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ 
  activities, 
  maxItems = 8 
}) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'championship_created':
      case 'campeonato_criado':
        return <Trophy className="w-4 h-4 text-blue-600" />
      case 'game_finished':
      case 'jogo_finalizado':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'classification_updated':
      case 'classificacao_atualizada':
        return <Users className="w-4 h-4 text-purple-600" />
      case 'game_scheduled':
      case 'jogo_agendado':
        return <Calendar className="w-4 h-4 text-orange-600" />
      case 'error':
      case 'erro':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getActivityBgColor = (type: string) => {
    switch (type) {
      case 'championship_created':
      case 'campeonato_criado':
        return 'bg-blue-50'
      case 'game_finished':
      case 'jogo_finalizado':
        return 'bg-green-50'
      case 'classification_updated':
      case 'classificacao_atualizada':
        return 'bg-purple-50'
      case 'game_scheduled':
      case 'jogo_agendado':
        return 'bg-orange-50'
      case 'error':
      case 'erro':
        return 'bg-red-50'
      default:
        return 'bg-gray-50'
    }
  }

  const sortedActivities = activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, maxItems)

  return (
    <div className="bg-[#272731]  shadow rounded-lg border border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-[#63E300]">Atividades Recentes</h3>
          <button className="text-sm text-[#63E300] hover:text-gray-200">
            Ver todas
          </button>
        </div>
        
        {sortedActivities.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="mx-auto h-8 w-8 text-gray-400 mb-3" />
            <p className="text-sm text-gray-500">Nenhuma atividade recente</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedActivities.map((activity) => (
              <div 
                key={activity.id} 
                className={`flex items-start space-x-3 p-3 rounded-lg ${getActivityBgColor(activity.type)} hover:shadow-sm transition-shadow duration-200`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-">
                    {activity.message}
                  </p>
                  
                  <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500">
                    <span>
                      {formatDistanceToNow(new Date(activity.timestamp), { 
                        addSuffix: true, 
                        locale: ptBR 
                      })}
                    </span>
                    
                    {activity.user && (
                      <>
                        <span>•</span>
                        <span>{activity.user}</span>
                      </>
                    )}
                  </div>
                </div>
                
                {activity.link && (
                  <div className="flex-shrink-0">
                    <a 
                      href={activity.link}
                      className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {activities.length > maxItems && (
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <div className="text-center">
            <button className="text-sm text-blue-600 hover:text-blue-800">
              Ver mais {activities.length - maxItems} atividades
            </button>
          </div>
        </div>
      )}
    </div>
  )
}