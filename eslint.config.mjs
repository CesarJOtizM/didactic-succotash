import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import checkFilePlugin from 'eslint-plugin-check-file';
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname
});

const eslintConfig = [
	...compat.extends('next/core-web-vitals', 'next/typescript'),
	js.configs.recommended,
	prettierConfig,
	{
		plugins: {
			'check-file': checkFilePlugin,
			react: reactPlugin,
			'@typescript-eslint': tseslint,
			import: importPlugin
		},
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: 2020,
				sourceType: 'module',
				ecmaFeatures: {
					jsx: true
				}
			}
		},
		settings: {
			react: {
				version: 'detect'
			}
		},
		rules: {
			...reactPlugin.configs.recommended.rules,
			...tseslint.configs.recommended.rules,
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_'
				}
			],
			'import/order': [
				'error',
				{
					groups: [
						['builtin'],
						['external'],
						['internal'],
						['parent', 'sibling', 'index'],
						['object', 'type']
					],
					pathGroups: [
						{
							pattern: 'react',
							group: 'builtin',
							position: 'before'
						},
						{
							pattern: 'next',
							group: 'builtin',
							position: 'after'
						},
						{
							pattern: 'next/*',
							group: 'builtin',
							position: 'after'
						},
						{
							pattern: 'next/**/*',
							group: 'builtin',
							position: 'after'
						},
						{
							pattern: '@components/**',
							group: 'internal',
							position: 'before'
						},
						{
							pattern: 'src/components/**',
							group: 'internal',
							position: 'before'
						},
						{
							pattern: '@lib/**',
							group: 'internal',
							position: 'after'
						},
						{
							pattern: 'src/lib/**',
							group: 'internal',
							position: 'after'
						},
						{
							pattern: '@utils/**',
							group: 'internal',
							position: 'after'
						},
						{
							pattern: 'src/utils/**',
							group: 'internal',
							position: 'after'
						},
						{
							pattern: '**/*.{css,scss}',
							group: 'index',
							position: 'after'
						}
					],
					pathGroupsExcludedImportTypes: ['react', 'next'],
					alphabetize: {
						order: 'asc',
						caseInsensitive: true
					}
				}
			],
			'react/react-in-jsx-scope': 'off',
			'check-file/folder-naming-convention': ['error', { 'src/!(app)/**/*': 'CAMEL_CASE' }],
			'check-file/filename-naming-convention': [
				'error',
				{
					'src/!(app|types)/**/*.{jsx,tsx}': 'PASCAL_CASE',
					'src/!(app|types)/**/*.{js,ts}': 'CAMEL_CASE'
				}
			]
		}
	},
	{
		files: ['src/app/**/*.{js,jsx,ts,tsx}'],
		rules: {
			'import/no-default-export': 'off',
			'no-restricted-syntax': 'off'
		}
	},
	{
		files: ['**/*.test.{js,jsx,ts,tsx}', '**/*.spec.{js,jsx,ts,tsx}', 'tests/**/*.{js,jsx,ts,tsx}'],
		languageOptions: {
			parser: tsParser,
			globals: {
				describe: 'readonly',
				it: 'readonly',
				test: 'readonly',
				expect: 'readonly',
				beforeEach: 'readonly',
				afterEach: 'readonly',
				beforeAll: 'readonly',
				afterAll: 'readonly',
				jest: 'readonly'
			}
		},
		rules: {
			'@typescript-eslint/no-explicit-any': 'warn', // Relajar en tests
			'import/order': 'off' // Relajar orden de imports en tests
		}
	},
	{
		ignores: [
			'node_modules',
			'dist',
			'build',
			'public',
			'out',
			'.next',
			'test',
			'**/prisma/generated/**'
			// '**/*.test.{js,jsx,ts,tsx}'
		]
	}
];

export default eslintConfig;
