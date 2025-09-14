import { useState } from "react"
import { extractEmailFromToken } from "./token";
import { api } from "../api/axios";

export const useAvatarUpload = () => {
    const [loading, setLoading] = useState(false);

    const uploadAvatar = async (file: File): Promise<string | null> => {
        try {
            setLoading(true);

            const token = localStorage.getItem("token");
            if (!token) return null;

            const email = extractEmailFromToken(token)
            if (!email) return null;

            const formData = new FormData();
            formData.append("profileImage", file);

            const { data } = await api.patch(
                `/user/update-profile/${email}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            )

            return data.profileImageUrl;

        } catch (error) {
            console.error("Erro ao atualizar avatar: ", error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { uploadAvatar, loading };
}