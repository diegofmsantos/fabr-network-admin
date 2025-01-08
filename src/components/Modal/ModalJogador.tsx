import { useState } from "react";
import { atualizarJogador, deletarJogador } from "@/api/api";
import InputField from "@/components/Formulario/InputField";
import { Estatisticas, Jogador } from "@/types/jogador";

export default function ModalJogador({
    jogador,
    closeModal,
}: {
    jogador: Jogador;
    closeModal: () => void;
}) {
    const [formData, setFormData] = useState<Jogador & { altura: string }>({
        ...jogador, // @ts-ignore
        altura: jogador.altura !== undefined ? String(jogador.altura).replace(".", ",") : "",
        estatisticas: jogador.estatisticas || {
            passe: { passes_completos: 0, passes_tentados: 0, jardas_de_passe: 0, td_passados: 0, interceptacoes_sofridas: 0, sacks_sofridos: 0, fumble_de_passador: 0 },
            corrida: { corridas: 0, jardas_corridas: 0, tds_corridos: 0, fumble_de_corredor: 0 },
            recepcao: { recepcoes: 0, alvo: 0, jardas_recebidas: 0, tds_recebidos: 0, fumble_de_recebedor: 0 },
            retorno: { retornos: 0, jardas_retornadas: 0, td_retornados: 0, fumble_retornador: 0 },
            defesa: { tackles_totais: 0, tackles_for_loss: 0, sacks_forcado: 0, fumble_forcado: 0, interceptacao_forcada: 0, passe_desviado: 0, safety: 0, td_defensivo: 0 },
            kicker: { xp_bons: 0, tentativas_de_xp: 0, fg_bons: 0, tentativas_de_fg: 0, fg_mais_longo: 0, fg_0_10: "0/0", fg_11_20: "0/0", fg_21_30: "0/0", fg_31_40: "0/0", fg_41_50: "0/0" },
            punter: { punts: 0, jardas_de_punt: 0 },
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === "altura" || name === "idade" || name === "peso"
                ? value.replace(",", ".")
                : value,
        }));
    };

    const handleStatisticChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const [groupKey, fieldKey] = name.split(".") as [keyof Estatisticas, string];

        // @ts-ignore
        setFormData((prev) => {
            const estatisticas = { ...prev.estatisticas };
            if (!estatisticas[groupKey]) {
                // @ts-ignore
                estatisticas[groupKey] = {};
            }

            // @ts-ignore
            estatisticas[groupKey][fieldKey] =
                groupKey === "kicker" && fieldKey.startsWith("fg")
                    ? value // Aceita valores como "1/1"
                    : value === "" ? 0 : Number(value); // Valores vazios viram 0

            return { ...prev, estatisticas };
        });
    };

    const handleSave = async () => {
        try {
            const dataToSave = {
                ...formData, // @ts-ignore
                altura: parseFloat(formData.altura.replace(",", ".")), // Converte altura para número
                // @ts-ignore
                peso: parseFloat(formData.peso), // Converte peso para número
                // @ts-ignore
                idade: parseInt(formData.idade, 10), // Converte idade para número
                // @ts-ignore
                experiencia: parseInt(formData.experiencia, 10), // Converte experiência para número
                // @ts-ignore
                numero: parseInt(formData.numero, 10), // Converte número para número
            };

            // Ajusta estatísticas para evitar valores inválidos
            const estatisticasCorrigidas = Object.fromEntries(
                Object.entries(dataToSave.estatisticas || {}).map(([groupKey, fields]) => [
                    groupKey,
                    Object.fromEntries(
                        Object.entries(fields || {}).filter(
                            ([_, value]) => value !== undefined && value !== ""
                        )
                    ),
                ])
            );

            // @ts-ignore
            dataToSave.estatisticas = estatisticasCorrigidas;

            // Utilize a função `atualizarJogador` para fazer a atualização
            // @ts-ignore
            await atualizarJogador({ ...dataToSave, id: jogador.id });
            alert("Jogador atualizado com sucesso!");
            closeModal();
        } catch (error) {
            console.error("Erro ao atualizar jogador:", error);
            alert("Erro ao salvar alterações.");
        }
    };

    const handleDelete = async () => {
        try {
            const confirmDelete = confirm("Tem certeza que deseja excluir este jogador?");
            if (!confirmDelete) return;

            // Usar a função reutilizável para deletar jogador
            await deletarJogador(jogador.id);
            alert("Jogador excluído com sucesso!");
            closeModal();
        } catch (error) {
            console.error("Erro ao excluir jogador:", error);
            alert("Erro ao excluir jogador. Verifique os logs para mais detalhes.");
        }
    };

    const estatisticasOrdem = {
        passe: ["passes_completos", "passes_tentados", "jardas_de_passe", "td_passados", "interceptacoes_sofridas", "sacks_sofridos", "fumble_de_passador"],
        corrida: ["corridas", "jardas_corridas", "tds_corridos", "fumble_de_corredor"],
        recepcao: ["recepcoes", "alvo", "jardas_recebidas", "tds_recebidos", "fumble_de_recebedor"],
        retorno: ["retornos", "jardas_retornadas", "td_retornados", "fumble_retornador"],
        defesa: ["tackles_totais", "tackles_for_loss", "sacks_forcado", "fumble_forcado", "interceptacao_forcada", "passe_desviado", "safety", "td_defensivo"],
        kicker: ["xp_bons", "tentativas_de_xp", "fg_bons", "tentativas_de_fg", "fg_mais_longo", "fg_0_10", "fg_11_20", "fg_21_30", "fg_31_40", "fg_41_50"],
        punter: ["punts", "jardas_de_punt"],
    };


    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-[#272731] p-6 rounded-lg w-2/3 h-[90vh] relative flex flex-col">
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                    onClick={closeModal}
                >
                    ✖
                </button>

                <h2 className="text-2xl font-bold text-white mb-6">Editar Jogador</h2>

                <div className="overflow-y-auto flex-grow">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-white text-sm font-medium mb-2">Nome</label>
                            <input
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                placeholder="Nome do Jogador"
                                className="w-full px-3 py-2 bg-[#1C1C24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#63E300]"
                            />
                        </div>

                        <div>
                            <label className="block text-white text-sm font-medium mb-2">Time Formador</label>
                            <input
                                name="timeFormador"
                                value={formData.timeFormador}
                                onChange={handleChange}
                                placeholder="Time Formador"
                                className="w-full px-3 py-2 bg-[#1C1C24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#63E300]"
                            />
                        </div>

                        <div>
                            <label className="block text-white text-sm font-medium mb-2">Posição</label>
                            <input
                                name="posicao"
                                value={formData.posicao}
                                onChange={handleChange}
                                placeholder="Posição"
                                className="w-full px-3 py-2 bg-[#1C1C24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#63E300]"
                            />
                        </div>

                        <div>
                            <label className="block text-white text-sm font-medium mb-2">Setor</label>
                            <select
                                name="setor"
                                value={formData.setor}
                                onChange={(e) => setFormData((prev) => ({ ...prev, setor: e.target.value as "Ataque" | "Defesa" | "Special" }))}
                                className="w-full px-3 py-2 bg-[#1C1C24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#63E300]"
                            >
                                <option value="">Selecione uma opção</option>
                                <option value="Ataque">Ataque</option>
                                <option value="Defesa">Defesa</option>
                                <option value="Special">Special</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-white text-sm font-medium mb-2">Cidade</label>
                            <input
                                name="cidade"
                                value={formData.cidade}
                                onChange={handleChange}
                                placeholder="Cidade"
                                className="w-full px-3 py-2 bg-[#1C1C24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#63E300]"
                            />
                        </div>

                        <div>
                            <label className="block text-white text-sm font-medium mb-2">Nacionalidade</label>
                            <input
                                name="nacionalidade"
                                value={formData.nacionalidade}
                                onChange={handleChange}
                                placeholder="Nacionalidade"
                                className="w-full px-3 py-2 bg-[#1C1C24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#63E300]"
                            />
                        </div>

                        <div>
                            <label className="block text-white text-sm font-medium mb-2">Instagram</label>
                            <input
                                name="instagram"
                                value={formData.instagram}
                                onChange={handleChange}
                                placeholder="Instagram"
                                className="w-full px-3 py-2 bg-[#1C1C24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#63E300]"
                            />
                        </div>

                        <div>
                            <label className="block text-white text-sm font-medium mb-2">@</label>
                            <input
                                name="instagram2"
                                value={formData.instagram2}
                                onChange={handleChange}
                                placeholder="@"
                                className="w-full px-3 py-2 bg-[#1C1C24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#63E300]"
                            />
                        </div>

                        <div>
                            <label className="block text-white text-sm font-medium mb-2">Camisa</label>
                            <input
                                name="camisa"
                                value={formData.camisa}
                                onChange={handleChange}
                                placeholder="Camisa"
                                className="w-full px-3 py-2 bg-[#1C1C24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#63E300]"
                            />
                        </div>

                        <div>
                            <label className="block text-white text-sm font-medium mb-2">Experiência</label>
                            <input
                                name="experiencia"
                                value={formData.experiencia}
                                onChange={handleChange}
                                placeholder="Experiência"
                                className="w-full px-3 py-2 bg-[#1C1C24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#63E300]"
                            />
                        </div>

                        <div>
                            <label className="block text-white text-sm font-medium mb-2">Número</label>
                            <input
                                name="numero"
                                value={formData.numero}
                                onChange={handleChange}
                                placeholder="Número"
                                className="w-full px-3 py-2 bg-[#1C1C24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#63E300]"
                            />
                        </div>

                        <div>
                            <label className="block text-white text-sm font-medium mb-2">Idade</label>
                            <input
                                name="idade"
                                value={formData.idade}
                                onChange={handleChange}
                                placeholder="Idade"
                                className="w-full px-3 py-2 bg-[#1C1C24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#63E300]"
                            />
                        </div>

                        <div>
                            <label className="block text-white text-sm font-medium mb-2">Altura</label>
                            <input
                                name="altura"
                                value={formData.altura}
                                onChange={handleChange}
                                placeholder="Altura (ex: 1.75 ou 1,75)"
                                className="w-full px-3 py-2 bg-[#1C1C24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#63E300]"
                            />
                        </div>

                        <div>
                            <label className="block text-white text-sm font-medium mb-2">Peso</label>
                            <input
                                name="peso"
                                value={formData.peso}
                                onChange={handleChange}
                                placeholder="Peso"
                                className="w-full px-3 py-2 bg-[#1C1C24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#63E300]"
                            />
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-4">Estatísticas</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {Object.entries(estatisticasOrdem).map(([group, fields]) => (
                            <div key={group} className="bg-[#1C1C24] border border-gray-700 rounded-lg p-4">
                                <h4 className="text-lg font-bold text-white mb-4 capitalize">{group}</h4>
                                {fields.map((field) => (
                                    <div key={field} className="mb-3">
                                        <label className="block text-gray-300 text-sm font-medium mb-1">
                                            {field.replace(/_/g, " ").toUpperCase()}
                                        </label>
                                        <input
                                            type="text"
                                            name={`${group}.${field}`} //@ts-ignore
                                            value={formData.estatisticas[group]?.[field] ?? 0}
                                            onChange={handleStatisticChange}
                                            className="w-full px-3 py-2 bg-[#1C1C24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#63E300]"
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6 flex justify-between items-center">
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Excluir
                    </button>
                    <div className="space-x-3">
                        <button
                            onClick={closeModal}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Fechar
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-[#63E300] text-black rounded-lg hover:bg-[#50B800] transition-colors"
                        >
                            Salvar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}