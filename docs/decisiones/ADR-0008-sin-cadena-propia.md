# ADR-0008 · Firmas + bitácora anclada a Bitcoin, sin cadena propia

- **Estado:** Aceptada
- **Fecha:** 2026-10-05
- **Epics:** T7.8, T6.8, T3.4, T4.5

## Contexto

El proyecto necesita probar quién hizo qué y cuándo: la historia de crianza, la bitácora, las revocaciones, los sellos de edición. La tentación es una blockchain propia. Eso trae costo, operación, un token que nadie pidió y una pregunta sin respuesta: ¿por qué confiar en esa cadena?

## Decisión

- **Quién:** firmas Ed25519 por Clauty.
- **Qué y en qué orden:** bitácora encadenada por hashes (JSON canónico RFC 8785 + sha256).
- **Cuándo:** anclaje a Bitcoin vía OpenTimestamps. Se ancla la raíz diaria de la bitácora, cada revocación y cada sello de edición. Al calendario solo sale un hash de 32 bytes.
- No hay cadena propia, ni token, ni nodos que operar.

## Consecuencias

- Costo $0 con los calendarios públicos de OpenTimestamps.
- Cualquiera verifica con `ots verify`, sin depender de este proyecto.
- La prueba de tiempo tarda unas horas en confirmarse (cuando Bitcoin incluye el bloque); mientras tanto queda `pendiente`, y la bitácora nunca se detiene por eso.
- Ningún contenido sale: solo hashes.

## Alternativas descartadas

- **Cadena propia:** costo, operación y confianza que hay que construir de cero.
- **Sellos de tiempo de un tercero centralizado:** volvemos a depender de un servidor.
