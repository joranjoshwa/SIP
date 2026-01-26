"use client";

import { useEffect, useRef, useState } from "react";
import { imageLoadLimiter } from "@/src/lib/imageLoadLimiter";

const DEMO_DELAY_MS = 0;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type Props = {
    src: string;
    alt: string;
    className?: string;
    sizes?: string;
    wrapperClassName?: string;
};

export function LimitedImage({
    src,
    alt,
    className,
    sizes,
    wrapperClassName,
}: Props) {
    const [allowedSrc, setAllowedSrc] = useState<string | null>(null);
    const [loaded, setLoaded] = useState(false);

    const releaseRef = useRef<null | (() => void)>(null);
    const cancelledRef = useRef(false);

    useEffect(() => {
        cancelledRef.current = false;
        setAllowedSrc(null);
        setLoaded(false);

        let didRelease = false;

        const run = async () => {
            const release = await imageLoadLimiter.acquire();

            if (DEMO_DELAY_MS > 0) await sleep(DEMO_DELAY_MS);

            if (cancelledRef.current) {
                release();
                return;
            }

            releaseRef.current = () => {
                if (!didRelease) {
                    didRelease = true;
                    release();
                }
            };

            setAllowedSrc(src);
        };

        run();

        return () => {
            cancelledRef.current = true;
            if (releaseRef.current) releaseRef.current();
            releaseRef.current = null;
        };
    }, [src]);

    const onDone = () => {
        setLoaded(true);
        if (releaseRef.current) releaseRef.current();
        releaseRef.current = null;
    };

    return (
        <div className={`relative w-full h-full rounded-2xl overflow-hidden ${wrapperClassName ?? ""}`}>
            {!loaded && (
                <div className="skeleton" aria-hidden />
            )}

            <img
                src={allowedSrc ?? undefined}
                alt={alt}
                className={`${className ?? ""} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"
                    }`}
                sizes={sizes}
                loading="lazy"
                decoding="async"
                onLoad={onDone}
                onError={onDone}
            />
        </div>
    );
}
