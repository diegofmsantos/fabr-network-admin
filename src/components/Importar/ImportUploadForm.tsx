import React, { useState } from 'react'
import { Upload, FileText, Check, AlertTriangle, Loader2 } from 'lucide-react'
import { useImportarTimes } from '@/hooks/useTimes'
import { useAtualizarEstatisticas, useImportarJogadores } from '@/hooks/useJogadores'

const AdminUploadForm = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    id_jogo: '',
    data_jogo: '',
    tipo: 'times' 
  })

  // 🚀 HOOKS DO TANSTACK QUERY - SUBSTITUI fetch manual + loading states
  const importTimesMutation = useImportarTimes()
  const importJogadoresMutation = useImportarJogadores()
  const atualizarEstatisticasMutation = useAtualizarEstatisticas()

  // 🎯 ESTADO UNIFICADO DOS MUTATIONS
  const isUploading = importTimesMutation.isPending || 
                     importJogadoresMutation.isPending || 
                     atualizarEstatisticasMutation.isPending

  const error = importTimesMutation.error || 
                importJogadoresMutation.error || 
                atualizarEstatisticasMutation.error

  const isSuccess = importTimesMutation.isSuccess || 
                    importJogadoresMutation.isSuccess || 
                    atualizarEstatisticasMutation.isSuccess

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile) {
      alert('Selecione um arquivo para upload')
      return
    }

    // Validação para estatísticas
    if (formData.tipo === 'estatisticas') {
      if (!formData.id_jogo.trim() || !formData.data_jogo.trim()) {
        alert('ID do jogo e data são obrigatórios para estatísticas')
        return
      }
    }

    // 🎯 EXECUTA A MUTATION APROPRIADA
    try {
      switch (formData.tipo) {
        case 'times':
          importTimesMutation.mutate(selectedFile)
          break
          
        case 'jogadores':
          importJogadoresMutation.mutate(selectedFile)
          break
          
        case 'estatisticas':
          atualizarEstatisticasMutation.mutate({
            arquivo: selectedFile,
            idJogo: formData.id_jogo,
            dataJogo: formData.data_jogo
          })
          break
      }
    } catch (err) {
      console.error('Erro no upload:', err)
    }
  }

  // 🧹 RESET FORM APÓS SUCESSO
  const resetForm = () => {
    setSelectedFile(null)
    setFormData({ id_jogo: '', data_jogo: '', tipo: 'times' })
    
    // Reset mutations
    importTimesMutation.reset()
    importJogadoresMutation.reset()
    atualizarEstatisticasMutation.reset()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Tipo de Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tipo de Importação
          </label>
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleInputChange}
            className="w-full p-3 bg-[#1C1C24] border border-gray-600 rounded-lg text-white"
            disabled={isUploading}
          >
            <option value="times">Importar Times</option>
            <option value="jogadores">Importar Jogadores</option>
            <option value="estatisticas">Atualizar Estatísticas de Jogo</option>
          </select>
        </div>

        {/* Campos extras para estatísticas */}
        {formData.tipo === 'estatisticas' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                ID do Jogo
              </label>
              <input
                type="text"
                name="id_jogo"
                value={formData.id_jogo}
                onChange={handleInputChange}
                className="w-full p-3 bg-[#1C1C24] border border-gray-600 rounded-lg text-white"
                placeholder="Ex: JOGO001"
                disabled={isUploading}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Data do Jogo
              </label>
              <input
                type="date"
                name="data_jogo"
                value={formData.data_jogo}
                onChange={handleInputChange}
                className="w-full p-3 bg-[#1C1C24] border border-gray-600 rounded-lg text-white"
                disabled={isUploading}
                required
              />
            </div>
          </>
        )}

        {/* Upload de Arquivo */}
        <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          selectedFile ? 'border-[#63E300] bg-[#272731]' : 'border-gray-600 bg-[#1C1C24]'
        }`}>
          <input
            id="file-input"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
          <label htmlFor="file-input" className="cursor-pointer">
            <div className="flex flex-col items-center justify-center gap-2">
              <FileText size={48} className="text-[#63E300]" />
              {selectedFile ? (
                <span className="font-medium text-[#63E300]">{selectedFile.name}</span>
              ) : (
                <span className="text-gray-400">
                  Clique para selecionar uma planilha Excel
                </span>
              )}
              <span className="text-xs text-gray-500">(.xlsx, .xls)</span>
            </div>
          </label>
        </div>

        {/* Botão de Submit */}
        <button
          type="submit"
          disabled={isUploading || !selectedFile}
          className="w-full bg-[#63E300] text-black py-3 px-6 rounded-lg font-semibold hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 mr-2" />
              Importar Dados
            </>
          )}
        </button>
      </form>

      {/* 🎉 FEEDBACK VISUAL AUTOMÁTICO */}
      {isSuccess && (
        <div className="mt-6 p-4 bg-green-900/20 border border-green-500 rounded-lg">
          <div className="flex items-center text-green-400">
            <Check className="w-5 h-5 mr-2" />
            <span className="font-semibold">Importação realizada com sucesso!</span>
          </div>
          <button
            onClick={resetForm}
            className="mt-2 text-sm text-green-300 hover:text-green-200 underline"
          >
            Fazer nova importação
          </button>
        </div>
      )}

      {/* ❌ ERROR HANDLING AUTOMÁTICO */}
      {error && (
        <div className="mt-6 p-4 bg-red-900/20 border border-red-500 rounded-lg">
          <div className="flex items-center text-red-400">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <span className="font-semibold">Erro na importação</span>
          </div>
          <p className="text-red-300 text-sm mt-1">
            {error.message || 'Erro desconhecido. Tente novamente.'}
          </p>
          <button
            onClick={resetForm}
            className="mt-2 text-sm text-red-300 hover:text-red-200 underline"
          >
            Tentar novamente
          </button>
        </div>
      )}
    </div>
  )
}

export default AdminUploadForm