"use client";

import Image from "next/image";
import loading from "@/src/assets/loading.gif";
import loadingWhite from "@/src/assets/loading-white.gif";
import logo from "@/src/assets/sip-icon.svg";

export function RouteLoadingOverlay({
    show,
    darkMode,
}: {
    show: boolean;
    darkMode: boolean;
}) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm">
            <div className="relative h-39">
                <Image
                    src={darkMode ? loadingWhite : loading}
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
