import { RecoveryResponse, RecoveryScheduleResponse } from "@/src/types/recovery";
import { api } from "../axios";

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

export const getRecoverySchedule = async (
  token: string,
  email: string,
  page = 0,
  size = 10,
  sort = "pickupDate,asc"
): Promise<RecoveryScheduleResponse> => {
  const response = await api.get<RecoveryScheduleResponse>(
    "/items/recovery-self",
    {
      params: {
        page,
        size,
        sort,
        email,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};