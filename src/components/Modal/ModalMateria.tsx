"use client"

import { Materia } from '@/types/materia'
import { updateNoticia, deleteNoticia } from '@/api/api'
import { useState } from 'react'
import { Editor } from '../Editor/Editor'
import Image from 'next/image'
import { z } from 'zod'

interface MateriaFormData extends Omit<Materia, 'createdAt' | 'updatedAt'> {
    createdAt: string;
    updatedAt: string;
}

const MateriaSchema = z.object({
    id: z.number(),
    titulo: z.string().min(1, 'Título é obrigatório'),
    subtitulo: z.string().min(1, 'Subtítulo é obrigatório'),
    imagem: z.string().min(1, 'Imagem é obrigatória'),
    legenda: z.string().default(''),
    texto: z.string().min(1, 'Texto é obrigatório'),
    autor: z.string().min(1, 'Autor é obrigatório'),
    autorImage: z.string().min(1, 'Foto do autor é obrigatória'),
    createdAt: z.date(),
    updatedAt: z.date()
});

interface ModalMateriaProps {
    materia: Materia
    closeModal: () => void
    onUpdate: (updatedMateria: Materia) => void
}

export function ModalMateria({ materia, closeModal, onUpdate }: ModalMateriaProps) {
    const formatDateForInput = (date: Date) => {
        return new Date(date).toISOString().slice(0, 16);
    };

    const [formData, setFormData] = useState<MateriaFormData>({
        ...materia,
        createdAt: formatDateForInput(materia.createdAt),
        updatedAt: formatDateForInput(materia.updatedAt)
    });

    const [loading, setLoading] = useState(false)

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
            if (file.size > 5 * 1024 * 1024) { // 5MB
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
            if (file.size > 2 * 1024 * 1024) { // 2MB
                alert('A foto do autor deve ter no máximo 2MB')
                return
            }
            const reader = new FileReader()
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, autorImage: reader.result as string }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const materiaData = {
                ...formData,
                createdAt: new Date(formData.createdAt),
                updatedAt: new Date(formData.updatedAt)
            };

            const validatedData = MateriaSchema.parse(materiaData);
            const updatedMateria = await updateNoticia(materia.id, validatedData);
            onUpdate(updatedMateria);
            closeModal();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors = error.errors.map(err => err.message).join('\n');
                alert(`Erro de validação:\n${errors}`);
            } else {
                console.error('Erro ao atualizar:', error);
                alert('Erro ao atualizar matéria');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Tem certeza que deseja excluir esta matéria?')) {
            try {
                await deleteNoticia(materia.id)
                closeModal()
                window.location.reload()
            } catch (error) {
                console.error('Erro ao deletar:', error)
                alert('Erro ao deletar matéria')
            }
        }
    }


    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-[#272731] p-6 rounded-lg w-2/3 h-[90vh] relative flex flex-col">
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                    onClick={closeModal}
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
                            />
                        </div>

                        <div>
                            <label className="block text-white text-sm font-medium mb-2">Subtítulo</label>
                            <input
                                name="subtitulo"
                                value={formData.subtitulo}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-[#1C1C24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#63E300]"
                            />
                        </div>

                        <div>
                            <label className="block text-white text-sm font-medium mb-2">Imagem</label>
                            <input
                                type="file"
                                onChange={handleImageChange}
                                accept="image/*"
                                className="w-full px-3 py-2 bg-[#1C1C24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#63E300]"
                            />
                            {formData.imagem && (
                                <div className="mt-2 relative h-40 w-full">
                                    <Image
                                        src={formData.imagem}
                                        alt="Preview"
                                        fill
                                        className="object-cover rounded-lg"
                                    />
                                    {formData.legenda && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
                                            {formData.legenda}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-white text-sm font-medium mb-2">Legenda</label>
                            <input
                                name="legenda"
                                value={formData.legenda}
                                onChange={handleChange}
                                placeholder="Digite uma legenda para a imagem"
                                className="w-full px-3 py-2 bg-[#1C1C24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#63E300]"
                            />
                        </div>

                        <div>
                            <label className="block text-white text-sm font-medium mb-2">Texto</label>
                            <Editor
                                value={formData.texto}
                                onChange={(content) => setFormData(prev => ({ ...prev, texto: content }))}
                            />
                        </div>

                        <div>
                            <label className="block text-white text-sm font-medium mb-2">Autor</label>
                            <input
                                name="autor"
                                value={formData.autor}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-[#1C1C24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#63E300]"
                            />
                        </div>

                        <div>
                            <label className="block text-white text-sm font-medium mb-2">Foto do Autor</label>
                            <input
                                type="file"
                                onChange={handleAuthorImageChange}
                                accept="image/*"
                                className="w-full px-3 py-2 bg-[#1C1C24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#63E300]"
                            />
                            {formData.autorImage && (
                                <div className="mt-2 relative h-20 w-20">
                                    <Image
                                        src={formData.autorImage}
                                        alt="Author Preview"
                                        fill
                                        className="rounded-full object-cover"
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="createdAt" className="block text-white text-sm font-medium mb-2">
                                Data de Criação
                            </label>
                            <input
                                id="createdAt"
                                type="datetime-local"
                                value={formData.createdAt}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    createdAt: e.target.value
                                }))}
                                className="w-full px-3 py-2 bg-[#1C1C24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#63E300]"
                            />
                        </div>

                        <div>
                            <label htmlFor="updatedAt" className="block text-white text-sm font-medium mb-2">
                                Data de Atualização
                            </label>
                            <input
                                id="updatedAt"
                                type="datetime-local"
                                value={formData.updatedAt}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    updatedAt: e.target.value
                                }))}
                                className="w-full px-3 py-2 bg-[#1C1C24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#63E300]"
                            />
                        </div>
                    </div>
                </form>
                <div className="mt-6 flex justify-between items-center">
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Excluir
                    </button>
                    <div className="space-x-3">
                        <button
                            onClick={closeModal}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Fechar
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-4 py-2 bg-[#63E300] text-black rounded-lg hover:bg-[#50B800] transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}