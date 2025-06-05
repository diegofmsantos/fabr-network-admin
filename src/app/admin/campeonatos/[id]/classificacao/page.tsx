"use client"

import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useCampeonato, useClassificacao } from '@/hooks/useCampeonatos'
import { TabelaClassificacao } from '@/components/TabelaClassificacao'
import { Loading } from '@/components/ui/Loading'
import { NoDataFound } from '@/components/ui/NoDataFound'
import { ArrowLeft, RotateCcw, Download, Plus, Minus, AlertTriangle, CheckCircle, Calculator, History, Settings, Filter, TrendingUp, TrendingDown, Trophy } from 'lucide-react'
import Link from 'next/link'

interface AjustePontuacao {
  timeId: number
  motivo: string
  pontos: number
  tipo: 'penalizacao' | 'bonificacao'
  data: string
}

export default function AdminClassificacao() {
  const params = useParams()
  const router = useRouter()

  const [selectedGrupo, setSelectedGrupo] = useState<number | 'todos'>('todos')
  const [showAjustes, setShowAjustes] = useState(false)
  const [ajustesPontuacao, setAjustesPontuacao] = useState<AjustePontuacao[]>([])
  const [novoAjuste, setNovoAjuste] = useState({
    timeId: 0,
    motivo: '',
    pontos: 0,
    tipo: 'penalizacao' as 'penalizacao' | 'bonificacao'
  })

  const campeonatoId = parseInt(params.id as string)

  const { data: campeonato, isLoading: loadingCampeonato, error } = useCampeonato(campeonatoId)
  const { data: classificacao = [], isLoading: loadingClassificacao, refetch } = useClassificacao(campeonatoId)

  const loading = loadingCampeonato || loadingClassificacao

  const classificacaoFiltrada = useMemo(() => {
    if (selectedGrupo === 'todos') return classificacao
    return classificacao.filter(item => item.grupoId === selectedGrupo)
  }, [classificacao, selectedGrupo])

  const statsClassificacao = useMemo(() => {
    if (!classificacao.length) return null

    const totalJogos = classificacao.reduce((acc, item) => acc + item.jogos, 0)
    const totalPontos = classificacao.reduce((acc, item) => acc + item.pontosPro, 0)
    const mediaAproveitamento = classificacao.reduce((acc, item) => acc + item.aproveitamento, 0) / classificacao.length

    const lideresPorGrupo = campeonato?.grupos.map(grupo => {
      const timesGrupo = classificacao.filter(c => c.grupoId === grupo.id)
      return {
        grupo: grupo.nome,
        lider: timesGrupo.sort((a, b) => a.posicao - b.posicao)[0]
      }
    }) || []

    const timesEmRisco = classificacao.filter(item => {
      const timesNoGrupo = classificacao.filter(c => c.grupoId === item.grupoId).length
      return item.posicao > timesNoGrupo - 2
    })

    return {
      totalJogos,
      totalPontos,
      mediaAproveitamento,
      lideresPorGrupo,
      timesEmRisco,
      totalTimes: classificacao.length
    }
  }, [classificacao, campeonato])

  const handleRecalcularClassificacao = async () => {
    if (confirm('Recalcular a classificação com base nos resultados atuais dos jogos?')) {
      try {
        await refetch()
        alert('Classificação recalculada com sucesso!')
      } catch (error) {
        alert('Erro ao recalcular classificação')
      }
    }
  }

  const handleAdicionarAjuste = () => {
    if (!novoAjuste.timeId || !novoAjuste.motivo || !novoAjuste.pontos) {
      alert('Preencha todos os campos')
      return
    }

    const ajuste: AjustePontuacao = {
      ...novoAjuste,
      data: new Date().toISOString()
    }

    setAjustesPontuacao(prev => [...prev, ajuste])
    setNovoAjuste({ timeId: 0, motivo: '', pontos: 0, tipo: 'penalizacao' })

    console.log('Ajuste adicionado:', ajuste)
  }

  const handleExportar = (formato: 'csv' | 'pdf' | 'excel') => {
    console.log('Exportar classificação em:', formato)
  }

  if (loading) return <Loading />

  if (error || !campeonato) {
    return (
      <NoDataFound
        type="campeonato"
        entityName={params.id as string}
        onGoBack={() => router.back()}
        temporada="2025"
      />
    )
  }

  const timesDisponiveis = classificacao.map(item => ({
    id: item.timeId,
    nome: item.time.nome,
    sigla: item.time.sigla
  }))

  const StatCard = ({ icon: Icon, title, value, subtitle, color = "blue", trend }: {
    icon: any, title: string, value: string | number, subtitle?: string, color?: string, trend?: 'up' | 'down' | 'neutral'
  }) => (
    <div className="bg-[#272731] border border-gray-700 rounded-lg p-4 ">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-300">{title}</p>
          <p className="text-xl font-bold text-gray-300">{value}</p>
          {subtitle && <p className="text-xs text-gray-300">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {trend && (
            <div className={`p-1 rounded ${trend === 'up' ? 'bg-green-100' :
                trend === 'down' ? 'bg-red-100' : 'bg-gray-100'
              }`}>
              {trend === 'up' ? (
                <TrendingUp className="w-3 h-3 text-green-600" />
              ) : trend === 'down' ? (
                <TrendingDown className="w-3 h-3 text-red-600" />
              ) : null}
            </div>
          )}
          <div className={`p-2 rounded-lg bg-${color}-100`}>
            <Icon className={`w-5 h-5 text-${color}-600`} />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="bg-[#272731] shadow rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href={`/admin/campeonatos/${campeonatoId}`}
              className="inline-flex items-center text-sm font-medium text-gray-300 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-[#63E300]">Gerenciar Classificação</h1>
              <p className="text-sm text-gray-300">
                {campeonato.nome} • {classificacao.length} times
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAjustes(!showAjustes)}
              className="inline-flex items-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500"
            >
              <Settings className="h-4 w-4 mr-2" />
              Ajustes
            </button>

            <div className="relative">
              <button className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 hidden group-hover:block">
                <button onClick={() => handleExportar('csv')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                  Exportar CSV
                </button>
                <button onClick={() => handleExportar('excel')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                  Exportar Excel
                </button>
                <button onClick={() => handleExportar('pdf')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                  Relatório PDF
                </button>
              </div>
            </div>

            <button
              onClick={handleRecalcularClassificacao}
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Recalcular
            </button>
          </div>
        </div>
      </div>

      {statsClassificacao && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Trophy}
            title="Total de Times"
            value={statsClassificacao.totalTimes}
            subtitle={`${statsClassificacao.totalJogos} jogos`}
            color="blue"
            trend="neutral"
          />
          <StatCard
            icon={Calculator}
            title="Total de Pontos"
            value={statsClassificacao.totalPontos}
            subtitle="pontos marcados"
            color="green"
            trend="up"
          />
          <StatCard
            icon={TrendingUp}
            title="Aproveitamento Médio"
            value={`${statsClassificacao.mediaAproveitamento.toFixed(1)}%`}
            subtitle="média geral"
            color="purple"
            trend="up"
          />
          <StatCard
            icon={AlertTriangle}
            title="Times em Risco"
            value={statsClassificacao.timesEmRisco.length}
            subtitle="últimas posições"
            color="red"
            trend="down"
          />
        </div>
      )}

      {statsClassificacao?.lideresPorGrupo && (
        <div className="bg-[#272731] border border-gray-700  rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-300 mb-4 ">Líderes por Grupo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {statsClassificacao.lideresPorGrupo.map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="p-2 bg-yellow-500 rounded-full">
                  <Trophy className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{item.grupo}</div>
                  <div className="text-sm text-gray-600">{item.lider?.time.nome}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-yellow-600">{item.lider?.pontos} pts</div>
                  <div className="text-xs text-gray-500">{item.lider?.aproveitamento.toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-[#272731] border border-gray-700 rounded-lg p-4 ">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={selectedGrupo}
            onChange={(e) => setSelectedGrupo(e.target.value === 'todos' ? 'todos' : parseInt(e.target.value))}
            className="border rounded-md px-3 py-2"
          >
            <option value="todos">Todos os Grupos</option>
            {campeonato.grupos.map(grupo => (
              <option key={grupo.id} value={grupo.id}>
                {grupo.nome}
              </option>
            ))}
          </select>

          <div className="flex-1"></div>

          <span className="text-sm text-gray-300">
            Mostrando {classificacaoFiltrada.length} de {classificacao.length} times
          </span>
        </div>
      </div>

      {showAjustes && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ajustes de Pontuação</h3>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <select
                value={novoAjuste.timeId}
                onChange={(e) => setNovoAjuste(prev => ({ ...prev, timeId: parseInt(e.target.value) }))}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value={0}>Selecionar time</option>
                {timesDisponiveis.map(time => (
                  <option key={time.id} value={time.id}>{time.nome}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select
                value={novoAjuste.tipo}
                onChange={(e) => setNovoAjuste(prev => ({ ...prev, tipo: e.target.value as 'penalizacao' | 'bonificacao' }))}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="penalizacao">Penalização</option>
                <option value="bonificacao">Bonificação</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pontos</label>
              <input
                type="number"
                value={novoAjuste.pontos}
                onChange={(e) => setNovoAjuste(prev => ({ ...prev, pontos: parseInt(e.target.value) }))}
                className="w-full border rounded-md px-3 py-2"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
              <input
                type="text"
                value={novoAjuste.motivo}
                onChange={(e) => setNovoAjuste(prev => ({ ...prev, motivo: e.target.value }))}
                placeholder="Ex: Escalação irregular"
                className="w-full border rounded-md px-3 py-2"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleAdicionarAjuste}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Aplicar
              </button>
            </div>
          </div>

          {ajustesPontuacao.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Ajustes Aplicados</h4>
              <div className="space-y-2">
                {ajustesPontuacao.map((ajuste, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-1 rounded ${ajuste.tipo === 'penalizacao' ? 'bg-red-100' : 'bg-green-100'
                        }`}>
                        {ajuste.tipo === 'penalizacao' ? (
                          <Minus className="w-4 h-4 text-red-600" />
                        ) : (
                          <Plus className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">
                          {timesDisponiveis.find(t => t.id === ajuste.timeId)?.nome}
                        </div>
                        <div className="text-sm text-gray-600">{ajuste.motivo}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${ajuste.tipo === 'penalizacao' ? 'text-red-600' : 'text-green-600'
                        }`}>
                        {ajuste.tipo === 'penalizacao' ? '-' : '+'}{ajuste.pontos} pts
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(ajuste.data).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <button
                      onClick={() => setAjustesPontuacao(prev => prev.filter((_, i) => i !== index))}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <h3 className="font-medium text-yellow-800">Alertas</h3>
          </div>
          <div className="space-y-2 text-sm">
            {statsClassificacao?.timesEmRisco.map(time => (
              <div key={time.timeId} className="text-yellow-700">
                • {time.time.nome} está em zona de rebaixamento
              </div>
            ))}
            {classificacao.some(item => item.jogos === 0) && (
              <div className="text-yellow-700">
                • Alguns times ainda não jogaram
              </div>
            )}
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="font-medium text-green-800">Destaques</h3>
          </div>
          <div className="space-y-2 text-sm">
            {classificacao
              .filter(item => item.posicao === 1)
              .map(lider => (
                <div key={lider.timeId} className="text-green-700">
                  • {lider.time.nome} lidera seu grupo
                </div>
              ))}
            {classificacao
              .filter(item => item.aproveitamento === 100)
              .map(invicto => (
                <div key={invicto.timeId} className="text-green-700">
                  • {invicto.time.nome} tem 100% de aproveitamento
                </div>
              ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <History className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium text-blue-800">Próximas Ações</h3>
          </div>
          <div className="space-y-2">
            <button className="w-full text-left p-2 text-sm text-blue-700 hover:bg-blue-100 rounded">
              • Verificar jogos pendentes
            </button>
            <button className="w-full text-left p-2 text-sm text-blue-700 hover:bg-blue-100 rounded">
              • Analisar empates técnicos
            </button>
            <button className="w-full text-left p-2 text-sm text-blue-700 hover:bg-blue-100 rounded">
              • Gerar relatório de rodada
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {selectedGrupo === 'todos' ? (
          campeonato.grupos.map(grupo => {
            const classificacaoGrupo = classificacao.filter(c => c.grupoId === grupo.id)
            if (classificacaoGrupo.length === 0) return null

            return (
              <div key={grupo.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-300">{grupo.nome}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <span>{classificacaoGrupo.length} times</span>
                    <span>•</span>
                    <span>
                      {classificacaoGrupo.reduce((acc, item) => acc + item.jogos, 0)} jogos
                    </span>
                  </div>
                </div>
                <TabelaClassificacao
                  classificacao={classificacaoGrupo}
                  temporada={campeonato.temporada}
                />
              </div>
            )
          })
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {campeonato.grupos.find(g => g.id === selectedGrupo)?.nome}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{classificacaoFiltrada.length} times</span>
                <span>•</span>
                <span>
                  {classificacaoFiltrada.reduce((acc, item) => acc + item.jogos, 0)} jogos
                </span>
              </div>
            </div>
            <TabelaClassificacao
              classificacao={classificacaoFiltrada}
              temporada={campeonato.temporada}
            />
          </div>
        )}
      </div>

      {/* Rodapé com Informações */}
      <div className="bg-[#272731] border border-gray-700  p-6 ">
        <div className="flex items-start gap-3">
          <Trophy className="w-6 h-6 text-gray-300 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-300  mb-2">Critérios de Classificação</h3>
            <div className="text-sm text-gray-300  space-y-1">
              <p><strong>1º critério:</strong> Maior número de pontos</p>
              <p><strong>2º critério:</strong> Melhor saldo de pontos</p>
              <p><strong>3º critério:</strong> Maior número de pontos marcados</p>
              <p><strong>4º critério:</strong> Confronto direto (quando aplicável)</p>
            </div>
            <div className="mt-3 pt-3 border-t border-blue-200 text-xs text-gray-300">
              <p><strong>Última atualização:</strong> {new Date().toLocaleString('pt-BR')}</p>
              <p><strong>Próximo recálculo automático:</strong> Após o próximo jogo finalizado</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}