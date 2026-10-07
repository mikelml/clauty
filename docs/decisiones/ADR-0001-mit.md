# ADR-0001 · MIT en el público

- **Estado:** Aceptada
- **Fecha:** 2026-10-05
- **Epics:** T1.3

## Contexto

El repo público tiene que viralizarse: que cualquiera lo instale, lo copie a su OpenClaw, lo critique y lo mejore sin pedir permiso. OpenClaw, la capa de abajo, es MIT. El negocio no vive en este repo sino en la app privada.

## Decisión

Todo el contenido de `clauty` (specs, esquemas, políticas, semilla, scripts y documentación) se publica bajo licencia MIT. Cada paquete público declara `"license": "MIT"` y cada archivo de código propio lleva `SPDX-License-Identifier: MIT`. Las dependencias de terceros deben ser compatibles (MIT, Apache-2.0, BSD, ISC, 0BSD, CC0).

## Consecuencias

- La licencia más simple y la misma de OpenClaw: cero fricción para adoptarlo.
- Cualquiera puede construir su propia implementación de los formatos, incluso comercial. Es lo que queremos: un formato que muchos usan vale más que uno cerrado.
- No regalamos el negocio: la génesis, el protocolo implementado, el onboarding y el cobro no están aquí (ver [ADR-0002](ADR-0002-open-core.md)).
- MIT no cubre el nombre ni el logo; su uso se documentará aparte.

## Alternativas descartadas

- **Apache-2.0:** buena protección de patentes, pero más texto y distinta de OpenClaw.
- **AGPL:** frena justo la adopción que buscamos.
- **Sin licencia:** legalmente nadie podría usarlo.
