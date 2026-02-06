# Barcode Scanner App - AI Agent Ruleset
@PROJECT_SPECS.md contains all user stories and requirements

> **Skills Reference**: For detailed patterns, use these skills:
> - [`typescript`](/.claude/skills/typescript/SKILL.md) - Const types, flat interfaces
> - [`react-19`](/.claude/skills/react-19/SKILL.md) - No useMemo/useCallback, compiler
> - [`nextjs-15`](/.claude/skills/nextjs-15/SKILL.md) - App Router, Server Actions
> - [`tailwind-4`](/.claude/skills/tailwind-4/SKILL.md) - cn() utility, no var() in className
> - [`zod-4`](/.claude/skills/zod-4/SKILL.md) - New API (z.email(), z.uuid())
> - [`zustand-5`](/.claude/skills/zustand-5/SKILL.md) - Selectors, persist middleware
> - [`vitest`](/.claude/skills/vitest/SKILL.md) - Unit testing with React Testing Library
> - [`html5-qrcode`](/.claude/skills/html5-qrcode/SKILL.md) - Camera barcode scanning
> - [`framer-motion`](/.claude/skills/framer-motion/SKILL.md) - Animations and transitions
> - [`react-query`](/.claude/skills/react-query/SKILL.md) - TanStack Query v5 data fetching
> - [`react-testing-library`](/.claude/skills/react-testing-library/SKILL.md) - Queries, userEvent, waitFor, within

### Auto-invoke Skills

When performing these actions, ALWAYS invoke the corresponding skill FIRST:

| Action | Skill |
|--------|-------|
| App Router / Server Actions | `nextjs-15` |
| Creating Zod schemas | `zod-4` |
| Using Zustand stores | `zustand-5` |
| Working with Tailwind classes | `tailwind-4` |
| Writing React components | `react-19` |
| Writing TypeScript types/interfaces | `typescript` |
| Writing Vitest unit tests | `vitest` |
| Writing component tests with @testing-library/react | `react-testing-library` |
| Implementing camera scanner | `html5-qrcode` |
| Adding animations/transitions | `framer-motion` |
| Using React Query for data fetching | `react-query` |

---

## FUNCIONALIDADES REQUERIDAS

### 1. Input de Código de Barras
- Campo para ingresar código manualmente (6-13 dígitos)
- Validación de formato
- Botón de búsqueda
- **BONUS**: Scanner con cámara real (getUserMedia API)

### 2. Consulta y Visualización de Producto
- Fetch desde: `https://world.openfoodfacts.org/api/v0/product/[BARCODE].json`
- Mostrar: imagen, nombre, marca, precio simulado (S/. 5-150), categoría
- Loading state mientras consulta
- Error state si producto no existe
- Interfaz limpia y profesional

### 3. Historial de Búsquedas
- Guardar últimas búsquedas (localStorage/IndexedDB)
- Mostrar lista de productos consultados
- Click en historial → ver detalle
- Opción de limpiar historial

### 4. UI/UX Mobile-First
- Responsive perfecto (mobile → tablet → desktop)
- Diseño moderno y limpio
- Estados visuales claros (loading, error, empty)
- Transiciones suaves

---

## CRITICAL RULES - NON-NEGOTIABLE

### React

- ALWAYS: `import { useState, useEffect } from "react"`
- NEVER: `import React`, `import * as React`, `import React as *`
- NEVER: `useMemo`, `useCallback` (React Compiler handles optimization)

### Types

- ALWAYS: `const X = { A: "a", B: "b" } as const; type T = typeof X[keyof typeof X]`
- NEVER: `type T = "a" | "b"`

### Interfaces

- ALWAYS: One level depth only; object property → dedicated interface (recursive)
- ALWAYS: Reuse via `extends`
- NEVER: Inline nested objects

### Styling

- Single class: `className="bg-slate-800 text-white"`
- Merge multiple classes: `className={cn(BASE_STYLES, variant && "variant-class")}`
- Dynamic values: `style={{ width: "50%" }}`
- NEVER: `var()` in className, hex colors

### Scope Rule (ABSOLUTE)

- Used 2+ places → `lib/` or `types/` or `hooks/` (components go in `components/`)
- Used 1 place → keep local in feature directory
- This determines ALL folder structure decisions

---

## DECISION TREES

### Component Placement

