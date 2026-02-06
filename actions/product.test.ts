import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getProduct } from "./product";

// Mock global fetch
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

describe("getProduct Server Action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Happy Path", () => {
    it("should fetch product successfully from OpenFoodFacts API when barcode is valid", async () => {
      // Arrange
      const barcode = "3017620422003";
      const mockApiResponse = {
        status: 1,
        product: {
          code: "3017620422003",
          product_name: "Nutella",
          brands: "Ferrero",
          image_url: "https://example.com/nutella.jpg",
          categories: "Spreads, Sweet spreads",
          nutriments: {
            "energy-kcal_100g": 539,
            proteins_100g: 6.3,
            carbohydrates_100g: 57.5,
            fat_100g: 30.9,
          },
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      // Act
      const result = await getProduct(barcode);

      // Assert
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
        { next: { revalidate: 3600 } }
      );
      expect(result.code).toBe("3017620422003");
      expect(result.product_name).toBe("Nutella");
      expect(result.brands).toBe("Ferrero");
      expect(result.image_url).toBe("https://example.com/nutella.jpg");
      expect(result.categories).toBe("Spreads, Sweet spreads");
      expect(result.nutriments.energy_kcal_100g).toBe(539);
      expect(typeof result.simulated_price).toBe("number");
    });

    it("should fetch product successfully with 6-digit barcode (minimum)", async () => {
      // Arrange
      const barcode = "123456";
      const mockApiResponse = {
        status: 1,
        product: {
          code: "123456",
          product_name: "Test Product",
          brands: "Test Brand",
          image_url: "https://example.com/test.jpg",
          categories: "Test",
          nutriments: {
            "energy-kcal_100g": 100,
            proteins_100g: 5,
            carbohydrates_100g: 10,
            fat_100g: 2,
          },
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      // Act
      const result = await getProduct(barcode);

      // Assert
      expect(result.code).toBe("123456");
      expect(result.product_name).toBe("Test Product");
    });

    it("should fetch product successfully with 13-digit barcode (maximum)", async () => {
      // Arrange
      const barcode = "7501055363803";
      const mockApiResponse = {
        status: 1,
        product: {
          code: "7501055363803",
          product_name: "Coca Cola",
          brands: "Coca-Cola",
          image_url: "https://example.com/coca-cola.jpg",
          categories: "Beverages",
          nutriments: {
            "energy-kcal_100g": 42,
            proteins_100g: 0,
            carbohydrates_100g: 10.6,
            fat_100g: 0,
          },
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      // Act
      const result = await getProduct(barcode);

      // Assert
      expect(result.code).toBe("7501055363803");
      expect(result.product_name).toBe("Coca Cola");
    });
  });

  describe("Error States - Product Not Found", () => {
    it("should throw error when product is not found (status: 0)", async () => {
      // Arrange
      const barcode = "0000000000000";
      const mockApiResponse = {
        status: 0,
        status_verbose: "product not found",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      // Act & Assert
      await expect(getProduct(barcode)).rejects.toThrow(
        "Producto no encontrado"
      );
    });

    it("should throw error with specific Spanish message when API returns status 0", async () => {
      // Arrange
      const barcode = "9999999999999";
      const mockApiResponse = {
        status: 0,
        status_verbose: "product not found",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      // Act & Assert
      await expect(getProduct(barcode)).rejects.toThrow(
        "Producto no encontrado"
      );
    });
  });

  describe("Error States - Network Errors", () => {
    it("should throw error when network request fails", async () => {
      // Arrange
      const barcode = "3017620422003";
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      // Act & Assert
      await expect(getProduct(barcode)).rejects.toThrow("Network error");
    });

    it("should throw error when API returns 500 status", async () => {
      // Arrange
      const barcode = "3017620422003";
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      // Act & Assert
      await expect(getProduct(barcode)).rejects.toThrow(
        "Error al conectar con el servidor"
      );
    });

    it("should throw error when API returns 404 status", async () => {
      // Arrange
      const barcode = "3017620422003";
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
      });

      // Act & Assert
      await expect(getProduct(barcode)).rejects.toThrow(
        "Error al conectar con el servidor"
      );
    });

    it("should throw error when fetch times out", async () => {
      // Arrange
      const barcode = "3017620422003";
      mockFetch.mockRejectedValueOnce(new Error("Request timeout"));

      // Act & Assert
      await expect(getProduct(barcode)).rejects.toThrow("Request timeout");
    });
  });

  describe("Edge Cases", () => {
    it("should handle API response with empty product data using defaults", async () => {
      // Arrange
      const barcode = "3017620422003";
      const mockApiResponse = {
        status: 1,
        product: {},
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      // Act
      const result = await getProduct(barcode);

      // Assert - Should use adapter defaults for missing fields
      expect(result).toBeDefined();
      expect(result.product_name).toBe("Producto sin nombre");
      expect(result.brands).toBe("Marca desconocida");
      expect(result.categories).toBe("Sin categoría");
    });

    it("should handle API response with malformed JSON", async () => {
      // Arrange
      const barcode = "3017620422003";
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error("Invalid JSON");
        },
      });

      // Act & Assert
      await expect(getProduct(barcode)).rejects.toThrow("Invalid JSON");
    });

    it("should construct correct API URL with barcode parameter", async () => {
      // Arrange
      const barcode = "8076809513685";
      const mockApiResponse = {
        status: 1,
        product: {
          code: "8076809513685",
          product_name: "Ferrero Rocher",
          brands: "Ferrero",
          image_url: "https://example.com/ferrero.jpg",
          categories: "Snacks",
          nutriments: {
            "energy-kcal_100g": 570,
            proteins_100g: 8.5,
            carbohydrates_100g: 42.7,
            fat_100g: 42.7,
          },
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      // Act
      await getProduct(barcode);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        "https://world.openfoodfacts.org/api/v0/product/8076809513685.json",
        { next: { revalidate: 3600 } }
      );
    });
  });

  describe("API Integration", () => {
    it("should call fetch with Next.js revalidate option for caching", async () => {
      // Arrange
      const barcode = "3017620422003";
      const mockApiResponse = {
        status: 1,
        product: {
          code: "3017620422003",
          product_name: "Nutella",
          brands: "Ferrero",
          image_url: "https://example.com/nutella.jpg",
          categories: "Spreads",
          nutriments: {
            "energy-kcal_100g": 539,
            proteins_100g: 6.3,
            carbohydrates_100g: 57.5,
            fat_100g: 30.9,
          },
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      // Act
      await getProduct(barcode);

      // Assert
      expect(mockFetch).toHaveBeenCalledTimes(1);
      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[0]).toContain(barcode);
      expect(callArgs[1]).toEqual({ next: { revalidate: 3600 } });
    });

    it("should include simulated price in the returned product", async () => {
      // Arrange
      const barcode = "3017620422003";
      const mockApiResponse = {
        status: 1,
        product: {
          code: "3017620422003",
          product_name: "Nutella",
          brands: "Ferrero",
          image_url: "https://example.com/nutella.jpg",
          categories: "Spreads",
          nutriments: {
            "energy-kcal_100g": 539,
            proteins_100g: 6.3,
            carbohydrates_100g: 57.5,
            fat_100g: 30.9,
          },
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      // Act
      const result = await getProduct(barcode);

      // Assert
      expect(result.simulated_price).toBeDefined();
      expect(result.simulated_price).toBeGreaterThanOrEqual(5);
      expect(result.simulated_price).toBeLessThanOrEqual(150);
    });
  });
});
