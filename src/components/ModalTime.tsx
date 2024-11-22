import { useState } from "react";
import { api } from "@/api/api";
import InputField from "@/components/InputField"; // Importa o componente reutilizável

export default function ModalTime({
    time,
    closeModal,
    openJogadorModal,
}: {
    time: any;
    closeModal: () => void;
    openJogadorModal: (jogador: any) => void;
}) {
    const [formData, setFormData] = useState(time);
    const [filter, setFilter] = useState(""); // Estado para o filtro de jogadores
    const [filteredJogadores, setFilteredJogadores] = useState(time.jogadores);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = async () => {
        try {
            await api.put(`/time/${time.id}`, formData); // Atualiza o time no banco de dados
            alert("Time atualizado com sucesso!");
            closeModal();
        } catch (error) {
            console.error("Erro ao atualizar time:", error);
        }
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setFilter(value);
        setFilteredJogadores(
            time.jogadores.filter((jogador: any) =>
                jogador.nome.toLowerCase().includes(value)
            )
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md w-2/3 h-screen relative flex flex-col">
                {/* Botão para fechar o modal */}
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                    onClick={closeModal}
                >
                    ✖
                </button>

                <h2 className="text-2xl font-bold mb-4">Editar Time</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Usando o componente InputField */}
                    <InputField
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        placeholder="Nome do Time"
                    />
                    <InputField
                        name="sigla"
                        value={formData.sigla}
                        onChange={handleChange}
                        placeholder="Sigla"
                    />
                    <InputField
                        name="cor"
                        value={formData.cor}
                        onChange={handleChange}
                        placeholder="Cor"
                    />
                    <InputField
                        name="cidade"
                        value={formData.cidade}
                        onChange={handleChange}
                        placeholder="Cidade"
                    />
                    <InputField
                        name="fundacao"
                        value={formData.fundacao}
                        onChange={handleChange}
                        placeholder="Fundação"
                    />
                    <InputField
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleChange}
                        placeholder="Instagram"
                    />
                    <InputField
                        name="instagram2"
                        value={formData.instagram2}
                        onChange={handleChange}
                        placeholder="Instagram 2"
                    />
                    <InputField
                        name="logo"
                        value={formData.logo}
                        onChange={handleChange}
                        placeholder="Logo"
                    />
                    <InputField
                        name="capacete"
                        value={formData.capacete}
                        onChange={handleChange}
                        placeholder="Capacete"
                    />
                    <InputField
                        name="estadio"
                        value={formData.estadio}
                        onChange={handleChange}
                        placeholder="Estádio"
                    />
                    <InputField
                        name="presidente"
                        value={formData.presidente}
                        onChange={handleChange}
                        placeholder="Presidente"
                    />
                    <InputField
                        name="head_coach"
                        value={formData.head_coach}
                        onChange={handleChange}
                        placeholder="Head Coach"
                    />
                    <InputField
                        name="coord_ofen"
                        value={formData.coord_ofen}
                        onChange={handleChange}
                        placeholder="Coordenador Ofensivo"
                    />
                    <InputField
                        name="coord_defen"
                        value={formData.coord_defen}
                        onChange={handleChange}
                        placeholder="Coordenador Defensivo"
                    />
                    <InputField
                        name="titulos.nacionais"
                        value={formData.titulos?.nacionais}
                        onChange={handleChange}
                        placeholder="Títulos Nacionais"
                    />
                    <InputField
                        name="titulos.conferencias"
                        value={formData.titulos?.conferencias}
                        onChange={handleChange}
                        placeholder="Títulos Conferências"
                    />
                    <InputField
                        name="titulos.estaduais"
                        value={formData.titulos?.estaduais}
                        onChange={handleChange}
                        placeholder="Títulos Estaduais"
                    />
                </div>

                <h3 className="text-xl font-bold mb-2">Jogadores</h3>
                <InputField
                    name="filter"
                    value={filter}
                    onChange={handleFilterChange}
                    placeholder="Filtrar jogadores pelo nome"
                />
                <div
                    className="overflow-y-auto border rounded-md p-2 mt-2"
                >
                    <ul>
                        {filteredJogadores.map((jogador: any) => (
                            <li
                                key={jogador.id}
                                className="cursor-pointer text-blue-600 border-b "
                                onClick={() => openJogadorModal(jogador)}
                            >
                                {jogador.nome}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-auto flex justify-end gap-2">
                    <button
                        onClick={closeModal}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md"
                    >
                        Fechar
                    </button>
                    <button
                        onClick={handleSave}
                        className="bg-green-500 text-white px-4 py-2 rounded-md"
                    >
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    );
}
