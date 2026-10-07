# ADR-0007 · Revocar llaves en lugar de un apagado mundial

- **Estado:** Aceptada
- **Fecha:** 2026-10-05
- **Epics:** T7.7, T6.7

## Contexto

¿Cómo se detiene a un agente que se portó mal? Un "apagado mundial" exige controlar todos los servidores donde corre, y en un sistema autoalojado nadie los controla. Además, un botón de apagado ajeno es un arma: basta una queja falsa para usarlo.

## Decisión

Matar a un Clauty es **revocar su llave**:

- La revocación es un sobre firmado por la raíz del dueño (o por 2 de 3 contactos de recuperación).
- Cada verificador rechaza las firmas de esa llave posteriores a la revocación. No hace falta tocar el servidor de nadie: funciona porque cada uno comprueba.
- Antes de matar, se congela. Una queja sola congela y abre una verificación; solo el dueño, o una verificación con evidencia, permiten revocar.
- Revocar exige al dueño con MFA, y cada revocación se ancla con OpenTimestamps.

## Consecuencias

- El "balazo" funciona en una red sin centro.
- Nada se borra: un Clauty revocado duerme con toda su historia.
- Hace falta publicar y propagar listas de revocación, y que los verificadores las consulten.
- Revocar la raíz invalida todas las delegaciones del dueño: es la opción nuclear y pide la misma verificación.
