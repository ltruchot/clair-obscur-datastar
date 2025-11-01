function a() {
  const o = navigator.maxTouchPoints > 0, e = window.matchMedia("(pointer: coarse)").matches, s = window.matchMedia("(hover: none)").matches;
  return o && e && s;
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
  _longPressTimer = null;
  _pointerStartX = 0;
  _pointerStartY = 0;
  _hasMoved = !1;
  static get observedAttributes() {
    return ["pixels", "last-change", "victory"];
  }
  constructor() {
    super(), this._shadowRoot = this.attachShadow({ mode: "open" }), this._isTouchDevice = a();
  }
  attributeChangedCallback(e, s, t) {
    if (e === "pixels")
      this.pixels = JSON.parse(t ?? '{"pixelGrid":{}}');
    else if (e === "last-change" && t) {
      const i = JSON.parse(t);
      this._applyPixelChange(i);
    } else e === "victory" && (this._victory = t === "true", this._updateVictoryState());
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
    const { maxX: s, maxY: t } = this._getGridDimensions(), i = s + 1 + 3, r = t + 1 + 1;
    (!this._lastDimensions || this._lastDimensions.columns !== i || this._lastDimensions.rows !== r) && (this._lastDimensions = { columns: i, rows: r }, this._initializeGrid(i, r)), this._updateCells();
  }
  _getGridDimensions() {
    let e = 0, s = 0;
    for (const t of Object.keys(this._pixels.pixelGrid)) {
      const i = t.split("-"), r = Number(i[0]), l = Number(i[1]);
      r > e && (e = r), l > s && (s = l);
    }
    return { maxX: e, maxY: s };
  }
  _initializeGrid(e, s) {
    const t = this._createStyle(e, s);
    this._container = document.createElement("div"), this._container.className = "pixel-grid", this._cellMap.clear();
    const i = document.createDocumentFragment();
    for (let r = 0; r < s; r++)
      for (let l = 0; l < e; l++) {
        const n = this._createCell(l, r);
        this._cellMap.set(`${l}-${r}`, n), i.appendChild(n);
      }
    this._container.appendChild(i), this._attachEventListeners(), this._updateVictoryState(), this._shadowRoot.replaceChildren(t, this._container);
  }
  _createStyle(e, s) {
    const t = document.createElement("style");
    return t.textContent = `
      .pixel-grid {
        display: grid;
        grid-template-columns: repeat(${e}, 20px);
        grid-template-rows: repeat(${s}, 20px);
        gap: 0;
        touch-action: manipulation;
      }
      .pixel-cell {
        width: 20px;
        height: 20px;
        border: 1px solid lightgray;
        box-sizing: border-box;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: bold;
        touch-action: manipulation;
      }
      .pixel-cell:hover {
        opacity: 0.8;
      }
      .pixel-cell:not(.cell-transparent) {
        border-color: #888;
      }
      .pixel-cell.cell-transparent {
        cursor: default;
        background-color: #2facc2;
      }
      .pixel-cell.cell-unguessed {
        background-color: lightgray;
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
    `, t;
  }
  _createCell(e, s) {
    const t = document.createElement("div");
    return t.className = "pixel-cell", t.dataset.x = e.toString(), t.dataset.y = s.toString(), t;
  }
  _updateCells() {
    this._cellMap.forEach((e, s) => {
      const t = this._pixels.pixelGrid[s];
      e.className = "pixel-cell", t ? (e.textContent = t.n.toString(), t.guess === -1 ? e.classList.add("cell-unguessed") : t.guess === 0 ? e.classList.add("cell-obscur") : t.guess === 1 && e.classList.add("cell-clair")) : (e.classList.add("cell-transparent"), e.textContent = "");
    });
  }
  _applyPixelChange(e) {
    const s = `${e.x}-${e.y}`, t = this._pixels.pixelGrid[s];
    if (!t) return;
    t.guess = e.guess;
    const i = this._cellMap.get(`${e.x}-${e.y}`);
    i && (i.className = "pixel-cell", i.textContent = t.n.toString(), e.guess === -1 ? i.classList.add("cell-unguessed") : e.guess === 0 ? i.classList.add("cell-obscur") : e.guess === 1 && i.classList.add("cell-clair"));
  }
  _updateVictoryState() {
    this._container && (this._victory ? this._container.classList.add("victory") : this._container.classList.remove("victory"));
  }
  _attachEventListeners() {
    this._container && (this._isTouchDevice ? this._attachTouchListeners() : this._attachDesktopListeners());
  }
  _attachDesktopListeners() {
    this._container && (this._container.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      const s = e.target;
      if (s.classList.contains("pixel-cell") && !s.classList.contains("cell-transparent")) {
        const t = Number.parseInt(s.dataset.x ?? "0", 10), i = Number.parseInt(s.dataset.y ?? "0", 10);
        let r = -1;
        e.button === 0 ? r = 1 : e.button === 2 && (r = 0);
        const l = `${t}-${i}`, n = this._pixels.pixelGrid[l];
        if (!n || n.guess === r)
          return;
        this.dispatchEvent(
          new CustomEvent("pixelclick", {
            detail: { x: t, y: i, guess: r },
            composed: !0,
            bubbles: !0
          })
        );
      }
    }), this._container.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    }));
  }
  _attachTouchListeners() {
    this._container && (this._container.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      const s = e.target;
      if (s.classList.contains("pixel-cell") && !s.classList.contains("cell-transparent")) {
        this._pointerStartX = e.clientX, this._pointerStartY = e.clientY, this._hasMoved = !1;
        const t = Number.parseInt(s.dataset.x ?? "0", 10), i = Number.parseInt(s.dataset.y ?? "0", 10), r = `${t}-${i}`;
        this._longPressTimer = setTimeout(() => {
          if (!this._hasMoved) {
            const l = this._pixels.pixelGrid[r];
            l && l.guess !== 0 && this.dispatchEvent(
              new CustomEvent("pixelclick", {
                detail: { x: t, y: i, guess: 0 },
                composed: !0,
                bubbles: !0
              })
            );
          }
          this._longPressTimer = null;
        }, 300);
      }
    }), this._container.addEventListener("pointermove", (e) => {
      if (this._longPressTimer) {
        const t = Math.abs(e.clientX - this._pointerStartX), i = Math.abs(e.clientY - this._pointerStartY);
        (t > 10 || i > 10) && (this._hasMoved = !0, clearTimeout(this._longPressTimer), this._longPressTimer = null);
      }
    }), this._container.addEventListener("pointerup", (e) => {
      if (this._longPressTimer && !this._hasMoved) {
        clearTimeout(this._longPressTimer), this._longPressTimer = null;
        const s = e.target;
        if (s.classList.contains("pixel-cell") && !s.classList.contains("cell-transparent")) {
          const t = Number.parseInt(s.dataset.x ?? "0", 10), i = Number.parseInt(s.dataset.y ?? "0", 10), r = `${t}-${i}`, l = this._pixels.pixelGrid[r];
          l && l.guess !== 1 && this.dispatchEvent(
            new CustomEvent("pixelclick", {
              detail: { x: t, y: i, guess: 1 },
              composed: !0,
              bubbles: !0
            })
          );
        }
      } else this._longPressTimer && (clearTimeout(this._longPressTimer), this._longPressTimer = null);
      this._hasMoved = !1;
    }), this._container.addEventListener("pointercancel", () => {
      this._longPressTimer && (clearTimeout(this._longPressTimer), this._longPressTimer = null), this._hasMoved = !1;
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
