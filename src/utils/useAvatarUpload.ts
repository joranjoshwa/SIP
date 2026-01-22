import { useState } from "react"
import { extractEmailFromToken, extractRoleFromToken } from "./token";
import { api } from "../api/axios";

export const useAvatarUpload = () => {
    const [loading, setLoading] = useState(false);

    const uploadAvatar = async (file: File, auth = true, adminEmail?: string): Promise<string | null> => {
        try {
            setLoading(true);

            const token = localStorage.getItem("token");
            if (!token) return null;

            let email, url;

            if (adminEmail && auth) {
                email = adminEmail;
                url = "/user/root/update-profile/";
            } else if (!auth) {
                email = adminEmail;
                url = "/user/account/update-profile/";
            }
            else {
                email = extractEmailFromToken(token);
                url = "/user/update-profile/";
            }

            if (!email) return null;

            const formData = new FormData();
            formData.append("profileImage", file);
            let content;

            if (auth) {
                const { data } = await api.patch(
                    url + email,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data"
                        }
                    }
                )

                content = data;
            } else {
                const { data } = await api.patch(
                    url + email,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }

                    }
                )
                content = data;
            }

            return content.profileImageUrl;

        } catch (error) {
            console.error("Erro ao atualizar avatar: ", error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { uploadAvatar, loading };
}