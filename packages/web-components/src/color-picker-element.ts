export class ColorPickerElement extends HTMLElement {
  private readonly colors = ['#B08BBF', '#C9A66B', '#8B9B6D', '#D4A5A5', '#6B8BA8', '#C97B7B', '#B8956A', '#8F7A6D', '#A67C8E'];

  connectedCallback(): void {
    this.render();
    this.attachEventListeners();
  }

  private render(): void {
    this.innerHTML = `
      <style>
        #color-picker-button {
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
        .color-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 4px;
        }
        .color-swatch {
          width: 32px;
          height: 32px;
          border: 1px solid #ddd;
          border-radius: 2px;
          cursor: pointer;
          padding: 0;
        }
        .color-swatch:hover {
          border-color: #999;
        }
      </style>
      <div id="color-picker-button">&#119808;</div>
      <div id="color-picker-popover" popover>
        <div class="color-grid">
          ${this.colors.map((color) => `<button type="submit" class="color-swatch" data-color="${color}" style="background-color: ${color}"></button>`).join('')}
        </div>
      </div>
    `;
  }

  private attachEventListeners(): void {
    const button = this.querySelector<HTMLElement>('#color-picker-button')!;
    const popover = this.querySelector<HTMLElement & { showPopover: () => void; hidePopover: () => void }>('#color-picker-popover')!;
    const swatches = this.querySelectorAll('.color-swatch');

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
        const color = (e.target as HTMLElement).dataset['color'];
        if (color) {
          console.log('color changed', color);
          this.dispatchEvent(new CustomEvent('colorchange', { detail: { value: color }, composed: true }));
          popover.hidePopover();
        }
      });
    });
  }
}

export function registerColorPickerElement(): void {
  if (!customElements.get('color-picker')) {
    customElements.define('color-picker', ColorPickerElement);
  }
}

registerColorPickerElement();
