import { useQuery } from "@tanstack/react-query";

import storeApi from "@/apis/storeAPI";
import { getAuthenticatedStoreId, getCurrentUserId } from "@/lib/auth";
import { queryKeys } from "@/lib/queryKeys";

export const useManagerStore = () => {
  const managerId = getCurrentUserId() ?? "";
  const storeId = getAuthenticatedStoreId() ?? "";

  const query = useQuery({
    queryKey: queryKeys.managerStore(managerId),
    enabled: Boolean(managerId && storeId),
    queryFn: async ({ signal }) => {
      const response = await storeApi.getStoreById(storeId, { signal });
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    ...query,
    isStoreIdMissing: Boolean(managerId && !storeId),
  };
};
