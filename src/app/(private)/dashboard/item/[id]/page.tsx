import { Calendar, MapPin, Tag, ClipboardPen, ImageOff } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { singleItem } from "@/src/api/endpoints/item";
import { Area, ItemDTO } from "@/src/types/item";
import { cookies } from "next/headers";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
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
import type { TimeString, UUID } from "@/src/types/withdrawal";
import type { WithdrawalRequestItem } from "@/src/types/withdrawal";
import Link from "next/link";

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
            date: date,
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
    params: { id: string };
};

export default async function ItemPage({ params }: Props) {
    const cookieStore = await cookies() as unknown as ReadonlyRequestCookies;
    const token = cookieStore.get("token")?.value;
    const { id } = await params;
    const data = await singleItem(id, token as string);

    const item: ItemDTO = data;
    const role = extractRoleFromToken(token as string);
    const email = extractEmailFromToken(token as string);

    const baseClass = "flex items-center gap-1 text-xs px-3 py-1 rounded-2xl bg-[#D4EED9] text-black dark:bg-[#183E1F] dark:text-white dark:border-[#183E1F]";
    const requestsData: WithdrawalRequestItem[] = await getWithdrawalRequests(id, token as string);

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

                        <div className={`flex gap-2 mt-3 flex-wrap text-black`}>
                            <span className={baseClass}>
                                <Calendar className="w-4 h-4" />
                                {new Date(item.findingAt).toLocaleDateString()}
                            </span>
                            <span className={baseClass}>
                                <MapPin className="w-4 h-4" />
                                {AreaLabels[item.area as Area] ?? item.area}
                            </span>
                            <span className={baseClass}>
                                <Tag className="w-4 h-4" />
                                {CategoryLabels[item.category as CategoryEnum] ?? item.category}
                            </span>
                        </div>

                        <h2 className="mt-4 font-semibold md:text-[20px] text-gray-900 dark:text-gray-100">
                            {item.description}
                        </h2>

                        <OpenScheduleButton
                            channel="item-claim"
                            className={`mt-8 md:w-[100%]`}
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
                    </div>
                    <div className={`md:basis-2/5 ${role !== Role.ADMIN ? "hidden" : ""}`}>
                        <RequestsTab requestsItemArr={requestsData} itemStatus={item.status} />
                    </div>
                </div>
            </ScrollableArea>
            <SchedulePickupModal action={checkAvailability} channel="item-claim" itemId={id} userEmail={email as string} token={token as string} />
            <AdminActionsMobile />
        </div>
    );
}
