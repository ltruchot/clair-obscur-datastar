import { isTouchOnlyDevice } from '@clair-obscur-workspace/utils';

export class ResponsiveContentElement extends HTMLElement {
  private _shadowRoot: ShadowRoot;

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
  }

  connectedCallback(): void {
    this._render();
  }

  override get shadowRoot(): ShadowRoot {
    return this._shadowRoot;
  }

  private _render(): void {
    const isMobile = isTouchOnlyDevice();

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: contents;
      }
      ::slotted(*) {
        display: none;
      }
      ::slotted([slot="${isMobile ? 'mobile' : 'desktop'}"]) {
        display: initial;
      }
    `;

    const mobileSlot = document.createElement('slot');
    mobileSlot.name = 'mobile';

    const desktopSlot = document.createElement('slot');
    desktopSlot.name = 'desktop';

    this._shadowRoot.replaceChildren(style, mobileSlot, desktopSlot);
  }
}

export function registerResponsiveContentElement(): void {
  if (!customElements.get('responsive-content')) {
    customElements.define('responsive-content', ResponsiveContentElement);
  }
}

registerResponsiveContentElement();
