import { RecoveriesByUserFilters, RecoveryHistoryApiResponse, RecoveryResponse } from "@/src/types/recovery";
import { api } from "../axios";
import { AxiosError } from "axios";
import { CategoryEnum } from "@/src/enums/category";

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

const getCategoryValueFromPtLabel = (label?: string) => {
  if (!label) return undefined;
  const key = label.trim().toUpperCase() as keyof typeof CategoryEnum;
  return CategoryEnum[key];
};

export const getRecoveriesByUser = async (
  email: string,
  filters?: RecoveriesByUserFilters
): Promise<RecoveryHistoryApiResponse> => {
  try {


    const params: Record<string, string | number | boolean | undefined> = {
      email,
      itemName: filters?.q?.trim() || undefined,
      status: filters?.status ?? undefined,
      page: filters?.page,
      size: filters?.size,
      startDate: filters?.dateStart
        ? filters.dateStart.toISOString().split("T")[0]
        : undefined,

      endDate: filters?.dateEnd
        ? filters.dateEnd.toISOString().split("T")[0]
        : undefined,
    };

    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") search.set(key, String(value));
    });

    (filters?.category ?? []).forEach((label) => {
      const value = getCategoryValueFromPtLabel(label);
      if (value) search.append("category", value);
    });

    console.log(`/items/recovery-self?${search.toString()}`);
    const { data } = await api.get<RecoveryHistoryApiResponse>(
      `/items/recovery-self?${search.toString()}`
    );

    return data;
  } catch (err) {
    const e = err as AxiosError<any>;
    const apiMsg =
      e.response?.data?.message ??
      e.response?.data?.error ??
      (typeof e.response?.data === "string" ? e.response.data : null);

    throw new Error(apiMsg ?? e.message ?? "Failed to load recoveries");
  }
};

