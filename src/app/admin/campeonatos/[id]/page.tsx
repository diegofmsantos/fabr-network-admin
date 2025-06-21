"use client"

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useCampeonato, useClassificacao, useDeleteCampeonato, useJogos, useUpdateCampeonato } from '@/hooks/useCampeonatos'
import { Loading } from '@/components/ui/Loading'
import { NoDataFound } from '@/components/ui/NoDataFound'
import { ArrowLeft, Save, Trash2, Play, Pause, Settings, Calendar, Users, BarChart3, Trophy, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import { CampeonatoForm } from '@/components/Admin/forms/CampeonatoForm'
import { useTimes } from '@/hooks/useTimes'

type TabType = 'configuracoes' | 'grupos' | 'jogos' | 'classificacao'

export default function EditarCampeonato() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('configuracoes')
  const [isEditing, setIsEditing] = useState(false)

  const campeonatoId = parseInt(params.id as string)

  const { data: campeonato, isLoading, error } = useCampeonato(campeonatoId)
  const { data: jogos = [] } = useJogos({ campeonatoId })
  const { data: classificacao = [] } = useClassificacao(campeonatoId)
  const { data: times = [] } = useTimes(campeonato?.temporada || '2025')

  const updateMutation = useUpdateCampeonato()
  const deleteMutation = useDeleteCampeonato()

  const handleSave = async () => {
    if (!campeonato) return

    try {
      await updateMutation.mutateAsync({
        id: campeonatoId,
        data: campeonato
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Erro ao salvar:', error)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este campeonato? Esta ação não pode ser desfeita.')) {
      return
    }

    try {
      await deleteMutation.mutateAsync(campeonatoId)
      router.push('/admin/campeonatos')
    } catch (error) {
      console.error('Erro ao excluir:', error)
    }
  }

  const handleStatusChange = async (newStatus: 'NAO_INICIADO' | 'EM_ANDAMENTO' | 'FINALIZADO') => {
    if (!campeonato) return

    try {
      await updateMutation.mutateAsync({
        id: campeonatoId,
        data: { ...campeonato, status: newStatus }
      })
    } catch (error) {
      console.error('Erro ao alterar status:', error)
    }
  }

  if (isLoading) return <Loading />
  if (error || !campeonato) {
    return (
      <NoDataFound
        type="campeonato"
        entityName={params.id as string}
        onGoBack={() => router.back()}
        temporada="2025"
      />
    )
  }

  const tabs = [
    { id: 'configuracoes', name: 'Configurações', icon: Settings },
    { id: 'grupos', name: 'Grupos', icon: Users, count: campeonato.grupos?.length, href: `/admin/campeonatos/${campeonatoId}/grupos` },
    { id: 'jogos', name: 'Jogos', icon: Calendar, count: jogos.length, href: `/admin/campeonatos/${campeonatoId}/jogos` },
    { id: 'classificacao', name: 'Classificação', icon: BarChart3, href: `/admin/campeonatos/${campeonatoId}/classificacao` },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NAO_INICIADO': return 'bg-gray-100 text-gray-800'
      case 'EM_ANDAMENTO': return 'bg-green-100 text-green-800'
      case 'FINALIZADO': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'NAO_INICIADO': return 'Não Iniciado'
      case 'EM_ANDAMENTO': return 'Em Andamento'
      case 'FINALIZADO': return 'Finalizado'
      default: return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'NAO_INICIADO': return <Clock className="w-4 h-4" />
      case 'EM_ANDAMENTO': return <Play className="w-4 h-4" />
      case 'FINALIZADO': return <CheckCircle className="w-4 h-4" />
      default: return <Pause className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen">
      <div className="bg-[#272731] shadow-xl border-b border-gray-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/campeonatos"
                className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">{campeonato.nome}</h1>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-sm text-gray-400">
                    {campeonato.temporada} • {campeonato.tipo}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(campeonato.status)}`}>
                    {getStatusIcon(campeonato.status)}
                    <span className="ml-1">{getStatusText(campeonato.status)}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {campeonato.status === 'NAO_INICIADO' && (
                <button
                  onClick={() => handleStatusChange('EM_ANDAMENTO')}
                  className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 transition-colors"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Iniciar
                </button>
              )}

              {campeonato.status === 'EM_ANDAMENTO' && (
                <button
                  onClick={() => handleStatusChange('FINALIZADO')}
                  className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Finalizar
                </button>
              )}

              {activeTab === 'configuracoes' && (
                <>
                  {isEditing ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="inline-flex items-center rounded-md bg-[#1C1C24] px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-600 hover:bg-gray-700 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={updateMutation.isPending}
                        className="inline-flex items-center rounded-md bg-[#63E300] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-[#50B800] disabled:opacity-50 transition-colors"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {updateMutation.isPending ? 'Salvando...' : 'Salvar'}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center rounded-md bg-[#63E300] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-[#50B800] transition-colors"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Editar
                    </button>
                  )}
                </>
              )}

              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 disabled:opacity-50 transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#272731] shadow border-b border-gray-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id

              if (tab.href && tab.id !== 'configuracoes') {
                return (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    className="border-transparent text-gray-400 hover:text-white hover:border-gray-300 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium flex items-center transition-colors"
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {tab.name}
                    {tab.count !== undefined && (
                      <span className="ml-2 rounded-full bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-300">
                        {tab.count}
                      </span>
                    )}
                  </Link>
                )
              }

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`${isActive
                      ? 'border-[#63E300] text-[#63E300]'
                      : 'border-transparent text-gray-400 hover:text-white hover:border-gray-300'
                    } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium flex items-center transition-colors`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.name}
                  {tab.count !== undefined && (
                    <span className="ml-2 rounded-full bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-300">
                      {tab.count}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'configuracoes' && (
          <div className="space-y-6">
            <CampeonatoForm
              campeonato={campeonato}
              isEditMode={true}
              onSubmit={handleSave}
              loading={updateMutation.isPending}
              times={times}
            />

            <div className="bg-[#272731] shadow rounded-lg border border-gray-700">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-white mb-4">
                  Estatísticas do Campeonato
                </h3>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div className="bg-[#1C1C24] overflow-hidden shadow rounded-lg border border-gray-600">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Users className="h-8 w-8 text-[#63E300]" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-400 truncate">
                              Total de Times
                            </dt>
                            <dd className="text-lg font-medium text-white">
                              {campeonato.grupos?.reduce((acc, grupo) => acc + grupo.times.length, 0) || 0}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#1C1C24] overflow-hidden shadow rounded-lg border border-gray-600">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Calendar className="h-8 w-8 text-blue-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-400 truncate">
                              Total de Jogos
                            </dt>
                            <dd className="text-lg font-medium text-white">
                              {jogos.length}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#1C1C24] overflow-hidden shadow rounded-lg border border-gray-600">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Trophy className="h-8 w-8 text-yellow-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-400 truncate">
                              Grupos
                            </dt>
                            <dd className="text-lg font-medium text-white">
                              {campeonato.grupos?.length || 0}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-700">
                  <h4 className="text-md font-medium text-white mb-4">Histórico</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-[#1C1C24] rounded-lg">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Trophy className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-white">Campeonato criado</div>
                        <div className="text-sm text-gray-400">
                          {new Date(campeonato.createdAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-[#1C1C24] rounded-lg">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Settings className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-white">Última atualização</div>
                        <div className="text-sm text-gray-400">
                          {new Date(campeonato.updatedAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'configuracoes' && (
          <div className="bg-[#272731] shadow rounded-lg p-6 border border-gray-700">
            <div className="text-center">
              <p className="text-gray-400">
                Esta seção foi movida para uma página dedicada.
              </p>
              <div className="mt-4 space-x-3">
                {activeTab === 'grupos' && (
                  <Link
                    href={`/admin/campeonatos/${campeonatoId}/grupos`}
                    className="inline-flex items-center rounded-md bg-[#63E300] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-[#50B800] transition-colors"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Gerenciar Grupos
                  </Link>
                )}
                {activeTab === 'jogos' && (
                  <Link
                    href={`/admin/campeonatos/${campeonatoId}/jogos`}
                    className="inline-flex items-center rounded-md bg-[#63E300] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-[#50B800] transition-colors"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Gerenciar Jogos
                  </Link>
                )}
                {activeTab === 'classificacao' && (
                  <Link
                    href={`/admin/campeonatos/${campeonatoId}/classificacao`}
                    className="inline-flex items-center rounded-md bg-[#63E300] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-[#50B800] transition-colors"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Ver Classificação
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}