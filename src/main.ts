import './style.css';
import { ExtensionManager } from './extensionManager';

document.addEventListener('DOMContentLoaded', () => {
  const manager = new ExtensionManager();
  manager.initialize();
});