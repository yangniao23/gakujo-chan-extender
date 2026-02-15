/**
 * バージョン表示機能
 * タブメニューに拡張機能のバージョンを表示
 */

import { runtime } from '@/core/browser/api';

/**
 * バージョン情報を表示
 */
async function showVersion(): Promise<void> {
  const tabMenuUl = document.getElementById('tabmenu-ul');
  if (!tabMenuUl) {
    console.warn('[VersionShow] tabmenu-ul element not found');
    return;
  }

  const manifest = await runtime.getManifest();
  const version = manifest.version;

  const li = document.createElement('li');
  li.style.fontStyle = 'italic';
  li.style.fontSize = '90%';
  li.textContent = `extension version ${version}`;

  tabMenuUl.appendChild(li);
  console.log(`[VersionShow] Displayed version ${version}`);
}

// 実行
showVersion();
