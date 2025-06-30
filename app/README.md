# Factor Eco - Backend

Factor Eco es una plataforma e-commerce desarrollada en Django 5.2.3 y Python 3.12, con gestión de dependencias mediante Poetry. Este backend provee APIs RESTful para la gestión de usuarios, productos, promociones, carritos, pedidos y autenticación, incluyendo lógica de usuarios VIP y descuentos automáticos.

## 🚀 ¿Cómo levantar la app desde cero?

1. **Clona el repositorio y entra a la carpeta `app/`:**
   ```bash
   cd app
   ```
2. **Ejecuta el script de demo:**
   ```bash
   ./setup_demo.sh
   ```
   Este script:
   - Instala dependencias con Poetry
   - Borra la base de datos SQLite anterior (si existe)
   - Ejecuta migraciones
   - Carga 15 productos base
   - Crea 10 usuarios de prueba (`testuser1` a `testuser10`, contraseña: `testpassword123`)
   - Levanta el servidor en `http://localhost:8000`

3. **Accede a la documentación interactiva:**
   - Swagger: [http://localhost:8000/api/docs/](http://localhost:8000/api/docs/)
   - Redoc: [http://localhost:8000/api/redoc/](http://localhost:8000/api/redoc/)

---

## 🗂️ Estructura del proyecto

```
app/
├── carts/         # Gestión de carritos de compra y lógica de descuentos
├── core/          # Configuración principal y utilidades globales
├── orders/        # Gestión de pedidos y relación con carritos finalizados
├── products/      # Catálogo de productos, administración y carga automática
├── promotions/    # Promociones por fechas especiales y lógica de descuentos
├── session/       # Autenticación por sesión, login/logout y usuario actual
├── users/         # Gestión de usuarios extendidos y perfiles VIP
├── setup_demo.sh  # Script para inicializar el entorno demo
├── README.md      # Esta guía
└── ...            # Otros archivos y configuraciones
```

---

## 📦 ¿Para qué sirve cada módulo?

### `users/`
- **Gestión de usuarios extendidos** (modelo `UserProfile` con estado VIP, fechas de vigencia, etc).
- Señales para crear automáticamente el perfil al crear un usuario.
- Serializadores y vistas para filtrar usuarios por estado VIP y ver historial de cambios.
- Comando para crear 10 usuarios de prueba (`create_base_users`).

### `session/`
- Autenticación por sesión (login, logout, usuario actual).
- Endpoints protegidos y documentación con drf-spectacular.
- Soporte para pruebas con CSRF y cookies.

### `products/`
- Catálogo de productos (`Product`).
- Serializadores y vistas para listar y obtener detalle de productos.
- Comando para asegurar al menos 15 productos base (`ensure_base_products`).
- Signal para crear productos base automáticamente tras migraciones.
- Endpoint para forzar la carga de productos base.

### `promotions/`
- Gestión de promociones por fechas especiales (`SpecialDatePromotion`).
- Middleware para simular fecha por parámetro de URL.
- Utilidades para obtener la fecha efectiva.
- Vistas para listar promociones activas.
- Tests automatizados.

### `carts/`
- Gestión de carritos de compra (`Cart`, `CartItem`).
- Lógica de descuentos por cantidad, tipo de usuario (VIP), o fecha especial.
- Serializadores y vistas para crear, modificar y eliminar items del carrito.
- Señal para finalizar carrito y comando para limpiar carritos inactivos (`cleanup_carts`).

### `orders/`
- Gestión de pedidos (`Order`) relacionados uno a uno con carritos finalizados.
- Serializadores y vistas para crear y listar pedidos.
- Actualización automática del estado VIP del usuario según compras.

### `core/`
- Configuración principal del proyecto y utilidades globales.

---

## 👤 Usuarios de prueba
- **Usuarios:** `testuser1`, `testuser2`, ..., `testuser10`
- **Contraseña:** `testpassword123`
- **Todos los usuarios inician sin carritos ni historial de pedidos.**

---

## 🛠️ Comandos útiles

- **Levantar entorno demo:**
  ```bash
  ./setup_demo.sh
  ```
- **Crear productos base manualmente:**
  ```bash
  poetry run python manage.py ensure_base_products --force
  ```
- **Crear usuarios base manualmente:**
  ```bash
  poetry run python manage.py create_base_users
  ```
- **Limpiar carritos inactivos:**
  ```bash
  poetry run python manage.py cleanup_carts
  ```

---

## 📚 Documentación API
- Swagger: `/api/docs/`
- Redoc: `/api/redoc/`

---

## 💡 Notas
- Todos los comentarios en el código están en inglés.
- El sistema está preparado para pruebas rápidas y reseteo total del entorno demo.
- Si usas otra base de datos distinta a SQLite, ajusta el script `setup_demo.sh` según corresponda.

---