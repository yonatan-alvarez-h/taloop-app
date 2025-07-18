# Taloop App 🔍

Una aplicación web moderna para explorar y gestionar datasets, construida con React, TypeScript y Vite.

## 🚀 Características

- **Exploración de Datasets**: Navega y busca entre diferentes datasets
- **Vista Detallada**: Información completa de cada dataset con preview de datos
- **Búsqueda Avanzada**: Filtrado por título, descripción, tags y campos
- **Responsive Design**: Optimizado para desktop, tablet y móvil
- **UI Moderna**: Interfaz limpia con efectos visuales y animaciones
- **Navegación Fluida**: Routing con React Router Dom

## 🛠️ Tecnologías

- **React 19** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **React Router Dom** - Navegación
- **Bootstrap 5** - Framework CSS
- **CSS3** - Estilos personalizados y responsive design

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Dataset/        # Componentes relacionados con datasets
│   │   ├── Card/       # Tarjeta de dataset
│   │   ├── Details/    # Vista detallada del dataset
│   │   ├── Grid/       # Grid de datasets
│   │   ├── List/       # Lista con paginación
│   │   ├── Tags/       # Componente de tags
│   │   └── ...
│   └── Menu/           # Componentes de navegación
│       ├── Nav/        # Navbar principal
│       └── Search/     # Barra de búsqueda
├── pages/              # Páginas principales
│   ├── Home/           # Página de inicio
│   └── DatasetDetails/ # Página de detalles
├── routes/             # Configuración de rutas
├── data/               # Datos mock y configuración
├── types/              # Definiciones TypeScript
└── assets/             # Recursos estáticos
```

## 🎨 Características de Diseño

- **Navbar Fijo**: Con efecto glassmorphism y branding distintivo
- **Cards Responsivas**: Padding asimétrico y sombras elegantes
- **Tabla sin Bordes**: Vista limpia de datos de ejemplo
- **Efectos Hover**: Interacciones suaves y feedback visual
- **Espaciado Simétrico**: Padding consistente en todos los componentes
- **Sin Scroll Horizontal**: Experiencia completamente responsive

## 🚦 Inicio Rápido

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn

### Instalación

1. **Clona el repositorio**

   ```bash
   git clone <repository-url>
   cd taloop-app
   ```

2. **Instala las dependencias**

   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo**

   ```bash
   npm run dev
   ```

4. **Abre tu navegador**
   ```
   http://localhost:5173
   ```

## 📜 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Preview de la build de producción
- `npm run lint` - Ejecuta el linter ESLint

## 🏗️ Comandos de Build

### Desarrollo

```bash
npm run dev
```

### Producción

```bash
npm run build
npm run preview
```

## 📱 Responsive Design

La aplicación está optimizada para:

- **Desktop** (1200px+): Layout completo con máximo espaciado
- **Tablet** (768px-1199px): Adaptación intermedia
- **Mobile** (480px-767px): Diseño compacto optimizado
- **Small Mobile** (<480px): Diseño mínimo para pantallas pequeñas

## 🎯 Componentes Principales

### HomePage

- Lista de datasets con búsqueda
- Paginación externa
- Sin scroll global para mejor UX

### DatasetDetailsPage

- Vista completa del dataset
- Metadata detallada
- Preview de datos sin bordes
- Botón "Volver" integrado en navbar

### DatasetCard

- Padding izquierdo aumentado
- Efectos hover suaves
- Información completa del dataset

## 🎨 Personalización de Estilos

- **Variables CSS**: Definidas en cada componente
- **Responsive Breakpoints**: Mobile-first approach
- **Efectos Visuales**: Sombras, hover states y transiciones
- **Tipografía**: Inter y Roboto Mono para mejor legibilidad

## 🔧 Configuración TypeScript

El proyecto usa configuración TypeScript estricta con:

- Type checking habilitado
- Strict mode activado
- Path mapping configurado
- ESLint integration

## 📊 Estructura de Datos

Los datasets incluyen:

- **Metadata**: título, descripción, propietario, precio
- **Clasificación**: categorías y tags
- **Datos**: campos y muestras de ejemplo
- **Identificación**: UIDs únicos para routing

## 🚀 Próximas Características

- [ ] Filtros avanzados por categoría
- [ ] Ordenamiento de resultados
- [ ] Favoritos de usuario
- [ ] Export de datos
- [ ] Modo oscuro
- [ ] Internacionalización

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🙏 Agradecimientos

- React Team por la excelente biblioteca
- Vite por el tooling increíblemente rápido
- Bootstrap por el framework CSS robusto

---

Desarrollado con ❤️ usando React + TypeScript + Vite
