import { apiClient } from "./api-client";

/**
 * Fetcher padrão para ser usado com o hook useSWR.
 * Utiliza o apiClient para herdar lógica de autenticação e refresh token.
 */
export const swrFetcher = async <T>(url: string) => {
  return apiClient<T>(url);
};
