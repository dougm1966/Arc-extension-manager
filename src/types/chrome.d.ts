declare namespace chrome {
  export interface ExtensionInfo {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    icons?: Array<{ url: string; size: number }>;
  }

  export interface ManagementAPI {
    getAll(): Promise<ExtensionInfo[]>;
    setEnabled(id: string, enabled: boolean): Promise<void>;
    uninstall(id: string): Promise<void>;
    onEnabled: { addListener(callback: () => void): void };
    onDisabled: { addListener(callback: () => void): void };
    onInstalled: { addListener(callback: () => void): void };
    onUninstalled: { addListener(callback: () => void): void };
  }

  export const management: ManagementAPI;
}