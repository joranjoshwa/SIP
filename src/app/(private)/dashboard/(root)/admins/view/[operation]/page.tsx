"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { ScrollableArea } from "@/src/components/ui/ScrollableArea";
import { extractEmailFromToken, getTokenFromCookie } from "@/src/utils/token";
import { deleteAdmin, getAdminUsers } from "@/src/api/endpoints/user";
import Image from "next/image";
import { ConfirmDestructiveModal } from "@/src/components/ui/ConfirmDestructiveModal";
import { StatusMemberClass, StatusMemberLabel } from "@/src/constants/statusMember";
import { StatusMember } from "@/src/types/user";

type Operation = "edit" | "delete";

type AdminAccount = {
    fullName: string;
    email: string;
    avatarUrl?: string | null;
    status: StatusMember;
};

function isOperation(value: string): value is Operation {
    return value === "edit" || value === "delete";
}

export default function AdminAccountOperationPage() {
    const [accounts, setAccounts] = useState<AdminAccount[]>([]);
    const [openDeleteAccount, setOpenDeleteAccount] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<AdminAccount | null>(null);

    useEffect(() => {
        (async () => {
            const token = getTokenFromCookie();
            const email = extractEmailFromToken(token as string);
            const data = await getAdminUsers(email as string);
            const accounts = data.map((ac: any) => {
                console.log(ac);
                return {
                    fullName: ac.name,
                    email: ac.email,
                    avatarUrl: ac.profileImageUrl,
                    status: ac.statusMember
                }
            });
            setAccounts(accounts);
            console.log(accounts);
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
                                <li key={`${Date.now()} - ${idx}`}>
                                    <button
                                        type="button"
                                        onClick={operation === "edit"
                                            ? () => router.push(ui.nextHref(acc.email))
                                            : () => {
                                                if (ui.danger) {
                                                    setSelectedAccount(acc);
                                                    setOpenDeleteAccount(true);
                                                } else {
                                                    router.push(ui.nextHref(acc.email));
                                                }
                                            }}
                                        className={[
                                            "w-full flex items-center gap-3 rounded-xl px-4 py-3 transition-colors",
                                            "bg-neutral-100/80 dark:bg-[#262626]",
                                        ].join(" ")}
                                    >
                                        <div className="shrink-0 w-9 h-9 rounded-full overflow-hidden bg-emerald-100 dark:bg-emerald-950/30 grid place-items-center">
                                            {acc.avatarUrl ? (
                                                <Image
                                                    src={process.env.NEXT_PUBLIC_IMAGE_BASE_URL + acc.avatarUrl}
                                                    alt={`Avatar de ${acc.fullName}`}
                                                    width={36}
                                                    height={36}
                                                    className="h-full w-full object-cover"
                                                    unoptimized
                                                />
                                            ) : (
                                                <span className="text-emerald-700 dark:text-emerald-300 text-[12px] font-semibold">
                                                    {acc.fullName
                                                        .split(" ")
                                                        .slice(0, 2)
                                                        .map((s) => s[0])
                                                        .join("")
                                                        .toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1 text-left">
                                            <div className="text-[13px] font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                                                {acc.fullName}
                                            </div>
                                            <div className="text-[12px] text-neutral-600 dark:text-neutral-400 truncate">
                                                {acc.email}
                                            </div>
                                        </div>
                                        <div
                                            className={[
                                                "text-[12px] truncate",
                                                StatusMemberClass[acc.status] ?? "text-neutral-600 dark:text-neutral-400",
                                            ].join(" ")}
                                        >
                                            {StatusMemberLabel[acc.status] ?? "—"}
                                        </div>
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

                    {selectedAccount && (
                        <ConfirmDestructiveModal
                            open={openDeleteAccount}
                            onOpenChange={(open) => {
                                setOpenDeleteAccount(open);
                                if (!open) setSelectedAccount(null);
                            }}
                            title="Deletar conta"
                            message="Tem certeza que deseja essa conta do setor da CAENS?"
                            preview={{
                                imageUrl: selectedAccount.avatarUrl,
                                fallbackText: selectedAccount.fullName
                                    .split(" ")
                                    .map((s) => s[0])
                                    .slice(0, 2)
                                    .join("")
                                    .toUpperCase(),
                                primary: selectedAccount.fullName,
                                secondary: selectedAccount.email,
                            }}
                            confirmLabel="Deletar conta"
                            onConfirm={async () => {
                                await deleteAdmin(selectedAccount.email);

                                setAccounts((prev) =>
                                    prev.filter((acc) => acc.email !== selectedAccount.email)
                                );
                            }}
                        />
                    )}

                </section>
            </ScrollableArea>
        </main>
    );
}
