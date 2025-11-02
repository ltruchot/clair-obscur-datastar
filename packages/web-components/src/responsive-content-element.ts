import { isTouchOnlyDevice } from '@clair-obscur-workspace/utils';

export class ResponsiveContentElement extends HTMLElement {
  connectedCallback(): void {
    const defaultDevice = this.getAttribute('default') as 'mobile' | 'desktop' | null;

    if (!defaultDevice) {
      const isMobile = isTouchOnlyDevice();
      this.setAttribute('default', isMobile ? 'mobile' : 'desktop');
    }
  }
}

export function registerResponsiveContentElement(): void {
  if (!customElements.get('responsive-content')) {
    customElements.define('responsive-content', ResponsiveContentElement);
  }
}

registerResponsiveContentElement();
