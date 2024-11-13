export class ExtensionService {
  static async getExtensions(): Promise<chrome.ExtensionInfo[]> {
    if (!chrome?.management?.getAll) {
      console.warn('Chrome management API not available. Using mock data for development.');
      return this.getMockExtensions();
    }
    return chrome.management.getAll();
  }

  static async setEnabled(id: string, enabled: boolean): Promise<void> {
    if (!chrome?.management?.setEnabled) {
      console.warn('Chrome management API not available. Skipping enable/disable.');
      return;
    }
    return chrome.management.setEnabled(id, enabled);
  }

  static async uninstall(id: string): Promise<void> {
    if (!chrome?.management?.uninstall) {
      console.warn('Chrome management API not available. Skipping uninstall.');
      return;
    }
    return chrome.management.uninstall(id);
  }

  private static getMockExtensions(): chrome.ExtensionInfo[] {
    const mockIcons = [
      '📦', '🔧', '🎨', '🔍', '📝', '🔒', '🌐', '⚡️', '📱', '🎮'
    ];

    return Array.from({ length: 10 }, (_, i) => ({
      id: `${i + 1}`,
      name: `Mock Extension ${i + 1}`,
      description: `This is a mock extension ${i + 1} for development purposes. It demonstrates how the extension manager handles various states and interactions.`,
      enabled: i % 2 === 0,
      icons: [{
        url: `data:image/svg+xml,${encodeURIComponent(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="6" fill="#3b82f6"/>
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="14" fill="white">
              ${mockIcons[i % mockIcons.length]}
            </text>
          </svg>
        `)}`,
        size: 32
      }]
    }));
  }
}