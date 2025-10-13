"use client"

import { useState, useMemo } from "react"
import { useEstatisticasJogo, useUpdateEstatisticaJogo } from "@/hooks/useEstatisticasJogo"
import { Estatisticas, EstatisticaJogo, Jogador } from "@/types"
import { X, Edit, Save, Calendar, Users, TrendingUp } from "lucide-react"
import { Loading } from "@/components/ui/Loading"

interface ModalEstatisticasJogoProps {
    jogador: Jogador
    closeModal: () => void
}

interface EditingStats {
    [key: string]: Estatisticas
}

export default function ModalEstatisticasJogo({ jogador, closeModal }: ModalEstatisticasJogoProps) {
    const temporada = jogador.times?.[0]?.temporada || "2025"

    const { data: estatisticasJogo, isLoading, error } = useEstatisticasJogo(jogador.id!, temporada)
    const updateEstatisticaMutation = useUpdateEstatisticaJogo()

    const [editingStats, setEditingStats] = useState<EditingStats>({})
    const [editingId, setEditingId] = useState<number | null>(null)

    // Filtrar apenas jogos finalizados para exibir
    const jogosFinalizados = useMemo(() => {
        if (!estatisticasJogo) return []
        return estatisticasJogo.filter((stat: EstatisticaJogo) => stat.jogo.status === 'FINALIZADO')
    }, [estatisticasJogo])

    const handleEdit = (estatistica: EstatisticaJogo) => {
        setEditingId(estatistica.id)
        setEditingStats({
            ...editingStats,
            [estatistica.id]: { ...estatistica.estatisticas }
        })
    }

    const handleCancel = () => {
        setEditingId(null)
        setEditingStats({})
    }

    const handleSave = async (estatisticaId: number) => {
        const estatisticasAtualizadas = editingStats[estatisticaId]

        if (!estatisticasAtualizadas) return

        try {
            await updateEstatisticaMutation.mutateAsync({
                id: estatisticaId,
                estatisticas: estatisticasAtualizadas
            })

            setEditingId(null)
            setEditingStats({})
        } catch (error) {
            console.error('Erro ao salvar:', error)
        }
    }

    const handleStatChange = (estatisticaId: number, category: keyof Estatisticas, field: string, value: string) => {
        setEditingStats(prev => ({
            ...prev,
            [estatisticaId]: {
                ...prev[estatisticaId],
                [category]: {
                    ...prev[estatisticaId]?.[category],
                    [field]: value === "" ? 0 : Number(value)
                }
            }
        }))
    }

    const renderStatInput = (estatisticaId: number, category: keyof Estatisticas, field: string, label: string, currentValue: any) => {
        const isEditing = editingId === estatisticaId
        const categoryStats = editingStats[estatisticaId]?.[category] as any
        const editValue = categoryStats?.[field] ?? currentValue

        if (isEditing) {
            return (
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 w-16">{label}:</span>
                    <input
                        type="number"
                        min="0"
                        value={editValue}
                        onChange={(e) => handleStatChange(estatisticaId, category, field, e.target.value)}
                        className="w-16 px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-white"
                    />
                </div>
            )
        }

        return (
            <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 w-16">{label}:</span>
                <span className="text-xs text-white font-semibold w-16">{currentValue || 0}</span>
            </div>
        )
    }

    const renderCategoryStats = (estatistica: EstatisticaJogo) => {
        const stats = editingId === estatistica.id ? editingStats[estatistica.id] : estatistica.estatisticas

        const categories = [
            {
                name: 'Passe',
                key: 'passe' as keyof Estatisticas,
                fields: [
                    { key: 'passes_completos', label: 'COMP' },
                    { key: 'passes_tentados', label: 'TENT' },
                    { key: 'jardas_de_passe', label: 'JDS' },
                    { key: 'td_passados', label: 'TD' },
                    { key: 'interceptacoes_sofridas', label: 'INT' },
                    { key: 'sacks_sofridos', label: 'SACK' },
                ]
            },
            {
                name: 'Corrida',
                key: 'corrida' as keyof Estatisticas,
                fields: [
                    { key: 'corridas', label: 'CARR' },
                    { key: 'jardas_corridas', label: 'JDS' },
                    { key: 'tds_corridos', label: 'TD' },
                    { key: 'fumble_de_corredor', label: 'FUM' },
                ]
            },
            {
                name: 'Recepção',
                key: 'recepcao' as keyof Estatisticas,
                fields: [
                    { key: 'recepcoes', label: 'REC' },
                    { key: 'alvo', label: 'ALVO' },
                    { key: 'jardas_recebidas', label: 'JDS' },
                    { key: 'tds_recebidos', label: 'TD' },
                ]
            },
            {
                name: 'Retorno',
                key: 'retorno' as keyof Estatisticas,
                fields: [
                    { key: 'retornos', label: 'RET' },
                    { key: 'jardas_retornadas', label: 'JDS' },
                    { key: 'td_retornados', label: 'TD' },
                ]
            },
            {
                name: 'Defesa',
                key: 'defesa' as keyof Estatisticas,
                fields: [
                    { key: 'tackles_totais', label: 'TCK' },
                    { key: 'tackles_for_loss', label: 'TFL' },
                    { key: 'sacks_forcado', label: 'SACK' },
                    { key: 'fumble_forcado', label: 'FF' },
                    { key: 'interceptacao_forcada', label: 'INT' },
                    { key: 'passe_desviado', label: 'PD' },
                    { key: 'safety', label: 'SAFE' },
                    { key: 'td_defensivo', label: 'TD' },
                ]
            },
            {
                name: 'Kicker',
                key: 'kicker' as keyof Estatisticas,
                fields: [
                    { key: 'fg_bons', label: 'FG' },
                    { key: 'tentativas_de_fg', label: 'TENT' },
                    { key: 'xp_bons', label: 'XP' },
                    { key: 'tentativas_de_xp', label: 'TENT XP' },
                    { key: 'fg_mais_longo', label: 'LONGO' },
                ]
            },
            {
                name: 'Punter',
                key: 'punter' as keyof Estatisticas,
                fields: [
                    { key: 'punts', label: 'PUNTS' },
                    { key: 'jardas_de_punt', label: 'JDS' },
                ]
            }
        ]

        return categories.map(category => {
            const categoryStats = stats?.[category.key]
            if (!categoryStats) return null


            return (
                <div key={category.key} className="bg-gray-800 rounded p-3">
                    <h5 className="text-sm font-bold text-[#63E300] mb-2">{category.name}</h5>
                    <div className="grid grid-cols-2 gap-2">
                        {category.fields.map(field => (
                            <div key={field.key}>
                                {renderStatInput(
                                    estatistica.id,
                                    category.key,
                                    field.key,
                                    field.label,
                                    (categoryStats as any)[field.key]
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )
        })
    }

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-[#272731] rounded-lg p-6">
                    <Loading />
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-[#272731] rounded-lg p-6 max-w-md">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white">Erro</h2>
                        <button onClick={closeModal} className="text-gray-400 hover:text-white">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <p className="text-red-400">Erro ao carregar estatísticas: {(error as Error).message}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#272731] rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="w-6 h-6 text-[#63E300]" />
                        <div>
                            <h2 className="text-xl font-bold text-white">Estatísticas por Jogo</h2>
                            <p className="text-sm text-gray-400">{jogador.nome} - Temporada {temporada}</p>
                        </div>
                    </div>
                    <button
                        onClick={closeModal}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    {jogosFinalizados.length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-400 mb-2">Nenhum jogo finalizado</h3>
                            <p className="text-gray-500">Este jogador ainda não possui estatísticas de jogos finalizados.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {jogosFinalizados.map((estatistica: EstatisticaJogo) => {
                                const jogo = estatistica.jogo
                                const isTimeCasa = jogo.timeCasaId === estatistica.timeId
                                const adversario = isTimeCasa ? jogo.timeVisitante : jogo.timeCasa
                                const placarTime = isTimeCasa ? jogo.placarCasa : jogo.placarVisitante
                                const placarAdversario = isTimeCasa ? jogo.placarVisitante : jogo.placarCasa
                                const venceu = placarTime! > placarAdversario!

                                return (
                                    <div key={estatistica.id} className="bg-[#1C1C24] rounded-lg border border-gray-700 p-6">
                                        {/* Game Header */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="text-center">
                                                    <div className="text-xs text-gray-400 mb-1">
                                                        {new Date(jogo.dataJogo).toLocaleDateString('pt-BR', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            timeZone: 'UTC'
                                                        })}
                                                    </div>
                                                    <div className="text-xs text-gray-500">R{jogo.rodada}</div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <Users className="w-4 h-4 text-gray-400" />
                                                    <span className="text-white font-semibold">vs {adversario?.nome}</span>
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${venceu ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                                                        }`}>
                                                        {placarTime} - {placarAdversario}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {editingId === estatistica.id ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleSave(estatistica.id)}
                                                            disabled={updateEstatisticaMutation.isPending}
                                                            className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors disabled:opacity-50"
                                                        >
                                                            <Save className="w-3 h-3" />
                                                            {updateEstatisticaMutation.isPending ? 'Salvando...' : 'Salvar'}
                                                        </button>
                                                        <button
                                                            onClick={handleCancel}
                                                            disabled={updateEstatisticaMutation.isPending}
                                                            className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded transition-colors disabled:opacity-50"
                                                        >
                                                            Cancelar
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => handleEdit(estatistica)}
                                                        className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
                                                    >
                                                        <Edit className="w-3 h-3" />
                                                        Editar
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Statistics */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {renderCategoryStats(estatistica)}
                                        </div>

                                        {/* Game Details */}
                                        <div className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-500">
                                            <div className="flex items-center gap-4">
                                                <span>{jogo.fase}</span>
                                                {jogo.local && <span>Local: {jogo.local}</span>}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-700 bg-[#1C1C24]">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-400">
                            {jogosFinalizados.length} jogo(s) finalizado(s) •
                            Estatísticas consolidadas são recalculadas automaticamente
                        </div>
                        <button
                            onClick={closeModal}
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}