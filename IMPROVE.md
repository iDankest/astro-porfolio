# `/improve` — Auditoría de código y generación de planes

## Qué es `/improve`

`/improve` es una skill instalada en el proyecto que actúa como un **asesor senior de código**. Su función es analizar el codebase, encontrar oportunidades de mejora, y generar planes de implementación detallados que otros agentes (o tú mismo) pueden ejecutar.

**Filosofía central:**
- **Modelo caro (Opus)** → hace el análisis, juzga, crea planes (trabajo donde la inteligencia importa más)
- **Modelo barato (Sonnet/Haiku)** → ejecuta los planes (trabajo más mecánico)
- **El producto es el plan**, no código implementado

**Características importantes:**
- ✅ Solo lectura sobre el código fuente — nunca modifica nada
- ✅ Genera planes autocontenidos en `plans/`
- ✅ Audita en 9 categorías (bugs, seguridad, perf, tests, tech debt, deps, DX, docs, dirección)
- ✅ Los planes son ejecutables por otros agentes en worktrees aislados
- ✅ Mantiene un backlog de estado (TODO, IN_PROGRESS, DONE, BLOCKED)

---

## Todos los comandos disponibles

| Comando | Descripción | Uso |
|---|---|---|
| `/improve` | Auditoría estándar completa + genera planes | Por defecto para análisis general |
| `/improve quick` | Análisis rápido, solo top 6 hallazgos | Cuando necesitas resultados rápido |
| `/improve deep` | Exhaustivo: repo completo, usa hasta 8 subagentes | Cuando quieres análisis profundo |
| `/improve security` | Solo auditoría de seguridad | Antes de desplegar |
| `/improve perf` | Solo análisis de rendimiento | Optimización de velocidad |
| `/improve tests` | Solo cobertura y calidad de tests | Mejorar confiabilidad |
| `/improve branch` | Solo cambios del branch actual vs main | En PRs, análisis incremental |
| `/improve next` | Sugerencias de dirección del proyecto | Roadmap, features siguientes |
| `/improve plan <descripción>` | Crea plan para algo específico, salta auditoría | Para tareas concretas |
| `/improve review-plan <archivo>` | Critica y mejora un plan existente | Validar planes antes de ejecutar |
| `/improve execute <plan>` | Ejecuta un plan en worktree aislado | Implementación real |
| `/improve reconcile` | Revisa el backlog, actualiza estados | Mantenimiento del proyecto |
| `/improve ... --issues` | Publica planes como GitHub issues | Compartir hallazgos públicamente |

---

## Las 9 categorías de auditoría

`/improve` examina el código en estas 9 dimensiones:

### 1. **Correctness / Bugs**
Manejo de errores, hazards async, null/undefined, edge cases, máquinas de estado, concurrencia, type escapes, memory leaks.

### 2. **Security**
Secrets hardcodeados, inyecciones (SQL/shell/HTML), autenticación/autorización, validación de input, dependencias vulnerables, headers/config.

### 3. **Performance**
Patrones N+1, complejidad algoritmica incorrecta, caching, payload sizes, bundles grandes, índices DB, pooling.

### 4. **Test Coverage**
Critical paths sin tests, módulos con high churn, calidad de tests existentes, capas faltantes de testing.

### 5. **Tech Debt & Architecture**
Duplicación, violaciones de layering, dead code, god objects, patrones inconsistentes, abstracciones mal calibradas.

### 6. **Dependencies & Migrations**
Lag en major versions, APIs deprecated, dependencias abandonadas, duplicados, drift en lockfiles.

### 7. **DX & Tooling**
Typecheck/lint/formatter rotos, feedback loops lentos, fricción onboarding, logging desestructurado.

### 8. **Docs**
Superficie pública sin docs de referencia, decisiones arquitectónicas irreconstruibles, docs staleas o incorrectas.

### 9. **Direction**
Features a medio construir, promesas sin código, asimetrias de superficie, posibilidades adyacentes baratas.

---

## Flujo de trabajo recomendado

```
1. /improve              ← obtienes findings priorizados por impact/effort
                         ← seleccionas cuáles quieres resolver
2. /improve execute <plan-file>  ← se implementa el plan en un worktree limpio
3. /improve reconcile           ← actualiza el backlog periódicamente
```

### Ciclo típico:
1. **Analiza** el proyecto con `/improve` o `/improve deep`
2. **Elige** qué plans ejecutar (prioridad, esfuerzo, risk)
3. **Ejecuta** con `/improve execute plans/XXX-slug.md`
4. **Verifica** que el cambio es correcto
5. **Merge** si todo está bien
6. **Reconcilia** el backlog con `/improve reconcile`

---

## Pasos a seguir en PrismaCrawler + The Garden

Dado el estado actual del proyecto (3 sub-proyectos: frontend Nuxt + backend Go + AI backend), aquí está el orden recomendado:

### **Paso 1 — Auditoría profunda del frontend**
```bash
/improve deep frontGame/
```

**Por qué primero:** El frontend (Nuxt 4, Vue 3, Phaser 4, Tailwind v4) es donde ocurre la mayor complejidad y cambio. Encontrar deuda técnica aquí tiene máximo impacto.

**Qué esperar:**
- Problemas en la integración Phaser ↔ Vue
- Oportunidades de refactor en el Pinia store
- Validaciones faltantes
- Problemas de performance en bundles
- Coverage de tests

---

### **Paso 2 — Auditoría del backend Go**
```bash
/improve deep PrismaCrawler-2.0_Backend_DB/
```

