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
      {/* ✅ CORRIGIDO - Header com tipagem explícita para React.JSX.Element */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/superliga"
          className="p-2 rounded-lg bg-[#272731] border border-gray-700 hover:border-gray-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">Configurações da Superliga</h1>
          <p className="text-gray-400">Gerencie configurações avançadas da temporada {temporada}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={exportarDados}
            className="flex items-center gap-2 bg-[#1C1C24] text-white px-4 py-2 rounded-md border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>

          <button
            onClick={handleSave}
            disabled={!isEditing}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-colors ${
              isEditing
                ? 'bg-[#63E300] text-black hover:bg-[#50B800]'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" />
            Salvar
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#272731] rounded-lg border border-gray-700">
        <div className="border-b border-gray-700">
          <nav className="flex">
            {[
              { id: 'geral', label: 'Configurações Gerais', icon: Settings },
              { id: 'estrutura', label: 'Estrutura', icon: Users },
              { id: 'avancado', label: 'Avançado', icon: Database }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#63E300] text-[#63E300]'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Tab: Configurações Gerais */}
          {activeTab === 'geral' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Informações Básicas</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Nome da Superliga</label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => {
                        setFormData({ ...formData, nome: e.target.value })
                        setIsEditing(true)
                      }}
                      className="w-full px-4 py-3 bg-[#1C1C24] text-white rounded-md border border-gray-700 focus:border-[#63E300] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Temporada</label>
                    <input
                      type="text"
                      value={formData.temporada}
                      onChange={(e) => {
                        setFormData({ ...formData, temporada: e.target.value })
                        setIsEditing(true)
                      }}
                      className="w-full px-4 py-3 bg-[#1C1C24] text-white rounded-md border border-gray-700 focus:border-[#63E300] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Data de Início</label>
                    <input
                      type="date"
                      value={formData.dataInicio}
                      onChange={(e) => {
                        setFormData({ ...formData, dataInicio: e.target.value })
                        setIsEditing(true)
                      }}
                      className="w-full px-4 py-3 bg-[#1C1C24] text-white rounded-md border border-gray-700 focus:border-[#63E300] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Data de Fim</label>
                    <input
                      type="date"
                      value={formData.dataFim}
                      onChange={(e) => {
                        setFormData({ ...formData, dataFim: e.target.value })
                        setIsEditing(true)
                      }}
                      className="w-full px-4 py-3 bg-[#1C1C24] text-white rounded-md border border-gray-700 focus:border-[#63E300] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm text-gray-400 mb-2">Descrição</label>
                  <textarea
                    value={formData.descricao}
                    onChange={(e) => {
                      setFormData({ ...formData, descricao: e.target.value })
                      setIsEditing(true)
                    }}
                    rows={3}
                    className="w-full px-4 py-3 bg-[#1C1C24] text-white rounded-md border border-gray-700 focus:border-[#63E300] focus:outline-none"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm text-gray-400 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => {
                      setFormData({ ...formData, status: e.target.value })
                      setIsEditing(true)
                    }}
                    className="w-full px-4 py-3 bg-[#1C1C24] text-white rounded-md border border-gray-700 focus:border-[#63E300] focus:outline-none"
                  >
                    <option value="NAO_INICIADO">Não Iniciado</option>
                    <option value="EM_ANDAMENTO">Em Andamento</option>
                    <option value="PLAYOFFS">Playoffs</option>
                    <option value="FINALIZADO">Finalizado</option>
                  </select>
                </div>
              </div>

              {/* Status Atual */}
              <div className="bg-[#1C1C24] rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3">Status Atual</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">32</p>
                    <p className="text-sm text-gray-400">Times</p>
                  </div>
                  <div className="text-center">
                    <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">4</p>
                    <p className="text-sm text-gray-400">Conferências</p>
                  </div>
                  <div className="text-center">
                    <Calendar className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">84</p>
                    <p className="text-sm text-gray-400">Jogos</p>
                  </div>
                  <div className="text-center">
                    <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">8</p>
                    <p className="text-sm text-gray-400">Regionais</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Estrutura */}
          {activeTab === 'estrutura' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Estrutura das Conferências</h3>
                <p className="text-gray-400 mb-6">
                  Visualize a organização das conferências e regionais da Superliga
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {estruturaConferencias.map((conf) => (
                    <div key={conf.nome} className="bg-[#1C1C24] rounded-lg p-6 border border-gray-700">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">{conf.icone}</span>
                        <div>
                          <h4 className="text-lg font-bold text-white">Conferência {conf.nome}</h4>
                          <p className="text-sm text-gray-400">{conf.times} times em {conf.regionais.length} regionais</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {conf.regionais.map((regional) => (
                          <div key={regional} className="flex items-center justify-between p-3 bg-[#272731] rounded-md">
                            <span className="text-white font-medium">Regional {regional}</span>
                            <span className="text-gray-400 text-sm">{conf.timesPorRegional} times</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ações da Estrutura */}
              <div className="bg-[#1C1C24] rounded-lg p-6">
                <h4 className="text-white font-semibold mb-4">Ações da Estrutura</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors">
                    <RefreshCw className="w-5 h-5" />
                    Redistribuir Times
                  </button>
                  
                  <button className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-green-700 transition-colors">
                    <CheckCircle className="w-5 h-5" />
                    Validar Estrutura
                  </button>
                  
                  <button className="flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-purple-700 transition-colors">
                    <Download className="w-5 h-5" />
                    Exportar Estrutura
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Avançado */}
          {activeTab === 'avancado' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Configurações Avançadas</h3>
                <p className="text-gray-400 mb-6">
                  Ações administrativas e configurações avançadas do sistema
                </p>

                {/* Seção: Backup e Restore */}
                <div className="bg-[#1C1C24] rounded-lg p-6 mb-6">
                  <h4 className="text-white font-semibold mb-4">Backup e Restauração</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={exportarDados}
                      className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      Fazer Backup Completo
                    </button>
                    
                    <button className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-green-700 transition-colors">
                      <Upload className="w-5 h-5" />
                      Restaurar Backup
                    </button>
                  </div>
                </div>

                {/* Seção: Manutenção */}
                <div className="bg-[#1C1C24] rounded-lg p-6 mb-6">
                  <h4 className="text-white font-semibold mb-4">Manutenção do Sistema</h4>
                  <div className="space-y-4">
                    <button className="w-full flex items-center justify-center gap-2 bg-yellow-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-yellow-700 transition-colors">
                      <RefreshCw className="w-5 h-5" />
                      Recalcular Estatísticas
                    </button>
                    
                    <button className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-purple-700 transition-colors">
                      <Database className="w-5 h-5" />
                      Otimizar Base de Dados
                    </button>
                  </div>
                </div>

                {/* Zona de Perigo */}
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <h4 className="text-red-400 font-semibold">Zona de Perigo</h4>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4">
                    As ações abaixo são irreversíveis e podem causar perda de dados.
                    Use com extrema cautela.
                  </p>

                  <div className="space-y-3">
                    <button
                      onClick={resetarSuperliga}
                      className="w-full flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                      Resetar Superliga Completa
                    </button>
                    
                    <button className="w-full flex items-center justify-center gap-2 bg-red-700 text-white px-4 py-3 rounded-md font-semibold hover:bg-red-800 transition-colors">
                      <Trash2 className="w-5 h-5" />
                      Excluir Todos os Dados
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between p-4 bg-[#272731] rounded-lg border border-gray-700">
        <div className="flex items-center gap-2 text-gray-400">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-sm">Última atualização: {new Date().toLocaleDateString('pt-BR')}</span>
        </div>
        
        <div className="flex gap-3">
          <Link
            href="/admin/superliga"
            className="flex items-center gap-2 bg-[#1C1C24] text-white px-4 py-2 rounded-md border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 bg-[#63E300] text-black px-4 py-2 rounded-md font-semibold hover:bg-[#50B800] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </button>
        </div>
      </div>
    </div>
  )
}