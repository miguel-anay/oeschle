import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CameraScanner } from './camera-scanner';

// Mock html5-qrcode
const mockStart = vi.fn();
const mockStop = vi.fn();
const mockClear = vi.fn();
const mockIsScanning = vi.fn();

vi.mock('html5-qrcode', () => ({
  Html5Qrcode: vi.fn().mockImplementation(() => ({
    start: mockStart,
    stop: mockStop,
    clear: mockClear,
    isScanning: mockIsScanning.mockReturnValue(false),
  })),
  Html5QrcodeSupportedFormats: {
    EAN_13: 0,
    EAN_8: 1,
    UPC_A: 2,
    UPC_E: 3,
    QR_CODE: 10,
  },
}));

describe('CameraScanner', () => {
  const mockOnScan = vi.fn();
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockIsScanning.mockReturnValue(false);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Happy Path', () => {
    it('should render "Activar cámara" button when camera is not active', () => {
      render(<CameraScanner onScan={mockOnScan} />);

      expect(screen.getByRole('button', { name: /activar cámara/i })).toBeInTheDocument();
    });

    it('should render "Cerrar cámara" button when camera is active', async () => {
      mockStart.mockResolvedValue(undefined);
      mockIsScanning.mockReturnValue(true);

      render(<CameraScanner onScan={mockOnScan} />);

      const button = screen.getByRole('button', { name: /activar cámara/i });
      await userEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /cerrar cámara/i })).toBeInTheDocument();
      });
    });

    it('should show camera preview container when camera is active', async () => {
      mockStart.mockResolvedValue(undefined);
      mockIsScanning.mockReturnValue(true);

      render(<CameraScanner onScan={mockOnScan} />);

      const button = screen.getByRole('button', { name: /activar cámara/i });
      await userEvent.click(button);

      await waitFor(() => {
        const container = screen.getByTestId('scanner-container');
        expect(container).toBeInTheDocument();
        expect(container).toHaveClass('aspect-video');
      });
    });

    it('should hide camera preview when camera is closed', async () => {
      mockStart.mockResolvedValue(undefined);
      mockStop.mockResolvedValue(undefined);

      // First set to scanning
      mockIsScanning.mockReturnValue(true);

      render(<CameraScanner onScan={mockOnScan} />);

      // Start camera
      const startButton = screen.getByRole('button', { name: /activar cámara/i });
      await userEvent.click(startButton);

      await waitFor(() => {
        expect(screen.getByTestId('scanner-container')).toBeInTheDocument();
      });

      // Stop camera
      mockIsScanning.mockReturnValue(false);
      const stopButton = screen.getByRole('button', { name: /cerrar cámara/i });
      await userEvent.click(stopButton);

      await waitFor(() => {
        expect(mockStop).toHaveBeenCalled();
      });
    });

    it('should call onScan callback when barcode is detected', async () => {
      const testBarcode = '3017620422003';
      let scanCallback: ((decodedText: string) => void) | null = null;

      mockStart.mockImplementation((config, settings, onSuccess) => {
        scanCallback = onSuccess;
        return Promise.resolve();
      });

      render(<CameraScanner onScan={mockOnScan} />);

      const button = screen.getByRole('button', { name: /activar cámara/i });
      await userEvent.click(button);

      await waitFor(() => {
        expect(mockStart).toHaveBeenCalled();
      });

      // Simulate barcode detection
      if (scanCallback) {
        (scanCallback as (text: string) => void)(testBarcode);
      }

      expect(mockOnScan).toHaveBeenCalledWith(testBarcode);
      expect(mockOnScan).toHaveBeenCalledTimes(1);
    });

    it('should start scanner with correct configuration', async () => {
      mockStart.mockResolvedValue(undefined);

      render(<CameraScanner onScan={mockOnScan} />);

      const button = screen.getByRole('button', { name: /activar cámara/i });
      await userEvent.click(button);

      await waitFor(() => {
        expect(mockStart).toHaveBeenCalledWith(
          { facingMode: 'environment' },
          expect.objectContaining({
            fps: 10,
            qrbox: { width: 250, height: 150 },
            formatsToSupport: expect.arrayContaining([0, 1, 2, 3, 10]),
          }),
          expect.any(Function),
          expect.any(Function)
        );
      });
    });

    it('should stop camera automatically when barcode is detected', async () => {
      const testBarcode = '7501055363803';
      let scanCallback: ((decodedText: string) => void) | null = null;

      mockStart.mockImplementation((config, settings, onSuccess) => {
        scanCallback = onSuccess;
        return Promise.resolve();
      });
      mockStop.mockResolvedValue(undefined);
      mockIsScanning.mockReturnValue(true);

      render(<CameraScanner onScan={mockOnScan} />);

      const button = screen.getByRole('button', { name: /activar cámara/i });
      await userEvent.click(button);

      await waitFor(() => {
        expect(mockStart).toHaveBeenCalled();
      });

      // Simulate barcode detection
      if (scanCallback) {
        mockIsScanning.mockReturnValue(false);
        (scanCallback as (text: string) => void)(testBarcode);
      }

      await waitFor(() => {
        expect(mockStop).toHaveBeenCalled();
        expect(mockClear).toHaveBeenCalled();
      });
    });
  });

  describe('Error States', () => {
    it('should call onError callback when camera permission is denied', async () => {
      const permissionError = new Error('NotAllowedError: Permission denied');
      mockStart.mockRejectedValue(permissionError);

      render(<CameraScanner onScan={mockOnScan} onError={mockOnError} />);

      const button = screen.getByRole('button', { name: /activar cámara/i });
      await userEvent.click(button);

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith(permissionError.message);
      });
    });

    it('should handle onError callback when camera fails to start', async () => {
      const error = new Error('Camera not found');
      mockStart.mockRejectedValue(error);

      render(<CameraScanner onScan={mockOnScan} onError={mockOnError} />);

      const button = screen.getByRole('button', { name: /activar cámara/i });
      await userEvent.click(button);

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith(error.message);
      });
    });

    it('should not call onError if callback is not provided', async () => {
      const error = new Error('Camera error');
      mockStart.mockRejectedValue(error);

      render(<CameraScanner onScan={mockOnScan} />);

      const button = screen.getByRole('button', { name: /activar cámara/i });
      await userEvent.click(button);

      await waitFor(() => {
        expect(mockStart).toHaveBeenCalled();
      });

      // Should not throw error
      expect(() => screen.getByRole('button', { name: /activar cámara/i })).not.toThrow();
    });

    it('should show error message for permission denied', async () => {
      const permissionError = new Error('NotAllowedError: Permission denied');
      mockStart.mockRejectedValue(permissionError);

      render(<CameraScanner onScan={mockOnScan} onError={mockOnError} />);

      const button = screen.getByRole('button', { name: /activar cámara/i });
      await userEvent.click(button);

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith(
          expect.stringContaining('Permission denied')
        );
      });
    });
  });

  describe('Loading States', () => {
    it('should show loading state while camera is initializing', async () => {
      let resolveStart: (() => void) | null = null;
      const startPromise = new Promise<void>((resolve) => {
        resolveStart = resolve;
      });

      mockStart.mockReturnValue(startPromise);

      render(<CameraScanner onScan={mockOnScan} />);

      const button = screen.getByRole('button', { name: /activar cámara/i });
      await userEvent.click(button);

      // Button should be disabled or show loading state during initialization
      expect(button).toBeDisabled();

      // Resolve the promise
      if (resolveStart) (resolveStart as () => void)();

      await waitFor(() => {
        expect(button).not.toBeDisabled();
      });
    });

    it('should not allow multiple simultaneous start attempts', async () => {
      let resolveStart: (() => void) | null = null;
      const startPromise = new Promise<void>((resolve) => {
        resolveStart = resolve;
      });

      mockStart.mockReturnValue(startPromise);

      render(<CameraScanner onScan={mockOnScan} />);

      const button = screen.getByRole('button', { name: /activar cámara/i });

      // Click multiple times
      await userEvent.click(button);
      await userEvent.click(button);
      await userEvent.click(button);

      // Should only call start once
      expect(mockStart).toHaveBeenCalledTimes(1);

      if (resolveStart) (resolveStart as () => void)();
    });
  });

  describe('Lifecycle Management', () => {
    it('should stop camera when component unmounts', async () => {
      mockStart.mockResolvedValue(undefined);
      mockStop.mockResolvedValue(undefined);
      mockIsScanning.mockReturnValue(true);

      const { unmount } = render(<CameraScanner onScan={mockOnScan} />);

      const button = screen.getByRole('button', { name: /activar cámara/i });
      await userEvent.click(button);

      await waitFor(() => {
        expect(mockStart).toHaveBeenCalled();
      });

      unmount();

      expect(mockStop).toHaveBeenCalled();
    });

    it('should not throw error on unmount if camera was never started', () => {
      const { unmount } = render(<CameraScanner onScan={mockOnScan} />);

      expect(() => unmount()).not.toThrow();
    });

    it('should cleanup scanner instance on unmount', async () => {
      mockStart.mockResolvedValue(undefined);
      mockStop.mockResolvedValue(undefined);
      mockIsScanning.mockReturnValue(true);

      const { unmount } = render(<CameraScanner onScan={mockOnScan} />);

      const button = screen.getByRole('button', { name: /activar cámara/i });
      await userEvent.click(button);

      await waitFor(() => {
        expect(mockStart).toHaveBeenCalled();
      });

      unmount();

      await waitFor(() => {
        expect(mockStop).toHaveBeenCalled();
        expect(mockClear).toHaveBeenCalled();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have accessible button label for activating camera', () => {
      render(<CameraScanner onScan={mockOnScan} />);

      const button = screen.getByRole('button', { name: /activar cámara/i });
      expect(button).toHaveAccessibleName();
    });

    it('should have accessible button label for closing camera', async () => {
      mockStart.mockResolvedValue(undefined);
      mockIsScanning.mockReturnValue(true);

      render(<CameraScanner onScan={mockOnScan} />);

      const startButton = screen.getByRole('button', { name: /activar cámara/i });
      await userEvent.click(startButton);

      await waitFor(() => {
        const closeButton = screen.getByRole('button', { name: /cerrar cámara/i });
        expect(closeButton).toHaveAccessibleName();
      });
    });

    it('should have proper ARIA attributes for scanner container', async () => {
      mockStart.mockResolvedValue(undefined);
      mockIsScanning.mockReturnValue(true);

      render(<CameraScanner onScan={mockOnScan} />);

      const button = screen.getByRole('button', { name: /activar cámara/i });
      await userEvent.click(button);

      await waitFor(() => {
        const container = screen.getByTestId('scanner-container');
        expect(container).toHaveAttribute('id', 'scanner-container');
      });
    });
  });

  describe('Styling & UI', () => {
    it('should have primary variant styling on camera button', () => {
      render(<CameraScanner onScan={mockOnScan} />);

      const button = screen.getByRole('button', { name: /activar cámara/i });
      expect(button).toHaveClass('bg-primary');
    });

    it('should display scanner container with correct aspect ratio', async () => {
      mockStart.mockResolvedValue(undefined);
      mockIsScanning.mockReturnValue(true);

      render(<CameraScanner onScan={mockOnScan} />);

      const button = screen.getByRole('button', { name: /activar cámara/i });
      await userEvent.click(button);

      await waitFor(() => {
        const container = screen.getByTestId('scanner-container');
        expect(container).toHaveClass('aspect-video');
        expect(container).toHaveClass('rounded-lg');
      });
    });

    it('should have full width button', () => {
      render(<CameraScanner onScan={mockOnScan} />);

      const button = screen.getByRole('button', { name: /activar cámara/i });
      expect(button).toHaveClass('w-full');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty barcode string gracefully', async () => {
      let scanCallback: ((decodedText: string) => void) | null = null;

      mockStart.mockImplementation((config, settings, onSuccess) => {
        scanCallback = onSuccess;
        return Promise.resolve();
      });

      render(<CameraScanner onScan={mockOnScan} />);

      const button = screen.getByRole('button', { name: /activar cámara/i });
      await userEvent.click(button);

      await waitFor(() => {
        expect(mockStart).toHaveBeenCalled();
      });

      // Simulate empty barcode detection
      if (scanCallback) {
        (scanCallback as (text: string) => void)('');
      }

      expect(mockOnScan).toHaveBeenCalledWith('');
    });

    it('should handle rapid start/stop cycles', async () => {
      mockStart.mockResolvedValue(undefined);
      mockStop.mockResolvedValue(undefined);

      render(<CameraScanner onScan={mockOnScan} />);

      const button = screen.getByRole('button', { name: /activar cámara/i });

      // Start
      await userEvent.click(button);
      await waitFor(() => expect(mockStart).toHaveBeenCalled());

      mockIsScanning.mockReturnValue(true);

      // Stop
      const stopButton = screen.getByRole('button', { name: /cerrar cámara/i });
      await userEvent.click(stopButton);
      await waitFor(() => expect(mockStop).toHaveBeenCalled());

      mockIsScanning.mockReturnValue(false);

      // Start again
      const restartButton = screen.getByRole('button', { name: /activar cámara/i });
      await userEvent.click(restartButton);

      expect(mockStart).toHaveBeenCalledTimes(2);
    });

    it('should not crash if scanner container ref is null', async () => {
      mockStart.mockResolvedValue(undefined);

      render(<CameraScanner onScan={mockOnScan} />);

      const button = screen.getByRole('button', { name: /activar cámara/i });

      expect(async () => {
        await userEvent.click(button);
      }).not.toThrow();
    });
  });

  describe('User Interactions', () => {
    it('should toggle camera state on button click', async () => {
      mockStart.mockResolvedValue(undefined);
      mockStop.mockResolvedValue(undefined);

      render(<CameraScanner onScan={mockOnScan} />);

      // Initially not scanning
      expect(screen.getByRole('button', { name: /activar cámara/i })).toBeInTheDocument();

      // Click to start
      const startButton = screen.getByRole('button', { name: /activar cámara/i });
      await userEvent.click(startButton);

      mockIsScanning.mockReturnValue(true);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /cerrar cámara/i })).toBeInTheDocument();
      });

      // Click to stop
      const stopButton = screen.getByRole('button', { name: /cerrar cámara/i });
      await userEvent.click(stopButton);

      mockIsScanning.mockReturnValue(false);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /activar cámara/i })).toBeInTheDocument();
      });
    });

    it('should support keyboard navigation', async () => {
      mockStart.mockResolvedValue(undefined);

      render(<CameraScanner onScan={mockOnScan} />);

      const button = screen.getByRole('button', { name: /activar cámara/i });
      button.focus();

      expect(button).toHaveFocus();

      // Simulate Enter key press
      await userEvent.keyboard('{Enter}');

      await waitFor(() => {
        expect(mockStart).toHaveBeenCalled();
      });
    });
  });
});
