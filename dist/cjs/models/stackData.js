"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StackAssociation = void 0;
var SaveTransferPotency;
(function (SaveTransferPotency) {
    SaveTransferPotency["Low"] = "Low";
    SaveTransferPotency["Med"] = "Med";
    SaveTransferPotency["High"] = "High";
    SaveTransferPotency["Potential"] = "Potent(ial)";
    SaveTransferPotency["Unknown"] = "?";
})(SaveTransferPotency || (SaveTransferPotency = {}));
/** Represents a group of stacking games. */
class StackAssociation {
    stacks;
    // get hasSameNumTrophies() {}
    // get hasSamePlatCount() {}
    constructor(stacks) {
        this.stacks = this.labelStacks(stacks);
    }
    static buildPlatformTag(platforms) {
        if (platforms.includes('VR')) {
            if (platforms.includes('PS4'))
                return 'PSVR';
            else if (platforms.includes('PS5'))
                return 'PSVR2';
        }
        return platforms.join('/');
    }
    /**
     * Given an assumedly comprehensive* array of game stacks, mutates it by adding a `stack` property
     * to each that distinguishes them from each other.
     *
     * *Stacks should be validated beforehand so that 'Additional Trophies' DLCs are not interpreted as stacks.
     * */
    labelStacks(_stacks) {
        const stacks = this.buildDetailedStacks(_stacks);
        const separator = '_';
        // Case 1: No stack labels since only 0-1 stacks passed.
        if (stacks.length <= 1) {
            return stacks.map(s => ({ ...s, stack: s.stackLabels.join(separator) }));
        }
        const gamesByStackLabel = this.mapGamesToStackLabel(stacks);
        const numStackLabels = Object.keys(gamesByStackLabel).length;
        // Case 2: Label stacks exclusively by `stackLabel` since number of games == number of stack labels.
        if (numStackLabels === stacks.length) {
            for (const stack of stacks) {
                let label = stack.stackLabel ?? '';
                if (!label && !gamesByStackLabel['NA']) {
                    if (gamesByStackLabel['EU'])
                        label = 'NA';
                    else
                        label = 'WW';
                }
                stack.stackLabels.push(label || 'WW');
            }
            return stacks.map(s => ({ ...s, stack: s.stackLabels.join(separator) }));
        }
        const gamesByPlatform = this.mapGamesToPlatform(stacks);
        const numPlatforms = Object.keys(gamesByPlatform).length;
        // Case 3: Iterate through each platform group to assess its `StackAbbr`s and relabel `stack` accordingly.
        for (const [platform, games] of Object.entries(gamesByPlatform)) {
            // CASE A: Platform only has one game
            if (games.length === 1) {
                const g = games[0];
                g.stackLabels.push(g.platformString);
                if (g.stackLabel)
                    g.stackLabels.push(g.stackLabel);
                continue;
            }
            // CASE B: Multiple stacks for a given platform.
            const someStackAbbrs = games.some(g => g.stackLabel);
            // CASE B1: PSNP hasn't yet labeled any of these stacks, so `stack` will just be their platform.
            if (!someStackAbbrs) {
                games.forEach(s => s.stackLabels.push(platform));
                continue;
            }
            // CASE B2: At least one of these stacks has a `StackAbbr`, so mark any that don't as "WW". `this.stackString` will specify both platform AND StackAbbr.
            for (const g of games) {
                if (numPlatforms > 1)
                    g.stackLabels.push(g.platformString);
                g.stackLabels.push(g.stackLabel ?? 'WW');
            }
        }
        return stacks.map(s => ({ ...s, stack: s.stackLabels.join(separator) }));
    }
    /** Creates and returns a shallow copy of `stacks` containing additional properties useful for stack differentiation. */
    buildDetailedStacks(stacks) {
        const detailedStacks = stacks.map(stack => ({
            ...stack,
            platformString: StackAssociation.buildPlatformTag(stack.platforms),
            stack: '',
            stackLabels: [],
        }));
        return detailedStacks;
    }
    /** Creates and returns a plain object map of `stackLabel` strings (keys) to corresponding games (values).
     *
     * Nullish `stackLabel`s are keyed as an empty string. */
    mapGamesToStackLabel(stacks) {
        const gamesByStackLabel = {};
        stacks.forEach(game => {
            const label = game.stackLabel ?? '';
            if (!gamesByStackLabel[label])
                gamesByStackLabel[label] = [game];
            else
                gamesByStackLabel[label].push(game);
        });
        return gamesByStackLabel;
    }
    /** Creates and returns a plain object map of `platformString` strings (keys) to corresponding games (values). */
    mapGamesToPlatform(stacks) {
        const gamesByPlatform = {};
        stacks.forEach(game => {
            if (!gamesByPlatform[game.platformString])
                gamesByPlatform[game.platformString] = [game];
            else
                gamesByPlatform[game.platformString].push(game);
        });
        return gamesByPlatform;
    }
}
exports.StackAssociation = StackAssociation;
// async function updateStacks({
// 	_settings,
// 	_page,
// 	parsedGames,
// 	lazyCheck,
// 	manual = false,
// }: {
// 	_settings: Settings;
// 	_page: Page;
// 	parsedGames?: Map<number, Game>;
// 	/** If true, no fetch calls should be made - it should only load cached data. */
// 	lazyCheck?: boolean;
// 	/** Whether the function was called manually (i.e. checking a certain game). */
// 	manual?: boolean;
// }) {
// 	// CASE 1: Game already stackified, so do nothing.
// 	if (this.$('.stackify') || parsedGames?.get(this.id)) return;
// 	const stored = _settings.games.get(this.id);
// 	let stackData = _settings.stacks.find(x => x.games.find(g => g.id === this.id));
// 	let numCompleted = 0,
// 		numTotal = 0;
// 	// CASE 2: Lazy check (WIP)
// 	if (stackData && lazyCheck) {
// 		Game.labelStacks(stackData.games);
// 	}
// 	// CASE 3: Fetch latest stack data to update existing data.
// 	else if (stackData) {
// 		if (manual) console.log(`${this.name} last updated ${new Date(stackData.lastUpdated)}`);
// 		const fetchedStacks = await fetchStacks(this.url);
// 		// STEP 1: Replace cached stackList with newly fetched stackList.
// 		stackData.games = [this, ...fetchedStacks];
// 		stackData.lastUpdated = Date.now();
// 		Game.labelStacks(stackData.games);
// 	}
// 	// CASE 4: No stored stack data, so let's create one.
// 	else {
// 		// create stack data
// 		const fetchedStacks = await fetchStacks(this.url);
// 		stackData = {
// 			games: [this, ...fetchedStacks],
// 			lastUpdated: Date.now(),
// 		};
// 		Game.labelStacks(stackData.games);
// 		_settings.stacks.push(stackData);
// 	}
// 	stackData.games.forEach(g => {
// 		parsedGames?.set(g.id, g);
// 		numTotal++;
// 		if (_settings.games.isCompleted(g.id)) numCompleted++;
// 	});
// 	async function fetchStacks(url: string) {
// 		const stacks: Game[] = [];
// 		const gamePage = await fetchDoc(url);
// 		for (const stackNode of new TrophyList(gamePage).stacks) {
// 			const stack = new Game(stackNode);
// 			stacks.push(stack);
// 		}
// 		return stacks;
// 	}
// 	// TODO: Update _settings.games with any new values.
// 	// Building & appending element
// 	if (stackData.games.length === 1 || (_settings.prefs.stackifyHideCompleted.val && numCompleted === numTotal)) {
// 		return;
// 	}
// 	const color = numCompleted === numTotal ? `green` : `red`;
// 	// this.$('td > div.ellipsis > span > a.title + bullet')?.nextSibling?.remove();
// 	const stacksIncomplete = stackData.games.filter(g => !_settings.games.isCompleted(g.id));
// 	const stacksComplete = stackData.games.filter(g => _settings.games.isCompleted(g.id));
// 	this.$(`td:nth-child(2) > div.ellipsis`)?.after(
// 		newElement(
// 			'div',
// 			{class: `stackify`, style: `font-weight:500;`},
// 			newElement(`span`, {}, newElement(`span`, {style: `color:${color};`}, `${numCompleted}/${numTotal}`)),
// 			stacksIncomplete.length ? ` — ` : '',
// 			newElement('span', {style: ``}, stacksIncomplete.map(g => g.stackString).join(' | ')),
// 			stacksComplete.length ? ` — ` : '',
// 			newElement('span', {style: `color:green;`}, stacksComplete.map(g => g.stackString).join(' | '))
// 		)
// 	);
// 	// Clean up title
// 	[...(this.$(`td:nth-child(2) > div.ellipsis > span`)?.childNodes ?? [])]
// 		.filter(el => el.nodeName !== 'A')
// 		.forEach(el => el.remove());
// 	// const title = topRow.ch
// 	/** If running via stackifyAll, append updated game to table. */
// 	if (parsedGames) {
// 		_page.gamesTable?.appendChild(this.el);
// 	}
// 	if (manual) {
// 		await _settings.save();
// 	}
// }
//# sourceMappingURL=stackData.js.map