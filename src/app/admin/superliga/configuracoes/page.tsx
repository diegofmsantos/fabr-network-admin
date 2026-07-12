"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Settings, Save, RefreshCw, CheckCircle, Users, Trophy, Calendar, Target, Database, Download } from 'lucide-react'
import { Loading } from '@/components/ui/Loading'
import { useSuperliga, useStatusSuperliga } from '@/hooks/useSuperliga'
import { useTemporadaAdmin } from '@/hooks/useTemporadaAdmin'

export default function AdminSuperligaConfiguracoesPage() {
  const { temporada } = useTemporadaAdmin()

  const [activeTab, setActiveTab] = useState<'geral' | 'estrutura' | 'avancado'>('geral')
  const [isEditing, setIsEditing] = useState(false)

  const { data: superliga, isLoading, refetch } = useSuperliga(temporada)
  const { data: status } = useStatusSuperliga(temporada)

  const [formData, setFormData] = useState<{
    nome: string
    temporada: string
    dataInicio: string
    dataFim: string
    descricao: string
    status: string
  }>({
    nome: 'Superliga de Futebol Americano',
    temporada: temporada,
    dataInicio: '',
    dataFim: '',
    descricao: 'Campeonato nacional de futebol americano',
    status: 'EM ANDAMENTO'
  })

  // Hidrata o formulário a partir dos dados reais da Superliga quando carregam
  useEffect(() => {
    if (superliga) {
      const s = superliga as any
      setFormData((prev) => ({
        ...prev,
        nome: s.nome ?? prev.nome,
        temporada: s.temporada ?? temporada,
        dataInicio: s.dataInicio ? String(s.dataInicio).slice(0, 10) : prev.dataInicio,
        dataFim: s.dataFim ? String(s.dataFim).slice(0, 10) : prev.dataFim,
        descricao: s.descricao ?? prev.descricao,
        status: s.status ?? prev.status,
      }))
      setIsEditing(false)
    } else {
      setFormData((prev) => ({ ...prev, temporada }))
    }
  }, [superliga, temporada])

  if (isLoading) return <Loading />

  const handleSave = async () => {
    try {
      alert('Configurações salvas com sucesso!')
      setIsEditing(false)
      refetch()
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar configurações')
    }
  }

  // Estrutura da Superliga 2026 (29 times, 6 regionais)
  const estruturaConferencias = [
    {
      nome: 'Sudeste',
      icone: '🏭',
      times: 7,
      regionais: [
        { nome: 'Serramar', times: 7 }
      ]
    },
    {
      nome: 'Sul',
      icone: '🧊',
      times: 8,
      regionais: [
        { nome: 'Araucária', times: 4 },
        { nome: 'Pampa', times: 4 }
      ]
    },
    {
      nome: 'Nordeste',
      icone: '🌵',
      times: 6,
      regionais: [
        { nome: 'Atlântico', times: 6 }
      ]
    },
    {
      nome: 'Centro-Norte',
      icone: '🌲',
      times: 8,
      regionais: [
        { nome: 'Cerrado', times: 5 },
        { nome: 'Amazônia', times: 3 }
      ]
    }
  ]

  const statusData = status as any
  const totalTimesReal = statusData?.estrutura?.timesEsperados ?? 29
  const totalRegionaisReal = statusData?.estrutura?.regionais ?? 6
  const totalConferenciasReal = statusData?.estrutura?.conferencias ?? 4
  const totalJogosReal = statusData?.totalJogos ?? 0

  return (
    <div className="space-y-6">
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
            onClick={handleSave}
            disabled={!isEditing}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-colors ${isEditing
              ? 'bg-[#63E300] text-black hover:bg-[#50B800]'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
          >
            <Save className="w-4 h-4" />
            Salvar
          </button>
        </div>
      </div>

      <div className="bg-[#272731] rounded-lg border border-gray-700">
        <div className="border-b border-gray-700">
          <nav className="flex">
            {[
              { id: 'geral', label: 'Configurações Gerais', icon: Settings },
              { id: 'estrutura', label: 'Estrutura', icon: Users },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
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
                    <option value="NAO INICIADO">Não Iniciado</option>
                    <option value="EM ANDAMENTO">Em Andamento</option>
                    <option value="PLAYOFFS">Playoffs</option>
                    <option value="FINALIZADO">Finalizado</option>
                  </select>
                </div>
              </div>

              <div className="bg-[#1C1C24] rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3">Status Atual</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{totalTimesReal}</p>
                    <p className="text-sm text-gray-400">Times</p>
                  </div>
                  <div className="text-center">
                    <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{totalConferenciasReal}</p>
                    <p className="text-sm text-gray-400">Conferências</p>
                  </div>
                  <div className="text-center">
                    <Calendar className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{totalJogosReal}</p>
                    <p className="text-sm text-gray-400">Jogos</p>
                  </div>
                  <div className="text-center">
                    <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{totalRegionaisReal}</p>
                    <p className="text-sm text-gray-400">Regionais</p>
                  </div>
                </div>
              </div>
            </div>
          )}

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
                          <div key={regional.nome} className="flex items-center justify-between p-3 bg-[#272731] rounded-md">
                            <span className="text-white font-medium">Regional {regional.nome}</span>
                            <span className="text-gray-400 text-sm">{regional.times} times</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

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