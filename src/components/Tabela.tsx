import { getTimes } from "@/api/api"
import { Time } from "@/types/time"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

export const Tabela = () => {

    const [times, setTimes] = useState<Time[]>([])
    const [loading, setLoading] = useState(true)

    // Fetch dos times quando o componente é montado
    useEffect(() => {
        const fetchTimes = async () => {
            try {
                const data = await getTimes()
                setTimes(data)
            } catch (error) {
                console.error("Erro ao buscar os times:", error)
            } finally {
                setLoading(false);
            }
        }

        fetchTimes()
    }, [])


    return (
        <div className="my-8 grid grid-cols-5">
            {times.sort((a, b) => (a.sigla ?? '').localeCompare(b.sigla ?? '')).map(item => (
                <Link href={`/${item.nome}`} key={item.id} className="border h-8 p-1 flex justify-center items-center gap-4 hover:bg-slate-200">
                    <div>{item.nome}</div> -
                    <div>{item.sigla}</div>
                </Link>
            ))}
        </div>
    )
}

