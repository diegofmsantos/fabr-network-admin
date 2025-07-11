import { useDistribuirTimesAutomatico } from '@/hooks/useSuperliga'
import { Target, CheckCircle } from 'lucide-react'

interface DistribuirTimesButtonProps {
    temporada: string
    timesDistribuidos: number
}

export function DistribuirTimesButton({ temporada, timesDistribuidos }: DistribuirTimesButtonProps) {
    const distribuirTimes = useDistribuirTimesAutomatico()

    const jaDistribuido = timesDistribuidos > 0

    if (jaDistribuido) {
        return (
            <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="h-4 w-4" />
                <span>Times distribuídos ({timesDistribuidos}/32)</span>
            </div>
        )
    }

    return (
        <button
            onClick={() => distribuirTimes.mutate(temporada)}
            disabled={distribuirTimes.isPending}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
            {distribuirTimes.isPending ? (
                <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Distribuindo...
                </>
            ) : (
                <>
                    <Target className="h-4 w-4" />
                    Distribuir Times
                </>
            )}
        </button>
    )
}