```
New/Existing UI? → shadcn/ui + Tailwind
Used 1 feature? → features/{feature}/components | Used 2+? → components/
Needs state/hooks? → "use client" | Server component? → No directive
```

### Code Location

```
Server action → actions/{feature}.ts
Data transform → actions/{feature}.adapter.ts
Types (shared 2+) → types/{domain}.ts | Types (local 1) → {feature}/types.ts
Utils (shared 2+) → lib/ | Utils (local 1) → {feature}/utils/
Hooks (shared 2+) → hooks/ | Hooks (local 1) → {feature}/hooks.ts
shadcn components → components/ui/
```

---

## PATTERNS

### Product Interface

```typescript
interface ProductNutriments {
  energy_kcal_100g: number;
  proteins_100g: number;
  carbohydrates_100g: number;
  fat_100g: number;
}

interface Product {
  code: string;
  product_name: string;
  brands: string;
  image_url: string;
  categories: string;
  nutriments: ProductNutriments;
}

interface SearchHistoryItem {
  code: string;
  product_name: string;
  image_url: string;
  searched_at: string;
}
```

### API Fetch Pattern

```typescript
"use server";

const API_BASE = "https://world.openfoodfacts.org/api/v0/product";

export async function getProduct(barcode: string) {
  const res = await fetch(`${API_BASE}/${barcode}.json`);
  const data = await res.json();

  if (data.status !== 1) {
    throw new Error("Product not found");
  }

  return adaptProduct(data.product);
}
```

### Barcode Validation

```typescript
const BARCODE_REGEX = /^\d{6,13}$/;

export function isValidBarcode(code: string): boolean {
  return BARCODE_REGEX.test(code);
}
```

### Search History Hook (Zustand)

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface HistoryState {
  items: SearchHistoryItem[];
  addItem: (item: SearchHistoryItem) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => ({
          items: [item, ...state.items.filter((i) => i.code !== item.code)].slice(0, 20),
        })),
      clearHistory: () => set({ items: [] }),
    }),
    { name: "search-history" },
  ),
);
```

### Loading State Component

```typescript
export function ProductSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-48 bg-slate-200 rounded-lg" />
      <div className="h-6 bg-slate-200 rounded w-3/4" />
      <div className="h-4 bg-slate-200 rounded w-1/2" />
    </div>
  );
}
```

---

## TECH STACK

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Next.js | 14+ | App Router, Server Actions |
| React | 18+ | UI Components |
| TypeScript | 5+ | Type Safety |
| Tailwind CSS | 3.4+ | Styling |
| shadcn/ui | latest | UI Components |
| Zustand | 5+ | State Management (History) |
| React Query | 5+ | Data Fetching (opcional) |

### Bonus Stack (Opcional)

- `html5-qrcode` o `QuaggaJS` - Scanner con cámara
- `Framer Motion` - Animaciones
- `Vitest` + `React Testing Library` - Tests

---

## PROJECT STRUCTURE

```
barcode-scanner/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx              # Home - Search input
│   ├── product/
│   │   └── [barcode]/
│   │       └── page.tsx      # Product detail
│   └── history/
│       └── page.tsx          # Search history
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── barcode-input.tsx     # Input + validation
│   ├── product-card.tsx      # Product display
│   ├── product-skeleton.tsx  # Loading state
│   ├── history-list.tsx      # History items
│   └── camera-scanner.tsx    # BONUS: Camera scanner
├── actions/
│   ├── product.ts            # Server action: fetch product
│   └── product.adapter.ts    # Transform API response
├── hooks/
│   └── use-history.ts        # History hook (Zustand)
├── lib/
│   ├── utils.ts              # cn() utility
│   └── validators.ts         # Barcode validation
├── types/
│   └── product.ts            # Product interfaces
├── store/
│   └── history.ts            # Zustand store
└── public/
    └── ...                   # Static assets
```

---

## COMMANDS

```bash
# Instalación
pnpm install

# Desarrollo
pnpm run dev

# Type check
pnpm run typecheck

# Lint
pnpm run lint:fix

# Build
pnpm run build

