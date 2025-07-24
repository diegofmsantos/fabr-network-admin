import { FilterRodada } from "@/app/admin/superliga/temporada-regular/page"
import { FilterStatus } from "@/types"
import { Filter } from "lucide-react"

interface TemporadaRegularFiltersProps {
    filterStatus: FilterStatus
    filterRodada: FilterRodada
    filterConferencia: string
    onStatusChange: (status: FilterStatus) => void
    onRodadaChange: (rodada: FilterRodada) => void
    onConferenciaChange: (conferencia: string) => void
    jogos: any[]
}

export function TemporadaRegularFilters({
    filterStatus,
    filterRodada,
    filterConferencia,
    onStatusChange,
    onRodadaChange,
    onConferenciaChange,
    jogos
}: TemporadaRegularFiltersProps) {
    const rodadasDisponiveis = [...new Set(jogos.map(jogo => jogo.rodada))].sort((a, b) => a - b)
    const conferenciasDisponiveis = [...new Set(jogos.map(jogo => (jogo as any).conferencia).filter(Boolean))]

    return (
        <div className="bg-[#272731] rounded-lg p-4 border border-gray-700 mb-6">
            <div className="flex items-center gap-4 mb-4">
                <Filter className="w-5 h-5 text-gray-400" />
                <h3 className="text-white font-semibold">Filtros</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Filtro de Status */}
                <div>
                    <label className="block text-gray-400 text-sm mb-2">Status</label>
                    <select
                        value={filterStatus}
                        onChange={(e) => onStatusChange(e.target.value as FilterStatus)}
                        className="w-full bg-[#1C1C24] text-white border border-gray-700 rounded-lg px-3 py-2 focus:border-[#63E300] focus:outline-none"
                    >
                        <option value="todos">Todos os Status</option>
                        <option value="AGENDADO">Agendado</option>
                        <option value="AO VIVO">Ao Vivo</option>
                        <option value="FINALIZADO">Finalizado</option>
                        <option value="ADIADO">Adiado</option>
                    </select>
                </div>

                {/* Filtro de Rodada */}
                <div>
                    <label className="block text-gray-400 text-sm mb-2">Rodada</label>
                    <select
                        value={filterRodada}
                        onChange={(e) => onRodadaChange(e.target.value === 'todas' ? 'todas' : parseInt(e.target.value))}
                        className="w-full bg-[#1C1C24] text-white border border-gray-700 rounded-lg px-3 py-2 focus:border-[#63E300] focus:outline-none"
                    >
                        <option value="todas">Todas as Rodadas</option>
                        {rodadasDisponiveis.map(rodada => (
                            <option key={rodada} value={rodada}>Rodada {rodada}</option>
                        ))}
                    </select>
                </div>

                {/* Filtro de Conferência */}
                <div>
                    <label className="block text-gray-400 text-sm mb-2">Conferência</label>
                    <select
                        value={filterConferencia}
                        onChange={(e) => onConferenciaChange(e.target.value)}
                        className="w-full bg-[#1C1C24] text-white border border-gray-700 rounded-lg px-3 py-2 focus:border-[#63E300] focus:outline-none"
                    >
                        <option value="todas">Todas as Conferências</option>
                        {conferenciasDisponiveis.map(conferencia => (
                            <option key={conferencia} value={conferencia}>{conferencia}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    )
}