import Image from "next/image";
import avatar from "../../assets/avatar-placeholder.png"
import { Camera } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { useAvatarUpload } from "../../utils/useAvatarUpload";
import { useTheme } from "../../context/ThemeContext";

type Props = {
    currentAvatar?: string | null;
    onAvatarUpdated?: (newAvatarUrl: string) => void;
};

export const AvatarEditor = ({ currentAvatar,  onAvatarUpdated }: Props) => {
    const [preview, setPreview] = useState(currentAvatar || "");
    const { uploadAvatar, loading } = useAvatarUpload();
    const { theme } = useTheme();

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        const file = e.target.files[0];
        const localPreview = URL.createObjectURL(file);
        setPreview(localPreview);

        const updatedAvatar = await uploadAvatar(file);
        if (updatedAvatar) {
            setPreview(updatedAvatar);
            onAvatarUpdated?.(updatedAvatar);
        } else {
            setPreview(currentAvatar || "");
        }
    };

    return (
        <div className="relative w-28 h-28 md:w-32 md:h-32">
            <Image
                src={preview || avatar}
                alt="Avatar"
                fill
                className="w-full h-full object-cover rounded-full border-2 border-gray-100 shadow-sm"
            />

            <label
                htmlFor="avatar-upload"
                aria-label="Editar foto"
                className={`absolute right-0 bottom-0 -translate-x-1/4 translate-y-1/4 p-2 rounded-full
                    shadow-md hover:scale-105 focus:outline-none 
                    ${theme === "light" ? "bg-white text-black" : "bg-gray-800 text-white"}`}
            >
                <Camera size={16}/>
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
}
