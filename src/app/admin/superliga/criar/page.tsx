"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Trophy, Users, Target, Calendar, CheckCircle, Zap, Settings, Award, Crown } from 'lucide-react'
import { Loading } from '@/components/ui/Loading'
import { useCriarSuperliga, useConfigurarConferencias, useDistribuirTimesAutomatico } from '@/hooks/useSuperliga'

// Informações da estrutura da Superliga
const SUPERLIGA_INFO = {
  conferencias: [
    {
      nome: 'Conferência Sudeste',
      icone: '🏭',
      times: 12,
      regionais: [
        { nome: 'Regional Serramar', times: 4 },
        { nome: 'Regional Canastra', times: 4 },
        { nome: 'Regional Cantareira', times: 4 }
      ]
    },
    {
      nome: 'Conferência Sul',
      icone: '🧊',
      times: 8,
      regionais: [
        { nome: 'Regional Araucária', times: 4 },
        { nome: 'Regional Pampa', times: 4 }
      ]
    },
    {
      nome: 'Conferência Nordeste',
      icone: '🌵',
      times: 6,
      regionais: [
        { nome: 'Regional Atlântico', times: 6 }
      ]
    },
    {
      nome: 'Conferência Centro-Norte',
      icone: '🌲',
      times: 6,
      regionais: [
        { nome: 'Regional Cerrado', times: 3 },
        { nome: 'Regional Amazônia', times: 3 }
      ]
    }
  ],
  totalTimes: 32,
  totalRegionais: 8,
  jogosPorTime: 4,
  totalJogosTemporadaRegular: 64
}

type EtapaCriacao = 'configuracao' | 'criando' | 'estruturando' | 'distribuindo' | 'concluido'

