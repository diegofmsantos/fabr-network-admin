import { apiClient } from "@/libs/api"
import { Campeonato, CriarCampeonatoRequest } from "@/types/campeonato"

export class CampeonatosService {
  static async getCampeonatos(filters?: {
    temporada?: string
    tipo?: string
    status?: string
  }): Promise<Campeonato[]> {
    const { data } = await apiClient.get('/campeonatos', { 
      params: filters 
    })
    return data
  }

  static async getCampeonato(id: number): Promise<Campeonato> {
    const { data } = await apiClient.get(`/campeonatos/${id}`)
    return data
  }

  static async createCampeonato(campeonato: CriarCampeonatoRequest): Promise<Campeonato> {
    const { data } = await apiClient.post('/campeonatos', campeonato)
    return data
  }
}