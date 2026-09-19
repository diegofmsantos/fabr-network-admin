"use client"

import { ChevronDown } from 'lucide-react'
import { useTemporadaAdmin } from '@/hooks/useTemporadaAdmin'
import { DIVISOES_DISPONIVEIS, type Divisao } from '@/stores/temporadaStore'

interface DivisaoSelectorProps {
    className?: string
}

export function DivisaoSelector({ className = '' }: DivisaoSelectorProps) {
    const { divisao, setDivisao } = useTemporadaAdmin()

    return (
        <div className={`relative inline-block ${className}`}>
            <select
                value={divisao}
                onChange={(e) => setDivisao(e.target.value as Divisao)}
                suppressHydrationWarning
                aria-label="Selecionar divisão"
                className="appearance-none bg-[#272731] text-white text-sm font-semibold rounded-md border border-gray-700 pl-3 pr-9 py-2 hover:border-[#63E300] focus:outline-none focus:border-[#63E300] transition-colors cursor-pointer"
            >
                {DIVISOES_DISPONIVEIS.map((d) => (
                    <option key={d} value={d}>
                        Divisão {d}
                    </option>
                ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
    )
}

export default DivisaoSelector
