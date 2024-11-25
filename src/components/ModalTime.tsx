import { useState } from "react";
import { api } from "@/api/api";
import InputField from "@/components/InputField";
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md w-2/3 h-screen relative flex flex-col">
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                    onClick={closeModal}
                >
                    ✖
                </button>

                <h2 className="text-2xl font-bold mb-4">Editar Time</h2>

                <div className="overflow-y-auto flex-grow">
                    <div className="grid grid-cols-2 gap-4 mb-4">
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
                                <label className="block text-gray-700 font-medium mb-1">
                                    {label}
                                </label>
                                <InputField
                                    name={name}
                                    value={
                                        name.startsWith("titulos.")
                                            ? formData.titulos?.[name.split(".")[1]] || ""
                                            : formData[name] || ""
                                    }
                                    onChange={handleChange}
                                    placeholder={label}
                                />
                            </div>
                        ))}
                    </div>

                    <h3 className="text-xl font-bold mb-2">Jogadores</h3>
                    <InputField
                        name="filter"
                        value={filter}
                        onChange={handleFilterChange}
                        placeholder="Filtrar jogadores pelo nome"
                    />
                    <div className="overflow-y-auto border rounded-md p-2 mt-2">
                        <ul>
                            {filteredJogadores.map((jogador) => (
                                <li
                                    key={jogador.id}
                                    className="cursor-pointer text-blue-600 border-b"
                                    onClick={() => openJogadorModal(jogador)}
                                >
                                    {jogador.nome}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-4 flex justify-between gap-2">
                    <button
                        onClick={handleDelete}
                        className="bg-red-500 text-white px-4 py-2 rounded-md"
                    >
                        Excluir Time
                    </button>
                    <div>
                        <button
                            onClick={closeModal}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md"
                        >
                            Fechar
                        </button>
                        <button
                            onClick={handleSave}
                            className="bg-green-500 text-white px-4 py-2 rounded-md ml-2"
                        >
                            Salvar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
