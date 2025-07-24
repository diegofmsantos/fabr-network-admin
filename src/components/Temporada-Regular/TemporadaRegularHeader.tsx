import { ArrowLeft, CheckCircle, Clock, Play, Plus, RefreshCw, Trophy } from "lucide-react";
import Link from "next/link";

interface TemporadaRegularHeaderProps {
  temporada: string
  stats: {
    totalJogos: number
    jogosFinalizados: number
    jogosAgendados: number
    jogosAoVivo: number
    proximoJogo?: any
  }
  onRefresh: () => void
}

export function TemporadaRegularHeader({ temporada, stats, onRefresh }: TemporadaRegularHeaderProps) {
  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Link 
          href="/admin/superliga"
          className="p-2 rounded-lg bg-[#272731] border border-gray-700 hover:border-gray-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">Temporada Regular</h1>
          <p className="text-gray-400">Gerenciar jogos da temporada regular {temporada}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 bg-[#272731] text-white px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </button>

          <Link
            href="/admin/importar"
            className="flex items-center gap-2 bg-[#63E300] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#50B800] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Importar Resultados
          </Link>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#272731] rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <Trophy className="w-5 h-5 text-[#63E300]" />
            <div>
              <p className="text-gray-400 text-sm">Total de Jogos</p>
              <p className="text-white text-xl font-bold">{stats.totalJogos}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#272731] rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-gray-400 text-sm">Finalizados</p>
              <p className="text-white text-xl font-bold">{stats.jogosFinalizados}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#272731] rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-gray-400 text-sm">Agendados</p>
              <p className="text-white text-xl font-bold">{stats.jogosAgendados}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#272731] rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <Play className="w-5 h-5 text-red-500" />
            <div>
              <p className="text-gray-400 text-sm">Ao Vivo</p>
              <p className="text-white text-xl font-bold">{stats.jogosAoVivo}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Próximo jogo */}
      {stats.proximoJogo && (
        <div className="bg-[#272731] rounded-lg p-4 border border-gray-700 mb-6">
          <h3 className="text-white font-semibold mb-2">Próximo Jogo</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-white">
                {stats.proximoJogo.timeCasa?.nome} vs {stats.proximoJogo.timeVisitante?.nome}
              </span>
              <span className="text-gray-400 text-sm">
                Rodada {stats.proximoJogo.rodada}
              </span>
            </div>
            <span className="text-gray-400 text-sm">
              {new Date(stats.proximoJogo.dataJogo).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>
      )}
    </>
  )
}