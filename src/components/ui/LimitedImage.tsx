"use client";

import { useEffect, useRef, useState } from "react";
import { imageLoadLimiter } from "@/src/lib/imageLoadLimiter";

type Props = {
    src: string;
    alt: string;
    className?: string;
    sizes?: string;
    wrapperClassName?: string;
};

export function LimitedImage({ src, alt, className, sizes, wrapperClassName }: Props) {
    const [allowed, setAllowed] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const releaseRef = useRef<null | (() => void)>(null);

    useEffect(() => {
        let cancelled = false;
        setAllowed(false);
        setLoaded(false);

        (async () => {
            const release = await imageLoadLimiter.acquire();

            if (cancelled) {
                release();
                return;
            }

            let released = false;
            const safeRelease = () => {
                if (released) return;
                released = true;
                release();
            };

            releaseRef.current = safeRelease;

            const t = window.setTimeout(() => safeRelease(), 15000);

            setAllowed(true);

            const old = releaseRef.current;
            releaseRef.current = () => {
                window.clearTimeout(t);
                old?.();
            };
        })();

        return () => {
            cancelled = true;
            releaseRef.current?.();
            releaseRef.current = null;
        };
    }, [src]);

    const done = () => {
        setLoaded(true);
        releaseRef.current?.();
        releaseRef.current = null;
    };

    return (
        <div className={`relative w-full h-full rounded-2xl overflow-hidden ${wrapperClassName ?? ""}`}>
            {!loaded && <div className="skeleton" aria-hidden />}

            {allowed && (
                <img
                    src={src}
                    alt={alt}
                    className={`${className ?? ""} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
                    sizes={sizes}
                    loading="lazy"
                    decoding="async"
                    onLoad={done}
                    onError={done}
                />
            )}
        </div>
    );
}
