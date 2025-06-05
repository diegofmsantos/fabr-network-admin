"use client"

import { useState, useEffect, useMemo } from 'react'
import { Time } from '@/types/time'
import { Campeonato, CriarCampeonatoRequest } from '@/types/campeonato'
import { Calendar, Users, Settings, Trophy, Plus, Minus, CheckCircle } from 'lucide-react'

interface CampeonatoFormProps {
  currentStep?: number
  formData?: CriarCampeonatoRequest
  onChange?: (data: CriarCampeonatoRequest) => void
  onNext?: () => void
  onPrevious?: () => void
  canProceed?: boolean
  isLastStep?: boolean
  campeonato?: Campeonato
  isEditMode?: boolean
  onSubmit?: () => void
  loading?: boolean
  times: Time[]
}

export const CampeonatoForm: React.FC<CampeonatoFormProps> = ({
  currentStep = 1,
  formData,
  onChange,
  times,
  onNext,
  onPrevious,
  canProceed = false,
  isLastStep = false,

  campeonato,
  isEditMode = false,
  onSubmit,
  loading = false
}) => {

  const dados = isEditMode && campeonato
    ? {
      nome: campeonato.nome,
      temporada: campeonato.temporada,
      tipo: campeonato.tipo,
      dataInicio: campeonato.dataInicio.split('T')[0], 
      dataFim: campeonato.dataFim?.split('T')[0],
      descricao: campeonato.descricao,
      formato: campeonato.formato,
      grupos: campeonato.grupos?.map(grupo => ({
        nome: grupo.nome,
        times: grupo.times.map(gt => gt.timeId)
      })) || []
    } as CriarCampeonatoRequest
    : formData || {} as CriarCampeonatoRequest

  const grupos = dados.grupos || []

const timesDisponiveis = useMemo(() => {
  const timesUsados = grupos.flatMap(grupo => grupo.times || [])
  return times.filter(time => !timesUsados.includes(time.id || 0))
}, [times, grupos])

  const handleInputChange = (field: string, value: any) => {
    if (isEditMode) {
      return
    }
    onChange?.({ ...dados, [field]: value })
  }

  const handleFormatoChange = (field: string, value: any) => {
    if (isEditMode) return

    onChange?.({
      ...dados,
      formato: { ...dados.formato, [field]: value }
    })
  }

  const adicionarGrupo = () => {
    if (isEditMode) return

    const novoGrupo = {
      nome: `Grupo ${String.fromCharCode(65 + grupos.length)}`,
      times: []
    }
    onChange?.({
      ...dados,
      grupos: [...grupos, novoGrupo]
    })
  }

  const removerGrupo = (index: number) => {
    if (isEditMode) return

    const novosGrupos = grupos.filter((_, i) => i !== index)
    onChange?.({ ...dados, grupos: novosGrupos })
  }

  const adicionarTimeAoGrupo = (grupoIndex: number, timeId: number) => {
    if (isEditMode) return

    const novosGrupos = [...grupos]
    if (!novosGrupos[grupoIndex].times) {
      novosGrupos[grupoIndex].times = []
    }
    novosGrupos[grupoIndex].times!.push(timeId)
    onChange?.({ ...dados, grupos: novosGrupos })
  }

  const removerTimeDoGrupo = (grupoIndex: number, timeId: number) => {
    if (isEditMode) return

    const novosGrupos = [...grupos]
    if (novosGrupos[grupoIndex].times) {
      novosGrupos[grupoIndex].times = novosGrupos[grupoIndex].times!.filter(id => id !== timeId)
    }
    onChange?.({ ...dados, grupos: novosGrupos })
  }

  if (isEditMode) {
    return (
      <div className="bg-[#272731] shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Informações do Campeonato</h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-white">Nome</label>
            <input
              type="text"
              value={dados.nome}
              disabled
              className="mt-1 p-2 block w-full bg-[#1C1C24] border-gray-700 rounded-md text-white opacity-60 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white">Status</label>
            <span className="mt-1 p-2 block w-full text-white">
              {campeonato?.status === 'NAO_INICIADO' && 'Não Iniciado'}
              {campeonato?.status === 'EM_ANDAMENTO' && 'Em Andamento'}
              {campeonato?.status === 'FINALIZADO' && 'Finalizado'}
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-white">Temporada</label>
            <input
              type="text"
              value={dados.temporada}
              disabled
              className="mt-1 p-2 block w-full bg-[#1C1C24] border-gray-700 rounded-md text-white opacity-60 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white">Tipo</label>
            <input
              type="text"
              value={dados.tipo}
              disabled
              className="mt-1 p-2 block w-full bg-[#1C1C24] border-gray-700 rounded-md text-white opacity-60 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={onSubmit}
            disabled={loading}
            className="bg-[#63E300] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#50B800] transition-colors disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </div>
    )
  }

  const renderStep1 = () => (
    <div className="bg-[#272731] shadow rounded-lg p-6">
      <div className="flex items-center mb-6">
        <Calendar className="h-6 w-6 text-[#63E300] mr-2" />
        <h2 className="text-xl font-semibold text-white">Informações Básicas</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-white">Nome do Campeonato</label>
          <input
            type="text"
            value={dados.nome || ''}
            onChange={(e) => handleInputChange('nome', e.target.value)}
            className="mt-1 p-2 block w-full bg-[#1C1C24] border-gray-700 rounded-md shadow-sm focus:ring-[#63E300] focus:border-[#63E300] text-white"
            placeholder="Ex: Brasileirão 2025"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white">Temporada</label>
          <select
            value={dados.temporada || '2025'}
            onChange={(e) => handleInputChange('temporada', e.target.value)}
            className="mt-1 p-1 block w-full bg-[#1C1C24] border-gray-700 rounded-md shadow-sm focus:ring-[#63E300] focus:border-[#63E300] text-white"
          >
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white">Tipo</label>
          <select
            value={dados.tipo}
            onChange={(e) => handleInputChange('tipo', e.target.value)}
            className="mt-1 p-1 block w-full bg-[#1C1C24] border-gray-700 rounded-md shadow-sm focus:ring-[#63E300] focus:border-[#63E300] text-white"
          >
            <option value="REGULAR">Temporada Regular</option>
            <option value="PLAYOFFS">Playoffs</option>
            <option value="COPA">Copa</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white">Data de Início</label>
          <input
            type="date"
            value={dados.dataInicio}
            onChange={(e) => handleInputChange('dataInicio', e.target.value)}
            className="mt-1 p-1 block w-full bg-[#1C1C24] border-gray-700 rounded-md shadow-sm focus:ring-[#63E300] focus:border-[#63E300] text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white">Data de Fim (opcional)</label>
          <input
            type="date"
            value={dados.dataFim}
            onChange={(e) => handleInputChange('dataFim', e.target.value)}
            className="mt-1 p-1 block w-full bg-[#1C1C24] border-gray-700 rounded-md shadow-sm focus:ring-[#63E300] focus:border-[#63E300] text-white"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-white">Descrição (opcional)</label>
          <textarea
            value={dados.descricao}
            onChange={(e) => handleInputChange('descricao', e.target.value)}
            rows={3}
            className="mt-1 p-1 block w-full bg-[#1C1C24] border-gray-700 rounded-md shadow-sm focus:ring-[#63E300] focus:border-[#63E300] text-white"
            placeholder="Descrição do campeonato..."
          />
        </div>
      </div>
    </div>
  )
  const renderStep2 = () => (
    <div className="bg-[#272731] shadow rounded-lg p-6">
      <div className="flex items-center mb-6">
        <Settings className="h-6 w-6 text-[#63E300] mr-2" />
        <h2 className="text-xl font-semibold text-white">Formato do Campeonato</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-white">Tipo de Disputa</label>
          <select
            value={dados.formato?.tipoDisputa || 'PONTOS_CORRIDOS'}
            onChange={(e) => handleFormatoChange('tipoDisputa', e.target.value)}
            className="mt-1 p-2 block w-full bg-[#1C1C24] border-gray-700 rounded-md shadow-sm focus:ring-[#63E300] focus:border-[#63E300] text-white"
          >
            <option value="PONTOS_CORRIDOS">Pontos Corridos</option>
            <option value="MATA_MATA">Mata-mata</option>
            <option value="MISTO">Misto</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white">Número de Rodadas</label>
          <input
            type="number"
            value={dados.formato?.numeroRodadas || 10}
            onChange={(e) => handleFormatoChange('numeroRodadas', parseInt(e.target.value))}
            className="mt-1 p-2 block w-full bg-[#1C1C24] border-gray-700 rounded-md shadow-sm focus:ring-[#63E300] focus:border-[#63E300] text-white"
            min="1"
          />
        </div>

        <div className="sm:col-span-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={dados.formato?.temGrupos || false}
              onChange={(e) => handleFormatoChange('temGrupos', e.target.checked)}
              className="h-4 w-4 text-[#63E300] focus:ring-[#63E300] border-gray-700 rounded bg-[#1C1C24]"
            />
            <label className="ml-2 block text-sm text-white">Organizar em grupos</label>
          </div>
        </div>

        {dados.formato?.temGrupos && (
          <>
            <div>
              <label className="block text-sm font-medium text-white">Número de Grupos</label>
              <input
                type="number"
                value={dados.formato.numeroGrupos || 4}
                onChange={(e) => handleFormatoChange('numeroGrupos', parseInt(e.target.value))}
                className="mt-1 p-2 block w-full bg-[#1C1C24] border-gray-700 rounded-md shadow-sm focus:ring-[#63E300] focus:border-[#63E300] text-white"
                min="2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white">Times por Grupo</label>
              <input
                type="number"
                value={dados.formato.timesGrupo || 8}
                onChange={(e) => handleFormatoChange('timesGrupo', parseInt(e.target.value))}
                className="mt-1 p-2 block w-full bg-[#1C1C24] border-gray-700 rounded-md shadow-sm focus:ring-[#63E300] focus:border-[#63E300] text-white"
                min="2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white">Classificados por Grupo</label>
              <input
                type="number"
                value={dados.formato.classificadosGrupo || 2}
                onChange={(e) => handleFormatoChange('classificadosGrupo', parseInt(e.target.value))}
                className="mt-1 p-2 block w-full bg-[#1C1C24] border-gray-700 rounded-md shadow-sm focus:ring-[#63E300] focus:border-[#63E300] text-white"
                min="1"
              />
            </div>
          </>
        )}

        <div className="sm:col-span-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={dados.formato?.temPlayoffs || false}
              onChange={(e) => handleFormatoChange('temPlayoffs', e.target.checked)}
              className="h-4 w-4 text-[#63E300] focus:ring-[#63E300] border-gray-700 rounded bg-[#1C1C24]"
            />
            <label className="ml-2 block text-sm text-white">Incluir playoffs</label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="bg-[#272731] shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Users className="h-6 w-6 text-[#63E300] mr-2" />
            <h2 className="text-xl font-semibold text-white">Times e Grupos</h2>
          </div>
          <button
            type="button"
            onClick={adicionarGrupo}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-black bg-[#63E300] hover:bg-[#50B800] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#63E300] transition-colors"
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar Grupo
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {grupos.map((grupo, index) => (
            <div key={index} className="border border-gray-700 bg-[#1C1C24] rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <input
                  type="text"
                  value={grupo.nome}
                  onChange={(e) => {
                    const novosGrupos = [...grupos]
                    novosGrupos[index].nome = e.target.value
                    onChange?.({ ...dados, grupos: novosGrupos })
                  }}
                  className="text-lg font-medium border-none p-0 focus:ring-0 bg-transparent text-white"
                />
                <button
                  type="button"
                  onClick={() => removerGrupo(index)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2 mb-4">
                {(grupo.times || []).map((timeId) => {
                  const time = times.find(t => t.id === timeId)
                  return (
                    <div key={timeId} className="flex items-center justify-between bg-[#272731] p-2 rounded">
                      <span className="text-sm text-white">{time?.nome}</span>
                      <button
                        type="button"
                        onClick={() => removerTimeDoGrupo(index, timeId)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                    </div>
                  )
                })}
              </div>

              <select
                onChange={(e) => {
                  if (e.target.value) {
                    adicionarTimeAoGrupo(index, parseInt(e.target.value))
                    e.target.value = ''
                  }
                }}
                className="w-full text-sm bg-[#272731] border-gray-700 rounded-md text-white"
              >
                <option value="">Adicionar time...</option>
                {timesDisponiveis.map((time) => (
                  <option key={time.id} value={time.id}>
                    {time.nome}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="bg-[#272731] shadow rounded-lg p-6">
      <div className="flex items-center mb-6">
        <CheckCircle className="h-6 w-6 text-[#63E300] mr-2" />
        <h2 className="text-xl font-semibold text-white">Revisão</h2>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-white mb-2">Informações Básicas</h3>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-400">Nome</dt>
              <dd className="text-sm text-white">{dados.nome}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-400">Temporada</dt>
              <dd className="text-sm text-white">{dados.temporada}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-400">Tipo</dt>
              <dd className="text-sm text-white">{dados.tipo}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-400">Data de Início</dt>
              <dd className="text-sm text-white">{dados.dataInicio}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="text-lg font-medium text-white mb-2">Formato</h3>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-400">Tipo de Disputa</dt>
              <dd className="text-sm text-white">{dados.formato?.tipoDisputa}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-400">Rodadas</dt>
              <dd className="text-sm text-white">{dados.formato?.numeroRodadas}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-400">Grupos</dt>
              <dd className="text-sm text-white">{grupos.length}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="text-lg font-medium text-white mb-2">Times por Grupo</h3>
          {grupos.map((grupo, index) => (
            <div key={index} className="mb-3">
              <h4 className="text-sm font-medium text-[#63E300]">{grupo.nome}</h4>
              <p className="text-sm text-gray-400">
                {(grupo.times || []).map(timeId => times.find(t => t.id === timeId)?.sigla).filter(Boolean).join(', ')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
      {currentStep === 4 && renderStep4()}

      {!isEditMode && (
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onPrevious}
            disabled={currentStep === 1}
            className="inline-flex items-center px-4 py-2 border border-gray-700 shadow-sm text-sm font-medium rounded-md text-gray-400 bg-[#1C1C24] hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#63E300] disabled:opacity-50 transition-colors"
          >
            Anterior
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={!canProceed}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-black bg-[#63E300] hover:bg-[#50B800] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#63E300] disabled:opacity-50 transition-colors"
          >
            {isLastStep ? 'Finalizar' : 'Próximo'}
          </button>
        </div>
      )}
    </div>
  )
}