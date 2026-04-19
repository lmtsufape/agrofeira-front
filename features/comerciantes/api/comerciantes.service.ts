import { createBaseService } from "@/lib/base-service";
import { ComercianteDTO, CreateComercianteDTO } from "./types";

export const comercianteService = createBaseService<
  ComercianteDTO,
  CreateComercianteDTO
>("/api/comerciantes");
