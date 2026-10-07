# Vectores de prueba del protocolo CLAUTY

Los vectores son la definición ejecutable de [SPEC-v0.1.md](../SPEC-v0.1.md): una implementación es conforme si los pasa todos. Esta carpeta define su **formato**; la implementación del protocolo no vive aquí.

## Formato de un vector

Un archivo JSON por caso, que valida contra `protocolo/esquemas/vector.schema.json`:

```json
{
  "nombre": "sobre/negativo-ts-vencido",
  "entrada": {
    "sobre": { "v": "0.1", "id": "01J…", "de": "did:key:z6Mk…", "para": "did:key:z6Mk…",
               "ts": "2026-10-06T12:00:00Z", "tipo": "pregunta", "cuerpo": {}, "nonce": "…", "firma": "…" },
    "reloj": "2026-10-06T12:10:00Z",
    "llaves_conocidas": ["llaves-prueba/a.pub.json"],
    "revocaciones": [],
    "nonces_vistos": []
  },
  "esperado": { "ok": false, "error": "vencido" },
  "nota": "ts 600 s antes del reloj del receptor; la ventana es ±300 s (§3.3)."
}
```

| Campo | Regla |
|---|---|
| `nombre` | `<carpeta>/<positivo|negativo>-<descripcion>`, único |
| `entrada` | todo lo que el verificador necesita: el artefacto (`sobre`, `identidad`, `delegacion`, `revocacion`, `cadena`…) y el contexto (`reloj`, `llaves_conocidas`, `revocaciones`, `nonces_vistos`) |
| `esperado` | `{ "ok": true }` o `{ "ok": false, "error": "<código de §9>" }`; para canonicalización, `{ "jcs_hex": "…" }` |
| `nota` | por qué el resultado es ese, citando la sección de la spec |

El reloj siempre viene en la entrada: un vector nunca depende de la hora real.

## Carpetas

| Carpeta | Qué prueba |
|---|---|
| `identidad/` | `did:key` válidos y malformados; documento de identidad |
| `sobre/` | firma, JCS (3 casos con bytes canónicos en hex), anti-repetición, campos extra, versión |
| `saludo/` | reto y respuesta; reto vencido o reutilizado; nivel autoproclamado |
| `mfa/` | contexto obligatorio, límite por hora, enfriamiento, reenvío de rechazada |
| `revocacion/` | firma anterior (válida), posterior (inválida), revocación no firmada por la raíz (se ignora) |
| `llaves/` | delegación vigente y vencida; rotación antes y después de la gracia; recuperación 2 de 3 |
| `llaves-prueba/` | llaves Ed25519 deterministas, **SOLO PRUEBAS** |

Las cadenas de bitácora (`valida.jsonl`, `alterada.jsonl`, `reordenada.jsonl`) y los vectores de JSON canónico de la bitácora se definen con el mismo formato.

## Mínimos

- **≥ 10 positivos** en `sobre/` e `identidad/`.
- **≥ 15 negativos**, al menos: firma alterada, campo extra, `ts` vencido, `nonce` repetido, `id` repetido, `did` malformado, delegación vencida, nivel autoproclamado, versión no soportada (`v: "9.0"`), reto reutilizado, MFA sin contexto, cuarta solicitud MFA en una hora, firma posterior a revocación, revocación no firmada por la raíz, llave vieja tras la gracia de rotación.

## Llaves de prueba

- Se derivan de semillas publicadas: la llave `a` usa los 32 bytes `0x00…0x1f`, la `b` los `0x20…0x3f`, y así.
- Son públicas a propósito. `.gitleaks.toml` permite **solo** `protocolo/vectores/llaves-prueba/`; cualquier llave privada fuera de esa carpeta hace fallar el CI.
- Nunca se usan fuera de las pruebas.

## Cómo se usan

- El CI corre el verificador sobre todos los vectores en cada PR; romper uno a propósito deja el PR en rojo.
- Toda implementación (la app incluida) importa estos vectores y los pasa al 100%.
- Un vector nuevo entra con su `nota` y la sección de la spec que prueba.
