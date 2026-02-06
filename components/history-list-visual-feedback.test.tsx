import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HistoryList } from "./history-list";
import type { SearchHistoryItem } from "@/types/product";

// Mock the Zustand store with default state
const mockClearHistory = vi.fn();
const mockState = {
  items: [] as SearchHistoryItem[],
  addItem: vi.fn(),
  clearHistory: mockClearHistory,
  removeItem: vi.fn(),
};

vi.mock("@/store/history", () => ({
  useHistoryStore: vi.fn(() => mockState),
}));

/**
 * US-4.3: Limpiar historial - Visual Feedback Tests
 *
 * These tests cover the missing acceptance criteria:
 * - [ ] Feedback visual al completar
 *
 * The current implementation has:
 * - [x] Botón "Limpiar historial" visible
 * - [x] Confirmación antes de eliminar (modal)
 * - [x] Estado vacío mostrado después de limpiar
 * - [ ] Feedback visual al completar (MISSING - these tests will FAIL)
 */
describe("HistoryList - Visual Feedback on Clear (US-4.3)", () => {
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
    mockState.items = mockHistoryItems;
    mockClearHistory.mockClear();
  });

  describe("Success Feedback After Clearing", () => {
    it("should display success toast message after clearing history", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<HistoryList />);

      const clearButton = screen.getByRole("button", { name: /limpiar historial/i });

      // Act - Click clear and confirm
      await user.click(clearButton);
      const confirmButton = screen.getByRole("button", { name: /eliminar/i });
      await user.click(confirmButton);

      // Assert - Success toast should appear
      await waitFor(() => {
        expect(screen.getByText(/historial eliminado correctamente/i)).toBeInTheDocument();
      });
    });

    it("should display success toast with descriptive message", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<HistoryList />);

      const clearButton = screen.getByRole("button", { name: /limpiar historial/i });

      // Act
      await user.click(clearButton);
      const confirmButton = screen.getByRole("button", { name: /eliminar/i });
      await user.click(confirmButton);

      // Assert - Toast should have clear message
      await waitFor(() => {
        const successMessage = screen.getByRole("status", { name: /success/i });
        expect(successMessage).toHaveTextContent(/historial eliminado/i);
      });
    });

    it("should display success toast with icon or visual indicator", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<HistoryList />);

      const clearButton = screen.getByRole("button", { name: /limpiar historial/i });

      // Act
      await user.click(clearButton);
      const confirmButton = screen.getByRole("button", { name: /eliminar/i });
      await user.click(confirmButton);

      // Assert - Toast should have success icon (checkmark, success color)
      await waitFor(() => {
        const successToast = screen.getByRole("status");
        expect(successToast).toHaveClass(/success|bg-green/);
      });
    });

    it("should auto-dismiss success toast after 3-5 seconds", async () => {
      // Arrange
      vi.useFakeTimers();
      const user = userEvent.setup({ delay: null });
      render(<HistoryList />);

      const clearButton = screen.getByRole("button", { name: /limpiar historial/i });

      // Act
      await user.click(clearButton);
      const confirmButton = screen.getByRole("button", { name: /eliminar/i });
      await user.click(confirmButton);

      // Assert - Toast appears
      await waitFor(() => {
        expect(screen.getByText(/historial eliminado/i)).toBeInTheDocument();
      });

      // Act - Wait for auto-dismiss (assume 3 seconds)
      vi.advanceTimersByTime(3000);

      // Assert - Toast should disappear
      await waitFor(() => {
        expect(screen.queryByText(/historial eliminado/i)).not.toBeInTheDocument();
      });

      vi.useRealTimers();
    });

    it("should allow manual dismissal of success toast", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<HistoryList />);

      const clearButton = screen.getByRole("button", { name: /limpiar historial/i });

      // Act
      await user.click(clearButton);
      const confirmButton = screen.getByRole("button", { name: /eliminar/i });
      await user.click(confirmButton);

      // Assert - Toast appears with close button
      await waitFor(() => {
        expect(screen.getByText(/historial eliminado/i)).toBeInTheDocument();
      });

      const closeToastButton = screen.getByRole("button", { name: /cerrar|close|dismiss/i });

      // Act - Dismiss toast manually
      await user.click(closeToastButton);

      // Assert - Toast disappears
      await waitFor(() => {
        expect(screen.queryByText(/historial eliminado/i)).not.toBeInTheDocument();
      });
    });

    it("should NOT display success toast if user cancels clearing", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<HistoryList />);

      const clearButton = screen.getByRole("button", { name: /limpiar historial/i });

      // Act - Click clear but CANCEL
      await user.click(clearButton);
      const cancelButton = screen.getByRole("button", { name: /cancelar/i });
      await user.click(cancelButton);

      // Assert - No success toast should appear
      await waitFor(
        () => {
          expect(screen.queryByText(/historial eliminado/i)).not.toBeInTheDocument();
        },
        { timeout: 1000 }
      );
    });

    it("should position success toast in a visible, non-intrusive location", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<HistoryList />);

      const clearButton = screen.getByRole("button", { name: /limpiar historial/i });

      // Act
      await user.click(clearButton);
      const confirmButton = screen.getByRole("button", { name: /eliminar/i });
      await user.click(confirmButton);

      // Assert - Toast should be positioned (top-right, bottom-right, etc.)
      await waitFor(() => {
        const successToast = screen.getByRole("status");
        // Check for common toast positioning classes
        expect(successToast.closest('[class*="fixed"]')).toBeInTheDocument();
        expect(successToast.closest('[class*="toast"]')).toHaveClass(/top-|bottom-/);
      });
    });
  });

  describe("Visual State Transitions", () => {
    it("should show loading/processing state while clearing", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<HistoryList />);

      const clearButton = screen.getByRole("button", { name: /limpiar historial/i });

      // Act
      await user.click(clearButton);
      const confirmButton = screen.getByRole("button", { name: /eliminar/i });

      // Mock slow clear operation
      mockClearHistory.mockImplementation(() => {
        return new Promise((resolve) => setTimeout(resolve, 1000));
      });

      await user.click(confirmButton);

      // Assert - Should show processing state (disabled button, spinner, etc.)
      await waitFor(() => {
        expect(screen.getByRole("button", { name: /eliminando|procesando/i })).toBeDisabled();
      });
    });

    it("should show smooth transition from items list to empty state", async () => {
      // Arrange
      const user = userEvent.setup();
      const { rerender } = render(<HistoryList />);

      const clearButton = screen.getByRole("button", { name: /limpiar historial/i });

      // Assert - Items are visible
      expect(screen.getByText("Nutella")).toBeInTheDocument();

      // Act - Clear history
      await user.click(clearButton);
      const confirmButton = screen.getByRole("button", { name: /eliminar/i });
      await user.click(confirmButton);

      // Simulate state update
      mockState.items = [];
      rerender(<HistoryList />);

      // Assert - Empty state should be visible with transition classes
      await waitFor(() => {
        const emptyState = screen.getByText(/no hay búsquedas recientes/i);
        expect(emptyState).toBeInTheDocument();
        // Should have animation/transition class
        expect(emptyState.closest("div")).toHaveClass(/fade|animate|transition/);
      });
    });

    it("should highlight clear button on hover to indicate interactivity", () => {
      // Arrange
      render(<HistoryList />);

      const clearButton = screen.getByRole("button", { name: /limpiar historial/i });

      // Assert - Button should have hover styles
      expect(clearButton).toHaveClass(/hover:/);
    });
  });

  describe("Error Feedback (Edge Case)", () => {
    it("should display error toast if clearing history fails", async () => {
      // Arrange
      const user = userEvent.setup();
      mockClearHistory.mockImplementation(() => {
        throw new Error("Failed to clear history");
      });

      render(<HistoryList />);

      const clearButton = screen.getByRole("button", { name: /limpiar historial/i });

      // Act
      await user.click(clearButton);
      const confirmButton = screen.getByRole("button", { name: /eliminar/i });
      await user.click(confirmButton);

      // Assert - Error toast should appear
      await waitFor(() => {
        expect(screen.getByText(/error al eliminar historial/i)).toBeInTheDocument();
      });
    });

    it("should display error toast with retry option if clear fails", async () => {
      // Arrange
      const user = userEvent.setup();
      mockClearHistory.mockImplementation(() => {
        throw new Error("Storage quota exceeded");
      });

      render(<HistoryList />);

      const clearButton = screen.getByRole("button", { name: /limpiar historial/i });

      // Act
      await user.click(clearButton);
      const confirmButton = screen.getByRole("button", { name: /eliminar/i });
      await user.click(confirmButton);

      // Assert - Error toast with retry action
      await waitFor(() => {
        expect(screen.getByText(/error al eliminar/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /reintentar|retry/i })).toBeInTheDocument();
      });
    });
  });

  describe("Accessibility for Visual Feedback", () => {
    it("should announce success to screen readers via aria-live", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<HistoryList />);

      const clearButton = screen.getByRole("button", { name: /limpiar historial/i });

      // Act
      await user.click(clearButton);
      const confirmButton = screen.getByRole("button", { name: /eliminar/i });
      await user.click(confirmButton);

      // Assert - Success region should have aria-live
      await waitFor(() => {
        const successToast = screen.getByRole("status");
        expect(successToast).toHaveAttribute("aria-live", "polite");
      });
    });

    it("should provide appropriate role for success notification", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<HistoryList />);

      const clearButton = screen.getByRole("button", { name: /limpiar historial/i });

      // Act
      await user.click(clearButton);
      const confirmButton = screen.getByRole("button", { name: /eliminar/i });
      await user.click(confirmButton);

      // Assert - Toast should have status or alert role
      await waitFor(() => {
        const notification = screen.getByRole("status");
        expect(notification).toBeInTheDocument();
      });
    });

    it("should be keyboard accessible for dismissing toast", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<HistoryList />);

      const clearButton = screen.getByRole("button", { name: /limpiar historial/i });

      // Act
      await user.click(clearButton);
      const confirmButton = screen.getByRole("button", { name: /eliminar/i });
      await user.click(confirmButton);

      // Assert - Toast close button should be focusable
      await waitFor(() => {
        const closeButton = screen.getByRole("button", { name: /cerrar|close/i });
        expect(closeButton).toHaveAttribute("tabIndex", "0");
      });
    });

    it("should support Escape key to dismiss toast", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<HistoryList />);

      const clearButton = screen.getByRole("button", { name: /limpiar historial/i });

      // Act - Clear history
      await user.click(clearButton);
      const confirmButton = screen.getByRole("button", { name: /eliminar/i });
      await user.click(confirmButton);

      // Assert - Toast appears
      await waitFor(() => {
        expect(screen.getByText(/historial eliminado/i)).toBeInTheDocument();
      });

      // Act - Press Escape
      await user.keyboard("{Escape}");

      // Assert - Toast disappears
      await waitFor(() => {
        expect(screen.queryByText(/historial eliminado/i)).not.toBeInTheDocument();
      });
    });
  });

  describe("Mobile-First Visual Feedback", () => {
    it("should display toast with appropriate size for mobile screens", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<HistoryList />);

      const clearButton = screen.getByRole("button", { name: /limpiar historial/i });

      // Act
      await user.click(clearButton);
      const confirmButton = screen.getByRole("button", { name: /eliminar/i });
      await user.click(confirmButton);

      // Assert - Toast should be mobile-friendly (full width on small screens)
      await waitFor(() => {
        const successToast = screen.getByRole("status");
        expect(successToast).toHaveClass(/w-full|max-w-/);
      });
    });

    it("should position toast at bottom on mobile for thumb accessibility", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<HistoryList />);

      const clearButton = screen.getByRole("button", { name: /limpiar historial/i });

      // Act
      await user.click(clearButton);
      const confirmButton = screen.getByRole("button", { name: /eliminar/i });
      await user.click(confirmButton);

      // Assert - Toast should be at bottom on mobile (better reachability)
      await waitFor(() => {
        const successToast = screen.getByRole("status");
        expect(successToast.closest('[class*="toast"]')).toHaveClass(/bottom-/);
      });
    });

    it("should have sufficient touch target size for dismiss button on mobile", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<HistoryList />);

      const clearButton = screen.getByRole("button", { name: /limpiar historial/i });

      // Act
      await user.click(clearButton);
      const confirmButton = screen.getByRole("button", { name: /eliminar/i });
      await user.click(confirmButton);

      // Assert - Close button should be at least 44x44px (iOS guideline)
      await waitFor(() => {
        const closeButton = screen.getByRole("button", { name: /cerrar|close/i });
        const styles = window.getComputedStyle(closeButton);
        const minSize = 44; // pixels
        expect(parseInt(styles.minHeight) || parseInt(styles.height)).toBeGreaterThanOrEqual(minSize);
        expect(parseInt(styles.minWidth) || parseInt(styles.width)).toBeGreaterThanOrEqual(minSize);
      });
    });
  });

  describe("UX: Count of Items Cleared", () => {
    it("should show number of items cleared in success message", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<HistoryList />);

      const clearButton = screen.getByRole("button", { name: /limpiar historial/i });

      // Act
      await user.click(clearButton);
      const confirmButton = screen.getByRole("button", { name: /eliminar/i });
      await user.click(confirmButton);

      // Assert - Success message should include count
      await waitFor(() => {
        expect(screen.getByText(/2 productos eliminados del historial/i)).toBeInTheDocument();
      });
    });

    it("should show singular form when clearing single item", async () => {
      // Arrange
      mockState.items = [mockHistoryItems[0]];
      const user = userEvent.setup();
      render(<HistoryList />);

      const clearButton = screen.getByRole("button", { name: /limpiar historial/i });

      // Act
      await user.click(clearButton);
      const confirmButton = screen.getByRole("button", { name: /eliminar/i });
      await user.click(confirmButton);

      // Assert - Singular form
      await waitFor(() => {
        expect(screen.getByText(/1 producto eliminado del historial/i)).toBeInTheDocument();
      });
    });
  });

  describe("Performance: Visual Feedback Timing", () => {
    it("should show success feedback immediately after clear completes", async () => {
      // Arrange
      vi.useFakeTimers();
      const user = userEvent.setup({ delay: null });
      render(<HistoryList />);

      const clearButton = screen.getByRole("button", { name: /limpiar historial/i });

      // Act
      await user.click(clearButton);
      const confirmButton = screen.getByRole("button", { name: /eliminar/i });
      await user.click(confirmButton);

      // Assert - Toast should appear within 100ms
      vi.advanceTimersByTime(100);

      await waitFor(() => {
        expect(screen.getByText(/historial eliminado/i)).toBeInTheDocument();
      });

      vi.useRealTimers();
    });

    it("should not block UI while showing success feedback", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<HistoryList />);

      const clearButton = screen.getByRole("button", { name: /limpiar historial/i });

      // Act - Clear history
      await user.click(clearButton);
      const confirmButton = screen.getByRole("button", { name: /eliminar/i });
      await user.click(confirmButton);

      // Assert - UI should remain interactive (heading still clickable)
      await waitFor(() => {
        expect(screen.getByText(/historial eliminado/i)).toBeInTheDocument();
      });

      const heading = screen.getByRole("heading", { name: /historial/i });
      expect(heading).toBeInTheDocument();
    });
  });
});
