export interface ListItem {
  id: string;
  label: string;
}

export class ListElement extends HTMLElement {
  static readonly observedAttributes = ['items'] as const;

  private _shadowRoot: ShadowRoot;
  private _items: ListItem[] = [];

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
  }

  connectedCallback(): void {
    this.render();
  }

  override get shadowRoot(): ShadowRoot {
    return this._shadowRoot;
  }

  get items(): ListItem[] {
    return this._items;
  }

  set items(value: ListItem[]) {
    this._items = value;
    this.render();
  }

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
    if (name === 'items' && newValue) {
      try {
        this.items = JSON.parse(newValue) as ListItem[];
        console.log('items', this.items);
      } catch {
        console.error('Invalid JSON for items attribute');
      }
    }
  }

  private render(): void {
    const ul = document.createElement('ul');
    ul.setAttribute('part', 'list');

    this._items.forEach((item) => {
      const li = document.createElement('li');
      li.setAttribute('part', 'item');
      li.setAttribute('data-id', item.id);
      li.textContent = item.label;
      ul.appendChild(li);
    });

    this._shadowRoot.innerHTML = '';
    this._shadowRoot.appendChild(ul);
  }
}

export function registerListElement(): void {
  if (!customElements.get('list-element')) {
    customElements.define('list-element', ListElement);
  }
}

registerListElement();
