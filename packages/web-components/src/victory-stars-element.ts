import { tsParticles } from '@tsparticles/engine';
import { loadConfettiPreset } from '@tsparticles/preset-confetti';
import { loadStarShape } from '@tsparticles/shape-star';

export class VictoryStarsElement extends HTMLElement {
  private _shadowRoot: ShadowRoot;
  private _won = false;
  private _container: HTMLDivElement | null = null;
  private _particlesInitialized = false;
  private _permanentContainers: HTMLDivElement[] = [];
  private _timeoutIds: ReturnType<typeof setTimeout>[] = [];
  private _particleContainers: unknown[] = [];

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
      this._updateDisplay();
    }
  }

  connectedCallback(): void {
    this._render();
    this._createPermanentContainers();
    void this._initializeParticles();
  }

  private _createPermanentContainers(): void {
    for (let i = 0; i < 4; i++) {
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
    console.log('initializeParticles');
    if (!this._particlesInitialized) {
      await loadConfettiPreset(tsParticles);
      await loadStarShape(tsParticles);

      const defaults = {
        ticks: 500,
        decay: 0.94,
        startVelocity: 30,
        gravity: 0,
      };

      const stageQuantities = [
        { star: 3, circle: 2 },
        { star: 10, circle: 5 },
        { star: 25, circle: 15 },
        { star: 60, circle: 40 },
      ];

      for (let i = 0; i < 4; i++) {
        const container = this._permanentContainers[i];
        if (!container) continue;

        const quantities = stageQuantities[i];
        if (!quantities) continue;

        const particleContainer = await tsParticles.load({
          id: container.id,
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
                value: { min: 6, max: 8 },
              },
            },
            emitters: [
              {
                autoPlay: false,
                name: `confetti-star-${i}`,
                life: {
                  count: 1,
                  duration: 0.1,
                },
                rate: {
                  delay: 0,
                  quantity: quantities.star,
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
                autoPlay: false,
                name: `confetti-circle-${i}`,
                life: {
                  count: 1,
                  duration: 0.1,
                },
                rate: {
                  delay: 0,
                  quantity: quantities.circle,
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

        this._particleContainers[i] = particleContainer;
      }

      await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));

      this._particlesInitialized = true;
    }
  }

  disconnectedCallback(): void {
    this._cleanupAnimation();

    this._particleContainers.forEach((particleContainer) => {
      if (particleContainer && typeof particleContainer === 'object') {
        const container = particleContainer as { destroy: () => void };
        container.destroy();
      }
    });
    this._particleContainers = [];

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
    console.log('render');
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
    this._updateDisplay();
  }

  private _updateDisplay(): void {
    console.log('updateDisplay');
    if (!this._container) return;

    if (this._won) {
      this._timeoutIds.forEach((id) => clearTimeout(id));
      this._timeoutIds = [];

      this._container.classList.add('visible');

      this._timeoutIds.push(setTimeout(() => void this._shoot(0), 0));
      this._timeoutIds.push(setTimeout(() => void this._shoot(1), 1_500));
      this._timeoutIds.push(setTimeout(() => void this._shoot(2), 2_500));
      this._timeoutIds.push(setTimeout(() => void this._shoot(3), 4_500));
    } else {
      this._cleanupAnimation();
    }
  }

  private _cleanupAnimation(): void {
    this._container?.classList.remove('visible');

    this._timeoutIds.forEach((id) => clearTimeout(id));
    this._timeoutIds = [];

    this._particleContainers.forEach((particleContainer) => {
      if (particleContainer && typeof particleContainer === 'object') {
        const container = particleContainer as { refresh: () => void };
        container.refresh();
      }
    });
  }

  private _shoot(index: number): void {
    console.log('shoot', index);
    const particleContainer = this._particleContainers[index];
    if (!particleContainer || typeof particleContainer !== 'object') return;

    const container = particleContainer as { playEmitter: (name: string) => void };
    container.playEmitter(`confetti-star-${index}`);
    container.playEmitter(`confetti-circle-${index}`);
  }
}

export function registerVictoryStarsElement(): void {
  if (!customElements.get('victory-stars')) {
    customElements.define('victory-stars', VictoryStarsElement);
  }
}

registerVictoryStarsElement();
