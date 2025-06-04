// src/components/Admin/ActivityTimeline.tsx
import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { 
  Trophy, 
  Calendar, 
  Users, 
  BarChart3, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  User
} from 'lucide-react'

interface Activity {
  id: string
  tipo: 'campeonato_criado' | 'jogo_finalizado' | 'classificacao_atualizada' | 'time_adicionado' | 'grupo_criado'
  titulo: string
  descricao: string
  data: string
  usuario?: string
}

interface ActivityTimelineProps {
  activities: Activity[]
  maxItems?: number
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ 
  activities, 
  maxItems = 10 
}) => {
  const getActivityIcon = (tipo: string) => {
    switch (tipo) {
      case 'campeonato_criado':
        return <Trophy className="w-4 h-4" />
      case 'jogo_finalizado':
        return <CheckCircle className="w-4 h-4" />
      case 'classificacao_atualizada':
        return <BarChart3 className="w-4 h-4" />
      case 'time_adicionado':
        return <Users className="w-4 h-4" />
      case 'grupo_criado':
        return <Calendar className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const getActivityColor = (tipo: string) => {
    switch (tipo) {
      case 'campeonato_criado':
        return {
          bg: 'bg-blue-100',
          icon: 'text-blue-600',
          border: 'border-blue-200'
        }
      case 'jogo_finalizado':
        return {
          bg: 'bg-green-100',
          icon: 'text-green-600',
          border: 'border-green-200'
        }
      case 'classificacao_atualizada':
        return {
          bg: 'bg-purple-100',
          icon: 'text-purple-600',
          border: 'border-purple-200'
        }
      case 'time_adicionado':
        return {
          bg: 'bg-yellow-100',
          icon: 'text-yellow-600',
          border: 'border-yellow-200'
        }
      case 'grupo_criado':
        return {
          bg: 'bg-indigo-100',
          icon: 'text-indigo-600',
          border: 'border-indigo-200'
        }
      default:
        return {
          bg: 'bg-gray-100',
          icon: 'text-gray-600',
          border: 'border-gray-200'
        }
    }
  }

  const sortedActivities = activities
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, maxItems)

  if (sortedActivities.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="mx-auto h-8 w-8 text-gray-400 mb-3" />
        <p className="text-sm text-gray-500">Nenhuma atividade recente</p>
      </div>
    )
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {sortedActivities.map((activity, index) => {
          const colors = getActivityColor(activity.tipo)
          const isLast = index === sortedActivities.length - 1

          return (
            <li key={activity.id}>
              <div className="relative pb-8">
                {!isLast && (
                  <span 
                    className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" 
                    aria-hidden="true" 
                  />
                )}
                
                <div className="relative flex items-start space-x-3">
                  <div className="relative">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${colors.bg} ${colors.border} border-2`}>
                      <div className={colors.icon}>
                        {getActivityIcon(activity.tipo)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-900">
                          {activity.titulo}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        {activity.descricao}
                      </p>
                      <div className="mt-2 flex items-center space-x-2 text-xs text-gray-500">
                        <span>
                          {formatDistanceToNow(new Date(activity.data), { 
                            addSuffix: true, 
                            locale: ptBR 
                          })}
                        </span>
                        {activity.usuario && (
                          <>
                            <span>•</span>
                            <div className="flex items-center space-x-1">
                              <User className="w-3 h-3" />
                              <span>{activity.usuario}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
      
      {activities.length > maxItems && (
        <div className="mt-4 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-800">
            Ver mais atividades ({activities.length - maxItems} restantes)
          </button>
        </div>
      )}
    </div>
  )
}