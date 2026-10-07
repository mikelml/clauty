# roadmap/ — la matriz pública y los 30 días de refinamiento

**Qué es.** El proyecto se organiza en una matriz de 10 tracks × 10 epics, cada epic con ~10 historias y un criterio de aceptación verificable. Aquí vive la parte pública de esa matriz, el plan de 30 días que lleva este repo de plano v0.1 a `v1.0-blueprint`, y las reglas que mantienen cuadradas la matriz y las carpetas. También aloja los epics de cimientos del repo (estructura, `AGENTS.md`, CI, issues, release).

## Epics que la alimentan

| Epic | Título |
|---|---|
| T1.2 | `clauty-dashboard` → `clauty` + reestructura |
| T1.4 | `AGENTS.md` "Si estás leyendo esto…" |
| T1.5 | CI: gitleaks + lint + enlaces + conteo de la matriz |
| T1.9 | Plantillas de issues = epics/historias |
| T1.10 | Release `v1.0-blueprint` |

## Especificación v0

### 1. `epics.csv`

Misma cabecera que la matriz completa:

```
track,epic_id,epic,capa_epic,prioridad,historia_id,historia,capa,criterio_aceptacion,depende_de
```

| Columna | Regla |
|---|---|
| `track` | `T1`…`T10` |
| `epic_id` | `T<track>.<epic>` |
| `capa_epic` | combinación de `P` (este repo), `A` (app), `M` (Clauty 1 origen), `H` (hardware) |
| `prioridad` | `P0` camino crítico · `P1` importante · `P2` después |
| `historia_id` | `T<track>.<epic>.<NN>`, único |
| `capa` | capa de la historia, ⊆ `capa_epic` |
| `criterio_aceptacion` | no vacío; idealmente un comando y su salida esperada |
| `depende_de` | ids de historias o epics separados por `;` (vacío = sin dependencias) |

**Qué filas entran aquí:** solo las historias cuya `capa` incluye `P` dentro de epics cuya `capa_epic` incluye `P` (hoy: **57 epics, 461 historias**). Las historias de capa `A` de un epic `PA` viven en la app, porque describen su implementación. El nombre del repo privado del Clauty 1 origen aparece como `origen-privado`.

### 2. Mapa matriz ↔ carpetas

Cada epic con `P` tiene una carpeta cuyo README lo cita; cada carpeta de primer nivel cita al menos un epic.

| Carpeta | Epics |
|---|---|
| [`alma/`](../alma/README.md) | T2.1, T2.2, T2.4, T2.5, T2.6, T2.7, T2.8, T2.9, T2.10 |
| [`semilla/`](../semilla/README.md) | T2.3 |
| [`crianza/`](../crianza/README.md) | T3.1, T3.2, T3.3, T3.4, T3.5, T3.6, T3.7, T3.8, T3.9, T5.6 |
| [`ediciones/`](../ediciones/README.md) | T1.7, T4.4, T4.5 |
| [`guardian/`](../guardian/README.md) | T6.1, T6.2, T6.3, T6.4, T6.6, T6.7, T6.8 |
| [`seguridad/`](../seguridad/README.md) | T6.9, T6.10 |
| [`protocolo/`](../protocolo/README.md) | T7.1, T7.2, T7.3, T7.4, T7.7, T7.8, T7.9 |
| [`conectores/`](../conectores/README.md) | T8.1, T8.2, T8.5, T8.10 |
| [`negocios/`](../negocios/README.md) | T9.2, T9.3 |
| [`superficies/`](../superficies/README.md) | T10.1, T10.2, T10.10 |
| [`openclaw/`](../openclaw/README.md) | T1.6, T4.7 |
| [`docs/`](../docs/README.md) | T1.3, T1.8 |
| `roadmap/` (este) | T1.2, T1.4, T1.5, T1.9, T1.10 |

Total: 57 epics, cada uno en exactamente una fila de esta tabla (puede citarse como referencia en otras).

### 3. Scripts (contrato)

| Script | Sale 0 si… |
|---|---|
| `node roadmap/scripts/contar.mjs roadmap/epics.csv` | ids únicos, cada historia con `capa` ⊆ `capa_epic` y criterio no vacío; imprime totales y `sin criterio: 0` |
| `node roadmap/scripts/mapeo.mjs` | se cumple el mapa del §2 en ambos sentidos |
| `node roadmap/scripts/dependencias.mjs` | todo `depende_de` apunta a un id existente (aquí o en la lista de ids externos permitidos) y no hay ciclos |
| `node roadmap/scripts/listas.mjs` | lista las historias listas para tomar: dependencias cerradas, ordenadas por prioridad |
| `node roadmap/scripts/check-agents.mjs` | cada ruta del orden de lectura de `AGENTS.md` existe |
| `node roadmap/scripts/csv-a-issues.mjs [--dry-run]` | crea un issue por historia, deduplicando por id; idempotente |
| `bash roadmap/scripts/etiquetas.sh` | crea las etiquetas `T1`…`T10`, `capa:P/A/M/H`, `P0/P1/P2`; idempotente |
| `bash roadmap/scripts/release.sh vX.Y.Z --dry-run` | imprime el tag y las notas de `[Unreleased]` sin crear nada |

### 4. CI

Jobs de `.github/workflows/ci.yml`: `gitleaks` (historial completo, `fetch-depth: 0`, con [`.gitleaks.toml`](../.gitleaks.toml)), `markdown` (markdownlint), `enlaces` (lychee offline), `matriz` (contar + dependencias), `mapeo`, `privacidad` (lista negra leída de un secreto de Actions, nunca del repo), `vectores` (protocolo), `ataques` (suite) e `instalador` (Arch y Ubuntu limpios). `main` queda protegido por `gitleaks`, `matriz` y `privacidad`. Cada check se prueba con una fixture que lo hace fallar.

### 5. Issues

Formularios `epic.yml`, `historia.yml`, `propuesta-alma.yml` y `ataque.yml`; issues en blanco deshabilitados y un enlace al reporte privado de seguridad. El título de todo issue lleva su id; un PR con `Historia: T…` cierra la historia al hacer merge.

## Criterios de aceptación v0

- [ ] `epics.csv` tiene la cabecera de la matriz y ninguna fila sin `P` en `capa` ni en `capa_epic`.
- [ ] Los 57 epics con `P` aparecen en el mapa del §2 y en el README de su carpeta.
- [ ] [`ROADMAP.md`](ROADMAP.md) tiene la tabla de 4 semanas y las métricas de "cómo se verá en 30 días".
