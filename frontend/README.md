# TableFlow Frontend

El frontend de TableFlow (Gestor Fiesta) es una aplicación de una sola página (SPA) construida con React y empaquetada con Vite.

## Tecnologías Principales

- **React (v19)**: Biblioteca principal para la construcción de interfaces de usuario.
- **Vite**: Herramienta de construcción y servidor de desarrollo ultrarrápido.
- **React Router DOM**: Para el enrutamiento y la navegación entre páginas.
- **ExcelJS y File-Saver**: Para la generación y descarga de reportes en formato Excel.

## Arquitectura y Estructura de Directorios

La estructura del código fuente (`src/`) está organizada por responsabilidades:

```text
frontend/src/
├── assets/          # Recursos estáticos (imágenes, iconos, etc.)
├── component/       # Componentes reutilizables de React
│   ├── accountingView.jsx  # Vista de contabilidad
│   ├── tables.jsx          # Visualización de mesas
│   ├── createEvent.jsx     # Formulario de creación de eventos
│   └── ...                 # Otros formularios y UI compartida
├── css/             # Archivos de estilos (CSS puro)
│   ├── editTable.css       # Estilos específicos de componentes
│   └── ...                 
├── hooks/           # Custom Hooks para lógica de negocio y llamadas a la API
│   ├── apis.js             # Configuración base de fetch/axios
│   ├── useEvent.js         # Lógica para manejar eventos
│   ├── useGuests.js        # Lógica para manejar invitados globalmente
│   ├── useEventGuests.js   # Lógica para invitados por evento
│   ├── useTables.js        # Lógica para el manejo de mesas
│   └── useAccounting.js    # Lógica de cálculos financieros
├── pages/           # Vistas principales de la aplicación (Rutas)
│   ├── home_page.jsx       # Página de inicio
│   ├── event_page.jsx      # Dashboard del evento
│   ├── guest_page.jsx      # Gestión de invitados
│   ├── tables_page.jsx     # Gestión de mesas
│   ├── money_page.jsx      # Vista financiera
│   └── excel_page.jsx      # Exportación de datos
├── App.jsx          # Componente raíz y configuración de rutas
├── index.css        # Estilos globales
└── main.jsx         # Punto de entrada de React
```

## Reglas del Proyecto (Importante)

- **Ubicación de archivos CSS:** Todos los nuevos archivos CSS deben guardarse obligatoriamente dentro del directorio `src/css/`.
- **Prohibido el uso de estilos en línea:** Se debe evitar el uso de la propiedad `style={{...}}` en React para dar formato. En su lugar, se deben crear clases descriptivas y colocarlas en su respectivo archivo dentro de `src/css/`.

## Características Clave

1.  **Gestión del Estado mediante Custom Hooks:** La lógica de interacción con la API y el manejo del estado global/local está fuertemente encapsulada en la carpeta `hooks/`. Esto mantiene a los componentes limpios y enfocados en la presentación.
2.  **Exportación a Excel:** Utilizando `exceljs`, el frontend es capaz de recopilar la información del evento actual (invitados, mesas, estado financiero) y compilarla en un archivo Excel descargable, usando `file-saver`.

## Configuración y Ejecución Local (Sin Docker)

Si no estás usando Docker Compose, sigue estos pasos para ejecutar el frontend localmente. Asegúrate de que el [Backend](../backend/README.md) esté corriendo primero.

### 1. Instalar Dependencias

Navega al directorio `frontend` y ejecuta:

```bash
pnpm install
```

### 2. Iniciar el Servidor de Desarrollo

Inicia el servidor de desarrollo de Vite:

```bash
pnpm run dev
```

La aplicación estará disponible en `http://localhost:3000` (o en otro puerto si el 3000 está ocupado, revisa la salida de la terminal).

### 3. Construcción para Producción

Para generar los archivos optimizados listos para producción:

```bash
pnpm run build
```

Los archivos generados se ubicarán en el directorio `dist/`.
