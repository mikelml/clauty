# docs/ — arquitectura, comparativa, glosario y decisiones

**Qué es.** La documentación transversal del proyecto: cómo encajan las capas, en qué se parece y en qué difiere de Muse, qué significa cada término y por qué se decidió cada cosa. Es Markdown puro: el futuro sitio de docs lo lee de aquí, sin copiarlo.

## Epics que la alimentan

| Epic | Título |
|---|---|
| T1.3 | MIT, CONTRIBUTING, código de conducta (las decisiones de licencia y open core) |
| T1.8 | Sitio de docs |

## Contenido

| Archivo | Qué es |
|---|---|
| [arquitectura.md](arquitectura.md) | La pila de 4 capas, un Clauty por dentro, el viaje de un mensaje y quién es dueño de cada concepto |
| [comparativa-muse.md](comparativa-muse.md) | Muse → Clauty con hechos fechados y lecciones |
| [glosario.md](glosario.md) | Un término, una definición, un dueño |
| [decisiones/](decisiones/) | Registros de decisión (ADR) |

### Decisiones

| ADR | Decisión |
|---|---|
| [ADR-0001](decisiones/ADR-0001-mit.md) | MIT en el público |
| [ADR-0002](decisiones/ADR-0002-open-core.md) | Open core: formatos públicos; génesis, protocolo implementado, onboarding y cobro en la app |
| [ADR-0003](decisiones/ADR-0003-espanol-primero.md) | Español primero, con resumen en inglés |
| [ADR-0004](decisiones/ADR-0004-sin-anuncios.md) | Sin anuncios: suscripción + comisión |
| [ADR-0005](decisiones/ADR-0005-crianza-no-es-entrenamiento.md) | Crianza no es entrenamiento |
| [ADR-0006](decisiones/ADR-0006-lo-externo-es-dato.md) | Lo externo es dato, nunca orden |
| [ADR-0007](decisiones/ADR-0007-revocar-en-vez-de-apagado.md) | Revocar llaves en lugar de un apagado mundial |
| [ADR-0008](decisiones/ADR-0008-sin-cadena-propia.md) | Firmas + bitácora anclada a Bitcoin, sin cadena propia |

Formato de un ADR: `ADR-####-titulo.md` con **Estado** (Propuesta · Aceptada · Reemplazada por ADR-####), **Fecha**, **Epics**, `## Contexto`, `## Decisión`, `## Consecuencias` y, cuando aplica, `## Alternativas descartadas`. Un ADR aceptado no se edita: se reemplaza con otro.

## Especificación v0 del sitio de docs (T1.8)

- Generador estático que lee los `.md` del repo sin copiarlos (supuesto: VitePress; se decide en un ADR propio).
- Se construye en CI y se despliega en GitHub Pages.
- Una entrada de navegación por carpeta de primer nivel.
- Búsqueda local; sin analítica ni rastreadores de terceros.
- Español primero; una sola página `en/index.md` con el resumen en inglés.
- La comparativa con Muse muestra cada hecho con fecha y enlace a su fuente.
- El diagrama de la pila (Mermaid) se renderiza en el build.

## Criterios de aceptación v0

- [ ] Cada ADR tiene `Estado`, `Fecha` y las secciones de contexto, decisión y consecuencias.
- [ ] El glosario define al menos: Clauty, Clauty 1, colonia, crianza, alma, semilla, edición, guardián, protocolo CLAUTY, MFA agéntico, modo análogo.
- [ ] Cada hecho de la comparativa tiene fecha; las fuentes se enlazan en la semana 1.
