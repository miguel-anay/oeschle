import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HistoryList } from "./history-list";
import type { SearchHistoryItem } from "@/types/product";

// Mock the Zustand store
vi.mock("@/store/history", () => ({
  useHistoryStore: vi.fn(),
}));

import { useHistoryStore } from "@/store/history";

describe("HistoryList", () => {
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
    {
      code: "8076809513685",
      product_name: "Ferrero Rocher",
      image_url: "https://images.openfoodfacts.org/images/products/807/680/951/3685/front_en.jpg",
      searched_at: "2026-02-05T18:45:00.000Z",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Happy Path", () => {
    it("should render list of history items when items exist", () => {
      // Arrange
      vi.mocked(useHistoryStore).mockReturnValue({
        items: mockHistoryItems,
        addItem: vi.fn(),
        clearHistory: vi.fn(),
        removeItem: vi.fn(),
      });

      // Act
      render(<HistoryList />);

      // Assert
      expect(screen.getByText("Nutella")).toBeInTheDocument();
      expect(screen.getByText("Coca Cola")).toBeInTheDocument();
      expect(screen.getByText("Ferrero Rocher")).toBeInTheDocument();
    });

    it("should render heading 'Historial de Búsquedas'", () => {
      // Arrange
      vi.mocked(useHistoryStore).mockReturnValue({
        items: mockHistoryItems,
        addItem: vi.fn(),
        clearHistory: vi.fn(),
        removeItem: vi.fn(),
      });

      // Act
      render(<HistoryList />);

      // Assert
      const heading = screen.getByRole("heading", { name: /historial de búsquedas/i });
      expect(heading).toBeInTheDocument();
    });

    it("should render all items from store in correct order (most recent first)", () => {
      // Arrange
      vi.mocked(useHistoryStore).mockReturnValue({
        items: mockHistoryItems,
        addItem: vi.fn(),
        clearHistory: vi.fn(),
        removeItem: vi.fn(),
      });

      // Act
      render(<HistoryList />);

      // Assert
      const buttons = screen.getAllByRole("button").filter(btn => btn.getAttribute("aria-label")?.includes("Ver producto"));
      expect(buttons).toHaveLength(3);

      // First item should be Nutella (most recent)
      expect(within(buttons[0]).getByText("Nutella")).toBeInTheDocument();

      // Second item should be Coca Cola
      expect(within(buttons[1]).getByText("Coca Cola")).toBeInTheDocument();

      // Third item should be Ferrero Rocher (oldest)
      expect(within(buttons[2]).getByText("Ferrero Rocher")).toBeInTheDocument();
    });

    it("should render clear history button when items exist", () => {
      // Arrange
      vi.mocked(useHistoryStore).mockReturnValue({
        items: mockHistoryItems,
        addItem: vi.fn(),
        clearHistory: vi.fn(),
        removeItem: vi.fn(),
      });

      // Act
      render(<HistoryList />);

      // Assert
      const clearButton = screen.getByRole("button", { name: /limpiar historial/i });
      expect(clearButton).toBeInTheDocument();
      expect(clearButton).toBeVisible();
    });

    it("should call clearHistory when clear button is clicked", async () => {
      // Arrange
      const clearHistory = vi.fn();
      vi.mocked(useHistoryStore).mockReturnValue({
        items: mockHistoryItems,
        addItem: vi.fn(),
        clearHistory,
        removeItem: vi.fn(),
      });
      const user = userEvent.setup();
      render(<HistoryList />);

      const clearButton = screen.getByRole("button", { name: /limpiar historial/i });

      // Act
      await user.click(clearButton);

      // Assert
      expect(clearHistory).toHaveBeenCalledTimes(1);
    });

    it("should navigate to product detail when history item is clicked", async () => {
      // Arrange
      const mockPush = vi.fn();
      vi.mock("next/navigation", () => ({
        useRouter: () => ({ push: mockPush }),
      }));

      vi.mocked(useHistoryStore).mockReturnValue({
        items: mockHistoryItems,
        addItem: vi.fn(),
        clearHistory: vi.fn(),
        removeItem: vi.fn(),
      });
      const user = userEvent.setup();
      render(<HistoryList />);

      const nutellaItem = screen.getByRole("button", { name: /nutella/i });

      // Act
      await user.click(nutellaItem);

      // Assert
      expect(mockPush).toHaveBeenCalledWith("/product/3017620422003");
    });
  });

  describe("Empty State", () => {
    it("should render empty state when no history items exist", () => {
      // Arrange
      vi.mocked(useHistoryStore).mockReturnValue({
        items: [],
        addItem: vi.fn(),
        clearHistory: vi.fn(),
        removeItem: vi.fn(),
      });

      // Act
      render(<HistoryList />);

      // Assert
      expect(screen.getByText(/no hay búsquedas recientes/i)).toBeInTheDocument();
    });

    it("should render empty state message with helpful text", () => {
      // Arrange
      vi.mocked(useHistoryStore).mockReturnValue({
        items: [],
        addItem: vi.fn(),
        clearHistory: vi.fn(),
        removeItem: vi.fn(),
      });

      // Act
      render(<HistoryList />);

      // Assert
      expect(screen.getByText(/busca un producto para comenzar/i)).toBeInTheDocument();
    });

    it("should render empty state icon", () => {
      // Arrange
      vi.mocked(useHistoryStore).mockReturnValue({
        items: [],
        addItem: vi.fn(),
        clearHistory: vi.fn(),
        removeItem: vi.fn(),
      });

      // Act
      render(<HistoryList />);

      // Assert
      const icon = screen.getByRole("img", { name: /empty state/i });
      expect(icon).toBeInTheDocument();
    });

    it("should NOT render clear history button when empty", () => {
      // Arrange
      vi.mocked(useHistoryStore).mockReturnValue({
        items: [],
        addItem: vi.fn(),
        clearHistory: vi.fn(),
        removeItem: vi.fn(),
      });

      // Act
      render(<HistoryList />);

      // Assert
      expect(screen.queryByRole("button", { name: /limpiar historial/i })).not.toBeInTheDocument();
    });

    it("should NOT render any history items when empty", () => {
      // Arrange
      vi.mocked(useHistoryStore).mockReturnValue({
        items: [],
        addItem: vi.fn(),
        clearHistory: vi.fn(),
        removeItem: vi.fn(),
      });

      // Act
      render(<HistoryList />);

      // Assert
      expect(screen.queryByText("Nutella")).not.toBeInTheDocument();
      expect(screen.queryByText("Coca Cola")).not.toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle single item in history", () => {
      // Arrange
      vi.mocked(useHistoryStore).mockReturnValue({
        items: [mockHistoryItems[0]],
        addItem: vi.fn(),
        clearHistory: vi.fn(),
        removeItem: vi.fn(),
      });

      // Act
      render(<HistoryList />);

      // Assert
      expect(screen.getByText("Nutella")).toBeInTheDocument();
      const buttons = screen.getAllByRole("button").filter(btn => btn.getAttribute("aria-label")?.includes("Ver producto"));
      expect(buttons).toHaveLength(1);
    });

    it("should handle maximum 20 items (store limit)", () => {
      // Arrange
      const maxItems: SearchHistoryItem[] = Array.from({ length: 20 }, (_, i) => ({
        code: `${1000000000000 + i}`,
        product_name: `Product ${i + 1}`,
        image_url: `https://example.com/image${i}.jpg`,
        searched_at: new Date(2026, 1, 6, 10, i).toISOString(),
      }));

      vi.mocked(useHistoryStore).mockReturnValue({
        items: maxItems,
        addItem: vi.fn(),
        clearHistory: vi.fn(),
        removeItem: vi.fn(),
      });

      // Act
      render(<HistoryList />);

      // Assert
      const buttons = screen.getAllByRole("button").filter(btn => btn.getAttribute("aria-label")?.includes("Ver producto"));
      expect(buttons).toHaveLength(20);
    });

    it("should maintain order after clearing and re-populating", () => {
      // Arrange
      vi.mocked(useHistoryStore).mockReturnValue({
        items: mockHistoryItems,
        addItem: vi.fn(),
        clearHistory: vi.fn(),
        removeItem: vi.fn(),
      });

      const { rerender } = render(<HistoryList />);

      // Act - Clear history
      vi.mocked(useHistoryStore).mockReturnValue({
        items: [],
        addItem: vi.fn(),
        clearHistory: vi.fn(),
        removeItem: vi.fn(),
      });
      rerender(<HistoryList />);

      // Assert empty state
      expect(screen.getByText(/no hay búsquedas recientes/i)).toBeInTheDocument();

      // Act - Add items again
      vi.mocked(useHistoryStore).mockReturnValue({
        items: mockHistoryItems,
        addItem: vi.fn(),
        clearHistory: vi.fn(),
        removeItem: vi.fn(),
      });
      rerender(<HistoryList />);

      // Assert order maintained
      const buttons = screen.getAllByRole("button").filter(btn => btn.getAttribute("aria-label")?.includes("Ver producto"));
      expect(within(buttons[0]).getByText("Nutella")).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("should show confirmation modal before clearing history", async () => {
      // Arrange
      const clearHistory = vi.fn();
      vi.mocked(useHistoryStore).mockReturnValue({
        items: mockHistoryItems,
        addItem: vi.fn(),
        clearHistory,
        removeItem: vi.fn(),
      });
      const user = userEvent.setup();
      render(<HistoryList />);

      const clearButton = screen.getByRole("button", { name: /limpiar historial/i });

      // Act
      await user.click(clearButton);

      // Assert - Confirmation dialog should appear
      expect(screen.getByRole("alertdialog")).toBeInTheDocument();
      expect(screen.getByText(/¿estás seguro/i)).toBeInTheDocument();
    });

    it("should NOT clear history if user cancels confirmation", async () => {
      // Arrange
      const clearHistory = vi.fn();
      vi.mocked(useHistoryStore).mockReturnValue({
        items: mockHistoryItems,
        addItem: vi.fn(),
        clearHistory,
        removeItem: vi.fn(),
      });
      const user = userEvent.setup();
      render(<HistoryList />);

      const clearButton = screen.getByRole("button", { name: /limpiar historial/i });

      // Act
      await user.click(clearButton);
      const cancelButton = screen.getByRole("button", { name: /cancelar/i });
      await user.click(cancelButton);

      // Assert
      expect(clearHistory).not.toHaveBeenCalled();
    });

    it("should clear history if user confirms", async () => {
      // Arrange
      const clearHistory = vi.fn();
      vi.mocked(useHistoryStore).mockReturnValue({
        items: mockHistoryItems,
        addItem: vi.fn(),
        clearHistory,
        removeItem: vi.fn(),
      });
      const user = userEvent.setup();
      render(<HistoryList />);

      const clearButton = screen.getByRole("button", { name: /limpiar historial/i });

      // Act
      await user.click(clearButton);
      const confirmButton = screen.getByRole("button", { name: /confirmar|eliminar/i });
      await user.click(confirmButton);

      // Assert
      expect(clearHistory).toHaveBeenCalledTimes(1);
    });

    it("should close confirmation modal after confirming", async () => {
      // Arrange
      const clearHistory = vi.fn();
      vi.mocked(useHistoryStore).mockReturnValue({
        items: mockHistoryItems,
        addItem: vi.fn(),
        clearHistory,
        removeItem: vi.fn(),
      });
      const user = userEvent.setup();
      render(<HistoryList />);

      const clearButton = screen.getByRole("button", { name: /limpiar historial/i });

      // Act
      await user.click(clearButton);
      const confirmButton = screen.getByRole("button", { name: /confirmar|eliminar/i });
      await user.click(confirmButton);

      // Assert
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have accessible heading hierarchy", () => {
      // Arrange
      vi.mocked(useHistoryStore).mockReturnValue({
        items: mockHistoryItems,
        addItem: vi.fn(),
        clearHistory: vi.fn(),
        removeItem: vi.fn(),
      });

      // Act
      render(<HistoryList />);

      // Assert
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveTextContent(/historial de búsquedas/i);
    });

    it("should have accessible labels for clear button", () => {
      // Arrange
      vi.mocked(useHistoryStore).mockReturnValue({
        items: mockHistoryItems,
        addItem: vi.fn(),
        clearHistory: vi.fn(),
        removeItem: vi.fn(),
      });

      // Act
      render(<HistoryList />);

      // Assert
      const clearButton = screen.getByRole("button", { name: /limpiar historial/i });
      expect(clearButton).toHaveAccessibleName();
    });

    it("should have list with proper semantic structure", () => {
      // Arrange
      vi.mocked(useHistoryStore).mockReturnValue({
        items: mockHistoryItems,
        addItem: vi.fn(),
        clearHistory: vi.fn(),
        removeItem: vi.fn(),
      });

      // Act
      render(<HistoryList />);

      // Assert
      const list = screen.getByRole("list");
      expect(list).toBeInTheDocument();

      const listItems = within(list).getAllByRole("listitem");
      expect(listItems).toHaveLength(3);
    });

    it("should have keyboard navigable history items", () => {
      // Arrange
      vi.mocked(useHistoryStore).mockReturnValue({
        items: mockHistoryItems,
        addItem: vi.fn(),
        clearHistory: vi.fn(),
        removeItem: vi.fn(),
      });

      // Act
      render(<HistoryList />);

      // Assert
      const buttons = screen.getAllByRole("button").filter(btn => btn.getAttribute("aria-label")?.includes("Ver producto"));
      buttons.forEach(button => {
        expect(button).toHaveAttribute("tabIndex", "0");
      });
    });
  });

  describe("Mobile-First Design", () => {
    it("should render with full width container", () => {
      // Arrange
      vi.mocked(useHistoryStore).mockReturnValue({
        items: mockHistoryItems,
        addItem: vi.fn(),
        clearHistory: vi.fn(),
        removeItem: vi.fn(),
      });

      // Act
      render(<HistoryList />);

      // Assert
      const container = screen.getByRole("region", { name: /historial/i });
      expect(container).toHaveClass("w-full");
    });

    it("should have appropriate spacing between items", () => {
      // Arrange
      vi.mocked(useHistoryStore).mockReturnValue({
        items: mockHistoryItems,
        addItem: vi.fn(),
        clearHistory: vi.fn(),
        removeItem: vi.fn(),
      });

      // Act
      render(<HistoryList />);

      // Assert
      const list = screen.getByRole("list");
      expect(list).toHaveClass("space-y-2");
    });

    it("should position clear button appropriately on mobile", () => {
      // Arrange
      vi.mocked(useHistoryStore).mockReturnValue({
        items: mockHistoryItems,
        addItem: vi.fn(),
        clearHistory: vi.fn(),
        removeItem: vi.fn(),
      });

      // Act
      render(<HistoryList />);

      // Assert
      const clearButton = screen.getByRole("button", { name: /limpiar historial/i });
      expect(clearButton).toHaveClass("w-full", "sm:w-auto");
    });
  });

  describe("Error States", () => {
    it("should handle undefined items gracefully", () => {
      // Arrange
      vi.mocked(useHistoryStore).mockReturnValue({
        items: undefined as any,
        addItem: vi.fn(),
        clearHistory: vi.fn(),
        removeItem: vi.fn(),
      });

      // Act
      render(<HistoryList />);

      // Assert
      expect(screen.getByText(/no hay búsquedas recientes/i)).toBeInTheDocument();
    });

    it("should handle null items gracefully", () => {
      // Arrange
      vi.mocked(useHistoryStore).mockReturnValue({
        items: null as any,
        addItem: vi.fn(),
        clearHistory: vi.fn(),
        removeItem: vi.fn(),
      });

      // Act
      render(<HistoryList />);

      // Assert
      expect(screen.getByText(/no hay búsquedas recientes/i)).toBeInTheDocument();
    });
  });
});
