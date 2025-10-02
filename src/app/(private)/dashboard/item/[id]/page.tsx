import Image from "next/image";
import { Calendar, MapPin, Tag } from "lucide-react";
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
import { extractRoleFromToken } from "@/src/utils/token";
import { ScrollableArea } from "@/src/components/ui/ScrollableArea";
import { Role } from "@/src/enums/role";


type Props = {
    params: { id: string };
};

export default async function ItemPage({ params }: Props) {
    const cookieStore = cookies() as unknown as ReadonlyRequestCookies;
    const token = cookieStore.get("token")?.value;
    const data = await singleItem(params.id, token as string);

    const item: ItemDTO = data;
    const role = extractRoleFromToken(token as string);

    const baseClass = "flex items-center gap-1 text-xs px-3 py-1 rounded-2xl bg-[#D4EED9] text-black dark:bg-[#183E1F] dark:text-white dark:border-[#183E1F]";
    const requestsData: ItemRequest[] = [
        {
            id: "1",
            user: { name: "Valentina Silveira", avatar: "/avatars/valentina.png" },
            date: "25/06/25 às 09:30h",
            status: "PENDING",
        },
        {
            id: "2",
            user: { name: "Emerson Guedes", avatar: "/avatars/emerson.png" },
            date: "20/06/25 às 08:30h",
            status: "REJECTED",
        },
        {
            id: "4",
            user: { name: "Emerson Guedes", avatar: "/avatars/emerson.png" },
            date: "20/06/25 às 08:30h",
            status: "REJECTED",
        },
        {
            id: "5",
            user: { name: "Emerson Guedes", avatar: "/avatars/emerson.png" },
            date: "20/06/25 às 08:30h",
            status: "REJECTED",
        },
    ];

    return (
        <div className="flex flex-col h-full min-h-0 p-4">
            <PageHeader title="Detalhes do item" />
            <ScrollableArea className="flex-1">
                <div className="flex flex-col md:flex-row">
                    <div className="md:basis-3/5">

                        <div className="relative w-full h-64 md:h-[60vh] md:w-[80%] rounded-xl overflow-hidden">
                            <Image
                                src={item.pictures?.[0]?.url || "/placeholder.jpg"}
                                alt={item.description}
                                fill
                                className="object-cover object-left rounded-xl"
                            />
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

                        <h2 className="mt-4 font-semibold text-gray-900 dark:text-gray-100">
                            {item.description}
                        </h2>

                        <Button variant="secondary" className={`mt-8 md:w-[100%] ${role !== Role.COMMON ? "hidden" : ""}`}>
                            Reivindicar item
                        </Button>
                    </div>
                    <div className={`md:basis-2/5 ${role !== Role.ADMIN ? "hidden" : ""}`}>
                        <RequestsTab requestsItemArr={requestsData} itemStatus={item.status} />
                    </div>
                </div>
            </ScrollableArea>
        </div>
    );
}
