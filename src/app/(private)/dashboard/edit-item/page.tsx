"use client";

import { Button } from "@/src/components/ui/Button";
import { CategoryItem } from "@/src/components/ui/CategoryItem";
import { InputField } from "@/src/components/ui/InputField";
import { CategoryKey } from "@/src/constants/categories";
import { Area, DayPeriod } from "@/src/types/item";
import { useState } from "react";
import { areaLabels } from "@/src/constants/areaLabels";

export default function EditLostItem() {

    const [name, setName] = useState("Marmita rosa com amarelo pequena");
    const [description, setDescription] = useState(
        "Essa marmita rosa com vários compartimentos foi encontrada pela tarde lá no RC. Estava com comida a qual foi retirada, pois estava fora da geladeira aparentemente há várias horas."
    );
    const [findingDate, setFindingDate] = useState("2025-06-20");
    const [area, setArea] = useState<Area | null>("CANTINA" as Area);
    const [dayPeriod, setDayPeriod] = useState<DayPeriod>("AFTERNOON");
    const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>("VASILHA" as CategoryKey);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    return (
        <main className="w-full flex flex-col px-4 py-4 md:ml-3 md:pl-6 pb-[90px] md:pb-0">
            <h1 className="text-lg md:text-xl font-semibold mb-4">
                Editar “{name}”
            </h1>

            <form className="flex flex-col gap-4 md:gap-6 w-full max-w-3xl">

                <InputField
                    label="Nome"
                    placeholder="Ex.: Marmita rosa com amarelo pequena"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <InputField
                    label="Descrição"
                    placeholder="Descreva o item..."
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <div className="flex flex-col w-full">
                    <label className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Local onde foi encontrado
                    </label>
                    <select
                        className="px-3 py-3 rounded-xl bg-[#ECECEC] dark:bg-[#292929] text-sm text-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                        value={area ?? ""}
                        onChange={(e) => setArea(e.target.value as Area)}
                    >
                        <option value="">Selecione uma das opções</option>
                        {Object.entries(areaLabels).map(([key, label]) => (
                            <option key={key} value={key}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>

                <InputField
                    label="Dia que encontraram"
                    type="date"
                    required
                    value={findingDate}
                    onChange={(e) => setFindingDate(e.target.value)}
                />

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Período do dia
                    </label>
                    <select
                        value={dayPeriod}
                        onChange={(e) => setDayPeriod(e.target.value as DayPeriod)}
                        className="px-3 py-3 rounded-xl bg-[#ECECEC] dark:bg-[#292929] text-sm text-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="MORNING">Manhã</option>
                        <option value="AFTERNOON">Tarde</option>
                        <option value="NIGHT">Noite</option>
                    </select>
                </div>

                <div className="flex flex-col gap-2">

                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Categoria
                    </label>
                    <CategoryItem handleCategorySelection={setSelectedCategory} />

                </div>

                <div className="flex flex-col gap-2">

                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Imagem do item
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        className="w-full px-3 py-3 rounded-xl bg-[#ECECEC] dark:bg-[#292929] text-sm text-gray-700 dark:text-gray-100 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-200 dark:file:bg-gray-700 file:text-gray-700 dark:file:text-gray-100"
                        onChange={handleImageChange}
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {imageFile ? imageFile.name : "IMG_2025_06_20_43874983.png"}
                    </span>

                </div>

                <div className="flex flex-col md:flex-row gap-3 md:justify-end mt-4">

                    <Button variant="secondary" className="md:w-40">
                        Cancelar
                    </Button>
                    <Button variant="primary" className="md:w-40">
                        Salvar alterações
                    </Button>
                    
                </div>
            </form>
        </main>
    );
}
