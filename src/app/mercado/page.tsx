// src/app/mercado/page.tsx
"use client"

import { useState, useEffect } from 'react'
import { getTransferenciasFromJson } from '@/api/api'
import Link from 'next/link'
import Image from 'next/image'

// Tipo simplificado para as transferências
type Transferencia = {
  id: number;
  jogadorNome: string;
  timeOrigemId?: number;
  timeOrigemNome?: string;
  timeOrigemSigla?: string;
  timeDestinoId: number;
  timeDestinoNome: string;
  timeDestinoSigla: string;
  novaPosicao?: string;
  novoSetor?: string;
  novoNumero?: number;
  novaCamisa?: string;
  data: string;
}

export default function MercadoPage() {
  // Estados
  const [transferencias, setTransferencias] = useState<Transferencia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [temporadaOrigem, setTemporadaOrigem] = useState('2024')
  const [temporadaDestino, setTemporadaDestino] = useState('2025')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')

  // Buscar dados
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await getTransferenciasFromJson(temporadaOrigem, temporadaDestino);
        setTransferencias(data);
      } catch (err) {
        console.error('Erro:', err);
        setError(`Não foram encontradas transferências de ${temporadaOrigem} para ${temporadaDestino}`);
        setTransferencias([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [temporadaOrigem, temporadaDestino]);

  // Filtrar transferências por termo de busca
  const filteredTransferencias = searchTerm 
    ? transferencias.filter(t => 
        t.jogadorNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.timeOrigemNome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.timeDestinoNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.novaPosicao?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : transferencias;

  return (
    <div className="min-h-screen bg-[#1C1C24]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-gradient-to-r from-[#191920] to-[#272731] shadow-xl mb-4">
        <div className="w-full px-2 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-white font-bold text-xl flex items-center">
              <Image
                src="/logo-fabr-color.png"
                alt="Logo"
                width={200}
                height={100}
              />
            </Link>
            <h1 className="text-4xl text-[#63E300] font-extrabold italic leading-[55px] tracking-[-3px]">
              MERCADO DE TRANSFERÊNCIAS
            </h1>
          </div>
          <div className="flex gap-4 mr-4">
            <Link
              href="/"
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

      {/* Filtros */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <div className="bg-[#272731] p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-white mb-4">Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Temporada Origem
              </label>
              <select
                value={temporadaOrigem}
                onChange={(e) => setTemporadaOrigem(e.target.value)}
                className="w-full px-3 py-2 bg-[#1C1C24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#63E300]"
              >
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </div>
            
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Temporada Destino
              </label>
              <select
                value={temporadaDestino}
                onChange={(e) => setTemporadaDestino(e.target.value)}
                className="w-full px-3 py-2 bg-[#1C1C24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#63E300]"
              >
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>
            
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Buscar
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Jogador, time ou posição"
                className="w-full px-3 py-2 bg-[#1C1C24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#63E300]"
              />
            </div>

            {/* Opções de visualização */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Visualização
              </label>
              <div className="flex items-center gap-2 bg-[#1C1C24] p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded flex-1 flex justify-center ${
                    viewMode === 'grid' 
                      ? 'bg-[#63E300] text-black' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded flex-1 flex justify-center ${
                    viewMode === 'list' 
                      ? 'bg-[#63E300] text-black' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Transferências */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="bg-[#272731] rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">
              Transferências {temporadaOrigem} → {temporadaDestino}
            </h2>
            <div className="text-sm text-gray-400">
              {filteredTransferencias.length} transferências encontradas
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#63E300]"></div>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2a10 10 0 110 20 10 10 0 010-20z" />
              </svg>
              <p className="text-gray-400 mb-4">{error}</p>
            </div>
          ) : filteredTransferencias.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              Nenhuma transferência encontrada com os filtros selecionados.
            </div>
          ) : viewMode === 'list' ? (
            // Visualização em Lista
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-[#1C1C24]">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Jogador
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Time Anterior
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Novo Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Posição
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Número
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#272731] divide-y divide-gray-700">
                  {filteredTransferencias.map((transferencia) => (
                    <tr 
                      key={`${transferencia.id}-${transferencia.timeDestinoId}`}
                      className="hover:bg-[#2A2A35] transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{transferencia.jogadorNome}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {transferencia.timeOrigemNome || 'Sem time anterior'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white font-medium">{transferencia.timeDestinoNome}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {transferencia.novaPosicao || transferencia.novoSetor || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {transferencia.novoNumero || '-'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // Visualização em Grid
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTransferencias.map((transferencia) => (
                <div 
                  key={`${transferencia.id}-${transferencia.timeDestinoId}`}
                  className="bg-[#1C1C24] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                >
                  {/* Cabeçalho */}
                  <div className="p-4 border-b border-gray-700">
                    <h3 className="text-white font-bold text-lg mb-1 truncate">{transferencia.jogadorNome}</h3>
                    <div className="flex items-center text-sm text-gray-400">
                      {transferencia.novaPosicao && (
                        <span className="bg-[#272731] px-2 py-0.5 rounded mr-2">
                          {transferencia.novaPosicao}
                        </span>
                      )}
                      {transferencia.novoNumero && (
                        <span className="bg-[#272731] px-2 py-0.5 rounded">
                          #{transferencia.novoNumero}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Visualização da transferência */}
                  <div className="p-4">
                    <div className="flex items-center">
                      {/* Time origem */}
                      <div className="w-1/3 text-center">
                        <div 
                          className="w-12 h-12 mx-auto rounded-full flex items-center justify-center"
                          style={{ backgroundColor: transferencia.timeOrigemId ? '#4A4A57' : '#333340' }}
                        >
                          <span className="text-white font-bold text-sm">
                            {transferencia.timeOrigemSigla || "---"}
                          </span>
                        </div>
                        <p className="text-xs mt-2 text-gray-400 truncate px-2">
                          {transferencia.timeOrigemNome || "Free Agent"}
                        </p>
                      </div>
                      
                      {/* Seta */}
                      <div className="w-1/3 flex justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#63E300]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                      
                      {/* Time destino */}
                      <div className="w-1/3 text-center">
                        <div 
                          className="w-12 h-12 mx-auto rounded-full flex items-center justify-center"
                          style={{ backgroundColor: '#63E300' }}
                        >
                          <span className="text-black font-bold text-sm">
                            {transferencia.timeDestinoSigla}
                          </span>
                        </div>
                        <p className="text-xs mt-2 text-white font-medium truncate px-2">
                          {transferencia.timeDestinoNome}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Rodapé */}
                  <div className="bg-[#272731] text-xs text-gray-400 py-2 px-4 text-right">
                    {new Date(transferencia.data).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}