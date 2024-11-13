import { ExtensionService } from './services/extensionService';
import { ExtensionItem } from './components/ExtensionItem';

export class ExtensionManager {
  private container: HTMLElement;
  private searchInput: HTMLInputElement;
  private searchType: HTMLSelectElement;
  private extensionsList: HTMLElement;

  constructor() {
    this.container = document.getElementById('app')!;
    this.setupUI();
  }

  private setupUI() {
    this.container.innerHTML = `
      <div class="extension-manager">
        <div class="search-container">
          <div class="search-bar">
            <input type="text" id="searchInput" placeholder="Search extensions...">
            <select id="searchType">
              <option value="all">All Extensions</option>
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
              <option value="store">Chrome Web Store</option>
            </select>
          </div>
        </div>
        <div class="extensions-list" id="extensionsList"></div>
      </div>
    `;

    this.searchInput = document.getElementById('searchInput') as HTMLInputElement;
    this.searchType = document.getElementById('searchType') as HTMLSelectElement;
    this.extensionsList = document.getElementById('extensionsList')!;

    this.searchInput.addEventListener('input', () => this.filterExtensions());
    this.searchType.addEventListener('change', () => this.filterExtensions());
  }

  public async initialize() {
    try {
      await this.loadExtensions();
      this.setupEventListeners();
    } catch (error) {
      console.error('Failed to initialize extension manager:', error);
      this.showError('Failed to load extensions. Please try again.');
    }
  }

  private async loadExtensions() {
    const extensions = await ExtensionService.getExtensions();
    const sortedExtensions = extensions.sort((a, b) => a.name.localeCompare(b.name));

    this.extensionsList.innerHTML = '';
    sortedExtensions.forEach(extension => {
      const extensionItem = new ExtensionItem(
        extension,
        async (enabled) => {
          try {
            await ExtensionService.setEnabled(extension.id, enabled);
          } catch (error) {
            console.error('Failed to toggle extension:', error);
            this.showError('Failed to toggle extension. Please try again.');
          }
        },
        () => {
          console.log('Pin functionality not implemented');
        },
        async () => {
          if (confirm(`Are you sure you want to uninstall ${extension.name}?`)) {
            try {
              await ExtensionService.uninstall(extension.id);
              this.extensionsList.removeChild(extensionItem.getElement());
            } catch (error) {
              console.error('Failed to uninstall extension:', error);
              this.showError('Failed to uninstall extension. Please try again.');
            }
          }
        }
      );
      this.extensionsList.appendChild(extensionItem.getElement());
    });
  }

  private filterExtensions() {
    const searchTerm = this.searchInput.value.toLowerCase();
    const filterType = this.searchType.value;
    const items = this.extensionsList.getElementsByClassName('extension-item');

    Array.from(items).forEach((item: Element) => {
      const name = item.querySelector('h3')!.textContent!.toLowerCase();
      const description = item.querySelector('p')!.textContent!.toLowerCase();
      const isEnabled = item.querySelector('input[type="checkbox"]')!.checked;
      
      const matchesSearch = name.includes(searchTerm) || description.includes(searchTerm);
      const matchesFilter = filterType === 'all' ||
        (filterType === 'enabled' && isEnabled) ||
        (filterType === 'disabled' && !isEnabled) ||
        (filterType === 'store' && searchTerm.length >= 3); // Only show store results when search has 3+ chars

      (item as HTMLElement).style.display = (matchesSearch && matchesFilter) ? 'flex' : 'none';
    });

    // Show store search message when appropriate
    if (filterType === 'store' && searchTerm.length >= 3) {
      const storeMessage = document.createElement('div');
      storeMessage.className = 'extension-item';
      storeMessage.innerHTML = `
        <div class="extension-info">
          <h3>Search Chrome Web Store</h3>
          <p>Search "${searchTerm}" in Chrome Web Store</p>
        </div>
      `;
      this.extensionsList.appendChild(storeMessage);
    }
  }

  private setupEventListeners() {
    if (chrome?.management) {
      chrome.management.onEnabled.addListener(() => this.loadExtensions());
      chrome.management.onDisabled.addListener(() => this.loadExtensions());
      chrome.management.onInstalled.addListener(() => this.loadExtensions());
      chrome.management.onUninstalled.addListener(() => this.loadExtensions());
    }
  }

  private showError(message: string) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    this.container.insertBefore(errorDiv, this.container.firstChild);

    setTimeout(() => {
      errorDiv.remove();
    }, 3000);
  }
}