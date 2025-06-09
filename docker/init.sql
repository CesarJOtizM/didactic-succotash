-- Script de inicialización para la base de datos PostgreSQL
-- Este archivo se ejecuta automáticamente cuando se crea el contenedor

-- Crear extensiones útiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Crear esquemas adicionales si es necesario
-- CREATE SCHEMA IF NOT EXISTS app_schema;

-- Mensaje de confirmación
SELECT 'Base de datos inicializada correctamente' AS status; 