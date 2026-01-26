import { Calendar, MapPin, Tag, ClipboardPen, ImageOff, Hourglass, Trash } from "lucide-react";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { singleItem } from "@/src/api/endpoints/item";
import { Area, ItemStatus } from "@/src/types/item";
import { cookies } from "next/headers";
import { CategoryEnum } from "@/src/enums/category";
import { CategoryLabels } from "@/src/constants/categories";
import { AreaLabels } from "@/src/constants/area";
import { RequestsTab } from "@/src/components/ui/RequestsTab";
import { extractRoleFromToken, extractEmailFromToken } from "@/src/utils/token";
import { ScrollableArea } from "@/src/components/ui/ScrollableArea";
import { Role } from "@/src/enums/role";
import { AdminActionsMobile } from "@/src/components/ui/AdminActionsMobile";
import { ImageSlider } from "@/src/components/ui/ImageSlider";
import { OpenScheduleButton } from "@/src/components/ui/OpenScheduleButton";
import { SchedulePickupModal } from "@/src/components/ui/ScheduleModalProps";
import { postWithdrawal, getWithdrawalRequests } from "@/src/api/endpoints/withdrawal";
import type { TimeString, UUID, WithdrawalRequestItem } from "@/src/types/withdrawal";
import { ItemDeleteButton } from "@/src/components/ui/ItemDeleteButton";
import Link from "next/link";
import { redirect } from "next/navigation";
import { StatusLabels } from "@/src/constants/itemStatus";
import { deleteItem } from "@/src/api/endpoints/item";

type ActionState = { status: "idle" | "success" | "error"; message?: string };


async function checkAvailability(
    _: ActionState,
    formData: FormData
): Promise<ActionState> {
    "use server";

    const date = formData.get("date") as string | null;
    const time = formData.get("time") as TimeString | null;
    const email = formData.get("userEmail") as string;
    const itemId = formData.get("itemId") as UUID;
    const token = formData.get("token") as string;
    const description = formData.get("description") as string;

    if (!date || !time) {
        return { status: "error", message: "Data e hora são obrigatórios." };
    }

    const response = await postWithdrawal(
        {
            description,
            email,
            itemId,
            date,
            time,
        },
        token
    );

    if (response.success) {
        return { status: "success", message: "Solicitação enviada com sucesso!" };
    }

    let errorMessage =
        "Não há nenhum servidor disponível na data e horário selecionados!";

    if (typeof response.error === "string") {
        errorMessage = response.error;
    } else if (
        response.error &&
        typeof (response.error as any).message === "string"
    ) {
        errorMessage = (response.error as any).message;
    }

    return { status: "error", message: errorMessage };
}

type Props = {
    params: Promise<{ id: string }>;
};

export default async function ItemPage({ params }: Props) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const { id } = await params;

    if (!token) {
        redirect("/dashboard/items");
    }

    async function deleteItemAction(itemId: string) {
        "use server";

        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) throw new Error("Sessão expirada. Faça login novamente.");

        await deleteItem(itemId, token);
    }


    try {
        const item = await singleItem(id, token as string);
        const role = extractRoleFromToken(token as string);
        const email = extractEmailFromToken(token as string);

        const baseClass =
            "flex items-center gap-1 text-xs px-3 py-[0.4rem] rounded-2xl bg-[#D4EED9] text-black dark:bg-[#183E1F] dark:text-white dark:border-[#183E1F]";

        const requestsData: WithdrawalRequestItem[] =
            await getWithdrawalRequests(id, token as string);

        return (
            <div className="flex flex-col h-full min-h-0 p-4">
                <PageHeader title="Detalhes do item" />

                <ScrollableArea className="flex-1">
                    <div className="flex flex-col md:flex-row">
                        <div className="md:basis-3/5">
                            <div className="relative w-full h-64 md:h-[60vh] rounded-xl overflow-hidden">
                                {item.pictures?.[0]?.url ? (
                                    <div className="flex items-center">
                                        <ImageSlider item={item} />
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                                        <ImageOff className="w-20 h-20" />
                                    </div>
                                )}
                            </div>

                            <div className="mt-3 -mx-4 px-4 overflow-x-auto scrollbar-hide">
                                <div className="flex gap-2 flex-nowrap text-black w-max">
                                    <span className={`${baseClass} shrink-0`}>
                                        <Calendar className="w-4 h-4" />
                                        {new Date(item.findingAt).toLocaleDateString("pt-BR", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                        })}
                                    </span>

                                    <span className={`${baseClass} shrink-0`}>
                                        <MapPin className="w-4 h-4" />
                                        {AreaLabels[item.area as Area] ?? item.area}
                                    </span>

                                    <span className={`${baseClass} shrink-0`}>
                                        <Tag className="w-4 h-4" />
                                        {CategoryLabels[item.category as CategoryEnum] ?? item.category}
                                    </span>

                                    <span className={`${baseClass} shrink-0`}>
                                        <Hourglass className="w-4 h-4" />
                                        {StatusLabels[item.status as ItemStatus] ?? item.status}
                                    </span>
                                </div>
                            </div>

                            <h2 className="mt-4 font-semibold md:text-[20px] text-gray-900 dark:text-gray-100">
                                {item.description}
                            </h2>

                            <OpenScheduleButton
                                channel="item-claim"
                                className="mt-8 md:w-[100%]"
                                hidden={role !== Role.COMMON}
                            >
                                Reivindicar item
                            </OpenScheduleButton>

                            <Link
                                href={`/dashboard/items/edit/${id}`}
                                className={`block w-full py-3 min-h-[48px] rounded-xl font-medium text-sm transition-colors
                                bg-[#D4EED9] text-black dark:bg-[#183E1F] dark:text-white 
                                mt-8 text-lg md:w-full ${role === Role.ADMIN ? "" : "hidden"}`}
                            >
                                <div className="flex items-center justify-center gap-2 text-[16px]">
                                    <ClipboardPen className="w-5 h-5" />
                                    <span>Editar item</span>
                                </div>
                            </Link>

                            <ItemDeleteButton
                                hidden={role !== Role.ROOT}
                                itemId={id}
                                itemTitle={item.description}
                                foundAt={item.findingAt}
                                itemImageUrl={item.pictures?.[0]?.url ?? null}
                                onDelete={deleteItemAction.bind(null, id)}
                            />
                        </div>

                        <div className={`md:basis-2/5 ${role !== Role.ADMIN ? "hidden" : ""}`}>
                            <RequestsTab
                                requestsItemArr={requestsData}
                                itemStatus={item.status}
                            />
                        </div>
                    </div>
                </ScrollableArea>

                <SchedulePickupModal
                    action={checkAvailability}
                    channel="item-claim"
                    itemId={id}
                    userEmail={email as string}
                    token={token as string}
                />

                <AdminActionsMobile />
            </div>
        );
    } catch (e) {
        redirect("/dashboard");
    }
}
