"use client";

import { PageHeader } from "@/src/components/ui/PageHeader";
import { ActionGroup } from "./ActionGroup";
import { ActionGroupItem } from "./ActionGroupItem";
import { Box, Trash2, UserPen, UserPlus } from "lucide-react";
import { getAdminUsers } from "@/src/api/endpoints/user";
import { getTokenFromCookie, extractEmailFromToken } from "@/src/utils/token";
import { useEffect } from "react";
import { ScrollableArea } from "./ScrollableArea";

export default function RootDashboardHome() {

    return (
        <main className="min-h-0 flex flex-col">
            <PageHeader title="Configurações avançadas" goBack={false} className="px-5 text-[18px]" showBell={false} />

            <ScrollableArea>
                <div className="p-5 space-y-4">
                    <ActionGroup title="CAENS">
                        <ActionGroupItem
                            href="/dashboard/admins/account/create"
                            title="Adicionar nova conta da CAENS"
                            icon={<UserPlus className="w-4 h-4" />}
                        />
                        <ActionGroupItem
                            href="/dashboard/admins/view/edit"
                            title="Editar contas da CAENS"
                            icon={<UserPen className="w-4 h-4" />}
                        />
                        <ActionGroupItem
                            href="/dashboard/admins/view/delete"
                            title="Deletar conta da CAENS"
                            icon={<Trash2 className="w-4 h-4" />}
                            danger
                        />
                    </ActionGroup>

                    <ActionGroup title="Item">
                        <ActionGroupItem
                            href="/dashboard/root/items/delete"
                            title="Deletar item"
                            icon={<Box className="w-4 h-4" />}
                            danger
                        />
                    </ActionGroup>
                </div>
            </ScrollableArea>
        </main>
    );
}
