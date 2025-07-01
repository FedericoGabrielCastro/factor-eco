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
   - **Crea 2 usuarios VIP activos** (`vipuser1`, `vipuser2`)
   - **Crea 2 usuarios ex-VIP** (`exvipuser1`, `exvipuser2`)
   - **Crea 2 promociones especiales de ejemplo**
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
- **Comando para crear usuarios de prueba** (`create_base_users`):
  - 10 usuarios normales (`testuser1` a `testuser10`)
  - 2 usuarios VIP activos (`vipuser1`, `vipuser2`)
  - 2 usuarios ex-VIP (`exvipuser1`, `exvipuser2`)
- **Gestión automática de estado VIP**:
  - Usuarios que gastan >$10,000 en un mes se vuelven VIP el mes siguiente
  - Usuarios que no compran en un mes pierden VIP
  - Se considera el valor real pagado (después de descuentos)

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
- **Middleware para simular fecha** por parámetro de URL (`?fecha=YYYY-MM-DD`).
- Utilidades para obtener la fecha efectiva.
- Vistas para listar promociones activas.
- **Comando para crear promociones base de ejemplo:**
  ```bash
  poetry run python manage.py create_base_promotions
  ```
  Esto crea dos promociones:
  - "Mega descuento 2025" ($300 descuento, válida todo 2025)
  - "Año del programador 2024" ($300 descuento, válida todo 2024)
- Tests automatizados.

### `carts/`
- Gestión de carritos de compra (`Cart`, `CartItem`).
- **Tipos de carrito exclusivos**:
  - `VIP`: Para usuarios con estado VIP
  - `FECHA_ESPECIAL`: Para fechas con promociones activas
  - `COMUN`: Para usuarios normales sin promociones
- **Lógica de descuentos automática**:
  1. **25% descuento** si se compran exactamente 4 productos
  2. **$100 descuento** si se compran más de 10 productos
  3. **$300 descuento** si el carrito es de fecha especial
  4. **Producto más barato gratis + $500 descuento** si el carrito es VIP
- Serializadores y vistas para crear, modificar y eliminar items del carrito.
- **Creación automática de carritos** según tipo de usuario y promociones activas.
- Señal para finalizar carrito y comando para limpiar carritos inactivos (`cleanup_carts`).

### `orders/`
- Gestión de pedidos (`Order`) relacionados uno a uno con carritos finalizados.
- Serializadores y vistas para crear y listar pedidos.
- **Actualización automática del estado VIP** del usuario según compras mensuales.
- Cálculo del total real pagado (después de descuentos).

### `core/`
- Configuración principal del proyecto y utilidades globales.
- Middleware de simulación de fecha configurado.

---

## 👤 Usuarios de prueba
- **Usuarios normales:** `testuser1`, `testuser2`, ..., `testuser10`
- **Usuarios VIP activos:** `vipuser1`, `vipuser2`
- **Usuarios ex-VIP:** `exvipuser1`, `exvipuser2`
- **Contraseña para todos:** `testpassword123`
- **Todos los usuarios inician sin carritos ni historial de pedidos.**

---

## 🎯 Funcionalidades principales

### **Tipos de carrito y exclusividad**
- Los carritos son mutuamente excluyentes: VIP, FECHA_ESPECIAL, o COMUN
- Un carrito NO puede ser VIP y de fecha especial a la vez
- La lógica determina automáticamente el tipo basado en estado VIP y promociones activas

### **Funcionalidades del carrito**
- ✅ Crear carrito nuevo
- ✅ Eliminar carrito
- ✅ Agregar productos al carrito
- ✅ Eliminar productos del carrito
- ✅ Consultar estado del carrito (total a pagar)
- ✅ Visualizar ítems sin implementar pagos

### **Simulación de fecha**
- Parámetro `?fecha=YYYY-MM-DD` para simular fechas
- Middleware `DateSimulationMiddleware` procesa el parámetro
- Permite probar promociones de diferentes fechas

### **Registro de compras**
- Las compras se registran en el modelo `Order`
- Carritos no finalizados se mantienen activos
- Sistema de finalización de órdenes implementado

### **Múltiples compras por día**
- Los usuarios pueden crear múltiples carritos
- Cada carrito puede ser finalizado independientemente

### **Cálculo de descuentos**
- ✅ 25% descuento por exactamente 4 productos
- ✅ $100 descuento por más de 10 productos
- ✅ $300 descuento por fecha especial
- ✅ Producto más barato gratis + $500 descuento para VIP

### **Gestión automática de VIP**
- Usuarios que gastan >$10,000 en un mes se vuelven VIP
- Usuarios que no compran en un mes pierden VIP
- Se considera el valor real pagado (después de descuentos)

---

## 🛠️ Comandos útiles

- **Levantar entorno demo completo:**
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
- **Crear promociones base manualmente:**
  ```bash
  poetry run python manage.py create_base_promotions
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

## 🔧 Tecnologías utilizadas
- **Backend**: Django 5.2.3 + Django REST Framework
- **Base de datos**: SQLite (configurable)
- **Autenticación**: Session-based
- **Documentación**: Swagger/OpenAPI con drf-spectacular
- **Gestión de dependencias**: Poetry
- **Middleware**: Simulación de fechas para testing
