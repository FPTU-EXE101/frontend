import { useQuery } from "@tanstack/react-query";

import storeApi from "@/apis/storeAPI";
import { getAuthenticatedStoreId } from "@/lib/auth";
import { queryKeys } from "@/lib/queryKeys";

export const useAuthenticatedStore = () => {
  const storeId = getAuthenticatedStoreId() ?? "";

  const query = useQuery({
    queryKey: queryKeys.authenticatedStore(storeId),
    enabled: Boolean(storeId),
    queryFn: async ({ signal }) => {
      const response = await storeApi.getStoreById(storeId, { signal });
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    ...query,
    isStoreIdMissing: !storeId,
  };
};
