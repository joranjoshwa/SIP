"use client"

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
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        if (!showSuccess) return;
        const t = setTimeout(() => setShowSuccess(false), 2500);
        return () => clearTimeout(t);
    }, [showSuccess]);

    useEffect(() => {
        if (!showError) return;
        const t = setTimeout(() => setShowError(false), 3000);
        return () => clearTimeout(t);
    }, [showError]);

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

        setError(null);
        setShowError(false);

        const file = e.target.files[0];
        const localPreview = URL.createObjectURL(file);
        setPreview(localPreview);

        if (handleImageUpload) {
            handleImageUpload(file);
            return;
        }

        setIsProcessing(true);

        try {
            role === UserRole.ROOT
                ? await uploadAvatar(file, true, adminEmail)
                : await uploadAvatar(file);

            setShowSuccess(true);
        } catch (err) {
            const msg =
                err instanceof Error ? err.message : "Erro ao atualizar a foto.";
            setError(msg);
            setShowError(true);
        } finally {
            setIsProcessing(false);
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
                            src={process.env.NEXT_PUBLIC_IMAGE_BASE_URL + withBust(preview)}
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

                {(loading || isProcessing) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    </div>
                )}

                {showError && (
                    <div
                        className={[
                            "fixed z-50 left-1/2 top-6 -translate-x-1/2",
                            "rounded-xl px-4 py-2 text-sm font-medium shadow-lg ring-2",
                            "bg-[#F9D0D0] text-black ring-[#F9D0D0]",
                            "dark:bg-[#570000] dark:text-white dark:ring-[#570000]",
                        ].join(" ")}
                    >
                        {error ?? "Erro ao atualizar a foto."}
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
                    (loading || isProcessing) ? "opacity-70 cursor-not-allowed" : "cursor-pointer",
                ].join(" ")}
            >
                <Camera size={16} />
                <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={loading || isProcessing}
                />
            </label>
            {showSuccess && (
                <div
                    className={[
                        "fixed z-50 left-1/2 top-6 -translate-x-1/2",
                        "rounded-xl px-4 py-2 text-sm font-medium shadow-lg",
                        "ring-2",
                        "bg-[#D4EED9] text-black ring-[#D4EED9]",
                        "dark:bg-[#183E1F] dark:text-white dark:ring-[#183E1F]",
                    ].join(" ")}
                >
                    Foto atualizada com sucesso
                </div>
            )}

        </div>
    );
};
