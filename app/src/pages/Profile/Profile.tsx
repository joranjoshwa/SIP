import { ActionList } from "../../components/ui/ActionList";
import { AvatarEditor } from "../../components/ui/AvatarEditor";
import { BottomNav } from "../../components/ui/BottomNav";
import { Header } from "../../components/ui/Header";
import { InfoItem } from "../../components/ui/InfoItem";
import { Sidebar } from "../../components/ui/Sidebar";

export const Profile = () => {
    const user = {
        name: "Valentino Silveira",
        email: "202313580007@ifba.edu.br",
        avatar: "/assets/avatar-placeholder.jpg",
        stats: {
            recovered: 16,
            lastRecovered: "24 de maio de 2025",
            createdAt: "11 de fevereiro de 2025",
        },
    };

    return (
        <div className="min-h-screen bg-white text-gray-900 pb-20">
            <Header />

            <div className="md:grid md:grid-cols-12 md:gap-6 px-4 md:px-8">
                <Sidebar />

                <main className="md:col-span-9 max-w-2xl w-full py-6">
                    <h1 className="text-lg font-bold mb-4">Perfil</h1>


                    <AvatarEditor />

                    <div className="text-center md:text-left mt-4">
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>

                    <section>
                        <InfoItem label="Total de itens recuperados" value={`${user.stats.recovered} itens`} />
                        <InfoItem label="Última vez que recuperou item" value={`${user.stats.lastRecovered} itens`} />
                        <InfoItem label="Cadastrado desde" value={user.stats.createdAt} />
                    </section>

                    <section className="mt-6">
                        <p className="text-sm text-gray-500 mb-2">Ações disponíveis</p>
                        <ActionList />
                    </section>
                </main>
            </div>

            <BottomNav />
        </div>
    );
}