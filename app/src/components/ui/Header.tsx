import { Bell } from "lucide-react";
import { Logo } from "./Logo";

export const Header = () => {
    return (
        <header className="flex items-center justify-between py-4 px-4 md:px-8">
            <Logo className="h-6 md:h-8" />

            <button
                aria-label="Notificações"
                className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1"
            >
                <Bell size={18}/>
            </button>
        </header>
    );
}