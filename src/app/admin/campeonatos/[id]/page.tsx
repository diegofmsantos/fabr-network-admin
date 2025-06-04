"use client"

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useCampeonato } from '@/hooks/useCampeonatos'
import { useJogos, useClassificacao } from '@/hooks/useCampeonatos'
import { Loading } from '@/components/ui/Loading'
import { NoDataFound } from '@/components/ui/NoDataFound'
import {
  ArrowLeft,
  Save,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Calendar,
  Users,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'
import { CampeonatoForm } from '@/components/Admin/forms/CampeonatoForm'
import { useUpdateCampeonato } from '@/hooks/useUpdateCampeonato'
import { useDeleteCampeonato } from '@/hooks/useDeleteCampeonato'

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

  const updateMutation = useUpdateCampeonato()
  const deleteMutation = useDeleteCampeonato()

  const [formData, setFormData] = useState(campeonato)

  const handleSave = async () => {
    if (!formData) return

    try {
      await updateMutation.mutateAsync({ id: campeonatoId, data: formData })
      setIsEditing(false)
    } catch (error) {
      alert('Erro ao salvar alterações')
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
      alert('Erro ao excluir campeonato')
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
      alert('Erro ao alterar status')
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
    { id: 'grupos', name: 'Grupos', icon: Users, count: campeonato.grupos?.length },
    { id: 'jogos', name: 'Jogos', icon: Calendar, count: jogos.length },
    { id: 'classificacao', name: 'Classificação', icon: BarChart3 },
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

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/campeonatos"
                className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{campeonato.nome}</h1>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-sm text-gray-500">
                    {campeonato.temporada} • {campeonato.tipo}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(campeonato.status)}`}>
                    {getStatusText(campeonato.status)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Status Actions */}
              {campeonato.status === 'NAO_INICIADO' && (
                <button
                  onClick={() => handleStatusChange('EM_ANDAMENTO')}
                  className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Iniciar
                </button>
              )}

              {campeonato.status === 'EM_ANDAMENTO' && (
                <>
                  <button
                    onClick={() => handleStatusChange('FINALIZADO')}
                    className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Finalizar
                  </button>
                </>
              )}

              {/* Edit/Save Toggle */}
              {activeTab === 'configuracoes' && (
                <>
                  {isEditing ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={updateMutation.isPending}
                        className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {updateMutation.isPending ? 'Salvando...' : 'Salvar'}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Editar
                    </button>
                  )}
                </>
              )}

              {/* Delete Button */}
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium flex items-center`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.name}
                  {tab.count !== undefined && (
                    <span className="ml-2 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-900">
                      {tab.count}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'configuracoes' && (
          <div className="space-y-6">
            {isEditing ? (
              <CampeonatoForm
                campeonato={campeonato}
                isEditMode={true}
                onSubmit={handleSave}
                loading={updateMutation.isPending}
              />
            ) : (
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Informações do Campeonato
                  </h3>

                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Nome</dt>
                      <dd className="mt-1 text-sm text-gray-900">{campeonato.nome}</dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-gray-500">Temporada</dt>
                      <dd className="mt-1 text-sm text-gray-900">{campeonato.temporada}</dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-gray-500">Tipo</dt>
                      <dd className="mt-1 text-sm text-gray-900">{campeonato.tipo}</dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(campeonato.status)}`}>
                          {getStatusText(campeonato.status)}
                        </span>
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-gray-500">Data de Início</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(campeonato.dataInicio).toLocaleDateString('pt-BR')}
                      </dd>
                    </div>

                    {campeonato.dataFim && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Data de Fim</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {new Date(campeonato.dataFim).toLocaleDateString('pt-BR')}
                        </dd>
                      </div>
                    )}

                    {campeonato.descricao && (
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Descrição</dt>
                        <dd className="mt-1 text-sm text-gray-900">{campeonato.descricao}</dd>
                      </div>
                    )}
                  </dl>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Formato do Campeonato</h4>
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-3">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Tipo de Disputa</dt>
                        <dd className="mt-1 text-sm text-gray-900">{campeonato.formato?.tipoDisputa}</dd>
                      </div>

                      <div>
                        <dt className="text-sm font-medium text-gray-500">Número de Rodadas</dt>
                        <dd className="mt-1 text-sm text-gray-900">{campeonato.formato?.numeroRodadas}</dd>
                      </div>

                      <div>
                        <dt className="text-sm font-medium text-gray-500">Tem Grupos</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {campeonato.formato?.temGrupos ? 'Sim' : 'Não'}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'grupos' && (
          <div>
            <GruposManager campeonato={campeonato} />
          </div>
        )}

        {activeTab === 'jogos' && (
          <div>
            <JogosManager campeonatoId={campeonatoId} jogos={jogos} />
          </div>
        )}

        {activeTab === 'classificacao' && (
          <div>
            <ClassificacaoManager campeonato={campeonato} classificacao={classificacao} />
          </div>
        )}
      </div>
    </div>
  )
}

// Componente para gerenciar grupos (será implementado separadamente)
const GruposManager = ({ campeonato }: { campeonato: any }) => (
  <div className="bg-white shadow rounded-lg p-6">
    <h3 className="text-lg font-medium text-gray-900 mb-4">Gerenciar Grupos</h3>
    <p className="text-gray-500">Funcionalidade de grupos será implementada...</p>
  </div>
)

// Componente para gerenciar jogos (será implementado separadamente)
const JogosManager = ({ campeonatoId, jogos }: { campeonatoId: number, jogos: any[] }) => (
  <div className="bg-white shadow rounded-lg p-6">
    <h3 className="text-lg font-medium text-gray-900 mb-4">Gerenciar Jogos</h3>
    <p className="text-gray-500">Total de jogos: {jogos.length}</p>
  </div>
)

// Componente para gerenciar classificação (será implementado separadamente)
const ClassificacaoManager = ({ campeonato, classificacao }: { campeonato: any, classificacao: any[] }) => (
  <div className="bg-white shadow rounded-lg p-6">
    <h3 className="text-lg font-medium text-gray-900 mb-4">Classificação</h3>
    <p className="text-gray-500">Classificação será exibida aqui...</p>
  </div>
)