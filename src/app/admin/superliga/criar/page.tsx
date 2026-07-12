/**
 * criar/page.tsx — admin (com suporte D1 e D2)
 * Substitui: src/app/admin/superliga/criar/page.tsx
 *
 * MUDANÇAS vs versão anterior:
 *  - Seletor de divisão (D1 / D2) no topo
 *  - SUPERLIGA_INFO tem configurações separadas para D1 e D2
 *  - Passa { temporada, divisao } para criarSuperliga
 */
"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Trophy, Users, CheckCircle, Settings } from 'lucide-react'
import { useCriarSuperliga, useConfigurarConferencias, useDistribuirTimesAutomatico } from '@/hooks/useSuperliga'
import { useTemporadaAdmin } from '@/hooks/useTemporadaAdmin'

type Divisao = 'D1' | 'D2'

const SUPERLIGA_INFO: Record<Divisao, {
  conferencias: { nome: string; icone: string; times: number; regionais: { nome: string; times: number }[] }[]
  totalTimes: number
  totalRegionais: number
  totalJogosRegular: number
}> = {
  D1: {
    conferencias: [
      { nome: 'Conferência Sudeste', icone: '🏭', times: 7, regionais: [{ nome: 'Regional Serramar', times: 7 }] },
      { nome: 'Conferência Sul', icone: '🧊', times: 7, regionais: [{ nome: 'Regional Araucária', times: 3 }, { nome: 'Regional Pampa', times: 4 }] },
      { nome: 'Conferência Nordeste', icone: '🌵', times: 6, regionais: [{ nome: 'Regional Atlântico', times: 6 }] },
      { nome: 'Conferência Centro-Norte', icone: '🌲', times: 6, regionais: [{ nome: 'Regional Cerrado', times: 4 }, { nome: 'Regional Amazônia', times: 2 }] },
    ],
    totalTimes: 26,
    totalRegionais: 6,
    totalJogosRegular: 44,
  },
  D2: {
    conferencias: [
      {
        nome: 'Conferência Norte', icone: '🔥', times: 12, regionais: [
          { nome: 'Regional São Paulo', times: 5 },
          { nome: 'Regional Vales', times: 3 },
          { nome: 'Regional Serramar', times: 2 },
          { nome: 'Regional Mogiana', times: 2 },
        ]
      },
      {
        nome: 'Conferência Sul', icone: '🧊', times: 14, regionais: [
          { nome: 'Regional Oeste', times: 3 },
          { nome: 'Regional Araucária', times: 4 },
          { nome: 'Regional Paranapanema', times: 4 },
          { nome: 'Regional Pampa', times: 3 },
        ]
      },
    ],
    totalTimes: 26,
    totalRegionais: 8,
    totalJogosRegular: 40,
  },
}

type Etapa = 'configuracao' | 'criando' | 'estruturando' | 'distribuindo' | 'concluido'

