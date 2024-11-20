"use client"

import { useForm, SubmitHandler, FieldError } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { Time } from "../types/time"
import { TimeSchema } from "@/schemas/Time"
import { JogadorSchema } from "@/schemas/Jogador"
import { api, getTimes } from "@/api/api"
import FormField from "@/components/FormField"
import get from "lodash/get"

type TimeFormData = z.infer<typeof TimeSchema>
type JogadorFormData = z.infer<typeof JogadorSchema>

export default function Formulario() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TimeFormData>({
        resolver: zodResolver(TimeSchema),
    })

    const {
        register: registerJogador,
        handleSubmit: handleSubmitJogador,
        formState: { errors: jogadorErrors },
    } = useForm<JogadorFormData>({
        resolver: zodResolver(JogadorSchema),
        defaultValues: {
            estatisticas: {
                passe: {},
                corrida: {},
                recepcao: {},
                retorno: {},
                defesa: {},
                kicker: {},
                punter: {},
            },
        },
    })

    const [times, setTimes] = useState<Time[]>([])
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Fetch dos times quando o componente é montado
    useEffect(() => {
        const fetchTimes = async () => {
            try {
                const data = await getTimes()
                setTimes(data)
            } catch (error) {
                console.error("Erro ao buscar os times:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchTimes()
    }, [])

    const removeEmptyFields = (obj: any) => {
        return Object.fromEntries(
            Object.entries(obj).filter(([_, value]) => value !== undefined && value !== "")
        )
    }

    const onSubmitTime: SubmitHandler<TimeFormData> = async (data) => {
        try {
            await api.post("/time", data)
        } catch (error) {
            console.error("Erro ao adicionar time:", error)
        }
    }

    const onSubmitJogador: SubmitHandler<JogadorFormData> = async (data) => {
        setIsSubmitting(true)

        try {
            // Filtrar estatísticas não preenchidas
            const estatisticasFiltradas = Object.fromEntries(
                Object.entries(data.estatisticas || {}).map(([group, stats]) => [
                    group,
                    removeEmptyFields(stats || {}),
                ])
            )

            const jogadorData = {
                ...data,
                estatisticas: estatisticasFiltradas,
            }

            await api.post("/jogador", jogadorData)

        } catch (error) {
            console.error("Erro ao adicionar jogador:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Definindo os campos do Time
    const camposTime: Array<{ id: keyof TimeFormData; label: string }> = [
        { id: "nome", label: "Nome do Time" },
        { id: "sigla", label: "Sigla" },
        { id: "cor", label: "Cor" },
        { id: "cidade", label: "Cidade" },
        { id: "fundacao", label: "Fundação" },
        { id: "instagram", label: "Instagram" },
        { id: "instagram2", label: "@" },
        { id: "logo", label: "Logo" },
        { id: "capacete", label: "Capacete" },
        { id: "estadio", label: "Estádio" },
        { id: "presidente", label: "Presidente" },
        { id: "head_coach", label: "Head Coach" },
        { id: "coord_ofen", label: "Coordenador Ofensivo" },
        { id: "coord_defen", label: "Coordenador Defensivo" },
    ]

    // Definindo os campos do Jogador
    const camposJogador: Array<{ id: keyof JogadorFormData; label: string; type?: string; options?: { value: string; label: string }[] }> = [
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
    const camposNumericosJogador: Array<{ id: keyof JogadorFormData; label: string; type: "number" }> = [
        { id: "experiencia", label: "Experiência", type: "number" },
        { id: "numero", label: "Número", type: "number" },
        { id: "idade", label: "Idade", type: "number" },
        { id: "altura", label: "Altura (m)", type: "number" },
        { id: "peso", label: "Peso (kg)", type: "number" },
    ]

    const estatisticas = [
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
                { id: "fg_mais_longo", label: "Field Goal Mais Longo", type: "number" },
                { id: "fg_0_10", label: "Field Goals 0-10", type: "string" },
                { id: "fg_11_20", label: "Field Goals 11-20", type: "string" },
                { id: "fg_21_30", label: "Field Goals 21-30", type: "string" },
                { id: "fg_31_40", label: "Field Goals 31-40", type: "string" },
                { id: "fg_41_50", label: "Field Goals 41-50", type: "string" },
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

    return (
        <div className="p-8 mx-auto">
            <div className="text-4xl font-bold text-center mb-2">Time</div>
            {/* Formulário de Time */}
            <form
                onSubmit={handleSubmit(onSubmitTime)}
                className="mb-8 p-4 flex justify-between flex-wrap gap-6 min-w-[1100px] bg-slate-300"
            >
                {camposTime.map((field) => (
                    <FormField
                        key={field.id}
                        label={field.label}
                        id={field.id}
                        register={register(field.id)}
                        error={errors[field.id as keyof TimeFormData] as FieldError | undefined}
                    />
                ))}

                {/* Campos de Títulos */}
                {(["nacionais", "conferencias", "estaduais"] as const).map((titulo) => (
                    <FormField
                        key={`titulos.0.${titulo}`}
                        label={`Títulos ${titulo.charAt(0).toUpperCase() + titulo.slice(1)}`}
                        id={`titulos.0.${titulo}`}
                        register={register(`titulos.0.${titulo}`)}
                        error={errors.titulos?.[0]?.[titulo]}
                    />
                ))}

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded m-auto w-60 h-14 text-lg font-bold">
                    Adicionar Time
                </button>
            </form>

            <div className="text-4xl font-bold text-center mb-2">Jogador</div>
            {loading ? (
                <div>Carregando times...</div>
            ) : (
                <form onSubmit={handleSubmitJogador(onSubmitJogador)} className="p-4 min-w-[800px] bg-slate-300">
                    <div className="grid grid-cols-4 gap-6">
                        {/* Campo de Seleção do Time */}
                        <FormField
                            label="Time"
                            id="timeId"
                            register={registerJogador("timeId", {
                                setValueAs: (v) => (v === "" ? undefined : parseInt(v)), // Converter string para número
                            })}
                            error={jogadorErrors.timeId as FieldError | undefined}
                            type="select"
                            options={times
                                .filter((time) => time.id !== undefined && time.nome !== undefined)
                                .map((time) => ({ value: time.id as number, label: time.nome as string }))}
                        />

                        {/* Campos do Jogador */}
                        {camposJogador.map((field) => (
                            <FormField
                                key={field.id}
                                label={field.label}
                                id={field.id}
                                register={registerJogador(field.id)}
                                error={jogadorErrors[field.id] as FieldError | undefined}
                                type={field.type === "number" || field.type === "select" ? field.type : "text"}
                                options={field.options}
                            />
                        ))}

                        {/* Campos Numéricos do Jogador */}
                        {camposNumericosJogador.map((field) => (
                            <FormField
                                key={field.id}
                                label={field.label}
                                id={field.id}
                                register={registerJogador(field.id, {
                                    setValueAs: (v) => (v === "" ? undefined : parseFloat(v)),
                                })}
                                error={jogadorErrors[field.id] as FieldError | undefined}
                                type="number"
                                step={field.id === "altura" ? "0.01" : "1"}
                            />
                        ))}

                    </div>

                    <div className="grid grid-cols-4 gap-6">
                        {/* Estatísticas do Jogador */}
                        {estatisticas.map((grupo) => (
                            <div key={grupo.group} className="">
                                <div className="text-2xl font-bold mb-2">{grupo.group.toUpperCase()}</div>
                                {grupo.fields.map((field) => (
                                    <FormField
                                        key={field.id}
                                        label={field.label}
                                        id={`estatisticas.${grupo.group}.${field.id}`}
                                        register={registerJogador(
                                            `estatisticas.${grupo.group}.${field.id}` as keyof JogadorFormData,
                                            {
                                                setValueAs: (v) => (v === "" ? undefined : field.type === "string" ? v : Number(v)),
                                            }
                                        )}
                                        error={get(jogadorErrors, `estatisticas.${grupo.group}.${field.id}`) as FieldError | undefined}
                                        type={field.type === "string" ? "text" : "number"}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`bg-green-500 text-white px-4 py-2 rounded w-60 h-14 text-lg font-bold ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {isSubmitting ? "Enviando..." : "Adicionar Jogador"}
                    </button>

                </form>
            )}
        </div>
    )
}
