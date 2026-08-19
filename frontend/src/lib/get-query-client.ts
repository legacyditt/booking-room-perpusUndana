import { cache } from "react";
import { QueryClient } from "@tanstack/react-query";

// ponytail: untuk future server prefetch (lihat TODO.md)
export const getQueryClient = cache(() => new QueryClient());