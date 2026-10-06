# ROADMAP — 30 días de refinamiento

**Meta:** que al día 30 este repo sea un plano tan preciso que un OpenClaw construya todo el software siguiéndolo, sin hacer preguntas. Hoy es plano v0.1: specs, esquemas y políticas en borrador.

**Ventana:** del 7 de octubre al 5 de noviembre de 2026.

## Cómo se trabaja

- **Dreamtime del repo:** una rutina diaria (03:00) toma las historias listas de mayor prioridad, las refina y abre **un PR al día**. Solo abre PRs; nunca hace merge. Las rutinas recomiendan, no desbloquean.
- El dueño revisa y aprueba desde el teléfono. Un PR sin aprobar no bloquea al siguiente si no depende de él.
- Cada PR cierra historias concretas (`Historia: T…`) y muestra el comando del criterio de aceptación con su salida.
- El "ok" de un agente no cuenta: cuentan los checks deterministas del CI.

## Las 4 semanas

| Semana | Fechas | Versión | Qué se refina |
|---|---|---|---|
| 1 | 7–13 oct | **v0.2** | Coherencia: cero contradicciones, un solo glosario, cada epic con su definición de terminado |
| 2 | 14–20 oct | **v0.4** | Specs ejecutables: esquemas JSON, vectores de prueba del protocolo, políticas del guardián que validan |
| 3 | 21–27 oct | **v0.7** | Prueba de fuego: un agente constructor intenta los epics críticos **solo con el repo**, en una rama. Donde se atora, se corrige el spec |
| 4 | 28 oct – 5 nov | **v1.0-blueprint** | Congelado. `AGENTS.md` final. "Listo para que tu OpenClaw construya" |

### Semana 1 · v0.2 · Coherencia

- Un dueño por concepto: resolver las contradicciones conocidas entre historias (valores de `acta.origen`, dónde vive el acta de nacimiento, rutas de la rutina semanal, numeración de ADR, tabla de autonomía duplicada).
- Glosario único: todos los documentos enlazan a [`docs/glosario.md`](../docs/glosario.md) en vez de redefinir.
- Definición de terminado de cada epic P, revisada contra su carpeta.
- Fuentes enlazadas de cada hecho de [`docs/comparativa-muse.md`](../docs/comparativa-muse.md).
- CI mínimo en verde: gitleaks, markdownlint, enlaces, `contar.mjs`, `mapeo.mjs`.
- Epics foco: T1.2, T1.3, T1.4, T1.5.

### Semana 2 · v0.4 · Specs ejecutables

- Esquemas JSON que faltan: memoria, skill, pedigrí, paquete, edición, política del guardián, MFA, conector, consentimiento, y los del protocolo (sobre, identidad, delegación, revocaciones, tarjeta, vector).
- Fixtures válidas e inválidas para cada esquema.
- `protocolo/SPEC-v0.1.md` se divide en `protocolo/spec/v0.1/`; vectores (≥ 10 positivos, ≥ 15 negativos) y verificador mínimo.
- Políticas del guardián que validan contra su esquema; primeros 30 casos de la suite de ataques.
- Validador de almas y CLI de crianza especificados al nivel de códigos de error.
- Epics foco: T2.1–T2.9, T3.1–T3.3, T6.1–T6.4, T7.1, T7.9, T8.1.

### Semana 3 · v0.7 · Prueba de fuego

- Un agente constructor, sin más contexto que este repo, intenta los epics P0 en una rama aparte.
- Cada atasco se registra (`roadmap/prueba-de-fuego.csv`: epic, `ejecutado` | `atorado`, motivo) y se corrige **en el spec**, no en el código.
- Un agente escribe un verificador del protocolo en otro lenguaje solo con `protocolo/`.
- Instalador probado en contenedores limpios de Arch y Ubuntu.
- Epics foco: T1.6, T2.3, T3.9, T4.7, T6.7, T6.8, T7.7.

### Semana 4 · v1.0-blueprint · Congelado

- `roadmap/v1.0-blueprint.md`: una fila por métrica con su comando y su resultado.
- `AGENTS.md` final con "Listo para que tu OpenClaw construya".
- Tag firmado `v1.0-blueprint`, release con el checksum del instalador.
- El PR de release lo aprueba el dueño; antes, ningún push que cambie la visibilidad o el alcance público.
- Epics foco: T1.10, T1.7.

## Cómo se verá en 30 días

Medible, no adjetivos. Cada métrica tiene su comando en `roadmap/v1.0-blueprint.md`.

| Métrica | Meta | Cómo se mide |
|---|---|---|
| Epics ejecutables por un agente sin preguntas | **≥ 80%** de los epics críticos | `node roadmap/scripts/fuego.mjs` sobre `prueba-de-fuego.csv` |
| Historias con criterio de aceptación | **100%** | `contar.mjs` reporta `sin criterio: 0` |
| Secretos | **0** en este repo y en los privados | `gitleaks` sobre el historial completo |
| Matriz y carpetas | **cuadran en ambos sentidos** | `mapeo.mjs` sale 0 |
| Instalador | **deja la semilla en un OpenClaw limpio** | job `instalador` en verde en el commit del release |

## Lo que no entra en estos 30 días

- Código de producción de la app (génesis, protocolo implementado, cobro): vive en el repo privado y se construye después, a partir de este plano.
- Hardware de Larynx.
- Publicar en registros de paquetes.
