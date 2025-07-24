# Utilidades para Tipos de Datos

Este módulo centraliza las constantes y utilidades relacionadas con los tipos de datos de los datasets.

## Uso

### Importar iconos

```typescript
import { TYPE_ICONS } from "../utils/dataTypes";

// Usar el icono directamente
const icon = TYPE_ICONS["string"]; // "T"
```

### Usar funciones helper

```typescript
import { getTypeIcon, isValidDataType } from "../utils/dataTypes";

// Obtener icono de forma segura
const icon = getTypeIcon("string"); // "T"
const invalidIcon = getTypeIcon("invalid" as any); // "?"

// Validar tipo
if (isValidDataType(userInput)) {
  // userInput es ahora de tipo DataType
  const icon = TYPE_ICONS[userInput];
}
```

### Tipado fuerte

```typescript
import type { DataType } from "../utils/dataTypes";

// Asegurar que solo se usen tipos válidos
const validType: DataType = "string"; // ✅ OK
const invalidType: DataType = "invalid"; // ❌ Error de TypeScript
```

## Tipos soportados

| Tipo       | Icono | Descripción        |
| ---------- | ----- | ------------------ |
| `string`   | T     | Texto              |
| `number`   | #     | Números            |
| `boolean`  | •     | Verdadero/Falso    |
| `date`     | 📅    | Fechas             |
| `datetime` | ⏰    | Fecha y hora       |
| `email`    | @     | Correo electrónico |
| `url`      | ↗     | URLs               |
| `enum`     | ≡     | Enumeraciones      |
| `json`     | {}    | Objetos JSON       |
| `binary`   | ⬢     | Datos binarios     |

## Agregar nuevos tipos

Para agregar un nuevo tipo de dato:

1. Agregar el tipo a `TYPE_ICONS` en `src/utils/dataTypes.ts`
2. El tipo se propaga automáticamente a `DataType`
3. TypeScript validará que se use correctamente en toda la app

```typescript
export const TYPE_ICONS = {
  // ...tipos existentes...
  geo: "🌍", // Nuevo tipo geográfico
} as const;
```
