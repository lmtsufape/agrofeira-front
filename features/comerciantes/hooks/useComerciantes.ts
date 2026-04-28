"use client";

import {
  usePaginatedQuery,
  PaginatedQueryParams,
} from "@/hooks/usePaginatedQuery";
import { comercianteService } from "../api/comerciantes.service";
import { ComercianteDTO } from "../api/types";

export function useComerciantes(params: PaginatedQueryParams = {}) {
  const { items: comerciantes, ...rest } = usePaginatedQuery<ComercianteDTO>(
    comercianteService.endpoint,
    { sort: "nome,asc", ...params },
  );

  return {
    comerciantes,
    ...rest,
  };
}
