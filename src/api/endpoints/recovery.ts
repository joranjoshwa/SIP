import { RecoveryResponse } from "@/src/types/recovery";
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