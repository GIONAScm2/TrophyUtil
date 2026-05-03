import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const smokeDir = resolve(root, '.tmp/package-smoke');
const npmCli = process.env.npm_execpath;
const tscPath = resolve(root, 'node_modules/typescript/bin/tsc');

if (!npmCli) {
	throw new Error('Unable to locate npm CLI from npm_execpath');
}

rmSync(smokeDir, { recursive: true, force: true });
mkdirSync(smokeDir, { recursive: true });

const packOutput = execFileSync(
	process.execPath,
	[npmCli, 'pack', '--ignore-scripts', '--json', '--pack-destination', smokeDir, '--cache', '.npm-cache'],
	{ cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }
);
const [{ filename }] = JSON.parse(packOutput);
const tarball = resolve(smokeDir, filename);

writeFileSync(
	resolve(smokeDir, 'package.json'),
	JSON.stringify({ type: 'module', private: true, dependencies: { trophyutil: `file:${tarball}` } }, null, 2)
);
writeFileSync(
	resolve(smokeDir, 'index.ts'),
	[
		"import {GameListingParser, getPsnpPageType} from 'trophyutil';",
		"import type {GameListing, ParseResult} from 'trophyutil';",
		"import {GameListingParser as SubpathParser} from 'trophyutil/parsers';",
		"import type {GameListing as SubpathGameListing} from 'trophyutil/models';",
		"import {parseNumber} from 'trophyutil/util';",
		"import type {GameDocument} from 'trophyutil/adapters';",
		'',
		'const parser = new GameListingParser();',
		'const subpathParser = new SubpathParser();',
		"const pageType = getPsnpPageType(new URL('https://psnprofiles.com/games'));",
		'const parsedNumber = parseNumber("1,234");',
		'void parser;',
		'void subpathParser;',
		'void pageType;',
		'void parsedNumber;',
		'const typedGame = null as unknown as GameListing;',
		'const subpathGame = null as unknown as SubpathGameListing;',
		'const result = null as unknown as ParseResult<GameListing>;',
		'const documentShape = null as unknown as GameDocument;',
		'void typedGame;',
		'void subpathGame;',
		'void result;',
		'void documentShape;',
	].join('\n')
);
writeFileSync(
	resolve(smokeDir, 'tsconfig.json'),
	JSON.stringify(
		{
			compilerOptions: {
				target: 'ES2022',
				module: 'NodeNext',
				moduleResolution: 'NodeNext',
				strict: true,
				noEmit: true,
				skipLibCheck: true,
			},
			include: ['index.ts'],
		},
		null,
		2
	)
);

execFileSync(
	process.execPath,
	[npmCli, 'install', '--ignore-scripts', '--no-audit', '--no-fund', '--cache', resolve(root, '.npm-cache')],
	{
		cwd: smokeDir,
		stdio: 'inherit',
	}
);
execFileSync(process.execPath, [tscPath, '-p', 'tsconfig.json'], {
	cwd: smokeDir,
	stdio: 'inherit',
});
execFileSync(
	process.execPath,
	['--input-type=module', '-e', "await import('trophyutil'); await import('trophyutil/parsers');"],
	{
		cwd: smokeDir,
		stdio: 'inherit',
	}
);
