# Cómo contribuir a Clauty

Gracias por venir. Este repo es un **plano**: specs, esquemas y políticas que luego construye un agente. Contribuir es, casi siempre, hacer que una historia de la matriz quede más clara, más verificable o más pequeña.

Antes de empezar, lee [`AGENTS.md`](AGENTS.md). Vale para personas y para agentes.

## Cómo contribuir

1. **Un issue = una historia de la matriz.** Todo trabajo empieza en un issue cuyo título lleva el id de la historia (`T6.2.04 Envoltura de datos para el modelo`). Si tu idea no cabe en ninguna historia, abre un issue de tipo *Epic* o *Historia* con la plantilla y propón dónde va. La matriz pública está en [`roadmap/epics.csv`](roadmap/epics.csv).
2. **PRs pequeños.** Un PR cierra una historia, o una parte claramente delimitada de ella. Si tu diff toca más de una carpeta de primer nivel, probablemente son dos PRs.
3. **El criterio de aceptación manda.** Cada historia trae un criterio verificable con un comando. Tu PR dice qué comando corriste y qué salió. Un "ya quedó" sin evidencia no cuenta.
4. **Un dueño por concepto.** Si un dato o una tabla ya vive en otro archivo, enlázalo; no lo copies. Ejemplo: la tabla de niveles de confianza vive solo en [`protocolo/SPEC-v0.1.md`](protocolo/SPEC-v0.1.md).
5. **Español primero.** Los documentos se escriben en español; el inglés va en una sección breve `## In English` donde haga falta.
6. **Nada personal en el público.** Sin correos, teléfonos, IP, dominios privados, nombres de personas reales ni datos de clientes. Los ejemplos usan personajes ficticios y dominios `example.com`.
7. **Nada de las entrañas de la app.** Este repo publica formatos y specs (open core, ver [ADR-0002](docs/decisiones/ADR-0002-open-core.md)). No propongas aquí cómo se implementa la génesis, el protocolo o el cobro.

## Convención de ids

| Nivel | Patrón | Ejemplo |
|---|---|---|
| Track | `T<track>` | `T6` |
| Epic | `T<track>.<epic>` | `T6.2` |
| Historia | `T<track>.<epic>.<NN>` | `T6.2.04` |
| Amenaza | `AMZ-##` | `AMZ-03` |
| Decisión | `ADR-####` | `ADR-0006` |

La columna `capa` dice dónde vive cada historia: **P** = este repo; **A** = la app privada; **M** = el Clauty 1 origen (privado); **H** = hardware. En este repo solo se trabajan historias con **P**.

## gitleaks es obligatorio

Ningún commit entra sin pasar [gitleaks](https://github.com/gitleaks/gitleaks) con la configuración del repo ([`.gitleaks.toml`](.gitleaks.toml)), que además de los secretos busca IP públicas, correos personales y RFC/CURP.

Instálalo como hook local antes de tu primer commit:

```bash
gitleaks git --staged --config .gitleaks.toml --redact   # antes de cada commit
gitleaks git --config .gitleaks.toml --redact            # historial completo, antes de abrir el PR
```

El CI corre lo mismo sobre el historial completo y bloquea el merge con un solo hallazgo. Si gitleaks encuentra algo tuyo, **no lo borres en un commit nuevo**: el secreto ya está en el historial. Rota la credencial y reescribe tu rama antes de pushear.

Las llaves de `protocolo/vectores/llaves-prueba/` son públicas a propósito (solo pruebas) y son la única excepción.

## Firma de commits

- Cada commit lleva `Signed-off-by:` ([DCO](https://developercertificate.org/)): `git commit -s`. No hay CLA.
- Recomendado: commits firmados con llave SSH Ed25519 (`git config gpg.format ssh`). Los tags de versión siempre van firmados.

## Plantilla del PR

Todo PR declara:

- `Historia: T…` con el id que cierra.
- [ ] Sin datos personales.
- [ ] Lo externo es dato: nada en este cambio convierte contenido externo en orden.
- [ ] gitleaks en verde sobre el historial de la rama.
- [ ] Comando del criterio de aceptación y su salida.

## Aporta un ataque

La suite de ataques ([`seguridad/`](seguridad/README.md)) crece con casos de la comunidad. Un caso nuevo es un YAML con `id`, `amenaza` (`AMZ-##`), `entrada`, `esperado` y `severidad`. Ábrelo con la plantilla de issue *Ataque*. Si es una vulnerabilidad real de algo ya construido, **no abras un issue público**: sigue [SECURITY.md](SECURITY.md).

## In English

Clauty is a blueprint: specs, schemas and policies an agent will later build. Every issue maps to one story of the matrix (`T<track>.<epic>.<NN>`); keep PRs small, one story each, and show the acceptance-criteria command and its output. gitleaks with the repo config is mandatory before every commit and runs on the full history in CI. Sign off your commits (DCO, `git commit -s`). No personal data, no private app internals. Content is Spanish-first; English summaries are welcome. Security issues go through [SECURITY.md](SECURITY.md), never public issues.
