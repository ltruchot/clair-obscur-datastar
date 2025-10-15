class ListOfItems extends HTMLElement {
  items = [];
  static get observedAttributes() {
    return ['items'];
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    if (name === 'items') {
      this.items = JSON.parse(newValue);
      this.render();
    }
  }

  connectedCallback() {
    this.render();
    this.addEventListener('change', this.handleCheckboxChange);
  }

  disconnectedCallback() {
    this.removeEventListener('change', this.handleCheckboxChange);
  }

  handleCheckboxChange = (event) => {
    if (event.target.type === 'checkbox') {
      const listItem = event.target.closest('li');
      const itemId = listItem.id;
      const isChecked = event.target.checked;

      this.dispatchEvent(
        new CustomEvent('item-toggle', {
          detail: { id: itemId, label: listItem.textContent.trim(), checked: isChecked },
          bubbles: true,
          composed: true,
        }),
      );
    }
  };

  render() {
    this.innerHTML = `
    <ul>
      ${this.items
        .map(
          (item) => `
          <li id="${item.id}" style="text-decoration: ${item.checked ? 'line-through' : 'none'}">
            <input type="checkbox" ${item.checked ? 'checked' : ''} />
            ${item.label}
          </li>
        `,
        )
        .join('')}
    </ul>`;
  }
}

customElements.define('list-of-items', ListOfItems);
