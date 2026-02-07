# 📱 Barcode Scanner App

Una aplicación web moderna para consultar información de productos mediante códigos de barras usando la API de OpenFoodFacts. Diseñada con enfoque mobile-first, interfaz intuitiva y historial de búsquedas persistente.

## 🎯 Descripción del Proyecto

**Barcode Scanner** es una web app que permite a los usuarios:

- ✅ Buscar productos por código de barras (entrada manual o cámara)
- ✅ Visualizar detalles: nombre, marca, categoría, precio simulado e información nutricional
- ✅ Mantener un historial de productos consultados
- ✅ Acceder rápidamente a búsquedas anteriores
- ✅ Disfrutar de una experiencia responsive en cualquier dispositivo

### Características Principales

- **Entrada Flexible**: Código manual (6-13 dígitos) o escaneo con cámara web
- **API Integration**: Conexión en tiempo real con OpenFoodFacts
- **Historial Inteligente**: Máximo 20 items, sin duplicados, persistencia en localStorage
- **UI/UX Moderno**: Diseño mobile-first con Tailwind CSS y shadcn/ui
- **Loading States**: Skeletons animados y estados visuales claros
- **Error Handling**: Mensajes amigables cuando productos no existen
- **Fully Typed**: TypeScript para máxima seguridad

---

## 🛠️ Tecnologías Utilizadas

| Tecnología                | Versión | Propósito                      |
| ------------------------- | ------- | ------------------------------ |
| **Next.js**               | 14.2+   | Framework React con App Router |
| **React**                 | 18.3+   | Librería UI                    |
| **TypeScript**            | 5.7+    | Tipado estático                |
| **Tailwind CSS**          | 3.4+    | Estilos y responsive design    |
| **shadcn/ui**             | latest  | Componentes UI accesibles      |
| **Zustand**               | 5.0+    | State management (historial)   |
| **html5-qrcode**          | 2.3+    | Escaneo de códigos de barras   |
| **Vitest**                | 2.1+    | Testing framework              |
| **React Testing Library** | 16.3+   | Unit tests para componentes    |
| **Sonner**                | 2.0+    | Toasts y notificaciones        |
| **Lucide React**          | 0.468+  | Iconos SVG                     |

### Stack Técnico Completo

```
Frontend: Next.js 14 (App Router) + React 18 + TypeScript
Styling: Tailwind CSS 3.4 + shadcn/ui
State: Zustand 5 (con persist middleware)
API: Server Actions + fetch (OpenFoodFacts)
Testing: Vitest + React Testing Library + JSDOM
Build: Next.js bundler (Webpack)
Package Manager: pnpm
```

---

## 📋 Requisitos Previos

- **Node.js**: v20.18.0 o superior
- **pnpm**: v8.0.0 o superior (npm o yarn también funcionan)
- **Navegador moderno**: Chrome, Firefox, Safari o Edge (para acceso a cámara)

---

## 📥 Instrucciones de Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/miguel-anay/oeschle.git
cd oeschle
```

### 2. Instalar dependencias

Con **pnpm** (recomendado):

```bash
pnpm install
```

O con npm:

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto (opcional, la API es pública):

```env
# .env.local
NEXT_PUBLIC_API_BASE=https://world.openfoodfacts.org/api/v0
```

### 4. Verificar la instalación

```bash
# Verificar tipado
pnpm typecheck

# Verificar linting
pnpm lint

# Ejecutar tests
pnpm test:run
```

---

## 🚀 Cómo Ejecutar Localmente

### Modo Desarrollo

```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`

**Características en desarrollo:**

- Hot reload automático
- TypeScript en tiempo real
- React DevTools integradas
- Error overlay mejorado

### Modo Producción

```bash
# Build
pnpm build

# Start
pnpm start
```

### Testing

```bash
# Ejecutar todos los tests
pnpm test

# Ejecutar tests en modo watch
pnpm test

# UI interactiva para tests
pnpm test:ui

# Run tests once
pnpm test:run
```

### Otros comandos útiles

```bash
# Linting y formateo
pnpm lint
pnpm lint:fix

# Type checking
pnpm typecheck
```

---

## 🏗️ Decisiones Técnicas Importantes

### 1. **Next.js App Router vs Pages Router**

- ✅ **Decisión**: App Router
- **Razón**: Soporte moderno, Server Components, mejor rendimiento, routing intuitivo

### 2. **Estado Global: Zustand vs Redux**

- ✅ **Decisión**: Zustand
- **Razón**: Librería lightweight, API simple, ideal para historial de búsquedas

### 3. **Componentes UI: shadcn/ui vs Material-UI**

- ✅ **Decisión**: shadcn/ui + Tailwind
- **Razón**: Componentes accesibles, copiar/pegar, full control, Tailwind-first, menor bundle

### 4. **Scanner de Códigos: html5-qrcode vs jsQR**

- ✅ **Decisión**: html5-qrcode
- **Razón**: Mejor mantenimiento, soporte multi-dispositivo, detección rápida

### 5. **Persistencia: localStorage vs IndexedDB**

- ✅ **Decisión**: localStorage (con Zustand persist)
- **Razón**: Suficiente para 20 items, API simple, sincrónico, sin setup complejo

### 6. **Testing: Vitest vs Jest**

- ✅ **Decisión**: Vitest
- **Razón**: ESM nativo, integración Vite, más rápido, configuración mínima

### 7. **Tipado Strict**

```typescript
// ✅ Tipos as const para máxima seguridad
const BARCODE_LENGTH = { MIN: 6, MAX: 13 } as const;

