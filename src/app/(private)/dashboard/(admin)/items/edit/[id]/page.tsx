"use client";

import { Button } from "@/src/components/ui/Button";
import { CategoryItem } from "@/src/components/ui/CategoryItem";
import { InputField } from "@/src/components/ui/InputField";
import { CategoryKey, categoryKeyToCategory, categoryToCategoryKey } from "@/src/constants/categories";
import { Area, DayPeriod, EditItemRequest, ItemDTO, ItemStatus } from "@/src/types/item";
import { useEffect, useRef, useState } from "react";
import { areaLabels } from "@/src/constants/areaLabels";
import { useParams, useRouter } from "next/navigation";
import { getTokenFromCookie } from "@/src/utils/token";
import { editItem, singleItem, uploadItemImage } from "@/src/api/endpoints/item";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { ScrollableArea } from "@/src/components/ui/ScrollableArea";
import { TopPopup } from "@/src/components/ui/TopPopup";
import { useTopPopup } from "@/src/utils/useTopPopup"
import { ImagePicker } from "@/src/components/ui/ImagePicker";
import { Loading } from "@/src/components/ui/Loading";
import { ChevronDown } from "lucide-react";

type ImageItem = {
    file?: File;
    preview: string;
    existing?: boolean;
    id?: string;
};

export default function EditItem() {

    const params = useParams();
    const router = useRouter();
    const itemId = params?.id as string | undefined;

    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [findingDate, setFindingDate] = useState<string>("");
    const [area, setArea] = useState<Area | null>(null);
    const [dayPeriod, setDayPeriod] = useState<DayPeriod>("MORNING");
    const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(null);
    const [images, setImages] = useState<ImageItem[]>([]);
    const [status, setStatus] = useState<ItemStatus>();
    const { popup, openPopup, closePopup } = useTopPopup(3000);


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
                setStatus(data.status);

                if (data.pictures && data.pictures.length > 0) {
                    const existingImages: ImageItem[] = data.pictures.map(pic => ({
                        id: pic.id,
                        preview: `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${pic.url!}`,
                        existing: true,
                    }));

                    setImages(existingImages);
                }

            } catch (err) {
                console.error("Erro ao carregar item:", err);
                setError("Erro ao carregar o item.");
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, [itemId]);

    useEffect(() => {
        return () => {
            images.forEach(img => {
                if (img.file) {
                    URL.revokeObjectURL(img.preview);
                }
            });
        };
    }, []);

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
            const img = prev[index];

            if (img.file) {
                URL.revokeObjectURL(img.preview);
            }

            return prev.filter((_, i) => i !== index);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!itemId) {
            console.error("ID do item indefinido!");
            alert("Erro: ID do item não encontrado.");
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                description,
                area,
                category: selectedCategory ? categoryKeyToCategory(selectedCategory) : undefined,
            };

            await editItem(itemId, payload as EditItemRequest);

            const newImages = images.filter(img => img.file);

            if (newImages.length > 0) {
                await Promise.all(
                    newImages.map(img =>
                        uploadItemImage(itemId, img.file!)
                    )
                );
            }

            openPopup("Item atualizado com sucesso!", "success");
            setIsSubmitting(false);

            setTimeout(() => {
                router.push("/dashboard");
            }, 3000);
        } catch (error: any) {
            console.error("Erro ao atualizar item:", error);

            if (error.response?.status === 400 && error.response?.data?.message) {
                openPopup(error.response.data.message, "error");
            } else {
                openPopup("Falha ao atualizar o item. Tente novamente.", "error");
            }

            setIsSubmitting(false);
        }
    };

    if (!itemId) {
        return <div className="p-4 text-red-500">ID do item não encontrado na URL.</div>;
    }

    if (loading) {
        return (
            <main className="w-full h-full flex items-center justify-center">
                <Loading isLoading />
            </main>
        );
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

    console.log(status);

    return (
        <main className="w-full flex flex-col px-4 py-4 md:ml-3 md:pb-0 min-h-0">
            <PageHeader title="Detalhes do item" showBell={false} />
            <h1 className="text-lg md:text-xl font-semibold mb-4 md:pl-2">
                Editar “{name}”
            </h1>

            <ScrollableArea>
                <form className="flex flex-col gap-4 md:gap-6 w-full max-w-3xl md:pl-2" onSubmit={handleSubmit}>
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
                        disabled={status !== "DISPONIBLE"}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <div className="flex flex-col w-full">
                        <label className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                            Local onde foi encontrado
                        </label>

                        <div className="relative w-full">
                            <select
                                className="w-full px-3 py-3 appearance-none rounded-xl 
                                    bg-[#ECECEC] dark:bg-[#292929] text-sm text-gray-700 dark:text-gray-100 
                                    border-2 border-transparent focus:border-[#3E9F50] outline-none"
                                required
                                value={area ?? ""}
                                disabled={status !== "DISPONIBLE"}
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
                                    absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none
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
                        disabled
                    />

                    <div className="flex flex-col w-full">
                        <label className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                            Período do dia
                        </label>

                        <div className="relative w-full">
                            <select
                                value={dayPeriod}
                                onChange={(e) => setDayPeriod(e.target.value as DayPeriod)}
                                disabled
                                className="
                                    w-full px-4 py-3 appearance-none rounded-xl bg-[#ECECEC] dark:bg-[#292929] text-sm text-gray-700 dark:text-gray-100 
                                    border-2 border-transparent cursor-not-allowed disabled:opacity-60 border-2 border-transparent
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
                                    text-gray-400
                                    pointer-events-none
                                "
                            />
                        </div>
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

                    <ImagePicker
                        images={images}
                        maxImages={3}
                        onAddImages={handleAddImage}
                        onRemoveImage={handleRemoveImage}
                    />

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Se você não selecionar novas imagens, as atuais serão mantidas.
                    </p>

                    <div className="flex flex-col gap-3 mt-4 mb-4 w-full">
                        <Button variant="secondary" className="w-full py-3" onClick={() => router.back()} disabled={isSubmitting}>
                            {status === "DISPONIBLE" ? "Cancelar" : "Voltar"}
                            
                        </Button>
                        {status === "DISPONIBLE" && (
                            <Button variant="primary" className="w-full py-3" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Salvando..." : "Salvar alterações"}
                            </Button>
                        )}
                    </div>
                </form>
            </ScrollableArea>

            <TopPopup
                message={popup.message}
                isOpen={popup.open}
                variant={popup.variant}
                onClose={closePopup}
            />

            <Loading isLoading={isSubmitting} />
        </main>
    );
}