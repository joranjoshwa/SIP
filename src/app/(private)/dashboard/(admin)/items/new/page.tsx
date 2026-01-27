"use client";

import { createItem, uploadItemImage } from "@/src/api/endpoints/item";
import { Button } from "@/src/components/ui/Button";
import { CategoryItem } from "@/src/components/ui/CategoryItem";
import { InputField } from "@/src/components/ui/InputField";
import { CategoryKey, categoryKeyToCategory } from "@/src/constants/categories";
import { Area, CreateItemRequest, DayPeriod } from "@/src/types/item";
import { useState, useRef, useEffect } from "react";
import { areaLabels } from "@/src/constants/areaLabels";
import { ScrollableArea } from "@/src/components/ui/ScrollableArea";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { useTopPopup } from "@/src/utils/useTopPopup";
import { TopPopup } from "@/src/components/ui/TopPopup";
import { ImagePicker } from "@/src/components/ui/ImagePicker";
import { Loading } from "@/src/components/ui/Loading";
import { ChevronDown } from "lucide-react";

type ImageItem = {
    file: File;
    preview: string;
};

export default function RegisterLostItem() {
    const { popup, openPopup, closePopup } = useTopPopup();

    const [selectedCategory, setSelectedCategory] =
        useState<CategoryKey | null>(null);
    const [description, setDescription] = useState("");
    const [findingDate, setFindingDate] = useState("");
    const [dayPeriod, setDayPeriod] = useState<DayPeriod>("MORNING");
    const [area, setArea] = useState<Area | null>(null);
    const [images, setImages] = useState<ImageItem[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddImage = (files: File[]) => {
        setImages(prev => {
            if (prev.length + files.length > 3) {
                openPopup("Você pode adicionar no máximo 3 imagens.", "warning");
                return prev;
            }

            const newImages = files.map(file => ({
                file,
                preview: URL.createObjectURL(file),
            }));

            return [...prev, ...newImages];
        });
    };

    const handleRemoveImage = (index: number) => {
        setImages(prev => {
            URL.revokeObjectURL(prev[index].preview);
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isSubmitting) return;

        if (!selectedCategory || !area) {
            openPopup(
                "Por favor, selecione a categoria e o local.",
                "warning"
            );
            return;
        }

        setIsSubmitting(true);

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
                await Promise.all(
                    images.map(img =>
                        uploadItemImage(created.itemId, img.file, null)
                    )
                );
            }

            openPopup("Item registrado com sucesso!", "success");

            setDescription("");
            setFindingDate("");
            setDayPeriod("MORNING");
            setSelectedCategory(null);
            setArea(null);
            images.forEach(img => URL.revokeObjectURL(img.preview));
            setImages([]);
        } catch (error) {
            console.error("Erro ao registrar item:", error);

            openPopup(
                "Ocorreu um erro ao registrar o item. Tente novamente.",
                "error"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        return () => {
            images.forEach(img => URL.revokeObjectURL(img.preview));
        };
    }, []);

    return (
        <main className="w-full flex flex-col px-4 py-0 md:ml-3 md:pl-6 md:pb-0 min-h-0">
            <PageHeader title="Registrar novo item perdido" />

            <ScrollableArea>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4 md:px-2 md:gap-6 w-full max-w-3xl"
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

                        <div className="relative w-full">
                            <select
                                className="
                                    w-full
                                    px-4 py-3
                                    appearance-none
                                    rounded-xl
                                    bg-[#ECECEC]
                                    dark:bg-[#292929]
                                    text-sm
                                    text-gray-700
                                    dark:text-gray-100
                                    border-2 border-transparent
                                    focus:border-[#3E9F50]
                                    outline-none
                                "
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

                            <ChevronDown
                                size={18}
                                className="
                                    absolute
                                    right-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-gray-500
                                    pointer-events-none
                                "
                            />
                        </div>
                    </div>

                    <InputField
                        label="Dia que encontraram"
                        type="date"
                        required
                        value={findingDate}
                        onChange={(e) => setFindingDate(e.target.value)}
                    />

                    <div className="flex flex-col gap-2 w-full">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Período do dia
                        </label>

                        <div className="relative w-full">
                            <select
                                value={dayPeriod}
                                onChange={(e) => setDayPeriod(e.target.value as DayPeriod)}
                                className="
                                    w-full
                                    px-4 py-3
                                    appearance-none
                                    rounded-xl
                                    bg-[#ECECEC]
                                    dark:bg-[#292929]
                                    text-sm
                                    text-gray-700
                                    dark:text-gray-100
                                    border-2 border-transparent
                                    focus:border-[#3E9F50]
                                    outline-none
                                "
                            >
                                <option value="MORNING">Manhã</option>
                                <option value="AFTERNOON">Tarde</option>
                                <option value="NIGHT">Noite</option>
                            </select>

                            <ChevronDown
                                size={18}
                                className="
                                    absolute
                                    right-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-gray-500
                                    pointer-events-none
                                "
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Categoria
                        </label>
                        <CategoryItem handleCategorySelection={setSelectedCategory} />
                    </div>

                    <ImagePicker
                        images={images}
                        maxImages={3}
                        onAddImages={handleAddImage}
                        onRemoveImage={handleRemoveImage}
                    />


                    <div className="flex flex-col gap-3 mt-4 w-full">
                        <Button variant="primary" className="w-full py-3" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Registrando..." : "Registrar item"}
                        </Button>
                        <Button variant="secondary" className="w-full py-3" disabled={isSubmitting}>
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

            <Loading isLoading={isSubmitting} />
        </main>
    );
}
