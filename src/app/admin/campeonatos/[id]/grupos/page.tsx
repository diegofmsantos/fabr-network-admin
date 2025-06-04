"use client"

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useCampeonato } from '@/hooks/useCampeonatos'
import { useTimes } from '@/hooks/queries'
import { Loading } from '@/components/ui/Loading'
import { NoDataFound } from '@/components/ui/NoDataFound'
import { 
  ArrowLeft, 
  Plus, 
  Users, 
  Shuffle, 
  Download,
  Settings,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { GrupoManager } from '@/components/Admin/GrupoManager'

export default function AdminGrupos() {
  const params = useParams()
  const router = useRouter()
  const [isReorganizing, setIsReorganizing] = useState(false)
  const [selectedGrupo, setSelectedGrupo] = useState<number | null>(null)
  
  const campeonatoId = parseInt(params.id as string)
  
  const { data: campeonato, isLoading, error } = useCampeonato(campeonatoId)
  const { data: todosOsTimes = [] } = useTimes(campeonato?.temporada || '2025')

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

  const timesDisponiveis = todosOsTimes.filter(time => 
    !campeonato.grupos.some(grupo => 
      grupo.times.some(gt => gt.timeId === time.id)
    )
  )

  const handleDistribuirAutomatica = () => {
    if (confirm('Isso irá redistribuir todos os times aleatoriamente entre os grupos. Continuar?')) {
      // Implementar distribuição automática
      console.log('Distribuir automaticamente')
    }
  }

  const handleExportarGrupos = () => {
    // Implementar exportação dos grupos
    console.log('Exportar grupos')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href={`/admin/campeonatos/${campeonatoId}`}
              className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gerenciar Grupos</h1>
              <p className="text-sm text-gray-500">
                {campeonato.nome} • {campeonato.grupos.length} grupos
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportarGrupos}
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </button>
            
            <button
              onClick={handleDistribuirAutomatica}
              className="inline-flex items-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500"
            >
              <Shuffle className="h-4 w-4 mr-2" />
              Distribuir Auto
            </button>
            
            <button
              onClick={() => setIsReorganizing(!isReorganizing)}
              className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ${
                isReorganizing 
                  ? 'bg-red-600 text-white hover:bg-red-500' 
                  : 'bg-blue-600 text-white hover:bg-blue-500'
              }`}
            >
              <Settings className="h-4 w-4 mr-2" />
              {isReorganizing ? 'Finalizar' : 'Reorganizar'}
            </button>
          </div>
        </div>
      </div>

      {/* Times Disponíveis */}
      {timesDisponiveis.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                Times Não Alocados ({timesDisponiveis.length})
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p className="mb-2">Os seguintes times ainda não foram alocados em grupos:</p>
                <div className="flex flex-wrap gap-2">
                  {timesDisponiveis.slice(0, 10).map(time => (
                    <span key={time.id} className="inline-flex items-center px-2 py-1 rounded-md bg-yellow-100 text-yellow-800 text-xs">
                      {time.sigla}
                    </span>
                  ))}
                  {timesDisponiveis.length > 10 && (
                    <span className="text-xs text-yellow-600">
                      +{timesDisponiveis.length - 10} mais...
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estatísticas dos Grupos */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total de Grupos
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {campeonato.grupos.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Times Alocados
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {campeonato.grupos.reduce((acc, grupo) => acc + grupo.times.length, 0)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Média por Grupo
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {campeonato.grupos.length > 0 
                      ? Math.round(campeonato.grupos.reduce((acc, grupo) => acc + grupo.times.length, 0) / campeonato.grupos.length)
                      : 0
                    }
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Não Alocados
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {timesDisponiveis.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grupos */}
      <div className="space-y-6">
        {campeonato.grupos.length === 0 ? (
          <div className="text-center py-12 bg-white shadow rounded-lg">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nenhum grupo criado
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Comece criando o primeiro grupo para este campeonato.
            </p>
            <div className="mt-6">
              <button
                onClick={() => {/* Implementar criação de grupo */}}
                className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Grupo
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {campeonato.grupos.map((grupo) => (
              <GrupoManager
                key={grupo.id}
                grupo={grupo}
                campeonato={campeonato}
                timesDisponiveis={timesDisponiveis}
                isReorganizing={isReorganizing}
                isSelected={selectedGrupo === grupo.id}
                onSelect={() => setSelectedGrupo(grupo.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Ações em Lote */}
      {isReorganizing && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Ações em Lote
          </h3>
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500">
              Balancear Grupos
            </button>
            <button className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
              Adicionar Grupo
            </button>
            <button className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500">
              Remover Grupo Vazio
            </button>
          </div>
        </div>
      )}
    </div>
  )
}