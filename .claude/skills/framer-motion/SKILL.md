---
name: framer-motion
description: >
  Framer Motion (Motion) animation patterns for React.
  Trigger: When adding animations, transitions, or motion effects with Framer Motion/Motion library.
license: Apache-2.0
metadata:
  author: barcode-scanner
  version: "1.0"
  scope: [root]
  auto_invoke: "Adding animations with Framer Motion"
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch, Task
---

## When to Use

- Adding enter/exit animations
- Animating layout changes
- Creating micro-interactions
- Building loading states and transitions
- Gesture-based animations (drag, tap, hover)

## Critical Patterns

### Basic Animation

```typescript
"use client";

import { motion } from "framer-motion";

export function FadeIn({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
```

### Exit Animations (AnimatePresence)

```typescript
"use client";

import { AnimatePresence, motion } from "framer-motion";

interface ProductCardProps {
  product: Product | null;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <AnimatePresence mode="wait">
      {product && (
        <motion.div
          key={product.code}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="card"
        >
          {/* content */}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### Variants Pattern (Staggered Children)

```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function HistoryList({ items }: { items: SearchHistoryItem[] }) {
  return (
    <motion.ul
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-2"
    >
      {items.map((item) => (
        <motion.li key={item.code} variants={itemVariants}>
          <HistoryItem item={item} />
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

### Loading Skeleton Animation

```typescript
export function ProductSkeleton() {
  return (
    <div className="space-y-4">
      <motion.div
        className="h-48 bg-slate-200 rounded-lg"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <motion.div
        className="h-6 bg-slate-200 rounded w-3/4"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
      />
    </div>
  );
}
```

### Layout Animations

```typescript
export function ExpandableCard({ isExpanded }: { isExpanded: boolean }) {
  return (
    <motion.div
      layout
      className="card"
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <motion.h2 layout="position">Title</motion.h2>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            Expanded content
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
```

### Gesture Animations

```typescript
export function InteractiveButton({ children }: { children: React.ReactNode }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400 }}
      className="btn-primary"
    >
      {children}
    </motion.button>
  );
}
```

### Page Transitions

```typescript
// app/template.tsx
"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
```

### Accessibility (prefers-reduced-motion)

```typescript
"use client";

import { motion, useReducedMotion } from "framer-motion";

export function AccessibleFadeIn({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
    >
      {children}
    </motion.div>
  );
}
```

## Duration Guidelines

| Animation Type | Duration |
|---------------|----------|
| Micro (hover, tap) | 100-150ms |
| UI feedback | 150-250ms |
| Entrance | 200-300ms |
| Exit | 150-200ms |
| Page transition | 300-400ms |

## Best Practices

```typescript
// ✅ Use springs for natural feel
transition={{ type: "spring", stiffness: 300, damping: 30 }}

// ✅ Animate transform/opacity only (GPU accelerated)
animate={{ opacity: 1, x: 0, scale: 1 }}

// ✅ Use layout prop for smooth resizing
<motion.div layout>

// ✅ Key AnimatePresence children
<AnimatePresence>
  {items.map(item => <motion.div key={item.id} />)}
</AnimatePresence>

// ❌ NEVER animate width/height directly (use layout instead)
animate={{ width: 200, height: 100 }}  // Bad

// ❌ NEVER use long durations for UI feedback
transition={{ duration: 2 }}  // Too slow!
```

## Commands

```bash
# Install (Motion is the new name, framer-motion still works)
pnpm add framer-motion

# Or the new package name
pnpm add motion
```

## Import Patterns

```typescript
// Standard import
import { motion, AnimatePresence } from "framer-motion";

// Hooks
import {
  useAnimation,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform
} from "framer-motion";
```