export default function CriarSuperligaPage() {
  const router = useRouter()
  const { temporada: temporadaAtiva } = useTemporadaAdmin()
  const [divisao, setDivisao] = useState<Divisao>('D1')
  const [etapa, setEtapa] = useState<Etapa>('configuracao')

  const { mutate: criarSuperliga } = useCriarSuperliga()
  const { mutate: configurarConferencias } = useConfigurarConferencias()
  const { mutate: distribuirTimes } = useDistribuirTimesAutomatico()

  const info = SUPERLIGA_INFO[divisao]

  const handleCriar = () => {
    if (!temporadaAtiva) { alert('Selecione uma temporada no seletor global'); return }
    setEtapa('criando')

    criarSuperliga({ temporada: temporadaAtiva, divisao }, {
      onSuccess: () => {
        setEtapa('estruturando')
        configurarConferencias({ temporada: temporadaAtiva, divisao }, {
          onSuccess: () => {
            setEtapa('distribuindo')
            distribuirTimes({ temporada: temporadaAtiva, divisao }, {
              onSuccess: () => setEtapa('concluido'),
              onError: () => alert(`Erro ao distribuir times. Verifique se há ${info.totalTimes} times D${divisao === 'D1' ? 1 : 2} cadastrados.`),
            })
          },
          onError: () => alert('Erro ao configurar conferências.'),
        })
      },
      onError: () => { alert('Erro ao criar a superliga. Já existe uma para esta temporada/divisão?'); setEtapa('configuracao') },
    })
  }

  if (etapa === 'concluido') {
    return (
      <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Superliga {divisao} {temporadaAtiva} criada!</h2>
        <p className="text-gray-400 mb-6">{info.totalTimes} times em {info.totalRegionais} regionais.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => router.push('/admin/superliga')} className="px-6 py-2 bg-[#63E300] text-black font-semibold rounded-md">Ver Superliga</button>
          <button onClick={() => router.push('/admin/importar')} className="px-6 py-2 bg-[#272731] text-white font-semibold rounded-md border border-gray-700">Importar Agenda</button>
        </div>
      </div>
    )
  }

  if (etapa !== 'configuracao') {
    const etapas = ['criando', 'estruturando', 'distribuindo']
    const labels = ['Criando campeonato', 'Configurando conferências e regionais', `Distribuindo ${info.totalTimes} times`]
    return (
      <div className="rounded-lg bg-[#1C1C24] border border-gray-700 p-8">
        <h2 className="text-xl font-bold text-white mb-6 text-center">Criando Superliga {divisao} {temporadaAtiva}...</h2>
        <div className="space-y-4 max-w-md mx-auto">
          {etapas.map((e, i) => {
            const idx = etapas.indexOf(etapa)
            return (
              <div key={e} className="flex items-center gap-3">
                {i < idx ? <CheckCircle className="w-5 h-5 text-green-400" /> :
                  i === idx ? <div className="w-5 h-5 border-2 border-[#63E300] border-t-transparent rounded-full animate-spin" /> :
                    <div className="w-5 h-5 rounded-full border-2 border-gray-600" />}
                <span className={i === idx ? 'text-white font-medium' : i < idx ? 'text-green-400' : 'text-gray-500'}>{labels[i]}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/superliga" className="p-2 rounded-lg bg-[#272731] border border-gray-700">
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Criar Superliga</h1>
          <p className="text-gray-400">Temporada {temporadaAtiva}</p>
        </div>
      </div>

      {/* Seletor de divisão */}
      <div className="bg-[#1C1C24] border border-gray-700 rounded-lg p-4">
        <p className="text-gray-400 text-sm mb-3">Divisão</p>
        <div className="flex gap-3">
          {(['D1', 'D2'] as Divisao[]).map(d => (
            <button
              key={d}
              onClick={() => setDivisao(d)}
              className={`px-6 py-2 rounded-md font-bold transition-colors ${divisao === d ? 'bg-[#63E300] text-black' : 'bg-[#272731] text-white border border-gray-700 hover:border-gray-500'
                }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Times', value: info.totalTimes, icon: Users },
          { label: 'Regionais', value: info.totalRegionais, icon: Settings },
          { label: 'Jogos (regular)', value: info.totalJogosRegular, icon: Trophy },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-[#1C1C24] border border-gray-700 rounded-lg p-4 text-center">
            <Icon className="w-6 h-6 text-[#63E300] mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-gray-400 text-sm">{label}</div>
          </div>
        ))}
      </div>

      {/* Conferências */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {info.conferencias.map(conf => (
          <div key={conf.nome} className="bg-[#1C1C24] border border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{conf.icone}</span>
              <div>
                <h3 className="text-white font-semibold">{conf.nome}</h3>
                <p className="text-gray-400 text-sm">{conf.times} times</p>
              </div>
            </div>
            <div className="space-y-1">
              {conf.regionais.map(reg => (
                <div key={reg.nome} className="flex justify-between text-sm">
                  <span className="text-gray-400">{reg.nome}</span>
                  <span className="text-gray-300">{reg.times} times</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleCriar}
        className="w-full py-3 bg-[#63E300] text-black font-bold rounded-md hover:bg-[#50b800] transition-colors"
      >
        Criar Superliga {divisao} {temporadaAtiva}
      </button>
    </div>
  )
}