"use client"

import { useState, useEffect } from "react"
import { TeamChangesForm } from "@/components/TeamChangesForm"
import { PlayerTransferForm } from "@/components/PlayerTransferForm"
import Link from "next/link"
import Image from "next/image"
import { TimeChange, Transferencia, TransferenciaTemporada } from "@/types"
import { useIniciarTemporada } from '@/hooks/useTemporada'
import { useTimes } from '@/hooks/useTimes'
import { useJogadores } from '@/hooks/useJogadores'
import { useTransferencias } from '@/hooks/useImportacao'

export default function IniciarTemporadaPage() {
  const [timeChanges, setTimeChanges] = useState<TimeChange[]>([]);
  const [transferencias, setTransferencias] = useState<TransferenciaTemporada[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [currentSeason, setCurrentSeason] = useState("2024");
  const [targetSeason, setTargetSeason] = useState("2025");
  const { data: times = [], isLoading: loadingTimes } = useTimes(currentSeason)
  const { data: jogadores = [], isLoading: loadingJogadores } = useJogadores(currentSeason)
  const iniciarTemporadaMutation = useIniciarTemporada()
  const { data: transferenciasCarregadas, isLoading: loadingTransferencias } = useTransferencias(
    currentSeason,
    targetSeason
  )

  const isSubmitting = iniciarTemporadaMutation.isPending

  useEffect(() => {
    if (transferenciasCarregadas && transferenciasCarregadas.length > 0) {
      setTransferencias(transferenciasCarregadas)
    }
  }, [transferenciasCarregadas])


  const adicionarAlteracaoTime = (change: Omit<TimeChange, 'alteracoes'>) => {
    const changeWithAlteracoes: TimeChange = {
      ...change,
      alteracoes: change
    }

    const index = timeChanges.findIndex(tc => tc.timeId === change.timeId);
    if (index >= 0) {
      const updatedChanges = [...timeChanges];
      updatedChanges[index] = { ...updatedChanges[index], ...changeWithAlteracoes };
      setTimeChanges(updatedChanges);
    } else {
      setTimeChanges([...timeChanges, changeWithAlteracoes]);
    }
  };

  const adicionarTransferencia = (transferencia: TransferenciaTemporada) => {
    const index = transferencias.findIndex(t => t.jogadorId === transferencia.jogadorId);
    if (index >= 0) {
      const updatedTransfers = [...transferencias];
      updatedTransfers[index] = transferencia;
      setTransferencias(updatedTransfers);
    } else {
      setTransferencias([...transferencias, transferencia]);
    }
  };

  const removerAlteracaoTime = (index: number) => {
    const updatedChanges = [...timeChanges];
    updatedChanges.splice(index, 1);
    setTimeChanges(updatedChanges);
  };

  const removerTransferencia = (index: number) => {
    const updatedTransfers = [...transferencias];
    updatedTransfers.splice(index, 1);
    setTransferencias(updatedTransfers);
  };



  const handleSubmit = () => {
    iniciarTemporadaMutation.mutate({
      ano: targetSeason,
      alteracoes: { timeChanges, transferencias }
    }, {
      onSuccess: () => {
        setMessage("Temporada iniciada com sucesso!")
        setTimeChanges([])
        setTransferencias([])
      },
      onError: (error) => {
        setMessage(`Erro: ${error.message}`)
      }
    })
  }

  if (loadingTimes || loadingJogadores) {
    return <div className="p-4 overflow-x-hidden bg-[#1C1C24] min-h-screen flex items-center justify-center">
      <p className="text-white text-xl">Carregando dados...</p>
    </div>;
  }

  return (
    <div className="p-4 overflow-x-hidden bg-[#1C1C24] min-h-screen">
      <header className="sticky top-0 z-10 bg-gradient-to-r from-[#191920] to-[#272731] shadow-xl">
        <div className="w-full px-2 py-4 flex justify-between items-center">
          <Link href="/" className="text-white font-bold text-xl flex items-center">
            <Image
              src="/logo-fabr-color.png"
              alt="Logo"
              width={200}
              height={100}
            />
          </Link>
          <h1 className="text-4xl text-[#63E300] font-extrabold italic leading-[55px] tracking-[-3px]">GERENCIAR MATÉRIAS - INICIAR TEMPORADA {targetSeason}</h1>
          <div className="flex ml-auto gap-4 mr-4">

            <Link
              href={`/`}
              className="px-4 py-2 bg-[#63E300] text-black rounded-lg hover:bg-[#50B800] transition-colors flex items-center font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
          </div>
        </div>
      </header>

      <div className="mb-8 bg-[#272731] mt-20 p-6 rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Temporada Atual
            </label>
            <select
              value={currentSeason}
              onChange={(e) => setCurrentSeason(e.target.value)}
              className="w-full px-3 py-2 bg-[#1C1C24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#63E300]"
              disabled={loading}
            >
              <option value="2024">2024</option>
            </select>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Nova Temporada
            </label>
            <select
              value={targetSeason}
              onChange={(e) => setTargetSeason(e.target.value)}
              className="w-full px-3 py-2 bg-[#1C1C24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#63E300]"
              disabled={loading}
            >
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
        </div>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-[#272731] rounded-lg">
          <p className="text-white">{message}</p>
        </div>
      )}

      <TeamChangesForm
        times={times}
        onAddChange={adicionarAlteracaoTime}
      />

      {timeChanges.length > 0 && (
        <div className="mt-4 bg-[#272731] p-6 rounded-lg">
          <h3 className="text-lg font-bold text-white mb-2">Alterações Adicionadas</h3>
          <div className="space-y-2">
            {timeChanges.map((change, index) => {
              const time = times.find(t => t.id === change.timeId);
              return (
                <div key={index} className="bg-[#1C1C24] p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <span className="text-white font-medium">{time?.nome}</span>
                    <ul className="text-gray-400 text-sm mt-1">
                      {change.nome && <li>Nome: {change.nome}</li>}
                      {change.sigla && <li>Sigla: {change.sigla}</li>}
                      {change.cor && <li>Cor: {change.cor}</li>}
                      {change.presidente && <li>Presidente: {change.presidente}</li>}
                      {change.head_coach && <li>Head Coach: {change.head_coach}</li>}
                      {change.coord_ofen && <li>Coord. Ofensivo: {change.coord_ofen}</li>}
                      {change.coord_defen && <li>Coord. Defensivo: {change.coord_defen}</li>}
                    </ul>
                  </div>
                  <button
                    onClick={() => removerAlteracaoTime(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Remover
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <PlayerTransferForm
        jogadores={jogadores}
        times={times}
        timeChanges={timeChanges}
        onAddTransfer={adicionarTransferencia}
      />

      {transferencias.length > 0 && (
        <div className="mt-4 bg-[#272731] p-6 rounded-lg">
          <h3 className="text-lg font-bold text-white mb-2">Transferências Adicionadas</h3>
          <div className="space-y-2">
            {transferencias.map((transfer, index) => (
              <div key={index} className="bg-[#1C1C24] p-3 rounded-lg flex justify-between items-center">
                <div>
                  <span className="text-white font-medium">{transfer.jogadorNome}</span>
                  <div className="text-gray-400 text-sm mt-1">
                    {transfer.timeOrigemNome && (
                      <span>
                        {transfer.timeOrigemNome} → {transfer.timeDestinoNome}
                      </span>
                    )}
                    {transfer.novoNumero && (
                      <span className="ml-2">
                        Novo número: {transfer.novoNumero}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => removerTransferencia(index)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center mt-8">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || loadingTimes || loadingJogadores}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${isSubmitting ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#63E300] hover:bg-[#50B800]'
            }`}
        >
          {isSubmitting ? 'Processando...' : `Iniciar Temporada ${targetSeason}`}
        </button>
      </div>
    </div>
  );
}