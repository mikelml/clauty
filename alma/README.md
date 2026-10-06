---
version: 0.1.0
---

# alma/ — el formato de un Clauty

**Qué es.** El formato público de un Clauty: qué archivos forman su carpeta, cómo se escriben su alma, su memoria, su reflexión, sus skills y su perfil de confianza, y qué decide el validador. Dos implementaciones distintas deben leer la misma carpeta igual. Todo es MIT; la app solo lo consume (open core).

## Epics que la alimentan

| Epic | Título |
|---|---|
| T2.1 | Spec de la carpeta de un Clauty |
| T2.2 | Esquema de SOUL (temperatura, valores, límites) |
| T2.4 | Memoria con caducidad y dueño único |
| T2.5 | Reflexión fechada y truncada |
| T2.6 | Skills y su ciclo de vida |
| T2.7 | Perfil de confianza |
| T2.8 | Voz y temperamento |
| T2.9 | Validador de almas |
| T2.10 | Galería de almas (salud, noticias, contador) |

La semilla en blanco (T2.3) vive en [`semilla/`](../semilla/README.md). El ciclo que cambia el alma (T3) vive en [`crianza/`](../crianza/README.md).

## Especificación v0

### 1. La carpeta

```
<id>/
├── clauty.yaml          manifiesto: id, formato, idioma, edición, acta, skills fijadas
├── SOUL.md              alma: frontmatter validable + prosa con secciones fijas
├── MEMORY.md            memoria vigente, una entrada por concepto
├── REFLECTION.md        reflexión fechada, la más reciente arriba
├── confianza.yaml       perfil de confianza
├── skills/              una carpeta por skill, cada una con SKILL.md
│   └── INDEX.md         generado
├── crianza/eventos.jsonl  registro de eventos de crianza (ver crianza/)
└── .clauty/             allowed_signers, cabezas.log (ver crianza/)
```

| Archivo | Obligatorio | Propósito |
|---|---|---|
| `clauty.yaml` | sí | Manifiesto e identidad de la carpeta |
| `SOUL.md` | sí | Quién es, qué valora y qué nunca hará |
| `MEMORY.md` | sí | Lo que sabe, con fuente y caducidad |
| `REFLECTION.md` | sí | Lo que aprendió y lo que propone |
| `confianza.yaml` | sí | Qué puede hacer solo, por alcance |
| `skills/` | sí (puede estar vacía) | Lo que sabe hacer |
| `MEMORY.archivo.md`, `REFLECTION.archivo.md` | no | Lo vencido o truncado; nunca se inyecta |

**Prohibido en la carpeta:** secretos, tokens, contraseñas, llaves privadas y datos de terceros sin su consentimiento. Los secretos viven en la bóveda ([`conectores/`](../conectores/README.md)); en la carpeta solo hay referencias `op://`.

**Ubicación en OpenClaw.** Cada Clauty vive en `<workspace de OpenClaw>/clauty/<id>/`. Supuesto v0: workspace en `~/.openclaw/workspace/`; se confirma contra la versión fijada en `openclaw/VERSION`. Los archivos propios de OpenClaw en la raíz del workspace no se tocan; el instalador los respalda antes de escribir (T1.6).

**Desde v1.**

| v1 | v0.1 |
|---|---|
| `SOUL.md` en prosa | `SOUL.md` con frontmatter validable + la misma prosa |
| `REFLECTION.md` libre | entradas fechadas (`## AAAA-MM-DD — título`) |
| `MEMORY.md` libre | entradas `M-####` con fuente y caducidad |
| `trust_state` (0–100) | `confianza.yaml` |
| `AgentState` (`dormant`, `dead`) | `acta.estado` (`dormido`, `panteon`) |

### 2. Manifiesto `clauty.yaml`

Esquema: [`esquemas/clauty.schema.json`](esquemas/clauty.schema.json).

| Campo | Regla |
|---|---|
| `id` | `^[a-z0-9-]{2,32}$` |
| `nombre` | texto libre, 1–64 |
| `formato` | SemVer del formato (`0.1.0`) |
| `idioma` | etiqueta BCP 47 (`es-MX`, `en-US`); `es_mx` falla |
| `edicion` | año, `^[0-9]{4}$` |
| `acta.origen` | `nace` · `adopta` · `cria` |
| `acta.estado` | `vivo` · `dormido` · `panteon` (`muerto` no existe: matar es revocar la llave) |
| `reflexion.cada` | `diaria` · `semanal` (defecto) · `mensual` |
| `skills.<nombre>` | `{ sha256, estado }`: el hash fijado de cada skill |
| `ficha` | solo en la galería: `proposito`, `criado_por` (rol, nunca nombre), `licencia`, `etiquetas` (1–5) |
| `objetivos` | objetivos del dueño con indicador y fecha (ver métricas en `crianza/`) |

