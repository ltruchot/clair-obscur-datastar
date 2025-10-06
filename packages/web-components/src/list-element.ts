export interface ListItem {
  id: string;
  label: string;
  isCurrentSession: boolean;
  color: string;
}

export class ListElement extends HTMLElement {
  private _shadowRoot: ShadowRoot;
  private _items: ListItem[] = [];

  static get observedAttributes(): readonly string[] {
    return ['items'] as const;
  }

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
  }

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
    if (name === 'items') {
      this.items = newValue ? (JSON.parse(newValue) as ListItem[]) : ([] as ListItem[]);
    }
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

  private render(): void {
    const fragment = document.createDocumentFragment();
    const ul = document.createElement('ul');
    ul.setAttribute('part', 'list');

    this._items.forEach((item) => {
      const li = document.createElement('li');
      li.setAttribute('part', 'item');
      li.setAttribute('data-id', item.id);
      li.style.color = item.color;
      if (item.isCurrentSession) {
        li.innerHTML = `${item.label} (you)`;
      } else {
        li.textContent = item.label;
      }
      ul.appendChild(li);
    });

    fragment.appendChild(ul);
    this._shadowRoot.replaceChildren(fragment);
  }
}

export function registerListElement(): void {
  if (!customElements.get('list-element')) {
    customElements.define('list-element', ListElement);
  }
}

registerListElement();
