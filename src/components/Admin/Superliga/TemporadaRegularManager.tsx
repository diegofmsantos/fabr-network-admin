"use client"

import React, { useState } from 'react'
import { Calendar, Play, Pause, CheckCircle, Clock, AlertTriangle, Users, Eye, Edit } from 'lucide-react'
import { Loading } from '@/components/ui/Loading'
import Image from 'next/image'
import { ImageService } from '@/utils/services/ImageService'
import { useJogos, useUpdateJogo } from '@/hooks/useJogos'
import { useGerarJogosTemporadaRegular } from '@/hooks/useSuperliga'

interface TemporadaRegularManagerProps {
    superligaId: number
    temporada: string
}

type FilterStatus = 'todos' | 'AGENDADO' | 'AO_VIVO' | 'FINALIZADO' | 'ADIADO'
type ViewMode = 'rodadas' | 'calendario' | 'tabela'

export const TemporadaRegularManager: React.FC<TemporadaRegularManagerProps> = ({
    superligaId,
    temporada
}) => {
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('todos')
    const [filterRodada, setFilterRodada] = useState<number | 'todas'>('todas')
    const [viewMode, setViewMode] = useState<ViewMode>('rodadas')
    const [showModal, setShowModal] = useState(false)

    const { data: jogos = [], isLoading } = useJogos({ campeonatoId: superligaId })
    const { mutate: gerarJogos, isPending: gerandoJogos } = useGerarJogosTemporadaRegular()
    const { mutate: updateJogo } = useUpdateJogo()

    // Filtrar jogos
    const jogosFiltrados = jogos.filter(jogo => {
        const statusMatch = filterStatus === 'todos' || jogo.status === filterStatus
        const rodadaMatch = filterRodada === 'todas' || jogo.rodada === filterRodada
        return statusMatch && rodadaMatch
    })

    // Estatísticas
    const estatisticas = {
        total: jogos.length,
        agendados: jogos.filter(j => j.status === 'AGENDADO').length,
        aoVivo: jogos.filter(j => j.status === 'AO_VIVO').length,
        finalizados: jogos.filter(j => j.status === 'FINALIZADO').length,
        adiados: jogos.filter(j => j.status === 'ADIADO').length,
    }

    // Rodadas disponíveis
    const rodadas = [...new Set(jogos.map(j => j.rodada))].sort((a, b) => a - b)

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'AGENDADO': return <Clock className="w-4 h-4" />
            case 'AO_VIVO': return <Play className="w-4 h-4" />
            case 'FINALIZADO': return <CheckCircle className="w-4 h-4" />
            case 'ADIADO': return <Pause className="w-4 h-4" />
            default: return <AlertTriangle className="w-4 h-4" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'AGENDADO': return 'bg-blue-500'
            case 'AO_VIVO': return 'bg-red-500'
            case 'FINALIZADO': return 'bg-green-500'
            case 'ADIADO': return 'bg-yellow-500'
            default: return 'bg-gray-500'
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'AGENDADO': return 'Agendado'
            case 'AO_VIVO': return 'Ao Vivo'
            case 'FINALIZADO': return 'Finalizado'
            case 'ADIADO': return 'Adiado'
            default: return status
        }
    }

    const JogoCard = ({ jogo }: { jogo: any }) => (
        <div className="bg-[#272731] rounded-lg border border-gray-700 p-4 hover:border-[#63E300] transition-colors">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Rodada {jogo.rodada}</span>
                    <span className={`px-2 py-1 rounded-full text-xs text-white flex items-center gap-1 ${getStatusColor(jogo.status)}`}>
                        {getStatusIcon(jogo.status)}
                        {getStatusText(jogo.status)}
                    </span>
                </div>

                <div className="flex items-center gap-1">
                    <button className="p-1 text-gray-400 hover:text-white transition-colors">
                        <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-white transition-colors">
                        <Edit className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Confronto */}
            <div className="flex items-center justify-between mb-3">
                {/* Time Casa */}
                <div className="flex items-center gap-3 flex-1">
                    <Image
                        src={ImageService.getTeamLogo(jogo.timeCasa.nome)}
                        alt={`Logo ${jogo.timeCasa.nome}`}
                        width={32}
                        height={32}
                        className="rounded"
                        onError={(e) => ImageService.handleTeamLogoError(e, jogo.timeCasa.nome)}
                    />
                    <div className="min-w-0 flex-1">
                        <div className="text-white font-medium truncate">{jogo.timeCasa.nome}</div>
                        <div className="text-gray-400 text-sm">{jogo.timeCasa.sigla}</div>
                    </div>
                    {jogo.status === 'FINALIZADO' && (
                        <div className={`text-lg font-bold ${(jogo.placarCasa || 0) > (jogo.placarVisitante || 0) ? 'text-green-400' : 'text-gray-400'
                            }`}>
                            {jogo.placarCasa || 0}
                        </div>
                    )}
                </div>

                {/* VS */}
                <div className="px-4">
                    <span className="text-gray-500 font-bold">×</span>
                </div>

                {/* Time Visitante */}
                <div className="flex items-center gap-3 flex-1 flex-row-reverse">
                    <Image
                        src={ImageService.getTeamLogo(jogo.timeVisitante.nome)}
                        alt={`Logo ${jogo.timeVisitante.nome}`}
                        width={32}
                        height={32}
                        className="rounded"
                        onError={(e) => ImageService.handleTeamLogoError(e, jogo.timeVisitante.nome)}
                    />
                    <div className="min-w-0 flex-1 text-right">
                        <div className="text-white font-medium truncate">{jogo.timeVisitante.nome}</div>
                        <div className="text-gray-400 text-sm">{jogo.timeVisitante.sigla}</div>
                    </div>
                    {jogo.status === 'FINALIZADO' && (
                        <div className={`text-lg font-bold ${(jogo.placarVisitante || 0) > (jogo.placarCasa || 0) ? 'text-green-400' : 'text-gray-400'
                            }`}>
                            {jogo.placarVisitante || 0}
                        </div>
                    )}
                </div>
            </div>

            {/* Informações do Jogo */}
            <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(jogo.dataJogo).toLocaleDateString('pt-BR')}
                    </div>
                    {jogo.local && (
                        <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {jogo.local}
                        </div>
                    )}
                </div>

                {jogo.grupo && (
                    <span className="text-xs bg-gray-600 px-2 py-1 rounded">
                        {jogo.grupo.nome}
                    </span>
                )}
            </div>
        </div>
    )

    const renderRodadas = () => {
        const jogosPorRodada = rodadas.map(rodada => ({
            rodada,
            jogos: jogosFiltrados.filter(j => j.rodada === rodada)
        }))

        return (
            <div className="space-y-6">
                {jogosPorRodada.map(({ rodada, jogos: jogosRodada }) => (
                    <div key={rodada} className="bg-[#272731] rounded-lg border border-gray-700 overflow-hidden">
                        <div className="bg-[#1C1C24] px-6 py-4 border-b border-gray-600">
                            <div className="flex items-center justify-between">
                                <h3 className="text-white font-semibold">Rodada {rodada}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <span>{jogosRodada.length} jogos</span>
                                    <span>•</span>
                                    <span>{jogosRodada.filter(j => j.status === 'FINALIZADO').length} finalizados</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            {jogosRodada.length > 0 ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {jogosRodada.map(jogo => (
                                        <JogoCard key={jogo.id} jogo={jogo} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <Calendar className="w-12 h-12 mx-auto mb-3" />
                                    <p>Nenhum jogo nesta rodada</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    const renderCalendario = () => (
        <div className="bg-[#272731] rounded-lg border border-gray-700 p-6 text-center">
            <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Visão de Calendário</h3>
            <p className="text-gray-400 mb-4">Visualização por calendário em desenvolvimento</p>
            <button className="bg-[#63E300] text-black px-4 py-2 rounded-md font-medium hover:bg-[#50B800] transition-colors">
                Em breve
            </button>
        </div>
    )

    const renderTabela = () => (
        <div className="bg-[#272731] rounded-lg border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-[#1C1C24]">
                        <tr>
                            <th className="text-left p-4 text-gray-300 font-medium">Jogo</th>
                            <th className="text-left p-4 text-gray-300 font-medium">Rodada</th>
                            <th className="text-left p-4 text-gray-300 font-medium">Data</th>
                            <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                            <th className="text-left p-4 text-gray-300 font-medium">Resultado</th>
                            <th className="text-left p-4 text-gray-300 font-medium">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jogosFiltrados.map((jogo, index) => (
                            <tr key={jogo.id} className={index % 2 === 0 ? 'bg-[#272731]' : 'bg-[#1C1C24]'}>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2">
                                            <Image
                                                src={ImageService.getTeamLogo(jogo.timeCasa.nome)}
                                                alt={`Logo ${jogo.timeCasa.nome}`}
                                                width={24}
                                                height={24}
                                                className="rounded"
                                                onError={(e) => ImageService.handleTeamLogoError(e, jogo.timeCasa.nome)}
                                            />
                                            <span className="text-white text-sm">{jogo.timeCasa.sigla}</span>
                                        </div>
                                        <span className="text-gray-500">×</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-white text-sm">{jogo.timeVisitante.sigla}</span>
                                            <Image
                                                src={ImageService.getTeamLogo(jogo.timeVisitante.nome)}
                                                alt={`Logo ${jogo.timeVisitante.nome}`}
                                                width={24}
                                                height={24}
                                                className="rounded"
                                                onError={(e) => ImageService.handleTeamLogoError(e, jogo.timeVisitante.nome)}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="text-white">{jogo.rodada}ª</span>
                                </td>
                                <td className="p-4">
                                    <span className="text-gray-300">
                                        {new Date(jogo.dataJogo).toLocaleDateString('pt-BR')}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs text-white flex items-center gap-1 w-fit ${getStatusColor(jogo.status)}`}>
                                        {getStatusIcon(jogo.status)}
                                        {getStatusText(jogo.status)}
                                    </span>
                                </td>
                                <td className="p-4">
                                    {jogo.status === 'FINALIZADO' ? (
                                        <span className="text-white font-medium">
                                            {jogo.placarCasa} × {jogo.placarVisitante}
                                        </span>
                                    ) : (
                                        <span className="text-gray-500">-</span>
                                    )}
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <button className="p-1 text-gray-400 hover:text-white transition-colors">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button className="p-1 text-gray-400 hover:text-white transition-colors">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className="space-y-6">
            {/* ... resto do JSX já existente ... */}

            {/* Conteúdo */}
            {jogos.length === 0 ? (
                <div className="bg-[#272731] rounded-lg border border-gray-700 p-12 text-center">
                    <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Nenhum jogo da temporada regular</h3>
                    <p className="text-gray-400 mb-6">
                        Gere os jogos da temporada regular para começar a gerenciar
                    </p>
                    <button
                        onClick={() => gerarJogos(superligaId)}
                        disabled={gerandoJogos}
                        className="bg-[#63E300] text-black px-6 py-2 rounded-md font-medium hover:bg-[#50B800] transition-colors disabled:opacity-50"
                    >
                        {gerandoJogos ? 'Gerando Jogos...' : 'Gerar Jogos da Temporada Regular'}
                    </button>
                </div>
            ) : (
                <>
                    {viewMode === 'rodadas' && renderRodadas()}
                    {viewMode === 'calendario' && renderCalendario()}
                    {viewMode === 'tabela' && renderTabela()}
                </>
            )}

            {/* Progresso */}
            {jogos.length > 0 && (
                <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
                    <h3 className="text-white font-semibold mb-4">Progresso da Temporada Regular</h3>

                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-400">Jogos Finalizados</span>
                                <span className="text-white">{estatisticas.finalizados}/{estatisticas.total}</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                                <div
                                    className="bg-[#63E300] h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${(estatisticas.finalizados / estatisticas.total) * 100}%` }}
                                />
                            </div>
                        </div>

                        {estatisticas.finalizados === estatisticas.total && (
                            <div className="bg-green-500 bg-opacity-10 border border-green-500 border-opacity-30 rounded-lg p-4">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    <span className="text-green-400 font-medium">Temporada Regular Concluída!</span>
                                </div>
                                <p className="text-green-300 text-sm mt-1">
                                    Todos os jogos foram finalizados. Agora você pode gerar os playoffs.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}