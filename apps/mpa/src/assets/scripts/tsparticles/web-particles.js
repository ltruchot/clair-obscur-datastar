class Particles extends HTMLElement {
    get url() {
        return this._url;
    }
    set url(value) {
        var _a, _b;
        this._url = value;
        (_a = this.container.current) === null || _a === void 0 ? void 0 : _a.destroy();
        window.tsParticles
            .setJSON(this.id, this, (_b = this._url) !== null && _b !== void 0 ? _b : undefined)
            .then(container => this.notifyParticlesLoaded(container));
    }
    get options() {
        return this._options;
    }
    set options(value) {
        var _a;
        this._options = value;
        (_a = this.container.current) === null || _a === void 0 ? void 0 : _a.destroy();
        window.tsParticles.set(this.id, this, this._options).then(container => this.notifyParticlesLoaded(container));
    }
    constructor() {
        super();
        this.container = {};
        const options = this.getAttribute("options");
        if (options) {
            try {
                this._options = JSON.parse(options);
            }
            catch (_a) { }
        }
        this._url = this.getAttribute("url");
        this.dispatchEvent(new CustomEvent("particlesInit", {
            detail: window.tsParticles,
        }));
    }
    async connectedCallback() {
        if (!this.isConnected) {
            return;
        }
        if (window.tsParticlesReady) {
            await window.tsParticlesReady;
        }
        if (this._url) {
            window.tsParticles
                .setJSON(this.id, this, this._url)
                .then(container => this.notifyParticlesLoaded(container));
        }
        else if (this._options) {
            window.tsParticles
                .set(this.id, this, this._options)
                .then(container => this.notifyParticlesLoaded(container));
        }
    }
    notifyParticlesLoaded(container) {
        this.container.current = container;
        this.dispatchEvent(new CustomEvent("particlesLoaded", {
            detail: container,
        }));
    }
}
customElements.define("web-particles", Particles);

export { Particles };
//# sourceMappingURL=web-particles.js.map