# Deploy (Vercel)
vercel
```

---

## TEST BARCODES

| Código | Producto |
|--------|----------|
| 7501055363803 | Coca Cola |
| 7501000673209 | Sabritas Original |
| 7501055300006 | Gansito Marinela |
| 3017620422003 | Nutella |
| 5449000000996 | Coca Cola Light |
| 8076809513685 | Ferrero Rocher |
| 8480000570926 | Aceite de Oliva |
| 0016000119208 | M&M's Peanut |
| 6111242100992 | Perly |

> Más códigos: https://world.openfoodfacts.org/

---

## QA CHECKLIST BEFORE COMMIT

- [ ] `pnpm run typecheck` passes
- [ ] `pnpm run lint:fix` passes
- [ ] Mobile-first responsive verificado
- [ ] Todos los estados UI manejados (loading, error, empty)
- [ ] Historial funciona correctamente (guardar, mostrar, limpiar)
- [ ] Validación de código de barras funciona
- [ ] No secrets en código (usar `.env.local`)
- [ ] README.md completo con screenshots

---

## EVALUATION CRITERIA

| Criterio | Peso |
|----------|------|
| Limpieza y organización del código | 30% |
| Presentación visual (UI/UX) | 30% |
| Funcionalidad completa | 25% |
| Performance y optimización | 10% |
| README y documentación | 5% |

---

## DELIVERABLES

1. **Repositorio GitHub público** con código limpio y README completo
2. **Aplicación desplegada** en Vercel/Netlify
3. **Commits descriptivos** mostrando proceso de desarrollo

---

## TIPS

- **Mobile-first es CRÍTICO** - desarrolla primero para móvil
- **Funcionalidad > Perfección** - mejor funcional que bonito pero roto
- **Commits frecuentes** - muestra tu proceso de desarrollo
- **README importa** - demuestra profesionalismo
- **Despliega temprano** - deploy y luego itera
- **Código limpio > Código complejo** - preferimos simplicidad

---

## TDD DEVELOPMENT WORKFLOW

> **Agents Reference**: For specialized tasks, use these agents:
> - [`nextjs-architect`](/.claude/agents/nextjs-architect.md) - Structure & file placement decisions
> - [`react-patterns-expert`](/.claude/agents/react-patterns-expert.md) - React patterns & performance
> - [`tdd-specialist`](/.claude/agents/tdd-specialist.md) - Test-first development
> - [`implementation-specialist`](/.claude/agents/implementation-specialist.md) - Code implementation
> - [`security-auditor`](/.claude/agents/security-auditor.md) - Security review
> - [`git-commit-specialist`](/.claude/agents/git-commit-specialist.md) - Git workflow & commits

### Phase 1: Architecture & Planning

| Step | Agent | When to Use |
|------|-------|-------------|
| 1 | `nextjs-architect` | Design folder structure for new features |
| 2 | `react-patterns-expert` | Complex architectural decisions |
| 3 | `git-commit-specialist` | Commit after architecture defined |

### Phase 2: Test-Driven Development (RED → GREEN)

| Step | Agent | When to Use |
|------|-------|-------------|
| 4 | `tdd-specialist` | Write failing tests FIRST |
| 5 | `git-commit-specialist` | Commit RED phase (tests fail) |
| 6 | `implementation-specialist` | Implement until tests pass |
| 7 | `git-commit-specialist` | Commit GREEN phase (tests pass) |

### Phase 3: Quality & Security

| Step | Agent | When to Use |
|------|-------|-------------|
| 8 | `security-auditor` | Audit before merge to main |
| 9 | `git-commit-specialist` | Commit security fixes |

---

## GIT COMMIT STRATEGY

### Commit Message Format (NO Claude mentions)

```
feat: add [feature] architecture       # After Phase 1
test: add [feature] tests (RED)        # After step 5
feat: implement [feature] (GREEN)      # After step 7
fix: security improvements             # After step 9
refactor: improve [component]          # Refactoring
docs: update README                    # Documentation
```

### Branch Strategy

```
main
 └── feat/[feature-name]
      ├── commit: architecture
      ├── commit: tests (RED)
      ├── commit: implementation (GREEN)
      └── commit: security fixes
```

---

## DEVELOPMENT RULES

### NEVER

- Write code without concrete functionality
- Implement without failing tests first
- Mention Claude/AI in commits
- Skip ESLint + Prettier
- Commit directly to main

### ALWAYS

- Run `pnpm run typecheck` before commit
- Run `pnpm run lint:fix` before commit
- Write tests before implementation (TDD)
- Use descriptive commit messages
- Create feature branches
