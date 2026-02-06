import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BarcodeInput } from "./barcode-input";

describe("BarcodeInput", () => {
  describe("Happy Path", () => {
    it('should render input with placeholder "Ingresa código de barras..."', () => {
      // Arrange
      const onSearch = vi.fn();

      // Act
      render(<BarcodeInput onSearch={onSearch} />);

      // Assert
      const input = screen.getByPlaceholderText(/ingresa código de barras/i);
      expect(input).toBeInTheDocument();
    });

    it("should render search button with accessible label", () => {
      // Arrange
      const onSearch = vi.fn();

      // Act
      render(<BarcodeInput onSearch={onSearch} />);

      // Assert
      const button = screen.getByRole("button", { name: /buscar/i });
      expect(button).toBeInTheDocument();
      expect(button).toBeVisible();
    });

    it("should call onSearch with valid 6-digit barcode when button clicked", async () => {
      // Arrange
      const onSearch = vi.fn();
      const user = userEvent.setup();
      render(<BarcodeInput onSearch={onSearch} />);

      const input = screen.getByPlaceholderText(/ingresa código de barras/i);
      const button = screen.getByRole("button", { name: /buscar/i });

      // Act
      await user.type(input, "123456");
      await user.click(button);

      // Assert
      expect(onSearch).toHaveBeenCalledWith("123456");
      expect(onSearch).toHaveBeenCalledTimes(1);
    });

    it("should call onSearch with valid 13-digit barcode when button clicked", async () => {
      // Arrange
      const onSearch = vi.fn();
      const user = userEvent.setup();
      render(<BarcodeInput onSearch={onSearch} />);

      const input = screen.getByPlaceholderText(/ingresa código de barras/i);
      const button = screen.getByRole("button", { name: /buscar/i });

      // Act
      await user.type(input, "3017620422003");
      await user.click(button);

      // Assert
      expect(onSearch).toHaveBeenCalledWith("3017620422003");
      expect(onSearch).toHaveBeenCalledTimes(1);
    });

    it("should trigger search when Enter key is pressed with valid code", async () => {
      // Arrange
      const onSearch = vi.fn();
      const user = userEvent.setup();
      render(<BarcodeInput onSearch={onSearch} />);

      const input = screen.getByPlaceholderText(/ingresa código de barras/i);

      // Act
      await user.type(input, "7501055363803");
      await user.keyboard("{Enter}");

      // Assert
      expect(onSearch).toHaveBeenCalledWith("7501055363803");
      expect(onSearch).toHaveBeenCalledTimes(1);
    });
  });

  describe("Edge Cases", () => {
    it("should disable search button when input is empty", () => {
      // Arrange
      const onSearch = vi.fn();

      // Act
      render(<BarcodeInput onSearch={onSearch} />);

      // Assert
      const button = screen.getByRole("button", { name: /buscar/i });
      expect(button).toBeDisabled();
    });

    it("should disable search button when code has less than 6 digits", async () => {
      // Arrange
      const onSearch = vi.fn();
      const user = userEvent.setup();
      render(<BarcodeInput onSearch={onSearch} />);

      const input = screen.getByPlaceholderText(/ingresa código de barras/i);
      const button = screen.getByRole("button", { name: /buscar/i });

      // Act
      await user.type(input, "12345");

      // Assert
      expect(button).toBeDisabled();
    });

    it("should disable search button when code has more than 13 digits", async () => {
      // Arrange
      const onSearch = vi.fn();
      const user = userEvent.setup();
      render(<BarcodeInput onSearch={onSearch} />);

      const input = screen.getByPlaceholderText(/ingresa código de barras/i);
      const button = screen.getByRole("button", { name: /buscar/i });

      // Act
      await user.type(input, "12345678901234");

      // Assert
      expect(button).toBeDisabled();
    });

    it("should enable search button when exactly 6 digits entered (minimum boundary)", async () => {
      // Arrange
      const onSearch = vi.fn();
      const user = userEvent.setup();
      render(<BarcodeInput onSearch={onSearch} />);

      const input = screen.getByPlaceholderText(/ingresa código de barras/i);
      const button = screen.getByRole("button", { name: /buscar/i });

      // Act
      await user.type(input, "000000");

      // Assert
      expect(button).not.toBeDisabled();
    });

    it("should enable search button when exactly 13 digits entered (maximum boundary)", async () => {
      // Arrange
      const onSearch = vi.fn();
      const user = userEvent.setup();
      render(<BarcodeInput onSearch={onSearch} />);

      const input = screen.getByPlaceholderText(/ingresa código de barras/i);
      const button = screen.getByRole("button", { name: /buscar/i });

      // Act
      await user.type(input, "9999999999999");

      // Assert
      expect(button).not.toBeDisabled();
    });
  });

  describe("Input Filtering (Only Numbers)", () => {
    it("should filter out letters from input", async () => {
      // Arrange
      const onSearch = vi.fn();
      const user = userEvent.setup();
      render(<BarcodeInput onSearch={onSearch} />);

      const input = screen.getByPlaceholderText(
        /ingresa código de barras/i
      ) as HTMLInputElement;

      // Act
      await user.type(input, "123ABC456");

      // Assert
      expect(input.value).toBe("123456");
    });

    it("should filter out special characters from input", async () => {
      // Arrange
      const onSearch = vi.fn();
      const user = userEvent.setup();
      render(<BarcodeInput onSearch={onSearch} />);

      const input = screen.getByPlaceholderText(
        /ingresa código de barras/i
      ) as HTMLInputElement;

      // Act
      await user.type(input, "123-456-789");

      // Assert
      expect(input.value).toBe("123456789");
    });

    it("should filter out spaces from input", async () => {
      // Arrange
      const onSearch = vi.fn();
      const user = userEvent.setup();
      render(<BarcodeInput onSearch={onSearch} />);

      const input = screen.getByPlaceholderText(
        /ingresa código de barras/i
      ) as HTMLInputElement;

      // Act
      await user.type(input, "123 456 789");

      // Assert
      expect(input.value).toBe("123456789");
    });

    it("should only allow numeric characters in input field", async () => {
      // Arrange
      const onSearch = vi.fn();
      const user = userEvent.setup();
      render(<BarcodeInput onSearch={onSearch} />);

      const input = screen.getByPlaceholderText(
        /ingresa código de barras/i
      ) as HTMLInputElement;

      // Act
      await user.type(input, "1a2b3!@#4c5$%^6");

      // Assert
      expect(input.value).toBe("123456");
    });

    it("should not trigger search with Enter key when code is invalid", async () => {
      // Arrange
      const onSearch = vi.fn();
      const user = userEvent.setup();
      render(<BarcodeInput onSearch={onSearch} />);

      const input = screen.getByPlaceholderText(/ingresa código de barras/i);

      // Act
      await user.type(input, "123");
      await user.keyboard("{Enter}");

      // Assert
      expect(onSearch).not.toHaveBeenCalled();
    });
  });

  describe("Mobile-First Design", () => {
    it("should have full width class (w-full) on input", () => {
      // Arrange
      const onSearch = vi.fn();

      // Act
      render(<BarcodeInput onSearch={onSearch} />);

      // Assert
      const input = screen.getByPlaceholderText(/ingresa código de barras/i);
      expect(input).toHaveClass("w-full");
    });

    it("should render component with responsive layout classes", () => {
      // Arrange
      const onSearch = vi.fn();

      // Act
      render(<BarcodeInput onSearch={onSearch} />);

      // Assert
      const input = screen.getByPlaceholderText(/ingresa código de barras/i);
      const button = screen.getByRole("button", { name: /buscar/i });

      expect(input).toBeInTheDocument();
      expect(button).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("should not call onSearch when button is disabled and clicked", async () => {
      // Arrange
      const onSearch = vi.fn();
      const user = userEvent.setup();
      render(<BarcodeInput onSearch={onSearch} />);

      const button = screen.getByRole("button", { name: /buscar/i });

      // Act
      await user.click(button);

      // Assert
      expect(onSearch).not.toHaveBeenCalled();
    });

    it("should clear input field after successful search", async () => {
      // Arrange
      const onSearch = vi.fn();
      const user = userEvent.setup();
      render(<BarcodeInput onSearch={onSearch} />);

      const input = screen.getByPlaceholderText(
        /ingresa código de barras/i
      ) as HTMLInputElement;
      const button = screen.getByRole("button", { name: /buscar/i });

      // Act
      await user.type(input, "123456");
      await user.click(button);

      // Assert
      expect(onSearch).toHaveBeenCalledWith("123456");
      expect(input.value).toBe("");
    });

    it("should allow typing new barcode after clearing", async () => {
      // Arrange
      const onSearch = vi.fn();
      const user = userEvent.setup();
      render(<BarcodeInput onSearch={onSearch} />);

      const input = screen.getByPlaceholderText(
        /ingresa código de barras/i
      ) as HTMLInputElement;
      const button = screen.getByRole("button", { name: /buscar/i });

      // Act - First search
      await user.type(input, "123456");
      await user.click(button);

      // Act - Second search
      await user.type(input, "7890123");
      await user.click(button);

      // Assert
      expect(onSearch).toHaveBeenCalledTimes(2);
      expect(onSearch).toHaveBeenNthCalledWith(1, "123456");
      expect(onSearch).toHaveBeenNthCalledWith(2, "7890123");
    });
  });

  describe("Validation Feedback", () => {
    it("should show error message when code has 1 digit (below minimum)", async () => {
      // Arrange
      const onSearch = vi.fn();
      const user = userEvent.setup();
      render(<BarcodeInput onSearch={onSearch} />);

      const input = screen.getByPlaceholderText(/ingresa código de barras/i);

      // Act
      await user.type(input, "1");

      // Assert
      expect(
        screen.getByText(/el código debe tener al menos 6 dígitos/i)
      ).toBeInTheDocument();
    });

    it("should show error message when code has 5 digits (below minimum)", async () => {
      // Arrange
      const onSearch = vi.fn();
      const user = userEvent.setup();
      render(<BarcodeInput onSearch={onSearch} />);

      const input = screen.getByPlaceholderText(/ingresa código de barras/i);

      // Act
      await user.type(input, "12345");

      // Assert
      expect(
        screen.getByText(/el código debe tener al menos 6 dígitos/i)
      ).toBeInTheDocument();
    });

    it("should show error message when code has 14 digits (above maximum)", async () => {
      // Arrange
      const onSearch = vi.fn();
      const user = userEvent.setup();
      render(<BarcodeInput onSearch={onSearch} />);

      const input = screen.getByPlaceholderText(/ingresa código de barras/i);

      // Act
      await user.type(input, "12345678901234");

      // Assert
      expect(
        screen.getByText(/el código no puede tener más de 13 dígitos/i)
      ).toBeInTheDocument();
    });

    it("should show error message when code has 20 digits (above maximum)", async () => {
      // Arrange
      const onSearch = vi.fn();
      const user = userEvent.setup();
      render(<BarcodeInput onSearch={onSearch} />);

      const input = screen.getByPlaceholderText(/ingresa código de barras/i);

      // Act
      await user.type(input, "12345678901234567890");

      // Assert
      expect(
        screen.getByText(/el código no puede tener más de 13 dígitos/i)
      ).toBeInTheDocument();
    });

    it("should have error styling (border-destructive) on input when code is too short", async () => {
      // Arrange
      const onSearch = vi.fn();
      const user = userEvent.setup();
      render(<BarcodeInput onSearch={onSearch} />);

      const input = screen.getByPlaceholderText(/ingresa código de barras/i);

      // Act
      await user.type(input, "123");

      // Assert
      expect(input).toHaveClass("border-destructive");
    });

    it("should have error styling (border-destructive) on input when code is too long", async () => {
      // Arrange
      const onSearch = vi.fn();
      const user = userEvent.setup();
      render(<BarcodeInput onSearch={onSearch} />);

      const input = screen.getByPlaceholderText(/ingresa código de barras/i);

      // Act
      await user.type(input, "12345678901234");

      // Assert
      expect(input).toHaveClass("border-destructive");
    });

    it("should NOT show error message when input is empty", () => {
      // Arrange
      const onSearch = vi.fn();

      // Act
      render(<BarcodeInput onSearch={onSearch} />);

      // Assert
      expect(
        screen.queryByText(/el código debe tener al menos 6 dígitos/i)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/el código no puede tener más de 13 dígitos/i)
      ).not.toBeInTheDocument();
    });

    it("should NOT show error message when code is valid (6 digits)", async () => {
      // Arrange
      const onSearch = vi.fn();
      const user = userEvent.setup();
      render(<BarcodeInput onSearch={onSearch} />);

      const input = screen.getByPlaceholderText(/ingresa código de barras/i);

      // Act
      await user.type(input, "123456");

      // Assert
      expect(
        screen.queryByText(/el código debe tener al menos 6 dígitos/i)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/el código no puede tener más de 13 dígitos/i)
      ).not.toBeInTheDocument();
    });

    it("should NOT show error message when code is valid (13 digits)", async () => {
      // Arrange
      const onSearch = vi.fn();
      const user = userEvent.setup();
      render(<BarcodeInput onSearch={onSearch} />);

      const input = screen.getByPlaceholderText(/ingresa código de barras/i);

      // Act
      await user.type(input, "3017620422003");

      // Assert
      expect(
        screen.queryByText(/el código debe tener al menos 6 dígitos/i)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/el código no puede tener más de 13 dígitos/i)
      ).not.toBeInTheDocument();
    });

    it("should NOT have error styling when code is valid", async () => {
      // Arrange
      const onSearch = vi.fn();
      const user = userEvent.setup();
      render(<BarcodeInput onSearch={onSearch} />);

      const input = screen.getByPlaceholderText(/ingresa código de barras/i);

      // Act
      await user.type(input, "123456");

      // Assert
      expect(input).not.toHaveClass("border-destructive");
    });

    it("should clear error when user corrects code from too short to valid", async () => {
      // Arrange
      const onSearch = vi.fn();
      const user = userEvent.setup();
      render(<BarcodeInput onSearch={onSearch} />);

      const input = screen.getByPlaceholderText(/ingresa código de barras/i);

      // Act - Type invalid code
      await user.type(input, "123");

      // Assert - Error should be visible
      expect(
        screen.getByText(/el código debe tener al menos 6 dígitos/i)
      ).toBeInTheDocument();

      // Act - Correct to valid length
      await user.type(input, "456");

      // Assert - Error should be cleared
      expect(
        screen.queryByText(/el código debe tener al menos 6 dígitos/i)
      ).not.toBeInTheDocument();
    });

    it("should clear error when user corrects code from too long to valid", async () => {
      // Arrange
      const onSearch = vi.fn();
      const user = userEvent.setup();
      render(<BarcodeInput onSearch={onSearch} />);

      const input = screen.getByPlaceholderText(
        /ingresa código de barras/i
      ) as HTMLInputElement;

      // Act - Type invalid code (14 digits)
      await user.type(input, "12345678901234");

      // Assert - Error should be visible
      expect(
        screen.getByText(/el código no puede tener más de 13 dígitos/i)
      ).toBeInTheDocument();

      // Act - Clear and type valid code
      await user.clear(input);
      await user.type(input, "1234567890123");

      // Assert - Error should be cleared
      expect(
        screen.queryByText(/el código no puede tener más de 13 dígitos/i)
      ).not.toBeInTheDocument();
    });

    it("should display helper text below input when there is an error", async () => {
      // Arrange
      const onSearch = vi.fn();
      const user = userEvent.setup();
      render(<BarcodeInput onSearch={onSearch} />);

      const input = screen.getByPlaceholderText(/ingresa código de barras/i);

      // Act
      await user.type(input, "12");

      // Assert
      const errorMessage = screen.getByText(
        /el código debe tener al menos 6 dígitos/i
      );
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage.tagName.toLowerCase()).toBe("p");
    });

    it("should show error text with destructive color styling", async () => {
      // Arrange
      const onSearch = vi.fn();
      const user = userEvent.setup();
      render(<BarcodeInput onSearch={onSearch} />);

      const input = screen.getByPlaceholderText(/ingresa código de barras/i);

      // Act
      await user.type(input, "999");

      // Assert
      const errorMessage = screen.getByText(
        /el código debe tener al menos 6 dígitos/i
      );
      expect(errorMessage).toHaveClass("text-destructive");
    });
  });
});
