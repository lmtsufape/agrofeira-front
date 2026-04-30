import { Page } from "@/types/api";
import { apiClient, ApiClientOptions } from "./api-client";

export function createBaseService<
  T,
  CreateDTO = T,
  UpdateDTO = Partial<CreateDTO>,
>(endpoint: string) {
  return {
    endpoint,
    getAll: (
      params?: Record<string, string | number>,
      options: ApiClientOptions = {},
    ) => {
      let url = endpoint;
      if (params) {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== "") {
            queryParams.append(key, String(value));
          }
        });
        const queryString = queryParams.toString();
        if (queryString) url += `?${queryString}`;
      }
      return apiClient<Page<T>>(url, options);
    },

    getById: (id: string, options: ApiClientOptions = {}) => {
      return apiClient<T>(`${endpoint}/${id}`, options);
    },

    create: (data: CreateDTO, options: ApiClientOptions = {}) => {
      return apiClient<T>(endpoint, {
        ...options,
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    update: (id: string, data: UpdateDTO, options: ApiClientOptions = {}) => {
      return apiClient<T>(`${endpoint}/${id}`, {
        ...options,
        method: "PUT",
        body: JSON.stringify(data),
      });
    },

    delete: (id: string, options: ApiClientOptions = {}) => {
      return apiClient<void>(`${endpoint}/${id}`, {
        ...options,
        method: "DELETE",
      });
    },
  };
}
