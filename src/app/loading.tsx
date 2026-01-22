"use client";

import Image from "next/image";
import logo from "@/src/assets/sip-icon.svg";
import loading from "@/src/assets/loading.gif";
import loadingWhite from "@/src/assets/loading-white.gif";
import { useTheme } from "@/src/context/ThemeContext";

export default function Loading() {
    const { theme } = useTheme();

    const gifSrc = theme === "dark" ? loadingWhite : loading;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="relative h-39">
                <Image
                    src={gifSrc}
                    alt="Carregando..."
                    unoptimized
                    priority
                    className="w-full h-full"
                />
                
                <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                        src={logo}
                        alt="Logo SIP"
                        width={90}
                        height={90}
                        priority
                    />
                </div>
            </div>
        </div>
    );
}
