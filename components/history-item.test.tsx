import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HistoryItem } from "./history-item";
import type { SearchHistoryItem } from "@/types/product";

describe("HistoryItem", () => {
  const mockItem: SearchHistoryItem = {
    code: "3017620422003",
    product_name: "Nutella",
    image_url: "https://images.openfoodfacts.org/images/products/301/762/042/2003/front_en.jpg",
    searched_at: "2026-02-06T10:30:00.000Z",
  };

  describe("Happy Path", () => {
    it("should render product thumbnail image with correct src", () => {
      // Arrange
      const onClick = vi.fn();

      // Act
      render(<HistoryItem item={mockItem} onClick={onClick} />);

      // Assert
      const image = screen.getByRole("img", { name: /nutella/i });
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", mockItem.image_url);
    });

    it("should render product name correctly", () => {
      // Arrange
      const onClick = vi.fn();

      // Act
      render(<HistoryItem item={mockItem} onClick={onClick} />);

      // Assert
      expect(screen.getByText("Nutella")).toBeInTheDocument();
    });

    it("should render barcode code correctly", () => {
      // Arrange
      const onClick = vi.fn();

      // Act
      render(<HistoryItem item={mockItem} onClick={onClick} />);

      // Assert
      expect(screen.getByText("3017620422003")).toBeInTheDocument();
    });

    it("should render formatted date in Spanish locale", () => {
      // Arrange
      const onClick = vi.fn();
      const expectedDate = new Date("2026-02-06T10:30:00.000Z").toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      // Act
      render(<HistoryItem item={mockItem} onClick={onClick} />);

      // Assert
      expect(screen.getByText(expectedDate)).toBeInTheDocument();
    });

    it("should call onClick with item code when clicked", async () => {
      // Arrange
      const onClick = vi.fn();
      const user = userEvent.setup();
      render(<HistoryItem item={mockItem} onClick={onClick} />);

      // Act
      const historyItem = screen.getByRole("button");
      await user.click(historyItem);

      // Assert
      expect(onClick).toHaveBeenCalledWith("3017620422003");
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("should be rendered as a button for accessibility", () => {
      // Arrange
      const onClick = vi.fn();

      // Act
      render(<HistoryItem item={mockItem} onClick={onClick} />);

      // Assert
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should render with missing product image (fallback)", () => {
      // Arrange
      const itemWithoutImage: SearchHistoryItem = {
        ...mockItem,
        image_url: "",
      };
      const onClick = vi.fn();

      // Act
      render(<HistoryItem item={itemWithoutImage} onClick={onClick} />);

      // Assert
      const image = screen.getByRole("img");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", expect.stringContaining("placeholder"));
    });

    it("should render with very long product name", () => {
      // Arrange
      const itemWithLongName: SearchHistoryItem = {
        ...mockItem,
        product_name: "Very Long Product Name That Should Be Truncated Or Wrapped Properly Without Breaking Layout",
      };
      const onClick = vi.fn();

      // Act
      render(<HistoryItem item={itemWithLongName} onClick={onClick} />);

      // Assert
      expect(screen.getByText(/very long product name/i)).toBeInTheDocument();
    });

    it("should render with 6-digit barcode (minimum)", () => {
      // Arrange
      const itemWithShortCode: SearchHistoryItem = {
        ...mockItem,
        code: "123456",
      };
      const onClick = vi.fn();

      // Act
      render(<HistoryItem item={itemWithShortCode} onClick={onClick} />);

      // Assert
      expect(screen.getByText("123456")).toBeInTheDocument();
    });

    it("should render with 13-digit barcode (maximum)", () => {
      // Arrange
      const itemWithLongCode: SearchHistoryItem = {
        ...mockItem,
        code: "1234567890123",
      };
      const onClick = vi.fn();

      // Act
      render(<HistoryItem item={itemWithLongCode} onClick={onClick} />);

      // Assert
      expect(screen.getByText("1234567890123")).toBeInTheDocument();
    });

    it("should handle recent date (today)", () => {
      // Arrange
      const itemWithRecentDate: SearchHistoryItem = {
        ...mockItem,
        searched_at: new Date().toISOString(),
      };
      const onClick = vi.fn();

      // Act
      render(<HistoryItem item={itemWithRecentDate} onClick={onClick} />);

      // Assert
      const dateText = screen.getByText(/\d{1,2}:\d{2}/);
      expect(dateText).toBeInTheDocument();
    });

    it("should handle old date (months ago)", () => {
      // Arrange
      const itemWithOldDate: SearchHistoryItem = {
        ...mockItem,
        searched_at: "2025-06-15T08:00:00.000Z",
      };
      const onClick = vi.fn();

      // Act
      render(<HistoryItem item={itemWithOldDate} onClick={onClick} />);

      // Assert
      const dateText = screen.getByText(/2025/);
      expect(dateText).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("should have hover state styling", async () => {
      // Arrange
      const onClick = vi.fn();
      const user = userEvent.setup();
      render(<HistoryItem item={mockItem} onClick={onClick} />);

      const button = screen.getByRole("button");

      // Act
      await user.hover(button);

      // Assert
      expect(button).toHaveClass("hover:bg-accent");
    });

    it("should be clickable via keyboard (Enter key)", async () => {
      // Arrange
      const onClick = vi.fn();
      const user = userEvent.setup();
      render(<HistoryItem item={mockItem} onClick={onClick} />);

      const button = screen.getByRole("button");

      // Act
      button.focus();
      await user.keyboard("{Enter}");

      // Assert
      expect(onClick).toHaveBeenCalledWith("3017620422003");
    });

    it("should be clickable via keyboard (Space key)", async () => {
      // Arrange
      const onClick = vi.fn();
      const user = userEvent.setup();
      render(<HistoryItem item={mockItem} onClick={onClick} />);

      const button = screen.getByRole("button");

      // Act
      button.focus();
      await user.keyboard(" ");

      // Assert
      expect(onClick).toHaveBeenCalledWith("3017620422003");
    });

    it("should show focus outline when focused", async () => {
      // Arrange
      const onClick = vi.fn();
      render(<HistoryItem item={mockItem} onClick={onClick} />);

      const button = screen.getByRole("button");

      // Act
      button.focus();

      // Assert
      expect(button).toHaveFocus();
      expect(button).toHaveClass("focus-visible:outline-none", "focus-visible:ring-2");
    });
  });

  describe("Accessibility", () => {
    it("should have accessible name that includes product name", () => {
      // Arrange
      const onClick = vi.fn();

      // Act
      render(<HistoryItem item={mockItem} onClick={onClick} />);

      // Assert
      const button = screen.getByRole("button", { name: /nutella/i });
      expect(button).toBeInTheDocument();
    });

    it("should have image alt text matching product name", () => {
      // Arrange
      const onClick = vi.fn();

      // Act
      render(<HistoryItem item={mockItem} onClick={onClick} />);

      // Assert
      const image = screen.getByAltText(/nutella/i);
      expect(image).toBeInTheDocument();
    });

    it("should be keyboard navigable", () => {
      // Arrange
      const onClick = vi.fn();

      // Act
      render(<HistoryItem item={mockItem} onClick={onClick} />);

      // Assert
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("tabIndex", "0");
    });
  });

  describe("Mobile-First Design", () => {
    it("should render thumbnail with fixed size appropriate for mobile", () => {
      // Arrange
      const onClick = vi.fn();

      // Act
      render(<HistoryItem item={mockItem} onClick={onClick} />);

      // Assert
      const image = screen.getByRole("img");
      expect(image).toHaveClass("w-16", "h-16");
    });

    it("should use flexbox layout for responsive design", () => {
      // Arrange
      const onClick = vi.fn();

      // Act
      render(<HistoryItem item={mockItem} onClick={onClick} />);

      // Assert
      const button = screen.getByRole("button");
      expect(button).toHaveClass("flex");
    });

    it("should have appropriate touch target size (min 44x44px)", () => {
      // Arrange
      const onClick = vi.fn();

      // Act
      render(<HistoryItem item={mockItem} onClick={onClick} />);

      // Assert
      const button = screen.getByRole("button");
      expect(button).toHaveClass("p-4");
    });
  });
});
