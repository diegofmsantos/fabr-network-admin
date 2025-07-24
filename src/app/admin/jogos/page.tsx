"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Calendar, Eye, Edit, Clock, CheckCircle, AlertTriangle } from 'lucide-react'
import { Loading } from '@/components/ui/Loading'
import { useJogos } from '@/hooks/useJogos'

export default function AdminJogosPage() {
  const [filterStatus, setFilterStatus] = useState<'todos' | 'AGENDADO' | 'AO_VIVO' | 'FINALIZADO'>('todos')
  const [filterTemporada, setFilterTemporada] = useState('2025')

  const { data: jogos = [], isLoading } = useJogos({
    temporada: filterTemporada,
    status: filterStatus === 'todos' ? undefined : filterStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'AGENDADO': return <Clock className="w-4 h-4 text-yellow-400" />
      case 'AO VIVO': return <AlertTriangle className="w-4 h-4 text-red-400" />
      case 'FINALIZADO': return <CheckCircle className="w-4 h-4 text-green-400" />
      default: return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'AGENDADO': return 'Agendado'
      case 'AO VIVO': return 'Ao Vivo'
      case 'FINALIZADO': return 'Finalizado'
      default: return status
    }
  }

  if (isLoading) return <Loading />

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Jogos da Superliga</h1>
          <p className="mt-1 text-sm text-gray-400">
            Gerencie a agenda e resultados dos jogos
          </p>
        </div>

        <div className="mt-4 flex space-x-3 sm:mt-0">
          <Link
            href="/importar"
            className="inline-flex items-center rounded-md bg-[#63E300] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-[#50B800] transition-colors"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Importar Agenda
          </Link>
        </div>
      </div>

      <div className="bg-[#272731] shadow rounded-lg p-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="bg-[#1C1C24] text-white rounded-md border border-gray-700 px-3 py-2"
            >
              <option value="todos">Todos</option>
              <option value="AGENDADO">Agendado</option>
              <option value="AO VIVO">Ao Vivo</option>
              <option value="FINALIZADO">Finalizado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Temporada</label>
            <select
              value={filterTemporada}
              onChange={(e) => setFilterTemporada(e.target.value)}
              className="bg-[#1C1C24] text-white rounded-md border border-gray-700 px-3 py-2"
            >
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-[#272731] shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-[#1C1C24]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Data/Hora
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Confronto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Rodada
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-[#272731] divide-y divide-gray-700">
            {jogos.map((jogo: any) => (
              <tr key={jogo.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {new Date(jogo.dataJogo).toLocaleDateString('pt-BR')}
                  <br />
                  <span className="text-gray-400">
                    {new Date(jogo.dataJogo).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-white">
                    <div className="flex items-center space-x-2">
                      <span>{jogo.timeCasa?.nome || 'Time Casa'}</span>
                      <span className="text-gray-400">vs</span>
                      <span>{jogo.timeVisitante?.nome || 'Time Visitante'}</span>
                    </div>
                    {jogo.status === 'FINALIZADO' && (
                      <div className="text-[#63E300] text-md mt-1 flex justify-start gap-16 ml-7 items-center">
                        <div>{jogo.placarCasa}</div> x <div>{jogo.placarVisitante}</div>
                      </div>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {jogo.rodada}ª Rodada
                  <br />
                  <span className="text-gray-400 text-xs">{jogo.fase}</span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(jogo.status)}
                    <span className="text-sm text-white">
                      {getStatusLabel(jogo.status)}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Link
                      href={`/admin/jogos/${jogo.id}`}
                      className="text-[#63E300] hover:text-[#50B800]"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>

                    {jogo.status === 'AGENDADO' && (
                      <Link
                        href={`/admin/jogos/${jogo.id}/gerenciar-jogo`}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {jogos.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Nenhum jogo encontrado</h3>
            <p className="text-gray-400 mb-6">
              Importe a agenda da Superliga para visualizar os jogos
            </p>
            <Link
              href="/importar"
              className="inline-flex items-center bg-[#63E300] text-black px-6 py-3 rounded-md font-semibold hover:bg-[#50B800] transition-colors"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Importar Agenda
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}