"use client"

import { useForm, SubmitHandler, FieldError } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { TimeSchema } from "@/schemas/Time"
import { JogadorSchema } from "@/schemas/Jogador"
import { FormField } from "@/components/Formulario/FormField"
import get from "lodash/get"
import ModalTime from "@/components/Modal/ModalTime";
import ModalJogador from "@/components/Modal/ModalJogador";
import ModalSucesso from "./Modal/ModalSucesso"
import { camposJogador, camposTime, estatisticas } from "../utils/campos"
import { HeaderGeneral } from "./HeaderGeneral"
import { Time, Estatisticas, Jogador } from "@/types"
import { useTimes, useCreateTime } from '@/hooks/useTimes'
import { useCreateJogador } from '@/hooks/useJogadores'

type TimeFormData = z.infer<typeof TimeSchema>
type JogadorFormData = z.infer<typeof JogadorSchema>

export const Times = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<TimeFormData>({
        resolver: zodResolver(TimeSchema),
        defaultValues: {
            temporada: "2025"
        }
    })

    const {
        register: registerJogador,
        handleSubmit: handleSubmitJogador,
        formState: { errors: jogadorErrors },
        reset: resetJogador
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

    const [selectedTime, setSelectedTime] = useState<Time | null>(null)
    const [selectedJogador, setSelectedJogador] = useState<Jogador | null>(null)
    const [isTimeModalOpen, setIsTimeModalOpen] = useState(false)
    const [isJogadorModalOpen, setIsJogadorModalOpen] = useState(false)
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [temporada, setTemporada] = useState("2025")
    const [jogadorTemporada, setJogadorTemporada] = useState("2025")
    const [activeTab, setActiveTab] = useState<'time' | 'jogador' | 'times-cadastrados'>('times-cadastrados')
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})

    // Hooks para operações
    const { data: times = [], isLoading: loading, error } = useTimes(temporada)
    const createTimeMutation = useCreateTime()
    const createJogadorMutation = useCreateJogador()

    const removeEmptyFields = (obj: any) => {
        return Object.fromEntries(
            Object.entries(obj).filter(([_, value]) => value !== undefined && value !== "")
        )
    }

    const onSubmitTime: SubmitHandler<TimeFormData> = (data) => {
        // Criar dados compatíveis com Omit<Time, 'id'>
        const timeData = {
            ...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            titulos: data.titulos ? [data.titulos] : []
        } as Omit<Time, 'id'>

        createTimeMutation.mutate(timeData, {
            onSuccess: () => {
                setSuccessMessage("Time adicionado com sucesso!")
                setIsSuccessModalOpen(true)
                reset()
            }
        })
    }

    const onSubmitJogador: SubmitHandler<JogadorFormData> = (data) => {
        // Criar estrutura de estatísticas com tipagem correta
        const estatisticasCompletas: Estatisticas = {
            passe: {
                passes_completos: 0,
                passes_tentados: 0,
                jardas_de_passe: 0,
                td_passados: 0,
                interceptacoes_sofridas: 0,
                sacks_sofridos: 0,
                fumble_de_passador: 0
            },
            corrida: {
                corridas: 0,
                jardas_corridas: 0,
                tds_corridos: 0,
                fumble_de_corredor: 0
            },
            recepcao: {
                recepcoes: 0,
                alvo: 0,
                jardas_recebidas: 0,
                tds_recebidos: 0
            },
            retorno: {
                retornos: 0,
                jardas_retornadas: 0,
                td_retornados: 0
            },
            defesa: {
                tackles_totais: 0,
                tackles_for_loss: 0,
                sacks_forcado: 0,
                fumble_forcado: 0,
                interceptacao_forcada: 0,
                passe_desviado: 0,
                safety: 0,
                td_defensivo: 0
            },
            kicker: {
                xp_bons: 0,
                tentativas_de_xp: 0,
                fg_bons: 0,
                tentativas_de_fg: 0,
                fg_mais_longo: 0
            },
            punter: {
                punts: 0,
                jardas_de_punt: 0
            }
        }

        // Preencher com dados do formulário
        if (data.estatisticas) {
            const grupos: Array<keyof Estatisticas> = ['passe', 'corrida', 'recepcao', 'retorno', 'defesa', 'kicker', 'punter']

            grupos.forEach(grupo => {
                if (data.estatisticas![grupo]) {
                    const estatisticasGrupo = data.estatisticas![grupo] as any
                    const estatisticasCompleta = estatisticasCompletas[grupo] as any

                    Object.keys(estatisticasGrupo).forEach(campo => {
                        if (estatisticasGrupo[campo] !== undefined && estatisticasGrupo[campo] !== '') {
                            estatisticasCompleta[campo] = Number(estatisticasGrupo[campo]) || 0
                        }
                    })
                }
            })
        }

        // Criar dados do jogador SEM classificacoes (será calculado pelo backend)
        const jogadorData: Omit<Jogador, 'id'> = {
            nome: data.nome || '',
            posicao: data.posicao || '',
            setor: data.setor || 'Ataque',
            experiencia: data.experiencia || 0,
            idade: data.idade || 0,
            altura: data.altura || 0,
            peso: data.peso || 0,
            instagram: data.instagram || '',
            instagram2: data.instagram2 || '',
            cidade: data.cidade || '',
            nacionalidade: data.nacionalidade || '',
            timeFormador: data.timeFormador || '',
            timeId: data.timeId,
            numero: data.numero,
            camisa: data.camisa || '',
            estatisticas: estatisticasCompletas,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        createJogadorMutation.mutate(jogadorData, {
            onSuccess: () => {
                setSuccessMessage("Jogador adicionado com sucesso!")
                setIsSuccessModalOpen(true)
                resetJogador()
            },
            onError: (error) => {
                console.error('Erro ao criar jogador:', error)
                setSuccessMessage("Erro ao adicionar jogador!")
                setIsSuccessModalOpen(true)
            }
        })
    }

    const updateTime = (updatedTime: Time) => {
        // Com TanStack Query, a atualização da lista é automática
        setIsTimeModalOpen(false)
    }

    const toggleGroup = (groupId: string) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupId]: !prev[groupId]
        }))
    }

    return (
        <div className="bg-[#1C1C24] min-h-screen">
            <HeaderGeneral label="GERENCIAR TIMES E JOGADORES" />

            <div className="bg-[#272731] border-b border-gray-700 sticky top-20 z-10">
                <div className="max-w-7xl mx-auto px-4">
                    <nav className="flex justify-between">
                        <button
                            onClick={() => setActiveTab('time')}
                            className={`px-4 py-4 text-xl font-extrabold italic leading-[55px] tracking-[-1px] transition-colors relative ${activeTab === 'time'
                                ? 'text-[#63E300]'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            ADICIONAR TIME
                            {activeTab === 'time' && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#63E300]"></span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('jogador')}
                            className={`px-4 py-4 text-xl font-extrabold italic leading-[55px] tracking-[-1px] transition-colors relative ${activeTab === 'jogador'
                                ? 'text-[#63E300]'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            ADICIONAR JOGADOR
                            {activeTab === 'jogador' && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#63E300]"></span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('times-cadastrados')}
                            className={`px-4 py-4 text-xl font-extrabold italic leading-[55px] tracking-[-1px] transition-colors relative ${activeTab === 'times-cadastrados'
                                ? 'text-[#63E300]'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            TIMES CADASTRADOS
                            {activeTab === 'times-cadastrados' && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#63E300]"></span>
                            )}
                        </button>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {activeTab === 'time' && (
                    <div className="animate-fadeIn">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Adicionar Time</h2>
                            <span className="bg-[#272731] px-3 py-1 rounded-full text-xs text-gray-400">
                                Temporada {temporada}
                            </span>
                        </div>

                        <form
                            onSubmit={handleSubmit(onSubmitTime)}
                            className="bg-[#272731] rounded-xl shadow-lg overflow-hidden"
                        >
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {camposTime.map((field) => (
                                    <FormField
                                        key={field.id}
                                        label={field.label}
                                        id={field.id}
                                        register={register(field.id)}
                                        error={errors[field.id as keyof TimeFormData] as FieldError | undefined}
                                    />
                                ))}
                            </div>

                            <div className="bg-[#2C2C34] py-4 px-6 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={createTimeMutation.isPending}
                                    className="bg-[#63E300] text-black px-6 py-2 rounded-lg font-medium hover:bg-[#50B800] transition-colors disabled:opacity-50"
                                >
                                    {createTimeMutation.isPending ? 'Criando...' : 'Adicionar Time'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {activeTab === 'jogador' && (
                    <div className="animate-fadeIn">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Adicionar Jogador</h2>
                            <span className="bg-[#272731] px-3 py-1 rounded-full text-xs text-gray-400">
                                Temporada {jogadorTemporada}
                            </span>
                        </div>

                        {loading ? (
                            <div className="bg-[#272731] rounded-xl p-6 flex justify-center items-center h-64">
                                <div className="flex flex-col items-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#63E300] mb-3"></div>
                                    <p className="text-gray-400">Carregando times...</p>
                                </div>
                            </div>
                        ) : (
                            <form
                                onSubmit={handleSubmitJogador(onSubmitJogador)}
                                className="bg-[#272731] rounded-xl shadow-lg overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
                                        <FormField
                                            label="Time"
                                            id="timeId"
                                            register={registerJogador("timeId", {
                                                setValueAs: (v) => (v === "" ? undefined : Number(v)),
                                            })}
                                            error={jogadorErrors.timeId as FieldError | undefined}
                                            type="select"
                                            options={[
                                                { value: "", label: "Selecione um time" },
                                                ...times.map((time) => ({
                                                    value: time.id?.toString() || "",
                                                    label: `${time.nome} (${time.sigla})`
                                                }))
                                            ]}
                                        />

                                        {camposJogador.map((field) => (
                                            <FormField
                                                key={field.id}
                                                label={field.label}
                                                id={field.id}
                                                register={registerJogador(field.id as keyof JogadorFormData)}
                                                error={jogadorErrors[field.id as keyof JogadorFormData] as FieldError | undefined}
                                                type={field.options ? "select" : "text"}
                                                options={field.options?.map(option => ({
                                                    value: typeof option === 'string' ? option : option.value,
                                                    label: typeof option === 'string' ? option : option.label
                                                }))}
                                            />
                                        ))}
                                    </div>

                                    <div className="space-y-6">
                                        <h3 className="text-lg font-semibold text-white">Estatísticas</h3>
                                        {estatisticas.map((grupo) => (
                                            <div key={grupo.group} className="border border-gray-600 rounded-lg overflow-hidden">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleGroup(grupo.group)}
                                                    className="w-full flex items-center justify-between p-4 bg-[#2C2C34] hover:bg-[#3C3C44] transition-colors"
                                                >
                                                    <span className="text-white font-medium">
                                                        {(grupo as any).title || grupo.group}
                                                    </span>
                                                    <svg
                                                        className={`w-5 h-5 text-gray-400 transition-transform ${expandedGroups[grupo.group] ? 'rotate-180' : ''
                                                            }`}
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>
                                                <div
                                                    className={`transition-all duration-300 ease-in-out overflow-hidden ${expandedGroups[grupo.group]
                                                        ? 'max-h-[1000px] opacity-100'
                                                        : 'max-h-0 opacity-0'
                                                        }`}
                                                >
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
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-[#2C2C34] py-4 px-6 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={createJogadorMutation.isPending}
                                        className="bg-[#63E300] text-black px-6 py-2 rounded-lg font-medium hover:bg-[#50B800] transition-colors disabled:bg-gray-600 disabled:text-gray-400"
                                    >
                                        {createJogadorMutation.isPending ? 'Criando...' : 'Adicionar Jogador'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}

                {activeTab === 'times-cadastrados' && (
                    <div className="animate-fadeIn">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Times Cadastrados</h2>
                            <div className="flex items-center gap-4">
                                <select
                                    value={temporada}
                                    onChange={(e) => setTemporada(e.target.value)}
                                    className="bg-[#272731] border border-gray-600 rounded-lg text-white px-3 py-2"
                                >
                                    <option value="2024">Temporada 2024</option>
                                    <option value="2025">Temporada 2025</option>
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div className="bg-[#272731] rounded-xl p-6 flex justify-center items-center h-64">
                                <div className="flex flex-col items-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#63E300] mb-3"></div>
                                    <p className="text-gray-400">Carregando times...</p>
                                </div>
                            </div>
                        ) : times.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {times.map((time) => (
                                    <div
                                        key={time.id}
                                        className="bg-[#272731] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
                                        onClick={() => {
                                            setSelectedTime(time);
                                            setIsTimeModalOpen(true);
                                        }}
                                    >
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div
                                                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                                                    style={{ backgroundColor: time.cor || '#63E300' }}
                                                >
                                                    {time.sigla?.substring(0, 2) || 'T'}
                                                </div>
                                                <span className="text-xs text-gray-400 bg-[#1C1C24] px-2 py-1 rounded">
                                                    {time.temporada}
                                                </span>
                                            </div>

                                            <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
                                                {time.nome}
                                            </h3>

                                            <div className="space-y-2 text-sm text-gray-400">
                                                <div className="flex justify-between">
                                                    <span>Sigla:</span>
                                                    <span className="text-white">{time.sigla}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Cidade:</span>
                                                    <span className="text-white">{time.cidade}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Jogadores:</span>
                                                    <span className="text-white">{time._count?.jogadores || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-[#272731] rounded-xl p-12 text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-gray-400 mb-4">Nenhum time cadastrado para esta temporada</p>
                                <button
                                    onClick={() => setActiveTab('time')}
                                    className="bg-[#63E300] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#50B800] transition-colors"
                                >
                                    Adicionar Novo Time
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {isTimeModalOpen && selectedTime && (
                <ModalTime
                    time={selectedTime}
                    closeModal={() => setIsTimeModalOpen(false)}
                    openJogadorModal={(jogador) => {
                        setSelectedJogador(jogador);
                        setIsJogadorModalOpen(true);
                    }}
                    updateTime={updateTime}
                />
            )}

            {isJogadorModalOpen && selectedJogador && (
                <ModalJogador
                    jogador={selectedJogador}
                    closeModal={() => setIsJogadorModalOpen(false)}
                />
            )}

            {isSuccessModalOpen && (
                <ModalSucesso
                    mensagem={successMessage}
                    onClose={() => setIsSuccessModalOpen(false)}
                />
            )}

            <style jsx global>{`
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-in-out;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    )
}