import { Time } from '@/types/time'
import { Jogador } from '@/types/jogador'
import axios from 'axios'

export const api = axios.create({
    baseURL: 'http://localhost:4000/api',
})

// Função para obter os times
export const getTimes = async (): Promise<Time[]> => {
    try {
        const response = await api.get('/times')
        return response.data || []
    } catch (error) {
        console.error('Erro ao buscar times:', error)
        throw new Error('Falha ao buscar times')
    }
}

// Função para adicionar um time
export const addTime = async (data: Omit<Time, "id">): Promise<Time> => {
    try {
        const response = await api.post('/time', data)
        return response.data
    } catch (error) {
        console.error('Erro ao adicionar time:', error)
        throw new Error('Falha ao adicionar time')
    }
}

// Função para atualizar um time
export const atualizarTime = async (data: Time): Promise<Time> => {
    try {
        const response = await api.put(`/time/${data.id}`, data)
        return response.data
    } catch (error) {
        console.error(`Erro ao atualizar o time com ID ${data.id}:`, error)
        throw new Error('Falha ao atualizar time')
    }
}

// Função para deletar um time
export const deletarTime = async (id: number): Promise<void> => {
    try {
        await api.delete(`/time/${id}`)
    } catch (error) {
        console.error(`Erro ao deletar o time com ID ${id}:`, error)
        throw new Error('Falha ao deletar time')
    }
}

// Função para adicionar um jogador
export const addJogador = async (data: Omit<Jogador, 'id'>): Promise<Jogador> => {
    try {
        const response = await api.post('/jogador', data)
        return response.data;
    } catch (error) {
        console.error('Erro ao adicionar jogador:', error)
        throw new Error('Falha ao adicionar jogador')
    }
}
