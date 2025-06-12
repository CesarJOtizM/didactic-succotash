# Challenge - Orquestación de Pagos

## 📋 Evaluación Técnica – Rol: Full Stack ( MID | Senior ) Developer

Gracias por tu interés. Este desafío está diseñado para evaluar habilidades clave en arquitectura, diseño, testing y autonomía técnica.

### 🎯 Objetivo General

Construir un sistema de orquestación de pagos sencillo, con:

- Arquitectura hexagonal
- Tests automatizados
- Frontend desacoplado (reemplazable sin tocar la lógica de negocio)

### 🧠 ¿Qué vamos a evaluar?

- Arquitectura limpia y desacoplada (hexagonal)
- Testing efectivo (unitario e integración)
- Calidad y claridad del código
- Autonomía en decisiones técnicas
- Estructura del proyecto y documentación
- Frontend desacoplado

### 📎 Entregables esperados

1. Repositorio GitHub
2. README con:
   - Setup (`docker-compose up`)
   - Cómo correr los tests
   - Explicación de arquitectura
   - Qué implementaste y qué no (scope)
3. Tests automatizados
4. Separación de capas (arquitectura hexagonal)
5. Frontend con Astro o NextJs

### ⏰ Tiempo estimado

- Hasta 10 días desde la fecha de asignación.

### 🏁 Bonus (no obligatorio)

- Pensamiento escalable (agregar métodos de pago fácilmente)
- Almacenar todos los requests a proveedores (éxito, duración, métricas)

### 📌 Notas sobre uso de IA

- Se permite usar herramientas de IA como apoyo.
- Se valorará el uso efectivo y con criterio profesional.

### 💻 Tecnologías a usar

- **DBs:** PostgreSQL, MySQL, OracleDB, SQLite
- **Frontend:** Astro con React o Preact
- **Backend:** Astro o NextJS
- **Tests:** Jest (obligatorio)
- **Opcional:** TailwindCSS
- **Infra:** Docker (obligatorio)

### Aplicaciones y Proveedores involucrados

#### Respuesta Mock para proveedores

```json
{
	"status": "success",
	"transaction_id": "12345678-1234-5678-1234-567812345678"
}
```

o siempre retornar error (simulado/mockeado).

## **Endpoints y Pages**

### **1️⃣ Crear orden de pago**

- **Endpoint:** `POST /api/payment_order/:uuid
- **Request body:**

```json
{
	"amount": 70000,
	"description": "Pago de prueba",
	"country\_iso\_code": "CL"
}
```

- **Response ejemplo:**

```json
{
	"uuid": "f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
	"type": "payment\_order",
	"attributes": {
		"amount": 70000,
		"description": "Pago de prueba",
		"country\_iso\_code": "CL",
		"created\_at": "2025-05-27T14:36:22.123Z",
		"payment\_url": "http\://127.0.0.1:4321/api/payment\_order/uuid"
	}
}
```

### **2️⃣ Ver orden de pago**

- **Endpoint:** `GET /payment_order/:uuid

### **3️⃣ Listar métodos de pago asociados al país**

- **Endpoint:** `GET /payment_order/:uuid

### **4️⃣ Procesar orden de pago**

- **Endpoint:** `POST /api/payment_order/:uuid
- Requerimiento adicional: El backend debe implementar un "ruteo inteligente", que ante el fallo de un método de pago, seleccione automáticamente otro proveedor disponible para asegurar el éxito de la transacción.
- Bonus: guardar métricas de las transacciones y requests.
- **Response ejemplo**
- Success:

```json
{
	"status": "success",
	"transaction_id": "12345678-1234-5678-1234-567812345678"
}
```

- Error:

```json
{
	"status": "Error",
	"transaction_id": "12345678-1234-5678-1234-567812345678"
}
```

## **Estructura del Frontend**

- Uso obligatorio de React o Preact.
- Los datos deben ser renderizados desde el servidor.
- Diseño libre, se valorará creatividad (transiciones, recursos visuales).

## **Agradecimientos**

Gracias por tomarte el tiempo de realizar esta prueba técnica. Valoramos profundamente tu dedicación, calidad del código y capacidad de resolver problemas.
