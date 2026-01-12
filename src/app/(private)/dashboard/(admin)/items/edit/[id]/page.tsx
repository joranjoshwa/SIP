"use client";

import { Button } from "@/src/components/ui/Button";
import { CategoryItem } from "@/src/components/ui/CategoryItem";
import { InputField } from "@/src/components/ui/InputField";
import { CategoryKey, categoryKeyToCategory, categoryToCategoryKey } from "@/src/constants/categories";
import { Area, Category, DayPeriod, EditItemRequest, ItemDTO } from "@/src/types/item";
import { useEffect, useState } from "react";
import { areaLabels } from "@/src/constants/areaLabels";
import { useParams, useRouter } from "next/navigation";
import { getTokenFromCookie } from "@/src/utils/token";
import { editItem, singleItem, uploadItemImage } from "@/src/api/endpoints/item";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { ScrollableArea } from "@/src/components/ui/ScrollableArea";
import { api } from "@/src/api/axios";

export default function EditItem() {

    const params = useParams();
    const router = useRouter();
    const itemId = params?.id as string | undefined;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [findingDate, setFindingDate] = useState<string>("");
    const [area, setArea] = useState<Area | null>(null);
    const [dayPeriod, setDayPeriod] = useState<DayPeriod>("MORNING");
    const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(null);
    const [imageName, setImageName] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [images, setImages] = useState<(File | string | null)[]>([null, null, null]);

    useEffect(() => {
        if (!itemId) {
            setError("ID do item não informado.");
            return;
        }

        const fetchItem = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = getTokenFromCookie();
                if (!token) {
                    setError("Usuário não autenticado.");
                    setLoading(false);
                    return;
                }

                const data: ItemDTO = await singleItem(itemId, token);
                setName(data.code ?? `Item ${data.id}`);
                setDescription(data.description ?? "");
                setFindingDate(data.findingAt ? new Date(data.findingAt).toISOString().slice(0, 10) : "");
                setArea(data.area ?? null);
                setDayPeriod(data.dayPeriod ?? "MORNING");
                setSelectedCategory(data.category ? categoryToCategoryKey(data.category) : null);
                setImageName(data.pictures?.[0]?.url ?? null);

                const existingImages = [
                    data.pictures?.[0]?.url ?? null,
                    data.pictures?.[1]?.url ?? null,
                    data.pictures?.[2]?.url ?? null,
                ];
                setImages(existingImages);

            } catch (err) {
                console.error("Erro ao carregar item:", err);
                setError("Erro ao carregar o item.");
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, [itemId]);

    const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImages(prev => {
                const newImages = [...prev];
                newImages[index] = file;
                return newImages;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!itemId) {
            console.error("ID do item indefinido!");
            alert("Erro: ID do item não encontrado.");
            return;
        }

        try {
            const payload = {
                description,
                area,
                category: selectedCategory ? categoryKeyToCategory(selectedCategory) : undefined,
            };

            await editItem(itemId, payload as EditItemRequest);

            for (const img of images) {
                if (img instanceof File) {
                    await uploadItemImage(itemId, img);
                }
            }

            alert("Item atualizado com sucesso!");
            router.push("/dashboard");
        } catch (error: any) {
            console.error("Erro ao atualizar item:", error);

            if (error.response?.status === 400 && error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert("Falha ao atualizar o item. Tente novamente.");
            }
        }
    };

    if (!itemId) {
        return <div className="p-4 text-red-500">ID do item não encontrado na URL.</div>;
    }

    if (loading) {
        return <div className="p-4">Carregando item...</div>;
    }

    if (error) {
        return (
            <div className="p-4">
                <p className="text-red-500 mb-2">{error}</p>
                <button className="btn" onClick={() => router.back()}>
                    Voltar
                </button>
            </div>
        );
    }

    return (
        <main className="w-full flex flex-col px-4 py-4 md:ml-3 md:pl-6 md:pb-0 min-h-0">
            <PageHeader title="Detalhes do item" showBell={false} />
            <h1 className="text-lg md:text-xl font-semibold mb-4">
                Editar “{name}”
            </h1>

            <ScrollableArea>
                <form className="flex flex-col gap-4 md:gap-6 w-full max-w-3xl" onSubmit={handleSubmit}>
                    <InputField
                        label="Nome"
                        placeholder="Ex.: Marmita rosa com amarelo pequena"
                        value={name}
                        disabled
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
                        disabled
                    />

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Período do dia
                        </label>
                        <select
                            value={dayPeriod}
                            onChange={(e) => setDayPeriod(e.target.value as DayPeriod)}
                            className="px-3 py-3 rounded-xl bg-[#ECECEC] dark:bg-[#292929] text-sm text-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                            disabled
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
                        <CategoryItem
                            selectedCategory={selectedCategory}
                            handleCategorySelection={(category) => setSelectedCategory(category as CategoryKey | null)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Imagens do item (até 3)
                        </label>
                        <div className="flex flex-col md:flex-row gap-4">
                            {images.map((img, index) => (
                                <div key={index} className="flex flex-col gap-1 md:w-1/3">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="w-full px-3 py-3 rounded-xl bg-[#ECECEC] dark:bg-[#292929] text-sm text-gray-700 dark:text-gray-100 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-200 dark:file:bg-gray-700 file:text-gray-700 dark:file:text-gray-100"
                                        onChange={(e) => handleImageChange(index, e)}
                                    />
                                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {img instanceof File ? img.name : img ? img.split("/").pop() : "Nenhuma imagem"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3 md:justify-end mt-4">
                        <Button variant="secondary" className="md:w-40" onClick={() => router.back()}>
                            Cancelar
                        </Button>
                        <Button variant="primary" className="md:w-40">
                            Salvar alterações
                        </Button>
                    </div>
                </form>
            </ScrollableArea>
        </main>
    );
}