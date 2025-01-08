import { useState } from "react";
import { api } from "@/api/api";
import InputField from "@/components/Formulario/InputField";
import { Time } from "@/types/time";

export default function ModalTime({
    time,
    closeModal,
    openJogadorModal,
    updateTime, // Adicionada prop
}: {
    time: Time;
    closeModal: () => void;
    openJogadorModal: (jogador: any) => void;
    updateTime: (updatedTime: Time) => void; // Função para atualizar o time
}) {
    // Inicializa o formulário garantindo a estrutura correta para titulos
    const initialFormData = {
        ...time,
        titulos: time.titulos?.[0] || { nacionais: "", conferencias: "", estaduais: "" }, // Usa o primeiro elemento do array ou cria um objeto vazio
        jogadores: time.jogadores || [],
    };

    const [formData, setFormData] = useState<typeof initialFormData>(initialFormData);
    const [filter, setFilter] = useState("");
    const [filteredJogadores, setFilteredJogadores] = useState(time.jogadores || []);

    // Atualiza os campos do formulário
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name.startsWith("titulos.")) {
            const field = name.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                titulos: {
                    ...prev.titulos,
                    [field]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    // Salva as alterações no backend
    const handleSave = async () => {
        try {
            const payload = {
                ...formData,
                titulos: [formData.titulos], // Reenvia como array
            };
            await api.put(`/time/${time.id}`, payload);
            alert("Time atualizado com sucesso!");
            updateTime(payload); // Atualiza o estado no componente pai
            closeModal();
        } catch (error) {
            console.error("Erro ao atualizar time:", error);
        }
    };

    // Deleta o time
    const handleDelete = async () => {
        if (confirm("Tem certeza que deseja excluir este time?")) {
            try {
                console.log("ID enviado para exclusão:", time.id); // Log do ID no frontend
                await api.delete(`/time/${time.id}`);
                alert("Time excluído com sucesso!");
                closeModal();
            } catch (error) {
                console.error("Erro ao excluir time:", error); // Log do erro no frontend
            }
        }
    };

    // Filtra os jogadores pelo nome
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setFilter(value);
        setFilteredJogadores(
            formData.jogadores.filter((jogador) =>
                jogador.nome.toLowerCase().includes(value)
            )
        );
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

                <h2 className="text-2xl font-bold text-white mb-6">Editar Time</h2>

                <div className="overflow-y-auto flex-grow">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {[
                            { name: "nome", label: "Nome do Time" },
                            { name: "sigla", label: "Sigla" },
                            { name: "cor", label: "Cor" },
                            { name: "cidade", label: "Cidade" },
                            { name: "bandeira_estado", label: "Bandeira do Estado" },
                            { name: "fundacao", label: "Fundação" },
                            { name: "instagram", label: "Instagram" },
                            { name: "instagram2", label: "Instagram 2" },
                            { name: "logo", label: "Logo" },
                            { name: "capacete", label: "Capacete" },
                            { name: "estadio", label: "Estádio" },
                            { name: "presidente", label: "Presidente" },
                            { name: "head_coach", label: "Head Coach" },
                            { name: "instagram_coach", label: "Instagram Coach" },
                            { name: "coord_ofen", label: "Coordenador Ofensivo" },
                            { name: "coord_defen", label: "Coordenador Defensivo" },
                            { name: "titulos.nacionais", label: "Títulos Nacionais" },
                            { name: "titulos.conferencias", label: "Títulos Conferências" },
                            { name: "titulos.estaduais", label: "Títulos Estaduais" },
                        ].map(({ name, label }) => (
                            <div key={name}>
                                <label className="block text-white text-sm font-medium mb-2">
                                    {label}
                                </label>
                                <input
                                    type="text"
                                    name={name} // @ts-ignore
                                    value={name.startsWith("titulos.") ? formData.titulos?.[name.split(".")[1]] || "" : formData[name] || ""}
                                    onChange={handleChange}
                                    placeholder={label}
                                    className="w-full px-3 py-2 bg-[#1C1C24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#63E300]"
                                />
                            </div>
                        ))}
                    </div>

                    <h3 className="text-xl font-bold text-white mb-4">Jogadores</h3>
                    <input
                        type="text"
                        value={filter}
                        onChange={handleFilterChange}
                        placeholder="Filtrar jogadores pelo nome"
                        className="w-full px-3 py-2 mb-4 bg-[#1C1C24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#63E300]"
                    />
                    <div className="bg-[#1C1C24] border border-gray-700 rounded-lg p-4">
                        <ul className="space-y-2">
                            {filteredJogadores.map((jogador) => (
                                <li
                                    key={jogador.id}
                                    onClick={() => openJogadorModal(jogador)}
                                    className="text-gray-300 hover:text-[#63E300] cursor-pointer transition-colors p-2 hover:bg-[#2C2C34] rounded border-b border-b-gray-100/10"
                                >
                                    {jogador.nome}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-6 flex justify-between items-center">
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Excluir Time
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
