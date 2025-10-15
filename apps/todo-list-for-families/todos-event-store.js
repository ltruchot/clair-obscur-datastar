export class TodoEventStore {
  #state = {
    todos: [],
  };

  #subscribers = new Set();

  read() {
    return { ...this.#state };
  }

  #notifySubscribers() {
    const currentState = this.read();
    this.#subscribers.forEach((subscriber) => {
      subscriber(currentState);
    });
  }

  write(key, value) {
    const event = {
      key,
      value,
    };

    this.#state[event.key] = event.value;

    this.#notifySubscribers();
  }

  subscribe(subscriber) {
    this.#subscribers.add(subscriber);

    return () => {
      this.#subscribers.delete(subscriber);
    };
  }
}
