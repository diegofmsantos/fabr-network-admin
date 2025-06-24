"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Trophy, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { SUPERLIGA_CONFIG } from '@/types'
import { useConfigurarConferencias, useCriarSuperliga, useDistribuirTimes } from '@/hooks/useSuperliga'

export default function CriarSuperligaPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    temporada: new Date().getFullYear() + 1,
    nome: '',
    descricao: '',
    dataInicio: '',
  })
  const [superligaCriada, setSuperligaCriada] = useState<any>(null)

  const { mutate: criarSuperliga, isPending: criandoSuperliga } = useCriarSuperliga()
  const { mutate: configurarConferencias, isPending: configurandoConferencias } = useConfigurarConferencias()
  const { mutate: distribuirTimes, isPending: distribuindoTimes } = useDistribuirTimes()

  const handleSubmitEtapa1 = (e: React.FormEvent) => {
    e.preventDefault()
    
    const nome = formData.nome || `Superliga de Futebol Americano ${formData.temporada}`
    const dadosCompletos = {
      ...formData,
      nome,
      dataInicio: formData.dataInicio || new Date().toISOString().split('T')[0]
    }

    criarSuperliga(formData.temporada.toString(), {
      onSuccess: (superliga) => {
        setSuperligaCriada(superliga)
        setStep(2)
      }
    })
  }

  const handleConfigurarConferencias = () => {
    if (!superligaCriada) return

    configurarConferencias({
      campeonatoId: superligaCriada.id,
      config: SUPERLIGA_CONFIG
    }, {
      onSuccess: () => {
        setStep(3)
      }
    })
  }

  const handleDistribuirTimes = () => {
    if (!superligaCriada) return

    distribuirTimes(superligaCriada.id, {
      onSuccess: () => {
        setStep(4)
      }
    })
  }

  const handleFinalizar = () => {
    router.push(`/admin/superliga/${superligaCriada.id}`)
  }

  return (
    <div className="min-h-screen bg-[#1C1C24] p-6">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/superliga"
          className="flex items-center gap-2 text-[#63E300] hover:text-[#50B800] mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Superligas
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-[#63E300] bg-opacity-20 rounded-lg">
            <Trophy className="w-8 h-8 text-[#63E300]" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-[#63E300] italic tracking-[-2px]">
              CRIAR NOVA SUPERLIGA
            </h1>
            <p className="text-gray-400">Configure uma nova edição da Superliga de Futebol Americano</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3, 4].map((etapa) => (
            <div key={etapa} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                ${step >= etapa 
                  ? 'bg-[#63E300] text-black' 
                  : 'bg-gray-700 text-gray-400'
                }`}>
                {step > etapa ? <CheckCircle className="w-4 h-4" /> : etapa}
              </div>
              {etapa < 4 && (
                <div className={`w-12 h-1 mx-2 rounded
                  ${step > etapa ? 'bg-[#63E300]' : 'bg-gray-700'}`} 
                />
              )}
            </div>
          ))}
        </div>

        <div className="text-sm text-gray-400">
          Etapa {step} de 4: {
            step === 1 ? 'Informações Básicas' :
            step === 2 ? 'Configurar Conferências' :
            step === 3 ? 'Distribuir Times' :
            'Finalização'
          }
        </div>
      </div>

      {/* Conteúdo por Etapa */}
      <div className="max-w-2xl mx-auto">
        {/* ETAPA 1: Informações Básicas */}
        {step === 1 && (
          <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
            <h2 className="text-xl font-bold text-white mb-6">Informações da Superliga</h2>
            
            <form onSubmit={handleSubmitEtapa1} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Temporada *
                </label>
                <select
                  value={formData.temporada}
                  onChange={(e) => setFormData({...formData, temporada: parseInt(e.target.value)})}
                  className="w-full bg-[#1C1C24] border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#63E300]"
                  required
                >
                  {[2024, 2025, 2026, 2027, 2028].map(ano => (
                    <option key={ano} value={ano}>{ano}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome (opcional)
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  placeholder={`Superliga de Futebol Americano ${formData.temporada}`}
                  className="w-full bg-[#1C1C24] border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#63E300]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Se deixar vazio, será usado o nome padrão
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Data de Início (opcional)
                </label>
                <input
                  type="date"
                  value={formData.dataInicio}
                  onChange={(e) => setFormData({...formData, dataInicio: e.target.value})}
                  className="w-full bg-[#1C1C24] border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#63E300]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descrição (opcional)
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  placeholder="Descrição da edição da Superliga..."
                  rows={3}
                  className="w-full bg-[#1C1C24] border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#63E300]"
                />
              </div>

              {/* Info Box */}
              <div className="bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="text-blue-400 font-medium mb-1">Estrutura da Superliga</h4>
                    <ul className="text-sm text-blue-300 space-y-1">
                      <li>• 32 times distribuídos em 4 conferências</li>
                      <li>• 8 regionais (Sudeste: 3, Sul: 2, Nordeste: 1, Centro-Norte: 2)</li>
                      <li>• Temporada regular: 4 jogos por time</li>
                      <li>• Playoffs por conferência + fase nacional</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={criandoSuperliga}
                className="w-full bg-[#63E300] text-black py-3 px-4 rounded-md font-semibold hover:bg-[#50B800] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {criandoSuperliga ? 'Criando Superliga...' : 'Criar Superliga'}
              </button>
            </form>
          </div>
        )}

        {/* ETAPA 2: Configurar Conferências */}
        {step === 2 && (
          <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
            <h2 className="text-xl font-bold text-white mb-6">Configurar Conferências</h2>
            
            <div className="space-y-4 mb-6">
              <div className="bg-[#1C1C24] rounded-lg p-4">
                <h3 className="text-[#63E300] font-semibold mb-3">Superliga criada com sucesso!</h3>
                <p className="text-white mb-2">{superligaCriada?.nome}</p>
                <p className="text-gray-400 text-sm">ID: {superligaCriada?.id}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {SUPERLIGA_CONFIG.map((conf) => (
                  <div key={conf.tipo} className="bg-[#1C1C24] rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{conf.icone}</span>
                      <h4 className="text-white font-medium">{conf.nome}</h4>
                    </div>
                    <p className="text-gray-400 text-sm">{conf.totalTimes} times</p>
                    <p className="text-gray-400 text-sm">{conf.regionais.length} regionais</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleConfigurarConferencias}
              disabled={configurandoConferencias}
              className="w-full bg-[#63E300] text-black py-3 px-4 rounded-md font-semibold hover:bg-[#50B800] transition-colors disabled:opacity-50"
            >
              {configurandoConferencias ? 'Configurando...' : 'Configurar Conferências'}
            </button>
          </div>
        )}

        {/* ETAPA 3: Distribuir Times */}
        {step === 3 && (
          <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
            <h2 className="text-xl font-bold text-white mb-6">Distribuir Times</h2>
            
            <div className="space-y-4 mb-6">
              <div className="bg-green-500 bg-opacity-10 border border-green-500 border-opacity-30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-medium">Conferências configuradas!</span>
                </div>
                <p className="text-green-300 text-sm">4 conferências e 8 regionais criados com sucesso.</p>
              </div>

              <div className="bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <h4 className="text-yellow-400 font-medium mb-1">Distribuição Automática</h4>
                    <p className="text-yellow-300 text-sm">
                      Os 32 times da temporada {formData.temporada} serão distribuídos automaticamente 
                      nos regionais corretos baseado nos nomes dos times.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleDistribuirTimes}
              disabled={distribuindoTimes}
              className="w-full bg-[#63E300] text-black py-3 px-4 rounded-md font-semibold hover:bg-[#50B800] transition-colors disabled:opacity-50"
            >
              {distribuindoTimes ? 'Distribuindo Times...' : 'Distribuir Times Automaticamente'}
            </button>
          </div>
        )}

        {/* ETAPA 4: Finalização */}
        {step === 4 && (
          <div className="bg-[#272731] rounded-lg border border-gray-700 p-6 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Superliga Criada!</h2>
              <p className="text-gray-400">
                Sua Superliga foi configurada com sucesso e está pronta para ser gerenciada.
              </p>
            </div>

            <div className="bg-[#1C1C24] rounded-lg p-4 mb-6">
              <h3 className="text-white font-semibold mb-2">Próximos passos:</h3>
              <ul className="text-gray-300 text-sm space-y-1 text-left">
                <li>• Revisar a distribuição dos times nos regionais</li>
                <li>• Gerar jogos da temporada regular (4 jogos por time)</li>
                <li>• Acompanhar o progresso da temporada</li>
                <li>• Gerar playoffs quando a temporada regular terminar</li>
              </ul>
            </div>

            <button
              onClick={handleFinalizar}
              className="w-full bg-[#63E300] text-black py-3 px-4 rounded-md font-semibold hover:bg-[#50B800] transition-colors"
            >
              Ir para Painel da Superliga
            </button>
          </div>
        )}
      </div>
    </div>
  )
}