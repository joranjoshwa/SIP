"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { ScrollableArea } from "@/src/components/ui/ScrollableArea";
import { extractEmailFromToken, getTokenFromCookie } from "@/src/utils/token";
import { getAdminUsers } from "@/src/api/endpoints/user";

type Operation = "edit" | "delete";

type AdminAccount = {
    id: string;
    fullName: string;
    email: string;
    avatarUrl?: string | null;
};

function isOperation(value: string): value is Operation {
    return value === "edit" || value === "delete";
}

export default function AdminAccountOperationPage() {
    const [accounts, setAccounts] = useState<AdminAccount[]>([]);

    useEffect(() => {
        (async () => {
            const token = getTokenFromCookie();
            const email = extractEmailFromToken(token as string);
            const data = await getAdminUsers(email as string);
            const accounts = data.map((ac: any) => {
                return {
                    id: ac.id,
                    fullName: ac.name,
                    email: ac.email
                }
            });
            setAccounts(accounts);
        })();
    }, []);

    const params = useParams<{ operation: string }>();
    const router = useRouter();

    const operation = params?.operation ?? "";

    const ui = useMemo(() => {
        if (!isOperation(operation)) return null;

        if (operation === "edit") {
            return {
                headerTitle: "Editar conta da CAENS",
                hint: "Selecione a conta a ser alterada.",
                nextHref: (id: string) => `/dashboard/admins/account/edit/${id}`,
                danger: false,
            };
        }

        return {
            headerTitle: "Deletar conta da CAENS",
            hint: "Selecione a conta a ser deletada.",
            nextHref: (id: string) => `/dashboard/admins/view/delete/${id}`,
            danger: true,
        };
    }, [operation]);

    if (!ui) {
        router.replace("/dashboard");
        return null;
    }

    return (
        <main className="min-h-0 flex flex-col">
            <PageHeader
                title={ui.headerTitle}
                goBack
                className="px-5 text-[18px]"
                showBell={false}
            />
            <ScrollableArea>
                <section className="px-5 pt-3 pb-6">
                    <p className="text-[12px] text-neutral-600 dark:text-neutral-400 mb-3">
                        {ui.hint}
                    </p>

                    <div className="rounded-2xl p-2">
                        <ul className="flex flex-col gap-2">
                            {accounts.map((acc, idx) => (
                                <li key={`${acc.id} - ${idx}`}>
                                    <button
                                        type="button"
                                        onClick={() => router.push(ui.nextHref(acc.email))}
                                        className={[
                                            "w-full flex items-center gap-3 rounded-xl px-4 py-3 transition-colors",
                                            "bg-neutral-100/80 dark:bg-[#262626]",
                                        ].join(" ")}
                                    >
                                        <div className="shrink-0 w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950/30 grid place-items-center">
                                            <span className="text-emerald-700 dark:text-emerald-300 text-[12px] font-semibold">
                                                {acc.fullName
                                                    .split(" ")
                                                    .slice(0, 2)
                                                    .map((s) => s[0])
                                                    .join("")
                                                    .toUpperCase()}
                                            </span>
                                        </div>

                                        <div className="min-w-0 flex-1 text-left">
                                            <div className="text-[13px] font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                                                {acc.fullName}
                                            </div>
                                            <div className="text-[12px] text-neutral-600 dark:text-neutral-400 truncate">
                                                {acc.email}
                                            </div>
                                        </div>

                                        {ui.danger ? (
                                            <span className="text-[11px] font-semibold text-red-600 dark:text-red-400">
                                                Excluir
                                            </span>
                                        ) : null}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {accounts.length === 0 ? (
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-3">
                            Nenhuma conta cadastrada.
                        </p>
                    ) : null}
                </section>
            </ScrollableArea>
        </main>
    );
}
