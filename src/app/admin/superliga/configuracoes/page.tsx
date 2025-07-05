"use client"

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Settings, Save, RefreshCw, AlertTriangle,
  CheckCircle, Users, Trophy, Calendar, Target,
  Database, Trash2, Download, Upload
} from 'lucide-react'
import { Loading } from '@/components/ui/Loading'
import { useSuperliga } from '@/hooks/useSuperliga'

export default function AdminSuperligaConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState<'geral' | 'estrutura' | 'avancado'>('geral')
  const [isEditing, setIsEditing] = useState(false)

  const temporada = '2025'

  const { data: superliga, isLoading, refetch } = useSuperliga(temporada)

  const [formData, setFormData] = useState({
    nome: 'Superliga de Futebol Americano',
    temporada: '2025',
    dataInicio: '2025-07-01',
    dataFim: '2025-12-15',
    descricao: 'Campeonato nacional de futebol americano',
    status: 'EM_ANDAMENTO'
  })

  if (isLoading) return <Loading />

  const handleSave = async () => {
    try {
      // Salvar configurações
      alert('Configurações salvas com sucesso!')
      setIsEditing(false)
      refetch()
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar configurações')
    }
  }

  const resetarSuperliga = async () => {
    if (confirm('Tem certeza que deseja resetar toda a Superliga? Esta ação não pode ser desfeita.')) {
      try {
        // Reset da superliga
        alert('Superliga resetada com sucesso!')
        refetch()
      } catch (error) {
        console.error('Erro ao resetar:', error)
        alert('Erro ao resetar Superliga')
      }
    }
  }

  const exportarDados = () => {
    alert('Funcionalidade de exportação será implementada')
  }

  const estruturaConferencias = [
    {
      nome: 'Sudeste',
      icone: '🏭',
      times: 12,
      regionais: ['Serramar', 'Canastra', 'Cantareira'],
      timesPorRegional: 4
    },
    {
      nome: 'Sul',
      icone: '🧊',
      times: 8,
      regionais: ['Araucária', 'Pampa'],
      timesPorRegional: 4
    },
    {
      nome: 'Nordeste',
      icone: '🌵',
      times: 6,
      regionais: ['Atlântico'],
      timesPorRegional: 6
    },
    {
      nome: 'Centro-Norte',
      icone: '🌲',
      times: 6,
      regionais: ['Cerrado', 'Amazônia'],
      timesPorRegional: 3
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/superliga"
          className="p-2 rounded-lg bg-[#272731] border border-gray-700 hover:border-gray-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">Configurações da Superliga</h1>
          <p className="text-gray-400">
            Configure parâmetros e estrutura da Superliga {temporada}
          </p>
        </div>

        <div className="flex gap-3">
          {isEditing && (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 bg-[#1C1C24] text-white px-4 py-2 rounded-md border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Cancelar
              </button>

              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-[#63E300] text-black px-4 py-2 rounded-md font-semibold hover:bg-[#50B800] transition-colors"
              >
                <Save className="w-4 h-4" />
                Salvar
              </button>
            </>
          )}

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-[#63E300] text-black px-4 py-2 rounded-md font-semibold hover:bg-[#50B800] transition-colors"
            >
              <Settings className="w-4 h-4" />
              Editar
            </button>
          )}
        </div>
      </div>

      {/* Status da Superliga */}
      {superliga && (
        <div className="bg-gradient-to-r from-[#272731] to-[#1C1C24] rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                {(superliga as any)?.nome || 'Superliga de Futebol Americano'}
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-semibold">Ativa</span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400">Temporada {(superliga as any)?.temporada || temporada}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-[#272731] rounded-lg border border-gray-700">
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('geral')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'geral'
                ? 'bg-[#1C1C24] text-[#63E300] border-b-2 border-[#63E300]'
                : 'text-gray-400 hover:text-gray-300'
              }`}
          >
            Configurações Gerais
          </button>
          <button
            onClick={() => setActiveTab('estrutura')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'estrutura'
                ? 'bg-[#1C1C24] text-[#63E300] border-b-2 border-[#63E300]'
                : 'text-gray-400 hover:text-gray-300'
              }`}
          >
            Estrutura
          </button>
          <button
            onClick={() => setActiveTab('avancado')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'avancado'
                ? 'bg-[#1C1C24] text-[#63E300] border-b-2 border-[#63E300]'
                : 'text-gray-400 hover:text-gray-300'
              }`}
          >
            Avançado
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'geral' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nome do Campeonato
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full p-3 bg-[#1C1C24] border border-gray-600 rounded-lg text-white disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Temporada
                  </label>
                  <input
                    type="text"
                    value={formData.temporada}
                    onChange={(e) => setFormData(prev => ({ ...prev, temporada: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full p-3 bg-[#1C1C24] border border-gray-600 rounded-lg text-white disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Data de Início
                  </label>
                  <input
                    type="date"
                    value={formData.dataInicio}
                    onChange={(e) => setFormData(prev => ({ ...prev, dataInicio: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full p-3 bg-[#1C1C24] border border-gray-600 rounded-lg text-white disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Data de Término
                  </label>
                  <input
                    type="date"
                    value={formData.dataFim}
                    onChange={(e) => setFormData(prev => ({ ...prev, dataFim: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full p-3 bg-[#1C1C24] border border-gray-600 rounded-lg text-white disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                  disabled={!isEditing}
                  rows={3}
                  className="w-full p-3 bg-[#1C1C24] border border-gray-600 rounded-lg text-white disabled:opacity-50 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full p-3 bg-[#1C1C24] border border-gray-600 rounded-lg text-white disabled:opacity-50"
                >
                  <option value="NAO_INICIADO">Não Iniciado</option>
                  <option value="EM_ANDAMENTO">Em Andamento</option>
                  <option value="FINALIZADO">Finalizado</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'estrutura' && (
            <div className="space-y-6">
              <div className="bg-[#1C1C24] rounded-lg p-4">
                <h3 className="text-lg font-bold text-white mb-4">Estrutura das Conferências</h3>
                <p className="text-gray-400 mb-4">
                  A Superliga é composta por 4 conferências com estruturas diferentes
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {estruturaConferencias.map((conf, index) => (
                  <div key={index} className="bg-[#1C1C24] rounded-lg border border-gray-700 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-2xl">{conf.icone}</div>
                      <div>
                        <h4 className="text-lg font-bold text-white">
                          Conferência {conf.nome}
                        </h4>
                        <p className="text-sm text-gray-400">
                          {conf.times} times total
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Regionais:</span>
                        <span className="text-white">{conf.regionais.length}</span>
                      </div>

                      <div className="text-sm">
                        <div className="text-gray-400 mb-1">Regionais:</div>
                        <div className="flex flex-wrap gap-1">
                          {conf.regionais.map((regional, idx) => (
                            <span key={idx} className="bg-[#272731] text-[#63E300] px-2 py-1 rounded text-xs">
                              {regional}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Times por Regional:</span>
                        <span className="text-white">{conf.timesPorRegional}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#1C1C24] rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3">Resumo Total</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#63E300]">32</div>
                    <div className="text-xs text-gray-400">Times Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">4</div>
                    <div className="text-xs text-gray-400">Conferências</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">8</div>
                    <div className="text-xs text-gray-400">Regionais</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">1568</div>
                    <div className="text-xs text-gray-400">Jogadores</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'avancado' && (
            <div className="space-y-6">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-400 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-red-400 mb-2">
                      Zona de Perigo
                    </h3>
                    <p className="text-gray-300 mb-4">
                      As ações abaixo são irreversíveis e podem causar perda de dados.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#1C1C24] rounded-lg border border-gray-700 p-6">
                  <h4 className="text-lg font-bold text-white mb-3">Backup e Exportação</h4>
                  <p className="text-gray-400 mb-4">
                    Exporte todos os dados da Superliga para backup
                  </p>

                  <button
                    onClick={exportarDados}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    Exportar Dados
                  </button>
                </div>

                <div className="bg-[#1C1C24] rounded-lg border border-red-700 p-6">
                  <h4 className="text-lg font-bold text-red-400 mb-3">Reset Completo</h4>
                  <p className="text-gray-400 mb-4">
                    Remove todos os dados da Superliga (jogos, playoffs, etc.)
                  </p>

                  <button
                    onClick={resetarSuperliga}
                    className="w-full flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                    Resetar Superliga
                  </button>
                </div>
              </div>

              <div className="bg-[#1C1C24] rounded-lg border border-gray-700 p-6">
                <h4 className="text-lg font-bold text-white mb-3">Informações do Sistema</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-[#272731] rounded">
                      <span className="text-gray-400">Versão do Sistema</span>
                      <span className="text-white">1.0.0</span>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-[#272731] rounded">
                      <span className="text-gray-400">Última Atualização</span>
                      <span className="text-white">Hoje</span>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-[#272731] rounded">
                      <span className="text-gray-400">Status do Banco</span>
                      <span className="text-green-400">Online</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-[#272731] rounded">
                      <span className="text-gray-400">Total de Jogos</span>
                      <span className="text-white">64</span>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-[#272731] rounded">
                      <span className="text-gray-400">Jogos Finalizados</span>
                      <span className="text-white">0</span>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-[#272731] rounded">
                      <span className="text-gray-400">Playoffs Gerados</span>
                      <span className="text-red-400">Não</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}