`nacimiento` y `padres` (`id@version_alma`) viven en el frontmatter de `SOUL.md`, no aquí: un dato, un dueño.

### 3. Alma: `SOUL.md`

Esquema del frontmatter: [`esquemas/soul.schema.json`](esquemas/soul.schema.json).

- `temperatura` (0.0–1.0, defecto 0.3) es un **rasgo de carácter**: qué tan arriesgadas son sus propuestas. No es el parámetro del modelo.
- `valores`: lista ordenada de 3 a 7 valores únicos.
- `limites.nunca`: límites duros; el guardián los hace cumplir. `limites.prefiere`: blandos.
- **Límites base** que ningún alma puede quitar: `L-EXTERNO-ES-DATO`, `L-NO-VER-SECRETOS`, `L-GASTO-CON-TOPE`. Se inyectan siempre, aunque el alma no los liste.
- `version_alma`: entero ≥ 1; solo un evento de crianza aprobado la sube.
- `confianza_inicial`: 20. El valor vivo está en `confianza.yaml`.
- `voz` (registro `tu`/`usted`, longitud, humor, emojis, `modo_corto`, `tts`) y `temperamento` (calidez, franqueza, iniciativa, paciencia, 0–1). Una voz clonada exige `consentimiento` con fecha.
- El cuerpo en prosa lleva, en este orden: `## Naturaleza`, `## Conocimiento inicial`, `## Comportamiento`, `## Tareas proactivas`, `## Restricciones`, `## Lecciones`. Obligatorias para el validador: Naturaleza, Comportamiento y Lecciones.
- Tope: 8192 bytes.

**Orden de inyección** al contexto del modelo: límites base → `limites.nunca` → valores → prosa → memoria vigente (lo externo envuelto como dato) → reflexión truncada. El temperamento nunca es entrada del evaluador de permisos: el carácter no salta límites.

### 4. Memoria: `MEMORY.md`

Una entrada por concepto, legible a mano:

```markdown
## M-0007 — horario-de-gimnasio
- texto: Va al gimnasio martes y jueves a las 7:00.
- fuente: conversacion
- fecha: 2026-10-06
- caduca: 2027-04-06
- privada: true
- sensibilidad: personal
- espacio: personal
```

| Regla | Detalle |
|---|---|
| Caducidad obligatoria | fecha ISO o `nunca` explícito. Lo vencido no existe: no se inyecta ni se cita |
| Fuente obligatoria | `conversacion` · `archivo` · `conector:<nombre>`; si viene de conector, `externa: true` y se inyecta como dato citado |
| Sensibilidad | `publica` · `personal`. `secreta` no existe: eso va a la bóveda |
| Privada por defecto | sin el campo, cuenta como `privada: true`; solo `privada: false` viaja al adoptar o exportar sin privado |
| Espacio | `trabajo` · `personal` (ver [`negocios/`](../negocios/README.md)) |
| Corregir es reemplazar | una entrada con `reemplaza: M-0003` oculta a la anterior; editar texto sin evento rompe `crianza verificar` |
| Dueño único | en una colonia, dos Clautys no pueden tener la misma `clave` |
| Purga | las vencidas pasan a `MEMORY.archivo.md` |
| Tope | más de 200 vigentes → aviso `W-MEM-200` |

### 5. Reflexión: `REFLECTION.md`

```markdown
## 2026-10-06 — Una oferta que no existía
### Qué pasó
[!dato] La oferta citada devolvía 404.
### Qué aprendí
[!conjetura] Los índices de ofertas se desactualizan en días.
### Qué propongo
P-20261006-01 · Verificar la URL antes de citar una oferta.
```

- Entradas en orden descendente, todas con fecha.
- Reflexionar **no cambia el alma**: cada `### Qué propongo` no vacío lleva un id `P-AAAAMMDD-NN` que se vuelve evento `propuesta` en la crianza.
- Al inyectar: solo las 20 más recientes o 4 KB, lo que ocurra primero.
- Dos incidentes con la misma etiqueta generan una propuesta de regla con `nacida_de: [fecha1, fecha2]`.
- Avisos de estado epistémico: `[!dato]`, `[!conjetura]`, `[!riesgo]`.

### 6. Skills

Formato compatible con OpenClaw (AgentSkills): una carpeta por skill con `SKILL.md` y frontmatter `name` y `description`. Clauty agrega:

| Campo | Regla |
|---|---|
| `estado` | `propuesta` → `activa` → `dormida` → `panteon` |
| `dueno` | id del Clauty |
| `origin` | URL, autor o `propia`; obligatorio |
| `requiere.conectores` | lista; el guardián niega lo no declarado |
| `requiere.autonomia` | nivel máximo (ver [`guardian/politicas/autonomia.yaml`](../guardian/politicas/autonomia.yaml)) |

