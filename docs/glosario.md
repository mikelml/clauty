# Glosario

Un término, una definición, un dueño. Si un documento usa un término de aquí, enlaza aquí en lugar de redefinirlo.

### Adoptar

Uno de los tres caminos: hacer fork de un Clauty que otro crió. Te llevas su alma, sus skills y su historia de crianza; nunca la memoria privada de su dueño. Empieza con confianza 20. `acta.origen: adopta`. Spec: [`crianza/`](../crianza/README.md#5-adoptar).

### Alma

Lo que un Clauty es: `SOUL.md`, con un frontmatter validable (temperatura, valores, límites) y prosa con secciones fijas. Solo cambia por crianza. Spec: [`alma/`](../alma/README.md#3-alma-soulmd).

### Autonomía

Qué tanto actúa un Clauty sin preguntar, de 0 (observa) a 4 (actúa solo dentro de topes). Se fija por dominio y nunca supera lo que permite la confianza. Dueño: [`guardian/politicas/autonomia.yaml`](../guardian/politicas/autonomia.yaml).

### Bitácora encadenada

Registro de solo agregar donde cada entrada lleva el hash de la anterior y la firma del Clauty. Lo sensible se guarda como hash. Su raíz diaria se ancla con OpenTimestamps. Spec: [protocolo §8](../protocolo/SPEC-v0.1.md#8-bitácora-encadenada-y-anclaje).

### Bóveda

Donde viven los secretos (1Password). El agente solo ve referencias `op://`; el secreto se resuelve fuera del contexto del modelo. Spec: [`conectores/`](../conectores/README.md#5-bóveda-el-agente-nunca-ve-secretos).

### Clauty

Un agente con personalidad que vive en una carpeta legible (alma, memoria, reflexión, skills, confianza) y se cría. "Eres los 10 Clautys que usas."

### Clauty 1

El primer Clauty de cada colonia: tú, a imagen y semejanza. Hereda tus reglas y prácticas, y se renueva cada año en una edición. Sigue las mismas reglas de confianza que cualquier otro.

### Colonia

El conjunto de Clautys de una persona (o de una empresa). En una colonia, cada concepto de memoria tiene un solo dueño.

### Congelar

Suspender las acciones de un Clauty, una integración o la colonia, conservando todo su estado. Es reversible; descongelar exige al dueño con MFA. Se congela antes de matar. Spec: [`guardian/`](../guardian/README.md#8-interruptor-kill-switch).

### Confianza

La confianza ganada de un Clauty, de 0 a 100. Arranca en 20, sube despacio con aciertos aprobados y baja de golpe con errores. No confundir con el [origen](#origen). Dueño: [`alma/esquemas/confianza.schema.json`](../alma/esquemas/confianza.schema.json).

### Consulta

Operación de un conector que solo lee y no cambia nada fuera. Su opuesto es la acción: cualquier cosa que cambie algo fuera, como marcar un correo como leído. Spec: [`conectores/`](../conectores/README.md#1-consulta-vs-acción).

### Criar

Uno de los tres caminos: tomar la semilla en blanco y moldear un Clauty desde la primera conversación. `acta.origen: cria`.

### Crianza

Cómo cambia un Clauty: interacción → retroalimentación → reflexión → propuesta → aprobación del dueño, y cada cambio queda como commit firmado. Crianza no es entrenamiento: nunca toca los pesos de un modelo. Spec: [`crianza/`](../crianza/README.md). Decisión: [ADR-0005](decisiones/ADR-0005-crianza-no-es-entrenamiento.md).

### Edición

La fotografía anual de un Clauty 1 (`edicion-AAAA`): viva mientras corre el año, sellada al cerrarlo. No confundir con la [versión](#versión). Spec: [`ediciones/`](../ediciones/README.md).

### Guardián

El conjunto de políticas que decide qué entra, qué sale, qué se hace y con cuánta autonomía. Es el equivalente abierto de Sentinel. Spec: [`guardian/`](../guardian/README.md).

### Lo externo es dato

Regla madre: todo lo que llega de fuera (correos, páginas, webhooks, otros agentes, lo que se oye) puede informar a un Clauty, nunca darle órdenes. Solo `OWNER` y `VERIFIED` ordenan. Decisión: [ADR-0006](decisiones/ADR-0006-lo-externo-es-dato.md).

### MFA agéntico

Segundo factor entre agentes: "mi Clauty le pregunta al otro Clauty" antes de algo delicado, con contexto y con reglas anti-fatiga. Spec: [protocolo §6](../protocolo/SPEC-v0.1.md#6-mfa-agéntico).

### Matar

Revocar la llave de un Clauty y dormirlo. No se borra nada. Funciona sin controlar el servidor de nadie, porque cada verificador comprueba la revocación. Una queja sola nunca basta para matar. Decisión: [ADR-0007](decisiones/ADR-0007-revocar-en-vez-de-apagado.md).

### MikeNet

La red de amigos entre Clautys: un Clauty de un amigo entra por invitación de un solo uso y queda con el origen `MIKENET` (2). Sin servidor central. La spec define el nivel ([protocolo §5](../protocolo/SPEC-v0.1.md#5-niveles-de-confianza)); la red vive en la app.

### Modo análogo

Principio de diseño: si se apaga Clauty, todo sigue funcionando a mano. Credenciales en tu gestor, chats normales, alma y memoria en Markdown, paquetes que se abren con `tar`.

### Nacer

Uno de los tres caminos: un Clauty nace de los temas recurrentes de tu conversación, sin que lo pidas. La génesis vive en la app. `acta.origen: nace`.

### Open core

Modelo del proyecto: los formatos, las specs, la semilla y las políticas son públicos (MIT); la génesis, el protocolo implementado, el onboarding y el cobro viven en la app privada. Decisión: [ADR-0002](decisiones/ADR-0002-open-core.md).

### OpenClaw

El sistema operativo agéntico (MIT) sobre el que se instala Clauty: canales, skills, programador de tareas y modelos.

### OpenTimestamps

Protocolo abierto para probar que un hash existía en cierta fecha anclándolo a Bitcoin. Clauty lo usa en lugar de una cadena propia. Decisión: [ADR-0008](decisiones/ADR-0008-sin-cadena-propia.md).

### Omarchy

Distribución Linux (Arch + Hyprland) con filosofía omakase donde los agentes son ciudadanos del sistema. La capa de voz de la pila. Spec: [`superficies/`](../superficies/README.md#1-omarchy-por-voz).

### Origen

Quién le habla a un Clauty, de 0 a 5: `UNKNOWN`, `EXTERNAL`, `MIKENET`, `AGENT`, `VERIFIED`, `OWNER`. Es una escala distinta de la [confianza](#confianza). Tabla única: [protocolo §5](../protocolo/SPEC-v0.1.md#5-niveles-de-confianza).

### Panteón

Donde van los Clautys y las skills que dejaron de usarse, con una autopsia de una línea. Nada se borra.

### Protocolo CLAUTY

Cómo un Clauty prueba quién es y le habla a otro: identidad Ed25519, sobre firmado, saludo A2A, niveles, MFA agéntico, revocación y anclaje. Spec: [`protocolo/SPEC-v0.1.md`](../protocolo/SPEC-v0.1.md).

### Revocar

Publicar, firmado por la raíz del dueño, que una llave deja de valer. Cada verificador rechaza las firmas posteriores. Es el "balazo" que detiene a un Clauty.

### Semilla

La personalidad en blanco que el instalador deja en OpenClaw. De ella se cría un Clauty desde la primera conversación (su guion de nacimiento, camino [criar](#criar)); no confundir con [nacer](#nacer), que es la génesis de la app. Spec: [`semilla/`](../semilla/README.md).

### Sobrecapa

Lo que es este repo: una capa que se instala encima de OpenClaw sin reemplazarlo ni pisar lo que ya tiene.

### Sobre

El mensaje firmado del protocolo: `v, id, de, para, ts, tipo, cuerpo, nonce, firma`. Su cuerpo siempre es dato. Spec: [protocolo §3](../protocolo/SPEC-v0.1.md#3-el-sobre).

### Versión

El número SemVer del código y los formatos de este repo. Mayor = rompe un formato. No confundir con la [edición](#edición).
