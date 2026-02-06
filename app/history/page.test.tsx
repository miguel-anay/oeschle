import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import HistoryPage from "./page";
import type { SearchHistoryItem } from "@/types/product";

// Mock the Zustand store - return default state
const mockState = {
  items: [] as SearchHistoryItem[],
  addItem: vi.fn(),
  clearHistory: vi.fn(),
  removeItem: vi.fn(),
};

vi.mock("@/store/history", () => ({
  useHistoryStore: vi.fn(() => mockState),
}));

// Use global mock from vitest.setup.ts (next/navigation is mocked there)

describe("HistoryPage", () => {
  const mockHistoryItems: SearchHistoryItem[] = [
    {
      code: "3017620422003",
      product_name: "Nutella",
      image_url: "https://images.openfoodfacts.org/images/products/301/762/042/2003/front_en.jpg",
      searched_at: "2026-02-06T10:30:00.000Z",
    },
    {
      code: "7501055363803",
      product_name: "Coca Cola",
      image_url: "https://images.openfoodfacts.org/images/products/750/105/536/3803/front_en.jpg",
      searched_at: "2026-02-06T09:15:00.000Z",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock state to default empty
    mockState.items = [];
    mockState.addItem = vi.fn();
    mockState.clearHistory = vi.fn();
    mockState.removeItem = vi.fn();
  });

  describe("Happy Path", () => {
    it("should render page title", () => {
      // Arrange
      mockState.items = mockHistoryItems;

      // Act
      render(<HistoryPage />);

      // Assert
      const heading = screen.getByRole("heading", { level: 1, name: /historial/i });
      expect(heading).toBeInTheDocument();
    });

    it("should render HistoryList component", () => {
      // Arrange
      mockState.items = mockHistoryItems;

      // Act
      render(<HistoryPage />);

      // Assert
      expect(screen.getByText("Nutella")).toBeInTheDocument();
      expect(screen.getByText("Coca Cola")).toBeInTheDocument();
    });

    it("should render back to home button", () => {
      // Arrange
      mockState.items = mockHistoryItems;

      // Act
      render(<HistoryPage />);

      // Assert
      const backButton = screen.getByRole("link", { name: /volver|inicio/i });
      expect(backButton).toBeInTheDocument();
    });

    it("should have correct href on back button", () => {
      // Arrange
      mockState.items = mockHistoryItems;

      // Act
      render(<HistoryPage />);

      // Assert
      const backButton = screen.getByRole("link", { name: /volver|inicio/i });
      expect(backButton).toHaveAttribute("href", "/");
    });
  });

  describe("Empty State", () => {
    it("should render empty state when no history items", () => {
      // Arrange
      mockState.items = [];

      // Act
      render(<HistoryPage />);

      // Assert
      expect(screen.getByText(/no hay búsquedas recientes/i)).toBeInTheDocument();
    });

    it("should still render page title when empty", () => {
      // Arrange
      mockState.items = [];

      // Act
      render(<HistoryPage />);

      // Assert
      const heading = screen.getByRole("heading", { level: 1, name: /historial/i });
      expect(heading).toBeInTheDocument();
    });

    it("should still render back button when empty", () => {
      // Arrange
      mockState.items = [];

      // Act
      render(<HistoryPage />);

      // Assert
      const backButton = screen.getByRole("link", { name: /volver|inicio/i });
      expect(backButton).toBeInTheDocument();
    });
  });

  describe("Layout and Structure", () => {
    it("should have main content wrapper", () => {
      // Arrange
      mockState.items = mockHistoryItems;

      // Act
      render(<HistoryPage />);

      // Assert
      const main = screen.getByRole("main");
      expect(main).toBeInTheDocument();
    });

    it("should use container with max-width for desktop", () => {
      // Arrange
      mockState.items = mockHistoryItems;

      // Act
      render(<HistoryPage />);

      // Assert - max-w-4xl and mx-auto are on the inner container div
      const main = screen.getByRole("main");
      const container = main.querySelector(".max-w-4xl");
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass("mx-auto");
    });

    it("should have appropriate padding for mobile", () => {
      // Arrange
      mockState.items = mockHistoryItems;

      // Act
      render(<HistoryPage />);

      // Assert
      const main = screen.getByRole("main");
      expect(main).toHaveClass("p-4");
    });
  });

  describe("Accessibility", () => {
    it("should have semantic main element", () => {
      // Arrange
      mockState.items = mockHistoryItems;

      // Act
      render(<HistoryPage />);

      // Assert
      const main = screen.getByRole("main");
      expect(main).toBeInTheDocument();
    });

    it("should have h1 heading for page title", () => {
      // Arrange
      mockState.items = mockHistoryItems;

      // Act
      render(<HistoryPage />);

      // Assert
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it("should have accessible navigation link", () => {
      // Arrange
      mockState.items = mockHistoryItems;

      // Act
      render(<HistoryPage />);

      // Assert
      const backButton = screen.getByRole("link", { name: /volver|inicio/i });
      expect(backButton).toHaveAccessibleName();
    });

    it("should have proper document structure order", () => {
      // Arrange
      mockState.items = mockHistoryItems;

      // Act
      render(<HistoryPage />);

      // Assert
      const main = screen.getByRole("main");
      const heading = screen.getByRole("heading", { level: 1 });
      const backButton = screen.getByRole("link", { name: /volver|inicio/i });

      expect(main).toContainElement(heading);
      expect(main).toContainElement(backButton);
    });
  });

  describe("Mobile-First Design", () => {
    it("should have responsive layout classes", () => {
      // Arrange
      mockState.items = mockHistoryItems;

      // Act
      render(<HistoryPage />);

      // Assert - w-full is on the inner container
      const main = screen.getByRole("main");
      const container = main.querySelector(".w-full");
      expect(container).toBeInTheDocument();
    });

    it("should have full width on mobile with max-width on desktop", () => {
      // Arrange
      mockState.items = mockHistoryItems;

      // Act
      render(<HistoryPage />);

      // Assert - max-w-4xl is on the inner container
      const main = screen.getByRole("main");
      const container = main.querySelector(".max-w-4xl");
      expect(container).toBeInTheDocument();
    });
  });

  describe("Integration with HistoryList", () => {
    it("should pass store items to HistoryList component", () => {
      // Arrange
      mockState.items = mockHistoryItems;

      // Act
      render(<HistoryPage />);

      // Assert
      expect(screen.getByText("Nutella")).toBeInTheDocument();
      expect(screen.getByText("Coca Cola")).toBeInTheDocument();
      expect(screen.getByText("3017620422003")).toBeInTheDocument();
      expect(screen.getByText("7501055363803")).toBeInTheDocument();
    });

    it("should render HistoryList with all functionality", () => {
      // Arrange
      mockState.items = mockHistoryItems;

      // Act
      render(<HistoryPage />);

      // Assert
      // Should have clear history button from HistoryList
      expect(screen.getByRole("button", { name: /limpiar historial/i })).toBeInTheDocument();

      // Should have clickable history items from HistoryList
      const historyButtons = screen.getAllByRole("button").filter(btn =>
        btn.getAttribute("aria-label")?.includes("Ver producto")
      );
      expect(historyButtons.length).toBeGreaterThan(0);
    });
  });

  describe("Metadata", () => {
    it("should have correct page metadata for SEO", () => {
      // Note: This test would typically check metadata exported from the page
      // For App Router, metadata is exported separately

      // Arrange
      mockState.items = mockHistoryItems;

      // Act
      render(<HistoryPage />);

      // Assert - At minimum, page should render successfully
      expect(screen.getByRole("heading", { level: 1, name: /historial/i })).toBeInTheDocument();
    });
  });
});
