# Barcode Scanner App - Project Specifications

## Overview

Aplicación web para consultar productos mediante código de barras usando la API de OpenFoodFacts. Diseño mobile-first con historial de búsquedas persistente.

**API Base**: `https://world.openfoodfacts.org/api/v0/product/[BARCODE].json`

---

## Epics & User Stories

### EPIC 1: Project Setup

#### US-1.1: Inicialización del proyecto
**Como** desarrollador
**Quiero** configurar el proyecto con Next.js, TypeScript y Tailwind
**Para** tener una base sólida de desarrollo

**Criterios de aceptación:**
- [ ] Proyecto creado con `create-next-app` (App Router)
- [ ] TypeScript configurado correctamente
- [ ] Tailwind CSS funcionando
- [ ] shadcn/ui inicializado con componentes base (button, input, card)
- [ ] Zustand instalado
- [ ] Estructura de carpetas creada según CLAUDE.md
- [ ] ESLint y Prettier configurados
- [ ] `pnpm run dev` funciona sin errores

**Archivos a crear:**
```
app/layout.tsx
app/page.tsx
lib/utils.ts (cn utility)
types/product.ts
components/ui/ (shadcn)
```

---

### EPIC 2: Barcode Input

#### US-2.1: Campo de entrada manual
**Como** usuario
**Quiero** ingresar un código de barras manualmente
**Para** buscar información de un producto

**Criterios de aceptación:**
- [ ] Input numérico que acepta 6-13 dígitos
- [ ] Placeholder descriptivo: "Ingresa código de barras..."
- [ ] Solo permite números (no letras ni caracteres especiales)
- [ ] Botón de búsqueda visible y accesible
- [ ] Enter dispara la búsqueda
- [ ] Diseño mobile-first (input ocupa ancho completo en móvil)

**Componente:** `components/barcode-input.tsx`

---

#### US-2.2: Validación de código de barras
**Como** usuario
**Quiero** ver feedback cuando ingreso un código inválido
**Para** corregir mi entrada antes de buscar

**Criterios de aceptación:**
- [ ] Mensaje de error si código tiene menos de 6 dígitos
- [ ] Mensaje de error si código tiene más de 13 dígitos
- [ ] Error visual (borde rojo, texto de ayuda)
- [ ] Botón deshabilitado si código inválido
- [ ] Error se limpia al corregir el código

**Archivo:** `lib/validators.ts`

---

#### US-2.3: Scanner con cámara (BONUS)
**Como** usuario
**Quiero** escanear códigos de barras con mi cámara
**Para** buscar productos más rápidamente

**Criterios de aceptación:**
- [ ] Botón para activar cámara
- [ ] Preview de cámara en pantalla
- [ ] Detección automática de código de barras
- [ ] Código detectado se autocompleta en el input
- [ ] Funciona en móvil y desktop
- [ ] Manejo de permisos de cámara denegados
- [ ] Botón para cerrar cámara

**Componente:** `components/camera-scanner.tsx`
**Librería sugerida:** `html5-qrcode`

---

### EPIC 3: Product Search & Display

#### US-3.1: Búsqueda de producto
**Como** usuario
**Quiero** buscar un producto por código de barras
**Para** ver su información detallada

**Criterios de aceptación:**
- [ ] Fetch a OpenFoodFacts API al buscar
- [ ] Redirección a `/product/[barcode]` con resultado
- [ ] Producto se guarda en historial automáticamente
- [ ] Manejo de errores de red

**Archivos:**
```
actions/product.ts
actions/product.adapter.ts
```

---

#### US-3.2: Estado de carga (Loading)
**Como** usuario
**Quiero** ver un indicador mientras se busca el producto
**Para** saber que la aplicación está trabajando

**Criterios de aceptación:**
- [ ] Skeleton loader animado durante la búsqueda
- [ ] Botón de búsqueda muestra spinner/deshabilitado
- [ ] No se puede hacer otra búsqueda mientras carga

