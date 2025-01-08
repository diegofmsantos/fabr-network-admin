// services/localStorage.ts
import { Noticias } from '../data/noticias' 

interface Noticia {
    id: number
    titulo: string
    subtitulo: string
    imagem: string
    texto: string
    autor: string
    autorImage: string
    createdAt: string
    updatedAt: string
}

const STORAGE_KEY = 'fabr_noticias'

export const NoticiasService = {
    // Inicializa o localStorage com as notícias estáticas se estiver vazio
    initialize: () => {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (!stored) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(Noticias))
        }
    },

    // Busca todas as notícias
    getAll: (): Noticia[] => {
        const stored = localStorage.getItem(STORAGE_KEY)
        return stored ? JSON.parse(stored) : []
    },

    // Cria uma nova notícia
    create: (noticia: Omit<Noticia, 'id' | 'createdAt' | 'updatedAt'>) => {
        const noticias = NoticiasService.getAll()
        const newId = noticias.length > 0 ? Math.max(...noticias.map(n => n.id)) + 1 : 1
        
        const newNoticia: Noticia = {
            ...noticia,
            id: newId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        const updatedNoticias = [...noticias, newNoticia]
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNoticias))
        return newNoticia
    },

    // Atualiza uma notícia
    update: (id: number, noticia: Partial<Noticia>) => {
        const noticias = NoticiasService.getAll()
        const index = noticias.findIndex(n => n.id === id)
        
        if (index === -1) return null

        const updatedNoticia = {
            ...noticias[index],
            ...noticia,
            updatedAt: new Date().toISOString()
        }

        noticias[index] = updatedNoticia
        localStorage.setItem(STORAGE_KEY, JSON.stringify(noticias))
        return updatedNoticia
    },

    // Deleta uma notícia
    delete: (id: number) => {
        const noticias = NoticiasService.getAll()
        const filtered = noticias.filter(n => n.id !== id)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    }
}