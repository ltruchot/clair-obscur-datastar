class Countdown extends HTMLElement {
  secondsLeft = -1;
  intervalId = null;

  static get observedAttributes() {
    return ['seconds-left'];
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    if (name === 'seconds-left' && newValue) {
      const newSeconds = Number.parseInt(JSON.parse(newValue).value, 10);
      if (!Number.isNaN(newSeconds) && newSeconds > 0) {
        this.secondsLeft = newSeconds;
        this.startCountdown();
      }
    }
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    this.clearCountdown();
  }

  startCountdown() {
    this.clearCountdown();
    this.render();

    this.intervalId = setInterval(() => {
      this.secondsLeft--;
      this.render();

      if (this.secondsLeft <= 0) {
        this.clearCountdown();
      }
    }, 1000);
  }

  clearCountdown() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  render() {
    if (this.secondsLeft === -1) {
      this.textContent = 'Initializing...';
      return;
    }

    this.textContent =
      this.secondsLeft > 0 ? `This list will auto-destroy in ${this.secondsLeft} seconds` : '💥 BOOM 💥';
  }
}

customElements.define('count-down', Countdown);
