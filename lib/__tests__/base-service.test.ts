import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { createBaseService } from "../base-service";
import { apiClient } from "../api-client";

vi.mock("../api-client", () => ({
  apiClient: vi.fn(),
}));

interface User {
  id: string;
  name: string;
}

describe("base-service", () => {
  const endpoint = "/users";
  const service = createBaseService<User>(endpoint);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getAll deve chamar apiClient com endpoint correto", async () => {
    const mockData = { content: [{ id: "1", name: "User 1" }], totalPages: 1 };
    (apiClient as Mock).mockResolvedValue(mockData);

    const result = await service.getAll();

    expect(result).toEqual(mockData);
    expect(apiClient).toHaveBeenCalledWith(endpoint, {});
  });

  it("getAll deve incluir params se fornecidos", async () => {
    await service.getAll({ page: 1, limit: 10 });
    expect(apiClient).toHaveBeenCalledWith(`${endpoint}?page=1&limit=10`, {});
  });

  it("getById deve chamar apiClient com o id", async () => {
    await service.getById("123");
    expect(apiClient).toHaveBeenCalledWith(`${endpoint}/123`, {});
  });

  it("create deve chamar apiClient com POST e body", async () => {
    const data = { id: "2", name: "New User" };
    await service.create(data);
    expect(apiClient).toHaveBeenCalledWith(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  });

  it("update deve chamar apiClient com PUT e body", async () => {
    const data = { name: "Updated User" };
    await service.update("123", data);
    expect(apiClient).toHaveBeenCalledWith(`${endpoint}/123`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  });

  it("delete deve chamar apiClient com DELETE", async () => {
    await service.delete("123");
    expect(apiClient).toHaveBeenCalledWith(`${endpoint}/123`, {
      method: "DELETE",
    });
  });
});
