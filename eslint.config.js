import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{
		ignores: ['dist/**', 'node_modules/**', 'coverage/**', '.tmp/**', '*.tgz'],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		rules: {
			'@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
			'no-undef': 'off',
			'no-console': 'error',
		},
	},
	{
		files: ['scripts/**/*.mjs'],
		rules: {
			'@typescript-eslint/no-require-imports': 'off',
		},
	}
);
