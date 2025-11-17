"use client"

import { useState } from 'react'
import { Editor } from '../Editor/Editor'
import Image from 'next/image'
import { Materia } from '@/types'
import { useUpdateMateria, useDeleteMateria } from '@/hooks/useMaterias'

interface MateriaFormData extends Omit<Materia, 'createdAt' | 'updatedAt'> {
    createdAt: string;
    updatedAt: string;
}

interface ModalMateriaProps {
    materia: Materia
    closeModal: () => void
    onUpdate: () => void
}

export function ModalMateria({ materia, closeModal, onUpdate }: ModalMateriaProps) {
    const formatDateForInput = (dateString: string) => {
        const data = new Date(dateString);
        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const dia = String(data.getDate()).padStart(2, '0');
        const hora = String(data.getHours()).padStart(2, '0');
        const minuto = String(data.getMinutes()).padStart(2, '0');
        return `${ano}-${mes}-${dia}T${hora}:${minuto}`;
    };

    const [formData, setFormData] = useState<MateriaFormData>({
        ...materia,
        createdAt: formatDateForInput(materia.createdAt),
        updatedAt: formatDateForInput(materia.updatedAt)
    });

    const updateMateriaMutation = useUpdateMateria()
    const deleteMateriaMutation = useDeleteMateria()

    const isLoading = updateMateriaMutation.isPending || deleteMateriaMutation.isPending

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('A imagem deve ter no máximo 5MB')
                return
            }
            const reader = new FileReader()
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, imagem: reader.result as string }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleAuthorImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('A foto do autor deve ter no máximo 5MB')
                return
            }
            const reader = new FileReader()
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, autorImage: reader.result as string }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const criarDataISO = (dateTimeLocal: string) => {
            const data = new Date(dateTimeLocal)
            const offset = data.getTimezoneOffset()
            const dataAjustada = new Date(data.getTime() - (offset * 60 * 1000))
            return dataAjustada.toISOString()
        }

        const materiaData = {
            ...formData,
            createdAt: criarDataISO(formData.createdAt),
            updatedAt: new Date().toISOString(),
            legenda: formData.legenda || null
        }

        updateMateriaMutation.mutate({
            id: materia.id,
            data: materiaData
        }, {
            onSuccess: () => {
                onUpdate()
                closeModal()
            }
        })
    }

    const handleDelete = () => {
        if (confirm('Tem certeza que deseja excluir esta matéria? Esta ação não pode ser desfeita.')) {
            deleteMateriaMutation.mutate(materia.id, {
                onSuccess: () => {
                    closeModal()
                }
            })
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-[#272731] p-6 rounded-lg w-2/3 h-[90vh] relative flex flex-col">
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                    onClick={closeModal}
                    disabled={isLoading}
                >
                    ✖
                </button>

                <h2 className="text-2xl font-bold text-white mb-6">Editar Matéria</h2>

                <form onSubmit={handleSubmit} className="overflow-y-auto flex-grow">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-white text-sm font-medium mb-2">Título</label>
                            <input
                                name="titulo"
                                value={formData.titulo}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-[#1C1C24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#63E300]"
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-white text-sm font-medium mb-2">Subtítulo</label>
                            <input
                                name="subtitulo"
                                value={formData.subtitulo}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-[#1C1C24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#63E300]"
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-white text-sm font-medium mb-2">Imagem</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full px-3 py-2 bg-[#1C1C24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#63E300]"
                                disabled={isLoading}
                            />
                            {formData.imagem && (
                                <div className="mt-2">
                                    <Image
                                        src={formData.imagem}
                                        alt="Preview"
                                        width={200}
                                        height={100}
                                        className="rounded object-cover"
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-white text-sm font-medium mb-2">Legenda da Imagem</label>
                            <input
                                name="legenda"
                                value={formData.legenda || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-[#1C1C24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#63E300]"
                                disabled={isLoading}
                                placeholder="Digite a legenda da imagem (opcional)"
                            />
                        </div>

                        <div>
                            <label className="block text-white text-sm font-medium mb-2">Autor</label>
                            <input
                                name="autor"
                                value={formData.autor}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-[#1C1C24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#63E300]"
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-white text-sm font-medium mb-2">Foto do Autor</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAuthorImageChange}
                                className="w-full px-3 py-2 bg-[#1C1C24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#63E300]"
                                disabled={isLoading}
                            />
                            {formData.autorImage && (
                                <div className="mt-2">
                                    <Image
                                        src={formData.autorImage}
                                        alt="Preview do autor"
                                        width={80}
                                        height={80}
                                        className="rounded-full object-cover"
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-white text-sm font-medium mb-2">Conteúdo</label>
                            <div className="bg-[#1C1C24] border border-gray-700 rounded-lg p-3">
                                <Editor
                                    value={formData.texto}
                                    onChange={(value) => setFormData(prev => ({ ...prev, texto: value }))}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white text-sm font-medium mb-2">Data de Criação</label>
                                <input
                                    type="datetime-local"
                                    name="createdAt"
                                    value={formData.createdAt}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-[#1C1C24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#63E300]"
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label className="block text-white text-sm font-medium mb-2">Data de Atualização</label>
                                <input
                                    type="datetime-local"
                                    name="updatedAt"
                                    value={formData.updatedAt}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-[#1C1C24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#63E300]"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between gap-4 mt-8 pt-4 border-t border-gray-700">
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isLoading}
                            className={`px-6 py-2 bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center
                                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-500'}`}
                        >
                            {deleteMateriaMutation.isPending ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Excluindo...
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Excluir
                                </>
                            )}
                        </button>

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={isLoading}
                                className="px-6 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-500 transition-colors"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`px-6 py-2 bg-[#63E300] text-black rounded-lg font-medium transition-colors flex items-center
                                    ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#50B800]'}`}
                            >
                                {updateMateriaMutation.isPending ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Salvar Alterações
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}