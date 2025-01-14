import { Time } from '@/types/time'
import { Jogador } from '@/types/jogador'
import axios from 'axios'
import { Materia } from '@/types/materia';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

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

// Função para atualizar um jogador
export const atualizarJogador = async (data: Jogador): Promise<Jogador> => {
  try {
    const response = await api.put(`/jogador/${data.id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar o jogador com ID ${data.id}:`, error);
    throw new Error('Falha ao atualizar jogador');
  }
};

// Função para deletar um jogador
export const deletarJogador = async (id: number): Promise<void> => {
  try {
    console.log(`Tentando excluir jogador com ID: ${id}`); // Log para debug
    const response = await api.delete(`/jogador/${id}`);

    // Checar se a resposta foi bem-sucedida
    if (response.status === 200) {
      console.log(`Jogador com ID ${id} excluído com sucesso.`);
    } else {
      console.error(`Falha ao excluir jogador. Status: ${response.status}`);
      throw new Error('Falha ao deletar jogador');
    }
  } catch (error) {
    console.error(`Erro ao deletar o jogador com ID ${id}:`, error);
    throw new Error('Falha ao deletar jogador');
  }
};

// Função para obter todas as notícias
export const getNoticias = async (): Promise<Materia[]> => {
  try {
    const response = await api.get('/materias');
    return response.data || [];
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    throw new Error('Falha ao buscar notícias');
  }
};

// Função para criar uma nova notícia
export const createNoticia = async (
  noticia: Omit<Materia, 'id'>
): Promise<Materia> => {
  try {
    const response = await api.post('/materias', {
      ...noticia,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar notícia:', error);
    throw new Error('Falha ao criar notícia');
  }
};

// Função para atualizar uma notícia
export const updateNoticia = async (
  id: number,
  noticia: Partial<Materia>
): Promise<Materia> => {
  try {
    const response = await api.put(`/materias/${id}`, {
      ...noticia,
      updatedAt: new Date()
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar notícia com ID ${id}:`, error);
    throw new Error('Falha ao atualizar notícia');
  }
};

// Função para deletar uma notícia
export const deleteNoticia = async (id: number): Promise<void> => {
  try {
    await api.delete(`/materia/${id}`);
  } catch (error) {
    console.error(`Erro ao deletar notícia com ID ${id}:`, error);
    throw new Error('Falha ao deletar notícia');
  }
};


