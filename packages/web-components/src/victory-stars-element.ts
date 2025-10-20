import { tsParticles } from '@tsparticles/engine';
import { loadConfettiPreset } from '@tsparticles/preset-confetti';
import { loadStarShape } from '@tsparticles/shape-star';

export class VictoryStarsElement extends HTMLElement {
  private _shadowRoot: ShadowRoot;
  private _won = false;
  private _container: HTMLDivElement | null = null;
  private _particlesContainer: HTMLDivElement | null = null;
  private _particlesInitialized = false;

  static get observedAttributes(): readonly string[] {
    return ['won'] as const;
  }

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
  }

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
    console.log('attributeChangedCallback', name, newValue);
    if (name === 'won') {
      this._won = newValue === 'true';
      void this._updateDisplay();
    }
  }

  connectedCallback(): void {
    this._render();
    void this._updateDisplay();
  }

  disconnectedCallback(): void {
    if (this._particlesContainer?.parentNode) {
      this._particlesContainer.parentNode.removeChild(this._particlesContainer);
      this._particlesContainer = null;
    }
  }

  override get shadowRoot(): ShadowRoot {
    return this._shadowRoot;
  }

  private _render(): void {
    const style = document.createElement('style');
    style.textContent = `
      .victory-container {
        width: fit-content;
        margin: 0 auto;
        background: linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.5s ease-in-out;
        font-size: 35px;

      }
      .victory-container.visible {
        opacity: 1;
      }
    `;

    this._container = document.createElement('div');
    this._container.className = 'victory-container';
    this._container.textContent = '⭐⭐⭐⭐🌟✨ Victory ✨🌟⭐⭐⭐⭐';

    if (!this._particlesContainer) {
      this._particlesContainer = document.createElement('div');
      this._particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
      `;
      this._particlesContainer.id = 'victory-particles';
      document.body.appendChild(this._particlesContainer);
    }

    this._shadowRoot.replaceChildren(style, this._container);
    void this._updateDisplay();
  }

  private async _updateDisplay(): Promise<void> {
    if (!this._container || !this._particlesContainer) return;

    if (this._won) {
      this._container.classList.add('visible');

      if (!this._particlesInitialized) {
        await loadConfettiPreset(tsParticles);
        await loadStarShape(tsParticles);
        this._particlesInitialized = true;
      }

      setTimeout(() => this._shoot(), 0);
      setTimeout(() => this._shoot(), 500);
      setTimeout(() => this._shoot(), 1_500);
    } else {
      this._container.classList.remove('visible');
    }
  }

  private _shoot(): void {
    if (!this._particlesContainer) return;

    const defaults = {
      spread: 360,
      ticks: 500,
      gravity: 0,
      decay: 0.94,
      startVelocity: 30,
      colors: ['#FFE400', '#FFBD00', '#E89400', '#FFCA6C', '#FDFFB8'],
    };

    const timestamp = Date.now();
    const random = Math.random();

    const starContainer = document.createElement('div');
    starContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    `;
    starContainer.id = `confetti-star-${timestamp}-${random}`;
    document.body.appendChild(starContainer);

    const circleContainer = document.createElement('div');
    circleContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    `;
    circleContainer.id = `confetti-circle-${timestamp}-${random}`;
    document.body.appendChild(circleContainer);

    void tsParticles.load({
      id: starContainer.id,
      element: starContainer,
      options: {
        preset: 'confetti',
        particles: {
          number: {
            value: 20,
          },
          color: {
            value: defaults.colors,
          },
          shape: {
            type: 'star',
          },
          life: {
            duration: {
              value: defaults.ticks / 60,
            },
          },
          move: {
            enable: true,
            speed: defaults.startVelocity,
            decay: 1 - defaults.decay,
            gravity: {
              enable: defaults.gravity > 0,
              acceleration: defaults.gravity,
            },
            direction: 'none',
            outModes: {
              default: 'destroy',
            },
          },
          size: {
            value: 12,
          },
        },
        emitters: {
          life: {
            count: 1,
            duration: 0.1,
          },
          rate: {
            delay: 0,
            quantity: 40,
          },
          position: {
            x: 50,
            y: 50,
          },
        },
      },
    });

    void tsParticles.load({
      id: circleContainer.id,
      element: circleContainer,
      options: {
        preset: 'confetti',
        particles: {
          number: {
            value: 10,
          },
          color: {
            value: defaults.colors,
          },
          shape: {
            type: 'circle',
          },
          life: {
            duration: {
              value: defaults.ticks / 60,
            },
          },
          move: {
            enable: true,
            speed: defaults.startVelocity,
            decay: 1 - defaults.decay,
            gravity: {
              enable: defaults.gravity > 0,
              acceleration: defaults.gravity,
            },
            direction: 'none',
            outModes: {
              default: 'destroy',
            },
          },
          size: {
            value: 7.5,
          },
        },
        emitters: {
          life: {
            count: 1,
            duration: 0.1,
          },
          rate: {
            delay: 0,
            quantity: 10,
          },
          position: {
            x: 50,
            y: 50,
          },
        },
      },
    });

    setTimeout(() => {
      starContainer.remove();
      circleContainer.remove();
    }, 10_000);
  }
}

export function registerVictoryStarsElement(): void {
  if (!customElements.get('victory-stars')) {
    customElements.define('victory-stars', VictoryStarsElement);
  }
}

registerVictoryStarsElement();
