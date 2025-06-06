import { apiClient } from "@/libs/api"
import { Jogador } from "@/types/jogador"

export class JogadoresService {
  static async getJogadores(params: {
    temporada?: string
    timeId?: number
    posicao?: string
  }): Promise<Jogador[]> {
    const { data } = await apiClient.get('/jogadores', { params })
    return data
  }

  static async getJogador(id: number): Promise<Jogador> {
    const { data } = await apiClient.get(`/jogadores/${id}`)
    return data
  }

  static async createJogador(jogador: Omit<Jogador, 'id'>): Promise<Jogador> {
    const { data } = await apiClient.post('/jogadores', jogador)
    return data
  }

  static async updateJogador(id: number, jogador: Partial<Jogador>): Promise<Jogador> {
    const { data } = await apiClient.put(`/jogadores/${id}`, jogador)
    return data
  }

  static async deleteJogador(id: number): Promise<void> {
    await apiClient.delete(`/jogadores/${id}`)
  }
}