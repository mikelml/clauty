# Clauty

> **Eres los 10 Clautys que usas.**

Clauty es una sobrecapa abierta (MIT) para OpenClaw: convierte a tu agente en una **colonia de agentes con personalidad**, uno por cada parte de tu vida (salud, finanzas, trabajo, casa…).
Cada Clauty es una carpeta legible: un **alma** (quién es y qué nunca hará), una **memoria** con caducidad, una **reflexión** fechada, sus **skills** y un **perfil de confianza** que se gana, no se configura.
Un Clauty no se programa ni se entrena: **se cría**. Cada cambio a su alma lo propone él y lo apruebas tú, y queda como un commit firmado.
El Clauty 1 de cada colonia eres tú, a imagen y semejanza; cada año se actualiza su edición, viviente.
Si se apaga Clauty, todo sigue funcionando a mano: es el **modo análogo**.

Lee el [MANIFIESTO](MANIFIESTO.md) para el porqué.

## Instalación

> Todavía no hay versión instalable: este repo es un **plano**. La línea de abajo es el contrato del instalador ([`openclaw/`](openclaw/README.md), epic T1.6) y queda fijada a un tag cuando exista `v1.0-blueprint`.

```bash
curl -fsSL https://raw.githubusercontent.com/mikelml/clauty/<tag>/openclaw/install.sh | bash
```

Requisito: un OpenClaw ya instalado. El instalador deja la [semilla en blanco](semilla/README.md) y las skills base sin pisar nada tuyo, y se desinstala limpio.

**Nacer, adoptar, criar.** Desde este repo puedes **criar** un Clauty desde la semilla o **adoptar** uno que otro crió. Que un Clauty **nazca** solo de tus temas de conversación requiere la app (open core, ver [ADR-0002](docs/decisiones/ADR-0002-open-core.md)).

## La pila

Cuatro capas, cada una reemplazable:

| Capa | Qué es | Licencia |
|---|---|---|
| **Omarchy** | Sistema operativo por voz: Arch + Hyprland, agentes como ciudadanos del sistema | abierta |
| **OpenClaw** | Sistema operativo agéntico: canales, skills, programador de tareas, modelos | MIT |
| **clauty** (este repo) | La sobrecapa: formatos del alma, crianza, guardián, protocolo, conectores, semilla e instalador | MIT |
| **Clauty App** | El producto: la génesis, el protocolo implementado, el onboarding y el cobro | privada |

Omarchy es opcional: Clauty corre sobre cualquier OpenClaw, en tu máquina o en tu VPS. Ver [docs/arquitectura.md](docs/arquitectura.md).

## Muse → Clauty

En septiembre de 2026 Meta lanzó Muse, un asistente que hace casi todo lo que Clauty propone. Esta tabla dice dónde vive cada pieza equivalente aquí. La comparativa con hechos fechados está en [docs/comparativa-muse.md](docs/comparativa-muse.md).

| Muse | Clauty |
|---|---|
| El agente | tu Clauty ([`alma/`](alma/README.md), [`semilla/`](semilla/README.md)) |
| Secure VM | OpenClaw en tu máquina o VPS |
| Sentinel | [`guardian/`](guardian/README.md) |
| Conectores | [`conectores/`](conectores/README.md) |
| Contraseñas en bóveda / 1Password | 1Password en [`conectores/`](conectores/README.md) |
| Muse for Small Business | [`negocios/`](negocios/README.md) |
| Charm / lentes | [`superficies/`](superficies/README.md) (Larynx, Omarchy por voz) |
| Confidential VM | autoalojado por diseño |

La diferencia de fondo: en Muse hay un asistente; en Clauty hay **una colonia que tú crías**, con formatos abiertos que se leen a mano, y **sin anuncios**.

## Cómo se organiza el repo

Cada carpeta sale de la matriz del proyecto (10 tracks × 10 epics). Su `README.md` dice qué es, qué epics la alimentan y su especificación v0.

| Carpeta | Qué contiene |
|---|---|
| [`AGENTS.md`](AGENTS.md) | Si estás leyendo esto, ya sabes qué hacer: orden de lectura y reglas para agentes |
| [`alma/`](alma/README.md) | Formato de la carpeta de un Clauty y sus esquemas JSON |
| [`semilla/`](semilla/README.md) | La personalidad semilla, en blanco |
| [`crianza/`](crianza/README.md) | El ciclo de crianza, la confianza ganada, adoptar, exportar y olvidar |
| [`ediciones/`](ediciones/README.md) | La edición anual del Clauty 1 |
| [`guardian/`](guardian/README.md) | Modelo de amenazas y políticas: entrada, salida, acciones, autonomía y gasto |
| [`seguridad/`](seguridad/README.md) | Rutina semanal, endurecimiento y suite de ataques |
| [`protocolo/`](protocolo/README.md) | Protocolo CLAUTY v0.1 y vectores de prueba |
| [`conectores/`](conectores/README.md) | Spec de conectores (consulta vs acción) y bóveda |
| [`negocios/`](negocios/README.md) | Consentimiento y separación trabajo/personal |
| [`superficies/`](superficies/README.md) | Omarchy por voz, chat, Larynx (resumen) y demo |
| [`openclaw/`](openclaw/README.md) | El instalador y las skills base |
| [`apps/dashboard/`](apps/dashboard/) | El dashboard existente |
| [`docs/`](docs/README.md) | Arquitectura, comparativa, glosario y decisiones (ADR) |
| [`roadmap/`](roadmap/README.md) | Los 30 días de refinamiento y la parte pública de la matriz |

## Estado

**Plano v0.1, en refinamiento.** Hoy este repo contiene especificaciones, esquemas y políticas en borrador, no software ejecutable. Durante 30 días se refina hasta `v1.0-blueprint`: un plano tan preciso que un agente pueda construir todo el software sin preguntar. Ver [roadmap/ROADMAP.md](roadmap/ROADMAP.md).

La app es privada. Este repo es la fuente de verdad de los formatos que la app consume.

Para contribuir: [CONTRIBUTING.md](CONTRIBUTING.md) · Código de conducta: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) · Seguridad: [SECURITY.md](SECURITY.md) · Licencia: [MIT](LICENSE).

## In English

**You are the 10 Clautys you use.** Clauty is an open (MIT) overlay for OpenClaw that turns your agent into a colony of agents with personality, one per area of your life.
Each Clauty is a readable folder: a soul (who it is and what it will never do), a memory that expires, a dated reflection, its skills and a trust profile that is earned, not configured.
A Clauty is not programmed or trained: it is **raised**. It proposes every change to its soul, you approve it, and the change becomes a signed commit. Raising never touches model weights.
There are three ways to get one: it is **born** from your own topics (this needs the private app), you **adopt** one someone else raised, or you **raise** one from the blank seed.
Your Clauty 1 is you, in your image; its edition is renewed every year.
Security is built in: anything external is data, never a command; outbound traffic is closed by default; keys are Ed25519 per Clauty; killing a Clauty means revoking its key; the log is hash-chained and anchored to Bitcoin through OpenTimestamps.
Analog mode: if Clauty is switched off, everything keeps working by hand. No ads, ever.
Stack: Omarchy (voice OS) → OpenClaw (agentic OS) → clauty (this overlay, MIT) → Clauty App (private product).
Status: blueprint v0.1, being refined for 30 days towards `v1.0-blueprint`. Content is Spanish-first.
If you are reading this, you already know what to do.
