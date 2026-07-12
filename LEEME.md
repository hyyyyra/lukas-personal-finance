# Lukas · Finanzas personales (Chile)

Aplicación web de finanzas personales orientada al mercado chileno. Toda la
interfaz está en español y los montos se manejan en **peso chileno (CLP)**.
Esta entrega es **solo la capa visual**: no se conecta a ningún backend, pero
está preparada para ingresar y manipular datos que se **guardan en la caché del
navegador (localStorage)**.

---

## Cómo ejecutar en desarrollo

Requisitos: Node.js 18+ y pnpm.

```bash
pnpm install     # instala dependencias
pnpm dev         # inicia el servidor de desarrollo
```

Luego abre en el navegador:

```
http://localhost:3000
```

Otros comandos útiles:

```bash
pnpm build       # compila para producción
pnpm start       # sirve la build de producción
```

---

## Flujo de la aplicación

La app se controla desde una sola ruta (`/`) que muestra la pantalla correcta
según el estado guardado en la caché:

1. **Inicio de sesión / Registro** — botones de Google, Apple y Facebook
   (simulados) más acceso nativo por correo y contraseña.
2. **Carrusel de onboarding** — al registrarse por primera vez se piden los
   datos esenciales: ingresos mensuales, gastos indispensables, ahorro base y el
   periodo de presupuesto (semanal, quincenal o mensual).
3. **Home** — visión general del presupuesto. Incluye el botón llamativo
   **"Ingresar gasto"**, que abre un popup con 3 métodos:
   - **OCR por cámara** (principal, simulado)
   - **Subir archivo** (imagen o PDF, simulado)
   - **Ingreso manual** (título y monto)
4. Cada gasto ingresado actualiza en tiempo real el **presupuesto restante**
   según el periodo seleccionado.
5. El botón de ajustes (icono de sliders, arriba a la derecha) permite
   **editar los datos esenciales** y recalcular todo al instante.

---

## Rutas y archivos clave

| Ruta / archivo | Descripción |
| --- | --- |
| `app/page.tsx` | Orquesta el flujo: login → onboarding → home |
| `app/layout.tsx` | Fuentes, metadata y `LukasProvider` (estado global) |
| `app/globals.css` | Tema de colores (tokens sobrios en OKLCH) |
| `lib/finance.ts` | Tipos, formato CLP y cálculos de presupuesto |
| `lib/use-lukas-store.tsx` | Estado global + persistencia en caché (localStorage) |
| `components/auth/login-screen.tsx` | Pantalla de login / registro |
| `components/onboarding/onboarding-carousel.tsx` | Carrusel de datos esenciales |
| `components/dashboard/home-screen.tsx` | Pantalla principal (Home) |
| `components/dashboard/budget-overview.tsx` | Tarjeta de presupuesto restante |
| `components/dashboard/add-expense-dialog.tsx` | Popup con los 3 métodos de ingreso |
| `components/dashboard/edit-essentials-dialog.tsx` | Edición de datos esenciales |
| `components/dashboard/expense-list.tsx` | Lista de gastos del periodo |
| `components/ui/money-input.tsx` | Campo de monto con formato CLP |
| `components/ui/modal.tsx` | Modal / popup base |

---

## Persistencia en caché

Todo el estado (usuario, datos esenciales y gastos) se guarda bajo la clave
`lukas.state.v1` en `localStorage`. Para reiniciar la app puedes cerrar sesión
o borrar esa clave desde las herramientas de desarrollo del navegador.

---

## Preparado para un backend (por ejemplo, PHP)

La lógica de datos está centralizada en `lib/use-lukas-store.tsx`. Para conectar
un backend real (como una API en PHP) basta con reemplazar las funciones
`login`, `completeOnboarding`, `updateEssentials`, `addExpense` y `removeExpense`
por llamadas HTTP (`fetch`) a los endpoints correspondientes, manteniendo la
misma forma de datos definida en `lib/finance.ts`.

Mapa sugerido de endpoints:

| Función del store | Método y endpoint sugerido |
| --- | --- |
| `login` | `POST /api/auth/login` |
| `completeOnboarding` | `POST /api/usuario/esenciales` |
| `updateEssentials` | `PUT /api/usuario/esenciales` |
| `addExpense` | `POST /api/gastos` |
| `removeExpense` | `DELETE /api/gastos/:id` |

---

## Diseño y colores

El tema se define con tokens en OKLCH dentro de `app/globals.css` y se usa
siempre a través de clases semánticas (`bg-primary`, `text-foreground`, etc.),
nunca colores directos.

- **Color primario — teal sereno** (`--primary`, hue ≈ 197). Se eligió tras
  revisar psicología del color aplicada a finanzas: el azul-verde combina la
  **confianza y calma del azul** con la **asociación de crecimiento del verde**,
  transmitiendo tranquilidad financiera (reemplaza al naranjo terracota
  anterior, que resultaba más urgente/impulsivo).
- **Acento verde** (`--accent`) para señales positivas como el ahorro.
- **Neutros cálidos** (fondo crema y grises suaves) para un aire sobrio y
  semiformal.
- Tipografía: **Fraunces** (serif) para títulos y montos, **Inter** (sans) para
  el cuerpo. Máximo dos familias.

Para cambiar la identidad de color basta con ajustar los tokens `--primary`,
`--ring`, `--chart-1` y los `--sidebar-*` en `app/globals.css`.

---

## Responsividad

La interfaz es **mobile-first** y escala correctamente desde un **iPhone 13
(390 px)** hasta un **monitor grande**:

- **Móvil / iPhone 13:** una sola columna dentro de `max-w-md`, con el botón
  **"Ingresar gasto"** flotante y fijo en la parte inferior para acceso rápido
  con el pulgar.
- **Tablet:** se mantiene la columna centrada con más aire (`sm:` ajusta
  paddings y el tamaño del monto del presupuesto).
- **Escritorio / monitor grande (`lg:`):** el Home pasa a **dos columnas**
  (`max-w-6xl`) — presupuesto y datos esenciales a la izquierda (con posición
  *sticky*) y la lista de gastos a la derecha. El botón deja de ser flotante y
  se muestra inline en la columna izquierda.

Las pantallas de **login** y **onboarding** usan tarjetas centradas
(`max-w-sm` / `max-w-md`) que se ven equilibradas en cualquier ancho.
