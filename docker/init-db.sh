#!/bin/bash

echo "🔄 Iniciando configuración de la base de datos..."

# Esperar a que PostgreSQL esté disponible
echo "⏳ Esperando a que PostgreSQL esté listo..."
until pg_isready -h postgres -p 5432 -U didactic_user; do
  echo "PostgreSQL no está listo aún, esperando..."
  sleep 2
done

echo "✅ PostgreSQL está listo!"

# Generar cliente de Prisma
echo "🔧 Generando cliente de Prisma..."
bunx prisma generate --schema=src/prisma/schema.prisma

# Aplicar el esquema a la base de datos
echo "📊 Aplicando esquema a la base de datos..."
bunx prisma db push --schema=src/prisma/schema.prisma

echo "🎉 Base de datos configurada correctamente!"
echo "🚀 Iniciando aplicación..."

# Ejecutar el comando que se pase como argumento
exec "$@" 