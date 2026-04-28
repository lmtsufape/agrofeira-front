"use client";

import useSWR from "swr";
import { swrFetcher } from "@/lib/swr-fetcher";
import { Page } from "@/types/api";

export interface PaginatedQueryParams {
  page?: number;
  size?: number;
  nome?: string;
  sort?: string;
}

/**
 * Hook genérico para realizar queries paginadas com SWR.
 * Centraliza a construção de query params e chaves de cache.
 */
export function usePaginatedQuery<T>(
  endpoint: string,
  params: PaginatedQueryParams = {},
) {
  const { page = 0, size = 10, nome = "", sort = "" } = params;

  const queryParams = new URLSearchParams();
  queryParams.append("page", page.toString());
  queryParams.append("size", size.toString());
  if (nome) queryParams.append("nome", nome);
  if (sort) queryParams.append("sort", sort);

  const key = `${endpoint}?${queryParams.toString()}`;

  const { data, error, isLoading, mutate } = useSWR<Page<T>>(key, swrFetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  });

  return {
    items: data?.content || [],
    pageData: data,
    isLoading,
    isError: error,
    mutate,
  };
}
