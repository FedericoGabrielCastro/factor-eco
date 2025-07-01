# Factor Eco - Frontend (`web`)

> **⚠️ Antes de iniciar el frontend, asegúrate de tener el backend corriendo.**  
> Consulta la guía en [`../app/README.md`](../app/README.md) para levantar el backend y cargar los datos de prueba.

---

## 🗂️ Estructura de carpetas

```
web/
├── public/                  # Archivos estáticos públicos (favicon, etc)
├── src/
│   ├── api/                 # Lógica de acceso a APIs (servicios)
│   ├── components/          # Componentes reutilizables de React (Header, etc)
│   ├── context/             # Contextos globales de React (Auth, Date, etc)
│   ├── hooks/               # Custom hooks (useCarts, useProducts, etc)
│   ├── pages/               # Páginas principales de la app (ProductsPage, CartDetailPage, etc)
│   ├── utils/               # Utilidades y helpers
│   ├── app.tsx              # Componente raíz de la aplicación
│   ├── main.tsx             # Punto de entrada de React
│   └── ...                  # Otros archivos de configuración
├── index.html               # HTML principal (favicon, título, root)
├── tailwind.config.js       # Configuración de TailwindCSS
├── tsconfig.json            # Configuración de TypeScript
├── vite.config.ts           # Configuración de Vite
├── package.json             # Dependencias y scripts de npm
└── README.md                # Este archivo
```

---

## 👤 Usuarios de prueba

Puedes iniciar sesión con cualquiera de estos usuarios de prueba:

| Usuario         | Contraseña         | Tipo         |
|-----------------|-------------------|--------------|
| testuser1       | testpassword123    | Normal       |
| testuser2       | testpassword123    | Normal       |
| ...             | ...                | ...          |
| testuser10      | testpassword123    | Normal       |
| vipuser1        | testpassword123    | VIP          |
| vipuser2        | testpassword123    | VIP          |
| exvipuser1      | testpassword123    | Ex-VIP       |
| exvipuser2      | testpassword123    | Ex-VIP       |

---

## 🚀 Comandos principales

> **Requiere Node.js 20.**
> Se recomienda usar [nvm](https://github.com/nvm-sh/nvm) para gestionar versiones de Node:
>
> ```bash
> nvm install 20
> nvm use 20
> ```

Asegúrate de estar en la carpeta `web` antes de ejecutar los comandos.

### Instalar dependencias

```bash
npm install
```

### Levantar el servidor de desarrollo

```bash
npm run dev
```
Esto inicia la app en modo desarrollo (por defecto en http://localhost:5173).

### Build de producción

```bash
npm run build
```
Genera los archivos estáticos optimizados en la carpeta `dist/`.

### Previsualizar el build de producción

```bash
npm run preview
```
Sirve localmente el build de producción para pruebas finales.

### Lint

```bash
npm run lint
```

### Formatear el código

```bash
npm run format
```

### Ejecutar tests

```bash
npm test
```

---

## Notas

- El frontend se comunica con el backend Django vía API REST.
- Puedes simular la fecha desde la página de promociones para probar descuentos especiales.
---
