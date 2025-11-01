function o() {
  const a = navigator.maxTouchPoints > 0, e = window.matchMedia("(pointer: coarse)").matches, t = window.matchMedia("(hover: none)").matches;
  return a && e && t;
}
class c extends HTMLElement {
  _shadowRoot;
  _pixels = {
    pixelGrid: {}
  };
  _container = null;
  _cellMap = /* @__PURE__ */ new Map();
  _lastDimensions = null;
  _victory = !1;
  _isTouchDevice = !1;
  _pointerStartX = 0;
  _pointerStartY = 0;
  _hasMoved = !1;
  getNextGuess(e) {
    const t = [-1, 1, 0], i = (t.indexOf(e) + 1) % 3;
    return t[i];
  }
  static get observedAttributes() {
    return ["pixels", "last-change", "victory"];
  }
  constructor() {
    super(), this._shadowRoot = this.attachShadow({ mode: "open" }), this._isTouchDevice = o();
  }
  attributeChangedCallback(e, t, s) {
    if (e === "pixels")
      this.pixels = JSON.parse(s ?? '{"pixelGrid":{}}');
    else if (e === "last-change" && s) {
      const i = JSON.parse(s);
      this._applyPixelChange(i);
    } else e === "victory" && (this._victory = s === "true", this._updateVictoryState());
  }
  connectedCallback() {
    this.render();
  }
  get shadowRoot() {
    return this._shadowRoot;
  }
  get pixels() {
    return this._pixels;
  }
  set pixels(e) {
    this._pixels = e, this.render();
  }
  render() {
    if (Object.keys(this._pixels.pixelGrid).length === 0) {
      this._shadowRoot.replaceChildren(), this._container = null, this._cellMap.clear(), this._lastDimensions = null;
      return;
    }
    const { maxX: t, maxY: s } = this._getGridDimensions(), i = t + 1 + 3, l = s + 1 + 1;
    (!this._lastDimensions || this._lastDimensions.columns !== i || this._lastDimensions.rows !== l) && (this._lastDimensions = { columns: i, rows: l }, this._initializeGrid(i, l)), this._updateCells();
  }
  _getGridDimensions() {
    let e = 0, t = 0;
    for (const s of Object.keys(this._pixels.pixelGrid)) {
      const i = s.split("-"), l = Number(i[0]), n = Number(i[1]);
      l > e && (e = l), n > t && (t = n);
    }
    return { maxX: e, maxY: t };
  }
  _initializeGrid(e, t) {
    const s = this._createStyle(e, t);
    this._container = document.createElement("div"), this._container.className = "pixel-grid", this._cellMap.clear();
    const i = document.createDocumentFragment();
    for (let l = 0; l < t; l++)
      for (let n = 0; n < e; n++) {
        const r = this._createCell(n, l);
        this._cellMap.set(`${n}-${l}`, r), i.appendChild(r);
      }
    this._container.appendChild(i), this._attachEventListeners(), this._updateVictoryState(), this._shadowRoot.replaceChildren(s, this._container);
  }
  _createStyle(e, t) {
    const s = document.createElement("style");
    return s.textContent = `
      .pixel-grid {
        display: grid;
        grid-template-columns: repeat(${e}, 25px);
        grid-template-rows: repeat(${t}, 25px);
        gap: 0;
        touch-action: manipulation;
      }
      .pixel-cell {
        color: black;
        width: 25px;
        height: 25px;
        border: 1px solid lightgray;
        box-sizing: border-box;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Courier New', 'Courier', monospace;
        font-size: 18px;
        font-weight: bold;
        touch-action: manipulation;
      }
      .pixel-cell:not(.cell-transparent) {
        border-color: #888;
      }
      .pixel-cell:not(.cell-transparent):hover {
        border-color: #aaa;
      }
      .pixel-cell.cell-transparent {
        cursor: default;
        background-color: #2facc2;
      }
      .pixel-cell.cell-unguessed {
        background-color: #d4c5b9;
      }
      .pixel-cell.cell-obscur {
        background-color: black;
        color: white;
      }
      .pixel-cell.cell-clair {
        background-color: white;
        color: black;
      }
      .pixel-grid.victory .pixel-cell {
        will-change: border-color, border-width, color;
        transform: translateZ(0);
        transition: border-color 2s cubic-bezier(0.4, 0.0, 0.2, 1), border-width 2s cubic-bezier(0.4, 0.0, 0.2, 1), color 2s cubic-bezier(0.4, 0.0, 0.2, 1);
        border-color: transparent;
        border-width: 0;
        color: transparent;
        pointer-events: none;
        cursor: default;
      }
      .pixel-cell.flash {
        animation: clickFlash 150ms ease-out;
      }
      @keyframes clickFlash {
        0% {
          box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.8);
        }
        100% {
          box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0);
        }
      }
    `, s;
  }
  _createCell(e, t) {
    const s = document.createElement("div");
    return s.className = "pixel-cell", s.dataset.x = e.toString(), s.dataset.y = t.toString(), s;
  }
  _updateCells() {
    this._cellMap.forEach((e, t) => {
      this._updateSingleCell(e, t);
    });
  }
  _updateSingleCell(e, t) {
    const s = this._pixels.pixelGrid[t];
    if (!s) {
      e.className = "pixel-cell cell-transparent", e.textContent = "";
      return;
    }
    e.textContent = s.n.toString(), s.guess === -1 ? e.className = "pixel-cell cell-unguessed" : s.guess === 0 ? e.className = "pixel-cell cell-obscur" : e.className = "pixel-cell cell-clair";
  }
  _applyPixelChange(e) {
    const t = `${e.x}-${e.y}`, s = this._pixels.pixelGrid[t];
    if (!s) return;
    s.guess = e.guess;
    const i = this._cellMap.get(t);
    i && this._updateSingleCell(i, t);
  }
  _updateVictoryState() {
    this._container && (this._victory ? this._container.classList.add("victory") : this._container.classList.remove("victory"));
  }
  _attachEventListeners() {
    this._container && (this._isTouchDevice ? this._attachTouchListeners() : this._attachDesktopListeners());
  }
  _attachDesktopListeners() {
    this._container && this._container.addEventListener("click", (e) => {
      e.preventDefault();
      const t = e.target;
      if (t.classList.contains("pixel-cell") && !t.classList.contains("cell-transparent")) {
        const s = Number.parseInt(t.dataset.x ?? "0", 10), i = Number.parseInt(t.dataset.y ?? "0", 10), l = `${s}-${i}`, n = this._pixels.pixelGrid[l];
        if (!n) return;
        const r = this.getNextGuess(n.guess);
        if (n.guess === r) return;
        t.classList.add("flash"), setTimeout(() => t.classList.remove("flash"), 150), this.dispatchEvent(
          new CustomEvent("pixelclick", {
            detail: { x: s, y: i, guess: r },
            composed: !0,
            bubbles: !0
          })
        );
      }
    });
  }
  _attachTouchListeners() {
    this._container && (this._container.addEventListener("pointerdown", (e) => {
      const t = e.target;
      t.classList.contains("pixel-cell") && !t.classList.contains("cell-transparent") && (this._pointerStartX = e.clientX, this._pointerStartY = e.clientY, this._hasMoved = !1);
    }), this._container.addEventListener("pointermove", (e) => {
      const s = Math.abs(e.clientX - this._pointerStartX), i = Math.abs(e.clientY - this._pointerStartY);
      (s > 10 || i > 10) && (this._hasMoved = !0);
    }), this._container.addEventListener("pointerup", (e) => {
      if (this._hasMoved) {
        this._hasMoved = !1;
        return;
      }
      const t = e.target;
      if (t.classList.contains("pixel-cell") && !t.classList.contains("cell-transparent")) {
        const s = Number.parseInt(t.dataset.x ?? "0", 10), i = Number.parseInt(t.dataset.y ?? "0", 10), l = `${s}-${i}`, n = this._pixels.pixelGrid[l];
        if (n) {
          const r = this.getNextGuess(n.guess);
          n.guess !== r && (t.classList.add("flash"), setTimeout(() => t.classList.remove("flash"), 150), this.dispatchEvent(
            new CustomEvent("pixelclick", {
              detail: { x: s, y: i, guess: r },
              composed: !0,
              bubbles: !0
            })
          ));
        }
      }
      this._hasMoved = !1;
    }), this._container.addEventListener("pointercancel", () => {
      this._hasMoved = !1;
    }));
  }
}
function h() {
  customElements.get("pixel-grid") || customElements.define("pixel-grid", c);
}
h();
export {
  c as PixelGridElement,
  h as registerPixelGridElement
};
