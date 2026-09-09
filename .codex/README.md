# Configuración de Codex para taloop

Esta carpeta contiene configuración específica de Codex para el repositorio. Codex debe cargarla únicamente cuando el proyecto esté marcado como confiable.

## Contenido

- `config.toml`: habilita subagentes y limita a tres los hilos secundarios simultáneos, sin imponer un modelo ni credenciales.
- `agents/`: perfiles especializados para explorar, auditar, revisar, validar, probar en navegador e implementar.

## Agentes disponibles

| Agente | Uso | Escritura |
| --- | --- | --- |
| `dataset_flow_explorer` | Trazar rutas, estado y consumidores de datasets | No |
| `dataset_api_auditor` | Revisar contratos HTTP, tipos y errores de la API | No |
| `ui_accessibility_reviewer` | Revisar React, CSS, semántica y accesibilidad | No |
| `browser_flow_tester` | Reproducir flujos reales con frontend, navegador y API disponibles | No edita fuentes; puede iniciar el servidor |
| `quality_gate` | Ejecutar lint, type-check y build | No edita fuentes; puede generar `dist/` |
| `frontend_implementer` | Implementar cambios React, TypeScript y CSS acotados | Sí |

## Flujo recomendado

Para una incidencia poco conocida, pedir primero exploración y auditoría en paralelo:

```text
Usa dataset_flow_explorer y dataset_api_auditor en paralelo. Espera ambos resultados y resume la causa probable con referencias de archivo.
```

Para un problema visual o de interacción:

```text
Usa ui_accessibility_reviewer para revisar el código. Si están disponibles el servidor, el navegador y la API, usa también browser_flow_tester para aportar evidencia de ejecución.
```

Para implementar una solución:

```text
Con base en estos hallazgos, pide a frontend_implementer que aplique el cambio mínimo. No ejecutes otro agente con capacidad de escritura en paralelo.
```

Para cerrar una tarea:

```text
Ejecuta quality_gate y reporta por separado el resultado de lint, type-check y build. No modifiques archivos fuente.
```

## Límites

- No guardar credenciales, tokens, `auth.json`, historiales ni logs generados en esta carpeta.
- No configurar proveedores, URLs de modelos, telemetría o perfiles de usuario en el `config.toml` del proyecto.
- Los hooks y las reglas experimentales no están activados; deben añadirse solo cuando exista una política concreta que revisar y probar.
