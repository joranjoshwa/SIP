"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { AxiosError } from "axios";
import { logout } from "@/src/utils/token";

import { api } from "@/src/api/axios";

type Props = {
  onForbidden?: (err: AxiosError) => void;
};

export function Http403Listener({ onForbidden }: Props) {
  const router = useRouter();

  useEffect(() => {
    const interceptorId = api.interceptors.response.use(
      (res) => res,
      (err: AxiosError<any>) => {
        const status = err.response?.status;

        if (status === 403) {
          onForbidden?.(err);

          logout();
          router.replace("/login");
        }

        return Promise.reject(err);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptorId);
    };
  }, [router, onForbidden]);

  return null;
}
