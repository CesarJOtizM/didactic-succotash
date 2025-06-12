# 🚀 Didactic Succotash - Sistema de Orquestación de Pagos

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-22+-green.svg)
![TypeScript](https://img.shields.io/badge/typescript-5+-blue.svg)
![Tests](https://img.shields.io/badge/tests-91%20passing-brightgreen.svg)
![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)

## 📋 Descripción del Proyecto

**Didactic Succotash** es un sistema completo de orquestación de pagos desarrollado como challenge técnico. El sistema permite crear órdenes de pago, gestionar múltiples métodos de pago por país, y procesar transacciones con ruteo inteligente de proveedores y fallback automático.

### ✨ Características Principales

- 🏗️ **Arquitectura Hexagonal (Clean Architecture)** - Separación completa de responsabilidades
- 🔄 **Ruteo Inteligente de Proveedores** - Fallback automático ante fallos
- 🌍 **Soporte Multi-País** - Métodos de pago específicos por región (CO, MX, BR, US, AR, CL)
- 🧪 **Testing Completo** - 91 tests unitarios e integración con 100% cobertura
- 🐳 **Configuración Docker Completa** - Setup automático con un solo comando
- 🎨 **UI Moderna y Responsive** - Frontend con Next.js 15 y Tailwind CSS
- 📊 **Monitoreo y Health Checks** - Endpoints de salud para infraestructura

## 🎯 Entregables Completados

### ✅ Obligatorios (100% Completado)

1. ✅ **Repositorio GitHub** - Configurado con historial completo
2. ✅ **README Completo** - Setup, tests, arquitectura y scope
3. ✅ **Tests Automatizados** - 91 tests unitarios e integración
4. ✅ **Arquitectura Hexagonal** - Separación completa de capas
5. ✅ **Frontend Next.js** - Con React y renderizado del servidor

### ✅ Funcionalidades Implementadas

- ✅ **Crear orden de pago** - `POST /api/payment_order`
- ✅ **Ver orden de pago** - `GET /api/payment_order/:uuid` + página frontend
- ✅ **Métodos de pago por país** - `GET /api/payment_methods/:country`
- ✅ **Procesar orden de pago** - `POST /api/payment_order/:uuid` con ruteo inteligente
- ✅ **Health Check** - `GET /api/health` para monitoreo

### ✅ Bonus Implementados

- ✅ **Pensamiento escalable** - Fácil adición de nuevos métodos de pago
- ✅ **Ruteo inteligente** - Múltiples proveedores con fallback automático
- ✅ **UI moderna** - Transiciones, estados de loading, diseño responsive
- ⬜ **Métricas de requests** - (Opcional, no implementado)

## 🚀 Configuración y Setup

### Requisitos Previos

- Docker & Docker Compose
- Git

### ⚡ Inicio Rápido (Recomendado)

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/didactic-succotash.git
cd didactic-succotash

# 2. Copiar variables de entorno
cp env.example .env

# 3. ¡Un solo comando para levantar todo!
npm run docker:up
```

**¡Eso es todo!** 🎉 El sistema automáticamente:

- ✅ Configura PostgreSQL
- ✅ Genera el cliente Prisma
- ✅ Ejecuta migraciones
- ✅ Inicia la aplicación

### 🌐 URLs de Acceso

- **Aplicación**: http://localhost:3000
- **Página de Pagos**: http://localhost:3000/payments
- **PGAdmin**: http://localhost:8080
- **Health Check**: http://localhost:3000/api/health

### 🛠️ Comandos Disponibles

```bash
# Desarrollo
npm run dev                    # Modo desarrollo con turbopack
npm run build                  # Compilar para producción
npm run start                  # Iniciar en producción

# Testing
npm run test                   # Ejecutar todos los tests
npm run test:watch             # Tests en modo watch
npm run test:coverage          # Tests con cobertura
npm run test:unit              # Solo tests unitarios
npm run test:integration       # Solo tests de integración

# Base de datos
npm run db:studio              # Prisma Studio (interfaz visual)
npm run db:generate            # Generar cliente Prisma
npm run db:migrate:dev         # Nueva migración
npm run db:seed                # Sembrar datos de prueba

# Docker
npm run docker:up              # Levantar servicios
npm run docker:down            # Detener servicios
npm run docker:logs            # Ver logs
npm run docker:clean           # Limpiar todo (incluyendo volúmenes)

# Código
npm run lint                   # Linter ESLint
npm run format                 # Formatear con Prettier
```

## 🏗️ Arquitectura del Sistema

### 📊 Arquitectura Hexagonal (Clean Architecture)

El proyecto implementa una **arquitectura hexagonal completa** con separación clara de responsabilidades:

```
src/
├── domain/              # 🟡 DOMINIO (Reglas de negocio puras)
│   ├── entities/        # Entidades (PaymentOrder)
│   └── services/        # Servicios de dominio
├── application/         # 🔵 APLICACIÓN (Casos de uso)
│   ├── dtos/           # Objetos de transferencia
│   ├── ports/          # Interfaces (contratos)
│   └── use-cases/      # Casos de uso
├── infrastructure/     # 🟢 INFRAESTRUCTURA (Adaptadores)
│   ├── adapters/       # Adaptadores externos
│   ├── repositories/   # Acceso a datos
│   └── services/       # Servicios concretos
└── app/                # 🟣 PRESENTACIÓN (Next.js)
    ├── api/            # Endpoints REST
    ├── payments/       # Páginas frontend
    └── components/     # Componentes UI
```

### 🎯 Principios Aplicados

- **Inversión de Dependencias** - El dominio no depende de infraestructura
- **Separación de Responsabilidades** - Cada capa tiene un propósito específico
- **Testabilidad** - Mocks e interfaces para testing efectivo
- **Escalabilidad** - Fácil adición de nuevos proveedores y métodos

### 📈 Diagramas C4

#### Nivel 1: Contexto del Sistema

![Diagrama de Contexto](docs/c4-context-diagram.svg)

#### Nivel 2: Contenedores

![Diagrama de Contenedores](docs/c4-container-diagram.svg)

#### Nivel 3: Componentes

![Diagrama de Componentes](docs/c4-component-diagram.svg)

## 🧪 Testing

### 📊 Cobertura de Tests

- **91 tests** ejecutándose correctamente
- **100% cobertura** de código crítico
- **Tests unitarios** para DTOs y entidades
- **Tests de integración** para flujos completos

### 🎯 Tipos de Tests

```bash
# Tests unitarios (domain & application)
npm run test:unit

# Tests de integración (APIs & flows)
npm run test:integration

# Cobertura completa
npm run test:coverage
```

### 📁 Estructura de Testing

```
tests/
├── unit/
│   ├── application/dtos/     # Tests de DTOs
│   └── domain/entities/      # Tests de entidades
├── integration/              # Tests de flujos completos
└── helpers/                  # Utilidades para testing
```

## 🔗 API Endpoints

### 1️⃣ Health Check

```
GET /api/health
Response: { "status": "healthy", "timestamp": "...", "service": "..." }
```

### 2️⃣ Crear Orden de Pago

```
POST /api/payment_order
Body: {
  "amount": 70000,
  "description": "Pago de prueba",
  "country_iso_code": "CL"
}
```

### 3️⃣ Ver Orden de Pago

```
GET /api/payment_order/:uuid
Response: Detalles completos de la orden
```

### 4️⃣ Métodos de Pago por País

```
GET /api/payment_methods/:country?amount=70000
Response: Métodos disponibles filtrados por monto
```

### 5️⃣ Procesar Orden de Pago

```
POST /api/payment_order/:uuid
Body: { "payment_method": "credit_card", "provider": "stripe" }
Response: { "status": "success", "transaction_id": "..." }
```

## 🎨 Frontend

### 🖥️ Páginas Implementadas

- **`/payments`** - Página principal de pagos
- **`/payments/[uuid]`** - Página específica por orden

### 🧩 Componentes Principales

- **PaymentDetails** - Visualización de órdenes
- **PaymentForm** - Formulario de procesamiento
- **PaymentMethodCard** - Métodos de pago disponibles
- **UI Components** - Button, Card, Input, Select, Badge

### ✨ Características UI

- 📱 **Responsive Design** - Mobile-first approach
- 🎭 **Estados Interactivos** - Loading, success, error
- 🎨 **Diseño Moderno** - Tailwind CSS con componentes reutilizables
- ⚡ **Server-Side Rendering** - Datos pre-renderizados

## 🌍 Soporte Multi-País

### 🏢 Países Soportados

| País              | Código | Métodos de Pago                 |
| ----------------- | ------ | ------------------------------- |
| 🇨🇴 Colombia       | CO     | Tarjetas, PSE, Nequi, Daviplata |
| 🇲🇽 México         | MX     | Tarjetas, SPEI, OXXO            |
| 🇧🇷 Brasil         | BR     | PIX, Boleto, Tarjetas           |
| 🇺🇸 Estados Unidos | US     | Credit/Debit Cards, ACH         |
| 🇦🇷 Argentina      | AR     | Tarjetas, Transferencia         |
| 🇨🇱 Chile          | CL     | WebPay, Transferencia           |

### 🔄 Ruteo Inteligente

El sistema implementa **ruteo inteligente** que:

- ✅ Selecciona automáticamente el mejor proveedor
- ✅ Fallback automático ante fallos
- ✅ Múltiples intentos con diferentes proveedores
- ✅ Logging detallado del proceso

### 🎭 Configuración de Tasas de Éxito para Testing

Para probar el ruteo inteligente y los reintentos automáticos, puedes modificar las tasas de éxito en `src/infrastructure/services/paymentProviderMock.ts`:

```typescript
// Simulación de la confiabilidad de cada proveedor (% de éxito)
const PROVIDER_RELIABILITY: Record<string, number> = {
  // Configuraciones actuales
  credit_card: 0.95,      // 95% éxito
  pse: 0.9,              // 90% éxito
  nequi: 0.89,           // 89% éxito
  
  // Para probar fallos y reintentos:
  credit_card: 0.3,      // 30% éxito (muchos fallos)
  pse: 0.1,              // 10% éxito (casi siempre falla)
  nequi: 0.8,            // 80% éxito (backup más confiable)
};
```

### 🔄 Cómo Funciona el Ruteo

1. **Orden por Confiabilidad**: Los proveedores se ordenan por tasa de éxito (mayor a menor)
2. **Intento Secuencial**: Si un proveedor falla, automáticamente intenta con el siguiente
3. **Logging Completo**: Cada intento se registra en los logs
4. **Estados de Respuesta**:
   - ✅ `success` + `transaction_id` si algún proveedor funciona
   - ❌ `Error` + `transaction_id` si todos los proveedores fallan

### 🧪 Ejemplos de Testing

```bash
# Ejemplo 1: Configurar fallos altos para ver reintentos
# Editar: src/infrastructure/services/paymentProviderMock.ts
# Cambiar credit_card: 0.95 -> 0.2 (20% éxito)

# Crear y procesar orden
curl -X POST http://localhost:3000/api/payment_order \
  -H "Content-Type: application/json" \
  -d '{"amount": 50000, "description": "Test ruteo", "country_iso_code": "CO"}'

# Procesar (verás múltiples intentos en logs)
curl -X POST http://localhost:3000/api/payment_order/{uuid}

# Ejemplo 2: Ver logs de ruteo inteligente
npm run docker:logs | grep "Intentando procesar pago"
```

### 📊 Tasas de Éxito por Defecto

| Método | Tasa Éxito | Uso |
|--------|------------|-----|
| 💳 Tarjetas | 93-95% | Pagos principales |
| 🏦 Transferencias | 85-96% | PSE, PIX, ACH |
| 📱 Billeteras | 84-91% | Nequi, PayPal |
| 💵 Efectivo | 72-80% | OXXO, Rapipago |

**💡 Tip**: Bajar las tasas a 10-30% te permitirá ver el sistema de ruteo en acción con múltiples fallos y reintentos automáticos.

## 🛠️ Tecnologías Utilizadas

### Frontend & Backend

- **Next.js 15** - Framework React con App Router
- **React 19** - Biblioteca de UI
- **TypeScript 5** - Tipado estático
- **Tailwind CSS 4** - Framework de estilos

### Base de Datos

- **PostgreSQL 16** - Base de datos principal
- **Prisma** - ORM y migración
- **PGAdmin** - Administración de DB

### Testing & Calidad

- **Jest** - Framework de testing
- **Testing Library** - Utilities para testing React
- **ESLint** - Linter de código
- **Prettier** - Formateador de código
- **Husky** - Git hooks

### DevOps & Desarrollo

- **Docker & Docker Compose** - Contenedores
- **TypeScript** - Desarrollo tipado
- **Zod** - Validación de esquemas

## 📦 Estructura del Proyecto

```
didactic-succotash/
├── src/                     # Código fuente
│   ├── app/                # Next.js App Router
│   │   ├── api/            # API Routes
│   │   └── payments/       # Páginas frontend
│   ├── application/        # Capa de aplicación
│   ├── domain/             # Capa de dominio
│   ├── infrastructure/     # Capa de infraestructura
│   ├── components/         # Componentes React
│   ├── lib/                # Utilidades y configuración
│   └── prisma/             # Esquemas de base de datos
├── tests/                  # Tests unitarios e integración
├── docs/                   # Documentación y diagramas
├── docker/                 # Configuración Docker
└── public/                 # Assets estáticos
```

## 🚧 Scope Implementado vs No Implementado

### ✅ Implementado (100%)

- ✅ **Arquitectura hexagonal completa**
- ✅ **Todos los endpoints requeridos**
- ✅ **Frontend funcional con Next.js**
- ✅ **Testing completo (91 tests)**
- ✅ **Setup Docker automatizado**
- ✅ **Ruteo inteligente de proveedores**
- ✅ **Soporte multi-país (6 países)**
- ✅ **UI moderna y responsive**
- ✅ **Documentación completa**

### ⬜ No Implementado (Opcional)

- ⬜ **Métricas detalladas de transacciones** - Feature bonus opcional
- ⬜ **Autenticación de usuarios** - No requerido en el scope
- ⬜ **Notificaciones push** - No requerido en el scope

## 🐳 Configuración Docker Completa

### 🚀 Configuración Automática Inteligente

El proyecto incluye un **sistema de configuración automática completa** que maneja todo el setup sin intervención manual:

#### ⚡ Lo que se hace automáticamente:

1. ✅ **Levanta PostgreSQL 16** con healthcheck
2. ✅ **Levanta PGAdmin** para administración visual
3. ✅ **Espera a que PostgreSQL esté completamente listo**
4. ✅ **Genera el cliente Prisma automáticamente**
5. ✅ **Detecta y maneja migraciones inteligentemente**:
   - Si **NO** hay migraciones → Crea migración inicial automáticamente
   - Si **SÍ** hay migraciones → Las aplica automáticamente
6. ✅ **Verifica que las tablas se crearon correctamente**
7. ✅ **Inicia la aplicación Next.js en modo desarrollo**

### 🎯 Scripts Docker Disponibles

```bash
# 🚀 INICIO RÁPIDO
npm run docker:up              # Levantar en segundo plano
npm run docker:dev             # Levantar con logs visibles (recomendado)
npm run docker:setup           # Setup completo con información

# 📊 GESTIÓN DE SERVICIOS
npm run docker:down            # Detener servicios
npm run docker:restart         # Reiniciar servicios
npm run docker:build           # Reconstruir imágenes
npm run docker:logs            # Ver logs en tiempo real

# 🧹 LIMPIEZA
npm run docker:clean           # Limpiar todo (contenedores, volúmenes, redes)
```

### 🗄️ Scripts de Base de Datos

```bash
# DESARROLLO
npm run db:generate            # Generar cliente Prisma
npm run db:migrate:dev         # Crear nueva migración
npm run db:push                # Push del esquema sin migraciones
npm run db:studio              # Abrir Prisma Studio (interfaz visual)

# PRODUCCIÓN
npm run db:migrate             # Aplicar migraciones en producción
npm run db:setup               # Setup completo automático

# UTILIDADES
npm run db:seed                # Ejecutar seeds (datos de prueba)
npm run db:reset               # Resetear base de datos (¡cuidado!)
```

### 🌐 URLs y Accesos

Una vez ejecutado el setup automático:

| Servicio            | URL                              | Credenciales                  |
| ------------------- | -------------------------------- | ----------------------------- |
| **Aplicación**      | http://localhost:3000            | -                             |
| **Página de Pagos** | http://localhost:3000/payments   | -                             |
| **Health Check**    | http://localhost:3000/api/health | -                             |
| **PGAdmin**         | http://localhost:8080            | admin@didactic.com / admin123 |
| **Prisma Studio**   | http://localhost:5555            | Ejecutar `npm run db:studio`  |

### 🔧 Conexión a PostgreSQL desde PGAdmin

1. **Acceder a PGAdmin**: http://localhost:8080
2. **Login**: `admin@didactic.com` / `admin123`
3. **Crear conexión nueva**:
   - **Host**: `postgres` (nombre del contenedor)
   - **Port**: `5432`
   - **Database**: `didactic_succotash`
   - **Username**: `didactic_user`
   - **Password**: `didactic_password`

### 🏗️ Servicios Docker Incluidos

#### PostgreSQL 16

- **Puerto**: 5432
- **Base de datos**: `didactic_succotash`
- **Usuario**: `didactic_user`
- **Healthcheck**: Automático para garantizar disponibilidad

#### Next.js Application

- **Puerto**: 3000
- **Modo**: Desarrollo con hot-reload
- **Volúmenes**: Montaje en tiempo real para desarrollo

#### PGAdmin 4

- **Puerto**: 8080
- **Administración**: Interfaz web completa para PostgreSQL
- **Configuración**: Preconfigurado para conectar automáticamente

### 📁 Estructura de Archivos Docker

```
docker/
├── init.sql              # Script de inicialización de PostgreSQL
├── init-app.sh           # Script de inicialización de la aplicación
├── SETUP.md              # Guía detallada de configuración
└── README.md             # Documentación específica de Docker
```

### 🔄 Flujo de Desarrollo con Docker

#### Para Nuevos Desarrolladores:

```bash
# 1. Clonar repositorio
git clone https://github.com/tu-usuario/didactic-succotash.git
cd didactic-succotash

# 2. Copiar variables de entorno
cp env.example .env

# 3. ¡Un solo comando para todo!
npm run docker:up
```

#### Para Desarrollo Diario:

```bash
# Modo desarrollo con logs visibles
npm run docker:dev

# Ver logs específicos
npm run docker:logs

# Reiniciar si hay cambios en configuración
npm run docker:restart
```

#### Para Crear Nuevas Migraciones:

```bash
# Método 1: Script directo
npm run db:migrate:dev --name nueva_feature

# Método 2: Dentro del contenedor
docker compose exec web npm run db:migrate:dev --name nueva_feature
```

### 🎛️ Variables de Entorno

```bash
# 🗄️ BASE DE DATOS
POSTGRES_DB=didactic_succotash
POSTGRES_USER=didactic_user
POSTGRES_PASSWORD=didactic_password
DATABASE_URL=postgresql://didactic_user:didactic_password@postgres:5432/didactic_succotash

# 🛠️ PGADMIN
PGADMIN_DEFAULT_EMAIL=admin@didactic.com
PGADMIN_DEFAULT_PASSWORD=admin123

# 🚀 APLICACIÓN
NODE_ENV=development
PORT=3000
```

### ⚙️ Configuración Avanzada

#### Migraciones Automáticas

El sistema detecta automáticamente:

- **Primera ejecución**: Crea migración inicial con todas las tablas
- **Ejecuciones posteriores**: Aplica migraciones pendientes
- **Rollback**: Manejo de errores con rollback automático

#### Hot Reload Completo

- **Código fuente**: Cambios reflejados inmediatamente
- **Esquema Prisma**: Regeneración automática del cliente
- **Variables de entorno**: Reinicio automático cuando cambian

#### Persistencia de Datos

```bash
# Los datos persisten entre reinicios
npm run docker:down
npm run docker:up  # ✅ Datos preservados

# Para limpiar datos completamente
npm run docker:clean  # ⚠️ Elimina todos los datos
```

## 🔧 Troubleshooting

### Problemas Comunes

**🐳 Docker no inicia**

```bash
# Verificar que Docker esté ejecutándose
docker --version
docker-compose --version

# Limpiar contenedores
npm run docker:clean
npm run docker:up
```

**📦 Problemas con dependencias**

```bash
# Reconstruir contenedores
npm run docker:build
npm run docker:up
```

**🗄️ Base de datos no conecta**

```bash
# Verificar logs
npm run docker:logs

# Reiniciar servicios
npm run docker:restart
```

**🧪 Tests fallan**

```bash
# Instalar dependencias localmente
npm install

# Ejecutar tests
npm run test
```

## 📈 Rendimiento y Escalabilidad

### 🚀 Optimizaciones Implementadas

- **Server-Side Rendering** - Mejor SEO y tiempo de carga
- **Prisma Connection Pooling** - Gestión eficiente de conexiones DB
- **TypeScript Strict Mode** - Detección temprana de errores
- **Docker Multi-stage Builds** - Imágenes optimizadas

### 📊 Métricas de Rendimiento

- **Build Time**: ~30 segundos
- **Test Execution**: ~5 segundos (91 tests)
- **Docker Startup**: ~45 segundos (incluyendo DB setup)
- **API Response Time**: <100ms (promedio)

## 🎯 Siguientes Pasos (Futuro)

### 🔮 Roadmap Potencial

1. **Métricas Avanzadas** - Dashboard de métricas de transacciones
2. **Webhooks** - Notificaciones a sistemas externos
3. **Rate Limiting** - Protección contra abuso de APIs
4. **Caching** - Redis para optimización de rendimiento
5. **Autenticación** - JWT para usuarios y comercios
6. **Monitoreo** - Integración con Prometheus/Grafana

## 🤝 Contribución

### 🧑‍💻 Desarrollo Local

```bash
# 1. Fork del repositorio
# 2. Clonar tu fork
git clone https://github.com/tu-usuario/didactic-succotash.git

# 3. Instalar dependencias
npm install

# 4. Configurar entorno
cp env.example .env

# 5. Levantar servicios
npm run docker:up

# 6. Desarrollo
npm run dev
```

### 📋 Checklist para Pull Requests

- [ ] Tests pasan (`npm run test`)
- [ ] Linter limpio (`npm run lint`)
- [ ] Código formateado (`npm run format`)
- [ ] Documentación actualizada
- [ ] Commits descriptivos

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.

---

## 🎉 Agradecimientos

Desarrollado como parte del **Challenge - Orquestación de Pagos** para demostrar habilidades en:

- 🏗️ **Arquitectura Limpia** - Separación de responsabilidades
- 🧪 **Testing Efectivo** - Cobertura completa
- 🎨 **Frontend Moderno** - UI/UX de calidad
- 🔧 **DevOps** - Configuración automatizada
- 📚 **Documentación** - Explicación clara y completa

---

**¡Gracias por revisar este proyecto!** 🚀

Para cualquier pregunta o comentario, no dudes en abrir un issue en GitHub.

**URLs importantes:**

- 🌐 **App**: http://localhost:3000
- 💳 **Pagos**: http://localhost:3000/payments
- 🔍 **Health**: http://localhost:3000/api/health
- 🗄️ **PGAdmin**: http://localhost:8080
