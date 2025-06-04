"use client"

import { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateCampeonato } from '@/hooks/useCampeonatos'
import { useTimes } from '@/hooks/queries'
import { ArrowLeft, Save, Eye } from 'lucide-react'
import Link from 'next/link'
import { CampeonatoForm } from '@/components/Admin/forms/CampeonatoForm'
import { CriarCampeonatoRequest } from '@/types/campeonato'

// Componente principal separado
function CriarCampeonatoContent() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<CriarCampeonatoRequest>({
    nome: '',
    temporada: '2025',
    tipo: 'REGULAR',
    dataInicio: '',
    dataFim: undefined, 
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
   <div className="min-h-screen bg-[#1C1C24]">
    {/* Header */}
    <div className="bg-[#272731] shadow-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-6">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/campeonatos"
              className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Criar Novo Campeonato</h1>
              <p className="text-sm text-gray-400">
                Passo {currentStep} de {steps.length}: {steps[currentStep - 1]?.name}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-[#1C1C24] px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-700 hover:bg-gray-700 transition-colors"
            >
              <Eye className="h-4 w-4 mr-2" />
              Prévia
            </button>

            {currentStep === steps.length && (
              <button
                onClick={handleSubmit}
                disabled={createMutation.isPending || !canProceed()}
                className="inline-flex items-center rounded-md bg-[#63E300] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-[#50B800] disabled:opacity-50 transition-colors"
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
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-left transition-colors ${
                  step.id === currentStep
                    ? 'bg-[#1C1C24] border-[#63E300] text-[#63E300] border-l-4'
                    : step.id < currentStep
                      ? 'text-white hover:text-[#63E300] hover:bg-[#1C1C24]'
                      : 'text-gray-400 hover:text-white hover:bg-[#1C1C24]'
                }`}
              >
                <span
                  className={`flex-shrink-0 -ml-1 mr-3 h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    step.id === currentStep
                      ? 'bg-[#63E300] text-black'
                      : step.id < currentStep
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-600 text-gray-300'
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

// Loading fallback component
function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-[#1C1C24] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#63E300]"></div>
    </div>
  )
}

// Componente principal com Suspense
export default function CriarCampeonato() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CriarCampeonatoContent />
    </Suspense>
  )
}