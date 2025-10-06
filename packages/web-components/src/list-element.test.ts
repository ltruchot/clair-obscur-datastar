import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ListElement, registerListElement, type ListItem } from './list-element.ts';

describe('ListElement', () => {
  beforeEach(() => {
    registerListElement();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should register the custom element', () => {
    expect(customElements.get('list-element')).toBe(ListElement);
  });

  it('should render an empty list by default', () => {
    const element = document.createElement('list-element') as ListElement;
    document.body.appendChild(element);

    const ul = element.shadowRoot.querySelector('ul');
    expect(ul).toBeTruthy();
    expect(ul?.children.length).toBe(0);
  });

  it('should render items from property', () => {
    const element = document.createElement('list-element') as ListElement;
    const items: ListItem[] = [
      { id: '1', label: 'Item 1', isCurrentSession: false, color: '#000000' },
      { id: '2', label: 'Item 2', isCurrentSession: false, color: '#000000' },
    ];

    element.items = items;
    document.body.appendChild(element);

    const ul = element.shadowRoot.querySelector('ul');
    const listItems = ul?.querySelectorAll('li');

    expect(listItems?.length).toBe(2);
    expect(listItems?.[0]?.textContent).toBe('Item 1');
    expect(listItems?.[0]?.getAttribute('data-id')).toBe('1');
    expect(listItems?.[1]?.textContent).toBe('Item 2');
    expect(listItems?.[1]?.getAttribute('data-id')).toBe('2');
  });

  it('should render items from attribute', () => {
    const element = document.createElement('list-element') as ListElement;
    const items: ListItem[] = [
      { id: '1', label: 'Item 1', isCurrentSession: false, color: '#000000' },
      { id: '2', label: 'Item 2', isCurrentSession: false, color: '#000000' },
      { id: '3', label: 'Item 3', isCurrentSession: true, color: '#000000' },
    ];

    element.setAttribute('items', JSON.stringify(items));
    document.body.appendChild(element);

    const ul = element.shadowRoot.querySelector('ul');
    const listItems = ul?.querySelectorAll('li');

    expect(listItems?.length).toBe(2);
    expect(listItems?.[0]?.textContent).toBe('Item 1');
    expect(listItems?.[1]?.textContent).toBe('Item 2');
  });

  it('should update list when items property changes', () => {
    const element = document.createElement('list-element') as ListElement;
    document.body.appendChild(element);

    element.items = [{ id: '1', label: 'Item 1', isCurrentSession: false, color: '#000000' }];
    let listItems = element.shadowRoot.querySelectorAll('li');
    expect(listItems.length).toBe(1);

    element.items = [
      { id: '1', label: 'Item 1', isCurrentSession: false, color: '#000000' },
      { id: '2', label: 'Item 2', isCurrentSession: false, color: '#000000' },
    ];
    listItems = element.shadowRoot.querySelectorAll('li');
    expect(listItems.length).toBe(2);
  });

  it('should have part attributes for styling', () => {
    const element = document.createElement('list-element') as ListElement;
    element.items = [{ id: '1', label: 'Item 1', isCurrentSession: false, color: '#000000' }];
    document.body.appendChild(element);

    const ul = element.shadowRoot.querySelector('ul');
    const li = element.shadowRoot.querySelector('li');

    expect(ul?.getAttribute('part')).toBe('list');
    expect(li?.getAttribute('part')).toBe('item');
  });

  it('should handle invalid JSON in items attribute gracefully', () => {
    const element = document.createElement('list-element') as ListElement;
    element.setAttribute('items', 'invalid json');
    document.body.appendChild(element);

    const listItems = element.shadowRoot.querySelectorAll('li');
    expect(listItems.length).toBe(0);
  });
});
