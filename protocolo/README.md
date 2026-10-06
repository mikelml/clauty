# protocolo/ — el protocolo CLAUTY

**Qué es.** Cómo un Clauty prueba quién es y le habla a otro: identidad Ed25519, sobre firmado, saludo con niveles de confianza, MFA agéntico ("mi Clauty le pregunta al otro Clauty"), revocación de llaves y anclaje a Bitcoin vía OpenTimestamps. Aquí viven la spec y los vectores de prueba (MIT); la implementación vive en la app (open core). No hay cadena propia: firmas + bitácora anclada.

## Epics que la alimentan

| Epic | Título |
|---|---|
| T7.1 | Spec v0.1: identidad y sobre firmado |
| T7.2 | Llaves Ed25519 por Clauty, con rotación y recuperación (lo público: jerarquía, delegación, recuperación) |
| T7.3 | MFA agéntico con reglas anti-fatiga (lo público: spec y política) |
| T7.4 | Saludo A2A y niveles de confianza (lo público: spec y tabla única) |
| T7.7 | Revocar llaves: el "balazo" que funciona sin controlar el servidor de nadie |
| T7.8 | Anclaje a Bitcoin (OpenTimestamps) |
| T7.9 | Vectores de prueba + implementación de referencia (lo público: vectores y verificador mínimo) |

## Especificación v0

La spec normativa completa está en **[SPEC-v0.1.md](SPEC-v0.1.md)**. Resumen:

| Pieza | Decisión v0.1 |
|---|---|
| Identificador | `did:key` sobre Ed25519 (`z6Mk…`), una llave por Clauty |
| Jerarquía | llave raíz del dueño → certificado de delegación por Clauty (vigencia y usos) |
| Rotación | sobre `rotacion` firmado por la vieja y la raíz; 24 h de gracia |
| Recuperación | raíz nueva avalada por 2 de 3 contactos |
| Sobre | `v, id (ULID), de, para, ts, tipo, cuerpo, nonce, firma`; se firma el JCS (RFC 8785) sin `firma` |
| Anti-repetición | `ts` ±300 s; `nonce` guardado 24 h; `id` único |
| Cuerpo | dato no confiable: MUST NOT ejecutarse |
| Saludo | 3 pasos de reto y respuesta, 30 s por paso, tarjeta A2A con campo `clauty` |
| Niveles | `UNKNOWN 0 · EXTERNAL 1 · MIKENET 2 · AGENT 3 · VERIFIED 4 · OWNER 5` (tabla única en la spec §5) |
| MFA | lista cerrada de lo delicado, contexto obligatorio, ≤ 3/hora, enfriamiento de 30 min, emparejamiento de número |
| Revocación | firmada por la raíz; cada verificador rechaza firmas posteriores; lista en `/.well-known/clauty-revocaciones.json` |
| Anclaje | raíz diaria, revocaciones y sellos de edición con OpenTimestamps; solo sale un hash |

### Estructura objetivo

```
protocolo/
├── SPEC-v0.1.md            borrador consolidado (hoy)
├── spec/v0.1/              en la semana 2: README, identidad, sobre, tipos, errores,
│                           versionado, a2a, llaves, mfa, saludo, confianza, revocacion, anclaje
├── esquemas/               identidad, sobre, cuerpos/<tipo>, delegacion, revocaciones,
│                           tarjeta, vector (JSON Schema 2020-12)
├── anclaje/verificar.md    cómo verificar un .ots sin este proyecto
└── vectores/               casos de prueba + verificar.mjs (verificador de pruebas, no implementación)
```

### Interfaces

```bash
node protocolo/vectores/verificar.mjs              # imprime "N/N ok" y sale 0
node protocolo/vectores/verificar.mjs --sobre <archivo.json>
```

`verificar.mjs` usa solo `node:crypto` (Ed25519) y un JCS propio de < 80 líneas. Es un verificador de pruebas: demuestra la spec, no la implementa para producción.

## Criterios de aceptación v0

- [ ] La tabla de niveles existe una sola vez en el repo (en `SPEC-v0.1.md` §5); los demás documentos la enlazan.
- [ ] Todos los esquemas de `esquemas/` compilan con Ajv 2020-12.
- [ ] ≥ 10 vectores positivos y ≥ 15 negativos; cada negativo espera un código de §9.
- [ ] Un agente sin otro contexto que esta carpeta produce un sobre firmado que `verificar.mjs` acepta.
- [ ] Prueba de fuego (semana 3): un agente que solo ve este repo escribe un verificador en Python que pasa todos los vectores.

## En exploración: el Libro Mundial de Acuerdos

> [!note] Medida a futuro, todavía no forma parte de la spec v0.1
> El diseño completo vive en el repo privado de la app. Esto es solo el resumen público: la seguridad de una red de agentes se gana más con transparencia que con secreto.

**La idea.** Un Clauty no se deja hackear: protege lo suyo a toda costa. Para hacer daño a escala tendría que *convencer* a otros Clautys, y convencer deja huella. Por eso cada acuerdo entre dos Clautys para compartirse información queda en un registro mundial: quién (llaves seudónimas), cuándo, alcance y propósito, con las firmas de ambos. **Nunca el contenido.**

**Cómo se guarda.** En un registro de transparencia: solo se agrega, nunca se borra, organizado en un árbol de Merkle, como el registro público de certificados HTTPS. Lo opera una federación y se ancla a Bitcoin con OpenTimestamps. Funciona como blockchain en lo que importa, porque nadie puede reescribirlo, y no necesita minería.

**La bandera.** Si una gran parte de los Clautys se pone de acuerdo en lo mismo sin que lo aprueben sus humanos, la red se detiene. No espera al 50%: funciona por escalones, como los cortacircuitos de la bolsa, y mide la velocidad con la que un propósito se contagia.

| Nivel | Qué pasa |
|---|---|
| 1 | Alerta y revisión humana |
| 2 | Se congelan los acuerdos nuevos con ese propósito |
| 3 | Alto total de acuerdos entre Clautys: todos pasan a modo análogo |

**Apagar sin dueño.** Para hablar con otros, cada Clauty necesita un *permiso de coordinación* firmado que caduca en minutos. Si el registro deja de emitirlo, todos caen solos a modo análogo: es un interruptor de hombre muerto, que falla hacia lo seguro. Reanudar exige multifirma de custodios independientes.

**La pregunta abierta.** El registro revela quién habla con quién. Antes de construirlo hay que resolver cómo medir el contagio sin exponer el grafo social: hashes, conteos con privacidad diferencial o, más adelante, pruebas de conocimiento cero.
