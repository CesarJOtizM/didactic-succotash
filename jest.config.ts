import nextJest from 'next/jest.js';
import type { Config } from 'jest';

const createJestConfig = nextJest({
	// Provide the path to your Next.js app to load next.config.js and .env files in your test environment
	dir: './'
});

// Add any custom config to be passed to Jest
const config: Config = {
	coverageProvider: 'v8',
	testEnvironment: 'jsdom',
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
	moduleNameMapper: {
		'^src/(.*)$': '<rootDir>/src/$1'
	},
	// Configuración de cobertura
	collectCoverageFrom: [
		'src/domain/**/*.{js,jsx,ts,tsx}',
		'src/application/**/*.{js,jsx,ts,tsx}',
		'!src/**/*.d.ts',
		'!src/**/*.stories.{js,jsx,ts,tsx}',
		'!src/application/ports/**', // Interfaces no necesitan coverage
		'!**/index.ts', // Archivos de re-export
		'!**/node_modules/**'
	],
	coveragePathIgnorePatterns: [
		'/node_modules/',
		'/.next/',
		'/coverage/',
		'/dist/',
		'/build/',
		'/src/prisma/',
		'\\.stories\\.(js|jsx|ts|tsx)$',
		'edge-esm\\.js'
	],
	coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
	coverageThreshold: {
		global: {
			branches: 80,
			functions: 68,
			lines: 80,
			statements: 80
		},
		// Umbrales específicos por directorio
		'src/domain/entities/': {
			branches: 100,
			functions: 100,
			lines: 100,
			statements: 100
		}
	},
	// Configuración de tests paralelos
	maxWorkers: '50%',
	// Timeout para tests async
	testTimeout: 10000,
	// Verbose output para mejor debugging
	verbose: false,
	// Clear mocks automáticamente entre tests
	clearMocks: true,
	restoreMocks: true
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
