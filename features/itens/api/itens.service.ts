import { createBaseService } from "@/lib/base-service";
import { ItemDTO, CreateItemDTO } from "./types";

export const itemService = createBaseService<ItemDTO, CreateItemDTO>(
  "/api/itens",
);