**Por qué:** Validar que la arquitectura por capas se mantiene, los DTOs centralizados se respetan, y el AutoMigrate es seguro.

**Qué esperar:**
- Violaciones de layering (handlers, models, db)
- Problemas con AutoMigrate y migraciones
- Oportunidades de refactor en endpoints
- Seguridad: validación de input, rate limiting

---

### **Paso 3 — Sugerencias de dirección del proyecto**
```bash
/improve next
```

**Por qué:** Ver features incompletas, módulos stub, y qué features baratas se pueden hacer ahora.

**Qué esperar:**
- Qué todavía no está implementado (AI backend)
- Qué interfaces están incompletas
- Oportunidades de cross-features

---

### **Paso 4 — Ejecutar los plans de mayor prioridad**
```bash
/improve execute plans/001-titulo.md
/improve execute plans/002-titulo.md
# ... en orden de prioridad
```

**Qué sucede:**
- El plan se ejecuta en un worktree aislado (no toca tu código)
- Un agente implementa los cambios siguiendo exactamente el plan
- Se crea un diff para que lo revises
- Tú decides si mergear o pedir revisiones

---

### **Paso 5 — Mantener el backlog limpio**
```bash
/improve reconcile
```

**Cuándo:** Cada vez que vuelvas al proyecto después de un tiempo, o después de ejecutar varios plans.

**Qué hace:**
- Verifica que los plans DONE siguen siendo válidos
- Investiga qué está BLOCKED y por qué
- Detecta si un plan ya fue arreglado por otros cambios
- Actualiza el estado general del backlog

---

## Dónde viven los planes

Todos los planes generados se guardan en **`plans/`** en la raíz del proyecto:

```
PrismaCrawler+Garden/
├── plans/
│   ├── README.md              ← índice con estado de cada plan
│   ├── 001-frontend-perf.md
│   ├── 002-auth-validation.md
│   └── ...
├── frontGame/
├── PrismaCrawler-2.0_Backend_DB/
└── ...
```

### Anatomía de un plan

Cada plan (`plans/XXX-slug.md`) contiene:
- **Why this matters** — problema y valor
- **Current state** — código relevante actual
- **Steps** — pasos exactos a ejecutar
- **Done criteria** — checklist de validación
- **Test plan** — qué tests escribir

Los planes están diseñados para ser **completamente autocontenidos** — quien ejecute no necesita contexto externo.

### El índice: `plans/README.md`

Tabla de estado de todos los planes:

```markdown
| # | Título | Categoría | Estado | Esfuerzo | Priority |
|---|--------|-----------|--------|----------|----------|
| 001 | ... | Security | TODO | M | HIGH |
| 002 | ... | Perf | DONE | S | MED |
| ... |
```

---

## Ejemplos de uso

### Auditar solo seguridad
```bash
/improve security
```
Encuentra: secrets hardcodeados, injection vulnerabilities, auth issues.

### Analizar cambios del branch actual
```bash
/improve branch
```
Útil en una PR — solo audita lo que cambiaste, identifica si introdujiste bugs.

### Crear un plan para algo concreto
```bash
/improve plan "agregar rate limiting al endpoint /game-run POST"
```
Salta la auditoría, va directo a generar un plan para esa tarea.

### Ejecutar un plan y revisar
```bash
/improve execute plans/003-rate-limiting.md
```
Un agente lo implementa en un worktree limpio, tú revisas el diff.

### Publicar todos los plans como GitHub issues
```bash
/improve --issues
```
Crea un issue por cada plan encontrado, útil para compartir con el equipo.

---

## Flujo para PrismaCrawler en la práctica

**Semana 1:**
1. `! /improve deep frontGame/` — obtener hallazgos
2. Seleccionar top 3 plans por impacto
3. `! /improve execute plans/001-*.md` → revisar → merge
4. `! /improve execute plans/002-*.md` → revisar → merge

**Semana 2:**
1. `! /improve deep PrismaCrawler-2.0_Backend_DB/`
2. Ejecutar plans de backend
3. `! /improve reconcile` — actualizar estado

**Semana 3+:**
1. `! /improve next` — ver hacia dónde va el proyecto
2. Iterar sobre nuevas features

---

## Consejos y buenas prácticas

### ✅ Haz esto
- Usa `/improve deep` cuando tengas tiempo — análisis exhaustivo vale la pena
- Lee el plan completo antes de ejecutar
- Ejecuta plans en orden de dependencias (el README.md las lista)
- Reconcilia periodicamente para no tener backlog stale

### ❌ No hagas esto
- Ejecutar múltiples plans a la vez (trabajan en worktrees aislados, no coordinan)
- Ignorar los STOP conditions en un plan (son ahí por una razón)
- Asumir que un plan es perfecto — revisalo críticamente
- Mergear sin revisar el diff

---

## Referencia rápida

| Situación | Comando |
|---|---|
| "Quiero ver qué mejorar" | `/improve` |
| "Dame análisis rápido" | `/improve quick` |
| "Análisis exhaustivo" | `/improve deep` |
| "Quiero mejorar seguridad" | `/improve security` |
| "¿Qué features hacer?" | `/improve next` |
| "Ejecutar plan X" | `/improve execute plans/XXX.md` |
| "¿Dónde estamos?" | `/improve reconcile` |
| "Validar un plan" | `/improve review-plan plans/XXX.md` |

---

## Más información

- Skill oficial: `shadcn/improve` en GitHub
- Plans siempre van en `plans/` con formato `plans/NNN-titulo.md`
- El índice `plans/README.md` es tu fuente de verdad sobre el estado
- Cada plan tiene done criteria machine-checkable
