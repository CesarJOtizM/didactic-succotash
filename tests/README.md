# Suite de Tests - Sistema de Pagos

Esta documentación describe la suite completa de tests implementada para el sistema de pagos, incluyendo tests unitarios, de integración y configuración de cobertura.

## 📁 Estructura de Tests

```
tests/
├── helpers/
│   └── testHelpers.ts          # Helpers y mocks reutilizables
├── integration/
│   └── payment-flow.integration.test.ts  # Tests de flujos completos
└── unit/
    ├── application/
    │   ├── dtos/
    │   │   └── paymentOrderDto.test.ts    # Tests de DTOs y mappers
    │   └── use-cases/
    │       ├── createPaymentOrder.test.ts
    │       ├── processPaymentOrder.test.ts
    │       ├── getAllPaymentOrders.test.ts
    │       └── getPaymentOrderByUuid.test.ts
    └── domain/
        └── entities/
            ├── paymentMethod.test.ts
            └── paymentOrder.test.ts
```

## 🎯 Cobertura de Tests

### Objetivos de Cobertura

- **Global**: 80% mínimo en branches, functions, lines y statements
- **Entidades de Dominio**: 90% mínimo (crítico para la lógica de negocio)
- **Casos de Uso**: 85% mínimo (funcionalidad principal)

### Exclusiones de Cobertura

- Rutas de Next.js (`src/app/`)
- Componentes UI genéricos (`src/components/ui/`)
- Archivos de estilos (`src/styles/`)
- Ejemplos (`src/lib/examples/`)

## 🧪 Tipos de Tests

### 1. Tests Unitarios

#### Entidades del Dominio

- **PaymentMethod**: Validación de factory, disponibilidad por monto, cálculo de fees
- **PaymentOrder**: Validación de helpers, estructura de datos

#### Casos de Uso

- **createPaymentOrder**: Creación exitosa, validaciones, manejo de errores
- **processPaymentOrder**: Procesamiento exitoso/fallido, múltiples intentos, validaciones
- **getAllPaymentOrders**: Obtención de listas, mapeo de DTOs
- **getPaymentOrderByUuid**: Búsqueda por ID, validaciones con Zod

#### DTOs y Mappers

- **PaymentOrderDto**: Mapeo bidireccional, manejo de campos opcionales
- Validación de estructura de respuestas
- Edge cases y caracteres especiales

### 2. Tests de Integración

#### Flujos Completos

- **Crear → Procesar → Listar**: Flujo exitoso end-to-end
- **Crear → Fallar → Reintento**: Manejo de fallos y reintentos
- **Múltiples Intentos**: Incremento correcto de contadores
- **Sin Métodos de Pago**: Manejo de casos límite
- **Resilencia**: Manejo de errores de infraestructura

## 🛠️ Comandos de Test

### Ejecución Básica

```bash
# Ejecutar todos los tests
npm run test

# Ejecutar en modo watch
npm run test:watch

# Tests silenciosos
npm run test:silent
```

### Tests por Tipo

```bash
# Solo tests unitarios
npm run test:unit

# Solo tests de integración
npm run test:integration
```

### Cobertura

```bash
# Reporte de cobertura completo
npm run test:coverage

# Cobertura solo unitarios
npm run test:coverage:unit

# Cobertura con umbral mínimo
npm run test:coverage:threshold

# Para CI/CD
npm run test:ci
```

## 📊 Configuración de Jest

### Configuración Principal (`jest.config.ts`)

- **Environment**: jsdom para compatibilidad con Next.js
- **Coverage Provider**: v8 para mejor performance
- **Module Mapping**: Soporte para paths absolutos (`src/`)
- **Workers**: 50% para tests paralelos
- **Timeout**: 10s para tests async
- **Auto Mocks**: Limpieza automática entre tests

### Setup Global (`jest.setup.ts`)

- Configuración de testing-library
- Mocks globales si necesarios
- Variables de entorno de test

## 🔧 Helpers de Test

### `testHelpers.ts`

Proporciona utilidades reutilizables:

```typescript
// Factories para datos mock
createMockPaymentOrder(overrides?)
createMockPaymentMethod(overrides?)
createMockRepository()

// Constantes de test
TEST_CONSTANTS.VALID_UUID
TEST_CONSTANTS.BASE_URL
TEST_CONSTANTS.VALID_COUNTRY_CODES

// Utilidades
expectValidPaymentOrderResponseDto(dto)
setupConsoleMocks()
clearAllMocks()
```

## 🏗️ Patrones de Test

### Estructura AAA (Arrange-Act-Assert)

```typescript
it('debería hacer algo específico', async () => {
	// Arrange: Configurar datos y mocks
	const input = createMockPaymentOrder();
	mockRepository.save.mockResolvedValue(input);

	// Act: Ejecutar la funcionalidad
	const result = await useCase(input);

	// Assert: Verificar resultados
	expect(result.success).toBe(true);
	expect(mockRepository.save).toHaveBeenCalledWith(input);
});
```

### Manejo de Errores

```typescript
// Tests de casos exitosos Y fallidos
it('debería manejar errores del repositorio', async () => {
	mockRepository.save.mockRejectedValue(new Error('DB Error'));

	const result = await useCase(input);

	expect(result.success).toBe(false);
	expect(result.error).toBe('DB Error');
});
```

### Mocking Estratégico

- **Externa dependencies**: Jest mocks para servicios externos
- **Repository patterns**: Jest.Mocked para interfaces
- **UUID generation**: Mock determinístico para tests predecibles

## ✅ Buenas Prácticas Implementadas

### 1. **Tests Descriptivos**

- Nombres claros que explican el comportamiento esperado
- Uso de español para mejor comprensión del equipo
- Estructura consistente en describe/it

### 2. **Isolation**

- Cada test es independiente
- Cleanup automático de mocks entre tests
- Sin dependencias entre tests

### 3. **Coverage Meaningful**

- Tests que verifican comportamiento, no solo cobertura
- Edge cases y escenarios de error
- Validación de contratos entre capas

### 4. **Maintainability**

- Helpers reutilizables para reducir duplicación
- Factory patterns para datos de test
- Configuración centralizada

### 5. **Performance**

- Tests paralelos donde es seguro
- Mocks eficientes sin I/O real
- Timeouts apropiados para tests async

## 🚀 Ejecución en CI/CD

### Pipeline Recomendado

```yaml
# .github/workflows/test.yml
- name: Run tests
  run: npm run test:ci

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/lcov.info
```

### Artifacts

- **Coverage Reports**: HTML y LCOV generados en `/coverage`
- **Test Results**: JSON summary para análisis
- **Performance Metrics**: Timing de tests para optimización

## 📝 Métricas de Calidad

### Indicadores Clave

- **Cobertura de Código**: >80% global, >90% dominio
- **Test Speed**: <30s para suite completa
- **Flakiness**: 0% tests inestables
- **Maintainability**: Helpers reutilizables, low duplication

### Monitoreo Continuo

- Reports de cobertura en cada PR
- Trending de performance de tests
- Alerts por cobertura por debajo del umbral

---

## 📞 Soporte

Para dudas sobre los tests o agregar nuevos casos:

1. Revisar los ejemplos existentes en cada categoría
2. Usar los helpers disponibles para consistencia
3. Seguir los patrones AAA establecidos
4. Mantener la cobertura por encima de los umbrales
