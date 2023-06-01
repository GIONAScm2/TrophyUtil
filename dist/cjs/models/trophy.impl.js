"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PsnpTrophy = void 0;
class PsnpTrophy {
    id;
    name;
    desc;
    grade;
    rarity;
    _nameSerialized;
    _imagePath;
    dateEarned;
    constructor(trophy) {
        this.id = trophy.id;
        this.name = trophy.name;
        this.desc = trophy.desc;
        this.grade = trophy.grade;
        this.rarity = trophy.rarity;
        this._nameSerialized = trophy._nameSerialized;
        this._imagePath = trophy._imagePath;
    }
    /** (Getter) Constructs and returns trophy list URL fragment (e.g. `50-abstergo-employee-of-the-month`). */
    get urlPath() {
        return `${this.id}-${this._nameSerialized}`;
    }
    /** (Getter) Constructs and returns trophy icon URL fragment (e.g. `trophies/33S08e7cc.png`). */
    get src() {
        return `trophies/${this._imagePath}.png`;
    }
    /** Trophy rarity formatted with two decimal places. */
    get rarityString() {
        return this.rarity.toFixed(2);
    }
    /** Parses a trophy element's 'date earned' into a date timestamp (ms). */
    static timestampFromDateEarned(element) {
        const dateAndTimeNodes = [
            ...element.querySelectorAll(`td:nth-of-type(3) :is(.typo-top-date, .typo-bottom-date) > nobr`),
        ];
        const [dateEl, timeEl] = dateAndTimeNodes;
        const dateText = dateEl.textContent?.replace(/(\d+)(st|nd|rd|th)/, '$1') || '';
        const timeText = timeEl.textContent || '';
        const dateString = `${dateText.trim()} ${timeText.trim()}`;
        return new Date(dateString).valueOf();
    }
}
exports.PsnpTrophy = PsnpTrophy;
//# sourceMappingURL=trophy.impl.js.map