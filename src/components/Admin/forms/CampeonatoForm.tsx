"use client"

import { useState, useEffect } from 'react'
import { Time } from '@/types/time'
import { CriarCampeonatoRequest } from '@/types/campeonato'
import { Calendar, Users, Settings, Trophy, Plus, Minus, CheckCircle } from 'lucide-react'

interface CampeonatoFormProps {
  currentStep: number
  formData: CriarCampeonatoRequest
  onChange: (data: CriarCampeonatoRequest) => void
  times: Time[]
  onNext: () => void
  onPrevious: () => void
  canProceed: boolean
  isLastStep: boolean
}

export const CampeonatoForm: React.FC<CampeonatoFormProps> = ({
  currentStep,
  formData,
  onChange,
  times,
  onNext,
  onPrevious,
  canProceed,
  isLastStep
}) => {
  const [timesDisponiveis, setTimesDisponiveis] = useState<Time[]>([])

  const grupos = formData.grupos || []

  useEffect(() => {
    const timesUsados = grupos.flatMap(grupo => grupo.times || [])
    setTimesDisponiveis(times.filter(time => !timesUsados.includes(time.id || 0)))
  }, [times, grupos])

  const handleInputChange = (field: string, value: any) => {
    onChange({ ...formData, [field]: value })
  }

  const handleFormatoChange = (field: string, value: any) => {
    onChange({
      ...formData,
      formato: { ...formData.formato, [field]: value }
    })
  }

  const adicionarGrupo = () => {
    const novoGrupo = {
      nome: `Grupo ${String.fromCharCode(65 + grupos.length)}`,
      times: []
    }
    onChange({
      ...formData,
      grupos: [...grupos, novoGrupo]
    })
  }

  const removerGrupo = (index: number) => {
    const novosGrupos = grupos.filter((_, i) => i !== index)
    onChange({ ...formData, grupos: novosGrupos })
  }

  const adicionarTimeAoGrupo = (grupoIndex: number, timeId: number) => {
    const novosGrupos = [...grupos]
    if (!novosGrupos[grupoIndex].times) {
      novosGrupos[grupoIndex].times = []
    }
    novosGrupos[grupoIndex].times!.push(timeId)
    onChange({ ...formData, grupos: novosGrupos })
  }

  const removerTimeDoGrupo = (grupoIndex: number, timeId: number) => {
    const novosGrupos = [...grupos]
    if (novosGrupos[grupoIndex].times) {
      novosGrupos[grupoIndex].times = novosGrupos[grupoIndex].times!.filter(id => id !== timeId)
    }
    onChange({ ...formData, grupos: novosGrupos })
  }

  const renderStep1 = () => (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center mb-6">
        <Calendar className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Informações Básicas</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome do Campeonato</label>
          <input
            type="text"
            value={formData.nome}
            onChange={(e) => handleInputChange('nome', e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ex: Brasileirão 2025"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Temporada</label>
          <select
            value={formData.temporada}
            onChange={(e) => handleInputChange('temporada', e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo</label>
          <select
            value={formData.tipo}
            onChange={(e) => handleInputChange('tipo', e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="REGULAR">Temporada Regular</option>
            <option value="PLAYOFFS">Playoffs</option>
            <option value="COPA">Copa</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Data de Início</label>
          <input
            type="date"
            value={formData.dataInicio}
            onChange={(e) => handleInputChange('dataInicio', e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Data de Fim (opcional)</label>
          <input
            type="date"
            value={formData.dataFim}
            onChange={(e) => handleInputChange('dataFim', e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Descrição (opcional)</label>
          <textarea
            value={formData.descricao}
            onChange={(e) => handleInputChange('descricao', e.target.value)}
            rows={3}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Descrição do campeonato..."
          />
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center mb-6">
        <Settings className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Formato do Campeonato</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo de Disputa</label>
          <select
            value={formData.formato.tipoDisputa}
            onChange={(e) => handleFormatoChange('tipoDisputa', e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="PONTOS_CORRIDOS">Pontos Corridos</option>
            <option value="MATA_MATA">Mata-mata</option>
            <option value="MISTO">Misto</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Número de Rodadas</label>
          <input
            type="number"
            value={formData.formato.numeroRodadas}
            onChange={(e) => handleFormatoChange('numeroRodadas', parseInt(e.target.value))}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            min="1"
          />
        </div>

        <div className="sm:col-span-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.formato.temGrupos}
              onChange={(e) => handleFormatoChange('temGrupos', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">Organizar em grupos</label>
          </div>
        </div>

        {formData.formato.temGrupos && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Número de Grupos</label>
              <input
                type="number"
                value={formData.formato.numeroGrupos}
                onChange={(e) => handleFormatoChange('numeroGrupos', parseInt(e.target.value))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                min="2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Times por Grupo</label>
              <input
                type="number"
                value={formData.formato.timesGrupo}
                onChange={(e) => handleFormatoChange('timesGrupo', parseInt(e.target.value))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                min="2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Classificados por Grupo</label>
              <input
                type="number"
                value={formData.formato.classificadosGrupo}
                onChange={(e) => handleFormatoChange('classificadosGrupo', parseInt(e.target.value))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                min="1"
              />
            </div>
          </>
        )}

        <div className="sm:col-span-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.formato.temPlayoffs}
              onChange={(e) => handleFormatoChange('temPlayoffs', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">Incluir playoffs</label>
          </div>
        </div>
      </div>
    </div>
  )

    const renderStep3 = () => (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Users className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Times e Grupos</h2>
          </div>
          <button
            type="button"
            onClick={adicionarGrupo}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar Grupo
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ✅ CORREÇÃO 7: Usar grupos local */}
          {grupos.map((grupo, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <input
                  type="text"
                  value={grupo.nome}
                  onChange={(e) => {
                    const novosGrupos = [...grupos]
                    novosGrupos[index].nome = e.target.value
                    onChange({ ...formData, grupos: novosGrupos })
                  }}
                  className="text-lg font-medium border-none p-0 focus:ring-0"
                />
                <button
                  type="button"
                  onClick={() => removerGrupo(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Minus className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2 mb-4">
                {/* ✅ CORREÇÃO 8: Garantir que times existe */}
                {(grupo.times || []).map((timeId) => {
                  const time = times.find(t => t.id === timeId)
                  return (
                    <div key={timeId} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm">{time?.nome}</span>
                      <button
                        type="button"
                        onClick={() => removerTimeDoGrupo(index, timeId)}
                        className="text-red-600 hover:text-red-800"
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
                className="w-full text-sm border-gray-300 rounded-md"
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
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center mb-6">
        <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Revisão</h2>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Informações Básicas</h3>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Nome</dt>
              <dd className="text-sm text-gray-900">{formData.nome}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Temporada</dt>
              <dd className="text-sm text-gray-900">{formData.temporada}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Tipo</dt>
              <dd className="text-sm text-gray-900">{formData.tipo}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Data de Início</dt>
              <dd className="text-sm text-gray-900">{formData.dataInicio}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Formato</h3>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Tipo de Disputa</dt>
              <dd className="text-sm text-gray-900">{formData.formato.tipoDisputa}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Rodadas</dt>
              <dd className="text-sm text-gray-900">{formData.formato.numeroRodadas}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Grupos</dt>
              <dd className="text-sm text-gray-900">{grupos.length}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Times por Grupo</h3>
          {grupos.map((grupo, index) => (
            <div key={index} className="mb-3">
              <h4 className="text-sm font-medium text-gray-700">{grupo.nome}</h4>
              <p className="text-sm text-gray-600">
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

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onPrevious}
          disabled={currentStep === 1}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          Anterior
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLastStep ? 'Finalizar' : 'Próximo'}
        </button>
      </div>
    </div>
  )
}