# ADR-0002 · Open core

- **Estado:** Aceptada
- **Fecha:** 2026-10-05
- **Epics:** T1.3, T5.6

## Contexto

Clauty necesita dos cosas que tiran en sentidos opuestos: formatos abiertos para que la gente confíe y adopte, y un producto que pague el proyecto. Muse demostró que el producto completo es enorme; ningún formato abierto sobrevive si depende de que el producto también sea abierto.

## Decisión

Dos repos, una frontera clara.

## Qué es público

- Los **formatos**: la carpeta de un Clauty, el alma, la memoria, la reflexión, las skills, la confianza, el evento de crianza, el paquete `.clauty`, la edición.
- Las **specs**: el protocolo CLAUTY y sus vectores de prueba, los conectores, la bóveda, el consentimiento.
- La **semilla** en blanco, las skills base y el instalador sobre OpenClaw.
- Las **políticas** del guardián, el modelo de amenazas y la suite de ataques.
- Las herramientas de referencia que validan todo lo anterior (validador, verificadores).

## Qué vive en la app

- La **génesis**: cómo nace un Clauty de tus temas.
- El **protocolo implementado**.
- El **onboarding**.
- El **cobro**.

La app fija un tag de este repo y consume sus formatos por versión. Este repo no describe cómo funciona nada de lo anterior por dentro.

## Consecuencias

- Criar y adoptar funcionan con este repo solo; nacer requiere la app.
- Cualquiera puede escribir otra implementación compatible: los vectores de prueba lo hacen posible.
- Un script de CI verifica que este repo no contenga código de génesis.
