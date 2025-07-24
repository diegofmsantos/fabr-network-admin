"use client"

import { useEffect, useState } from "react";
import { fieldGroups } from "@/utils/campos";
import { Time } from "@/types";
import { useUpdateTime, useDeleteTime } from '@/hooks/useTimes'
import Image from "next/image";
import { ImageService } from "@/utils/services/ImageService";

export default function ModalTime({
    time,
    closeModal,
    openJogadorModal,
    updateTime,
}: {
    time: Time;
    closeModal: () => void;
    openJogadorModal: (jogador: any) => void;
    updateTime: (updatedTime: Time) => void;
}) {

    const initialFormData = {
        ...time,
        titulos: (time.titulos && time.titulos.length > 0)
            ? time.titulos[0]
            : { nacionais: "", conferencias: "", estaduais: "" },
        jogadores: time.jogadores || [],
    };

    const [formData, setFormData] = useState<typeof initialFormData>(initialFormData);
    const [filter, setFilter] = useState("");
    const [filteredJogadores, setFilteredJogadores] = useState(time.jogadores || []);
    const [activeTab, setActiveTab] = useState<'info' | 'jogadores'>('info');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setFilteredJogadores(formData.jogadores || []);
    }, [formData.jogadores]);

    const updateTimeMutation = useUpdateTime()
    const deleteTimeMutation = useDeleteTime()

    const isLoading = updateTimeMutation.isPending || deleteTimeMutation.isPending || isSubmitting

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name.startsWith("titulos.")) {
            const field = name.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                titulos: {
                    ...prev.titulos,
                    [field]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSave = () => {
        const payload = {
            ...formData,
            titulos: [formData.titulos],
        };

        updateTimeMutation.mutate({
            id: time.id,
            data: payload
        }, {
            onSuccess: (updatedTime) => {
                updateTime(updatedTime);
                closeModal();
            }
        });
    };

    const handleDelete = async () => {
        if (confirm("Tem certeza que deseja excluir este time?")) {
            deleteTimeMutation.mutate(time.id, {
                onSuccess: () => {
                    closeModal();
                }
            });
        }
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setFilter(value);
        setFilteredJogadores(
            formData.jogadores?.filter((jogadorTime) =>
                jogadorTime.jogador?.nome.toLowerCase().includes(value)
            ) || []
        );
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm"
                onClick={closeModal}
            ></div>
            <div className="absolute inset-12 bg-[#272731] rounded-xl shadow-lg overflow-hidden flex flex-col">
                <div className="bg-[#1C1C24] px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <div
                            className="w-8 h-8 rounded-md mr-3 flex items-center justify-center"
                            style={{ backgroundColor: formData.cor || '#63E300' }}
                        >
                            <span className="text-white font-bold">{formData.sigla?.substring(0, 1)}</span>
                        </div>
                        <h2 className="text-xl font-bold text-white">
                            {formData.nome || 'Editar Time'}
                        </h2>
                    </div>

                    <button
                        className="text-gray-400 hover:text-white transition-colors"
                        onClick={closeModal}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="bg-[#1C1C24] px-6 border-t border-gray-800">
                    <div className="flex space-x-1">
                        <button
                            onClick={() => setActiveTab('info')}
                            className={`px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === 'info'
                                ? 'text-[#63E300]'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Informações do Time
                            {activeTab === 'info' && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#63E300]"></span>
                            )}
                        </button>

                        <button
                            onClick={() => setActiveTab('jogadores')}
                            className={`px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === 'jogadores'
                                ? 'text-[#63E300]'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Jogadores ({formData.jogadores.length})
                            {activeTab === 'jogadores' && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#63E300]"></span>
                            )}
                        </button>
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto p-6">
                    {activeTab === 'info' && (
                        <div className="space-y-6 animate-fadeIn">
                            {fieldGroups.map((group, groupIndex) => (
                                <div key={groupIndex} className="bg-[#1C1C24] rounded-lg p-5">
                                    <h3 className="text-[#63E300] font-semibold mb-4 text-sm uppercase tracking-wide">
                                        {group.title}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {group.fields.map((field) => (
                                            <div key={field.name}>
                                                <label className="block text-white text-sm font-medium mb-2">
                                                    {field.label}
                                                </label>
                                                <input
                                                    type="text"
                                                    name={field.name}
                                                    value={field.name.startsWith("titulos.")
                                                        ? (formData.titulos as any)?.[field.name.split(".")[1]] || ""
                                                        : (formData as any)[field.name] || ""
                                                    }
                                                    onChange={handleChange}
                                                    placeholder={field.label}
                                                    className="w-full px-3 py-2 bg-[#272731] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#63E300]"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'jogadores' && (
                        <div className="animate-fadeIn">
                            <div className="bg-[#1C1C24] p-4 rounded-lg mb-4">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        value={filter}
                                        onChange={handleFilterChange}
                                        placeholder="Buscar jogador por nome..."
                                        className="block w-full pl-10 pr-3 py-2 bg-[#272731] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#63E300]"
                                    />
                                </div>
                            </div>

                            {filteredJogadores.length > 0 ? (
                                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                                    {filteredJogadores.map((jogadorTime, index) => (
                                        <div className="flex-1">
                                            <div
                                                key={jogadorTime.id || index}
                                                className="bg-[#1C1C24]  flex justify-between px-4 items-center rounded-lg p-2 border border-gray-800 hover:border-[#63E300] transition-all duration-200 cursor-pointer hover:-translate-y-1"
                                                style={{
                                                    boxShadow: `0 4px 12px ${time.cor}20, 0 0 0 1px ${time.cor}10`
                                                }}
                                                onClick={() => openJogadorModal(jogadorTime)}
                                            >
                                                {/* Imagem da Camisa */}
                                                <div className="relative w-12 h-12 rounded-md overflow-hidden bg-[#272731]">
                                                    {jogadorTime.camisa ? (
                                                        <Image
                                                            src={ImageService.getPlayerShirt(time.nome, jogadorTime.camisa)}
                                                            alt={`Camisa ${jogadorTime.camisa}`}
                                                            width={48}
                                                            height={48}
                                                            className="w-full h-full object-contain"
                                                            onError={(e) => {
                                                                // Fallback para avatar com inicial do nome
                                                                const target = e.currentTarget;
                                                                const parent = target.parentElement;
                                                                if (parent) {
                                                                    parent.innerHTML = `
                                                <div class="w-full h-full bg-gradient-to-br from-[#63E300] to-[#50B800] rounded-md flex items-center justify-center">
                                                    <span class="text-black font-bold text-sm">${jogadorTime.nome?.charAt(0)?.toUpperCase() || '?'}</span>
                                                </div>
                                            `;
                                                                }
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-[#63E300] to-[#50B800] rounded-md flex items-center justify-center">
                                                            <span className="text-black font-bold text-sm">
                                                                {jogadorTime.nome?.charAt(0)?.toUpperCase() || '?'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                {/* Nome do Jogador */}
                                                <div className="text-center mt-3">
                                                    <h4 className="text-white font-medium text-xs leading-tight line-clamp-2 h-8 flex items-center justify-center px-1">
                                                        {jogadorTime.nome || 'Nome não disponível'}
                                                    </h4>
                                                </div>
                                                <div className="text-center flex justify-center items-center gap-2">
                                                    <div className="text-gray-300 text-xs font-bold">
                                                        #{jogadorTime.numero}
                                                    </div>
                                                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${jogadorTime.setor === 'Ataque'
                                                        ? 'bg-blue-500/20 text-blue-400'
                                                        : jogadorTime.setor === 'Defesa'
                                                            ? 'bg-red-500/20 text-red-400'
                                                            : 'bg-purple-500/20 text-purple-400'
                                                        }`}>
                                                        {jogadorTime.posicao || 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-[#1C1C24] p-6 rounded-lg text-center border-2 border-dashed border-gray-700">
                                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-white font-medium text-sm mb-2">
                                        {filter ? 'Nenhum jogador encontrado' : 'Nenhum jogador cadastrado'}
                                    </h3>
                                    <p className="text-gray-400 text-xs">
                                        {filter
                                            ? `Nenhum jogador encontrado com o termo "${filter}"`
                                            : 'Este time ainda não possui jogadores cadastrados'
                                        }
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="bg-[#1C1C24] px-6 py-4 border-t border-gray-800 flex justify-between">
                    <button
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Excluindo...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Excluir Time
                            </>
                        )}
                    </button>

                    <div className="space-x-3 flex">
                        <button
                            onClick={closeModal}
                            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            Cancelar
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-[#63E300] text-black rounded-lg hover:bg-[#50B800] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Salvar Alterações
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-in-out;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}