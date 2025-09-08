import { Gift, Home, LogOut, Moon, Search, User } from "lucide-react";
import { Button } from "./Button";
import { Logo } from "./Logo";

export const Sidebar = () => {
    return (
        <aside className="hidden md:flex md:flex-col md:col-span-3 md:border-r md:pr-6 md: pt-8">
            <nav className="flex flex-col gap-3">
                <Button variant="primary" className="flex items-center gap-3 justify-start">
                    <Home size={18} />
                    <span>Página inicial</span>
                </Button>

                <Button variant="secondary" className="flex items-center gap-3 justify-start border-0 pl-2">
                    <Gift size={18} />
                    <span>Itens para doação</span>
                </Button>

                <Button variant="secondary" className="flex items-center gap-3 justify-start border-0 pl-2">
                    <User size={18} />
                    <span>Perfil</span>
                </Button>

                <Button variant="secondary" className="flex items-center gap-3 justify-start border-0 pl-2">
                    <Search size={18} />
                    <span>Buscar</span>
                </Button>
            </nav>

            <div className="mt-auto py-6 flex flex-col gap-3">
                <Button variant="secondary" className="flex items-center gap-3 justify-start border-0 pl-2">
                    <Moon size={18} />
                    <span>Tema escuro</span>
                </Button>

                <Button variant="secondary" className="flex items-center gap-3 justify-start border-0 pl-2">
                    <LogOut size={18} />
                    <span>Sair</span>
                </Button>
            </div>
        </aside>
    );
}