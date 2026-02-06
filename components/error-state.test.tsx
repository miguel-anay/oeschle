import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorState } from './error-state';

describe('ErrorState', () => {
  describe('Happy Path', () => {
    it('should display default error title when no title prop provided', () => {
      // Arrange & Act
      render(<ErrorState />);

      // Assert
      expect(screen.getByText('Producto no encontrado')).toBeInTheDocument();
    });

    it('should display default error message when no message prop provided', () => {
      // Arrange & Act
      render(<ErrorState />);

      // Assert
      expect(screen.getByText('Verifica el código e intenta de nuevo')).toBeInTheDocument();
    });

    it('should display retry button with correct text', () => {
      // Arrange & Act
      render(<ErrorState />);

      // Assert
      expect(screen.getByRole('button', { name: /buscar de nuevo|volver a buscar/i })).toBeInTheDocument();
    });

    it('should display illustrative icon or image', () => {
      // Arrange & Act
      render(<ErrorState />);

      // Assert
      const icon = screen.getByTestId('error-icon');
      expect(icon).toBeInTheDocument();
    });

    it('should render all required elements in single view', () => {
      // Arrange & Act
      render(<ErrorState />);

      // Assert
      expect(screen.getByText('Producto no encontrado')).toBeInTheDocument();
      expect(screen.getByText('Verifica el código e intenta de nuevo')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /buscar de nuevo|volver a buscar/i })).toBeInTheDocument();
      expect(screen.getByTestId('error-icon')).toBeInTheDocument();
    });
  });

  describe('Custom Content', () => {
    it('should display custom title when title prop provided', () => {
      // Arrange & Act
      render(<ErrorState title="Error personalizado" />);

      // Assert
      expect(screen.getByText('Error personalizado')).toBeInTheDocument();
      expect(screen.queryByText('Producto no encontrado')).not.toBeInTheDocument();
    });

    it('should display custom message when message prop provided', () => {
      // Arrange & Act
      render(<ErrorState message="Por favor intenta con otro código" />);

      // Assert
      expect(screen.getByText('Por favor intenta con otro código')).toBeInTheDocument();
      expect(screen.queryByText('Verifica el código e intenta de nuevo')).not.toBeInTheDocument();
    });

    it('should display both custom title and message when provided', () => {
      // Arrange & Act
      render(
        <ErrorState
          title="Código inválido"
          message="El código debe tener entre 6 y 13 dígitos"
        />
      );

      // Assert
      expect(screen.getByText('Código inválido')).toBeInTheDocument();
      expect(screen.getByText('El código debe tener entre 6 y 13 dígitos')).toBeInTheDocument();
    });

    it('should override only title and keep default message', () => {
      // Arrange & Act
      render(<ErrorState title="Error de búsqueda" />);

      // Assert
      expect(screen.getByText('Error de búsqueda')).toBeInTheDocument();
      expect(screen.getByText('Verifica el código e intenta de nuevo')).toBeInTheDocument();
    });
  });

  describe('Retry Button Interaction', () => {
    it('should call onRetry callback when retry button clicked', async () => {
      // Arrange
      const user = userEvent.setup();
      const onRetry = vi.fn();
      render(<ErrorState onRetry={onRetry} />);

      // Act
      const retryButton = screen.getByRole('button', { name: /buscar de nuevo|volver a buscar/i });
      await user.click(retryButton);

      // Assert
      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('should call onRetry multiple times on multiple clicks', async () => {
      // Arrange
      const user = userEvent.setup();
      const onRetry = vi.fn();
      render(<ErrorState onRetry={onRetry} />);

      // Act
      const retryButton = screen.getByRole('button', { name: /buscar de nuevo|volver a buscar/i });
      await user.click(retryButton);
      await user.click(retryButton);
      await user.click(retryButton);

      // Assert
      expect(onRetry).toHaveBeenCalledTimes(3);
    });

    it('should not throw error when retry button clicked without onRetry prop', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<ErrorState />);

      // Act & Assert
      const retryButton = screen.getByRole('button', { name: /buscar de nuevo|volver a buscar/i });
      await expect(user.click(retryButton)).resolves.not.toThrow();
    });

    it('should render retry button even when onRetry is undefined', () => {
      // Arrange & Act
      render(<ErrorState onRetry={undefined} />);

      // Assert
      expect(screen.getByRole('button', { name: /buscar de nuevo|volver a buscar/i })).toBeInTheDocument();
    });
  });

  describe('Icon and Visual Elements', () => {
    it('should display search icon or empty state illustration', () => {
      // Arrange & Act
      render(<ErrorState />);

      // Assert
      const icon = screen.getByTestId('error-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toBeVisible();
    });

    it('should have appropriate icon styling for visibility', () => {
      // Arrange & Act
      render(<ErrorState />);

      // Assert
      const icon = screen.getByTestId('error-icon');
      expect(icon).toHaveClass(/text-|w-|h-/); // Should have size/color classes
    });

    it('should position icon above title text', () => {
      // Arrange & Act
      const { container } = render(<ErrorState />);

      // Assert
      const icon = screen.getByTestId('error-icon');
      const title = screen.getByText('Producto no encontrado');

      // Icon should appear before title in DOM order
      expect(container.innerHTML.indexOf('error-icon')).toBeLessThan(
        container.innerHTML.indexOf('Producto no encontrado')
      );
    });
  });

  describe('Accessibility', () => {
    it('should have accessible error region with appropriate role', () => {
      // Arrange & Act
      render(<ErrorState />);

      // Assert
      const errorContainer = screen.getByRole('alert') || screen.getByTestId('error-state');
      expect(errorContainer).toBeInTheDocument();
    });

    it('should have accessible button with proper labeling', () => {
      // Arrange & Act
      render(<ErrorState />);

      // Assert
      const button = screen.getByRole('button', { name: /buscar de nuevo|volver a buscar/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAccessibleName();
    });

    it('should have proper heading hierarchy for title', () => {
      // Arrange & Act
      render(<ErrorState />);

      // Assert
      const heading = screen.getByRole('heading', { name: /producto no encontrado/i });
      expect(heading).toBeInTheDocument();
    });

    it('should have descriptive text for screen readers', () => {
      // Arrange & Act
      render(<ErrorState />);

      // Assert
      const message = screen.getByText('Verifica el código e intenta de nuevo');
      expect(message).toBeInTheDocument();
    });

    it('should have keyboard-accessible retry button', async () => {
      // Arrange
      const user = userEvent.setup();
      const onRetry = vi.fn();
      render(<ErrorState onRetry={onRetry} />);

      // Act
      const button = screen.getByRole('button', { name: /buscar de nuevo|volver a buscar/i });
      button.focus();
      await user.keyboard('{Enter}');

      // Assert
      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('should support Space key to activate retry button', async () => {
      // Arrange
      const user = userEvent.setup();
      const onRetry = vi.fn();
      render(<ErrorState onRetry={onRetry} />);

      // Act
      const button = screen.getByRole('button', { name: /buscar de nuevo|volver a buscar/i });
      button.focus();
      await user.keyboard(' ');

      // Assert
      expect(onRetry).toHaveBeenCalledTimes(1);
    });
  });

  describe('Responsive Design', () => {
    it('should apply mobile-first layout classes', () => {
      // Arrange & Act
      const { container } = render(<ErrorState />);

      // Assert
      const errorState = screen.getByTestId('error-state');
      expect(errorState).toHaveClass(/flex|grid|space-y|p-|py-|px-/); // Should have spacing/layout classes
    });

    it('should center content for better mobile experience', () => {
      // Arrange & Act
      render(<ErrorState />);

      // Assert
      const errorState = screen.getByTestId('error-state');
      expect(errorState).toHaveClass(/(text-center|items-center|justify-center)/);
    });

    it('should have full-width button on mobile', () => {
      // Arrange & Act
      render(<ErrorState />);

      // Assert
      const button = screen.getByRole('button', { name: /buscar de nuevo|volver a buscar/i });
      expect(button).toHaveClass(/w-full|sm:/); // Full width on mobile
    });

    it('should have responsive padding and margins', () => {
      // Arrange & Act
      render(<ErrorState />);

      // Assert
      const errorState = screen.getByTestId('error-state');
      expect(errorState).toHaveClass(/(p-|py-|px-|m-|my-|mx-)/);
    });
  });

  describe('Styling and Theme', () => {
    it('should apply error-themed styling to container', () => {
      // Arrange & Act
      render(<ErrorState />);

      // Assert
      const errorState = screen.getByTestId('error-state');
      expect(errorState).toHaveClass(/(bg-|border|rounded)/);
    });

    it('should style title with appropriate typography', () => {
      // Arrange & Act
      render(<ErrorState />);

      // Assert
      const heading = screen.getByRole('heading', { name: /producto no encontrado/i });
      expect(heading).toHaveClass(/(text-|font-)/);
    });

    it('should style message with readable text color', () => {
      // Arrange & Act
      render(<ErrorState />);

      // Assert
      const message = screen.getByText('Verifica el código e intenta de nuevo');
      expect(message).toHaveClass(/(text-)/);
    });

    it('should apply consistent spacing between elements', () => {
      // Arrange & Act
      render(<ErrorState />);

      // Assert
      const errorState = screen.getByTestId('error-state');
      expect(errorState).toHaveClass(/(space-y|gap)/);
    });

    it('should style retry button with primary action styling', () => {
      // Arrange & Act
      render(<ErrorState />);

      // Assert
      const button = screen.getByRole('button', { name: /buscar de nuevo|volver a buscar/i });
      expect(button).toHaveClass(/(bg-|text-|rounded|px-|py-|hover:)/);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string title prop', () => {
      // Arrange & Act
      render(<ErrorState title="" />);

      // Assert
      // Should either show default or gracefully handle empty string
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
    });

    it('should handle empty string message prop', () => {
      // Arrange & Act
      render(<ErrorState message="" />);

      // Assert
      // Should either show default or gracefully handle empty string
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
    });

    it('should handle very long custom title text', () => {
      // Arrange
      const longTitle = 'Este es un título extremadamente largo que podría causar problemas de diseño en dispositivos móviles si no se maneja correctamente';

      // Act
      render(<ErrorState title={longTitle} />);

      // Assert
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('should handle very long custom message text', () => {
      // Arrange
      const longMessage = 'Este es un mensaje de error muy largo que describe en detalle qué salió mal y qué debe hacer el usuario para resolverlo. Debe manejarse correctamente en todos los tamaños de pantalla.';

      // Act
      render(<ErrorState message={longMessage} />);

      // Assert
      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('should handle rapid successive clicks on retry button', async () => {
      // Arrange
      const user = userEvent.setup();
      const onRetry = vi.fn();
      render(<ErrorState onRetry={onRetry} />);

      // Act
      const button = screen.getByRole('button', { name: /buscar de nuevo|volver a buscar/i });
      await user.tripleClick(button);

      // Assert
      expect(onRetry).toHaveBeenCalledTimes(3);
    });

    it('should not break layout with all props undefined', () => {
      // Arrange & Act
      render(<ErrorState title={undefined} message={undefined} onRetry={undefined} />);

      // Assert
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
      expect(screen.getByText('Producto no encontrado')).toBeInTheDocument();
    });

    it('should render correctly with null onRetry callback', () => {
      // Arrange & Act
      render(<ErrorState onRetry={null as unknown as undefined} />);

      // Assert
      expect(screen.getByRole('button', { name: /buscar de nuevo|volver a buscar/i })).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('should render as a semantic section or article', () => {
      // Arrange & Act
      render(<ErrorState />);

      // Assert
      const errorState = screen.getByTestId('error-state');
      expect(errorState.tagName).toMatch(/(DIV|SECTION|ARTICLE)/);
    });

    it('should maintain consistent DOM structure', () => {
      // Arrange & Act
      const { container } = render(<ErrorState />);

      // Assert
      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
    });

    it('should render title, message, icon, and button in correct order', () => {
      // Arrange & Act
      const { container } = render(<ErrorState />);

      // Assert
      const html = container.innerHTML;
      const iconIndex = html.indexOf('error-icon');
      const titleIndex = html.indexOf('Producto no encontrado');
      const messageIndex = html.indexOf('Verifica el código');
      const buttonIndex = html.indexOf('buscar de nuevo') || html.indexOf('Volver a buscar');

      expect(iconIndex).toBeLessThan(titleIndex);
      expect(titleIndex).toBeLessThan(messageIndex);
      expect(messageIndex).toBeLessThan(buttonIndex);
    });
  });

  describe('Text Content Validation', () => {
    it('should display exact default Spanish title text', () => {
      // Arrange & Act
      render(<ErrorState />);

      // Assert
      expect(screen.getByText('Producto no encontrado')).toBeInTheDocument();
    });

    it('should display exact default Spanish message text', () => {
      // Arrange & Act
      render(<ErrorState />);

      // Assert
      expect(screen.getByText('Verifica el código e intenta de nuevo')).toBeInTheDocument();
    });

    it('should display Spanish retry button text', () => {
      // Arrange & Act
      render(<ErrorState />);

      // Assert
      const button = screen.getByRole('button');
      expect(button.textContent).toMatch(/buscar de nuevo|volver a buscar/i);
    });

    it('should not display any English text by default', () => {
      // Arrange & Act
      render(<ErrorState />);

      // Assert
      expect(screen.queryByText(/not found|try again|search again/i)).not.toBeInTheDocument();
    });
  });
});
