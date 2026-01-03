"use client";

import { PageHeader } from "@/src/components/ui/PageHeader";
import { ActionGroup } from "./ActionGroup";
import { ActionGroupItem } from "./ActionGroupItem";
import { Box, Trash2, UserPen, UserPlus } from "lucide-react";

export default function RootDashboardHome() {
    return (
        <>
            <PageHeader title="Configurações avançadas" goBack={false} className="px-5 text-[18px]" showBell={false} />

            <div className="p-5 space-y-4">
                <ActionGroup title="CAENS">
                    <ActionGroupItem
                        href="/dashboard/root/caens/new"
                        title="Adicionar nova conta da CAENS"
                        icon={<UserPlus className="w-4 h-4" />}
                    />
                    <ActionGroupItem
                        href="/dashboard/root/caens/edit"
                        title="Editar contas da CAENS"
                        icon={<UserPen className="w-4 h-4" />}
                    />
                    <ActionGroupItem
                        href="/dashboard/root/caens/delete"
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
        </>
    );
}
