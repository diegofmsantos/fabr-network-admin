// src/components/Admin/GrupoManager.tsx
"use client"

import { useState } from 'react'
import { Campeonato, Grupo } from '@/types/campeonato'
import { Time } from '@/types/time'
import { Users, Plus, Minus, Edit2, Save, X, Shuffle } from 'lucide-react'
import Image from 'next/image'
import { ImageService } from '@/utils/services/ImageService'

interface GrupoManagerProps {
  grupo: Grupo
  campeonato: Campeonato
  timesDisponiveis: Time[]
  isReorganizing: boolean
  isSelected: boolean
  onSelect: () => void
}

export const GrupoManager: React.FC<GrupoManagerProps> = ({
  grupo,
  campeonato,
  timesDisponiveis,
  isReorganizing,
  isSelected,
  onSelect
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [nomeGrupo, setNomeGrupo] = useState(grupo.nome)
  const [timesSelecionados, setTimesSelecionados] = useState<number[]>([])

  const handleSalvarNome = () => {
    // Aqui você faria a chamada para a API para salvar o nome
    console.log('Salvar nome do grupo:', nomeGrupo)
    setIsEditing(false)
  }

  const handleAdicionarTime = (timeId: number) => {
    // Aqui você faria a chamada para a API para adicionar o time ao grupo
    console.log('Adicionar time ao grupo:', { grupoId: grupo.id, timeId })
  }

  const handleRemoverTime = (timeId: number) => {
    // Aqui você faria a chamada para a API para remover o time do grupo
    console.log('Remover time do grupo:', { grupoId: grupo.id, timeId })
  }

  const handleSelecionarTime = (timeId: number) => {
    setTimesSelecionados(prev => 
      prev.includes(timeId) 
        ? prev.filter(id => id !== timeId)
        : [...prev, timeId]
    )
  }

  const handleMoverTimesSelecionados = () => {
    // Implementar lógica para mover times selecionados
    console.log('Mover times selecionados:', timesSelecionados)
    setTimesSelecionados([])
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
      className={`bg-white rounded-lg border-2 transition-all duration-200 ${
        isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={isReorganizing ? onSelect : undefined}
    >
      {/* Header do Grupo */}
      <div className="p-4 border-b border-gray-100">
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
                  className="text-lg font-semibold border-gray-300 rounded px-2 py-1"
                  autoFocus
                />
                <button
                  onClick={handleSalvarNome}
                  className="p-1 text-green-600 hover:bg-green-50 rounded"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setNomeGrupo(grupo.nome)
                  }}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900">{grupo.nome}</h3>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
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
                <label className="text-sm text-gray-600">Selecionar</label>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lista de Times */}
      <div className="p-4">
        <div className="space-y-3">
          {grupo.times.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
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
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
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
                      <div className="font-medium text-gray-900">{time.nome}</div>
                      <div className="text-sm text-gray-500">{time.sigla}</div>
                    </div>
                  </div>

                  {!isReorganizing && (
                    <button
                      onClick={() => handleRemoverTime(grupoTime.timeId)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
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
        <div className="mt-4 pt-4 border-t border-gray-100">
          {isReorganizing ? (
            <div className="space-y-2">
              {timesSelecionados.length > 0 && (
                <div className="flex items-center justify-between bg-blue-50 p-2 rounded">
                  <span className="text-sm text-blue-800">
                    {timesSelecionados.length} time(s) selecionado(s)
                  </span>
                  <button
                    onClick={handleMoverTimesSelecionados}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Mover para outro grupo
                  </button>
                </div>
              )}
              
              <div className="flex gap-2">
                <button className="flex-1 text-sm px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                  Esvaziar Grupo
                </button>
                <button className="flex-1 text-sm px-3 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200">
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
                    className="w-full text-sm border-gray-300 rounded-md"
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
                <div className="bg-gray-50 rounded p-2">
                  <div className="text-lg font-semibold text-gray-900">{grupo.times.length}</div>
                  <div className="text-xs text-gray-500">Times</div>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <div className="text-lg font-semibold text-gray-900">
                    {grupo.classificacoes?.length || 0}
                  </div>
                  <div className="text-xs text-gray-500">Jogos</div>
                </div>
              </div>

              {/* Ações Rápidas */}
              <div className="flex gap-2">
                <button className="flex-1 text-sm px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                  Ver Classificação
                </button>
                <button className="flex-1 text-sm px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors">
                  Ver Jogos
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer com Informações Adicionais */}
      {grupo.times.length > 0 && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 rounded-b-lg">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </span>
            <span>
              Capacidade: {grupo.times.length}/8
            </span>
          </div>
        </div>
      )}
    </div>
  )
}