import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductSkeleton } from "./product-skeleton";

describe("ProductSkeleton", () => {
  describe("Happy Path", () => {
    it("should render skeleton structure", () => {
      // Arrange & Act
      render(<ProductSkeleton />);

      // Assert - Component should render without crashing
      const container = screen.getByTestId("product-skeleton");
      expect(container).toBeInTheDocument();
    });

    it("should display skeleton for product image placeholder", () => {
      // Arrange & Act
      render(<ProductSkeleton />);

      // Assert
      const imagePlaceholder = screen.getByTestId("skeleton-image");
      expect(imagePlaceholder).toBeInTheDocument();
    });

    it("should display skeleton for product name placeholder", () => {
      // Arrange & Act
      render(<ProductSkeleton />);

      // Assert
      const namePlaceholder = screen.getByTestId("skeleton-name");
      expect(namePlaceholder).toBeInTheDocument();
    });

    it("should display skeleton for product details placeholder", () => {
      // Arrange & Act
      render(<ProductSkeleton />);

      // Assert
      const detailsPlaceholder = screen.getByTestId("skeleton-details");
      expect(detailsPlaceholder).toBeInTheDocument();
    });
  });

  describe("Animation", () => {
    it("should have animate-pulse class for loading animation", () => {
      // Arrange & Act
      render(<ProductSkeleton />);

      // Assert
      const container = screen.getByTestId("product-skeleton");
      expect(container).toHaveClass("animate-pulse");
    });
  });

  describe("Skeleton Elements Layout", () => {
    it("should render image placeholder with correct height", () => {
      // Arrange & Act
      render(<ProductSkeleton />);

      // Assert
      const imagePlaceholder = screen.getByTestId("skeleton-image");
      expect(imagePlaceholder).toHaveClass("h-48");
    });

    it("should render image placeholder with rounded corners", () => {
      // Arrange & Act
      render(<ProductSkeleton />);

      // Assert
      const imagePlaceholder = screen.getByTestId("skeleton-image");
      expect(imagePlaceholder).toHaveClass("rounded-lg");
    });

    it("should render name placeholder with correct height", () => {
      // Arrange & Act
      render(<ProductSkeleton />);

      // Assert
      const namePlaceholder = screen.getByTestId("skeleton-name");
      expect(namePlaceholder).toHaveClass("h-6");
    });

    it("should render name placeholder with 3/4 width", () => {
      // Arrange & Act
      render(<ProductSkeleton />);

      // Assert
      const namePlaceholder = screen.getByTestId("skeleton-name");
      expect(namePlaceholder).toHaveClass("w-3/4");
    });

    it("should render details placeholder with correct height", () => {
      // Arrange & Act
      render(<ProductSkeleton />);

      // Assert
      const detailsPlaceholder = screen.getByTestId("skeleton-details");
      expect(detailsPlaceholder).toHaveClass("h-4");
    });

    it("should render details placeholder with 1/2 width", () => {
      // Arrange & Act
      render(<ProductSkeleton />);

      // Assert
      const detailsPlaceholder = screen.getByTestId("skeleton-details");
      expect(detailsPlaceholder).toHaveClass("w-1/2");
    });
  });

  describe("Styling", () => {
    it("should have space-y-4 for consistent vertical spacing", () => {
      // Arrange & Act
      render(<ProductSkeleton />);

      // Assert
      const container = screen.getByTestId("product-skeleton");
      expect(container).toHaveClass("space-y-4");
    });

    it("should render image placeholder with muted background color", () => {
      // Arrange & Act
      render(<ProductSkeleton />);

      // Assert
      const imagePlaceholder = screen.getByTestId("skeleton-image");
      expect(imagePlaceholder).toHaveClass("bg-slate-200");
    });

    it("should render name placeholder with muted background color", () => {
      // Arrange & Act
      render(<ProductSkeleton />);

      // Assert
      const namePlaceholder = screen.getByTestId("skeleton-name");
      expect(namePlaceholder).toHaveClass("bg-slate-200");
    });

    it("should render details placeholder with muted background color", () => {
      // Arrange & Act
      render(<ProductSkeleton />);

      // Assert
      const detailsPlaceholder = screen.getByTestId("skeleton-details");
      expect(detailsPlaceholder).toHaveClass("bg-slate-200");
    });

    it("should render name placeholder with rounded corners", () => {
      // Arrange & Act
      render(<ProductSkeleton />);

      // Assert
      const namePlaceholder = screen.getByTestId("skeleton-name");
      expect(namePlaceholder).toHaveClass("rounded");
    });

    it("should render details placeholder with rounded corners", () => {
      // Arrange & Act
      render(<ProductSkeleton />);

      // Assert
      const detailsPlaceholder = screen.getByTestId("skeleton-details");
      expect(detailsPlaceholder).toHaveClass("rounded");
    });
  });

  describe("Accessibility", () => {
    it("should have aria-busy attribute to indicate loading state", () => {
      // Arrange & Act
      render(<ProductSkeleton />);

      // Assert
      const container = screen.getByTestId("product-skeleton");
      expect(container).toHaveAttribute("aria-busy", "true");
    });

    it("should have role status for screen reader announcements", () => {
      // Arrange & Act
      render(<ProductSkeleton />);

      // Assert
      const container = screen.getByRole("status");
      expect(container).toBeInTheDocument();
    });

    it("should have aria-label describing loading state", () => {
      // Arrange & Act
      render(<ProductSkeleton />);

      // Assert
      const container = screen.getByRole("status");
      expect(container).toHaveAttribute("aria-label", "Loading product information");
    });

    it("should have aria-live polite for non-intrusive updates", () => {
      // Arrange & Act
      render(<ProductSkeleton />);

      // Assert
      const container = screen.getByRole("status");
      expect(container).toHaveAttribute("aria-live", "polite");
    });
  });

  describe("Edge Cases", () => {
    it("should render consistently on multiple calls", () => {
      // Arrange & Act
      const { container: first } = render(<ProductSkeleton />);
      const { container: second } = render(<ProductSkeleton />);

      // Assert - Both renders should produce identical structure
      expect(first.innerHTML).toBe(second.innerHTML);
    });

    it("should not contain any actual product data", () => {
      // Arrange & Act
      render(<ProductSkeleton />);

      // Assert - Skeleton should not have any text content
      const container = screen.getByTestId("product-skeleton");
      expect(container).toHaveTextContent("");
    });

    it("should be visually distinct from actual product card", () => {
      // Arrange & Act
      render(<ProductSkeleton />);

      // Assert - Should not have product-specific classes or attributes
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
      expect(screen.queryByText(/./)).not.toBeInTheDocument();
    });
  });

  describe("Visual Consistency", () => {
    it("should match ProductCard layout structure", () => {
      // Arrange & Act
      render(<ProductSkeleton />);

      // Assert - Should have three main sections matching ProductCard
      const imagePlaceholder = screen.getByTestId("skeleton-image");
      const namePlaceholder = screen.getByTestId("skeleton-name");
      const detailsPlaceholder = screen.getByTestId("skeleton-details");

      expect(imagePlaceholder).toBeInTheDocument();
      expect(namePlaceholder).toBeInTheDocument();
      expect(detailsPlaceholder).toBeInTheDocument();
    });

    it("should render all skeleton elements in correct order", () => {
      // Arrange & Act
      const { container } = render(<ProductSkeleton />);

      // Assert - Image should be first, then name, then details
      const elements = container.querySelectorAll("[data-testid^='skeleton-']");
      expect(elements[0]).toHaveAttribute("data-testid", "skeleton-image");
      expect(elements[1]).toHaveAttribute("data-testid", "skeleton-name");
      expect(elements[2]).toHaveAttribute("data-testid", "skeleton-details");
    });
  });
});
