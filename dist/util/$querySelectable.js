export class $QuerySelectable {
    el;
    constructor(el) {
        this.el = el;
    }
    /** Shorthand for `this.el.querySelector(selector)` */
    $(selector) {
        return this.el.querySelector(selector);
    }
    /** Shorthand for `[...this.el.querySelectorAll(selector)]` */
    $$(selector) {
        return [...this.el.querySelectorAll(selector)];
    }
}
//# sourceMappingURL=$querySelectable.js.map