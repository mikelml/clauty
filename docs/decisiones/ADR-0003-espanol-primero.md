# ADR-0003 · Español primero

- **Estado:** Aceptada
- **Fecha:** 2026-10-05
- **Epics:** T1.2, T1.8

## Contexto

Casi todo el software de agentes se escribe primero en inglés. Las personas para las que nace Clauty piensan, hablan y deciden en español, y una decisión escrita en otro idioma se vuelve ajena para quien la tomó.

## Decisión

Todo el contenido se escribe en español. El inglés va en secciones breves `## In English` (README, guía de crianza, contribución) y en una sola página de resumen del sitio de docs. La semilla nace con `idioma: es-MX` y la bienvenida del primer mensaje es en español con una línea en inglés; si el sistema está en otro idioma, el Clauty responde en ese idioma.

## Consecuencias

- El proyecto se distingue de inmediato y llega a un público desatendido.
- Quien no lee español tiene lo necesario para instalar y entender, pero no la spec completa; las contribuciones en inglés son bienvenidas y se integran en español.
- Las claves de los formatos están en español (`limites`, `caduca`, `confianza`), sin acentos para no romper herramientas.

## Alternativas descartadas

- **Inglés primero con traducción:** dos fuentes que se desincronizan.
- **Bilingüe completo:** el doble de trabajo y un dueño ambiguo por concepto.
