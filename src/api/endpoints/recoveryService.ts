import { api } from "../axios";
import { RecoveryResponse } from "@/src/types/recovery";

export async function getRecoveryRequests(
  page = 0,
  size = 10,
  sort: string[] = ["requestDate,desc"]
): Promise<RecoveryResponse> {
  const response = await api.get<RecoveryResponse>(
    "/items/admin/recovery",
    {
      params: {
        page,
        size,
        sort,
      },
    }
  );

  return response.data;
}
