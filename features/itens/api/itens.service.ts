import { createBaseService } from "@/lib/base-service";
import { ItemDTO, CreateItemDTO, ItensOpcoesResponseDTO } from "./types";
import { apiClient } from "@/lib/api-client";

const baseService = createBaseService<ItemDTO, CreateItemDTO>("/api/v1/itens");

const CACHE_KEY_OPCOES = "agrofeira_itens_opcoes";

export const itemService = {
  ...baseService,

  async getOpcoes(): Promise<ItensOpcoesResponseDTO> {
    // Tenta recuperar do cache se estiver no cliente
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem(CACHE_KEY_OPCOES);
      if (cached) {
        try {
          return JSON.parse(cached) as ItensOpcoesResponseDTO;
        } catch (err) {
          console.error("Falha ao parsear cache de opções", err);
          localStorage.removeItem(CACHE_KEY_OPCOES);
        }
      }
    }

    const data = await apiClient<ItensOpcoesResponseDTO>(
      "/api/v1/itens/opcoes",
      {},
    );

    // Salva no cache se estiver no cliente
    if (typeof window !== "undefined") {
      localStorage.setItem(CACHE_KEY_OPCOES, JSON.stringify(data));
    }

    return data;
  },
};
