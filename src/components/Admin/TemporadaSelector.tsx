"use client"

import { ChevronDown } from 'lucide-react'
import { useTemporadaAdmin } from '@/hooks/useTemporadaAdmin'
import { TEMPORADAS_DISPONIVEIS, type Temporada } from '@/stores/temporadaStore'

interface TemporadaSelectorProps {
    className?: string
}

export function TemporadaSelector({ className = '' }: TemporadaSelectorProps) {
    const { temporada, setTemporada } = useTemporadaAdmin()

    return (
        <div className={`relative inline-block ${className}`}>
            <select
                value={temporada}
                onChange={(e) => setTemporada(e.target.value as Temporada)}
                suppressHydrationWarning
                aria-label="Selecionar temporada"
                className="appearance-none bg-[#272731] text-white text-sm font-semibold rounded-md border border-gray-700 pl-3 pr-9 py-2 hover:border-[#63E300] focus:outline-none focus:border-[#63E300] transition-colors cursor-pointer"
            >
                {TEMPORADAS_DISPONIVEIS.map((t) => (
                    <option key={t} value={t}>
                        Temporada {t}
                    </option>
                ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
    )
}

export default TemporadaSelector