# Guion — Demo end-to-end de Lukas

**Duración objetivo:** 5–6 minutos.
**Formato sugerido:** grabación de pantalla con narración (Loom, OBS) o demo en vivo.

---

## Preparación previa (no se graba)

- [ ] Backend sano: abrir `https://lukas-core-cloud-production.up.railway.app/api/test-conexion.php` y verificar `"exito": true`.
- [ ] Frontend desplegado y apuntando al backend de producción.
- [ ] Ventana de incógnito (sin sesión previa en localStorage).
- [ ] Correo de demo **no registrado** (ej. `demo.lukas.2026@gmail.com`).
- [ ] Zoom del navegador al 110–125% para que se lea bien en el video.
- [ ] Datos que usaremos (tenerlos a mano para no improvisar):
  - Ingreso mensual: **$1.200.000**
  - Gastos fijos: **Arriendo / Dividendo $400.000** (Vivienda) e **Internet y telefonía $30.000** (Servicios)
  - Ahorro base: **$100.000**
  - Gasto variable: **Supermercado $45.000** (Comida)
  - Meta: **"Vacaciones" $500.000**, abono inicial **$150.000**

---

## Escena 1 — Apertura y registro (≈45 s)

**Mostrar:** pantalla de login/registro.

**Hacer:** completar nombre, apellido, correo y contraseña → "Registrarme".

**Decir:**
> "Lukas es una aplicación de finanzas personales pensada para Chile: todo en pesos, sin decimales, con un flujo simple. Me registro con correo — también soporta login real con Google vía OAuth. Al crear la cuenta, el backend PHP valida y persiste el usuario en Supabase, y devuelve un token JWT que autentica todas las llamadas que vienen: nadie puede leer o modificar datos de otro usuario."

---

## Escena 2 — Onboarding (≈60 s)

**Hacer:**
1. Paso 1: ingreso mensual **$1.200.000**.
2. Paso 2: agregar **Arriendo / Dividendo $400.000** e **Internet y telefonía $30.000** usando las sugerencias rápidas.
3. Paso 3: ahorro base **$100.000**.
4. Paso 4: mostrar el presupuesto estimado calculado en vivo (**$670.000/mes**) y entrar.

**Decir:**
> "El onboarding pide solo tres cosas: cuánto entra, cuánto se va sí o sí, y cuánto quiero apartar. Las sugerencias traen su categoría — arriendo es Vivienda, internet es Servicios — y el total se suma solo. La fórmula es transparente: ingresos, menos gastos fijos, menos ahorro: eso es lo que realmente puedo gastar."

---

## Escena 3 — Dashboard y edición instantánea (≈60 s)

**Mostrar:** tarjeta principal de presupuesto + las 3 tarjetas (Ingresos / Gastos fijos / Ahorro).

**Hacer:** click en **Ingresos** → editar inline a $1.300.000 → Enter → ver todo recalcularse. Volver a dejarlo en $1.200.000.

**Decir:**
> "Este es el corazón de la app: cuánto me queda este mes, con un mensaje que acompaña en vez de alarmar — 'vas muy bien', 'buen ritmo', 'atención'. Y los valores base se editan tocándolos directamente: sin formularios, sin menús de configuración. Cambio el ingreso, Enter, y todo el presupuesto se recalcula y persiste en el backend al instante."

---

## Escena 4 — Gastos fijos con estado de pago (≈45 s)

**Mostrar:** listado, tab "Gastos Fijos".

**Hacer:**
1. Marcar **Arriendo** como Pagado → el contador pasa a "1 de 2".
2. Marcar **Internet** → aparece "¡Todos tus gastos fijos del mes están pagados!".
3. Agregar un gasto fijo nuevo con el botón **+** (ej. Suscripciones $10.000) para mostrar el flujo.

**Decir:**
> "Cada gasto fijo se puede marcar como pagado en el mes. La barra de progreso empuja a completar la lista — es diseño conductual: la sensación de avance motiva más que cualquier recordatorio. El estado se guarda por período, así que el próximo mes todos vuelven a pendiente automáticamente."

---

## Escena 5 — Registrar un gasto variable (≈45 s)

**Hacer:** botón **"Ingresar gasto"** → Supermercado Líder, $45.000, categoría Comida → agregar. Mostrar cómo la barra de presupuesto avanza y el "Gastado" se actualiza.

**Decir:**
> "Los gastos del día a día se ingresan en tres campos. Al confirmarlo, el presupuesto restante baja al tiro y el gasto queda en el listado con su categoría y fecha. La app también tiene los flujos de escanear boleta y subir archivo como parte del roadmap de OCR."

---

## Escena 6 — Metas de ahorro (≈45 s)

**Hacer:**
1. Crear meta **"Vacaciones"**, objetivo **$500.000**.
2. Abonar **$150.000** → barra al 30%, "Te faltan $350.000".
3. *(Opcional si hay tiempo)* abonar $350.000 más → "¡Meta cumplida!".

**Decir:**
> "El ahorro deja de ser un número frío: le pongo nombre y objetivo. Cada abono muestra cuánto falta — 'te faltan $350.000' se siente alcanzable, y cuando llegas, la app lo celebra. Esto es lo que hace que un usuario vuelva a abrir la aplicación."

---

## Escena 7 — Resumen mensual (≈30 s)

**Hacer:** cambiar al tab **"Resumen"**.

**Decir:**
> "Y para cerrar el ciclo, el resumen mensual: cuánto gasté cada mes, desglosado por categoría con su porcentaje. Los meses cerrados quedan etiquetados como dentro o sobre el presupuesto — de un vistazo sé si el mes fue bueno o no."

---

## Escena 8 — Persistencia y cierre (≈30 s)

**Hacer:** cerrar sesión → iniciar sesión de nuevo → todo está tal cual (pagos, meta, gastos).

**Decir:**
> "Cierro sesión y vuelvo a entrar: todo persiste desde el backend — perfil, pagos del mes, metas y movimientos. El stack: Next.js con React 19 en el frontend, un backend PHP 8.4 con autenticación JWT sobre Supabase, desplegados en Vercel y Railway. Los dos repositorios están en mi GitHub. Gracias."

---

## Tips de grabación

- No leer el guion: usar los bullets como recordatorio y hablar natural.
- Si una llamada tarda, cortar en edición — mejor un video fluido que uno "honesto" con esperas.
- Punto técnico extra para audiencia dev: abrir DevTools → Network y mostrar el header `Authorization: Bearer …` en una llamada, como evidencia de la autenticación por token.
- Para mostrar responsive: repetir la Escena 3 con el viewport móvil (375px) — el layout pasa a una columna con botón flotante.