// ✅ Interfaces planas (máx 1 nivel)
interface Product {
  code: string;
  name: string;
  nutrients: Nutrients;
}

// ✅ Discriminated unions para estados
type SearchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; product: Product }
  | { status: "error"; message: string };
```

### 8. **React Compiler (Sin useMemo/useCallback)**

- ✅ Aprovechamos Next.js 14 con React Compiler habilitado
- No necesitamos `useMemo` ni `useCallback` explícitos
- Compilador automático optimiza renders

### 9. **Server Actions para API Calls**

```typescript
// actions/product.ts
"use server";

export async function searchProduct(barcode: string) {
  // Llamadas a API desde servidor
  // Más seguro, sin CORS issues
}
```

### 10. **Color Branding: Oechsle Red**

```typescript
// tailwind.config.ts
const OECHSLE_RED = "rgb(255, 7, 5)";

// Usado en:
// - Botones primarios
// - Highlights
// - Estados activos
```

---

## 📁 Estructura de Carpetas

```
oeschle/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Layout raíz
│   ├── page.tsx                 # Home (búsqueda)
│   ├── globals.css              # Estilos globales
│   ├── product/
│   │   └── [barcode]/
│   │       ├── page.tsx         # Detalle de producto
│   │       ├── page.test.tsx    # Tests
│   │       └── title-updater.tsx # Client Component
│   └── history/
│       ├── page.tsx             # Historial
│       └── page.test.tsx
│
├── components/                   # Componentes React
│   ├── barcode-input.tsx        # Input + validación
│   ├── camera-scanner.tsx       # Escaneo QR
│   ├── product-card.tsx         # Tarjeta producto
│   ├── history-list.tsx         # Lista historial
│   ├── error-state.tsx          # Error component
│   └── ui/                      # shadcn/ui
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       └── ...
│
├── actions/                      # Server Actions
│   ├── product.ts               # Búsqueda de productos
│   └── product.adapter.ts       # Transformación datos
│
├── store/                        # Zustand stores
│   └── history.ts               # Historial (persist)
│
├── lib/                          # Utilidades
│   ├── utils.ts                 # cn() utility
│   ├── validators.ts            # Validaciones
│   └── price-generator.ts       # Precio simulado
│
├── types/                        # TypeScript types
│   └── product.ts               # Interfaces
│
├── public/                       # Assets estáticos
│   └── logo__primary-color-oeschle.svg
│
├── vitest.config.ts             # Config testing
├── tailwind.config.ts           # Config Tailwind
├── tsconfig.json                # Config TypeScript
├── next.config.mjs              # Config Next.js
└── package.json
```

---

## 🔄 Flujo de Aplicación

```
┌─────────────────────┐
│  Home (page.tsx)    │
│  - Barcode Input    │
│  - Camera Scanner   │
│  - History Preview  │
└──────────┬──────────┘
           │ [Buscar]
           ▼
┌─────────────────────────────────┐
│  Server Action (product.ts)     │
│  - Validar barcode              │
│  - Fetch OpenFoodFacts          │
│  - Transformar datos (adapter)  │
└──────────┬──────────────────────┘
           │
      ┌────┴─────┐
      ▼          ▼
  Success    Error (404)
      │          │
      ▼          ▼
┌──────────────┐ ┌──────────────┐
│ /product/    │ │ Error Page   │
│ [barcode]    │ │ (not-found)  │
│ - ProductCard│ └──────────────┘
│ - Nutrients  │
│ - Save to    │
│   History    │
└──────────────┘
      │
      ▼
┌──────────────┐
│ /history     │
│ - History    │
│   List       │
│ - Click item │
│   → back to  │
│   /product/  │
└──────────────┘
```

---

## 🧪 Testing

### Estructura de Tests

```
components/
├── barcode-input.test.tsx       # Unit: validación input
├── product-card.test.tsx        # Unit: renderizado card
├── history-list.test.tsx        # Unit: lista historial
└── ...

actions/
├── product.test.ts              # Integration: API calls
└── product.adapter.test.ts      # Unit: transformación datos

app/
├── product/[barcode]/
│   └── page.test.tsx            # Integration: página producto
└── history/
    └── page.test.tsx            # Integration: página historial

