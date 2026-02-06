import { describe, it, expect } from "vitest";
import { adaptProduct } from "./product.adapter";

describe("adaptProduct", () => {
  const TEST_BARCODE = "3017620422003";

  describe("Happy Path", () => {
    it("should transform complete API product to application Product type", () => {
      // Arrange
      const apiProduct = {
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
      };

      // Act
      const result = adaptProduct(apiProduct, TEST_BARCODE);

      // Assert
      expect(result.code).toBe("3017620422003");
      expect(result.product_name).toBe("Nutella");
      expect(result.brands).toBe("Ferrero");
      expect(result.image_url).toBe("https://example.com/nutella.jpg");
      expect(result.categories).toBe("Spreads, Sweet spreads");
      expect(result.nutriments.energy_kcal_100g).toBe(539);
      expect(result.nutriments.proteins_100g).toBe(6.3);
      expect(result.nutriments.carbohydrates_100g).toBe(57.5);
      expect(result.nutriments.fat_100g).toBe(30.9);
      expect(typeof result.simulated_price).toBe("number");
    });

    it("should correctly map nutriment field names from API format to app format", () => {
      // Arrange
      const apiProduct = {
        code: "7501055363803",
        product_name: "Coca Cola",
        brands: "Coca-Cola",
        image_url: "https://example.com/coca.jpg",
        categories: "Beverages",
        nutriments: {
          "energy-kcal_100g": 42,
          proteins_100g: 0,
          carbohydrates_100g: 10.6,
          fat_100g: 0,
        },
      };

      // Act
      const result = adaptProduct(apiProduct, "7501055363803");

      // Assert
      expect(result.nutriments).toEqual({
        energy_kcal_100g: 42,
        proteins_100g: 0,
        carbohydrates_100g: 10.6,
        fat_100g: 0,
      });
      // Verify old format is not present
      expect(result.nutriments).not.toHaveProperty("energy-kcal_100g");
    });

    it("should generate simulated price based on barcode", () => {
      // Arrange
      const apiProduct = {
        code: "8076809513685",
        product_name: "Ferrero Rocher",
        brands: "Ferrero",
        image_url: "https://example.com/ferrero.jpg",
        categories: "Snacks, Chocolate",
        nutriments: {
          "energy-kcal_100g": 570,
          proteins_100g: 8.5,
          carbohydrates_100g: 42.7,
          fat_100g: 42.7,
        },
      };

      // Act
      const result = adaptProduct(apiProduct, "8076809513685");

      // Assert
      expect(result.simulated_price).toBeGreaterThanOrEqual(5);
      expect(result.simulated_price).toBeLessThanOrEqual(150);
    });
  });

  describe("Edge Cases - Missing Fields", () => {
    it("should handle missing product_name with default Spanish text", () => {
      // Arrange
      const apiProduct = {
        code: "123456",
        brands: "Test Brand",
        image_url: "https://example.com/test.jpg",
        categories: "Test",
        nutriments: {
          "energy-kcal_100g": 100,
          proteins_100g: 5,
          carbohydrates_100g: 10,
          fat_100g: 2,
        },
      };

      // Act
      const result = adaptProduct(apiProduct, "123456");

      // Assert
      expect(result.product_name).toBe("Producto sin nombre");
    });

    it("should handle missing brands with default Spanish text", () => {
      // Arrange
      const apiProduct = {
        code: "123456",
        product_name: "Test Product",
        image_url: "https://example.com/test.jpg",
        categories: "Test",
        nutriments: {
          "energy-kcal_100g": 100,
          proteins_100g: 5,
          carbohydrates_100g: 10,
          fat_100g: 2,
        },
      };

      // Act
      const result = adaptProduct(apiProduct, "123456");

      // Assert
      expect(result.brands).toBe("Marca desconocida");
    });

    it("should handle missing image_url with default empty string", () => {
      // Arrange
      const apiProduct = {
        code: "123456",
        product_name: "Test Product",
        brands: "Test Brand",
        categories: "Test",
        nutriments: {
          "energy-kcal_100g": 100,
          proteins_100g: 5,
          carbohydrates_100g: 10,
          fat_100g: 2,
        },
      };

      // Act
      const result = adaptProduct(apiProduct, "123456");

      // Assert
      expect(result.image_url).toBe("");
    });

    it("should handle missing categories with default Spanish text", () => {
      // Arrange
      const apiProduct = {
        code: "123456",
        product_name: "Test Product",
        brands: "Test Brand",
        image_url: "https://example.com/test.jpg",
        nutriments: {
          "energy-kcal_100g": 100,
          proteins_100g: 5,
          carbohydrates_100g: 10,
          fat_100g: 2,
        },
      };

      // Act
      const result = adaptProduct(apiProduct, "123456");

      // Assert
      expect(result.categories).toBe("Sin categoría");
    });

    it("should handle missing nutriments with default zero values", () => {
      // Arrange
      const apiProduct = {
        code: "123456",
        product_name: "Test Product",
        brands: "Test Brand",
        image_url: "https://example.com/test.jpg",
        categories: "Test",
      };

      // Act
      const result = adaptProduct(apiProduct, "123456");

      // Assert
      expect(result.nutriments).toEqual({
        energy_kcal_100g: 0,
        proteins_100g: 0,
        carbohydrates_100g: 0,
        fat_100g: 0,
      });
    });

    it("should handle partial nutriments with defaults for missing values", () => {
      // Arrange
      const apiProduct = {
        code: "123456",
        product_name: "Test Product",
        brands: "Test Brand",
        image_url: "https://example.com/test.jpg",
        categories: "Test",
        nutriments: {
          "energy-kcal_100g": 100,
          proteins_100g: 5,
        },
      };

      // Act
      const result = adaptProduct(apiProduct, "123456");

      // Assert
      expect(result.nutriments).toEqual({
        energy_kcal_100g: 100,
        proteins_100g: 5,
        carbohydrates_100g: 0,
        fat_100g: 0,
      });
    });

    it("should use barcode parameter when code is empty in API product", () => {
      // Arrange
      const apiProduct = {
        code: "",
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
      };

      // Act
      const result = adaptProduct(apiProduct, "7890123456789");

      // Assert
      expect(result.code).toBe("7890123456789");
    });
  });

  describe("Data Type Preservation", () => {
    it("should preserve numeric types for nutriments", () => {
      // Arrange
      const apiProduct = {
        code: "123456",
        product_name: "Test Product",
        brands: "Test Brand",
        image_url: "https://example.com/test.jpg",
        categories: "Test",
        nutriments: {
          "energy-kcal_100g": 539.5,
          proteins_100g: 6.3,
          carbohydrates_100g: 57.5,
          fat_100g: 30.9,
        },
      };

      // Act
      const result = adaptProduct(apiProduct, "123456");

      // Assert
      expect(typeof result.nutriments.energy_kcal_100g).toBe("number");
      expect(typeof result.nutriments.proteins_100g).toBe("number");
      expect(typeof result.nutriments.carbohydrates_100g).toBe("number");
      expect(typeof result.nutriments.fat_100g).toBe("number");
      expect(result.nutriments.energy_kcal_100g).toBe(539.5);
    });

    it("should preserve string types for text fields", () => {
      // Arrange
      const apiProduct = {
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
      };

      // Act
      const result = adaptProduct(apiProduct, "123456");

      // Assert
      expect(typeof result.code).toBe("string");
      expect(typeof result.product_name).toBe("string");
      expect(typeof result.brands).toBe("string");
      expect(typeof result.image_url).toBe("string");
      expect(typeof result.categories).toBe("string");
    });

    it("should handle decimal values in nutriments correctly", () => {
      // Arrange
      const apiProduct = {
        code: "123456",
        product_name: "Test Product",
        brands: "Test Brand",
        image_url: "https://example.com/test.jpg",
        categories: "Test",
        nutriments: {
          "energy-kcal_100g": 100.25,
          proteins_100g: 5.75,
          carbohydrates_100g: 10.5,
          fat_100g: 2.33,
        },
      };

      // Act
      const result = adaptProduct(apiProduct, "123456");

      // Assert
      expect(result.nutriments.energy_kcal_100g).toBe(100.25);
      expect(result.nutriments.proteins_100g).toBe(5.75);
      expect(result.nutriments.carbohydrates_100g).toBe(10.5);
      expect(result.nutriments.fat_100g).toBe(2.33);
    });
  });
});
