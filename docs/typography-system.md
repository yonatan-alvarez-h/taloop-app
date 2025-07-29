# Sistema Tipográfico Unificado

## 📝 Fuentes Principales

### 🔤 Fuente Base (Para todo el texto general)

- **Variable CSS:** `var(--font-family-base)`
- **Fuente:** Inter + fallbacks del sistema
- **Uso:** Textos generales, UI, botones, headers, descripciones

### 🖥️ Fuente Monoespaciada (Para código y datos técnicos)

- **Variable CSS:** `var(--font-family-mono)`
- **Fuente:** JetBrains Mono + fallbacks
- **Uso:** IDs, nombres de campos, código, datos técnicos

## 📏 Tamaños de Fuente

| Variable           | Tamaño   | Uso                                  |
| ------------------ | -------- | ------------------------------------ |
| `--font-size-xs`   | 0.75rem  | Textos muy pequeños, etiquetas       |
| `--font-size-sm`   | 0.875rem | Tablas, metadata, textos secundarios |
| `--font-size-base` | 1rem     | Texto base, descripción              |
| `--font-size-lg`   | 1.125rem | Textos destacados                    |
| `--font-size-xl`   | 1.25rem  | Subtítulos                           |
| `--font-size-2xl`  | 1.5rem   | Títulos principales                  |
| `--font-size-3xl`  | 1.875rem | Títulos grandes                      |

## ⚖️ Pesos de Fuente

| Variable                 | Peso | Uso                            |
| ------------------------ | ---- | ------------------------------ |
| `--font-weight-normal`   | 400  | Texto base                     |
| `--font-weight-medium`   | 500  | Etiquetas, texto medio         |
| `--font-weight-semibold` | 600  | Destacados, subtítulos         |
| `--font-weight-bold`     | 700  | Títulos, elementos importantes |

## 📐 Alturas de Línea

| Variable                | Valor | Uso                     |
| ----------------------- | ----- | ----------------------- |
| `--line-height-tight`   | 1.25  | Títulos, texto compacto |
| `--line-height-normal`  | 1.5   | Texto base, legibilidad |
| `--line-height-relaxed` | 1.625 | Texto extenso, párrafos |

## 🎯 Clases Utilitarias

### Fuentes

- `.font-base` - Aplica fuente principal
- `.font-mono` - Aplica fuente monoespaciada

### Tamaños

- `.text-xs`, `.text-sm`, `.text-base`, `.text-lg`, `.text-xl`, `.text-2xl`, `.text-3xl`

### Pesos

- `.font-normal`, `.font-medium`, `.font-semibold`, `.font-bold`

### Alturas de línea

- `.leading-tight`, `.leading-normal`, `.leading-relaxed`

## 📋 Ejemplos de Uso

```css
/* Título principal */
.main-title {
  font-family: var(--font-family-base);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
}

/* ID técnico */
.id-display {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

/* Texto de descripción */
.description-text {
  font-family: var(--font-family-base);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
}
```

## 🔧 Implementación

El sistema está importado globalmente desde:

- `src/styles/typography.css`
- Fuentes cargadas desde Google Fonts en `index.html`
- Variables CSS disponibles en todo el proyecto

## ✅ Beneficios

- **Consistencia:** Mismas fuentes en todo el proyecto
- **Mantenibilidad:** Cambios centralizados
- **Performance:** Fuentes optimizadas y cargadas eficientemente
- **Accesibilidad:** Escalas de tamaño y contraste consistentes
- **Profesionalidad:** Apariencia uniforme y pulida
