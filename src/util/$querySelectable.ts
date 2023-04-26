export abstract class $QuerySelectable {
	constructor(public readonly el: HTMLElement) {}

	abstract parse(el: HTMLElement):any;

	/** Shorthand for `this.el.querySelector(selector)` */
	$<E extends HTMLElement = HTMLElement>(selector: string): E | null {
		return this.el.querySelector<E>(selector);
	}
	/** Shorthand for `[...this.el.querySelectorAll(selector)]` */
	$$<E extends HTMLElement = HTMLElement>(selector: string): E[] {
		return [...this.el.querySelectorAll<E>(selector)];
	}
}