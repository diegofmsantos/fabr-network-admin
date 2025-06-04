"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateCampeonato } from '@/hooks/useCampeonatos'
import { useTimes } from '@/hooks/queries'
import { ArrowLeft, Save, Eye } from 'lucide-react'
import Link from 'next/link'
import { CampeonatoForm } from '@/components/Admin/forms/CampeonatoForm'
import { CriarCampeonatoRequest } from '@/types/campeonato'

export default function CriarCampeonato() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<CriarCampeonatoRequest>({
    nome: '',
    temporada: '2025',
    tipo: 'REGULAR',
    dataInicio: '',
    dataFim: undefined, // ✅ Opcional agora
    descricao: '',
    formato: {
      tipoDisputa: 'PONTOS_CORRIDOS',
      numeroRodadas: 10,
      temGrupos: true,
      numeroGrupos: 4,
      timesGrupo: 8,
      classificadosGrupo: 2,
      temPlayoffs: false,
      formatoPlayoffs: ''
    },
    grupos: [],
    gerarJogos: true
  })

  const { data: times = [] } = useTimes(formData.temporada)
  const createMutation = useCreateCampeonato()

  const steps = [
    { id: 1, name: 'Informações Básicas', description: 'Nome, tipo e datas' },
    { id: 2, name: 'Formato', description: 'Configurações do campeonato' },
    { id: 3, name: 'Times e Grupos', description: 'Distribuição dos times' },
    { id: 4, name: 'Revisão', description: 'Confirmar e criar' }
  ]

  const handleSubmit = async () => {
    try {
      const result = await createMutation.mutateAsync(formData)
      router.push(`/admin/campeonatos/${result.id}`)
    } catch (error) {
      console.error('Erro ao criar campeonato:', error)
      alert('Erro ao criar campeonato')
    }
  }

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!(formData.nome && formData.dataInicio && formData.temporada)
      case 2:
        return formData.formato.numeroRodadas > 0
      case 3:
        const grupos = formData.grupos || []
        return grupos.length > 0 && grupos.every(g => (g.times || []).length > 0)
      case 4:
        return true
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/campeonatos"
                className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Criar Novo Campeonato</h1>
                <p className="text-sm text-gray-500">
                  Passo {currentStep} de {steps.length}: {steps[currentStep - 1]?.name}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <Eye className="h-4 w-4 mr-2" />
                Prévia
              </button>

              {currentStep === steps.length && (
                <button
                  onClick={handleSubmit}
                  disabled={createMutation.isPending || !canProceed()}
                  className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {createMutation.isPending ? 'Criando...' : 'Criar Campeonato'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
          {/* Steps Sidebar */}
          <aside className="py-6 px-2 sm:px-6 lg:col-span-3 lg:py-0 lg:px-0">
            <nav className="space-y-1">
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-left ${step.id === currentStep
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : step.id < currentStep
                      ? 'text-green-600 hover:text-green-900'
                      : 'text-gray-900 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                  <span
                    className={`flex-shrink-0 -ml-1 mr-3 h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium ${step.id === currentStep
                      ? 'bg-blue-500 text-white'
                      : step.id < currentStep
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-700'
                      }`}
                  >
                    {step.id < currentStep ? '✓' : step.id}
                  </span>
                  <div>
                    <div className="font-medium">{step.name}</div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <div className="space-y-6 sm:px-6 lg:col-span-9 lg:px-0">
            <CampeonatoForm
              currentStep={currentStep}
              formData={formData}
              onChange={setFormData}
              times={times}
              onNext={() => setCurrentStep(prev => Math.min(prev + 1, steps.length))}
              onPrevious={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
              canProceed={canProceed()}
              isLastStep={currentStep === steps.length}
            />
          </div>
        </div>
      </div>
    </div>
  )
}