# DatasetFields Component Architecture

Este directorio contiene el componente `DatasetFields` y toda su arquitectura modular.

## Estructura

```
DatasetFields/
├── DatasetFields.tsx          # Componente principal (orchestrator)
├── DatasetFields.css          # Estilos principales
├── hooks/                     # Custom hooks
│   └── useFieldsTable.ts      # Lógica de estado para filtros y paginación
└── components/                # Subcomponentes modulares
    ├── index.ts              # Exportación centralizada
    ├── SearchControls.tsx    # Controles de búsqueda y resumen
    ├── FieldsTable.tsx       # Tabla de campos (con encabezados)
    ├── FieldsRow.tsx         # Fila individual de la tabla
    ├── Pagination.tsx        # Controles de paginación
    ├── NoResults.tsx         # Mensaje de "sin resultados"
    └── SimpleFields.tsx      # Vista simple (chips)
```

## Responsabilidades

### DatasetFields.tsx (Componente Principal)

- **Rol**: Orchestrator/Container component
- **Responsabilidades**:
  - Recibir props y decidir qué vista mostrar
  - Coordinar los subcomponentes
  - Mantener la API pública estable

### useFieldsTable.ts (Custom Hook)

- **Rol**: State management y lógica de negocio
- **Responsabilidades**:
  - Manejar estado de búsqueda y paginación
  - Filtrar datos según términos de búsqueda
  - Calcular paginación
  - Resetear página cuando cambia la búsqueda

### SearchControls.tsx

- **Rol**: UI Component para filtros
- **Responsabilidades**:
  - Input de búsqueda
  - Mostrar resumen de resultados
  - Manejar eventos de cambio

### FieldsTable.tsx

- **Rol**: Presentational component para la tabla
- **Responsabilidades**:
  - Renderizar estructura de tabla
  - Renderizar encabezados
  - Coordinar las filas

### FieldsRow.tsx

- **Rol**: Presentational component para filas
- **Responsabilidades**:
  - Renderizar una fila individual
  - Mostrar iconos de tipo de dato
  - Mostrar restricciones (unique, nullable)

### Pagination.tsx

- **Rol**: UI Component para navegación
- **Responsabilidades**:
  - Botones de navegación
  - Información de página actual
  - Manejar eventos de cambio de página

### SimpleFields.tsx

- **Rol**: Vista alternativa simplificada
- **Responsabilidades**:
  - Mostrar campos como chips
  - Vista compacta para espacios reducidos

## Beneficios de la Modularización

1. **Separación de Responsabilidades**: Cada componente tiene una función clara y específica
2. **Reutilización**: Los subcomponentes pueden reutilizarse en otros contextos
3. **Testabilidad**: Cada pieza puede ser probada de forma aislada
4. **Mantenibilidad**: Cambios en una funcionalidad afectan solo a su componente específico
5. **Legibilidad**: El código es más fácil de entender y seguir
6. **Flexibilidad**: Fácil agregar nuevas características o modificar existentes

## Uso

```tsx
import DatasetFields from './DatasetFields';

// Vista simple (chips)
<DatasetFields fields={dataset.fields} />

// Vista detallada con paginación y búsqueda
<DatasetFields
  fields={dataset.fields}
  showDetails={true}
  itemsPerPage={10}
/>
```

## Extensibilidad

Para agregar nuevas funcionalidades:

1. **Nueva vista**: Crear un nuevo componente en `components/`
2. **Nueva lógica**: Extender el hook `useFieldsTable` o crear uno nuevo
3. **Nuevos controles**: Agregar componentes adicionales y conectarlos via props

La arquitectura está diseñada para crecer de forma escalable y mantenible.
