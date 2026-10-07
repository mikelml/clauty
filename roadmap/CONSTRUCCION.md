# Roadmap de construcción — Clauty (público)

Las 461 historias de capa pública, en el orden en que conviene construirlas. La fuente es `construccion.csv` en esta misma carpeta.

| Fase | Historias | Epics | Historias por ola |
|---|---|---|---|
| 1 | 291 | 45 | ola 1: 27 · ola 2: 74 · ola 3: 67 · ola 4: 44 · ola 5: 35 · ola 6: 21 · ola 7: 14 · ola 8: 8 · ola 9: 1 |
| 2 | 135 | 18 | ola 1: 47 · ola 2: 50 · ola 3: 21 · ola 4: 7 · ola 5: 6 · ola 6: 3 · ola 7: 1 |
| 3 | 35 | 5 | ola 1: 8 · ola 2: 17 · ola 3: 9 · ola 4: 1 |

## Qué se logra al cerrar cada fase

| Fase | Hito |
|---|---|
| 1 · Clauty vivo y seguro | Se instala sobre OpenClaw en una línea; un Clauty se cría desde la semilla en blanco con aprobación (crianza como git, confianza de 20 a 100); guardián con firewalls de entrada, salida y acciones, niveles de autonomía y kill switch; identidad firmada y revocación; spec de conectores y bóveda con 1Password; chat y dashboard |
| 2 · La colonia completa | Memoria con caducidad, reflexión y skills con ciclo de vida; pedigrí, adoptar, exportar y olvidar; MFA agéntico; anclaje a Bitcoin; rutina de seguridad semanal; suite de ataques; Omarchy por voz y el video del lanzamiento |
| 3 · Expansión | Sitio de docs, voz y temperamento, galería de almas, métricas de crianza y conectores a medida |

## Cómo leer `construccion.csv`

Cada fila es un **ticket**: una historia con su criterio de aceptación, ordenada por `fase` y `ola`.

- **Fase 1:** todo lo P0, más cualquier historia de la que dependa, aunque sea P1 o P2.
- **Fase 2:** lo P1 que falte.
- **Fase 3:** lo P2.
- **Ola:** dentro de una fase, una historia cae en la ola siguiente a la última de sus dependencias. **Todo lo de una misma ola se puede construir en paralelo.**

## La regla para tomar el siguiente ticket

1. Toma la historia con la menor `(fase, ola)` cuyas `depende_de` ya estén cerradas.
2. Si tiene `dependencias_externas`, depende de algo que vive en otro repo (la app privada o el Clauty 1 de origen). No lo inventes: deja la interfaz y una nota.
3. Ciérrala solo cuando su `criterio_aceptacion` se cumpla y otro agente lo haya reproducido. Un "listo" sin evidencia no cuenta.

## Cómo se calculó (para poder repetirlo)

- Las dependencias salen de la matriz. Cuando una historia depende de un **epic completo** (por ejemplo, `T6.2`), se toma como dependencia la **primera historia** de ese epic, que es la que fija su especificación.
- Leídas al pie de la letra, esas 334 referencias a epics completos forman un nudo de 38 epics que dependen unos de otros en círculo. Con la regla anterior, el grafo de historias tiene **0 ciclos**.
- Refinamiento de la semana 1: cambiar en la matriz esas referencias por ids de historia, para que la regla deje de hacer falta.
