export class ExtensionItem {
  private element: HTMLElement;

  constructor(
    private extension: chrome.ExtensionInfo,
    private onToggle: (enabled: boolean) => void,
    private onPin: () => void,
    private onUninstall: () => void
  ) {
    this.element = this.createElement();
  }

  private createElement(): HTMLElement {
    const div = document.createElement('div');
    div.className = 'extension-item';
    div.innerHTML = `
      <div class="extension-icon">
        ${this.extension.icons ? `<img src="${this.extension.icons[0].url}" alt="">` : ''}
      </div>
      <div class="extension-info">
        <h3>${this.extension.name}</h3>
        <p>${this.extension.description}</p>
      </div>
      <div class="extension-controls">
        <label class="switch">
          <input type="checkbox" ${this.extension.enabled ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
        <button class="pin-btn ${this.extension.enabled ? 'pinned' : ''}" title="Pin/Unpin">📌</button>
        <button class="uninstall-btn" title="Uninstall">🗑️</button>
      </div>
    `;

    this.setupEventListeners(div);
    return div;
  }

  private setupEventListeners(element: HTMLElement): void {
    const toggleInput = element.querySelector('input[type="checkbox"]')!;
    toggleInput.addEventListener('change', () => {
      this.onToggle(toggleInput.checked);
    });

    const pinBtn = element.querySelector('.pin-btn')!;
    pinBtn.addEventListener('click', () => {
      this.onPin();
      pinBtn.classList.toggle('pinned');
    });

    const uninstallBtn = element.querySelector('.uninstall-btn')!;
    uninstallBtn.addEventListener('click', () => {
      this.onUninstall();
    });
  }

  public getElement(): HTMLElement {
    return this.element;
  }
}