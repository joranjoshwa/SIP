import { RecoveryHistoryApiResponse, RecoveryResponse } from "@/src/types/recovery";
import { api } from "../axios";
import { AxiosError } from "axios";

export const getRecoveries = async (
  page = 0,
  size = 10,
  sort = "requestDate,desc"
): Promise<RecoveryResponse> => {
  const response = await api.get<RecoveryResponse>("/items/admin/recovery", {
    params: {
      page,
      size,
      sort,
    },
  });

  return response.data;
};

export const getRecoveriesByUser = async (email: string): Promise<RecoveryHistoryApiResponse> => {
  try {
    const response = await api
      .get<RecoveryHistoryApiResponse>(`/items/recovery-self?email=${email}`)
      .then(r => r.data);

    return response;
  } catch (err) {
    const e = err as AxiosError<any>;
    const apiMsg =
      e.response?.data?.message ??
      e.response?.data?.error ??
      (typeof e.response?.data === "string" ? e.response.data : null);

    throw new Error(apiMsg ?? e.message ?? "Failed to save schedule");
  }
}