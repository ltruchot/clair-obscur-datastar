class f extends HTMLElement {
  colors = [
    "#ffffff",
    "#E60000",
    "#FF6B35",
    "#F9A825",
    "#d4c5b9",
    "#7CB342",
    "#00A000",
    "#00bcd4",
    "#2196F3",
    "#F5DEB3",
    "#b794f6",
    "#D500F9"
  ];
  fontFamilies = [
    { name: "t", value: "serif" },
    { name: "s", value: "sans-serif" },
    { name: "m", value: "monospace" },
    { name: "c", value: "cursive" }
  ];
  connectedCallback() {
    this.render(), this.attachEventListeners();
  }
  render() {
    this.innerHTML = `
      <style>
        [popover] {
          border: 1px solid #150a24;
          background-color: #f0f0f0;
          padding: 8px;
          margin: 0;
          opacity: 0;
          transition: opacity 0.15s ease-in-out;
        }
        [popover]:popover-open {
          opacity: 1;
        }
        .font-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 4px;
        }
        .font-cell-to-pick {
          background-color: #f0f0f0;
          color: #150a24;
          width: 32px;
          height: 32px;
          border: 1px solid #ddd;
          border-radius: 2px;
          cursor: pointer;
          padding: 0;
          font-size: 1.5rem;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .font-cell-to-pick:hover {
          border-color: #999;
          background-color: #f0f0f0;
          color: #150a24;
        }
      </style>
      <button type="button" id="font-picker-button">&#119808;</button>
      <div id="font-picker-popover" popover>
        <div class="font-grid">
          ${this.colors.map((t) => `<button type="submit" class="font-cell-to-pick" data-font="color:${t}" style="background-color: ${t}"></button>`).join("")}
          ${this.fontFamilies.map((t) => `<button type="submit" class="font-cell-to-pick" data-font="font-family:${t.value}" style="font-family: ${t.value}">${t.name}</button>`).join("")}
        </div>
      </div>
    `;
  }
  attachEventListeners() {
    const t = this.querySelector("#font-picker-button"), e = this.querySelector(
      "#font-picker-popover"
    ), d = this.querySelectorAll(".font-cell-to-pick");
    t.addEventListener("click", () => {
      e.showPopover();
    }), e.addEventListener("toggle", (l) => {
      l.newState === "open" && requestAnimationFrame(() => {
        const o = t.getBoundingClientRect(), c = e.getBoundingClientRect(), a = window.innerWidth, p = window.innerHeight, n = 4;
        let i = o.bottom + n, r = o.left;
        r + c.width > a && (r = a - c.width - n), i + c.height > p && (i = p - c.height - n), r < 0 && (r = n), i < 0 && (i = n), e.style.position = "absolute", e.style.top = `${i}px`, e.style.left = `${r}px`;
      });
    }), d.forEach((l) => {
      l.addEventListener("click", (s) => {
        s.preventDefault(), s.stopPropagation();
        const o = s.target.dataset.font;
        o && (this.dispatchEvent(new CustomEvent("fontchange", { detail: { value: o }, composed: !0 })), e.hidePopover());
      });
    });
  }
}
function u() {
  customElements.get("font-picker") || customElements.define("font-picker", f);
}
u();
export {
  f as FontPickerElement,
  u as registerFontPickerElement
};