**Componente:** `components/product-skeleton.tsx`

---

#### US-3.3: Visualización de producto
**Como** usuario
**Quiero** ver la información del producto encontrado
**Para** conocer sus detalles

**Criterios de aceptación:**
- [ ] Imagen del producto (con fallback si no existe)
- [ ] Nombre del producto
- [ ] Marca
- [ ] Categoría
- [ ] Precio simulado (S/. 5-150, generado por hash del código)
- [ ] Información nutricional (calorías, proteínas, carbohidratos, grasas)
- [ ] Diseño tipo card, responsive
- [ ] Botón para volver a buscar

**Componentes:**
```
components/product-card.tsx
app/product/[barcode]/page.tsx
```

---

#### US-3.4: Estado de error (Producto no encontrado)
**Como** usuario
**Quiero** ver un mensaje claro cuando el producto no existe
**Para** entender qué pasó y qué hacer

**Criterios de aceptación:**
- [ ] Mensaje amigable: "Producto no encontrado"
- [ ] Icono ilustrativo (search, empty state)
- [ ] Sugerencia: "Verifica el código e intenta de nuevo"
- [ ] Botón para volver a buscar
- [ ] El código inválido NO se guarda en historial

**Componente:** `components/error-state.tsx`

---

### EPIC 4: Search History

#### US-4.1: Guardar búsqueda en historial
**Como** usuario
**Quiero** que mis búsquedas exitosas se guarden automáticamente
**Para** acceder rápidamente a productos consultados

**Criterios de aceptación:**
- [ ] Solo productos encontrados se guardan
- [ ] Se guarda: código, nombre, imagen, fecha/hora
- [ ] Máximo 20 items (FIFO - los más antiguos se eliminan)
- [ ] Persistencia en localStorage
- [ ] No duplicados (si busco el mismo código, se mueve al inicio)

**Archivo:** `store/history.ts`

---

#### US-4.2: Ver historial de búsquedas
**Como** usuario
**Quiero** ver una lista de mis búsquedas anteriores
**Para** acceder rápidamente a productos ya consultados

**Criterios de aceptación:**
- [ ] Lista en página `/history` o sección en home
- [ ] Cada item muestra: thumbnail, nombre, código, fecha
- [ ] Ordenados del más reciente al más antiguo
- [ ] Click en item → ver detalle del producto
- [ ] Estado vacío si no hay historial

**Componentes:**
```
components/history-list.tsx
components/history-item.tsx
app/history/page.tsx (o sección en home)
```

---

#### US-4.3: Limpiar historial
**Como** usuario
**Quiero** poder eliminar mi historial de búsquedas
**Para** limpiar mis datos o empezar de nuevo

**Criterios de aceptación:**
- [ ] Botón "Limpiar historial" visible
- [ ] Confirmación antes de eliminar (modal o toast)
- [ ] Feedback visual al completar
- [ ] Estado vacío mostrado después de limpiar

---

### EPIC 5: UI/UX Mobile-First

#### US-5.1: Layout responsive
**Como** usuario
**Quiero** usar la app cómodamente en cualquier dispositivo
**Para** consultar productos desde móvil, tablet o desktop

**Criterios de aceptación:**
- [ ] Mobile (< 640px): Layout vertical, full-width
- [ ] Tablet (640-1024px): Layout con más espacio
- [ ] Desktop (> 1024px): Layout centrado, max-width
- [ ] Navegación accesible en todos los tamaños
- [ ] Touch targets mínimo 44x44px en móvil

**Breakpoints Tailwind:**
```
sm: 640px
md: 768px
lg: 1024px
```

---

#### US-5.2: Header y navegación
**Como** usuario
**Quiero** navegar fácilmente entre las secciones
**Para** acceder a búsqueda e historial

