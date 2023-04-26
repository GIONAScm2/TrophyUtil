export declare abstract class $QuerySelectable {
    readonly el: HTMLElement;
    constructor(el: HTMLElement);
    abstract parse(el: HTMLElement): any;
    /** Shorthand for `this.el.querySelector(selector)` */
    $<E extends HTMLElement = HTMLElement>(selector: string): E | null;
    /** Shorthand for `[...this.el.querySelectorAll(selector)]` */
    $$<E extends HTMLElement = HTMLElement>(selector: string): E[];
}
//# sourceMappingURL=$querySelectable.d.ts.map