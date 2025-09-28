import { Button } from "@/src/components/ui/Button";
import { CategoryItem } from "@/src/components/ui/CategoryItem";
import { InputField } from "@/src/components/ui/InputField";
import { CategoryKey } from "@/src/constants/categories";
import { useState } from "react";

export default function RegisterLostItem() {
    const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: implementar lógica para registrar item
        console.log("Item registrado!");
    };

    return (
        <main className="w-full flex flex-col">
            {/* Header */}
            <h1 className="text-lg md:text-xl font-semibold mb-4">
                Registrar novo item perdido
            </h1>

            {/* Formulário */}
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 md:gap-6 max-w-3xl"
            >
                {/* Nome */}
                <InputField
                    label="Nome"
                    placeholder="Ex.: Marmita rosa com amarelo pequena"
                    required
                />

                {/* Descrição */}
                <InputField
                    label="Descrição"
                    placeholder="Ex.: Essa marmita rosa com amarelo foi encontrada..."
                    required
                />

                {/* Local */}
                <div className="flex flex-col w-full">
                    <label className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Local onde foi encontrado
                    </label>
                    <select
                        className="px-3 py-3 rounded-xl bg-[#ECECEC] dark:bg-[#292929] text-sm text-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                    >
                        <option value="">Selecione uma das opções</option>
                        <option value="biblioteca">Biblioteca</option>
                        <option value="cantina">Cantina</option>
                        <option value="sala">Sala de aula</option>
                        <option value="outro">Outro</option>
                    </select>
                </div>

                {/* Nome de quem encontrou */}
                <InputField
                    label="Nome de quem encontrou"
                    placeholder="Digite o nome"
                    required
                />

                {/* Data */}
                <InputField
                    label="Dia que encontraram"
                    type="date"
                    required
                />

                {/* Categorias */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Categoria
                    </label>
                    <CategoryItem handleCategorySelection={setSelectedCategory} />
                </div>

                {/* Imagem */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Imagem do item
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        className="w-full px-3 py-3 rounded-xl bg-[#ECECEC] dark:bg-[#292929] text-sm text-gray-700 dark:text-gray-100 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-200 dark:file:bg-gray-700 file:text-gray-700 dark:file:text-gray-100"
                    />
                </div>

                {/* Botões */}
                <div className="flex flex-col md:flex-row gap-3 md:justify-end mt-4">
                    <Button variant="secondary" className="md:w-40">
                        Cancelar
                    </Button>
                    <Button variant="primary" className="md:w-40">
                        Registrar item
                    </Button>
                </div>
            </form>
        </main>
    );
}