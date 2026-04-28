"use client";

import {
  usePaginatedQuery,
  PaginatedQueryParams,
} from "@/hooks/usePaginatedQuery";
import { clienteService } from "../api/clientes.service";
import { ClienteDTO } from "../api/types";

export function useClientes(params: PaginatedQueryParams = {}) {
  const { items: clientes, ...rest } = usePaginatedQuery<ClienteDTO>(
    clienteService.endpoint,
    params,
  );

  return {
    clientes,
    ...rest,
  };
}
