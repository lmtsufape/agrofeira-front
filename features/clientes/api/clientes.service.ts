import { createBaseService } from "@/lib/base-service";
import { ClienteDTO, CreateClienteDTO } from "./types";

export const clienteService = createBaseService<ClienteDTO, CreateClienteDTO>(
  "/api/v1/clientes",
);
