# Comparativa: Muse → Clauty

> Hechos de Muse con fecha, tal como se conocían al 6 de octubre de 2026. Las fuentes públicas se enlazan en la semana 1 del refinamiento (columna *Fuente*); un hecho sin fuente enlazada cuenta como pendiente de verificar.

## Por qué esta página

Muse, de Meta, se anunció en septiembre de 2026 y hace casi todo lo que el pitch de Clauty proponía meses antes: un agente personal que consulta y actúa en tu nombre, con un guardián que aprueba lo que sale. No es un rival al que haya que descalificar: es la mejor prueba de que la idea tiene sentido. Esta página dice qué hace bien, en qué apuesta Clauty distinto y qué aprendimos de sus primeras semanas.

## La tabla

| Muse | Clauty |
|---|---|
| El agente | tu Clauty ([`alma/`](../alma/README.md), [`semilla/`](../semilla/README.md)) |
| Secure VM | OpenClaw en tu máquina o VPS |
| Sentinel | [`guardian/`](../guardian/README.md) |
| Conectores | [`conectores/`](../conectores/README.md) |
| Contraseñas en bóveda / 1Password | 1Password en [`conectores/`](../conectores/README.md) |
| Muse for Small Business | [`negocios/`](../negocios/README.md) |
| Charm / lentes | [`superficies/`](../superficies/README.md) (Larynx, Omarchy por voz) |
| Confidential VM | autoalojado por diseño |

## Hechos de Muse, con fecha

| Fecha | Hecho | Fuente |
|---|---|---|
| 8-sep-2026 | Meta anuncia Muse, disponible solo en EE. UU. | pendiente |
| 8-sep-2026 | Corre en una "Secure VM" dedicada por usuario, con navegador propio | pendiente |
| 8-sep-2026 | "Sentinel" es un agente separado, en la misma máquina, que aprueba todo lo que sale a internet y separa permisos de lectura y escritura | pendiente |
| 8-sep-2026 | Conectores de consulta (Gmail, Calendar, Outlook) y de acción (Plaid, OpenTable) | pendiente |
| 8-sep-2026 | Pagos con Link de Stripe (tarjetas de un solo uso) y soporte de 1Password | pendiente |
| 8-sep-2026 | En pruebas internas, pasa llamadas telefónicas a personas capacitadas | pendiente |
| 8-sep-2026 | Precios: gratis, Power (US$20 al mes) y Maximum (US$100 al mes); sin anuncios; comisión por transacción | pendiente |
| 18-sep-2026 | Se abre la plataforma: conectores de directorio (revisados por Meta) y a medida (Muse los arma desde cualquier API, sin revisión) | pendiente |
| 21-sep-2026 | Amazon bloquea a Muse | pendiente |
| 23-sep-2026 | Muse Charm: llavero con pantalla de 2 pulgadas, botón de huella para hablar, cámara y 5G; a la venta en diciembre | pendiente |
| 28-sep-2026 | AppleInsider reporta que Muse leyó Mensajes de una Mac sin permiso | pendiente |
| 29-sep-2026 | Muse for Small Business, con integraciones de Shopify, Slack, Asana, Zoom, Intuit, Box y Canva | pendiente |
| anunciado | Vienen lentes y una "Confidential VM" | pendiente |

## Lo que Muse hace bien

- **Separar al que actúa del que aprueba.** Sentinel como agente aparte es la decisión correcta; el guardián de Clauty parte de la misma idea.
- **Lectura y escritura separadas** por conector.
- **Tarjetas de un solo uso** para pagar: el agente nunca tiene una tarjeta real.
- **Sin anuncios**, con suscripción y comisión. Clauty llegó al mismo modelo por su cuenta.
- **Escala y pulido:** conectores, hardware y alianzas que un proyecto abierto no tiene el primer día.

## En qué apuesta Clauty distinto

| Tema | Muse | Clauty |
|---|---|---|
| Unidad | un asistente | una colonia: "eres los 10 Clautys que usas" |
| Cómo cambia | configuración y aprendizaje del producto | crianza: propuestas que tú apruebas, commits firmados; crianza no es entrenamiento |
| Formatos | del producto | abiertos (MIT), legibles a mano, exportables |
| Dónde corre | VM del proveedor | tu máquina o tu VPS |
| Guardián | de salida | de salida **y de entrada**: lo externo es dato, nunca orden |
| Conectores a medida | sin revisión | permitidos, con aviso, solo consultas al nacer e insignia visible |
| Apagado | del proveedor | por Clauty: revocar su llave funciona sin controlar servidores ajenos |
| Historia | interna | bitácora encadenada y anclada a Bitcoin, verificable por cualquiera |
| Si se apaga | — | modo análogo: todo sigue a mano |
| Disponibilidad | EE. UU. | donde corra OpenClaw; español primero |

## Lecciones que entran al modelo de amenazas

- **Los conectores a medida sin revisión son superficie de ataque.** Clauty los permite, pero nacen solo con consultas y con aviso ([`conectores/`](../conectores/README.md#7-conectores-a-medida)).
- **Un guardián de salida no detiene la inyección.** Si el agente lee algo malicioso y actúa dentro de lo permitido, Sentinel aprueba algo legítimo en forma. Por eso Clauty tiene firewall de entrada y de acciones (AMZ-05).
- **Los permisos del sistema importan tanto como los del agente.** El reporte del 28 de septiembre sobre Mensajes es un recordatorio de que lo que el agente puede leer en la máquina también es superficie.
- **Las plataformas pueden cerrar la puerta.** El bloqueo de Amazon (21 de septiembre) muestra que un agente que navega depende de que lo dejen entrar; Clauty prefiere conectores declarados y modo análogo.

Las mismas lecciones aplican a NemoClaw (NVIDIA): su sandbox OpenShell cierra la red por defecto y define políticas en YAML, pero no detiene la inyección de instrucciones: el agente puede operar dentro de sus límites haciendo algo no autorizado.
