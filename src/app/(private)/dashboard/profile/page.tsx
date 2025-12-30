"use client";

import { useEffect, useState } from "react";
import { ActionList } from "../../../../components/ui/ActionList";
import { AvatarEditor } from "../../../../components/ui/AvatarEditor";
import { Header } from "../../../../components/ui/Header";
import { InfoItem } from "../../../../components/ui/InfoItem";
import { ApiResponse, User } from "../../../../types/user";
import { extractEmailFromToken } from "../../../../utils/token";
import { api } from "../../../../api/axios";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Loading } from "../../../../components/ui/Loading";
import { ScrollableArea } from "@/src/components/ui/ScrollableArea";

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    router.replace("/login");
                    return;
                }

                try {
                    await api.get("/authentication/token-teste", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                } catch {
                    router.replace("/login");
                }

                const email = extractEmailFromToken(token);
                if (!email) return;

                const { data } = await api.get(`/user/user-details/${email}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setUser({
                    name: data.name,
                    email: data.email,
                    avatar: data.profileImageUrl || null,
                    role: data.role,
                    registrationDate: data.registrationDate,
                });

            } catch (err: any) {
                const axiosErr = err as AxiosError<ApiResponse>;

                if (axiosErr.response?.data) {
                    const errors =
                        axiosErr.response.data.message ??
                        Object.values(axiosErr.response.data).join(" | ");
                    setError(errors);
                } else {
                    setError("Erro ao carregar dados do usuário.");
                }
            } finally {
                setLoading(false);
            }
        }

        fetchUser();

    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Carregando...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Não foi possível carregar os dados do usuário.</p>
            </div>
        );
    }

    return (
        <>
            <ScrollableArea>
                <div className="text-foreground transition-colors duration-300">

                    <div className="md:grid md:grid-cols-12 md:gap-6 px-4 md:px-8">

                        <main className="md:col-span-9 max-w-2xl w-full py-6">
                            <h1 className="text-lg font-bold mb-4">Perfil</h1>


                            <AvatarEditor currentAvatar={user.avatar || undefined} />

                            <div className="text-left mt-4">
                                <p className="font-semibold">{user.name}</p>
                                <p className="text-sm text-foreground/70">{user.email}</p>
                            </div>

                            <section>
                                <InfoItem label="Total de itens recuperados" value={`... itens`} />
                                <InfoItem label="Última vez que recuperou item" value={`... itens`} />
                                <InfoItem label="Cadastrado desde" value={`${new Date(user.registrationDate).toLocaleDateString("pt-BR")}`} />
                            </section>

                            <section className="mt-6">
                                <p className="text-sm text-foreground/70 mb-2">Ações disponíveis</p>
                                <ActionList userRole={user.role} />
                            </section>
                        </main>
                    </div>
                </div>

                <Loading isLoading={loading} />
            </ScrollableArea>
        </>
    );
}
