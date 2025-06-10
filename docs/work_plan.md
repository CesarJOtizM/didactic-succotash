---
### 📄 2️⃣ **Plan de trabajo para completar la prueba técnica (con checkboxes)**

# Plan de trabajo - Challenge Orquestación de Pagos

## 🎯 Objetivo
Desarrollar una solución completa para el challenge aplicando las mejores prácticas.
---

## 1️⃣ Fase de Análisis [✅]

- [x] Revisar en detalle el enunciado del challenge
- [x] Identificar entregables obligatorios
- [x] Revisar tecnologías y requerimientos funcionales

---

## 2️⃣ Setup inicial del proyecto [✅]

- [x] Crear repositorio GitHub
- [x] Setup inicial de proyecto Backend (NextJs)
- [x] Setup inicial de proyecto Frontend con React (dentro de NextJs)
- [x] Configuración de Docker
- [x] Configuración de base de datos (PostgreSQL implementado con docker-compose)
- [x] Documentar pasos de Setup en README

---

## 3️⃣ Arquitectura base [✅]

- [x] Definir estructura basada en arquitectura hexagonal
  - [x] Domain (estructura implementada con entidades y value objects)
  - [x] Application (estructura implementada con DTOs, ports y use cases)
  - [x] Infrastructure (estructura implementada con repositorios y servicios)
  - [x] API layer (implementado con validaciones y manejo de errores)
- [x] Diagramar arquitectura (diagramas C4 implementados)

---

## 4️⃣ Desarrollo de funcionalidades [🔄]

### 4.1 Crear orden de pago

- [x] Endpoint: `POST /api/payment_order` (implementado completamente con lógica de negocio)
- [x] Guardar orden en DB (implementado con Prisma)
- [x] Responder con el formato requerido (implementado con DTOs y validaciones)

### 4.2 Ver orden de pago

- [🔄] Endpoint: `GET /payment_order/:uuid` (página básica creada, sin implementación)
- [ ] Obtener datos desde DB y renderizar

### 4.3 Listar métodos de pago asociados al país

- [ ] Endpoint: `GET /payment_order/:uuid`
- [ ] Mockear lista de métodos de pago y renderizar en UI

### 4.4 Procesar orden de pago

- [ ] Endpoint: `POST /api/payment_order/:uuid`
- [ ] Implementar ruteo inteligente de proveedores
- [ ] Simular request al proveedor (mock)
- [ ] Guardar métricas de la transacción

---

## 5️⃣ Testing [🔄]

- [x] Setup de Jest (configurado en package.json y jest.config.ts)
- [ ] Implementar tests unitarios
- [ ] Implementar tests de integración
- [ ] Documentar cómo correr los tests

---

## 6️⃣ Frontend [⬜]

- [ ] Crear página de orden de pago
- [ ] Renderizar datos desde servidor
- [ ] Diseñar UI (Tailwind opcional)
- [ ] Agregar formulario de pago
- [ ] Implementar transiciones y creatividad

---

## 7️⃣ Extras / Bonus [⬜]

- [ ] Pensamiento escalable para agregar más métodos de pago
- [ ] Almacenar métricas de requests (éxito, duración, proveedor usado)

---

## 8️⃣ Finalización y documentación [🔄]

- [x] Completar README:
  - [x] Setup (documentado con Docker)
  - [ ] Tests
  - [x] Explicación de arquitectura (diagramas C4 incluidos)
  - [ ] Scope implementado
- [x] Verificar que el proyecto se levanta con `docker-compose up`
- [ ] Pruebas finales de la aplicación

---

## 9️⃣ Entrega [⬜]

- [ ] Subir código a GitHub
- [ ] Verificar que el repositorio contiene toda la documentación y código necesario

---
