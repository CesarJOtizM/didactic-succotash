# 🐳 Configuración Docker - Didactic Succotash

## 🚀 Inicio Rápido (Un Solo Comando)

Para iniciar toda la aplicación con configuración automática:

```bash
# Opción 1: Con logs visibles (recomendado para desarrollo)
bun run docker:dev

# Opción 2: En segundo plano
bun run docker:setup
```

## 📋 ¿Qué se configura automáticamente?

Cuando ejecutas `docker compose up`, automáticamente se:

1. ✅ **Levanta PostgreSQL** con la base de datos `didactic_succotash`
2. ✅ **Levanta PGAdmin** para administrar la base de datos
3. ✅ **Espera a que PostgreSQL esté listo**
4. ✅ **Genera el cliente de Prisma**
5. ✅ **Crea y aplica migraciones automáticamente**
6. ✅ **Verifica que las tablas se crearon**
7. ✅ **Inicia la aplicación Next.js**

## 🌐 URLs de Acceso

Una vez que todo esté configurado:

- **Aplicación**: http://localhost:3000
- **PGAdmin**: http://localhost:8080
  - Email: `admin@didactic.com`
  - Password: `admin123`

## 🗄️ Conexión a la Base de Datos desde PGAdmin

1. Ve a http://localhost:8080
2. Ingresa credenciales: `admin@didactic.com` / `admin123`
3. Crear nueva conexión con:
   - **Host**: `postgres`
   - **Port**: `5432`
   - **Database**: `didactic_succotash`
   - **Username**: `didactic_user`
   - **Password**: `didactic_password`

## 📊 Comandos Útiles

```bash
# Iniciar con logs visibles
bun run docker:dev

# Iniciar en segundo plano
bun run docker:up

# Ver logs
bun run docker:logs

# Reiniciar servicios
bun run docker:restart

# Parar servicios
bun run docker:down

# Limpiar todo (base de datos incluida)
bun run docker:clean
```

## 🔧 Desarrollo

El volumen de la aplicación está montado, por lo que los cambios en el código se reflejan inmediatamente sin necesidad de rebuilding.

## 📁 Estructura de Archivos Docker

```
docker/
├── init.sql          # Script de inicialización de PostgreSQL
├── init-app.sh       # Script de inicialización de la aplicación
└── README.md         # Este archivo
```

## 🐛 Solución de Problemas

### Si la aplicación no inicia:

```bash
bun run docker:logs
```

### Si la base de datos no se conecta:

```bash
docker compose exec postgres pg_isready -U didactic_user -d didactic_succotash
```

### Si necesitas reconstruir todo:

```bash
bun run docker:clean
bun run docker:dev
```

## 🎯 Scripts de Base de Datos Disponibles

Puedes ejecutar estos comandos desde dentro del contenedor:

```bash
# Entrar al contenedor
docker compose exec web bash

# Comandos disponibles:
bun run db:generate      # Generar cliente Prisma
bun run db:migrate:dev   # Crear nueva migración
bun run db:push          # Empujar cambios del schema
bun run db:studio        # Abrir Prisma Studio
bun run db:seed          # Ejecutar seeds (si existen)
```
