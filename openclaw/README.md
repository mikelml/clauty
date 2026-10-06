# openclaw/ — la sobrecapa instalable

**Qué es.** Lo que Omarchy hace por el sistema, Clauty lo hace por el agente: una línea que deja la semilla y las skills base sobre un OpenClaw limpio, sin pisar lo que ya existe, verificable y reversible. Aquí viven el instalador, la versión fijada de OpenClaw, las skills base, los hooks del guardián y la CLI `clauty`.

## Epics que la alimentan

| Epic | Título |
|---|---|
| T1.6 | Instalador de una línea sobre OpenClaw (estilo Omarchy) |
| T4.7 | Listo desde el primer mensaje (skills preinstaladas) |

También aloja piezas de otros epics: el hook de entrada (T6.2.08), el interruptor local (T6.7.08) y la skill de canales (T8.5.02).

## Especificación v0

### 1. Instalador

```bash
curl -fsSL https://raw.githubusercontent.com/mikelml/clauty/<tag>/openclaw/install.sh | bash
```

| Contrato | Detalle |
|---|---|
| Fijado a un tag | nunca `main`; la misma línea en el README y en la guía de crianza |
| Checksum | descarga el paquete del tag y corre `sha256sum -c`; con un paquete alterado sale ≠ 0 sin escribir nada |
| `--dry-run` | imprime lo que haría y no escribe nada |
| Detecta OpenClaw | sin OpenClaw en el `PATH` sale 2 con un enlace a su instalación; con una versión menor a `openclaw/VERSION` sale 3 |
| No pisa | si el workspace ya tiene `SOUL.md` u otros archivos, los respalda en `.clauty-respaldo-<fecha>/` antes de escribir |
| Registra | la sobrecapa y sus skills quedan en la configuración de OpenClaw; la rutina de seguridad queda en su programador semanal |
| Idempotente | dos corridas dejan el mismo árbol (mismo sha256) |
| `--desinstalar` | borra solo lo listado en `~/.clauty/instalado.txt`; los archivos del usuario siguen ahí |
| Sin telemetría | solo contacta GitHub; ningún otro host |
| Salida breve | ≤ 25 líneas en español sin `--verbose`; la última empieza con `Siguiente paso:` |
| Termina validando | `node alma/validador/cli.mjs <workspace>/clauty/<id>` sale 0 |

Códigos de salida: `0` ok · `1` error genérico · `2` sin OpenClaw · `3` OpenClaw viejo · `4` checksum inválido.

Probado en CI sobre contenedores limpios de `archlinux:latest` y `ubuntu:24.04`.

### 2. `openclaw/VERSION`

La versión mínima de OpenClaw contra la que se prueba. Los supuestos sobre OpenClaw (ruta del workspace, formato de skills, listado de skills, programador de tareas) se confirman contra esa versión y se anotan junto a ella.

### 3. Skills base

`openclaw/skills/BASE.md` lista ≤ 7 skills, cada una en `openclaw/skills/<nombre>/SKILL.md` y fijada por hash en `skills.lock`:

| Skill | Hace |
|---|---|
| `presentarse` | responde con nombre, para qué sirve y qué no hace, leyendo `SOUL.md` |
| `proponer-aprobar-aplicar` | presenta un diff, espera un sí explícito y solo entonces escribe |
| `recordar` | guarda recuerdos pidiendo fuente y caducidad; nunca cita lo vencido |
| `si-estas-leyendo-esto` | ante "¿qué hago?" o un repo nuevo, lee `AGENTS.md` y responde con el siguiente paso |
| `clauty-canales` | enruta `@nombre …` de WhatsApp/Discord al Clauty correcto |
| `seguridad-semanal` | la rutina de [`seguridad/`](../seguridad/rutina-semanal/SKILL.md) |

Reglas: el CI falla si una skill cambia sin subir su versión en `skills.lock`; apagar una (`clauty skills off <skill>`) no rompe las demás.

### 4. Listo desde el primer mensaje

En un OpenClaw limpio, tras la línea de instalación:

- `openclaw skills list` incluye todas las de `BASE.md`.
- El primer "hola" recibe una respuesta con el nombre del Clauty y una propuesta de siguiente paso, sin pedir llaves nuevas (usa el modelo que ya tiene OpenClaw, o uno local vía Ollama).
- La bienvenida es en español y termina con una línea `In English:`; si el sistema está en otro idioma, responde en ese idioma.

### 5. Hooks del guardián

`openclaw/hooks/entrada` etiqueta cada mensaje de un canal externo con `origen` y `nivel` antes de que llegue al Clauty (ver [`guardian/politicas/entrada.yaml`](../guardian/politicas/entrada.yaml)).

### 6. CLI `clauty`

```
clauty nuevo <nombre>              # cría desde la semilla
clauty adoptar <ruta|url|.clauty>  # fork sin memoria privada
clauty validar <carpeta>
clauty exportar <carpeta> <archivo.clauty>
clauty edicion sellar <carpeta>
clauty congelar [--colonia | <id>] · clauty descongelar
clauty skills list | off <skill> | on <skill>
clauty bitacora verificar <archivo.jsonl>
clauty ataques correr
```

## Criterios de aceptación v0

- [ ] `install.sh --dry-run` con un `HOME` vacío sale 0 y el directorio sigue vacío.
- [ ] Dos instalaciones seguidas dan el mismo sha256 del árbol.
- [ ] `--desinstalar` deja intacto un archivo del usuario creado antes.
- [ ] `grep -oE 'https?://[^/" ]+' openclaw/install.sh` solo lista hosts de GitHub.
- [ ] El primer "hola" funciona en un contenedor limpio.
