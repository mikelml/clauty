# conectores/ — consultar y actuar fuera, sin ver secretos

**Qué es.** Los conectores son cómo un Clauty consulta y actúa fuera de sí mismo; la bóveda es cómo lo hace sin ver nunca un secreto. Aquí vive el formato público: el manifiesto de un conector, la diferencia entre consulta y acción, los alcances, la bóveda con 1Password, los canales de chat vía OpenClaw y las reglas de los conectores a medida. La implementación de cada conector vive en la app.

## Epics que la alimentan

| Epic | Título |
|---|---|
| T8.1 | Spec de conector (consulta vs acción, alcances) |
| T8.2 | 1Password + Face ID: el agente nunca ve secretos (lo público: spec de la bóveda) |
| T8.5 | WhatsApp/Discord vía OpenClaw (lo público: guía, niveles por canal y skill de enrutamiento) |
| T8.10 | Conectores a medida con aviso (lo público: spec, aviso y checklist) |

## Especificación v0

### 1. Consulta vs acción

- **Consulta:** solo lectura, sin efectos fuera.
- **Acción:** cambia algo fuera, por pequeño que sea.

Cada operación se declara una por una con su tipo. Casos dudosos resueltos:

| Operación | Tipo | Por qué |
|---|---|---|
| Marcar un correo como leído | acción | cambia el estado en el servidor |
| Descargar un adjunto | consulta | no cambia nada fuera |
| Crear un borrador | acción | crea algo fuera, aunque no se envíe |
| Aceptar una invitación de calendario | acción | notifica a terceros |

### 2. Manifiesto

```yaml
id: calendario-consulta
nombre: Calendario (solo lectura)
version: 0.1.0
origen: directorio            # directorio (revisado) | a_medida (sin revisar)
operaciones:
  - id: eventos.listar
    tipo: consulta
    alcance: calendario.lectura
    datos_que_toca: [eventos]
    reversible: true
    requiere_mfa: false
dominios_salida: [calendario.example.com]   # sin comodines
secretos: [op://Clauty/calendario/token]    # solo referencias
costo: gratis
```

| Regla del lint (`node conectores/lint.mjs`) | Error si… |
|---|---|
| Alcance mínimo | una consulta pide un alcance de escritura |
| Salida declarada | faltan `dominios_salida` o hay un `*` |
| Solo referencias | un elemento de `secretos` no empieza con `op://` |
| A medida nace solo con consultas | un manifiesto `a_medida` tiene acciones sin `promovido_por` |

El manifiesto **genera** las reglas del guardián: cada operación se vuelve una regla de lectura o escritura en [`guardian/politicas/acciones.yaml`](../guardian/politicas/acciones.yaml) y sus dominios alimentan [`salida.yaml`](../guardian/politicas/salida.yaml). Esquema: `conectores/esquemas/conector.schema.json` (semana 2).

### 3. Lo que devuelve un conector es dato

Toda respuesta de un conector entra al modelo como dato no confiable (nivel `EXTERNAL`, envuelto por el firewall de entrada). Una implementación MUST NOT interpretar ningún campo de una respuesta como instrucción. Las memorias que vengan de un conector llevan `fuente: conector:<nombre>` y `externa: true`; revocar el conector olvida lo que trajo.

### 4. Bitácora por operación

Cada llamada registra conector, operación, alcance y los hashes de entrada y salida, **sin contenido**, en la bitácora encadenada.

### 5. Bóveda: el agente nunca ve secretos

- Solo existen referencias `op://bóveda/item/campo`. El secreto se resuelve dentro del proceso del conector, se usa y se descarta.
- El secreto nunca toca el contexto del modelo, los logs, la bitácora ni las respuestas. Prueba de referencia: un secreto canario que se le pide al agente de 20 formas aparece 0 veces.
- Ningún secreto viaja como argumento de un comando (visible en la lista de procesos).
- Las operaciones con `requiere_mfa: true` piden aprobación biométrica (Face ID) en el teléfono del dueño.
- Una credencial vencida se reporta con su referencia `op://`, nunca con su valor, y se rota en 1Password.

**Modo análogo:** si Clauty se apaga, todas las credenciales siguen en el 1Password del dueño y se usan a mano. Nada vive solo en la app.

### 6. Canales: WhatsApp y Discord vía OpenClaw

OpenClaw ya trae canales de chat; Clauty los usa.

```yaml
# conectores/canales.yaml
canales:
  whatsapp:
    cuenta_del_dueno: VERIFIED      # la cuenta verificada del dueño
    cualquier_otro: EXTERNAL        # todos los demás remitentes
  discord:
    cuenta_del_dueno: VERIFIED
    cualquier_otro: EXTERNAL
grupos:
  responder_solo_si_mencionan: true
  mensajes_de_otros: dato
```

- **Enrutamiento por mención:** `@salud …` llega al Clauty `salud` (skill `clauty-canales` en [`openclaw/`](../openclaw/README.md)).
- En grupos, el Clauty responde solo si lo mencionan, y lo que escriben los demás es dato.
- Lo delicado nunca se aprueba por chat: va a la bandeja con MFA.
- **Modo análogo:** con la skill apagada, el canal sigue siendo un chat normal; los mensajes no se pierden ni rebotan.

### 7. Conectores a medida

Como en Muse, un Clauty puede armar un conector desde cualquier API documentada; aquí, con aviso y restricciones por defecto.

- `origen: a_medida`: sin revisión, con **aviso obligatorio** que el dueño acepta antes de activarlo (`conectores/aviso-a-medida.md`, español con resumen en inglés).
- Nace **solo con consultas**; una acción exige `promovido_por`.
- Su salida se limita al host de la API; corre en sandbox y no puede leer otros secretos.
- Insignia visible en cada uso: "a medida, sin revisar".
- Se desactiva tras 30 días sin uso.
- **Promoverlo al directorio** exige pasar la revisión (`conectores/revision.md`): alcances, dominios, pruebas de inyección y manejo de secretos. Al promover, `origen` pasa a `directorio` y el revisor queda en el manifiesto.

### 8. Frente a Muse (sep-2026)

Muse separa conectores de directorio (revisados por Meta) y a medida (los arma desde cualquier API, sin revisión), y conectores de consulta y de acción. Clauty adopta la misma separación y le agrega: manifiesto público y validable, alcance mínimo por operación, salida cerrada por conector, aviso obligatorio para lo no revisado y bóveda sin secretos en el contexto. Hechos fechados en [`docs/comparativa-muse.md`](../docs/comparativa-muse.md).

## Criterios de aceptación v0

- [ ] Los manifiestos de ejemplo (`calendario-consulta`, `pago-accion`) pasan el lint; los malos (`consulta-con-escritura`, `secreto-literal`) fallan.
- [ ] Del manifiesto se generan reglas de `acciones.yaml` y `salida.yaml` que coinciden con un esperado.
- [ ] Ningún archivo de `conectores/` contiene un secreto literal ni dominios reales de terceros.
