export interface ListItem {
  id: string;
  label: string;
}

export class ListElement extends HTMLElement {
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

  private render(): void {
    const fragment = document.createDocumentFragment();
    const ul = document.createElement('ul');
    ul.setAttribute('part', 'list');

    this._items.forEach((item) => {
      const li = document.createElement('li');
      li.setAttribute('part', 'item');
      li.setAttribute('data-id', item.id);
      li.textContent = item.label;
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
