"use client";

import { Button } from "@/src/components/ui/Button";
import { CategoryItem } from "@/src/components/ui/CategoryItem";
import { InputField } from "@/src/components/ui/InputField";
import { CategoryKey } from "@/src/constants/categories";
import { Area, Category, DayPeriod, ItemDTO } from "@/src/types/item";
import { useEffect, useState } from "react";
import { areaLabels } from "@/src/constants/areaLabels";
import { useParams, useRouter } from "next/navigation";
import { getTokenFromCookie } from "@/src/utils/token";
import { singleItem } from "@/src/api/endpoints/item";
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
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [imageName, setImageName] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

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
                setSelectedCategory(data.category ?? null);
                setImageName(data.pictures?.[0]?.url ?? null);

            } catch (err) {
                console.error("Erro ao carregar item:", err);
                setError("Erro ao carregar o item.");
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, [itemId]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setImageFile(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {

            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            if (area) formData.append("area", area);
            formData.append("findingDate", findingDate);
            formData.append("dayPeriod", dayPeriod);
            if (selectedCategory) formData.append("categoryId", selectedCategory);
            if (imageFile) formData.append("image", imageFile);

            await api.put(`/items/${itemId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert("Item atualizado com sucesso!");
            router.push("/items"); 
        } catch (error) {
            console.error("Erro ao atualizar item:", error);
            alert("Falha ao atualizar o item. Tente novamente.");
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
        <main className="w-full flex flex-col px-4 py-4 md:ml-3 md:pl-6 pb-[90px] md:pb-0">
            <h1 className="text-lg md:text-xl font-semibold mb-4">
                Editar “{name}”
            </h1>

            <form className="flex flex-col gap-4 md:gap-6 w-full max-w-3xl" onSubmit={handleSubmit}>
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
                    <CategoryItem
                        handleCategorySelection={(category) => setSelectedCategory(category as Category | null)}
                    />
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
                    <Button variant="secondary" className="md:w-40" onClick={() => router.back()}>
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
