"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type RetryingImageProps = {
    src: string;
    alt: string;
    className?: string;
    sizes?: string;
    fill?: boolean;
    placeholderSrc?: string;
    baseDelayMs?: number;
    maxDelayMs?: number;
};

export function RetryingImage({
    src,
    alt,
    className,
    sizes,
    fill = true,
    placeholderSrc = "/img/placeholder.png",
    baseDelayMs = 600,
    maxDelayMs = 8000,
}: RetryingImageProps) {
    const [attempt, setAttempt] = useState(0);
    const [loaded, setLoaded] = useState(false);

    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        setAttempt(0);
        setLoaded(false);
        return () => {
            if (timerRef.current) window.clearTimeout(timerRef.current);
        };
    }, [src]);

    const retrySrc = useMemo(() => {
        const u = new URL(src, typeof window !== "undefined" ? window.location.href : "http://localhost");
        u.searchParams.set("_retry", String(attempt));
        u.searchParams.set("_t", String(Date.now()));
        return u.toString();
    }, [src, attempt]);

    function scheduleRetry() {
        const delay = Math.min(maxDelayMs, Math.round(baseDelayMs * Math.pow(1.6, attempt)));
        timerRef.current = window.setTimeout(() => setAttempt((a) => a + 1), delay);
    }

    return (
        <>
            {!loaded && (
                <Image
                    src={placeholderSrc}
                    alt=""
                    fill={fill}
                    sizes={sizes}
                    className={className}
                    aria-hidden
                    unoptimized
                />
            )}

            <Image
                src={retrySrc}
                alt={alt}
                fill={fill}
                sizes={sizes}
                className={loaded ? className : "hidden"}
                loading="lazy"
                unoptimized
                onLoad={() => setLoaded(true)}
                onError={() => scheduleRetry()}
            />
        </>
    );
}
