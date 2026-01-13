"use client";

import { createItem, uploadItemImage } from "@/src/api/endpoints/item";
import { Button } from "@/src/components/ui/Button";
import { CategoryItem } from "@/src/components/ui/CategoryItem";
import { InputField } from "@/src/components/ui/InputField";
import { CategoryKey, categoryKeyToCategory } from "@/src/constants/categories";
import { Area, CreateItemRequest, DayPeriod } from "@/src/types/item";
import { useState, useRef } from "react";
import { areaLabels } from "@/src/constants/areaLabels";
import { ScrollableArea } from "@/src/components/ui/ScrollableArea";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { useTopPopup } from "@/src/utils/useTopPopup";
import { TopPopup } from "@/src/components/ui/TopPopup";

export default function RegisterLostItem() {
    const { popup, openPopup, closePopup } = useTopPopup();

    const [selectedCategory, setSelectedCategory] =
        useState<CategoryKey | null>(null);
    const [description, setDescription] = useState("");
    const [findingDate, setFindingDate] = useState("");
    const [dayPeriod, setDayPeriod] = useState<DayPeriod>("MORNING");
    const [area, setArea] = useState<Area | null>(null);
    const [images, setImages] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const selectedFiles = Array.from(e.target.files);

        if (selectedFiles.length > 3) {
            openPopup("Você pode selecionar no máximo 3 imagens.", "warning");

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            return;
        }

        setImages(selectedFiles);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedCategory || !area) {
            openPopup(
                "Por favor, selecione a categoria e o local.",
                "warning"
            );
            return;
        }

        const payload: CreateItemRequest = {
            description,
            finding_date: findingDate,
            day_period: dayPeriod,
            category: categoryKeyToCategory(selectedCategory),
            area,
        };

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                openPopup("Você não está autenticado.", "error");
                return;
            }

            const created = await createItem(payload, token);

            if (images.length > 0) {
                await Promise.all(images.filter(Boolean).map(file => uploadItemImage(created.itemId, file)));
            }

            openPopup("Item registrado com sucesso!", "success");

            setDescription("");
            setFindingDate("");
            setDayPeriod("MORNING");
            setSelectedCategory(null);
            setArea(null);
            setImages([]);
        } catch (error) {
            console.error("Erro ao registrar item:", error);

            openPopup(
                "Ocorreu um erro ao registrar o item. Tente novamente.",
                "error"
            );
        }
    };

    return (
        <main className="w-full flex flex-col px-4 py-0 md:ml-3 md:pl-6 md:pb-0 min-h-0">
            <PageHeader title="Registrar novo item perdido" />

            <ScrollableArea>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4 md:gap-6 w-full max-w-3xl"
                >
                    <InputField
                        label="Descrição"
                        placeholder="Ex.: Essa marmita rosa com amarelo foi encontrada..."
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
                            Imagens do item (até 3)
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="w-full px-3 py-3 rounded-xl bg-[#ECECEC] dark:bg-[#292929] text-sm text-gray-700 dark:text-gray-100
                                file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0
                                file:text-sm file:font-medium
                              file:bg-gray-200 dark:file:bg-gray-700
                              file:text-gray-700 dark:file:text-gray-100"
                            onChange={handleImageChange}
                        />

                    </div>

                    <div className="flex flex-col md:flex-row gap-3 md:justify-end mt-4">
                        <Button variant="primary" className="md:w-40">
                            Registrar item
                        </Button>
                        <Button variant="secondary" className="md:w-40">
                            Cancelar
                        </Button>
                    </div>
                </form>
            </ScrollableArea>

            <TopPopup
                isOpen={popup.open}
                message={popup.message}
                variant={popup.variant}
                onClose={closePopup}
            />
        </main>
    );
}
