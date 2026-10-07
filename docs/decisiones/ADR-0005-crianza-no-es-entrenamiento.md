# ADR-0005 · Crianza no es entrenamiento

- **Estado:** Aceptada
- **Fecha:** 2026-10-05
- **Epics:** T3.1, T3.2

## Contexto

"Criar" un agente se confunde fácilmente con entrenar un modelo de lenguaje. Esa confusión tiene costos reales: la gente teme que sus datos terminen en un modelo, y el entrenamiento es opaco, caro e irreversible.

## Decisión

La crianza agéntica cambia **archivos legibles** (alma, memoria, skills, confianza) mediante un ciclo de propuesta y aprobación, y nada más:

- Ningún evento de crianza toca pesos de un modelo ni genera datos de entrenamiento.
- El esquema del evento de crianza rechaza campos de entrenamiento o ajuste (`additionalProperties: false`).
- Cada cambio aprobado es un commit firmado; revertir es un commit nuevo.

## Consecuencias

- Todo lo que un Clauty "aprendió" se puede leer, discutir, revertir, exportar u olvidar.
- Cambiar de modelo no borra la crianza: el alma viaja con la carpeta.
- Un Clauty criado se puede adoptar sin transferir ningún modelo.
- Queda fuera, a propósito, el ajuste fino de modelos; si algún día existe, será otra cosa con otro nombre.
