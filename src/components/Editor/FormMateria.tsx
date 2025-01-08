"use client"

import { useEffect, useState } from 'react'
import { Editor } from './Editor'
import { InputField } from './InputField'
import { FormField } from './FormField'
import { createNoticia, getNoticias } from '@/api/api'
import Link from 'next/link'
import { Materia } from '@/types/materia'
import { ModalMateria } from '../Modal/ModalMateria'
import Image from 'next/image'

export const FormMateria = () => {
  const [formData, setFormData] = useState({
    titulo: '',
    subtitulo: '',
    imagem: '',
    legenda: '',
    texto: '',
    autor: '',
    autorImage: ''
  })

  const [materias, setMaterias] = useState<Materia[]>([])
  const [selectedMateria, setSelectedMateria] = useState<Materia | null>(null)

  useEffect(() => {
    const loadMaterias = async () => {
      try {
        const data = await getNoticias()
        setMaterias(data)
      } catch (error) {
        console.error('Erro ao carregar notícias:', error)
      }
    }
    loadMaterias()
  }, [])

  const handleUpdateMateria = (updatedMateria: Materia) => {
    setMaterias(prev => prev.map(m => m.id === updatedMateria.id ? updatedMateria : m))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Salva a nova matéria usando a função `createNoticia`
      const novaNoticia = await createNoticia(formData);

      // Log para verificar se salvou, obtendo todas as notícias da API
      const noticiasAtualizadas = await getNoticias();
      console.log('Notícias salvas:', noticiasAtualizadas);

      alert('Matéria criada com sucesso!');
      // Você pode adicionar redirecionamento aqui se quiser
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar a matéria');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-[#272731] p-6 rounded-lg shadow">
        <Link
          href={`/`}
          className="w-44 h-12 font-bold text-lg bg-[#63E300] p-2 text-center rounded-md absolute right-6 top-6 text-black hover:bg-[#50B800] transition-colors"
        >
          Painel de Times
        </Link>
        <h1 className="text-2xl font-bold text-white mb-6">Nova Matéria</h1>

        <div className="space-y-6">
          <FormField label="Título">
            <InputField
              value={formData.titulo}
              onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
              placeholder="Digite o título da matéria"
            />
          </FormField>

          <FormField label="Subtítulo">
            <InputField
              value={formData.subtitulo}
              onChange={(e) => setFormData(prev => ({ ...prev, subtitulo: e.target.value }))}
              placeholder="Digite o subtítulo"
            />
          </FormField>

          <FormField label="Imagem Principal">
            <InputField
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onloadend = () => {
                    setFormData(prev => ({ ...prev, imagem: reader.result as string }))
                  }
                  reader.readAsDataURL(file)
                }
              }}
              accept="image/*"
            />
          </FormField>

          <FormField label="Legenda">
            <InputField
              value={formData.legenda}
              onChange={(e) => setFormData(prev => ({ ...prev, legenda: e.target.value }))}
              placeholder="Digite a legenda"
            />
          </FormField>

          <FormField label="Texto">
            <Editor
              value={formData.texto}
              onChange={(content) => setFormData(prev => ({ ...prev, texto: content }))}
            />
          </FormField>

          <FormField label="Autor">
            <InputField
              value={formData.autor}
              onChange={(e) => setFormData(prev => ({ ...prev, autor: e.target.value }))}
              placeholder="Nome do autor"
            />
          </FormField>

          <FormField label="Foto do Autor">
            <InputField
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onloadend = () => {
                    setFormData(prev => ({ ...prev, autorImage: reader.result as string }))
                  }
                  reader.readAsDataURL(file)
                }
              }}
              accept="image/*"
            />
          </FormField>

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              className="bg-[#63E300] text-black px-6 py-2 rounded-lg font-medium hover:bg-[#50B800] transition-colors"
            >
              Salvar
            </button>
          </div>
        </div>
      </form>

      {/* Nova seção de listagem */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-white mb-6">Matérias Publicadas</h2>
        <div className="grid grid-cols-2 gap-4">
          {materias.map((materia) => (
            <div
              key={materia.id}
              className="bg-[#1C1C24] p-4 rounded-lg cursor-pointer hover:bg-[#2C2C34] transition-colors"
              onClick={() => setSelectedMateria(materia)}
            >
              <div className="relative h-40 w-full mb-4">
                <Image
                  src={materia.imagem}
                  alt={materia.titulo}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <h3 className="text-white font-bold mb-2">{materia.titulo}</h3>
              <p className="text-gray-400 text-sm mb-4">{materia.subtitulo}</p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="relative w-8 h-8">
                    <Image
                      src={materia.autorImage}
                      alt={materia.autor}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <span className="text-gray-400">{materia.autor}</span>
                </div>
                <span className="text-gray-500">
                  {new Date(materia.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de edição */}
      {selectedMateria && (
        <ModalMateria
          materia={selectedMateria}
          closeModal={() => setSelectedMateria(null)}
          onUpdate={handleUpdateMateria}
        />
      )}
    </div>
  )
}