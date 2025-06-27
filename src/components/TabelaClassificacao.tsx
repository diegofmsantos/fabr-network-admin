import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ImageService } from '@/utils/services/ImageService'
import { TabelaClassificacaoProps } from '@/types'


export const TabelaClassificacao: React.FC<TabelaClassificacaoProps> = ({
  classificacao,
  grupoNome,
  showGroup = false,
  compact = false, // @ts-ignore
  temporada = '2025'
}) => {
  if (!classificacao || classificacao.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <p className="text-gray-500">Nenhuma classificação disponível</p>
      </div>
    )
  }

  const formatAproveitamento = (aproveitamento: number) => {
    return `${aproveitamento.toFixed(1)}%`
  }

  const getPositionColor = (posicao: number) => {
    if (posicao <= 2) return 'text-green-600 font-bold'
    if (posicao <= 4) return 'text-blue-600 font-bold'
    return 'text-gray-700'
  }

  const getPositionBg = (posicao: number) => {
    if (posicao <= 2) return 'bg-green-50'
    if (posicao <= 4) return 'bg-blue-50'
    return ''
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {grupoNome && (
        <div className="bg-gray-50 px-6 py-4 border-b">
          <h3 className="text-lg font-bold text-gray-900">{grupoNome}</h3>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pos
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              {showGroup && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grupo
                </th>
              )}
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                J
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                V
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                E
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                D
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                PP
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                PC
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                SP
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                PTS
              </th>
              {!compact && (
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  %
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {classificacao.map((item, index) => (
              <tr
                key={item.id}
                className={`hover:bg-gray-50 transition-colors ${getPositionBg(item.posicao)}`}
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${getPositionColor(item.posicao)}`}>
                    {item.posicao}º
                  </span>
                </td>

                <td className="px-4 py-4 whitespace-nowrap">
                  <Link
                    href={`/${item.time.nome}?temporada=${temporada}`}
                    className="flex items-center hover:text-blue-600 transition-colors"
                  >
                    <div className="flex-shrink-0 h-8 w-8 mr-3">
                      <Image
                        src={ImageService.getTeamLogo(item.time.nome || '')}
                        alt={`Logo ${item.time.nome}`}
                        width={32}
                        height={32}
                        className="rounded"
                        onError={(e) => ImageService.handleTeamLogoError(e, item.time.nome || '')}
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {compact ? item.time.sigla : item.time.nome}
                      </div>
                      {!compact && (
                        <div className="text-xs text-gray-500">{item.time.sigla}</div>
                      )}
                    </div>
                  </Link>
                </td>

                {showGroup && (
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.grupo?.nome}
                  </td>
                )}

                <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                  {item.jogos}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-green-600 font-medium">
                  {item.vitorias}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-yellow-600 font-medium">
                  {item.empates}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-red-600 font-medium">
                  {item.derrotas}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                  {item.pontosPro}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                  {item.pontosContra}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <span className={item.saldoPontos >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {item.saldoPontos > 0 ? '+' : ''}{item.saldoPontos}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-bold text-gray-900">
                  {item.pontos}
                </td>

                {!compact && (
                  <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                    {formatAproveitamento(item.aproveitamento)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!compact && (
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex flex-wrap gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-100 rounded"></div>
              <span>1º-2º: Classificação direta</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-100 rounded"></div>
              <span>3º-4º: Repescagem</span>
            </div>
            <div className="text-gray-500">
              J=Jogos, V=Vitórias, E=Empates, D=Derrotas, PP=Pontos Pró, PC=Pontos Contra, SP=Saldo, PTS=Pontos, %=Aproveitamento
            </div>
          </div>
        </div>
      )}
    </div>
  )
}