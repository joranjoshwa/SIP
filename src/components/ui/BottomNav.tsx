import { Heart, Home, Search, User } from "lucide-react";

export const BottomNav = () => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t py-2 px-6 flex justify-between md:hidden
                        dark:bg-[#0F0F0F] dark:border-gray-900">
            <button className="flex flex-col items-center text-xs dark:text-gray-200">
                <User size={18} />
                <span>Perfil</span>
            </button>
            <button className="flex flex-col items-center text-xs dark:text-gray-200">
                <Home size={18} />
                <span>Início</span>
            </button>
            <button className="flex flex-col items-center text-xs dark:text-gray-200">
                <Heart size={18} />
                <span>Doações</span>
            </button>
            <button className="flex flex-col items-center text-xs dark:text-gray-200">
                <Search size={18} />
                <span>Buscar</span>
            </button>
        </nav>
    );
}