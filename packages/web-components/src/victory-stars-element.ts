import { tsParticles } from '@tsparticles/engine';
import { loadConfettiPreset } from '@tsparticles/preset-confetti';
import { loadStarShape } from '@tsparticles/shape-star';

export class VictoryStarsElement extends HTMLElement {
  private _shadowRoot: ShadowRoot;
  private _won = false;
  private _container: HTMLDivElement | null = null;
  private _particlesInitialized = false;
  private _permanentContainers: HTMLDivElement[] = [];

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
    this._createPermanentContainers();
    void this._initializeParticles();
  }

  private _createPermanentContainers(): void {
    for (let i = 0; i < 3; i++) {
      const container = document.createElement('div');
      container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
      `;
      container.id = `permanent-confetti-${i}`;
      document.body.appendChild(container);
      this._permanentContainers.push(container);
    }
  }

  private async _initializeParticles(): Promise<void> {
    if (!this._particlesInitialized) {
      await loadConfettiPreset(tsParticles);
      await loadStarShape(tsParticles);

      const warmupContainer = document.createElement('div');
      warmupContainer.style.cssText =
        'position: fixed; top: 0; left: 0; width: 1px; height: 1px; opacity: 0; pointer-events: none;';
      warmupContainer.id = 'warmup-particles';
      document.body.appendChild(warmupContainer);

      await tsParticles.load({
        id: 'warmup-particles',
        element: warmupContainer,
        options: {
          preset: 'confetti',
          particles: {
            number: { value: 1 },
          },
        },
      });

      await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));

      warmupContainer.remove();

      this._particlesInitialized = true;
    }
  }

  disconnectedCallback(): void {
    this._permanentContainers.forEach((container) => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    });
    this._permanentContainers = [];
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

    this._shadowRoot.replaceChildren(style, this._container);
    void this._updateDisplay();
  }

  private async _updateDisplay(): Promise<void> {
    if (!this._container) return;

    if (this._won) {
      this._container.classList.add('visible');

      await this._initializeParticles();

      setTimeout(() => void this._shoot(0), 0);
      setTimeout(() => void this._shoot(1), 500);
      setTimeout(() => void this._shoot(2), 1_500);
    } else {
      this._container.classList.remove('visible');
    }
  }

  private async _shoot(index: number): Promise<void> {
    const container = this._permanentContainers[index];
    if (!container) return;

    const containerId = container.id;
    const existingInstance = tsParticles.domItem(index);
    if (existingInstance) {
      existingInstance.destroy();
    }

    await tsParticles.load({
      id: containerId,
      element: container,
      options: {
        preset: 'confetti',
        fpsLimit: 120,
        reduceDuplicates: true,
        particles: {
          number: {
            value: 0,
          },
          color: {
            value: ['#FFE400', '#FFBD00', '#E89400', '#FFCA6C', '#FDFFB8'],
          },
          shape: {
            type: ['star', 'circle'],
          },
          life: {
            duration: {
              value: 8.33,
            },
          },
          move: {
            enable: true,
            speed: 30,
            decay: 0.06,
            gravity: {
              enable: false,
              acceleration: 0,
            },
            direction: 'none',
            outModes: {
              default: 'destroy',
            },
          },
          size: {
            value: { min: 6, max: 8 },
          },
        },
        emitters: [
          {
            life: {
              count: 1,
              duration: 0.1,
            },
            rate: {
              delay: 0,
              quantity: 20,
            },
            position: {
              x: 50,
              y: 50,
            },
            particles: {
              shape: {
                type: 'star',
              },
              size: {
                value: 8,
              },
            },
          },
          {
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
            particles: {
              shape: {
                type: 'circle',
              },
              size: {
                value: 7.5,
              },
            },
          },
        ],
      },
    });
  }
}

export function registerVictoryStarsElement(): void {
  if (!customElements.get('victory-stars')) {
    customElements.define('victory-stars', VictoryStarsElement);
  }
}

registerVictoryStarsElement();