**Criterios de aceptación:**
- [ ] Header fijo con logo/título public\logo__primary-color-oeschle.svg  , 
- [ ] Link a Home (búsqueda)
- [ ] Link a Historial
- [ ] Indicador de página actual
- [ ] Mobile: navegación compacta o bottom nav

**Componente:** `components/header.tsx`

---

#### US-5.3: Estados visuales consistentes
**Como** usuario
**Quiero** feedback visual claro en cada acción
**Para** entender el estado de la aplicación

**Criterios de aceptación:**
- [ ] Loading: skeletons y spinners
- [ ] Error: mensajes claros con iconos
- [ ] Empty: ilustraciones y call-to-action
- [ ] Success: confirmaciones visuales (toast o feedback inline)
- [ ] Transiciones suaves entre estados

---

#### US-5.4: Tema y estilos globales
**Como** usuario
**Quiero** una interfaz moderna y agradable
**Para** tener una buena experiencia de uso

**Criterios de aceptación:**
 [ ] Paleta de colores consistente  
      Color primario Oechsle: rgb(255, 7, 5)
- [ ] Tipografía legible  
      Archivo (principal) o Inter como fallback
- [ ] Espaciado consistente  
      Usar escala de Tailwind (p-2, p-4, p-6, p-8)
- [ ] Bordes redondeados consistentes  
      rounded-md / rounded-lg en cards y botones
- [ ] Sombras sutiles para elevación  
      shadow-sm / shadow en cards de producto

---

## Tech Stack

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Next.js | 14+ | Framework, App Router |
| React | 18+ | UI Library |
| TypeScript | 5+ | Type Safety |
| Tailwind CSS | 3.4+ | Styling |
| shadcn/ui | latest | UI Components |
| Zustand | 5+ | State (History) |

### Bonus (Opcional)
- `html5-qrcode` - Camera scanner
- `Framer Motion` - Animations
- `Vitest` - Unit tests

---

## API Reference

### OpenFoodFacts API

**Endpoint:** `GET https://world.openfoodfacts.org/api/v0/product/{barcode}.json`

**Response (success):**
```json
{
  "status": 1,
  "product": {
    "code": "3017620422003",
    "product_name": "Nutella",
    "brands": "Ferrero",
    "image_url": "https://...",
    "categories": "Spreads, Sweet spreads",
    "nutriments": {
      "energy-kcal_100g": 539,
      "proteins_100g": 6.3,
      "carbohydrates_100g": 57.5,
      "fat_100g": 30.9
    }
  }
}
```

**Response (not found):**
```json
{
  "status": 0,
  "status_verbose": "product not found"
}
```

---

## Test Barcodes

| Código | Producto | Esperado |
|--------|----------|----------|
| 7501055363803 | Coca Cola | Success |
| 3017620422003 | Nutella | Success |
| 8076809513685 | Ferrero Rocher | Success |
| 0000000000000 | N/A | Error (not found) |
| 123 | N/A | Validation error |

---

## Definition of Done (DoD)

Cada User Story se considera completa cuando:

- [ ] Código implementado y funcionando
- [ ] TypeScript sin errores (`pnpm run typecheck`)
- [ ] Linting pasando (`pnpm run lint`)
- [ ] Responsive verificado (móvil + desktop)
- [ ] Estados UI manejados (loading, error, empty, success)
- [ ] Código revisado y limpio

---

## Priority Order (Sugerido)

1. **US-1.1** - Setup proyecto (bloqueante)
2. **US-2.1** - Input manual
3. **US-2.2** - Validación
4. **US-3.1** - Búsqueda API
5. **US-3.2** - Loading state
6. **US-3.3** - Visualización producto
7. **US-3.4** - Error state
8. **US-4.1** - Guardar historial
9. **US-4.2** - Ver historial
10. **US-4.3** - Limpiar historial
11. **US-5.1** - Layout responsive
12. **US-5.2** - Header/navegación
13. **US-5.3** - Estados visuales
14. **US-5.4** - Tema global
15. **US-2.3** - Camera scanner (BONUS)
