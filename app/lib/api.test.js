import { setAuthToken, api } from "./api";

// Mock da função fetch global
global.fetch = jest.fn();

describe("api.js", () => {
  beforeEach(() => {
    // Limpa todos os mocks antes de cada teste
    fetch.mockClear();
  });

  describe("setAuthToken", () => {
    it("deve definir o token de autenticação", () => {
      const token = "test-token-123";
      setAuthToken(token);
      // Como authToken é uma variável interna, não podemos acessá-la diretamente.
      // Vamos verificar indiretamente através de uma chamada fetchApi.
      // Para isso, precisamos mockar uma resposta de sucesso para fetchApi.
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ message: "Success" }),
        headers: {
          get: () => "application/json",
        },
      });

      api.auth.login(); // Chama uma rota que usa fetchApi

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${token}`,
          }),
        })
      );
    });
  });

  describe("fetchApi", () => {
    it("deve fazer uma requisição GET sem token de autenticação", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: "test" }),
        headers: {
          get: () => "application/json",
        },
      });

      const result = await api.auth.login(); // Usando uma rota existente para testar fetchApi
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:8080/api/auth/login",
        expect.objectContaining({
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
      );
      expect(result).toEqual({ data: "test" });
    });

    it("deve fazer uma requisição POST com body e token de autenticação", async () => {
      const token = "post-token-456";
      setAuthToken(token);

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id: 1, name: "New Item" }),
        headers: {
          get: () => "application/json",
        },
      });

      const postData = { name: "New Item" };
      const result = await api.posts.create(postData); // Usando uma rota existente para testar fetchApi

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:8080/api/posts",
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(postData),
        })
      );
      expect(result).toEqual({ id: 1, name: "New Item" });
    });

    it("deve retornar null para status 204 (No Content)", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        headers: {
          get: () => "",
        },
      });

      const result = await api.games.delete(1); // Usando uma rota existente para testar fetchApi
      expect(result).toBeNull();
    });

    it("deve rejeitar a promessa em caso de erro HTTP", async () => {
      const errorResponse = { message: "Not Found" };
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve(errorResponse),
        headers: {
          get: () => "application/json",
        },
      });

      await expect(api.games.getById(999)).rejects.toEqual(errorResponse);
    });

    it("deve rejeitar a promessa em caso de erro de rede", async () => {
      const networkError = new Error("Network error");
      fetch.mockRejectedValueOnce(networkError);

      await expect(api.auth.login()).rejects.toEqual(networkError);
    });

    it("deve retornar texto se o content-type não for json", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve("OK"),
        headers: {
          get: () => "text/plain",
        },
      });

      const result = await api.auth.login(); // Usando uma rota existente para testar fetchApi
      expect(result).toEqual("OK");
    });

    it("deve retornar null se o content-type não for json e o corpo for vazio", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve(""),
        headers: {
          get: () => "text/plain",
        },
      });

      const result = await api.auth.login(); // Usando uma rota existente para testar fetchApi
      expect(result).toBeNull();
    });
  });

  describe("fetchApiFormData", () => {
    it("deve fazer uma requisição PUT com FormData e token de autenticação", async () => {
      const token = "formdata-token-789";
      setAuthToken(token);

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true }),
        headers: {
          get: () => "application/json",
        },
      });

      const formData = new FormData();
      formData.append("file", "dummy-file");

      // Usando uma rota que aceita FormData, como players.updatePhoto
      const result = await api.players.updatePhoto("123", formData);

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:8080/api/players/123/photo",
        expect.objectContaining({
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })
      );
      expect(result).toEqual({ success: true });
    });

    it("deve rejeitar a promessa em caso de erro HTTP com FormData", async () => {
      const errorResponse = { message: "Upload Failed" };
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve(errorResponse),
        headers: {
          get: () => "application/json",
        },
      });

      const formData = new FormData();
      formData.append("file", "dummy-file");

      await expect(api.players.updatePhoto("123", formData)).rejects.toEqual(
        errorResponse
      );
    });
  });
});
