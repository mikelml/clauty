# Seguridad

## Reportar una vulnerabilidad

No abras un issue público. Usa el reporte privado de GitHub Security Advisories del repositorio:

`https://github.com/mikelml/clauty/security/advisories/new`

Incluye qué versión o archivo afecta, cómo reproducirlo y qué impacto ves. Respondemos con acuse de recibo y un plan; publicamos el aviso cuando haya corrección.

## Qué cubre

Hoy este repo es un plano (specs, esquemas y políticas). Cuentan como vulnerabilidad:

- Un formato o una spec que, implementado tal cual, permite saltarse una regla del guardián (por ejemplo, que contenido externo se vuelva orden).
- Un vector de prueba del protocolo que acepta lo que debería rechazar.
- Un secreto o un dato personal publicado por error en el historial.

Los casos de ataque nuevos que no son vulnerabilidades se aportan con la plantilla *Ataque* (ver [CONTRIBUTING.md](CONTRIBUTING.md#aporta-un-ataque)).
