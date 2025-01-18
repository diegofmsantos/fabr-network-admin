 // Definindo os campos do Time
 import { TimeSchema } from "@/schemas/Time"
 import { JogadorSchema } from "@/schemas/Jogador"
 import { z } from "zod"
 
 type TimeFormData = z.infer<typeof TimeSchema>
 type JogadorFormData = z.infer<typeof JogadorSchema>
 
 export const camposTime: Array<{ id: keyof TimeFormData; label: string }> = [
    { id: "nome", label: "Nome do Time" },
    { id: "sigla", label: "Sigla" },
    { id: "cor", label: "Cor" },
    { id: "cidade", label: "Cidade" },
    { id: "bandeira_estado", label: "Bandeira Estado" },
    { id: "fundacao", label: "Fundação" },
    { id: "instagram", label: "Instagram" },
    { id: "instagram2", label: "@" },
    { id: "logo", label: "Logo" },
    { id: "capacete", label: "Capacete" },
    { id: "estadio", label: "Estádio" },
    { id: "presidente", label: "Presidente" },
    { id: "head_coach", label: "Head Coach" },
    { id: "instagram_coach", label: "Instagram Coach" },
    { id: "coord_ofen", label: "Coordenador Ofensivo" },
    { id: "coord_defen", label: "Coordenador Defensivo" },
]

// Definindo os campos do Jogador
export const camposJogador: Array<{ id: keyof JogadorFormData; label: string; type?: string; options?: { value: string; label: string }[] }> = [
    { id: "nome", label: "Nome do Jogador" },
    { id: "timeFormador", label: "Time Formador" },
    { id: "posicao", label: "Posição" },
    {
        id: "setor",
        label: "Setor",
        type: "select",
        options: [
            { value: "Ataque", label: "Ataque" },
            { value: "Defesa", label: "Defesa" },
            { value: "Special", label: "Special" },
        ],
    },
    { id: "cidade", label: "Cidade" },
    { id: "nacionalidade", label: "Nacionalidade" },
    { id: "instagram", label: "Instagram" },
    { id: "instagram2", label: "@" },
    { id: "camisa", label: "Camisa" },
]

// Definindo os campos numéricos do Jogador
export const camposNumericosJogador: Array<{ id: keyof JogadorFormData; label: string; type: "number" }> = [
    { id: "experiencia", label: "Experiência", type: "number" },
    { id: "numero", label: "Número", type: "number" },
    { id: "idade", label: "Idade", type: "number" },
    { id: "altura", label: "Altura (m)", type: "number" },
    { id: "peso", label: "Peso (kg)", type: "number" },
]

export const estatisticas = [
    {
        group: "passe",
        fields: [
            { id: "passes_completos", label: "Passes Completos", type: "number" },
            { id: "passes_tentados", label: "Passes Tentados", type: "number" },
            { id: "jardas_de_passe", label: "Jardas de Passe", type: "number" },
            { id: "td_passados", label: "Touchdowns Passados", type: "number" },
            { id: "interceptacoes_sofridas", label: "Interceptações Sofridas", type: "number" },
            { id: "sacks_sofridos", label: "Sacks Sofridos", type: "number" },
            { id: "fumble_de_passador", label: "Fumbles de Passador", type: "number" },
        ],
    },
    {
        group: "corrida",
        fields: [
            { id: "corridas", label: "Corridas", type: "number" },
            { id: "jardas_corridas", label: "Jardas Corridas", type: "number" },
            { id: "tds_corridos", label: "Touchdowns Corridos", type: "number" },
            { id: "fumble_de_corredor", label: "Fumbles de Corredor", type: "number" },
        ],
    },
    {
        group: "recepcao",
        fields: [
            { id: "recepcoes", label: "Recepções", type: "number" },
            { id: "alvo", label: "Alvo", type: "number" },
            { id: "jardas_recebidas", label: "Jardas Recebidas", type: "number" },
            { id: "tds_recebidos", label: "Touchdowns Recebidos", type: "number" },
            { id: "fumble_de_recebedor", label: "Fumbles de Recebedor", type: "number" },
        ],
    },
    {
        group: "retorno",
        fields: [
            { id: "retornos", label: "Retornos", type: "number" },
            { id: "jardas_retornadas", label: "Jardas Retornadas", type: "number" },
            { id: "td_retornados", label: "Touchdowns Retornados", type: "number" },
            { id: "fumble_retornador", label: "Fumbles de Retornador", type: "number" },
        ],
    },
    {
        group: "defesa",
        fields: [
            { id: "tackles_totais", label: "Tackles Totais", type: "number" },
            { id: "tackles_for_loss", label: "Tackles for Loss", type: "number" },
            { id: "sacks_forcado", label: "Sacks Forçados", type: "number" },
            { id: "fumble_forcado", label: "Fumbles Forçados", type: "number" },
            { id: "interceptacao_forcada", label: "Interceptações Forçadas", type: "number" },
            { id: "passe_desviado", label: "Passes Desviados", type: "number" },
            { id: "safety", label: "Safety", type: "number" },
            { id: "td_defensivo", label: "Touchdowns Defensivos", type: "number" },
        ],
    },
    {
        group: "kicker",
        fields: [
            { id: "xp_bons", label: "Extra Points Bons", type: "number" },
            { id: "tentativas_de_xp", label: "Tentativas de Extra Points", type: "number" },
            { id: "fg_bons", label: "Field Goals Bons", type: "number" },
            { id: "tentativas_de_fg", label: "Tentativas de Field Goals", type: "number" },
            { id: "fg_mais_longo", label: "Field Goal Mais Longo", type: "number" }
        ],
    },
    {
        group: "punter",
        fields: [
            { id: "punts", label: "Punts", type: "number" },
            { id: "jardas_de_punt", label: "Jardas de Punt", type: "number" },
        ],
    },
]