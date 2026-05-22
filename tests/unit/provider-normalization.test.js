import { describe, it, expect } from "vitest";
import { normalizeProviderSpecificData } from "../../src/lib/providerNormalization.js";

describe("normalizeProviderSpecificData - ollama-local baseUrl handling", () => {
  /**
   * Regression test: when provider is 'ollama-local' and baseUrl is provided
   * via providerSpecificData, it should override any body-level baseUrl.
   * This ensures local ollama instances with custom hosts work correctly.
   */
  it("uses baseUrl from providerSpecificData over body.baseUrl for ollama-local", () => {
    const body = {
      baseUrl: "http://localhost:11434",
      model: "llama3",
    };
    const providerSpecificData = {
      baseUrl: "http://192.168.1.100:11434",
    };

    const result = normalizeProviderSpecificData(
      "ollama-local",
      body,
      providerSpecificData
    );

    expect(result).not.toBeNull();
    expect(result.baseUrl).toBe("http://192.168.1.100:11434");
  });

  it("uses body.baseUrl when providerSpecificData.baseUrl is absent for ollama-local", () => {
    const body = {
      baseUrl: "http://localhost:11434",
      model: "llama3",
    };

    const result = normalizeProviderSpecificData("ollama-local", body, null);

    expect(result).not.toBeNull();
    expect(result.baseUrl).toBe("http://localhost:11434");
  });

  it("returns null when no providerSpecificData and no body.baseUrl for ollama-local", () => {
    const body = { model: "llama3" };

    const result = normalizeProviderSpecificData("ollama-local", body, null);

    expect(result).toBeNull();
  });

  it("ignores baseUrl for non-ollama-local providers", () => {
    const body = {
      baseUrl: "http://localhost:11434",
      model: "gpt-4",
    };
    const providerSpecificData = {
      baseUrl: "http://192.168.1.100:11434",
    };

    const result = normalizeProviderSpecificData(
      "openai-compatible",
      body,
      providerSpecificData
    );

    expect(result).toBeNull();
  });

  it("uses baseURL (capital letters) from body for ollama-local", () => {
    const body = {
      baseURL: "http://localhost:11434",
      model: "llama3",
    };

    const result = normalizeProviderSpecificData("ollama-local", body, null);

    expect(result).not.toBeNull();
    expect(result.baseUrl).toBe("http://localhost:11434");
  });

  it("prefers ollamaHostUrl from body for ollama-local", () => {
    const body = {
      baseUrl: "http://localhost:11434",
      ollamaHostUrl: "http://custom-host:11434",
      model: "llama3",
    };

    const result = normalizeProviderSpecificData("ollama-local", body, null);

    expect(result).not.toBeNull();
    expect(result.baseUrl).toBe("http://custom-host:11434");
  });
});