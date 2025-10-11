export class FontPickerElement extends HTMLElement {
  private readonly colors = [
    '#0891B2',
    '#06B6D4',
    '#14B8A6',
    '#10B981',
    '#8B5CF6',
    '#A855F7',
    '#EC4899',
    '#F43F5E',
    '#F97316',
    '#EAB308',
    '#84CC16',
    '#22C55E',
  ];
  private readonly fontFamilies = [
    { name: 't', value: 'serif' },
    { name: 's', value: 'sans-serif' },
    { name: 'm', value: 'monospace' },
    { name: 'c', value: 'cursive' },
  ];

  connectedCallback(): void {
    this.render();
    this.attachEventListeners();
  }

  private render(): void {
    this.innerHTML = `
      <style>
        #font-picker-button {
          background: white;
          border: 1px solid #ddd;
          cursor: pointer;
          font-size: 0.8rem;
          padding: 0 2px;
          border-radius: 4px;
          display: inline-block;
        }
        [popover] {
          border: 1px solid #ccc;
          border-radius: 4px;
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
        }
      </style>
      <div id="font-picker-button">&#119808;</div>
      <div id="font-picker-popover" popover>
        <div class="font-grid">
          ${this.colors.map((color) => `<button type="submit" class="font-cell-to-pick" data-font="color:${color}" style="background-color: ${color}"></button>`).join('')}
          ${this.fontFamilies.map((font) => `<button type="submit" class="font-cell-to-pick" data-font="font-family:${font.value}" style="font-family: ${font.value}">${font.name}</button>`).join('')}
        </div>
      </div>
    `;
  }

  private attachEventListeners(): void {
    const button = this.querySelector<HTMLElement>('#font-picker-button')!;
    const popover = this.querySelector<HTMLElement & { showPopover: () => void; hidePopover: () => void }>('#font-picker-popover')!;
    const swatches = this.querySelectorAll('.font-cell-to-pick');

    button.addEventListener('click', () => {
      popover.showPopover();
    });

    popover.addEventListener('toggle', (e) => {
      const toggleEvent = e as { newState?: string };
      if (toggleEvent.newState === 'open') {
        const buttonRect = button.getBoundingClientRect();
        popover.style.position = 'fixed';
        popover.style.top = `${buttonRect.bottom + 4}px`;
        popover.style.left = `${buttonRect.left}px`;
      }
    });

    swatches.forEach((swatch) => {
      swatch.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const font = (e.target as HTMLElement).dataset['font'];
        if (font) {
          this.dispatchEvent(new CustomEvent('fontchange', { detail: { value: font }, composed: true }));
          popover.hidePopover();
        }
      });
    });
  }
}

export function registerFontPickerElement(): void {
  if (!customElements.get('font-picker')) {
    customElements.define('font-picker', FontPickerElement);
  }
}

registerFontPickerElement();
