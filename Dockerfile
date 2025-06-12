# Imagen base oficial de Bun
FROM oven/bun:1-alpine AS base

# Actualizar paquetes de seguridad e instalar npm
RUN apk update && apk upgrade && apk add --no-cache libc6-compat nodejs npm

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de dependencias
COPY package*.json ./
COPY bun.lock* ./

# Instalar dependencias con Bun (sin scripts de prepare para evitar Husky)
RUN bun install --ignore-scripts

# Etapa de desarrollo
FROM base AS dev
WORKDIR /app

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 3000

# Variables de entorno para desarrollo
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# Asegurar que node_modules tenga los permisos correctos
RUN chown -R $(whoami):$(whoami) /app/node_modules || true

# Instalar postgresql-client para pg_isready
RUN apk add --no-cache postgresql-client

# Comando por defecto para desarrollo
CMD ["bun", "run", "dev"]

# Etapa de construcción para producción
FROM base AS builder
WORKDIR /app

# Copiar código fuente
COPY . .

# Generar archivos de Prisma (si existe)
RUN if [ -f "./node_modules/.bin/prisma" ]; then bunx prisma generate; fi

# Construir aplicación
RUN bun run build

# Etapa de producción
FROM oven/bun:1-alpine AS production

# Actualizar paquetes de seguridad e instalar npm
RUN apk update && apk upgrade && apk add --no-cache libc6-compat nodejs npm

WORKDIR /app

# Instalar solo dependencias de producción con Bun
COPY package*.json ./
COPY bun.lock* ./
RUN bun install --ignore-scripts

# Copiar archivos construidos
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Cambiar propietario de archivos
RUN chown -R nextjs:nodejs /app
USER nextjs

# Exponer puerto
EXPOSE 3000

# Variables de entorno para producción
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Comando para producción
CMD ["bun", "start"] 