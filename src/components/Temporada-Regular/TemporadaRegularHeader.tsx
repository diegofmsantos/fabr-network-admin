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
     <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
             <div className="bg-[#272731] border border-gray-700 rounded-lg p-4">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-gray-400 text-sm">Total de Jogos</p>
                   <p className="text-2xl font-bold text-white">{stats.totalJogos}</p>
                 </div>
                 <Trophy className="w-8 h-8 text-yellow-500" />
               </div>
             </div>
     
             <div className="bg-[#272731] border border-gray-700 rounded-lg p-4">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-gray-400 text-sm">Finalizados</p>
                   <p className="text-2xl font-bold text-white">{stats.jogosFinalizados}</p>
                 </div>
                 <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                   <span className="text-green-500 font-bold">✓</span>
                 </div>
               </div>
             </div>
     
             <div className="bg-[#272731] border border-gray-700 rounded-lg p-4">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-gray-400 text-sm">Agendados</p>
                   <p className="text-2xl font-bold text-white">{stats.jogosAgendados}</p>
                 </div>
                 <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                   <span className="text-blue-500 font-bold">📅</span>
                 </div>
               </div>
             </div>
     
             <div className="bg-[#272731] border border-gray-700 rounded-lg p-4">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-gray-400 text-sm">Ao Vivo</p>
                   <p className="text-2xl font-bold text-white">{stats.jogosAoVivo}</p>
                 </div>
                 <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                   <span className="text-red-500 font-bold">🔴</span>
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