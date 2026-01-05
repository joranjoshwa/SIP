import Image from "next/image";
import { Camera } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { useAvatarUpload } from "../../utils/useAvatarUpload";
import { useTheme } from "../../context/ThemeContext";
import { getTokenFromCookie, extractRoleFromToken } from "@/src/utils/token";
import { Role } from "@/src/types/user";
import { Role as UserRole } from "@/src/enums/role";

type Props = {
    currentAvatar?: string | null;
    onAvatarUpdated?: (newAvatarUrl: string) => void;
    adminEmail?: string;
    handleImageUpload?: (newAvatarUrl: File) => void;
};

const isBlob = (url: string) => url.startsWith("blob:");

export const AvatarEditor = ({ currentAvatar, onAvatarUpdated, adminEmail, handleImageUpload }: Props) => {
    const [preview, setPreview] = useState(currentAvatar || "");
    const [role, setRole] = useState<Role>(UserRole.COMMON);
    const { uploadAvatar, loading } = useAvatarUpload();
    const { theme } = useTheme();

    useEffect(() => {
        const token = getTokenFromCookie();
        const role = extractRoleFromToken(token as string) as Role;
        setRole(role);
    }, []);

    useEffect(() => {
        if (!preview) setPreview(currentAvatar || "");
    }, [currentAvatar]);

    const withBust = (url: string) => {
        const sep = url.includes("?") ? "&" : "?";
        return `${url}${sep}v=${Date.now()}`;
    };

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        const file = e.target.files[0];

        // local preview (no backend)
        const localPreview = URL.createObjectURL(file);
        setPreview(localPreview);

        // ✅ if parent wants to upload later, do NOT upload now
        if (handleImageUpload) {
            handleImageUpload(file); // parent stores File and uploads on "Save"
            return;
        }

        // otherwise: keep your current auto-upload behavior
        let updatedAvatar: string | null;

        if (role === UserRole.ROOT) {
            updatedAvatar = await uploadAvatar(file, adminEmail);
        } else {
            updatedAvatar = await uploadAvatar(file);
        }

        if (updatedAvatar) {
            const busted = withBust(updatedAvatar);
            setPreview(busted);
            onAvatarUpdated?.(busted);
        } else {
            setPreview(currentAvatar || "");
        }
    };

    return (
        <div className="relative w-28 h-28 md:w-32 md:h-32">
            <div className="relative h-28 w-28 md:w-32 md:h-32 rounded-full overflow-hidden shadow-sm">
                {preview ? (
                    isBlob(preview) ? (
                        <img
                            src={preview}
                            alt="Avatar"
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <Image
                            key={preview}
                            src={withBust(preview)}
                            alt="Avatar"
                            fill
                            sizes="112px"
                            className="object-cover"
                            unoptimized
                        />
                    )
                ) : (
                    <div className="h-full w-full flex items-center justify-center bg-[#D4EED9] dark:bg-[#183E1F]">
                        <Camera className="md:h-12 md:w-12 h-8 w-8 text-black dark:text-white" />
                    </div>
                )}
            </div>

            <label
                htmlFor="avatar-upload"
                aria-label="Editar foto"
                className={[
                    "absolute right-0 bottom-0 -translate-x-1/4 translate-y-1/4 p-2 rounded-full",
                    "shadow-md hover:scale-105 focus:outline-none",
                    theme === "light" ? "bg-white text-black" : "bg-gray-800 text-white",
                    loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer",
                ].join(" ")}
            >
                <Camera size={16} />
                <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={loading}
                />
            </label>
        </div>
    );
};
