import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductCard } from "./product-card";
import type { Product } from "@/types/product";

const mockProduct: Product = {
  code: "3017620422003",
  product_name: "Nutella",
  brands: "Ferrero",
  image_url: "https://example.com/nutella.jpg",
  categories: "Spreads, Sweet spreads",
  nutriments: {
    energy_kcal_100g: 539,
    proteins_100g: 6.3,
    carbohydrates_100g: 57.5,
    fat_100g: 30.9,
  },
  simulated_price: 45.99,
};

const mockProductWithoutImage: Product = {
  ...mockProduct,
  image_url: "",
};

const mockProductLongText: Product = {
  ...mockProduct,
  product_name: "Very Long Product Name That Should Be Truncated Or Wrapped Properly In The Card Layout",
  brands: "Very Long Brand Name That Should Also Handle Text Overflow Gracefully",
  categories: "Category 1, Category 2, Category 3, Category 4, Category 5, Category 6",
};

describe("ProductCard", () => {
  describe("Happy Path", () => {
    it("should display product name", () => {
      render(<ProductCard product={mockProduct} />);

      expect(screen.getByText("Nutella")).toBeInTheDocument();
    });

    it("should display product brand", () => {
      render(<ProductCard product={mockProduct} />);

      expect(screen.getByText("Ferrero")).toBeInTheDocument();
    });

    it("should display product category", () => {
      render(<ProductCard product={mockProduct} />);

      expect(screen.getByText("Spreads, Sweet spreads")).toBeInTheDocument();
    });

    it("should display product image with correct src", () => {
      render(<ProductCard product={mockProduct} />);

      const image = screen.getByRole("img", { name: /nutella/i });
      expect(image).toHaveAttribute("src", "https://example.com/nutella.jpg");
    });

    it("should display simulated price in S/. format", () => {
      render(<ProductCard product={mockProduct} />);

      expect(screen.getByText(/S\/\.\s*45\.99/)).toBeInTheDocument();
    });

    it("should display all nutritional information", () => {
      render(<ProductCard product={mockProduct} />);

      expect(screen.getByText(/539/)).toBeInTheDocument(); // calories
      expect(screen.getByText(/6\.3/)).toBeInTheDocument(); // proteins
      expect(screen.getByText(/57\.5/)).toBeInTheDocument(); // carbs
      expect(screen.getByText(/30\.9/)).toBeInTheDocument(); // fat
    });

    it("should display nutritional labels", () => {
      render(<ProductCard product={mockProduct} />);

      expect(screen.getByText(/calorías/i)).toBeInTheDocument();
      expect(screen.getByText(/proteínas/i)).toBeInTheDocument();
      expect(screen.getByText(/carbohidratos/i)).toBeInTheDocument();
      expect(screen.getByText(/grasas/i)).toBeInTheDocument();
    });

    it("should display back button with correct text", () => {
      render(<ProductCard product={mockProduct} />);

      expect(screen.getByRole("button", { name: /buscar otro producto/i })).toBeInTheDocument();
    });
  });

  describe("Image Handling", () => {
    it("should show fallback image when image_url is empty", () => {
      render(<ProductCard product={mockProductWithoutImage} />);

      const image = screen.getByRole("img", { name: /nutella/i });
      expect(image).toHaveAttribute("src", "/placeholder-product.png");
    });

    it("should show fallback image when image_url is null", () => {
      const productWithNullImage = { ...mockProduct, image_url: null as unknown as string };
      render(<ProductCard product={productWithNullImage} />);

      const image = screen.getByRole("img");
      expect(image).toHaveAttribute("src", "/placeholder-product.png");
    });

    it("should show fallback image when image_url is undefined", () => {
      const productWithUndefinedImage = { ...mockProduct, image_url: undefined as unknown as string };
      render(<ProductCard product={productWithUndefinedImage} />);

      const image = screen.getByRole("img");
      expect(image).toHaveAttribute("src", "/placeholder-product.png");
    });

    it("should have alt text with product name for accessibility", () => {
      render(<ProductCard product={mockProduct} />);

      expect(screen.getByAltText(/nutella/i)).toBeInTheDocument();
    });
  });

  describe("Nutritional Information Display", () => {
    it("should display calories with kcal unit", () => {
      render(<ProductCard product={mockProduct} />);

      expect(screen.getByText(/539.*kcal/i)).toBeInTheDocument();
    });

    it("should display proteins with g unit", () => {
      render(<ProductCard product={mockProduct} />);

      expect(screen.getByText(/6\.3.*g/i)).toBeInTheDocument();
    });

    it("should display carbohydrates with g unit", () => {
      render(<ProductCard product={mockProduct} />);

      expect(screen.getByText(/57\.5.*g/i)).toBeInTheDocument();
    });

    it("should display fat with g unit", () => {
      render(<ProductCard product={mockProduct} />);

      expect(screen.getByText(/30\.9.*g/i)).toBeInTheDocument();
    });

    it("should format decimal numbers correctly", () => {
      const productWithDecimals: Product = {
        ...mockProduct,
        nutriments: {
          energy_kcal_100g: 100.5,
          proteins_100g: 2.15,
          carbohydrates_100g: 45.678,
          fat_100g: 0.9,
        },
      };
      render(<ProductCard product={productWithDecimals} />);

      expect(screen.getByText(/100\.5/)).toBeInTheDocument();
      expect(screen.getByText(/2\.15/)).toBeInTheDocument();
      expect(screen.getByText(/45\.678/)).toBeInTheDocument();
      expect(screen.getByText(/0\.9/)).toBeInTheDocument();
    });

    it("should handle zero values in nutrients", () => {
      const productWithZeros: Product = {
        ...mockProduct,
        nutriments: {
          energy_kcal_100g: 0,
          proteins_100g: 0,
          carbohydrates_100g: 0,
          fat_100g: 0,
        },
      };
      render(<ProductCard product={productWithZeros} />);

      const zeroValues = screen.getAllByText(/^0/);
      expect(zeroValues.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe("Price Display", () => {
    it("should format price with 2 decimal places", () => {
      render(<ProductCard product={mockProduct} />);

      expect(screen.getByText(/45\.99/)).toBeInTheDocument();
    });

    it("should display S/. currency symbol", () => {
      render(<ProductCard product={mockProduct} />);

      expect(screen.getByText(/S\/\./)).toBeInTheDocument();
    });

    it("should handle whole number prices", () => {
      const productWithWholePrice = { ...mockProduct, simulated_price: 50 };
      render(<ProductCard product={productWithWholePrice} />);

      expect(screen.getByText(/S\/\.\s*50\.00/)).toBeInTheDocument();
    });

    it("should handle minimum price range (5)", () => {
      const productMinPrice = { ...mockProduct, simulated_price: 5.0 };
      render(<ProductCard product={productMinPrice} />);

      expect(screen.getByText(/S\/\.\s*5\.00/)).toBeInTheDocument();
    });

    it("should handle maximum price range (150)", () => {
      const productMaxPrice = { ...mockProduct, simulated_price: 150.0 };
      render(<ProductCard product={productMaxPrice} />);

      expect(screen.getByText(/S\/\.\s*150\.00/)).toBeInTheDocument();
    });
  });

  describe("Responsive Design", () => {
    it("should render as a card component", () => {
      render(<ProductCard product={mockProduct} />);

      const card = screen.getByTestId("product-card");
      expect(card).toBeInTheDocument();
    });

    it("should have mobile-first responsive classes", () => {
      render(<ProductCard product={mockProduct} />);

      const card = screen.getByTestId("product-card");
      expect(card).toHaveClass(/w-full/);
    });

    it("should display product image in a responsive container", () => {
      render(<ProductCard product={mockProduct} />);

      const imageContainer = screen.getByTestId("product-image-container");
      expect(imageContainer).toBeInTheDocument();
    });
  });

  describe("Back Button Functionality", () => {
    it("should call navigation function when back button is clicked", async () => {
      const user = userEvent.setup();

      render(<ProductCard product={mockProduct} />);

      const backButton = screen.getByRole("button", { name: /buscar otro producto/i });
      await user.click(backButton);

      expect(globalThis.mockRouter.push).toHaveBeenCalledWith("/");
    });

    it("should navigate to home page on back button click", async () => {
      const user = userEvent.setup();

      render(<ProductCard product={mockProduct} />);

      const backButton = screen.getByRole("button", { name: /buscar otro producto/i });
      await user.click(backButton);

      expect(globalThis.mockPush).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it("should have semantic heading for product name", () => {
      render(<ProductCard product={mockProduct} />);

      expect(screen.getByRole("heading", { name: /nutella/i })).toBeInTheDocument();
    });

    it("should have proper heading hierarchy", () => {
      render(<ProductCard product={mockProduct} />);

      const heading = screen.getByRole("heading", { name: /nutella/i });
      expect(heading.tagName).toBe("H1");
    });

    it("should have accessible labels for nutritional information", () => {
      render(<ProductCard product={mockProduct} />);

      expect(screen.getByLabelText(/calorías/i)).toBeInTheDocument();
    });

    it("should have proper ARIA labels for price", () => {
      render(<ProductCard product={mockProduct} />);

      expect(screen.getByLabelText(/precio/i)).toBeInTheDocument();
    });

    it("should have accessible button with descriptive text", () => {
      render(<ProductCard product={mockProduct} />);

      const button = screen.getByRole("button", { name: /buscar otro producto/i });
      expect(button).toHaveAccessibleName();
    });
  });

  describe("Edge Cases", () => {
    it("should handle long product names gracefully", () => {
      render(<ProductCard product={mockProductLongText} />);

      expect(screen.getByText(mockProductLongText.product_name)).toBeInTheDocument();
    });

    it("should handle long brand names gracefully", () => {
      render(<ProductCard product={mockProductLongText} />);

      expect(screen.getByText(mockProductLongText.brands)).toBeInTheDocument();
    });

    it("should handle multiple categories with long text", () => {
      render(<ProductCard product={mockProductLongText} />);

      expect(screen.getByText(mockProductLongText.categories)).toBeInTheDocument();
    });

    it("should handle empty brand name", () => {
      const productEmptyBrand = { ...mockProduct, brands: "" };
      render(<ProductCard product={productEmptyBrand} />);

      expect(screen.getByTestId("product-brand")).toHaveTextContent(/marca no disponible/i);
    });

    it("should handle empty category", () => {
      const productEmptyCategory = { ...mockProduct, categories: "" };
      render(<ProductCard product={productEmptyCategory} />);

      expect(screen.getByTestId("product-category")).toHaveTextContent(/categoría no disponible/i);
    });

    it("should handle very large nutritional values", () => {
      const productLargeValues: Product = {
        ...mockProduct,
        nutriments: {
          energy_kcal_100g: 9999,
          proteins_100g: 999.99,
          carbohydrates_100g: 999.99,
          fat_100g: 999.99,
        },
      };
      render(<ProductCard product={productLargeValues} />);

      expect(screen.getByText(/9999/)).toBeInTheDocument();
      expect(screen.getAllByText(/999\.99/).length).toBeGreaterThanOrEqual(3);
    });

    it("should handle very small nutritional values", () => {
      const productSmallValues: Product = {
        ...mockProduct,
        nutriments: {
          energy_kcal_100g: 0.01,
          proteins_100g: 0.001,
          carbohydrates_100g: 0.1,
          fat_100g: 0.05,
        },
      };
      render(<ProductCard product={productSmallValues} />);

      expect(screen.getByText(/0\.01/)).toBeInTheDocument();
      expect(screen.getByText(/0\.001/)).toBeInTheDocument();
      expect(screen.getByText(/0\.1/)).toBeInTheDocument();
      expect(screen.getByText(/0\.05/)).toBeInTheDocument();
    });
  });

  describe("Visual States", () => {
    it("should have proper card styling", () => {
      render(<ProductCard product={mockProduct} />);

      const card = screen.getByTestId("product-card");
      expect(card).toHaveClass(/rounded/);
    });

    it("should have proper spacing between sections", () => {
      render(<ProductCard product={mockProduct} />);

      const card = screen.getByTestId("product-card");
      expect(card).toHaveClass(/space-y/);
    });

    it("should display nutritional info in a grid layout", () => {
      render(<ProductCard product={mockProduct} />);

      const nutrimentGrid = screen.getByTestId("nutriments-grid");
      expect(nutrimentGrid).toHaveClass(/grid/);
    });
  });

  describe("Barcode Display", () => {
    it("should display product barcode", () => {
      render(<ProductCard product={mockProduct} />);

      expect(screen.getByText("3017620422003")).toBeInTheDocument();
    });

    it("should label barcode properly", () => {
      render(<ProductCard product={mockProduct} />);

      expect(screen.getByText(/código de barras/i)).toBeInTheDocument();
    });

    it("should format barcode in monospace font", () => {
      render(<ProductCard product={mockProduct} />);

      const barcodeElement = screen.getByTestId("product-barcode");
      expect(barcodeElement).toHaveClass(/font-mono/);
    });
  });
});