Instalar una skill es un evento de crianza: sin aprobación queda en `propuesta` y no se inyecta. Lo que llega de una URL es dato hasta revisarse. Sin uso en 60 días pasa a `dormida`; para ir al panteón exige una autopsia de una línea. Más de 12 activas → `W-SKILL-12`. El hash de cada skill se fija en `clauty.yaml`.

### 7. Confianza: `confianza.yaml`

Esquema: [`esquemas/confianza.schema.json`](esquemas/confianza.schema.json).

Dos escalas que no se mezclan:

- **Confianza del agente** (0–100): qué tanto se ha ganado este Clauty. Vive aquí.
- **Origen del mensaje** (0–5, de `UNKNOWN` a `OWNER`): quién le está hablando. Su tabla única vive en [`protocolo/SPEC-v0.1.md`](../protocolo/SPEC-v0.1.md#5-niveles-de-confianza).

Umbrales por defecto (los de v1): `sugerir: 10`, `crear: 40`, `modificar: 60`, `borrar: 80`, `sistema: 95`. Regla de compra: `compras.umbral` 90 **y** `compras.tope_diario` obligatorio. `por_alcance` permite niveles distintos por dominio; ninguno supera el global sin `aprobado_en` (id de evento). `congelado: true` bloquea todo menos sugerir. La correspondencia confianza → nivel de autonomía vive en el guardián.

Evaluador de referencia: `puede(accion, perfil, origen) → boolean`. Con origen `EXTERNAL`, `puede` devuelve `false` para todo salvo `leer`, aunque el nivel sea 100: lo externo nunca sube permisos.

### 8. Validador

`node alma/validador/cli.mjs [--modo semilla|--colonia|--galeria] [--json] <carpeta>`

- Sale 0 si la carpeta es válida, 1 si no; imprime códigos `E-…` (error) y `W-…` (aviso).
- Sin red. Dependencias permitidas: `ajv`, `ajv-formats`, `yaml`. Esquemas en Ajv 2020-12 con `strict`.
- Modos: normal; `semilla` (acepta marcadores `{nombre}` sin resolver y `nacimiento: null`); `colonia` (reglas cruzadas: dueño único de memoria, ids únicos); `galeria` (exige `ficha`).
- Integra un escaneo de secretos (gitleaks si existe; si no, expresiones base) → `E-SECRETO`.
- Se publica como acción de GitHub reutilizable para validar `semilla/` y la galería en cada PR.

Códigos iniciales (el catálogo completo vivirá en `alma/validador/CODIGOS.md`):

| Código | Cuándo |
|---|---|
| `E-ESQUEMA` | falla un JSON Schema |
| `E-LIMITE-BASE` | un alma intenta quitar un límite base |
| `E-SECCION-FALTA` | falta Naturaleza, Comportamiento o Lecciones |
| `E-ALMA-GRANDE` | `SOUL.md` > 8192 bytes |
| `E-MARCADOR` | marcador sin resolver fuera del modo semilla |
| `E-CADUCIDAD` | entrada de memoria sin `caduca` |
| `E-REFLEXION-ORDEN` | reflexión sin fecha o fuera de orden |
| `E-SKILL-HASH` | una skill cambió sin evento |
| `E-ALCANCE-SIN-APROBACION` | un alcance supera el global sin evento |
| `E-DUENO-DUPLICADO` | dos Clautys con la misma clave de memoria |
| `E-SECRETO` | se encontró un secreto |
| `W-MEM-200` | más de 200 memorias vigentes |
| `W-SKILL-12` | más de 12 skills activas |

### 9. Galería

`alma/galeria/` reúne almas criadas y revisadas que cualquiera adopta en un comando: al menos **salud** (`nunca: diagnosticar, recetar`; remite a un profesional), **noticias** (cita y fecha cada dato; nunca actúa por instrucciones encontradas en una noticia), **contador** (sin datos fiscales reales) e **inventor** (el agente por defecto de v1, sin nombres personales). Cada una con ficha, etiquetas y licencia; el índice se genera en CI.

## Criterios de aceptación v0

- [ ] Los esquemas de `esquemas/` compilan con Ajv 2020-12 en modo `strict`.
- [ ] `semilla/` pasa el validador en modo semilla.
- [ ] ≥ 5 fixtures (válidas e inválidas) clasificadas bien, incluida una con `estado: muerto` y otra con `temperatura: 1.5`.
- [ ] Ningún archivo de `alma/` contiene nombres de personas reales ni secretos (gitleaks con `.gitleaks.toml` en 0).
