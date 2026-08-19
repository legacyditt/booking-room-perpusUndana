import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/lib/api/users";
import { queryKeys } from "@/lib/query-keys";
import type { AdminUser } from "@/types/admin";

export function useUsers(role?: "admin" | "user", initialData?: AdminUser[]) {
  return useQuery({
    queryKey: queryKeys.users.byRole(role),
    queryFn: () => getUsers(undefined, role),
    staleTime: 5 * 60 * 1000,
    initialData,
    initialDataUpdatedAt: () => Date.now(),
  });
}