store/
└── history.test.ts              # Unit: Zustand store
```

### Ejecutar Tests

```bash
# Todos los tests
pnpm test:run

# Watch mode
pnpm test

# Con UI
pnpm test:ui

# Un archivo específico
pnpm test:run components/barcode-input.test.tsx

# Con cobertura
pnpm test:run -- --coverage
```

---

## 🎨 Códigos de Barras para Pruebas

| Código          | Producto       | Esperado            |
| --------------- | -------------- | ------------------- |
| `7501055363803` | Coca Cola      | ✅ Success          |
| `3017620422003` | Nutella        | ✅ Success          |
| `8076809513685` | Ferrero Rocher | ✅ Success          |
| `0000000000000` | N/A            | ❌ Not Found        |
| `123`           | N/A            | ⚠️ Validation Error |

---

## 📸 Screenshots / Demo

### Home - Input Búsqueda

```
┌────────────────────────────┐
│  Barcode Scanner           │
├────────────────────────────┤
│                            │
│  [📷] [________________]   │
│        Input barcode       │
│                            │
│       [🔍 Buscar]          │
│                            │
│  ─────────────────────     │
│  Búsquedas Recientes:      │
│  ├─ Nutella (3017...)     │
│  └─ Coca Cola (7501...)   │
│                            │
└────────────────────────────┘
```

### Detalle Producto

```
┌────────────────────────────┐
│  ← Nutella (3017...)       │
├────────────────────────────┤
│       [Imagen]             │
│     Nutella 350g           │
│     Ferrero                │
│     S/. 45.99              │
│                            │
│  🥜 Spreads, Sweet spreads│
│                            │
│  Información Nutricional:  │
│  • Calorías: 539 kcal      │
│  • Proteína: 6.3g          │
│  • Carbohidratos: 57.5g    │
│  • Grasas: 30.9g           │
│                            │
│     [↻ Nueva búsqueda]     │
└────────────────────────────┘
```

### Historial

```
┌────────────────────────────┐
│  Historial                 │
├────────────────────────────┤
│                            │
│  [🗑️ Limpiar historial]    │
│                            │
│  📋 Últimas búsquedas:     │
│  ┌──────────────────────┐  │
│  │ [IMG] Nutella        │  │
│  │       3017...        │  │
│  │       Hoy 14:32      │  │
│  └──────────────────────┘  │
│  ┌──────────────────────┐  │
│  │ [IMG] Coca Cola      │  │
│  │       7501...        │  │
│  │       Ayer 09:15     │  │
│  └──────────────────────┘  │
│                            │
└────────────────────────────┘
```

### Error State

```
┌────────────────────────────┐
│  ❌ Producto no encontrado │
├────────────────────────────┤
│                            │
│          🔍                │
│   No encontramos el        │
│   producto buscado         │
│                            │
│  Verifica el código e      │
│  intenta de nuevo          │
│                            │
│   [↻ Nueva búsqueda]       │
│                            │
└────────────────────────────┘
```

---

## 🔐 Consideraciones de Seguridad

- ✅ **CORS**: API pública, sin secrets
- ✅ **XSS**: React escapea contenido, sanitización en API response
- ✅ **CSP**: Headers de seguridad en Next.js
- ✅ **localStorage**: Solo datos públicos (historial)
- ✅ **Input Validation**: Validación en cliente y servidor

---

## 📱 Responsividad

| Dispositivo | Breakpoint | Layout                     |
| ----------- | ---------- | -------------------------- |
| **Móvil**   | < 640px    | Full-width, vertical       |
| **Tablet**  | 640-1024px | Centrado, 90% ancho        |
| **Desktop** | > 1024px   | Max-width 1200px, centrado |

**Touch targets**: Mínimo 44x44px en móvil

---

## 🚀 Deploy

### Vercel (Recomendado)

```bash
npm i -g vercel
vercel
```

### Otros (Docker)

```dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .
RUN pnpm build

EXPOSE 3000
CMD ["pnpm", "start"]
```

---

## 📚 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Zustand](https://github.com/pmndrs/zustand)
- [OpenFoodFacts API](https://wiki.openfoodfacts.org/API)
- [html5-qrcode](https://github.com/mebjas/html5-qrcode)

---

## 📄 Licencia

MIT © [Miguel Anay](https://github.com/miguel-anay)

---

## 👨‍💻 Autor

**Miguel Anay** - [@miguel-anay](https://github.com/miguel-anay)

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/mejora`)
3. Commit cambios (`git commit -am 'Add mejora'`)
4. Push a la rama (`git push origin feature/mejora`)
5. Abre un Pull Request

---

## 📞 Soporte

Para problemas, preguntas o sugerencias:

- 🐛 Abre un [Issue](https://github.com/miguel-anay/oeschle/issues)
- 💬 Discusiones en [GitHub Discussions](https://github.com/miguel-anay/oeschle/discussions)

---

**Última actualización**: Febrero 2026 | **Versión**: 0.1.0
