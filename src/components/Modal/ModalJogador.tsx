"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { estatisticasGroups } from "@/utils/stats";
import { jogadorGroups } from "@/utils/jogador";
import { Estatisticas, Jogador } from "@/types";
import { useUpdateJogador, useDeleteJogador } from '@/hooks/useJogadores'
import { TrendingUp, BarChart3, X, Trash2, Save, User, Info } from "lucide-react"
import ModalEstatisticasJogo from "./ModalEstatisticaJogo";

interface ModalJogadorProps {
    jogador: Jogador;
    closeModal: () => void;
}

export default function ModalJogador({ jogador, closeModal }: ModalJogadorProps) {
    const router = useRouter();

    const [formData, setFormData] = useState({
        ...jogador,
        altura: jogador.altura !== undefined ? String(jogador.altura).replace(".", ",") : "",
        temporada: jogador.times?.[0]?.temporada || "2025",
        estatisticas: jogador.estatisticas || {
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
        },
        camisa: jogador.camisa
    });

    const [activeTab, setActiveTab] = useState<'info' | 'estatisticas'>('info');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showEstatisticasJogo, setShowEstatisticasJogo] = useState(false);

    const updateJogadorMutation = useUpdateJogador()
    const deleteJogadorMutation = useDeleteJogador()

    const isLoading = updateJogadorMutation.isPending || deleteJogadorMutation.isPending || isSubmitting

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === "altura" || name === "idade" || name === "peso"
                ? value.replace(",", ".")
                : value,
        }));
    };

    const handleStatisticChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const [groupKey, fieldKey] = name.split(".") as [keyof Estatisticas, string];

        setFormData((prev) => {
            const estatisticas = { ...prev.estatisticas } as Estatisticas;

            if (!estatisticas[groupKey]) {
                estatisticas[groupKey] = {} as any;
            }

            (estatisticas[groupKey] as any)[fieldKey] = value === ""
                ? 0
                : (fieldKey.startsWith("fg") ? value : Number(value));

            return { ...prev, estatisticas };
        });
    };

    const handleSave = () => {
        const altura = formData.altura
            ? Number(String(formData.altura).replace(',', '.'))
            : undefined;

        const peso = formData.peso
            ? Number(String(formData.peso))
            : undefined;

        const idade = formData.idade
            ? Number(String(formData.idade))
            : undefined;

        const experiencia = formData.experiencia
            ? Number(String(formData.experiencia))
            : undefined;

        const numero = formData.numero
            ? Number(String(formData.numero))
            : undefined;

        setIsSubmitting(true);

        const jogadorData = {
            ...formData,
            altura,
            peso,
            idade,
            experiencia,
            numero,
            timeId: jogador.timeId,
            temporada: formData.temporada,
            camisa: formData.camisa,
            estatisticas: formData.estatisticas
        };

        updateJogadorMutation.mutate(
            { id: jogador.id!, data: jogadorData },
            {
                onSuccess: () => {
                    setIsSubmitting(false);
                    closeModal();
                },
                onError: (error) => {
                    console.error('Erro ao atualizar jogador:', error);
                    setIsSubmitting(false);
                }
            }
        );
    };

    const handleDelete = () => {
        if (confirm(`Tem certeza que deseja excluir o jogador ${jogador.nome}?`)) {
            deleteJogadorMutation.mutate(jogador.id!, {
                onSuccess: () => {
                    closeModal();
                },
                onError: (error) => {
                    console.error('Erro ao excluir jogador:', error);
                }
            });
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-[#272731] rounded-lg w-[90%] max-w-4xl max-h-[90vh] overflow-hidden">

                    {/* Header */}
                    <div className="bg-[#1C1C24] p-6 border-b border-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <User className="w-8 h-8 text-[#63E300]" />
                                <div>
                                    <h2 className="text-2xl font-bold text-white">
                                        {jogador.nome}
                                    </h2>
                                    <p className="text-sm text-gray-400">
                                        {jogador.times?.[0]?.time?.nome || 'Time não definido'} • #{jogador.numero}
                                    </p>
                                </div>
                            </div>

                            {/* Botões de ação */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowEstatisticasJogo(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#63E300] hover:bg-[#52B800] text-black font-semibold rounded transition-colors"
                                    disabled={isLoading}
                                >
                                    <BarChart3 className="w-4 h-4" />
                                    Estatísticas por Jogo
                                </button>

                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-white transition-colors"
                                    disabled={isLoading}
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Informações básicas do jogador */}
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <span className="text-gray-400">Posição:</span>
                                <span className="text-white ml-2 font-semibold">{jogador.posicao}</span>
                            </div>
                            <div>
                                <span className="text-gray-400">Setor:</span>
                                <span className="text-white ml-2 font-semibold">{jogador.setor}</span>
                            </div>
                            <div>
                                <span className="text-gray-400">Idade:</span>
                                <span className="text-white ml-2 font-semibold">{jogador.idade} anos</span>
                            </div>
                            <div>
                                <span className="text-gray-400">Temporada:</span>
                                <span className="text-white ml-2 font-semibold">{formData.temporada}</span>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-[#272731] border-b border-gray-700">
                        <nav className="flex">
                            <button
                                onClick={() => setActiveTab('info')}
                                className={`px-6 py-4 text-sm font-medium transition-colors relative flex items-center gap-2 ${activeTab === 'info'
                                    ? 'text-[#63E300] border-b-2 border-[#63E300]'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                                disabled={isLoading}
                            >
                                <Info className="w-4 h-4" />
                                Informações
                            </button>
                            <button
                                onClick={() => setActiveTab('estatisticas')}
                                className={`px-6 py-4 text-sm font-medium transition-colors relative flex items-center gap-2 ${activeTab === 'estatisticas'
                                    ? 'text-[#63E300] border-b-2 border-[#63E300]'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                                disabled={isLoading}
                            >
                                <TrendingUp className="w-4 h-4" />
                                Estatísticas Consolidadas
                            </button>
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
                        {activeTab === 'info' && (
                            <div className="space-y-6">
                                {/* Seção de Informações Pessoais */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {jogadorGroups.map((group, groupIndex) => (
                                        <div key={groupIndex} className="space-y-4">
                                            <h3 className="text-lg font-semibold text-[#63E300] border-b border-gray-600 pb-2">
                                                {group.title}
                                            </h3>
                                            <div className="space-y-3">
                                                {group.fields.map((field) => (
                                                    <div key={field.name}>
                                                        <label className="block text-sm text-gray-400 mb-1">
                                                            {field.label}
                                                        </label>
                                                        {field.type === 'select' ? (
                                                            <select
                                                                name={field.name}
                                                                value={formData[field.name as keyof typeof formData] as string || ''}
                                                                onChange={handleChange}
                                                                disabled={isLoading}
                                                                className="w-full px-3 py-2 bg-[#1C1C24] border border-gray-600 rounded text-white focus:border-[#63E300] focus:outline-none disabled:opacity-50"
                                                            >
                                                                <option value="">Selecione...</option>
                                                                {field.options?.map((option, optionIndex) => (
                                                                    <option key={optionIndex} value={option}>
                                                                        {option}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        ) : (
                                                            <input
                                                                type={field.type}
                                                                name={field.name}
                                                                value={formData[field.name as keyof typeof formData] as string || ''}
                                                                onChange={handleChange}
                                                                disabled={isLoading}
                                                                className="w-full px-3 py-2 bg-[#1C1C24] border border-gray-600 rounded text-white focus:border-[#63E300] focus:outline-none disabled:opacity-50 placeholder-gray-500"
                                                            />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'estatisticas' && (
                            <div className="space-y-6">
                                {/* Aviso sobre estatísticas consolidadas */}
                                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <TrendingUp className="w-5 h-5 text-blue-400 mt-0.5" />
                                        <div>
                                            <h4 className="text-blue-300 font-semibold mb-1">Estatísticas Consolidadas</h4>
                                            <p className="text-blue-200 text-sm">
                                                Estas são as estatísticas totais da temporada (soma de todos os jogos).
                                                Para editar estatísticas de jogos específicos, use o botão "Estatísticas por Jogo" acima.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Estatísticas por categoria */}
                                {estatisticasGroups.map((group, groupIndex) => (
                                    <div key={groupIndex} className="space-y-4">
                                        <h3 className="text-lg font-semibold text-[#63E300] border-b border-gray-600 pb-2">
                                            {group.title}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {group.fields.map((field, fieldIndex) => (
                                                <div key={fieldIndex}>
                                                    <label className="block text-sm text-gray-400 mb-1">
                                                        {field.label}
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name={`${group.id}.${field.id}`}
                                                        value={(formData.estatisticas?.[group.id as keyof Estatisticas] as any)?.[field.id] ?? ''}
                                                        onChange={handleStatisticChange}
                                                        disabled={isLoading}
                                                        min="0"
                                                        className="w-full px-3 py-2 bg-[#1C1C24] border border-gray-600 rounded text-white focus:border-[#63E300] focus:outline-none disabled:opacity-50"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="bg-[#1C1C24] p-6 border-t border-gray-700 flex justify-between">
                        <button
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors disabled:opacity-50"
                        >
                            <Trash2 className="w-4 h-4" />
                            {deleteJogadorMutation.isPending ? 'Excluindo...' : 'Excluir'}
                        </button>

                        <div className="flex gap-3">
                            <button
                                onClick={closeModal}
                                disabled={isLoading}
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isLoading}
                                className="flex items-center gap-2 px-4 py-2 bg-[#63E300] hover:bg-[#52B800] text-black font-semibold rounded transition-colors disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {updateJogadorMutation.isPending ? 'Salvando...' : 'Salvar'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Estatísticas por Jogo */}
            {showEstatisticasJogo && (
                <ModalEstatisticasJogo
                    jogador={jogador}
                    closeModal={() => setShowEstatisticasJogo(false)}
                />
            )}
        </>
    );
}