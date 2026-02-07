import "@testing-library/jest-dom";
import { vi, beforeEach, afterEach, type Mock } from "vitest";

// Mock next/navigation - define in global scope so tests can access
const mockPush = vi.fn();
const mockRouter = {
  push: mockPush,
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn(),
  refresh: vi.fn(),
};

// Type definitions for global mocks
interface MockRouter {
  push: Mock;
  replace: Mock;
  back: Mock;
  forward: Mock;
  prefetch: Mock;
  refresh: Mock;
}

// Export globally for test access
declare global {
  // eslint-disable-next-line no-var
  var mockPush: Mock;
  // eslint-disable-next-line no-var
  var mockRouter: MockRouter;
}

globalThis.mockPush = mockPush;
globalThis.mockRouter = mockRouter;

vi.mock("next/navigation", () => ({
  useRouter: () => globalThis.mockRouter,
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Reset mocks between tests
beforeEach(() => {
  mockPush.mockClear();
});

// Ensure timers are restored after each test to prevent pollution
afterEach(() => {
  vi.useRealTimers();
});
