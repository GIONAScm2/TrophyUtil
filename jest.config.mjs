
/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	roots: ['<rootDir>/test'],
	testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
	transform: {
		'^.+\\.(mt|t|cj|j)s$': [
			'ts-jest',
			{
				useESM: true,
			},
		],
	},
	extensionsToTreatAsEsm: ['.ts'],
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
	},
	setupFilesAfterEnv: ["<rootDir>/jest.setup.mjs"],
};

export default config;
