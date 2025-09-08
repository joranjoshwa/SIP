import Image from "next/image";
import avatar from "../../assets/avatar-placeholder.png"
import { Camera } from "lucide-react";

export const AvatarEditor = () => {
    return (
        <div className="relative w-28 h-28 md:w-32 md:h-32 mx-auto">
            <Image
                src={avatar}
                alt="Logo"
                className="w-full h-full object-cover rounded-full border-2 border-gray-100 shadow-sm"
            />

            <button
                aria-label="Editar foto"
                className="absolute right-0 bottom-0 -translate-x-1/4 translate-y-1/4 bg-white p-2 rounded-full
                shadow-md hover:scale-105 focus:outline-none"
            >
                <Camera size={16}/>
            </button>
        </div>
    );
}