export default function CriarSuperligaPage() {
  const router = useRouter()
  const [temporada, setTemporada] = useState('')
  const [etapaAtual, setEtapaAtual] = useState<EtapaCriacao>('configuracao')
  const [superligaId, setSuperligaId] = useState<number | null>(null)

  const { mutate: criarSuperliga, isPending: criandoSuperliga } = useCriarSuperliga()
  const { mutate: configurarConferencias, isPending: configurandoConferencias } = useConfigurarConferencias()
  const { mutate: distribuirTimes, isPending: distribuindoTimes } = useDistribuirTimesAutomatico()

  const handleCriarSuperliga = () => {
    if (!temporada) {
      alert('Por favor, informe a temporada')
      return
    }

    setEtapaAtual('criando')
    
    criarSuperliga(temporada, {
      onSuccess: (data: any) => {
        setSuperligaId(data.id || data.campeonatoId)
        setEtapaAtual('estruturando')
        
        // Configurar conferências automaticamente
        configurarConferencias(temporada, {
          onSuccess: () => {
            setEtapaAtual('distribuindo')
            
            // Distribuir times automaticamente
            distribuirTimes(temporada, {
              onSuccess: () => {
                setEtapaAtual('concluido')
              },
              onError: (error) => {
                console.error('Erro ao distribuir times:', error)
                alert('Erro ao distribuir times. Verifique se há times suficientes cadastrados.')
                setEtapaAtual('configuracao')
              }
            })
          },
          onError: (error) => {
            console.error('Erro ao configurar conferências:', error)
            alert('Erro ao configurar conferências.')
            setEtapaAtual('configuracao')
          }
        })
      },
      onError: (error) => {
        console.error('Erro ao criar Superliga:', error)
        alert('Erro ao criar Superliga. Verifique se a temporada já não existe.')
        setEtapaAtual('configuracao')
      }
    })
  }

  const handleFinalizar = () => {
    if (superligaId) {
      router.push(`/admin/superliga/${superligaId}`)
    } else {
      router.push('/admin/superliga')
    }
  }

  const renderEtapaConfiguracao = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <Trophy className="w-16 h-16 text-[#63E300] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Criar Nova Superliga</h2>
        <p className="text-gray-400">
          Configure uma nova temporada da Superliga de Futebol Americano
        </p>
      </div>

      {/* Formulário */}
      <div className="bg-[#272731] rounded-lg border border-gray-700 p-6 mb-6">
        <h3 className="text-white font-semibold mb-4">Configuração Básica</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Temporada *</label>
            <input
              type="text"
              value={temporada}
              onChange={(e) => setTemporada(e.target.value)}
              placeholder="Ex: 2025"
              className="w-full px-4 py-3 bg-[#1C1C24] text-white rounded-md border border-gray-700 focus:border-[#63E300] focus:outline-none"
            />
            <p className="text-gray-500 text-sm mt-1">
              Ano da temporada da Superliga
            </p>
          </div>
        </div>
      </div>

      {/* Estrutura da Superliga */}
      <div className="bg-[#272731] rounded-lg border border-gray-700 p-6 mb-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-[#63E300]" />
          Estrutura da Superliga
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {SUPERLIGA_INFO.conferencias.map((conferencia, index) => (
            <div key={index} className="bg-[#1C1C24] rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{conferencia.icone}</span>
                <div>
                  <h4 className="text-white font-medium">{conferencia.nome}</h4>
                  <p className="text-gray-400 text-sm">{conferencia.times} times</p>
                </div>
              </div>
              
              <div className="space-y-2">
                {conferencia.regionais.map((regional, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-300">{regional.nome}</span>
                    <span className="text-gray-400">{regional.times} times</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-[#1C1C24] rounded-lg">
          <div className="text-center">
            <p className="text-2xl font-bold text-[#63E300]">{SUPERLIGA_INFO.totalTimes}</p>
            <p className="text-gray-400 text-sm">Times Total</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#63E300]">4</p>
            <p className="text-gray-400 text-sm">Conferências</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#63E300]">{SUPERLIGA_INFO.totalRegionais}</p>
            <p className="text-gray-400 text-sm">Regionais</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#63E300]">{SUPERLIGA_INFO.jogosPorTime}</p>
            <p className="text-gray-400 text-sm">Jogos por Time</p>
          </div>
        </div>
      </div>

      {/* Como Funciona */}
      <div className="bg-[#272731] rounded-lg border border-gray-700 p-6 mb-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-500" />
          Como Funciona
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <h4 className="text-white font-medium mb-2">1. Temporada Regular</h4>
            <p className="text-gray-400 text-sm">
              Cada time joga 4 jogos contra times da sua conferência
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-6 h-6 text-orange-500" />
            </div>
            <h4 className="text-white font-medium mb-2">2. Playoffs</h4>
            <p className="text-gray-400 text-sm">
              Wild Card, Semifinais e Finais de cada conferência
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Crown className="w-6 h-6 text-yellow-500" />
            </div>
            <h4 className="text-white font-medium mb-2">3. Fase Nacional</h4>
            <p className="text-gray-400 text-sm">
              Semifinais e Grande Decisão Nacional
            </p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={handleCriarSuperliga}
          disabled={!temporada || criandoSuperliga}
          className="bg-[#63E300] text-black px-8 py-3 rounded-md font-semibold hover:bg-[#50B800] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {criandoSuperliga ? 'Criando Superliga...' : 'Criar Superliga'}
        </button>
      </div>
    </div>
  )

  const renderEtapaProcessamento = () => {
    const etapas = [
      { id: 'criando', label: 'Criando Superliga', icon: Trophy, concluida: !['criando'].includes(etapaAtual) },
      { id: 'estruturando', label: 'Configurando Estrutura', icon: Settings, concluida: !['criando', 'estruturando'].includes(etapaAtual) },
      { id: 'distribuindo', label: 'Distribuindo Times', icon: Users, concluida: etapaAtual === 'concluido' }
    ]

    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <Trophy className="w-16 h-16 text-[#63E300] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Criando Superliga {temporada}</h2>
          <p className="text-gray-400">
            Aguarde enquanto configuramos a estrutura da Superliga...
          </p>
        </div>

        <div className="space-y-4">
          {etapas.map((etapa, index) => {
            const Icon = etapa.icon
            const isAtual = etapa.id === etapaAtual
            const isConcluida = etapa.concluida

            return (
              <div key={etapa.id} className="flex items-center gap-4 p-4 bg-[#272731] rounded-lg border border-gray-700">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  isConcluida ? 'bg-green-500/10' : 
                  isAtual ? 'bg-blue-500/10' : 'bg-gray-500/10'
                }`}>
                  {isConcluida ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : isAtual ? (
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Icon className="w-6 h-6 text-gray-500" />
                  )}
                </div>
                
                <div className="flex-1 text-left">
                  <h3 className={`font-medium ${
                    isConcluida ? 'text-green-400' : 
                    isAtual ? 'text-blue-400' : 'text-gray-400'
                  }`}>
                    {etapa.label}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {isConcluida ? 'Concluído' : 
                     isAtual ? 'Em andamento...' : 'Aguardando'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderEtapaConcluida = () => (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Superliga Criada com Sucesso!</h2>
        <p className="text-gray-400 mb-6">
          A Superliga {temporada} foi configurada e está pronta para uso.
        </p>
      </div>

      <div className="bg-[#272731] rounded-lg border border-gray-700 p-6 mb-6">
        <h3 className="text-white font-semibold mb-4">O que foi configurado:</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-[#1C1C24] rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-white">4 Conferências criadas</span>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-[#1C1C24] rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-white">8 Regionais configurados</span>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-[#1C1C24] rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-white">32 Times distribuídos</span>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-[#1C1C24] rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-white">Estrutura validada</span>
          </div>
        </div>
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
  )

  const renderConteudo = () => {
    switch (etapaAtual) {
      case 'configuracao':
        return renderEtapaConfiguracao()
      case 'criando':
      case 'estruturando':
      case 'distribuindo':
        return renderEtapaProcessamento()
      case 'concluido':
        return renderEtapaConcluida()
      default:
        return renderEtapaConfiguracao()
    }
  }

  if (criandoSuperliga || configurandoConferencias || distribuindoTimes) {
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-[#1C1C24] p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link 
          href="/admin/superliga"
          className="p-2 rounded-lg bg-[#272731] border border-gray-700 hover:border-gray-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        
        <div>
          <h1 className="text-2xl font-bold text-white">Nova Superliga</h1>
          <p className="text-gray-400">Configurar uma nova temporada da Superliga</p>
        </div>
      </div>

      {/* Progresso */}
      {etapaAtual !== 'configuracao' && (
        <div className="mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-gray-400 text-sm">Progresso:</span>
            <span className="text-white font-medium">
              {etapaAtual === 'criando' && '1/3'}
              {etapaAtual === 'estruturando' && '2/3'}
              {etapaAtual === 'distribuindo' && '3/3'}
              {etapaAtual === 'concluido' && 'Concluído'}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-[#63E300] h-2 rounded-full transition-all duration-500"
              style={{ 
                width: 
                  etapaAtual === 'criando' ? '33%' :
                  etapaAtual === 'estruturando' ? '66%' :
                  etapaAtual === 'distribuindo' ? '99%' :
                  etapaAtual === 'concluido' ? '100%' : '0%'
              }}
            />
          </div>
        </div>
      )}

      {/* Conteúdo */}
      <div className="container mx-auto">
        {renderConteudo()}
      </div>
    </div>
  )
}