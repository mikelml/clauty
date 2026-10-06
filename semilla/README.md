# semilla/ — la personalidad semilla, en blanco

**Qué es.** La personalidad semilla que el instalador pone en cualquier OpenClaw: vacía a propósito, sin datos de nadie, lista para su guion de nacimiento en la primera conversación y para criarse desde ahí. Es la base de los tres caminos (nacer, adoptar, criar) y la plantilla del Clauty 1 de cada persona.

## Epics que la alimentan

| Epic | Título |
|---|---|
| T2.3 | Semilla en blanco |

Relacionados: el formato que cumple vive en [`alma/`](../alma/README.md) (T2.1, T2.2, T2.7); las skills que llegan después, en [`openclaw/`](../openclaw/README.md) (T4.7); los tres caminos, en [`crianza/`](../crianza/README.md) (T5.6).

## Especificación v0

### Contenido

| Archivo | Estado en la semilla |
|---|---|
| [`clauty.yaml`](clauty.yaml) | `id: semilla`, `idioma: es-MX`, `acta.origen: cria`, `skills: {}` |
| [`SOUL.md`](SOUL.md) | Frontmatter con marcadores y límites base; prosa con las seis secciones (Naturaleza, Conocimiento inicial, Comportamiento, Tareas proactivas, Restricciones, Lecciones) |
| [`MEMORY.md`](MEMORY.md) | Encabezado, formato en comentario y 0 entradas |
| [`REFLECTION.md`](REFLECTION.md) | Plantilla `## AAAA-MM-DD — título` en comentario y 0 entradas |
| [`confianza.yaml`](confianza.yaml) | `nivel: 20`, umbrales 10/40/60/80/95, `congelado: false`, compras con tope 0 |
| [`nacimiento.md`](nacimiento.md) | El guion de la primera conversación |
| [`skills/`](skills/README.md) | Vacía por diseño |

### Marcadores

| Marcador | Dónde | Se resuelve con |
|---|---|---|
| `{nombre}` | `SOUL.md`, `clauty.yaml` | Pregunta 1 del nacimiento |
| `{proposito}` | `SOUL.md` (`rol` y Naturaleza) | Pregunta 2 |
| `{valor_1..3}` | `SOUL.md` (`valores`) | Pregunta 4 (o se proponen y el dueño aprueba) |
| `{descripcion: …}`, `{…}` en viñetas | prosa de `SOUL.md` | Se reemplazan o se borran al nacer |

El validador acepta marcadores y `nacimiento: null` **solo** en `--modo semilla`; en modo normal, un marcador sin resolver es `E-MARCADOR`.

### Reglas

- Confianza inicial 20, sin excepciones (también para el Clauty 1).
- Idioma por defecto `es-MX`; se cambia en el nacimiento (pregunta 3) y en `clauty.yaml`.
- Los tres límites base vienen escritos en `limites.nunca` para que se lean a mano; se aplican aunque alguien los borre.
- Nada personal: la semilla pasa gitleaks con [`.gitleaks.toml`](../.gitleaks.toml) y el job de privacidad del CI.
- Nacer desde la semilla produce `acta.origen: cria`. El origen `nace` queda para la génesis de la app; `adopta`, para un fork de un Clauty criado.

### Interfaces

```bash
node alma/validador/cli.mjs --modo semilla semilla/     # sale 0
clauty nuevo <nombre>                                   # copia la semilla, corre el nacimiento y deja un Clauty válido
```

## Criterios de aceptación v0

- [ ] `test -f` sale 0 para `clauty.yaml`, `SOUL.md`, `MEMORY.md`, `REFLECTION.md`, `confianza.yaml` y `test -d skills`.
- [ ] `grep -c '{nombre}' semilla/SOUL.md` ≥ 1.
- [ ] El frontmatter de `SOUL.md` valida contra `alma/esquemas/soul.schema.json`; `confianza.yaml` contra `confianza.schema.json`; `clauty.yaml` contra `clauty.schema.json`.
- [ ] `nivel` de `confianza.yaml` es 20.
- [ ] Simular el nacimiento con respuestas de ejemplo produce un `clauty.yaml` válido y un `SOUL.md` sin marcadores.
