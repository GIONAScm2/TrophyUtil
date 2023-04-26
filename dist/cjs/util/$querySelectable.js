"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$QuerySelectable = void 0;
class $QuerySelectable {
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
exports.$QuerySelectable = $QuerySelectable;
//# sourceMappingURL=$querySelectable.js.map