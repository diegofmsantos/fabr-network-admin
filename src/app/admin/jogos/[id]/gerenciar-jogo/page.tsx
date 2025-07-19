"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Save, Calendar, MapPin, Users, Trophy, Clock, FileText } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useJogo, useGerenciarJogo } from '@/hooks/useJogos'
import { Loading } from '@/components/ui/Loading'
import { ImageService } from '@/utils/services/ImageService'

export default function GerenciarJogoPage() {
  const params = useParams()
  const router = useRouter()
  const jogoId = parseInt(params.id as string)

  const { data: jogo, isLoading } = useJogo(jogoId)
  const { mutate: atualizarJogo, isPending } = useGerenciarJogo()

  // Estados para todos os campos editáveis
  const [formData, setFormData] = useState({
    // Resultado
    placarCasa: 0,
    placarVisitante: 0,

    // Data e hora
    dataJogo: '',
    horaJogo: '',

    // Local e observações
    local: '',
    observacoes: '',

    // Status
    status: 'AGENDADO'
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Preencher dados quando o jogo carrega
  useEffect(() => {
    if (jogo) {
      const dataJogo = new Date(jogo.dataJogo)
      const dataFormatada = dataJogo.toISOString().split('T')[0] // YYYY-MM-DD
      const horaFormatada = dataJogo.toTimeString().slice(0, 5) // HH:MM

      setFormData({
        placarCasa: jogo.placarCasa || 0,
        placarVisitante: jogo.placarVisitante || 0,
        dataJogo: dataFormatada,
        horaJogo: horaFormatada,
        local: jogo.local || '',
        observacoes: jogo.observacoes || '',
        status: jogo.status || 'AGENDADO'
      })
    }
  }, [jogo])

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (formData.placarCasa < 0) {
      newErrors.placarCasa = 'Placar não pode ser negativo'
    }

    if (formData.placarVisitante < 0) {
      newErrors.placarVisitante = 'Placar não pode ser negativo'
    }

    if (!formData.dataJogo) {
      newErrors.dataJogo = 'Data é obrigatória'
    }

    if (!formData.horaJogo) {
      newErrors.horaJogo = 'Hora é obrigatória'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    // Combinar data e hora em um objeto Date
    const dataHoraCompleta = new Date(`${formData.dataJogo}T${formData.horaJogo}`)

    const dadosParaAtualizar = {
      placarCasa: formData.placarCasa,
      placarVisitante: formData.placarVisitante,
      dataJogo: dataHoraCompleta.toISOString(),
      local: formData.local.trim() || undefined,
      observacoes: formData.observacoes.trim() || undefined,
      status: formData.status
    }

    atualizarJogo({
      id: jogoId,
      dados: dadosParaAtualizar
    }, {
      onSuccess: () => {
        router.push(`/admin/jogos/${jogoId}`)
      }
    })
  }

  if (isLoading) return <Loading />

  if (!jogo) {
    return (
      <div className="min-h-screen bg-[#1C1C24] p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">Jogo não encontrado</h2>
          <Link
            href="/admin/jogos"
            className="text-[#63E300] hover:underline"
          >
            Voltar para lista de jogos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1C1C24] p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href={`/admin/jogos/${jogoId}`}
          className="p-2 rounded-lg bg-[#272731] border border-gray-700 hover:border-gray-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-white">Gerenciar Jogo</h1>
          <p className="text-gray-400">
            {jogo.timeCasa?.nome} vs {jogo.timeVisitante?.nome}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Info do Jogo (Readonly) */}
        <div className="bg-[#272731] rounded-lg border border-gray-700 p-6 mb-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#63E300]" />
            Informações do Jogo
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#63E300]" />
              <span className="text-gray-300">
                {jogo.fase} - Rodada {jogo.rodada}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#63E300]" />
              <span className="text-gray-300">
                ID do Jogo: {jogo.id}
              </span>
            </div>

            {(jogo as any).conferencia && (
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#63E300]" />
                <span className="text-gray-300">
                  {(jogo as any).conferencia}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Formulário de Gerenciamento */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Data e Horário */}
          <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Data e Horário
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Data do Jogo
                </label>
                <input
                  type="date"
                  value={formData.dataJogo}
                  onChange={(e) => handleInputChange('dataJogo', e.target.value)}
                  className={`w-full px-4 py-3 bg-[#1C1C24] border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#63E300] ${errors.dataJogo ? 'border-red-500' : 'border-gray-600'
                    }`}
                />
                {errors.dataJogo && (
                  <p className="text-red-400 text-sm mt-1">{errors.dataJogo}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Horário
                </label>
                <input
                  type="time"
                  value={formData.horaJogo}
                  onChange={(e) => handleInputChange('horaJogo', e.target.value)}
                  className={`w-full px-4 py-3 bg-[#1C1C24] border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#63E300] ${errors.horaJogo ? 'border-red-500' : 'border-gray-600'
                    }`}
                />
                {errors.horaJogo && (
                  <p className="text-red-400 text-sm mt-1">{errors.horaJogo}</p>
                )}
              </div>
            </div>
          </div>

          {/* Local */}
          <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Local do Jogo
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Estádio/Campo
              </label>
              <input
                type="text"
                value={formData.local}
                onChange={(e) => handleInputChange('local', e.target.value)}
                className="w-full px-4 py-3 bg-[#1C1C24] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#63E300]"
                placeholder="Ex: Estádio Municipal, Arena Central..."
              />
            </div>
          </div>

          {/* Resultado do Jogo */}
          <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Resultado do Jogo
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              {/* Time Casa */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Image
                    src={ImageService.getTeamLogo(jogo.timeCasa?.nome || '')}
                    alt={jogo.timeCasa?.nome || ''}
                    width={48}
                    height={48}
                    className="w-12 h-12 object-contain"
                    onError={(e) => ImageService.handleTeamLogoError(e, jogo.timeCasa?.nome || '')}
                  />
                  <div>
                    <h4 className="text-white font-semibold">
                      {jogo.timeCasa?.nome}
                    </h4>
                    <span className="text-gray-400 text-sm">Casa</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Placar
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.placarCasa}
                    onChange={(e) => handleInputChange('placarCasa', parseInt(e.target.value) || 0)}
                    className={`w-full px-4 py-3 bg-[#1C1C24] border rounded-md text-white text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-[#63E300] ${errors.placarCasa ? 'border-red-500' : 'border-gray-600'
                      }`}
                    placeholder="0"
                  />
                  {errors.placarCasa && (
                    <p className="text-red-400 text-sm mt-1">{errors.placarCasa}</p>
                  )}
                </div>
              </div>

              {/* VS */}
              <div className="flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-500">VS</span>
              </div>

              {/* Time Visitante */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Image
                    src={ImageService.getTeamLogo(jogo.timeVisitante?.nome || '')}
                    alt={jogo.timeVisitante?.nome || ''}
                    width={48}
                    height={48}
                    className="w-12 h-12 object-contain"
                    onError={(e) => ImageService.handleTeamLogoError(e, jogo.timeVisitante?.nome || '')}
                  />
                  <div>
                    <h4 className="text-white font-semibold">
                      {jogo.timeVisitante?.nome}
                    </h4>
                    <span className="text-gray-400 text-sm">Visitante</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Placar
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.placarVisitante}
                    onChange={(e) => handleInputChange('placarVisitante', parseInt(e.target.value) || 0)}
                    className={`w-full px-4 py-3 bg-[#1C1C24] border rounded-md text-white text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-[#63E300] ${errors.placarVisitante ? 'border-red-500' : 'border-gray-600'
                      }`}
                    placeholder="0"
                  />
                  {errors.placarVisitante && (
                    <p className="text-red-400 text-sm mt-1">{errors.placarVisitante}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Status e Observações */}
          <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Status e Observações
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status do Jogo
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-4 py-3 bg-[#1C1C24] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#63E300]"
                >
                  <option value="AGENDADO">Agendado</option>
                  <option value="AO VIVO">Ao Vivo</option>
                  <option value="FINALIZADO">Finalizado</option>
                  <option value="ADIADO">Adiado</option>
                  <option value="CANCELADO">Cancelado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Observações
                </label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => handleInputChange('observacoes', e.target.value)}
                  className="w-full px-4 py-3 bg-[#1C1C24] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#63E300]"
                  rows={3}
                  placeholder="Ex: Jogo interrompido por chuva, prorrogação..."
                />
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="flex gap-4">
            <Link
              href={`/admin/jogos/${jogoId}`}
              className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-gray-700 transition-colors text-center"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-[#63E300] text-black py-3 px-4 rounded-md font-semibold hover:bg-[#50B800] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}