"use client"

import React, { useState, useMemo } from 'react'
import { HeaderGeneral } from '@/components/HeaderGeneral'
import { Estatisticas, Jogador, Time } from '@/types'
import { useTimes } from '@/hooks/useTimes'
import { useJogadores } from '@/hooks/useJogadores'
import { Loading } from '@/components/ui/Loading'
import { 
    Users, 
    TrendingUp, 
    Trophy, 
    MapPin, 
    Activity, 
    Target,
    BarChart3,
    Globe,
    Ruler,
    Weight,
    Calendar,
    ChevronRight,
    PieChart,
    Award,
    Flag
} from 'lucide-react'

interface Relatorio {
    id: string
    titulo: string
    descricao: string
    icone: React.ElementType
    categoria: 'jogadores' | 'times' | 'estatisticas'
    executar: (times: Time[], jogadores: Jogador[]) => any
}

export default function DashboardPage() {
    const [temporada, setTemporada] = useState("2025")
    const [filtroAtivo, setFiltroAtivo] = useState<string | null>(null)
    const [resultados, setResultados] = useState<any>(null)
    const [categoriaAtiva, setCategoriaAtiva] = useState<'todos' | 'jogadores' | 'times' | 'estatisticas'>('todos')

    const {
        data: times = [],
        isLoading: loadingTimes,
        error: errorTimes
    } = useTimes(temporada)

    const {
        data: jogadores = [],
        isLoading: loadingJogadores,
        error: errorJogadores
    } = useJogadores(temporada)

    const loading = loadingTimes || loadingJogadores

    const relatorios: Relatorio[] = [
        {
            id: "jogadores-nacionalidade",
            titulo: "Jogadores por Nacionalidade",
            descricao: "Distribuição de jogadores por país de origem",
            icone: Globe,
            categoria: 'jogadores',
            executar: (times, jogadores) => {
                const nacionalidades: { [key: string]: number } = {}
                jogadores.forEach(jogador => {
                    if (jogador.nacionalidade) {
                        nacionalidades[jogador.nacionalidade] = (nacionalidades[jogador.nacionalidade] || 0) + 1
                    }
                })
                return {
                    tipo: 'tabela',
                    cabecalho: ['Nacionalidade', 'Quantidade', 'Porcentagem'],
                    dados: Object.entries(nacionalidades)
                        .sort((a, b) => b[1] - a[1])
                        .map(([nacionalidade, quantidade]) => [
                            nacionalidade, 
                            quantidade,
                            `${((quantidade / jogadores.length) * 100).toFixed(1)}%`
                        ]),
                    resumo: `Total de ${jogadores.length} jogadores distribuídos em ${Object.keys(nacionalidades).length} nacionalidades diferentes.`
                }
            }
        },
        {
            id: "jogadores-posicao-setor",
            titulo: "Jogadores por Posição e Setor",
            descricao: "Distribuição de posições dentro de cada setor",
            icone: Target,
            categoria: 'jogadores',
            executar: (times, jogadores) => {
                const posicoes: { [key: string]: { [key: string]: number } } = {
                    "Ataque": {},
                    "Defesa": {},
                    "Special": {}
                }

                jogadores.forEach(jogador => {
                    if (jogador.posicao && jogador.setor) {
                        // Normalizar o setor (primeira letra maiúscula, resto minúscula, sem espaços)
                        const setorNormalizado = jogador.setor.trim().charAt(0).toUpperCase() + jogador.setor.trim().slice(1).toLowerCase()
                        
                        if (!posicoes[setorNormalizado]) {
                            posicoes[setorNormalizado] = {}
                        }
                        posicoes[setorNormalizado][jogador.posicao] = (posicoes[setorNormalizado][jogador.posicao] || 0) + 1
                    }
                })

                return {
                    tipo: 'tabela-agrupada',
                    grupos: Object.keys(posicoes),
                    dados: Object.entries(posicoes).map(([setor, pos]) => ({
                        nome: setor,
                        itens: Object.entries(pos)
                            .sort((a, b) => b[1] - a[1])
                            .map(([posicao, quantidade]) => ({ nome: posicao, valor: quantidade }))
                    }))
                }
            }
        },
        {
            id: "idade-media",
            titulo: "Idade Média por Time",
            descricao: "Análise etária dos elencos",
            icone: Calendar,
            categoria: 'times',
            executar: (times, jogadores) => {
                const idadesPorTime: { [key: string]: { total: number, quantidade: number } } = {}

                jogadores.forEach(jogador => {
                    if (jogador.idade && jogador.timeId) {
                        const time = times.find(t => t.id === jogador.timeId)
                        if (time && time.nome) {
                            if (!idadesPorTime[time.nome]) {
                                idadesPorTime[time.nome] = { total: 0, quantidade: 0 }
                            }
                            idadesPorTime[time.nome].total += jogador.idade
                            idadesPorTime[time.nome].quantidade += 1
                        }
                    }
                })

                const idadeGeral = { total: 0, quantidade: 0 }

                const resultado = Object.entries(idadesPorTime).map(([time, dados]) => {
                    idadeGeral.total += dados.total
                    idadeGeral.quantidade += dados.quantidade
                    return [
                        time,
                        (dados.total / dados.quantidade).toFixed(1),
                        dados.quantidade
                    ]
                }).sort((a, b) => parseFloat(b[1] as string) - parseFloat(a[1] as string))

                return {
                    tipo: 'tabela',
                    cabecalho: ['Time', 'Idade Média', 'Nº de Jogadores'],
                    dados: resultado,
                    resumo: `Idade média geral do campeonato: ${(idadeGeral.total / idadeGeral.quantidade).toFixed(1)} anos`
                }
            }
        },
        {
            id: "altura-peso-medio",
            titulo: "Biometria por Posição",
            descricao: "Altura e peso médio dos jogadores",
            icone: Ruler,
            categoria: 'estatisticas',
            executar: (times, jogadores) => {
                const posicoes: { [key: string]: { altura: number, peso: number, quantidade: number } } = {}

                jogadores.forEach(jogador => {
                    if (jogador.posicao && jogador.altura && jogador.peso) {
                        if (!posicoes[jogador.posicao]) {
                            posicoes[jogador.posicao] = { altura: 0, peso: 0, quantidade: 0 }
                        }
                        posicoes[jogador.posicao].altura += jogador.altura
                        posicoes[jogador.posicao].peso += jogador.peso
                        posicoes[jogador.posicao].quantidade += 1
                    }
                })

                return {
                    tipo: 'tabela',
                    cabecalho: ['Posição', 'Altura Média (m)', 'Peso Médio (kg)', 'Quantidade'],
                    dados: Object.entries(posicoes)
                        .filter(([_, dados]) => dados.quantidade > 0)
                        .map(([posicao, dados]) => [
                            posicao,
                            (dados.altura / dados.quantidade).toFixed(2),
                            (dados.peso / dados.quantidade).toFixed(1),
                            dados.quantidade
                        ])
                        .sort((a, b) => parseFloat(b[1] as string) - parseFloat(a[1] as string))
                }
            }
        },
        {
            id: "estatisticas-jogadores",
            titulo: "Top 10 Jogadores",
            descricao: "Melhores jogadores em cada categoria estatística",
            icone: Award,
            categoria: 'estatisticas',
            executar: (times, jogadores) => {
                type CategoriaValida = keyof Estatisticas

                const isValidCategory = (grupo: string): grupo is CategoriaValida => {
                    return ['passe', 'corrida', 'recepcao', 'retorno', 'defesa', 'kicker', 'punter'].includes(grupo)
                }

                const getEstatistica = (jogador: Jogador, grupo: string, campo: string) => {
                    if (!jogador.estatisticas) return 0
                    if (!isValidCategory(grupo)) return 0
                    const stats = jogador.estatisticas[grupo]
                    if (!stats || typeof stats !== 'object') return 0
                    return (stats as any)[campo] || 0
                }

                const categorias = [
                    { grupo: 'passe' as CategoriaValida, campo: 'jardas_de_passe', titulo: 'Jardas de Passe' },
                    { grupo: 'passe' as CategoriaValida, campo: 'td_passados', titulo: 'Touchdowns Passados' },
                    { grupo: 'corrida' as CategoriaValida, campo: 'jardas_corridas', titulo: 'Jardas Corridas' },
                    { grupo: 'corrida' as CategoriaValida, campo: 'tds_corridos', titulo: 'Touchdowns Corridos' },
                    { grupo: 'recepcao' as CategoriaValida, campo: 'recepcoes', titulo: 'Recepções' },
                    { grupo: 'recepcao' as CategoriaValida, campo: 'jardas_recebidas', titulo: 'Jardas Recebidas' },
                    { grupo: 'defesa' as CategoriaValida, campo: 'tackles_totais', titulo: 'Tackles Totais' },
                    { grupo: 'defesa' as CategoriaValida, campo: 'sacks_forcado', titulo: 'Sacks' }
                ]

                const resultados = categorias.map(categoria => {
                    const top10 = jogadores
                        .filter(j => getEstatistica(j, categoria.grupo, categoria.campo) > 0)
                        .sort((a, b) =>
                            getEstatistica(b, categoria.grupo, categoria.campo) -
                            getEstatistica(a, categoria.grupo, categoria.campo)
                        )
                        .slice(0, 10)
                        .map(j => {
                            const time = times.find(t => t.id === j.timeId)
                            return {
                                jogador: j.nome,
                                time: time?.sigla || 'N/A',
                                valor: getEstatistica(j, categoria.grupo, categoria.campo)
                            }
                        })

                    return {
                        categoria: categoria.titulo,
                        jogadores: top10
                    }
                })

                return {
                    tipo: 'multi-tabela',
                    tabelas: resultados.map(r => ({
                        titulo: `Top 10 - ${r.categoria}`,
                        cabecalho: ['Jogador', 'Time', 'Valor'],
                        dados: r.jogadores.map(j => [j.jogador, j.time, j.valor])
                    }))
                }
            }
        },
        {
            id: "jogadores-por-cidade",
            titulo: "Distribuição por Cidade",
            descricao: "Jogadores por cidade de origem",
            icone: MapPin,
            categoria: 'jogadores',
            executar: (times, jogadores) => {
                const cidadesCount: { [key: string]: number } = {}

                jogadores.forEach(jogador => {
                    if (jogador.cidade) {
                        cidadesCount[jogador.cidade] = (cidadesCount[jogador.cidade] || 0) + 1
                    }
                })

                const total = Object.values(cidadesCount).reduce((acc, val) => acc + val, 0)

                return {
                    tipo: 'tabela',
                    cabecalho: ['Cidade/Estado', 'Quantidade', 'Porcentagem'],
                    dados: Object.entries(cidadesCount)
                        .sort((a, b) => b[1] - a[1])
                        .map(([cidade, quantidade]) => [
                            cidade,
                            quantidade,
                            `${((quantidade / total) * 100).toFixed(1)}%`
                        ]),
                    resumo: `${total} jogadores distribuídos em ${Object.keys(cidadesCount).length} cidades diferentes.`
                }
            }
        }
    ]

    const relatoriosFiltrados = useMemo(() => {
        if (categoriaAtiva === 'todos') return relatorios
        return relatorios.filter(r => r.categoria === categoriaAtiva)
    }, [categoriaAtiva, relatorios])

    const estatisticasGerais = useMemo(() => {
        if (!times.length || !jogadores.length) return null

        const jogadoresBrasileiros = jogadores.filter(j => 
            j.nacionalidade && j.nacionalidade.toLowerCase().includes('brasil')
        ).length
        const jogadoresEstrangeiros = jogadores.length - jogadoresBrasileiros
        const mediaJogadoresPorTime = Math.round(jogadores.length / times.length)
        
        const idades = jogadores.filter(j => j.idade).map(j => j.idade!)
        const idadeMedia = idades.length > 0 
            ? (idades.reduce((a, b) => a + b, 0) / idades.length).toFixed(1)
            : '0'

        const setoresCount = {
            Ataque: 0,
            Defesa: 0,
            Special: 0
        }

        jogadores.forEach(jogador => {
            if (jogador.setor) {
                // Normalizar o setor (primeira letra maiúscula, resto minúscula, sem espaços)
                const setorNormalizado = jogador.setor.trim().charAt(0).toUpperCase() + jogador.setor.trim().slice(1).toLowerCase()
                
                if (setorNormalizado === 'Ataque') {
                    setoresCount.Ataque++
                } else if (setorNormalizado === 'Defesa') {
                    setoresCount.Defesa++
                } else if (setorNormalizado === 'Special') {
                    setoresCount.Special++
                }
            }
        })

        return {
            totalTimes: times.length,
            totalJogadores: jogadores.length,
            mediaJogadoresPorTime,
            jogadoresBrasileiros,
            jogadoresEstrangeiros,
            porcentagemBrasileiros: ((jogadoresBrasileiros / jogadores.length) * 100).toFixed(1),
            idadeMedia,
            setoresCount
        }
    }, [times, jogadores])

    const executarRelatorio = (id: string) => {
        const relatorio = relatorios.find(r => r.id === id)
        if (relatorio) {
            const resultado = relatorio.executar(times, jogadores)
            setResultados(resultado)
            setFiltroAtivo(id)
        }
    }

    const renderizarResultados = () => {
        if (!resultados) return null

        switch (resultados.tipo) {
            case 'tabela':
                return (
                    <div className="bg-[#272731] rounded-lg border border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-[#1C1C24]">
                                    <tr>
                                        {resultados.cabecalho.map((header: string, index: number) => (
                                            <th 
                                                key={index} 
                                                className="px-6 py-4 text-left text-xs font-bold text-[#63E300] uppercase tracking-wider"
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {resultados.dados.map((row: any[], rowIndex: number) => (
                                        <tr 
                                            key={rowIndex} 
                                            className={rowIndex % 2 === 0 ? "bg-[#272731]" : "bg-[#1C1C24]"}
                                        >
                                            {row.map((cell, cellIndex) => (
                                                <td 
                                                    key={cellIndex} 
                                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-300"
                                                >
                                                    {cell}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {resultados.resumo && (
                            <div className="mt-4 p-4 bg-[#1C1C24] border-t border-gray-700">
                                <p className="text-gray-300 text-sm flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-[#63E300]" />
                                    {resultados.resumo}
                                </p>
                            </div>
                        )}
                    </div>
                )

            case 'tabela-agrupada':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {resultados.dados.map((grupo: any, index: number) => (
                            <div key={index} className="bg-[#272731] rounded-lg border border-gray-700 overflow-hidden">
                                <div className="bg-[#1C1C24] px-6 py-4 border-b border-gray-700">
                                    <h3 className="text-lg font-bold text-[#63E300]">{grupo.nome}</h3>
                                </div>
                                <div className="p-4">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-700">
                                                <th className="text-left py-2 text-xs font-bold text-gray-400 uppercase">Posição</th>
                                                <th className="text-right py-2 text-xs font-bold text-gray-400 uppercase">Qtd</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {grupo.itens.map((item: any, itemIndex: number) => (
                                                <tr 
                                                    key={itemIndex} 
                                                    className={itemIndex % 2 === 0 ? "bg-[#272731]" : "bg-[#1C1C24]"}
                                                >
                                                    <td className="py-2 text-sm text-gray-300">{item.nome}</td>
                                                    <td className="py-2 text-sm text-gray-300 text-right font-semibold">
                                                        {item.valor}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                )

            case 'multi-tabela':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {resultados.tabelas.map((tabela: any, index: number) => (
                            <div key={index} className="bg-[#272731] rounded-lg border border-gray-700 overflow-hidden">
                                <div className="bg-[#1C1C24] px-6 py-4 border-b border-gray-700">
                                    <h3 className="text-lg font-bold text-[#63E300] flex items-center gap-2">
                                        <Trophy className="w-5 h-5" />
                                        {tabela.titulo}
                                    </h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead className="bg-[#1C1C24]">
                                            <tr>
                                                {tabela.cabecalho.map((header: string, headerIndex: number) => (
                                                    <th 
                                                        key={headerIndex} 
                                                        className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase"
                                                    >
                                                        {header}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tabela.dados.map((row: any[], rowIndex: number) => (
                                                <tr 
                                                    key={rowIndex} 
                                                    className={rowIndex % 2 === 0 ? "bg-[#272731]" : "bg-[#1C1C24]"}
                                                >
                                                    {row.map((cell, cellIndex) => (
                                                        <td 
                                                            key={cellIndex} 
                                                            className="px-4 py-3 text-sm text-gray-300"
                                                        >
                                                            {cell}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                )

            default:
                return (
                    <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
                        <pre className="text-white text-sm overflow-x-auto whitespace-pre-wrap">
                            {JSON.stringify(resultados, null, 2)}
                        </pre>
                    </div>
                )
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#1C1C24] p-6 flex justify-center items-center">
                <Loading />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#1C1C24]">
            <HeaderGeneral label='DASHBOARD' />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                
                {/* Header com descrição */}
                <div className="bg-gradient-to-r from-[#272731] to-[#1C1C24] rounded-xl border border-gray-700 p-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-[#63E300]/10 rounded-lg">
                            <BarChart3 className="w-8 h-8 text-[#63E300]" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-white mb-2">
                                Dashboard de Análise
                            </h1>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Explore relatórios e insights detalhados sobre times e jogadores do campeonato. 
                                Selecione um dos relatórios abaixo para visualizar análises aprofundadas.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Cards de estatísticas gerais */}
                {estatisticasGerais && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-[#272731] rounded-xl border border-gray-700 p-6 hover:border-[#63E300] transition-colors">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <Trophy className="w-6 h-6 text-blue-500" />
                                </div>
                                <span className="text-xs font-semibold text-gray-400 uppercase">Times</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-3xl font-bold text-white">
                                    {estatisticasGerais.totalTimes}
                                </p>
                                <p className="text-sm text-gray-400">
                                    Total de times
                                </p>
                            </div>
                        </div>

                        <div className="bg-[#272731] rounded-xl border border-gray-700 p-6 hover:border-[#63E300] transition-colors">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 bg-[#63E300]/10 rounded-lg">
                                    <Users className="w-6 h-6 text-[#63E300]" />
                                </div>
                                <span className="text-xs font-semibold text-gray-400 uppercase">Jogadores</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-3xl font-bold text-white">
                                    {estatisticasGerais.totalJogadores}
                                </p>
                                <p className="text-sm text-gray-400">
                                    Total de jogadores
                                </p>
                            </div>
                        </div>

                        <div className="bg-[#272731] rounded-xl border border-gray-700 p-6 hover:border-[#63E300] transition-colors">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 bg-purple-500/10 rounded-lg">
                                    <TrendingUp className="w-6 h-6 text-purple-500" />
                                </div>
                                <span className="text-xs font-semibold text-gray-400 uppercase">Média</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-3xl font-bold text-white">
                                    {estatisticasGerais.mediaJogadoresPorTime}
                                </p>
                                <p className="text-sm text-gray-400">
                                    Jogadores por time
                                </p>
                            </div>
                        </div>

                        <div className="bg-[#272731] rounded-xl border border-gray-700 p-6 hover:border-[#63E300] transition-colors">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 bg-orange-500/10 rounded-lg">
                                    <Calendar className="w-6 h-6 text-orange-500" />
                                </div>
                                <span className="text-xs font-semibold text-gray-400 uppercase">Idade</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-3xl font-bold text-white">
                                    {estatisticasGerais.idadeMedia}
                                </p>
                                <p className="text-sm text-gray-400">
                                    Idade média (anos)
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Cards adicionais de insights */}
                {estatisticasGerais && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-[#272731] rounded-xl border border-gray-700 p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Globe className="w-5 h-5 text-[#63E300]" />
                                Distribuição Nacional
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-[#1C1C24] rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Flag className="w-5 h-5 text-green-500" />
                                        <span className="text-gray-300">Jogadores Brasileiros</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-white">
                                            {estatisticasGerais.jogadoresBrasileiros}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {estatisticasGerais.porcentagemBrasileiros}%
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-[#1C1C24] rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Globe className="w-5 h-5 text-blue-500" />
                                        <span className="text-gray-300">Jogadores Estrangeiros</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-white">
                                            {estatisticasGerais.jogadoresEstrangeiros}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {(100 - parseFloat(estatisticasGerais.porcentagemBrasileiros)).toFixed(1)}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#272731] rounded-xl border border-gray-700 p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Target className="w-5 h-5 text-[#63E300]" />
                                Distribuição por Setor
                            </h3>
                            <div className="space-y-4">
                                {Object.entries(estatisticasGerais.setoresCount).map(([setor, quantidade]) => {
                                    const porcentagem = ((quantidade / estatisticasGerais.totalJogadores) * 100).toFixed(1)
                                    const cores = {
                                        Ataque: 'bg-red-500',
                                        Defesa: 'bg-blue-500',
                                        Special: 'bg-yellow-500'
                                    }
                                    return (
                                        <div key={setor} className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-300 font-medium">{setor}</span>
                                                <span className="text-gray-400">{quantidade} ({porcentagem}%)</span>
                                            </div>
                                            <div className="w-full bg-[#1C1C24] rounded-full h-2">
                                                <div 
                                                    className={`${cores[setor as keyof typeof cores]} h-2 rounded-full transition-all duration-500`}
                                                    style={{ width: `${porcentagem}%` }}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Filtros de categoria */}
                <div className="bg-[#272731] rounded-xl border border-gray-700 p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <PieChart className="w-5 h-5 text-[#63E300]" />
                        Categorias de Relatórios
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {[
                            { id: 'todos', label: 'Todos', icon: BarChart3 },
                            { id: 'jogadores', label: 'Jogadores', icon: Users },
                            { id: 'times', label: 'Times', icon: Trophy },
                            { id: 'estatisticas', label: 'Estatísticas', icon: Activity }
                        ].map((categoria) => {
                            const Icon = categoria.icon
                            return (
                                <button
                                    key={categoria.id}
                                    onClick={() => {
                                        setCategoriaAtiva(categoria.id as any)
                                        setFiltroAtivo(null)
                                        setResultados(null)
                                    }}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                                        categoriaAtiva === categoria.id
                                            ? 'bg-[#63E300] text-black'
                                            : 'bg-[#1C1C24] text-gray-300 hover:bg-[#63E300]/10 hover:text-[#63E300]'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {categoria.label}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Grid de relatórios */}
                <div className="bg-[#272731] rounded-xl border border-gray-700 p-6">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-[#63E300]" />
                        Relatórios Disponíveis
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {relatoriosFiltrados.map((relatorio) => {
                            const Icon = relatorio.icone
                            const isActive = filtroAtivo === relatorio.id
                            return (
                                <button
                                    key={relatorio.id}
                                    onClick={() => executarRelatorio(relatorio.id)}
                                    className={`group relative p-5 rounded-xl border-2 transition-all duration-300 text-left ${
                                        isActive
                                            ? 'bg-[#63E300] border-[#63E300] shadow-lg shadow-[#63E300]/20'
                                            : 'bg-[#1C1C24] border-gray-700 hover:border-[#63E300] hover:shadow-lg hover:shadow-[#63E300]/10'
                                    }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-lg transition-colors ${
                                            isActive 
                                                ? 'bg-black/10' 
                                                : 'bg-[#63E300]/10 group-hover:bg-[#63E300]/20'
                                        }`}>
                                            <Icon className={`w-6 h-6 ${
                                                isActive ? 'text-black' : 'text-[#63E300]'
                                            }`} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className={`font-bold mb-1 ${
                                                isActive ? 'text-black' : 'text-white'
                                            }`}>
                                                {relatorio.titulo}
                                            </h4>
                                            <p className={`text-sm ${
                                                isActive ? 'text-black/80' : 'text-gray-400'
                                            }`}>
                                                {relatorio.descricao}
                                            </p>
                                        </div>
                                        <ChevronRight className={`w-5 h-5 transition-transform ${
                                            isActive 
                                                ? 'text-black transform translate-x-1' 
                                                : 'text-gray-600 group-hover:text-[#63E300] group-hover:transform group-hover:translate-x-1'
                                        }`} />
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Resultados */}
                {filtroAtivo && resultados && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between bg-[#272731] rounded-xl border border-gray-700 p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#63E300]/10 rounded-lg">
                                    <BarChart3 className="w-5 h-5 text-[#63E300]" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">
                                        {relatorios.find(r => r.id === filtroAtivo)?.titulo}
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        Resultados da análise
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setFiltroAtivo(null)
                                    setResultados(null)
                                }}
                                className="px-4 py-2 bg-[#1C1C24] text-gray-300 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors"
                            >
                                Fechar
                            </button>
                        </div>
                        {renderizarResultados()}
                    </div>
                )}
            </div>
        </div>
    )
}