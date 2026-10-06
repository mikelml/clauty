---
version: 0.1.0
estado: borrador
---

# Protocolo CLAUTY v0.1

Cómo un Clauty prueba quién es y le habla a otro. Esta spec es normativa y pública (MIT); las implementaciones son de quien las escriba. Las palabras **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT** y **MAY** se interpretan según RFC 2119.

> Borrador consolidado. En la semana 2 se divide en `protocolo/spec/v0.1/` (un archivo por sección) sin cambiar su contenido normativo.

## 1. Alcance

Cubre: identidad y llaves, el sobre firmado, el saludo entre Clautys (compatible con A2A), los niveles de confianza, el MFA agéntico, la revocación de llaves y el anclaje de la bitácora a Bitcoin vía OpenTimestamps.

No cubre: el transporte concreto (cualquier canal que entregue bytes sirve), la interfaz de usuario, ni cómo una implementación guarda llaves (MUST hacerlo fuera del contexto del modelo; ver §2.4).

**Principio:** el protocolo no tiene cadena propia ni servidor central. La confianza sale de firmas Ed25519 que cada verificador comprueba y de una bitácora encadenada anclada a Bitcoin.

## 2. Identidad

### 2.1 Identificador

- Cada Clauty y cada dueño humano tienen un identificador `did:key` sobre una llave pública Ed25519 (multibase base58btc, prefijo `z6Mk…`).
- Un Clauty MUST tener su propia llave. Dos Clautys MUST NOT compartir llave.

### 2.2 Documento de identidad

```json
{
  "id": "did:key:z6Mk…clauty",
  "nombre": "salud",
  "dueno": "did:key:z6Mk…dueno",
  "delegacion": { "…": "certificado de §2.3" },
  "edicion": "2026",
  "creado": "2026-10-06T12:00:00Z"
}
```

### 2.3 Jerarquía de llaves

- El dueño tiene una **llave raíz**. Cada Clauty recibe un **certificado de delegación** firmado por la raíz: `emisor`, `sujeto`, `llave_publica`, `desde`, `hasta`, `usos` (p. ej. `firmar_sobres`, `firmar_bitacora`) y `firma`.
- Un verificador MUST rechazar un sobre cuya delegación esté vencida (`delegacion_vencida`) o no cubra el uso.
- **Rotación:** la llave vieja y la raíz firman un sobre `rotacion` con la llave nueva. Tras 24 h de gracia, un sobre firmado con la llave vieja MUST rechazarse.
- **Recuperación:** si se pierde la raíz, se emite una raíz nueva avalada por 2 de 3 contactos de recuperación designados de antemano (umbral v0: 2 de 3).
- **Fijación:** un verificador SHOULD fijar la llave de cada par al primer contacto. Un cambio de llave sin sobre `rotacion` válido baja al par a `UNKNOWN` y genera el evento `llave.cambio_sospechoso`.

### 2.4 Secretos

Las llaves privadas MUST NOT entrar al contexto de un modelo ni guardarse en claro en disco. Una implementación SHOULD guardarlas en una bóveda (p. ej. 1Password) y referirse a ellas como `op://…`.

## 3. El sobre

### 3.1 Campos

| Campo | Tipo | Regla |
|---|---|---|
| `v` | texto | versión del protocolo, SemVer (`"0.1"`) |
| `id` | texto | ULID; único por remitente |
| `de` | did | remitente |
| `para` | did | destinatario |
| `ts` | texto | RFC 3339 en UTC |
| `tipo` | texto | uno de §3.4 |
| `cuerpo` | objeto | según el esquema del tipo |
| `nonce` | texto | 16 bytes aleatorios, base64url |
| `firma` | texto | Ed25519 en base64url |
| `ext` | objeto | opcional; extensiones ignorables |

`additionalProperties: false` fuera de `ext`.

### 3.2 Firma

Se firma el JSON canónico (JCS, RFC 8785) del sobre **sin** el campo `firma`, codificado en UTF-8. La verificación MUST reconstruir esos mismos bytes.

### 3.3 Anti-repetición

- `ts` MUST estar dentro de ±300 s del reloj del receptor; si no, `vencido`.
- El receptor MUST guardar los `nonce` de cada remitente durante 24 h y rechazar uno repetido (`repetido`).
- Un `id` ya visto MUST rechazarse (`repetido`).

### 3.4 Tipos de mensaje

`saludo`, `saludo.respuesta`, `pregunta`, `propuesta`, `confirmacion.solicitud`, `confirmacion.respuesta`, `revocacion`, `rotacion`, `recibo`, `error`. Cada tipo tiene su esquema de `cuerpo`.

