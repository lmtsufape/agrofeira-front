import { apiClient } from "./api-client";

export function createBaseService<
  T,
  CreateDTO = T,
  UpdateDTO = Partial<CreateDTO>,
>(endpoint: string) {
  return {
    getAll: (params?: string) => {
      const url = params ? `${endpoint}?${params}` : endpoint;
      return apiClient<T[]>(url);
    },

    getById: (id: string) => {
      return apiClient<T>(`${endpoint}/${id}`);
    },

    create: (data: CreateDTO) => {
      return apiClient<T>(endpoint, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    update: (id: string, data: UpdateDTO) => {
      return apiClient<T>(`${endpoint}/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },

    delete: (id: string) => {
      return apiClient<void>(`${endpoint}/${id}`, {
        method: "DELETE",
      });
    },
  };
}
