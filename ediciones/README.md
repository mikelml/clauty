# ediciones/ — la edición anual del Clauty 1

**Qué es.** El Clauty 1 de cada colonia eres tú, a imagen y semejanza. Cada año se actualiza la edición de tu Clauty 1, viviente: mientras el año corre la edición está **viva**; al cerrarlo se **sella** (hash del árbol + sello OpenTimestamps) y empieza la siguiente, que hereda lo bueno. Aquí vive el formato de la edición, la diferencia entre versión y edición, y la edición pública de ejemplo.

## Epics que la alimentan

| Epic | Título |
|---|---|
| T1.7 | Versiones y ediciones anuales |
| T4.4 | Destilado del Clauty 1 origen → v1 público sin datos personales (lo público: filtro y edición de ejemplo) |
| T4.5 | Formato de edición anual |

Relacionado: las skills con las que la edición llega "lista desde el primer mensaje" (T4.7) viven en [`openclaw/`](../openclaw/README.md).

## Especificación v0

### 1. Dos relojes

| Reloj | Qué mide | Forma | Dueño |
|---|---|---|---|
| **Versión** | el código y los formatos de este repo | SemVer: mayor = rompe un formato; menor = agrega sin romper; parche = corrige | tags `vX.Y.Z` firmados |
| **Edición** | la fotografía anual de un Clauty 1 | `edicion-AAAA` | el manifiesto de la edición |

Un alma escrita con el formato N se lee con el formato N+1; si una fixture vieja deja de pasar el validador, el cambio exige versión mayor. Todo cambio en `alma/esquemas/` o `protocolo/` actualiza `CHANGELOG.md` (Keep a Changelog). El calendario de versiones del plano está en [`roadmap/ROADMAP.md`](../roadmap/ROADMAP.md).

### 2. Árbol mínimo de una edición

```
edicion-AAAA/
├── edicion.json     manifiesto (abajo)
├── alma/            SOUL.md y lo que define a este Clauty 1
├── skills/          sus skills, fijadas por hash
├── practicas/       las reglas que hereda cada Clauty 1 (cada regla con su check)
├── bitacora/        resúmenes del año (nunca la bitácora cruda)
└── SELLO.md         hash del árbol + prueba .ots (al sellar)
```

### 3. Manifiesto `edicion.json`

| Campo | Regla |
|---|---|
| `edicion` | año, `^[0-9]{4}$` |
| `clauty_id` | id del Clauty 1 |
| `desde`, `hasta` | fechas ISO; `desde` < `hasta` |
| `estado` | `viva` · `sellada` |
| `hash_arbol` | sha256 del árbol; obligatorio al sellar |
| `sello_ots` | ruta al `.ots`; obligatorio al sellar |
| `edicion_anterior` | `{ edicion, hash_arbol }` o `null` en la primera |

Esquema: `ediciones/edicion.schema.json` (semana 2). Ejemplos inválidos mínimos: sin hash, estado desconocido, fechas invertidas, anterior faltante.

### 4. Estados

| | viva | sellada |
|---|---|---|
| ¿Cambia? | sí, por crianza normal | no; solo entra una corrección como decisión registrada (DEC) |
| Hash | se recalcula | fijo, anclado a Bitcoin vía OpenTimestamps |
| Comando | — | `clauty edicion sellar <carpeta>`; un segundo `sellar` falla |

**Herencia encadenada:** `edicion_anterior.hash_arbol` debe coincidir con el hash de la edición previa; si no, el validador falla.

**Calendario:** corte anual configurable, por defecto el 31 de diciembre. Si el corte se salta, la edición sigue viva y la rutina semanal avisa.

### 5. Qué se hereda

| Se hereda | No se hereda |
|---|---|
| alma | memoria privada |
| prácticas | bitácora cruda |
| skills | secretos |

Una edición que declare heredar `bitacora/` falla la validación.

### 6. La edición pública de ejemplo: `ediciones/2026-origen/`

Un Clauty 1 criado de verdad durante un año, destilado para el público. Reglas del destilado (lo público):

- **Lista blanca:** solo entra lo que está listado; lo demás queda fuera por defecto.
- **Filtro de privacidad:** 0 correos, IP, dominios privados, RFC/CURP, teléfonos y rutas personales (`~/`, `/Users/`), más gitleaks en 0.
- `practicas/` con las reglas del año, en genérico (ejemplos: proponer → GATE → aplicar; los hechos caducan; un dueño por concepto; quien construye no audita; las rutinas recomiendan, nunca desbloquean).
- `skills/`: al menos 3 patrones sin dominio de cliente (proponer→GATE→aplicar, verificación profunda, investigación con hechos que caducan), cada uno válido contra el formato de skill.
- `alma/`: un `SOUL.md` que pasa el validador; memorias vacías o marcadas `sintetico: true`.
- **Revisión por un agente distinto** al que destiló, y **gate del dueño ligado al hash**: el CI falla si el hash publicado no coincide con el aprobado.

## Criterios de aceptación v0

- [ ] `docs/glosario.md` distingue **versión** (SemVer) y **edición** (año) en una línea cada una.
- [ ] El esquema de `edicion.json` acepta los ejemplos válidos y rechaza los 4 inválidos.
- [ ] `ediciones/2026-origen/` pasa el filtro de privacidad y gitleaks con 0 hallazgos.
- [ ] Sellar dos veces la misma edición falla la segunda.
