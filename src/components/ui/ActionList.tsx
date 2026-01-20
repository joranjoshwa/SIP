import { Box, Key, Moon, LogOut, Sun, HandHeart } from "lucide-react";
import { Button } from "./Button";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useTheme } from "@/src/context/ThemeContext";
import { Role } from "@/src/types/user";
import { Role as RoleUser} from "@/src/enums/role";
import { logout } from "@/src/utils/token";

type Action = {
    key: string;
    label: string;
    Icon: React.ElementType;
    onClick?: () => void;
    role?: Role[],
};

type Props = {
    userRole?: Role,
}

export const ActionList = ({ userRole }: Props) => {
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();

    const actions: Action[] = [
        {
            key: "history",
            label: "Histórico de itens",
            Icon: Box,
            onClick: () => router.push("/dashboard/request-history"),
            role: [RoleUser.COMMON]
        },
        {
            key: "donation",
            label: "Itens para doação",
            Icon: HandHeart,
            onClick: () => router.push("/dashboard/donation"),
            role: [RoleUser.ADMIN]
        },
        {
            key: "password",
            label: "Alterar senha",
            Icon: Key,
            onClick: () => router.push("/dashboard/change-password"),
            role: [RoleUser.COMMON, RoleUser.ADMIN]
        },
        {
            key: "theme",
            label: `Alterar tema`,
            Icon: theme === "dark" ? Moon : Sun,
            onClick: toggleTheme,
        },
        {
            key: "logout",
            label: "Sair da conta",
            Icon: LogOut,
            onClick: () => logout(),
        },
    ];

    return (
        <div className="mt-4 space-y-3">
            {actions.map(({ key, label, Icon, onClick, role }) => {
                if(role && !role.includes(userRole as Role) ) return;
                return (
                    <Button
                        key={key}
                        variant="primary"
                        onClick={onClick}
                        className="flex items-center justify-center gap-3 md:w-1/2 md:py-2 md:px-3"
                        aria-label={label}
                    >
                        <Icon size={18} />
                        <span>{label}</span>
                    </Button>
                )
            })}
        </div>
    );
};
