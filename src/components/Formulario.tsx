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
import ModalTime from "@/components/ModalTime";
import ModalJogador from "@/components/ModalJogador";

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
    const [selectedTime, setSelectedTime] = useState<Time | null>(null); // Time selecionado
    const [selectedJogador, setSelectedJogador] = useState<any | null>(null); // Jogador selecionado
    const [isTimeModalOpen, setIsTimeModalOpen] = useState(false); // Estado do modal de Time
    const [isJogadorModalOpen, setIsJogadorModalOpen] = useState(false); // Estado do modal de Jogador

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
        setIsSubmitting(true);

        try {
            // Filtrar estatísticas não preenchidas
            const estatisticasFiltradas = Object.fromEntries(
                Object.entries(data.estatisticas || {}).map(([group, stats]) => [
                    group,
                    removeEmptyFields(stats || {}),
                ])
            );

            // Adicionar log para verificar o processamento do grupo 'recepção'
            console.log('Estatísticas antes do envio:', estatisticasFiltradas);

            const jogadorData = {
                ...data,
                estatisticas: estatisticasFiltradas,
            };

            await api.post("/jogador", jogadorData);

            console.log("Jogador enviado com sucesso:", jogadorData);
        } catch (error) {
            console.error("Erro ao adicionar jogador:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Função para atualizar um time no estado
    const updateTime = (updatedTime: Time) => {
        setTimes((prevTimes) =>
            prevTimes.map((time) =>
                time.id === updatedTime.id ? { ...time, ...updatedTime } : time
            )
        );
    };

    // Definindo os campos do Time
    const camposTime: Array<{ id: keyof TimeFormData; label: string }> = [
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
        <div className="p-4 overflow-x-hidden">
            <div className="text-4xl font-bold text-center mb-2">Time</div>
            {/* Formulário de Time */}
            <form
                onSubmit={handleSubmit(onSubmitTime)}
                className="mb-8 p-4 bg-slate-200 grid grid-cols-6"
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

                <button type="submit" className="bg-blue-500 text-white w-60 h-10 text-lg font-bold mt-5 rounded-md">
                    Adicionar Time
                </button>
            </form>

            <div className="text-4xl font-bold text-center mb-2">Jogador</div>
            {loading ? (
                <div>Carregando times...</div>
            ) : (
                <form onSubmit={handleSubmitJogador(onSubmitJogador)} className="p-4 min-w-[800px] bg-slate-200">
                    <div className="grid grid-cols-6 mb-8">
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

                    <div className="grid grid-cols-7">
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
                        className={`bg-green-500 text-white w-60 h-10 text-lg font-bold rounded-md ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {isSubmitting ? "Enviando..." : "Adicionar Jogador"}
                    </button>

                </form>
            )}
            <div className="text-4xl font-bold text-center mb-2">Times Cadastrados</div>
            <div className="grid grid-cols-3 gap-4">
                {times.map((time) => (
                    <div
                        key={time.id}
                        className="border p-4 rounded-md cursor-pointer"
                        onClick={() => {
                            setSelectedTime(time); // Define o time selecionado
                            setIsTimeModalOpen(true); // Abre o modal do time
                        }}
                    >
                        <h2 className="text-xl font-bold">{time.nome}</h2>
                        <p>Sigla: {time.sigla}</p>
                        <p>Cidade: {time.cidade}</p>
                    </div>
                ))}
            </div>

            {/* Modal de Time */}
            {isTimeModalOpen && selectedTime && (
                <ModalTime
                    time={selectedTime}
                    closeModal={() => setIsTimeModalOpen(false)} // Função para fechar
                    openJogadorModal={(jogador) => {
                        setSelectedJogador(jogador);
                        setIsJogadorModalOpen(true);
                    }}
                    updateTime={updateTime}
                />
            )}


            {/* Modal de Jogador */}
            {isJogadorModalOpen && selectedJogador && (
                <ModalJogador
                    jogador={selectedJogador}
                    closeModal={() => setIsJogadorModalOpen(false)}
                />
            )}


        </div>
    )
}
