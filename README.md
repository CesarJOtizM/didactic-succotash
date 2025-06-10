# Configuración Docker para Didactic Succotash

Este directorio contiene la configuración de Docker para ejecutar la aplicación con PostgreSQL.

## Servicios incluidos

- **PostgreSQL 16**: Base de datos principal
- **Next.js App**: Aplicación frontend/backend
- **PGAdmin**: Interfaz web para administrar la base de datos (opcional)

## Configuración de la base de datos

- **Host**: localhost
- **Puerto**: 5432
- **Base de datos**: didactic_succotash
- **Usuario**: didactic_user
- **Contraseña**: didactic_password

## 🚀 Configuración Automática

¡El proyecto incluye **configuración automática completa**! Al ejecutar `docker:up`, el sistema automáticamente:

1. ✅ Espera a que PostgreSQL esté listo
2. ✅ Genera el cliente Prisma
3. ✅ Detecta si existen migraciones:
   - Si **NO** hay migraciones → Crea migración inicial automáticamente
   - Si **SÍ** hay migraciones → Las aplica automáticamente
4. ✅ Inicia la aplicación

**Para nuevos desarrolladores**: Solo necesitas ejecutar `npm run docker:up` y todo estará listo!

## Comandos útiles

### Iniciar servicios

```bash
npm run docker:up
# o
docker-compose up -d
```

### Ver logs

```bash
npm run docker:logs
# o
docker-compose logs -f
```

### Detener servicios

```bash
npm run docker:down
# o
docker-compose down
```

### Reconstruir contenedores

```bash
npm run docker:build
# o
docker-compose build --no-cache
```

### Limpiar todo (incluyendo volúmenes)

```bash
npm run docker:clean
# o
docker-compose down -v --remove-orphans
```

## URLs de acceso

- **Aplicación**: http://localhost:3000
- **PGAdmin**: http://localhost:8080
- **PostgreSQL**: localhost:5432

## Variables de entorno

Copia el archivo `env.example` a `.env` y ajusta las variables según tus necesidades:

```bash
cp env.example .env
```

### Variables principales:

- `POSTGRES_DB`: Nombre de la base de datos (por defecto: didactic_succotash)
- `POSTGRES_USER`: Usuario de PostgreSQL (por defecto: didactic_user)
- `POSTGRES_PASSWORD`: Contraseña de PostgreSQL (por defecto: didactic_password)
- `DATABASE_URL`: URL de conexión completa a la base de datos
- `PGADMIN_DEFAULT_EMAIL`: Email para acceder a PGAdmin (por defecto: admin@didactic.com)
- `PGADMIN_DEFAULT_PASSWORD`: Contraseña para PGAdmin (por defecto: admin123)

## Troubleshooting

### El contenedor web no inicia

- Verifica que el puerto 3000 no esté ocupado
- Revisa los logs: `docker-compose logs web`

### PostgreSQL no se conecta

- Verifica que el puerto 5432 no esté ocupado
- Espera a que PostgreSQL termine de inicializarse (el healthcheck debe pasar)
- Revisa los logs: `docker-compose logs postgres`

### PGAdmin no se conecta a PostgreSQL

- Asegúrate de que PostgreSQL esté funcionando
- Usa el hostname `postgres` (no `localhost`) cuando configures la conexión en PGAdmin
- Credenciales: Usuario `didactic_user`, Contraseña `didactic_password`, Base de datos `didactic_succotash`

### Problemas de permisos

- En Linux/WSL, asegúrate de que Docker tenga permisos adecuados
- Ejecuta: `sudo chown -R $USER:$USER .`

### Problemas con volúmenes

- Si hay problemas con node_modules, reconstruye los contenedores:
  ```bash
  docker-compose down -v
  docker-compose build --no-cache
  docker-compose up -d
  ```

## 🏗️ Arquitectura del Sistema (Diagramas C4)

### Nivel 1: Contexto del Sistema

![Diagrama de Contexto C4](docs/c4-context-diagram.svg)

**Descripción**: El sistema Didactic Succotash es una aplicación web para la gestión de órdenes de pago. Los usuarios interactúan con la aplicación web para crear y administrar órdenes, mientras que los administradores pueden gestionar la base de datos a través de PGAdmin.

### Nivel 2: Contenedores

![Diagrama de Contenedores C4](docs/c4-container-diagram.svg)

**Descripción**: La aplicación sigue una **arquitectura hexagonal (Clean Architecture)** con separación clara de responsabilidades:

- **Frontend**: Aplicación Next.js con React y TypeScript
- **API**: Rutas de API REST para manejo de órdenes de pago
- **Dominio**: Lógica de negocio pura sin dependencias externas
- **Aplicación**: Casos de uso y orquestación
- **Infraestructura**: Adaptadores para servicios externos y persistencia

### Nivel 3: Componentes

![Diagrama de Componentes C4](docs/c4-component-diagram.svg)

**Descripción**: Los componentes están organizados siguiendo los principios de Clean Architecture:

#### Capa de Presentación

- **Pages**: Páginas de Next.js que definen las rutas de la aplicación
- **Components**: Componentes reutilizables de React organizados en `features/` y `ui/`
- **API Routes**: Endpoints REST para el manejo de órdenes de pago

#### Capa de Aplicación

- **Use Cases**: Casos de uso que orquestan la lógica de negocio
- **DTOs**: Objetos de transferencia de datos para comunicación entre capas
- **Ports**: Interfaces que definen contratos con servicios externos

#### Capa de Dominio

- **Entities**: Entidades de negocio como `PaymentOrder` con sus reglas
- **Value Objects**: Objetos inmutables como `Money`, `OrderId`
- **Domain Services**: Servicios de dominio para lógica que cruza múltiples entidades

#### Capa de Infraestructura

- **Repositories**: Implementaciones de acceso a datos
- **Adapters**: Adaptadores para servicios externos
- **Services**: Servicios concretos como proveedores de pago

### Tecnologías Utilizadas

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Base de Datos**: PostgreSQL 16
- **Contenedores**: Docker + Docker Compose
- **Testing**: Jest + Testing Library
- **Code Quality**: ESLint, Prettier, Husky
- **Architecture**: Clean Architecture (Hexagonal)
