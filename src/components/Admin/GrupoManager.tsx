"use client"

import { useState } from 'react'
import { Users, Plus, Minus, Edit2, Save, X, Shuffle } from 'lucide-react'
import Image from 'next/image'
import { ImageService } from '@/utils/services/ImageService'
import { Campeonato, Grupo, Time } from '@/types'
import { 
  useUpdateGrupoNome,
  useAdicionarTimeAoGrupo,
  useRemoverTimeDoGrupo,
  useMoverTimesEntreGrupos,
  useEsvaziarGrupo,
  useMisturarTimesGrupo
} from '@/hooks/useGrupos'

interface GrupoManagerProps {
  grupo: Grupo
  campeonato: Campeonato
  timesDisponiveis: Time[]
  isReorganizing: boolean
  isSelected: boolean
  onSelect: () => void
  onMoverTimes?: (timesIds: number[], grupoDestinoId: number) => void
}

export const GrupoManager: React.FC<GrupoManagerProps> = ({
  grupo,
  campeonato,
  timesDisponiveis,
  isReorganizing,
  isSelected,
  onSelect,
  onMoverTimes
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [nomeGrupo, setNomeGrupo] = useState(grupo.nome)
  const [timesSelecionados, setTimesSelecionados] = useState<number[]>([])

  // Hooks para operações de grupo
  const updateGrupoNomeMutation = useUpdateGrupoNome()
  const adicionarTimeMutation = useAdicionarTimeAoGrupo()
  const removerTimeMutation = useRemoverTimeDoGrupo()
  const moverTimesMutation = useMoverTimesEntreGrupos()
  const esvaziarGrupoMutation = useEsvaziarGrupo()
  const misturarTimesMutation = useMisturarTimesGrupo()

  const isLoading = 
    updateGrupoNomeMutation.isPending ||
    adicionarTimeMutation.isPending ||
    removerTimeMutation.isPending ||
    moverTimesMutation.isPending ||
    esvaziarGrupoMutation.isPending ||
    misturarTimesMutation.isPending

  const handleSalvarNome = () => {
    if (nomeGrupo.trim() === grupo.nome) {
      setIsEditing(false)
      return
    }

    updateGrupoNomeMutation.mutate({
      id: grupo.id,
      nome: nomeGrupo.trim()
    }, {
      onSuccess: () => {
        setIsEditing(false)
      },
      onError: () => {
        setNomeGrupo(grupo.nome) // Reverter em caso de erro
      }
    })
  }

  const handleAdicionarTime = (timeId: number) => {
    adicionarTimeMutation.mutate({
      grupoId: grupo.id,
      timeId
    })
  }

  const handleRemoverTime = (timeId: number) => {
    if (confirm('Tem certeza que deseja remover este time do grupo?')) {
      removerTimeMutation.mutate({
        grupoId: grupo.id,
        timeId
      })
    }
  }

  const handleSelecionarTime = (timeId: number) => {
    setTimesSelecionados(prev => 
      prev.includes(timeId) 
        ? prev.filter(id => id !== timeId)
        : [...prev, timeId]
    )
  }

  const handleMoverTimesSelecionados = () => {
    if (timesSelecionados.length === 0) return
    
    if (onMoverTimes) {
      onMoverTimes(timesSelecionados, grupo.id)
    }
    setTimesSelecionados([])
  }

  const handleEsvaziarGrupo = () => {
    if (grupo.times.length === 0) return
    
    if (confirm(`Tem certeza que deseja remover todos os ${grupo.times.length} times deste grupo?`)) {
      esvaziarGrupoMutation.mutate(grupo.id)
    }
  }

  const handleMisturarTimes = () => {
    if (grupo.times.length < 2) return
    
    if (confirm('Tem certeza que deseja misturar a ordem dos times neste grupo?')) {
      misturarTimesMutation.mutate(grupo.id)
    }
  }

  const getTimeInfo = (timeId: number) => {
    // Buscar nas listas de times do campeonato
    const allTimes = campeonato.grupos.flatMap(g => 
      g.times.map(gt => ({ ...gt, grupoId: g.id }))
    )
    const grupoTime = allTimes.find(gt => gt.timeId === timeId)
    return grupoTime?.time
  }

  return (
    <div 
      className={`bg-[#272731] rounded-lg border-2 transition-all duration-200 ${
        isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-700 hover:border-[#63E300]'
      } ${isLoading ? 'opacity-75' : ''}`}
      onClick={isReorganizing ? onSelect : undefined}
    >
      {/* Header do Grupo */}
      <div className="p-4 border-b border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={nomeGrupo}
                  onChange={(e) => setNomeGrupo(e.target.value)}
                  className="text-lg font-semibold border border-gray-300 rounded px-2 py-1 bg-white text-black"
                  autoFocus
                  disabled={isLoading}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleSalvarNome()
                    if (e.key === 'Escape') {
                      setIsEditing(false)
                      setNomeGrupo(grupo.nome)
                    }
                  }}
                />
                <button
                  onClick={handleSalvarNome}
                  disabled={isLoading}
                  className="p-1 text-green-600 hover:bg-green-50 rounded disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setNomeGrupo(grupo.nome)
                  }}
                  disabled={isLoading}
                  className="p-1 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-white">{grupo.nome}</h3>
                <button
                  onClick={() => setIsEditing(true)}
                  disabled={isLoading || isReorganizing}
                  className="p-1 text-gray-400 hover:text-gray-200 hover:bg-gray-600 rounded disabled:opacity-50"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300">
              {grupo.times.length} times
            </span>
            
            {isReorganizing && (
              <div className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={onSelect}
                  className="rounded border-gray-300"
                />
                <label className="text-sm text-gray-300">Selecionar</label>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lista de Times */}
      <div className="p-4">
        <div className="space-y-3">
          {grupo.times.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Users className="w-8 h-8 mx-auto mb-2 text-gray-500" />
              <p className="text-sm">Nenhum time neste grupo</p>
            </div>
          ) : (
            grupo.times.map((grupoTime) => {
              const time = getTimeInfo(grupoTime.timeId)
              if (!time) return null

              return (
                <div 
                  key={grupoTime.timeId}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    isReorganizing && timesSelecionados.includes(grupoTime.timeId)
                      ? 'border-blue-400 bg-blue-50 bg-opacity-10'
                      : 'border-gray-600 hover:border-[#63E300]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isReorganizing && (
                      <input
                        type="checkbox"
                        checked={timesSelecionados.includes(grupoTime.timeId)}
                        onChange={() => handleSelecionarTime(grupoTime.timeId)}
                        className="rounded border-gray-300"
                      />
                    )}
                    
                    <Image
                      src={ImageService.getTeamLogo(time.nome || '')}
                      alt={`Logo ${time.nome}`}
                      width={32}
                      height={32}
                      className="rounded"
                      onError={(e) => ImageService.handleTeamLogoError(e, time.nome || '')}
                    />
                    
                    <div>
                      <div className="font-medium text-white">{time.nome}</div>
                      <div className="text-sm text-gray-400">{time.sigla}</div>
                    </div>
                  </div>

                  {!isReorganizing && (
                    <button
                      onClick={() => handleRemoverTime(grupoTime.timeId)}
                      disabled={isLoading}
                      className="p-1 text-red-400 hover:bg-red-900 hover:bg-opacity-20 rounded transition-colors disabled:opacity-50"
                      title="Remover time do grupo"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Ações do Grupo */}
        <div className="mt-4 pt-4 border-t border-gray-600">
          {isReorganizing ? (
            <div className="space-y-2">
              {timesSelecionados.length > 0 && (
                <div className="flex items-center justify-between bg-blue-900 bg-opacity-20 p-2 rounded">
                  <span className="text-sm text-blue-300">
                    {timesSelecionados.length} time(s) selecionado(s)
                  </span>
                  <button
                    onClick={handleMoverTimesSelecionados}
                    disabled={isLoading}
                    className="text-sm text-blue-400 hover:text-blue-300 disabled:opacity-50"
                  >
                    Mover para outro grupo
                  </button>
                </div>
              )}
              
              <div className="flex gap-2">
                <button 
                  onClick={handleEsvaziarGrupo}
                  disabled={isLoading || grupo.times.length === 0}
                  className="flex-1 text-sm px-3 py-2 bg-gray-600 text-gray-300 rounded hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Esvaziar Grupo
                </button>
                <button 
                  onClick={handleMisturarTimes}
                  disabled={isLoading || grupo.times.length < 2}
                  className="flex-1 text-sm px-3 py-2 bg-purple-600 text-purple-200 rounded hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Shuffle className="w-4 h-4 inline mr-1" />
                  Misturar
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Adicionar Time */}
              {timesDisponiveis.length > 0 && (
                <div>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAdicionarTime(parseInt(e.target.value))
                        e.target.value = ''
                      }
                    }}
                    disabled={isLoading}
                    className="w-full text-sm border-gray-600 rounded-md bg-[#1C1C24] text-white disabled:opacity-50"
                  >
                    <option value="">Adicionar time ao grupo...</option>
                    {timesDisponiveis.map((time) => (
                      <option key={time.id} value={time.id}>
                        {time.nome} ({time.sigla})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Estatísticas do Grupo */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-gray-600 rounded p-2">
                  <div className="text-lg font-semibold text-white">{grupo.times.length}</div>
                  <div className="text-xs text-gray-300">Times</div>
                </div>
                <div className="bg-gray-600 rounded p-2">
                  <div className="text-lg font-semibold text-white">
                    {grupo.jogos?.length || 0}
                  </div>
                  <div className="text-xs text-gray-300">Jogos</div>
                </div>
              </div>

              {/* Ações Rápidas */}
              <div className="flex gap-2">
                <button 
                  className="flex-1 text-sm px-3 py-2 bg-blue-600 text-blue-200 rounded hover:bg-blue-500 transition-colors"
                  onClick={() => {
                    // Navegar para classificação do grupo
                    window.open(`/admin/campeonatos/${campeonato.id}/grupos/${grupo.id}/classificacao`, '_blank')
                  }}
                >
                  Ver Classificação
                </button>
                <button 
                  className="flex-1 text-sm px-3 py-2 bg-green-600 text-green-200 rounded hover:bg-green-500 transition-colors"
                  onClick={() => {
                    // Navegar para jogos do grupo
                    window.open(`/admin/campeonatos/${campeonato.id}/grupos/${grupo.id}/jogos`, '_blank')
                  }}
                >
                  Ver Jogos
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer com Informações Adicionais */}
      {grupo.times.length > 0 && (
        <div className="px-4 py-3 bg-gray-800 border-t border-gray-600 rounded-b-lg">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </span>
            <span>
              Capacidade: {grupo.times.length}/8
            </span>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-center justify-center">
          <div className="bg-white rounded-lg p-3 flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
            <span className="text-sm text-gray-700">Processando...</span>
          </div>
        </div>
      )}
    </div>
  )
}