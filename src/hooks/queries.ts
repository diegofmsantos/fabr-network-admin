"use client"

import { useQuery } from '@tanstack/react-query'
import { createSlug, findPlayerBySlug, getPlayerSlug, getTeamSlug } from '@/utils/helpers/formatUrl'
import { useRouter, useSearchParams } from 'next/navigation'
import { queryKeys } from './queryKeys'
import { MateriasService } from '@/services/materias.service'
import { useTimes } from '@/hooks/useTimes'
import { useJogadores } from '@/hooks/useJogadores'

interface DataNotFoundError extends Error {
    code: 'NOT_FOUND';
    temporada: string;
    entityName?: string;
}

const createNotFoundError = (temporada: string, entityName?: string): DataNotFoundError => {
    const error = new Error(`Dados não encontrados para temporada ${temporada}`) as DataNotFoundError;
    error.code = 'NOT_FOUND';
    error.temporada = temporada;
    error.entityName = entityName;
    return error;
};

// Hook para obter a temporada dos parâmetros da URL
export function useTemporada(explicitTemporada?: string) {
    const searchParams = useSearchParams();
    let temporada = explicitTemporada || searchParams?.get('temporada') || '2025';

    if (temporada !== '2024' && temporada !== '2025') {
        console.warn(`Temporada inválida: ${temporada}, usando 2025`);
        temporada = '2025';
    }

    return temporada;
}

// Hook para notícias/matérias
export function useNoticias() {
    return useQuery({
        queryKey: queryKeys.materias.lists(),
        queryFn: () => MateriasService.getMaterias(),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
    })
}

// Hook para buscar time por nome/slug
export function useTeam(teamName: string | undefined, explicitTemporada?: string) {
    const temporada = useTemporada(explicitTemporada);
    const router = useRouter();
    const searchParams = useSearchParams();

    const { data: times = [], isLoading: timesLoading, error: timesError } = useTimes(temporada);

    return useQuery({
        queryKey: [...queryKeys.times.list(temporada), teamName],
        queryFn: async () => {
            if (!teamName) throw new Error("Nome do time não encontrado.");

            if (timesError && (timesError as DataNotFoundError).code === 'NOT_FOUND') {
                throw createNotFoundError(temporada, teamName);
            }

            if (!times.length && !timesLoading) {
                throw createNotFoundError(temporada, teamName);
            }

            console.log(`Buscando time: ${teamName} na temporada: ${temporada}`);

            const teamSlug = createSlug(teamName);
            let timeEncontrado = times.find(t => {
                if (!t.nome) return false;
                return getTeamSlug(t.nome) === teamSlug;
            });

            if (timeEncontrado) {
                console.log(`Time encontrado na temporada ${temporada}:`, timeEncontrado.nome);
                return timeEncontrado;
            }

            // Lógica especial para mudanças de nome entre temporadas
            if (temporada === '2025' && teamSlug === 'Parana-HP') {
                timeEncontrado = times.find(t =>
                    getTeamSlug(t.nome || '') === 'Calvary-Cavaliers'
                );

                if (timeEncontrado) {
                    console.log(`Time 'Paraná HP' encontrado como '${timeEncontrado.nome}' em 2025`);
                    const params = new URLSearchParams(searchParams?.toString() || '');
                    if (!params.has('temporada') && temporada) {
                        params.set('temporada', temporada);
                    }
                    const novaURL = `/${getTeamSlug(timeEncontrado.nome || '')}?${params.toString()}`;
                    setTimeout(() => {
                        router.replace(novaURL, { scroll: false });
                    }, 0);
                    return timeEncontrado;
                }
            }

            if (temporada === '2024' && teamSlug === 'Calvary-Cavaliers') {
                timeEncontrado = times.find(t =>
                    getTeamSlug(t.nome || '') === 'Parana-HP'
                );

                if (timeEncontrado) {
                    console.log(`Time 'Calvary Cavaliers' encontrado como '${timeEncontrado.nome}' em 2024`);
                    const params = new URLSearchParams(searchParams?.toString() || '');
                    if (!params.has('temporada') && temporada) {
                        params.set('temporada', temporada);
                    }
                    const novaURL = `/${getTeamSlug(timeEncontrado.nome || '')}?${params.toString()}`;
                    setTimeout(() => {
                        router.replace(novaURL, { scroll: false });
                    }, 0);
                    return timeEncontrado;
                }
            }

            console.log(`Time ${teamName} não encontrado em nenhuma temporada`);
            throw createNotFoundError(temporada, teamName);
        },
        enabled: !!teamName && !timesLoading,
        retry: false,
        staleTime: 1000 * 60 * 5,
    });
}

// Hook para detalhes de jogador específico
export function usePlayerDetails(
    timeSlug: string | undefined,
    jogadorSlug: string | undefined,
    temporada?: string
) {
    const urlTemporada = useTemporada(temporada);
    const currentTemporada = temporada || urlTemporada;
    const router = useRouter();

    const { data: jogadores = [], isLoading: jogadoresLoading, error: jogadoresError } = useJogadores(currentTemporada);
    const { data: times = [], isLoading: timesLoading, error: timesError } = useTimes(currentTemporada);

    return useQuery({
        queryKey: [...queryKeys.jogadores.list(currentTemporada), timeSlug, jogadorSlug],
        queryFn: async () => {
            if (jogadoresError && (jogadoresError as DataNotFoundError).code === 'NOT_FOUND') {
                throw createNotFoundError(currentTemporada, jogadorSlug);
            }

            if (timesError && (timesError as DataNotFoundError).code === 'NOT_FOUND') {
                throw createNotFoundError(currentTemporada, jogadorSlug);
            }

            if (!jogadores.length || !times.length || !timeSlug || !jogadorSlug) {
                if (!jogadoresLoading && !timesLoading) {
                    throw createNotFoundError(currentTemporada, jogadorSlug);
                }
                return null;
            }

            console.log(`Buscando jogador: ${jogadorSlug} do time: ${timeSlug} na temporada: ${currentTemporada}`);

            let jogadorEncontrado = findPlayerBySlug(jogadores, jogadorSlug, timeSlug, times);

            if (jogadorEncontrado && jogadorEncontrado.timeId) {
                const timeAtual = times.find(t => t.id === jogadorEncontrado?.timeId);

                if (timeAtual) {
                    const jogadorMudouDeTime = getTeamSlug(timeAtual.nome || '') !== createSlug(timeSlug);

                    if (jogadorMudouDeTime) {
                        console.log(`Jogador encontrado, mas em time diferente: ${timeAtual.nome}`);
                        const timeCorretoSlug = getTeamSlug(timeAtual.nome || '');
                        const jogadorSlugCorreto = getPlayerSlug(jogadorEncontrado.nome);

                        setTimeout(() => {
                            router.replace(`/${timeCorretoSlug}/${jogadorSlugCorreto}?temporada=${currentTemporada}`);
                        }, 0);
                    }

                    return {
                        jogador: jogadorEncontrado,
                        time: timeAtual,
                        jogadorMudouDeTime
                    };
                }
            }

            console.log(`Jogador ${jogadorSlug} não encontrado na temporada ${currentTemporada}`);
            throw createNotFoundError(currentTemporada, jogadorSlug);
        },
        enabled: !!timeSlug && !!jogadorSlug && !jogadoresLoading && !timesLoading,
        retry: false,
        staleTime: 1000 * 60 * 5,
    });
}