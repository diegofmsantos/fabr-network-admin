"use client"

import { useState } from 'react'
import { Editor } from './Editor'
import { InputField } from './InputField'
import { FormField } from './FormField'
import { NoticiasService } from '@/services/localStorage'
import { createNoticia, getNoticias } from '@/api/api'

export const FormMateria = () => {
  const [formData, setFormData] = useState({
    titulo: '',
    subtitulo: '',
    imagem: '',
    texto: '',
    autor: '',
    autorImage: ''
  })

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
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-[#272731] p-6 rounded-lg shadow">
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
  )
}