import { useState, useEffect } from 'react'
import { JogadoresService } from '@/services/jogadores.service'

interface JogadorRanking {
  jogador: {
    id: number
    nome: string
    posicao: string
    setor: string
  }
  time: {
    id: number
    nome: string
    sigla: string
    cor: string
    logo: string
  }
  estatisticas: any
  totalJogos: number
}

export function useRankingTemporadaRegular(
  categoria: string, 
  temporada: string = '2025'
) {
  const [data, setData] = useState<JogadorRanking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    async function fetchRanking() {
      try {
        setLoading(true)
        setError(null)
        
        const resultado = await JogadoresService.getRankingTemporadaRegular(
          categoria, 
          temporada
        )
        
        setData(resultado as JogadorRanking[])
      } catch (err) {
        console.error('Erro ao buscar ranking:', err)
        setError('Erro ao carregar ranking')
        setData([])
      } finally {
        setLoading(false)
      }
    }
    
    if (categoria) {
      fetchRanking()
    }
  }, [categoria, temporada])
  
  return { data, loading, error }
}