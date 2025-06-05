import { Time } from '@/types/time'
import { Jogador } from '@/types/jogador'
import axios from 'axios'
import { Materia } from '@/types/materia';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// Função para obter os times com filtro de temporada
// Adicione logs para verificar o URL
export const getTimes = async (temporada = '2024'): Promise<Time[]> => {
  try {
    console.log(`Buscando times com URL: ${api.defaults.baseURL}/times?temporada=${temporada}`);
    const response = await api.get(`/times/times?temporada=${temporada}`)
    return response.data || []
  } catch (error) {
    console.error('Erro ao buscar times:', error)
    throw new Error('Falha ao buscar times')
  }
}

// Função para adicionar um time
export const addTime = async (data: Omit<Time, "id">): Promise<Time> => {
  try {
    // Garante que temporada exista no objeto
    const timeData = {
      ...data,
      temporada: data.temporada || '2024'
    }
    const response = await api.post('/times/time', timeData)
    return response.data
  } catch (error) {
    console.error('Erro ao adicionar time:', error)
    throw new Error('Falha ao adicionar time')
  }
}

// Função para atualizar um time
export const atualizarTime = async (data: Time): Promise<Time> => {
  try {
    const response = await api.put(`/times/time/${data.id}`, data)
    return response.data
  } catch (error) {
    console.error(`Erro ao atualizar o time com ID ${data.id}:`, error)
    throw new Error('Falha ao atualizar time')
  }
}

// Função para deletar um time
export const deletarTime = async (id: number): Promise<void> => {
  try {
    await api.delete(`/times/time/${id}`)
  } catch (error) {
    console.error(`Erro ao deletar o time com ID ${id}:`, error)
    throw new Error('Falha ao deletar time')
  }
}

// Função para obter jogadores com filtro de temporada
export const getJogadores = async (temporada = '2024'): Promise<any[]> => {
  try {
    console.log(`Buscando jogadores com URL: ${api.defaults.baseURL}/jogadores?temporada=${temporada}`);
    const response = await api.get(`/jogadores/jogadores?temporada=${temporada}`)
    return response.data || []
  } catch (error) {
    console.error('Erro ao buscar jogadores:', error)
    throw new Error('Falha ao buscar jogadores')
  }
}

// Função para adicionar um jogador
export const addJogador = async (data: Omit<Jogador, 'id'>): Promise<Jogador> => {
  try {
    const response = await api.post('/jogadores/jogador', data)
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar jogador:', error)
    throw new Error('Falha ao adicionar jogador')
  }
}

// Função para atualizar um jogador
export const atualizarJogador = async (data: any): Promise<Jogador> => {
  // Aqui enviamos os campos do jogador e também as informações para o relacionamento
  try {
    const response = await api.put(`/jogadores/jogador/${data.id}`, {
      ...data,
      // Incluir informações para o relacionamento
      timeId: data.timeId,
      temporada: data.temporada, 
      numero: data.numero,
      camisa: data.camisa,
      estatisticas: data.estatisticas,
      altura: data.altura
    });
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
    const response = await api.delete(`/jogadores/jogador/${id}`);

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
    const response = await api.get('/materias/materias');
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
    const response = await api.post('/materias/materias', {
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
    const response = await api.put(`/materias/materias/${id}`, {
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
    await api.delete(`/materias/materia/${id}`);
  } catch (error) {
    console.error(`Erro ao deletar notícia com ID ${id}:`, error);
    throw new Error('Falha ao deletar notícia');
  }
};

// Função para iniciar nova temporada
export const iniciarTemporada = async (ano: string, alteracoes: any): Promise<any> => {
  try {
    const response = await api.post(`/admin/iniciar-temporada/${ano}`, alteracoes)
    return response.data
  } catch (error) {
    console.error(`Erro ao iniciar temporada ${ano}:`, error)
    throw new Error('Falha ao iniciar nova temporada')
  }
}

// NOVAS FUNÇÕES PARA IMPORTAÇÃO DE DADOS

// Função para importar times a partir de uma planilha
export const importarTimes = async (arquivo: File): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('arquivo', arquivo);
    
    const response = await api.post('/admin/importar-times', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao importar times:', error);
    throw new Error('Falha ao importar times');
  }
};

// Função para importar jogadores a partir de uma planilha
export const importarJogadores = async (arquivo: File): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('arquivo', arquivo);
    
    const response = await api.post('/admin/importar-jogadores', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao importar jogadores:', error);
    throw new Error('Falha ao importar jogadores');
  }
};

// Função para importar estatísticas a partir de uma planilha de jogo
export const atualizarEstatisticas = async (arquivo: File, id_jogo: string, data_jogo: string): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('arquivo', arquivo);
    formData.append('id_jogo', id_jogo);
    formData.append('data_jogo', data_jogo);
    
    const response = await api.post('/admin/atualizar-estatisticas', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar estatísticas:', error);
    throw new Error('Falha ao atualizar estatísticas');
  }
};

// Função para reprocessar estatísticas de um jogo
export const reprocessarJogo = async (arquivo: File, id_jogo: string, data_jogo: string, force: boolean = false): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('arquivo', arquivo);
    formData.append('id_jogo', id_jogo);
    formData.append('data_jogo', data_jogo);
    formData.append('force', String(force));
    
    const response = await api.post('/admin/reprocessar-jogo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao reprocessar jogo:', error);
    throw new Error('Falha ao reprocessar jogo');
  }
};

// Função para obter jogos processados
export const getJogosProcessados = async (): Promise<any> => {
  try {
    const response = await api.get('/admin/jogos-processados');
    return response.data;
  } catch (error) {
    console.error('Erro ao obter jogos processados:', error);
    throw new Error('Falha ao obter jogos processados');
  }
};