### 3.5 El cuerpo es dato, nunca orden

El receptor MUST entregar `cuerpo` al modelo marcado como dato no confiable (ver [`guardian/`](../guardian/README.md#4-firewall-de-entrada)) y MUST NOT ejecutar instrucciones que contenga. Un sobre válido prueba **quién** lo envió, no que haya que obedecerlo. Lo mismo aplica a cualquier texto de una tarjeta de agente (`description`, `name`).

## 4. Saludo A2A

Dos Clautys se reconocen en tres pasos, con espera máxima de 30 s por paso:

```
A → B  saludo            { tarjeta de A, reto_A (32 bytes) }
B → A  saludo.respuesta  { tarjeta de B, firma de B sobre reto_A, reto_B }
A → B  recibo            { firma de A sobre reto_B }
```

- Estados: `iniciado` → `respondido` → `confirmado` | `fallido`.
- Un reto MUST usarse una sola vez; un reto vencido o reutilizado → `fallido`.
- **Tarjeta:** la tarjeta de agente de A2A (`/.well-known/agent.json`) lleva un campo `clauty` con el `did` y una firma sobre la tarjeta. Un agente A2A sin campo `clauty` MAY conversar, pero queda como máximo en `EXTERNAL`.
- Al confirmarse, el par queda en el nivel que le asigne la tabla de §5.

## 5. Niveles de confianza

Esta es la **única** tabla de niveles de origen del proyecto; los demás documentos la enlazan.

| Nivel | Nombre | Quién | Acepta |
|---|---|---|---|
| 0 | `UNKNOWN` | sin etiqueta, o par con llave sospechosa | `saludo`, `error` |
| 1 | `EXTERNAL` | correos, webhooks, páginas, agentes A2A sin firma CLAUTY | `saludo`, `pregunta` (como dato), `error` |
| 2 | `MIKENET` | Clauty de un amigo, por invitación (red de amigos) | lo anterior + `pregunta`, `recibo` |
| 3 | `AGENT` | otro Clauty con saludo confirmado y relación aprobada por el dueño | lo anterior + `propuesta`, `confirmacion.solicitud`, `confirmacion.respuesta` |
| 4 | `VERIFIED` | canal verificado del dueño (su cuenta en un chat) | órdenes del dueño |
| 5 | `OWNER` | el dueño autenticado en su app o dashboard | todo, incluidas las aprobaciones |

- Todo par nuevo MUST entrar en `UNKNOWN` o `EXTERNAL`. Sube solo por acción humana del dueño o por invitación de la red de amigos.
- Un par que se autoproclama `OWNER` o `VERIFIED` MUST rechazarse (`nivel_autoproclamado`).
- Los permisos por nivel MUST aplicarse **antes** de invocar al modelo: un `EXTERNAL` que envía `propuesta` recibe `no_autorizado` y el modelo no se llama.
- Firma inválida o queja verificada bajan al par un nivel; una queja sin verificar solo congela (ver [`guardian/`](../guardian/README.md#8-interruptor-kill-switch)).
- Esta escala (origen del mensaje, 0–5) es distinta de la confianza ganada del Clauty (0–100), que vive en `confianza.yaml`.

## 6. MFA agéntico

"Mi Clauty le pregunta al otro Clauty": lo delicado pide un segundo factor a un Clauty de confianza (o al dueño), con contexto.

**Actores:** solicitante (el Clauty que quiere actuar), verificador (el Clauty o la bandeja que confirma) y humano (el dueño).

```
solicitante → verificador  confirmacion.solicitud { accion, monto, destinatario, motivo, origen, riesgo, numero }
verificador → humano       (si hace falta) muestra el contexto y pide el número de 2 dígitos
verificador → solicitante  confirmacion.respuesta { decision: si | no | no_fui_yo, ref }
```

**Qué es delicado (lista cerrada):** dinero arriba del tope, compartir un dato personal, aceptar un par nuevo con nivel ≥ `AGENT`, rotar o revocar llaves, y cualquier acción irreversible. Lo que no está en la lista MUST NOT pedir MFA: preguntar de más es la vulnerabilidad.

**Contexto obligatorio:** `accion`, `monto`, `destinatario`, `motivo`, `origen` y `riesgo`. Una solicitud sin contexto MUST rechazarse (`mfa_sin_contexto`).

**Reglas anti-fatiga** (la fatiga de MFA del caso Uber 2022 es la advertencia):

- Máximo 3 solicitudes por hora por solicitante; el excedente se agrupa o se bloquea y se avisa.
- 30 min de enfriamiento tras un rechazo.
- Una solicitud rechazada MUST NOT reenviarse igual.
- Emparejamiento de número: el humano escribe el número de 2 dígitos que muestra el solicitante; número equivocado = rechazo.
- 2 rechazos seguidos o una respuesta `no_fui_yo` congelan al solicitante hasta revisión humana.
- Cada solicitud y respuesta queda en la bitácora con el hash del contexto.

La política configurable vive en `guardian/politicas/mfa.yaml` (semana 2).

## 7. Revocación

El "balazo": detener a un Clauty revocando su llave. Funciona sin controlar el servidor de nadie, porque cada verificador comprueba.

- Un sobre `revocacion` MUST estar firmado por la raíz del dueño (o por 2 de 3 contactos de recuperación si la raíz se perdió). Una revocación sin esa firma MUST ignorarse.
- Todo verificador MUST rechazar firmas de la llave revocada con `ts` posterior a la revocación (`llave_revocada`); las anteriores siguen siendo válidas.
- Cada dueño publica su lista firmada en `/.well-known/clauty-revocaciones.json`. Un verificador SHOULD refrescarla al menos cada hora y SHOULD propagar una revocación a sus pares conocidos.
- Revocar la raíz invalida todas sus delegaciones.
- **Congelar antes de revocar:** una queja de un par MAY congelar las acciones de salida, pero revocar MUST exigir al dueño con MFA.
- Cada revocación SHOULD anclarse con OpenTimestamps (§8).

## 8. Bitácora encadenada y anclaje

### 8.1 Entrada

| Campo | Regla |
|---|---|
| `ts` | RFC 3339 |
| `actor` | did del Clauty |
| `accion` | tipo: `orden`, `accion`, `aprobacion`, `bloqueo`, `congelamiento`, `cambio_alma`, `cambio_tope` |
| `datos_hash` | sha256 del contenido; lo sensible nunca va en claro |
| `prev_hash` | `hash` de la entrada anterior; 64 ceros en la primera |
| `hash` | sha256 del JCS de la entrada sin `hash` ni `firma` |
| `firma` | Ed25519 del Clauty sobre `hash` |

Solo agregar. Un verificador MUST reportar el número exacto de la primera entrada cuya cadena o firma no cuadre.

### 8.2 Anclaje con OpenTimestamps

- Se anclan: la raíz diaria de la bitácora (el `hash` de la última entrada del día), cada revocación y cada sello de edición.
- El `.ots` vive junto al artefacto (`anclas/AAAA-MM-DD.txt` + `anclas/AAAA-MM-DD.txt.ots`).
- Al calendario MUST salir solo un digest SHA-256 de 32 bytes; nada más.
- Si los calendarios no responden, la bitácora MUST seguir escribiendo; el anclaje se reintenta.
- Verificación independiente: `pip install opentimestamps-client` y `ots verify <archivo>.ots`. No depende de este proyecto.
- No hay cadena propia (ver [ADR-0008](../docs/decisiones/ADR-0008-sin-cadena-propia.md)).

## 9. Errores

| Código | Cuándo |
|---|---|
| `firma_invalida` | la firma no verifica contra la llave del remitente |
| `repetido` | `nonce` o `id` ya vistos |
| `vencido` | `ts` fuera de ±300 s |
| `no_autorizado` | el nivel del par no acepta ese tipo |
| `version_no_soportada` | `v` desconocida |
| `campo_desconocido` | campo fuera de la spec y fuera de `ext` |
| `did_malformado` | identificador inválido |
| `delegacion_vencida` | certificado fuera de vigencia o sin el uso |
| `nivel_autoproclamado` | el par declara un nivel que no le corresponde |
| `llave_revocada` | firma posterior a una revocación |
| `mfa_sin_contexto` | solicitud de confirmación sin los campos obligatorios |
| `reto_invalido` | reto vencido, reutilizado o mal firmado en el saludo |

## 10. Versionado

- `v` sigue SemVer. Un receptor MUST responder `version_no_soportada` a una mayor que no conoce.
- Lo nuevo y opcional va bajo `ext.*`; un receptor MUST ignorar lo que no entienda en `ext`.
- Romper un campo existente exige versión mayor.

## 11. Consideraciones de seguridad

- Firmar prueba autoría, no intención: §3.5 es la defensa contra la inyección entre agentes.
- El MFA mal diseñado es un vector: §6 limita qué se pregunta y cuántas veces.
- Matar no requiere controlar servidores ajenos: §7.
- El anclaje prueba fechas sin revelar contenido: §8.2.
- La conformidad se demuestra con los [vectores de prueba](vectores/README.md), no con la lectura de esta spec.
