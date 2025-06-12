#!/bin/bash

# Script de inicialización automática para la aplicación
set -e

echo "🚀 Iniciando configuración automática de la aplicación..."

# Función para mostrar mensajes con colores
log_info() {
    echo -e "\033[1;34m[INFO]\033[0m $1"
}

log_success() {
    echo -e "\033[1;32m[SUCCESS]\033[0m $1"
}

log_error() {
    echo -e "\033[1;31m[ERROR]\033[0m $1"
}

# Esperar a que la base de datos esté lista
log_info "Esperando a que PostgreSQL esté listo..."
MAX_ATTEMPTS=30
ATTEMPTS=0

while ! pg_isready -h postgres -p 5432 -U didactic_user -d didactic_succotash &>/dev/null; do
    ATTEMPTS=$((ATTEMPTS + 1))
    if [ $ATTEMPTS -eq $MAX_ATTEMPTS ]; then
        log_error "No se pudo conectar a PostgreSQL después de $MAX_ATTEMPTS intentos"
        exit 1
    fi
    echo "Esperando conexión a PostgreSQL... (intento $ATTEMPTS/$MAX_ATTEMPTS)"
    sleep 2
done

log_success "PostgreSQL está listo!"

# Verificar si ya existe el directorio de migraciones
MIGRATIONS_DIR="/app/src/prisma/migrations"
if [ -d "$MIGRATIONS_DIR" ] && [ "$(ls -A $MIGRATIONS_DIR)" ]; then
    log_info "Migraciones existentes encontradas, aplicando..."
    bun run db:migrate
else
    log_info "No se encontraron migraciones, creando migración inicial..."
    
    # Generar el cliente de Prisma
    log_info "Generando cliente de Prisma..."
    bun run db:generate
    
    # Crear migración inicial
    log_info "Creando migración inicial..."
    bun run db:migrate:dev --name init --create-only
    
    # Aplicar migración
    log_info "Aplicando migración inicial..."
    bun run db:migrate
fi

# Regenerar el cliente por si acaso
log_info "Regenerando cliente de Prisma..."
bun run db:generate

# Verificar que la tabla existe
log_info "Verificando que las tablas se crearon correctamente..."
if bunx prisma db execute --file /dev/stdin --schema=src/prisma/schema.prisma <<< "SELECT 1 FROM payment_orders LIMIT 1;" &>/dev/null; then
    log_success "Tabla 'payment_orders' creada correctamente!"
else
    log_info "Tabla 'payment_orders' no existe, creándola..."
    bun run db:push
fi

log_success "Base de datos configurada correctamente!"
log_success "Aplicación lista para usar!"

# Mostrar información útil
echo ""
echo "==============================================="
echo "🎉 APLICACIÓN LISTA PARA USAR 🎉"
echo "==============================================="
echo "📱 Aplicación: http://localhost:3000"
echo "🗄️  PGAdmin: http://localhost:8080"
echo "   - Email: admin@didactic.com"
echo "   - Password: admin123"
echo "💾 Base de datos: didactic_succotash"
echo "   - Host: postgres"
echo "   - Port: 5432"
echo "   - User: didactic_user"
echo "==============================================="
echo ""

# Iniciar la aplicación
log_info "Iniciando servidor Next.js..."
exec bun run dev 