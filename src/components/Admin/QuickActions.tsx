import React from 'react'
import Link from 'next/link'
import { Plus, Calendar, Users, BarChart3, Settings, Download, Upload, RefreshCw } from 'lucide-react'

interface QuickAction {
  id: string
  label: string
  href?: string
  icon: React.ComponentType<any>
  color: string
  description: string
  onClick?: () => void
}

export const QuickActions: React.FC = () => {
  const actions: QuickAction[] = [
    {
      id: 'novo-campeonato',
      label: 'Novo Campeonato',
      href: '/admin/campeonatos/criar',
      icon: Plus,
      color: 'bg-blue-500 hover:bg-blue-600',
      description: 'Criar um novo campeonato'
    },
    {
      id: 'agendar-jogos',
      label: 'Agendar Jogos',
      href: '/admin/jogos/agendar',
      icon: Calendar,
      color: 'bg-green-500 hover:bg-green-600',
      description: 'Agendar novos jogos'
    },
    {
      id: 'gerenciar-times',
      label: 'Gerenciar Times',
      href: '/admin/times',
      icon: Users,
      color: 'bg-purple-500 hover:bg-purple-600',
      description: 'Adicionar ou editar times'
    },
    {
      id: 'relatorios',
      label: 'Relatórios',
      href: '/admin/relatorios',
      icon: BarChart3,
      color: 'bg-yellow-500 hover:bg-yellow-600',
      description: 'Gerar relatórios'
    },
    {
      id: 'importar-dados',
      label: 'Importar Dados',
      icon: Upload,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      description: 'Importar dados de planilhas',
      onClick: () => {
        // Implementar lógica de importação
        console.log('Abrir modal de importação')
      }
    },
    {
      id: 'exportar-dados',
      label: 'Exportar Dados',
      icon: Download,
      color: 'bg-orange-500 hover:bg-orange-600',
      description: 'Exportar dados do sistema',
      onClick: () => {
        // Implementar lógica de exportação
        console.log('Iniciar exportação')
      }
    },
    {
      id: 'sincronizar',
      label: 'Sincronizar',
      icon: RefreshCw,
      color: 'bg-teal-500 hover:bg-teal-600',
      description: 'Sincronizar dados externos',
      onClick: () => {
        // Implementar lógica de sincronização
        console.log('Iniciar sincronização')
      }
    },
    {
      id: 'configuracoes',
      label: 'Configurações',
      href: '/admin/configuracoes',
      icon: Settings,
      color: 'bg-gray-500 hover:bg-gray-600',
      description: 'Configurações do sistema'
    }
  ]

  const handleActionClick = (action: QuickAction) => {
    if (action.onClick) {
      action.onClick()
    }
  }

  return (
    <div className="bg-[#272731] shadow rounded-lg border border-gray-700">
      <div className="p-6">
        <h3 className="text-lg font-medium text-[#63E300] mb-4">Ações Rápidas</h3>

        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 hover:text-[#63E300]">
          {actions.map((action) => {
            const Icon = action.icon

            const ActionContent = (
              <>
                <div className={`inline-flex p-3 rounded-lg text-white ${action.color} transition-colors duration-200`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-200">
                    {action.label}
                  </p>
                  <p className="text-xs text-gray-300 mt-1">
                    {action.description}
                  </p>
                </div>
              </>
            )

            if (action.href) {
              return (
                <Link
                  key={action.id}
                  href={action.href}
                  className="flex items-center p-3 border border-gray-700 rounded-lg hover:border-[#63E300] hover:shadow-sm transition-all duration-200"
                >
                  {ActionContent}
                </Link>
              )
            }

            return (
              <button
                key={action.id}
                onClick={() => handleActionClick(action)}
                className="flex items-center p-3 border border-gray-700 rounded-lg hover:border-[#63E300] hover:shadow-sm transition-all duration-200 text-left w-full"
              >
                {ActionContent}
              </button>
            )
          })}
        </div>
      </div>

      <div className=" px-6 py-3 border-t border-[#63E300]">
        <div className="text-xs text-gray-300 text-center">
          Precisa de ajuda? <a href="#" className="text-[#63E300] hover:text-blue-800">Consulte a documentação</a>
        </div>
      </div>
    </div>
  )
}