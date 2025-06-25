import { Materia } from '@/types'
import { BaseService } from './base.service'

export class MateriasService extends BaseService {
  static async getMaterias(): Promise<Materia[]> {
    const service = new MateriasService()
    return service.get<Materia[]>('/materias')
  }

  static async getMateria(id: number): Promise<Materia> {
    const service = new MateriasService()
    return service.get<Materia>(`/materias/${id}`)
  }

  static async createMateria(materia: Omit<Materia, 'id'>): Promise<Materia> {
    const service = new MateriasService()
    return service.post<Materia>('/materias', materia)
  }

  static async updateMateria(id: number, materia: Partial<Materia>): Promise<Materia> {
    const service = new MateriasService()
    return service.put<Materia>(`/materias/${id}`, materia)
  }

  static async deleteMateria(id: number): Promise<void> {
    const service = new MateriasService()
    return service.delete(`/materia/${id}`)
  }
}