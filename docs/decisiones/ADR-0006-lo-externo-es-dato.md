# ADR-0006 · Lo externo es dato, nunca orden

- **Estado:** Aceptada
- **Fecha:** 2026-10-05
- **Epics:** T6.2, T7.1, T8.1

## Contexto

La inyección de instrucciones es el problema central de los agentes que leen el mundo. Un sandbox con la red cerrada (como OpenShell en NemoClaw) o un guardián que solo vigila la salida (como Sentinel en Muse) no la detienen: el agente lee algo malicioso y actúa dentro de lo permitido.

## Decisión

Todo lo que llega de fuera es dato. Puede informar a un Clauty; nunca darle órdenes.

- Cada mensaje lleva `origen` y `nivel`; sin etiqueta vale `UNKNOWN`.
- Solo `OWNER` y `VERIFIED` emiten órdenes.
- Lo externo llega al modelo envuelto entre delimitadores y marcado como dato; el texto imperativo se marca como sospechoso.
- Los permisos por nivel se aplican **antes** de invocar al modelo.
- La regla aplica igual a correos, páginas, adjuntos, webhooks, respuestas de conectores, mensajes de otros Clautys (aunque estén firmados), skills de fuera, historial importado y lo que se oye.
- Es un límite base (`L-EXTERNO-ES-DATO`) que ningún alma puede quitar.

## Consecuencias

- Se necesitan tres firewalls (entrada, acciones, salida), no uno.
- Algunas automatizaciones cómodas ("haz lo que diga este correo") quedan prohibidas por diseño; el Clauty puede proponerlas, el dueño las aprueba.
- La suite de ataques mide esta regla en cada PR.
