# Setup del Proyecto

## 🚀 Inicio Rápido

Para ejecutar el proyecto completo con configuración automática de base de datos:

```bash
# Clonar el repositorio
git clone <repository-url>
cd didactic-succotash

# Ejecutar con configuración automática
npm run docker:up
```

## 🔧 Configuración Automática

El proyecto incluye un sistema de configuración automática que:

1. **Espera a PostgreSQL**: Verifica que la base de datos esté lista
2. **Genera cliente Prisma**: Ejecuta `prisma generate`
3. **Maneja migraciones automáticamente**:
   - Si no existen migraciones → Crea migración inicial
   - Si existen migraciones → Las aplica automáticamente
4. **Inicia la aplicación**: Levanta Next.js en modo desarrollo

## 📊 Scripts de Base de Datos Disponibles

```bash
# Generar cliente Prisma
npm run db:generate

# Aplicar migraciones en producción
npm run db:migrate

# Crear nueva migración en desarrollo
npm run db:migrate:dev --name <nombre>

# Setup completo automático
npm run db:setup

# Push del esquema sin migraciones
npm run db:push

# Resetear base de datos (¡cuidado!)
npm run db:reset

# Abrir Prisma Studio
npm run db:studio
```

## 🐳 Scripts de Docker

```bash
# Levantar contenedores
npm run docker:up

# Bajar contenedores
npm run docker:down

# Reconstruir imágenes
npm run docker:build

# Ver logs
npm run docker:logs

# Reiniciar servicios
npm run docker:restart

# Limpiar todo (contenedores, volúmenes, redes)
npm run docker:clean

# Desarrollo con rebuild
npm run docker:dev

# Setup completo con información
npm run docker:setup
```

## 🌐 URLs del Proyecto

Después de ejecutar `docker:up`, tienes acceso a:

- **Aplicación**: http://localhost:3000
- **PGAdmin**: http://localhost:8080
  - Email: admin@didactic.com
  - Password: admin123

## 🛠️ Para Desarrolladores

### Crear Nueva Migración

```bash
# Dentro del contenedor
docker compose exec web bun run db:migrate:dev --name nueva_feature

# O usando el script local
npm run db:migrate:dev --name nueva_feature
```

### Problemas Comunes

1. **Error de módulos**: Ejecuta `docker compose build --no-cache`
2. **Base de datos no sincronizada**: Ejecuta `npm run docker:clean && npm run docker:up`
3. **Permisos**: En Linux, puede ser necesario usar `sudo` para limpiar archivos de Docker

### Estructura de Migraciones

```
src/prisma/
├── schema.prisma          # Esquema principal
├── migrations/            # Migraciones automáticas
│   ├── migration_lock.toml
│   └── YYYYMMDDHHMMSS_nombre/
│       └── migration.sql
└── generated/            # Cliente Prisma generado
```

## 🔄 Flujo de Desarrollo

1. **Modificar `schema.prisma`**
2. **Ejecutar migración**: `npm run db:migrate:dev --name descripcion`
3. **El cliente se regenera automáticamente**
4. **Usar las nuevas funcionalidades en el código**

¡El setup automático se encarga de todo! 🎉
