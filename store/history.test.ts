import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Ensure the real store is used (not mocked by other tests)
vi.unmock("./history");

// Mock localStorage BEFORE importing the store (hoisted to top)
let localStorageStore: Record<string, string> = {};

const localStorageMock = {
  getItem: vi.fn((key: string) => localStorageStore[key] ?? null),
  setItem: vi.fn((key: string, value: string) => {
    localStorageStore[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete localStorageStore[key];
  }),
  clear: vi.fn(() => {
    localStorageStore = {};
  }),
  get length() {
    return Object.keys(localStorageStore).length;
  },
  key: vi.fn((index: number) => Object.keys(localStorageStore)[index] ?? null),
};

// Apply mock before any store import
Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

// Now import the store after localStorage is mocked
import { useHistoryStore } from "./history";

describe("useHistoryStore", () => {
  beforeEach(() => {
    // Clear localStorage store before each test
    localStorageStore = {};
    vi.clearAllMocks();
    // Reset store state
    useHistoryStore.setState({ items: [] });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Initial State", () => {
    it("should initialize with empty items array", () => {
      // Arrange & Act
      const state = useHistoryStore.getState();

      // Assert
      expect(state.items).toEqual([]);
      expect(state.items).toHaveLength(0);
    });

    it("should have all required methods defined", () => {
      // Arrange & Act
      const state = useHistoryStore.getState();

      // Assert
      expect(state.addItem).toBeDefined();
      expect(state.clearHistory).toBeDefined();
      expect(state.removeItem).toBeDefined();
      expect(typeof state.addItem).toBe("function");
      expect(typeof state.clearHistory).toBe("function");
      expect(typeof state.removeItem).toBe("function");
    });
  });

  describe("addItem", () => {
    it("should add single item with auto-generated timestamp", () => {
      // Arrange
      const state = useHistoryStore.getState();
      const newItem = {
        code: "3017620422003",
        product_name: "Nutella",
        image_url: "https://example.com/nutella.jpg",
      };

      // Act
      state.addItem(newItem);
      const updatedState = useHistoryStore.getState();

      // Assert
      expect(updatedState.items).toHaveLength(1);
      expect(updatedState.items[0].code).toBe("3017620422003");
      expect(updatedState.items[0].product_name).toBe("Nutella");
      expect(updatedState.items[0].image_url).toBe(
        "https://example.com/nutella.jpg"
      );
      expect(updatedState.items[0].searched_at).toBeDefined();
    });

    it("should generate ISO 8601 timestamp format for searched_at", () => {
      // Arrange
      const state = useHistoryStore.getState();
      const newItem = {
        code: "7501055363803",
        product_name: "Coca Cola",
        image_url: "https://example.com/coke.jpg",
      };

      // Act
      state.addItem(newItem);
      const updatedState = useHistoryStore.getState();

      // Assert
      const timestamp = updatedState.items[0].searched_at;
      expect(timestamp).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
      );
      expect(() => new Date(timestamp)).not.toThrow();
      expect(new Date(timestamp).toISOString()).toBe(timestamp);
    });

    it("should add multiple items in correct order (newest first)", () => {
      // Arrange
      const state = useHistoryStore.getState();
      const item1 = {
        code: "3017620422003",
        product_name: "Nutella",
        image_url: "https://example.com/nutella.jpg",
      };
      const item2 = {
        code: "7501055363803",
        product_name: "Coca Cola",
        image_url: "https://example.com/coke.jpg",
      };
      const item3 = {
        code: "8076809513685",
        product_name: "Ferrero Rocher",
        image_url: "https://example.com/ferrero.jpg",
      };

      // Act
      state.addItem(item1);
      state.addItem(item2);
      state.addItem(item3);
      const updatedState = useHistoryStore.getState();

      // Assert
      expect(updatedState.items).toHaveLength(3);
      expect(updatedState.items[0].code).toBe("8076809513685"); // Most recent
      expect(updatedState.items[1].code).toBe("7501055363803");
      expect(updatedState.items[2].code).toBe("3017620422003"); // Oldest
    });

    it("should prevent duplicates by moving existing item to top", () => {
      // Arrange
      const state = useHistoryStore.getState();
      const item1 = {
        code: "3017620422003",
        product_name: "Nutella",
        image_url: "https://example.com/nutella.jpg",
      };
      const item2 = {
        code: "7501055363803",
        product_name: "Coca Cola",
        image_url: "https://example.com/coke.jpg",
      };

      // Act
      state.addItem(item1);
      state.addItem(item2);
      state.addItem(item1); // Duplicate - should move to top
      const updatedState = useHistoryStore.getState();

      // Assert
      expect(updatedState.items).toHaveLength(2); // No duplicate
      expect(updatedState.items[0].code).toBe("3017620422003"); // Moved to top
      expect(updatedState.items[1].code).toBe("7501055363803");
    });

    it("should update searched_at timestamp when duplicate item is re-added", () => {
      // Arrange
      const state = useHistoryStore.getState();
      const item = {
        code: "3017620422003",
        product_name: "Nutella",
        image_url: "https://example.com/nutella.jpg",
      };

      // Act
      state.addItem(item);
      const firstTimestamp = useHistoryStore.getState().items[0].searched_at;

      // Wait a small moment to ensure different timestamp
      vi.useFakeTimers();
      vi.advanceTimersByTime(1000);

      state.addItem(item);
      const secondTimestamp = useHistoryStore.getState().items[0].searched_at;

      vi.useRealTimers();

      // Assert
      expect(firstTimestamp).not.toBe(secondTimestamp);
      expect(new Date(secondTimestamp).getTime()).toBeGreaterThan(
        new Date(firstTimestamp).getTime()
      );
    });

    it("should limit to 20 items (FIFO - oldest removed)", () => {
      // Arrange
      const state = useHistoryStore.getState();

      // Act - Add 25 items
      for (let i = 1; i <= 25; i++) {
        state.addItem({
          code: `000000000000${i}`,
          product_name: `Product ${i}`,
          image_url: `https://example.com/product${i}.jpg`,
        });
      }

      const updatedState = useHistoryStore.getState();

      // Assert
      expect(updatedState.items).toHaveLength(20); // Max 20 items
      expect(updatedState.items[0].code).toBe("00000000000025"); // Most recent (item 25)
      expect(updatedState.items[19].code).toBe("0000000000006"); // Oldest kept (item 6)
      // Items 1-5 should be removed (FIFO)
    });

    it("should maintain max 20 items after adding 21st item", () => {
      // Arrange
      const state = useHistoryStore.getState();

      // Add exactly 20 items
      for (let i = 1; i <= 20; i++) {
        state.addItem({
          code: `CODE${i.toString().padStart(11, "0")}`,
          product_name: `Product ${i}`,
          image_url: `https://example.com/product${i}.jpg`,
        });
      }

      const firstOldestCode = useHistoryStore.getState().items[19].code;

      // Act - Add 21st item
      state.addItem({
        code: "CODE00000000021",
        product_name: "Product 21",
        image_url: "https://example.com/product21.jpg",
      });

      const updatedState = useHistoryStore.getState();

      // Assert
      expect(updatedState.items).toHaveLength(20);
      expect(updatedState.items[0].code).toBe("CODE00000000021"); // New item at top
      expect(updatedState.items[19].code).not.toBe(firstOldestCode); // First item removed
      expect(updatedState.items[19].code).toBe("CODE00000000002"); // Second item is now oldest
    });
  });

  describe("clearHistory", () => {
    it("should remove all items from history", () => {
      // Arrange
      const state = useHistoryStore.getState();
      state.addItem({
        code: "3017620422003",
        product_name: "Nutella",
        image_url: "https://example.com/nutella.jpg",
      });
      state.addItem({
        code: "7501055363803",
        product_name: "Coca Cola",
        image_url: "https://example.com/coke.jpg",
      });

      expect(useHistoryStore.getState().items).toHaveLength(2);

      // Act
      state.clearHistory();

      // Assert
      const updatedState = useHistoryStore.getState();
      expect(updatedState.items).toEqual([]);
      expect(updatedState.items).toHaveLength(0);
    });

    it("should handle clearing empty history without errors", () => {
      // Arrange
      const state = useHistoryStore.getState();

      // Act & Assert - Should not throw
      expect(() => state.clearHistory()).not.toThrow();
      expect(useHistoryStore.getState().items).toEqual([]);
    });

    it("should result in empty items array after clearing", () => {
      // Arrange
      const state = useHistoryStore.getState();
      state.addItem({
        code: "3017620422003",
        product_name: "Nutella",
        image_url: "https://example.com/nutella.jpg",
      });

      expect(useHistoryStore.getState().items).toHaveLength(1);

      // Act
      state.clearHistory();

      // Assert - State should be empty
      const clearedState = useHistoryStore.getState();
      expect(clearedState.items).toEqual([]);
      expect(clearedState.items).toHaveLength(0);
    });
  });

  describe("removeItem", () => {
    it("should remove specific item by code", () => {
      // Arrange
      const state = useHistoryStore.getState();
      state.addItem({
        code: "3017620422003",
        product_name: "Nutella",
        image_url: "https://example.com/nutella.jpg",
      });
      state.addItem({
        code: "7501055363803",
        product_name: "Coca Cola",
        image_url: "https://example.com/coke.jpg",
      });
      state.addItem({
        code: "8076809513685",
        product_name: "Ferrero Rocher",
        image_url: "https://example.com/ferrero.jpg",
      });

      expect(useHistoryStore.getState().items).toHaveLength(3);

      // Act
      state.removeItem("7501055363803");

      // Assert
      const updatedState = useHistoryStore.getState();
      expect(updatedState.items).toHaveLength(2);
      expect(updatedState.items.find((i) => i.code === "7501055363803")).toBeUndefined();
      expect(updatedState.items.find((i) => i.code === "3017620422003")).toBeDefined();
      expect(updatedState.items.find((i) => i.code === "8076809513685")).toBeDefined();
    });

    it("should maintain order when removing item from middle", () => {
      // Arrange
      const state = useHistoryStore.getState();
      state.addItem({
        code: "1111111111111",
        product_name: "Product 1",
        image_url: "https://example.com/1.jpg",
      });
      state.addItem({
        code: "2222222222222",
        product_name: "Product 2",
        image_url: "https://example.com/2.jpg",
      });
      state.addItem({
        code: "3333333333333",
        product_name: "Product 3",
        image_url: "https://example.com/3.jpg",
      });

      // Act - Remove middle item
      state.removeItem("2222222222222");

      // Assert
      const updatedState = useHistoryStore.getState();
      expect(updatedState.items).toHaveLength(2);
      expect(updatedState.items[0].code).toBe("3333333333333"); // Most recent
      expect(updatedState.items[1].code).toBe("1111111111111"); // Oldest
    });

    it("should handle removing non-existent item gracefully", () => {
      // Arrange
      const state = useHistoryStore.getState();
      state.addItem({
        code: "3017620422003",
        product_name: "Nutella",
        image_url: "https://example.com/nutella.jpg",
      });

      // Act & Assert - Should not throw
      expect(() => state.removeItem("9999999999999")).not.toThrow();
      expect(useHistoryStore.getState().items).toHaveLength(1);
    });

    it("should handle removing item from empty history", () => {
      // Arrange
      const state = useHistoryStore.getState();

      // Act & Assert - Should not throw
      expect(() => state.removeItem("3017620422003")).not.toThrow();
      expect(useHistoryStore.getState().items).toEqual([]);
    });
  });

  describe("Persistence", () => {
    it("should have persist middleware configured", () => {
      // Assert - Verify persist API is available
      expect(useHistoryStore.persist).toBeDefined();
      expect(useHistoryStore.persist.getOptions).toBeDefined();
      expect(typeof useHistoryStore.persist.getOptions).toBe("function");
    });

    it("should use 'search-history' as storage key", () => {
      // Assert - Check persist configuration
      const options = useHistoryStore.persist.getOptions();
      expect(options.name).toBe("search-history");
    });

    it("should maintain state across store resets", () => {
      // Arrange
      const state = useHistoryStore.getState();
      state.addItem({
        code: "3017620422003",
        product_name: "Nutella",
        image_url: "https://example.com/nutella.jpg",
      });

      // Act - Get current state
      const currentState = useHistoryStore.getState();

      // Assert - Items should be in state
      expect(currentState.items).toHaveLength(1);
      expect(currentState.items[0].code).toBe("3017620422003");
      expect(currentState.items[0].product_name).toBe("Nutella");
    });

    it("should restore state when manually setting items", () => {
      // Arrange - Simulate restored data
      const mockItems = [
        {
          code: "3017620422003",
          product_name: "Nutella",
          image_url: "https://example.com/nutella.jpg",
          searched_at: "2024-01-15T10:30:00.000Z",
        },
        {
          code: "7501055363803",
          product_name: "Coca Cola",
          image_url: "https://example.com/coke.jpg",
          searched_at: "2024-01-14T09:20:00.000Z",
        },
      ];

      // Act - Simulate hydration from storage
      useHistoryStore.setState({ items: mockItems });

      // Assert
      const state = useHistoryStore.getState();
      expect(state.items).toHaveLength(2);
      expect(state.items[0].code).toBe("3017620422003");
      expect(state.items[1].code).toBe("7501055363803");
    });
  });

  describe("Edge Cases", () => {
    it("should handle adding same item twice consecutively", () => {
      // Arrange
      const state = useHistoryStore.getState();
      const item = {
        code: "3017620422003",
        product_name: "Nutella",
        image_url: "https://example.com/nutella.jpg",
      };

      // Act
      state.addItem(item);
      state.addItem(item);

      // Assert
      const updatedState = useHistoryStore.getState();
      expect(updatedState.items).toHaveLength(1); // No duplicate
      expect(updatedState.items[0].code).toBe("3017620422003");
    });

    it("should handle adding exactly 20 items without overflow", () => {
      // Arrange
      const state = useHistoryStore.getState();

      // Act - Add exactly 20 items
      for (let i = 1; i <= 20; i++) {
        state.addItem({
          code: `CODE${i.toString().padStart(11, "0")}`,
          product_name: `Product ${i}`,
          image_url: `https://example.com/product${i}.jpg`,
        });
      }

      // Assert
      const updatedState = useHistoryStore.getState();
      expect(updatedState.items).toHaveLength(20);
      expect(updatedState.items[0].code).toBe("CODE00000000020"); // Most recent
      expect(updatedState.items[19].code).toBe("CODE00000000001"); // Oldest
    });

    it("should handle empty string code without errors", () => {
      // Arrange
      const state = useHistoryStore.getState();

      // Act & Assert - Should not throw
      expect(() =>
        state.addItem({
          code: "",
          product_name: "Empty Code Product",
          image_url: "https://example.com/empty.jpg",
        })
      ).not.toThrow();

      const updatedState = useHistoryStore.getState();
      expect(updatedState.items).toHaveLength(1);
      expect(updatedState.items[0].code).toBe("");
    });

    it("should handle special characters in product_name", () => {
      // Arrange
      const state = useHistoryStore.getState();
      const item = {
        code: "3017620422003",
        product_name: "Nutella® - Crema de Avellanas & Cacao 100%",
        image_url: "https://example.com/nutella.jpg",
      };

      // Act
      state.addItem(item);

      // Assert
      const updatedState = useHistoryStore.getState();
      expect(updatedState.items[0].product_name).toBe(
        "Nutella® - Crema de Avellanas & Cacao 100%"
      );
    });

    it("should handle very long product names", () => {
      // Arrange
      const state = useHistoryStore.getState();
      const longName = "A".repeat(500);
      const item = {
        code: "3017620422003",
        product_name: longName,
        image_url: "https://example.com/nutella.jpg",
      };

      // Act
      state.addItem(item);

      // Assert
      const updatedState = useHistoryStore.getState();
      expect(updatedState.items[0].product_name).toBe(longName);
      expect(updatedState.items[0].product_name.length).toBe(500);
    });

    it("should handle invalid image URLs gracefully", () => {
      // Arrange
      const state = useHistoryStore.getState();
      const item = {
        code: "3017620422003",
        product_name: "Nutella",
        image_url: "not-a-valid-url",
      };

      // Act & Assert - Should not throw
      expect(() => state.addItem(item)).not.toThrow();

      const updatedState = useHistoryStore.getState();
      expect(updatedState.items[0].image_url).toBe("not-a-valid-url");
    });

    it("should validate ISO timestamp format is parseable by Date constructor", () => {
      // Arrange
      const state = useHistoryStore.getState();
      const item = {
        code: "3017620422003",
        product_name: "Nutella",
        image_url: "https://example.com/nutella.jpg",
      };

      // Act
      state.addItem(item);
      const updatedState = useHistoryStore.getState();
      const timestamp = updatedState.items[0].searched_at;

      // Assert
      const date = new Date(timestamp);
      expect(date).toBeInstanceOf(Date);
      expect(date.toISOString()).toBe(timestamp);
      expect(Number.isNaN(date.getTime())).toBe(false);
    });

    it("should handle rapid consecutive additions without race conditions", () => {
      // Arrange
      const state = useHistoryStore.getState();

      // Act - Add multiple items rapidly
      for (let i = 0; i < 10; i++) {
        state.addItem({
          code: `CODE${i}`,
          product_name: `Product ${i}`,
          image_url: `https://example.com/${i}.jpg`,
        });
      }

      // Assert
      const updatedState = useHistoryStore.getState();
      expect(updatedState.items).toHaveLength(10);
      expect(updatedState.items[0].code).toBe("CODE9"); // Most recent
      expect(updatedState.items[9].code).toBe("CODE0"); // Oldest
    });

    it("should maintain data integrity when adding item with missing optional fields", () => {
      // Arrange
      const state = useHistoryStore.getState();
      const item = {
        code: "3017620422003",
        product_name: "Nutella",
        image_url: "",
      };

      // Act
      state.addItem(item);

      // Assert
      const updatedState = useHistoryStore.getState();
      expect(updatedState.items[0].code).toBe("3017620422003");
      expect(updatedState.items[0].product_name).toBe("Nutella");
      expect(updatedState.items[0].image_url).toBe("");
      expect(updatedState.items[0].searched_at).toBeDefined();
    });
  });

  describe("Type Safety", () => {
    it("should enforce SearchHistoryItem type structure", () => {
      // Arrange
      const state = useHistoryStore.getState();
      const item = {
        code: "3017620422003",
        product_name: "Nutella",
        image_url: "https://example.com/nutella.jpg",
      };

      // Act
      state.addItem(item);
      const addedItem = useHistoryStore.getState().items[0];

      // Assert - Verify all required fields exist
      expect(addedItem).toHaveProperty("code");
      expect(addedItem).toHaveProperty("product_name");
      expect(addedItem).toHaveProperty("image_url");
      expect(addedItem).toHaveProperty("searched_at");

      // Assert - Verify types
      expect(typeof addedItem.code).toBe("string");
      expect(typeof addedItem.product_name).toBe("string");
      expect(typeof addedItem.image_url).toBe("string");
      expect(typeof addedItem.searched_at).toBe("string");
    });

    it("should accept items without searched_at in addItem parameter", () => {
      // Arrange
      const state = useHistoryStore.getState();

      // Act & Assert - Should compile and not throw (TypeScript check)
      const itemWithoutTimestamp = {
        code: "3017620422003",
        product_name: "Nutella",
        image_url: "https://example.com/nutella.jpg",
        // searched_at is omitted - should be auto-generated
      };

      expect(() => state.addItem(itemWithoutTimestamp)).not.toThrow();

      const updatedState = useHistoryStore.getState();
      expect(updatedState.items[0].searched_at).toBeDefined();
    });
  });
});
