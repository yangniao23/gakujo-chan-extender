/**
 * DOM クエリ・選択ユーティリティ
 * DOM要素の選択と検索を簡潔に
 */

/**
 * 単一要素を ID で選択
 */
export function getElementById<K extends keyof HTMLElementTagNameMap>(
  id: string,
  tag?: K
): InstanceType<typeof HTMLElementTagNameMap[K]> | null {
  const element = document.getElementById(id);
  if (!element) return null;

  if (tag && element.tagName.toLowerCase() !== tag.toLowerCase()) {
    console.warn(`Element with id "${id}" is not a ${tag}`);
  }

  return element as unknown as InstanceType<typeof HTMLElementTagNameMap[K]>;
}

/**
 * 複数要素を クラス で選択
 */
export function getElementsByClassName<K extends keyof HTMLElementTagNameMap>(
  className: string,
  parent?: HTMLElement
): HTMLCollectionOf<InstanceType<typeof HTMLElementTagNameMap[K]>> {
  const container = parent || document;
  return container.getElementsByClassName(className) as unknown as HTMLCollectionOf<InstanceType<typeof HTMLElementTagNameMap[K]>>;
}

/**
 * 複数要素を タグ で選択
 */
export function getElementsByTagName<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  parent?: HTMLElement
): HTMLCollectionOf<InstanceType<typeof HTMLElementTagNameMap[K]>> {
  const container = parent || document;
  return container.getElementsByTagName(tag);
}

/**
 * CSS セレクタで単一要素を選択
 */
export function querySelector<E extends HTMLElement = HTMLElement>(
  selector: string,
  parent?: HTMLElement
): E | null {
  const container = parent || document;
  return container.querySelector<E>(selector);
}

/**
 * CSS セレクタで複数要素を選択
 */
export function querySelectorAll<E extends HTMLElement = HTMLElement>(
  selector: string,
  parent?: HTMLElement
): E[] {
  const container = parent || document;
  return Array.from(container.querySelectorAll<E>(selector));
}

/**
 * 要素にマッチするセレクタを持つ最初の親要素を取得
 */
export function closest<E extends HTMLElement = HTMLElement>(
  element: HTMLElement,
  selector: string
): E | null {
  return element.closest<E>(selector);
}

/**
 * 要素が特定のセレクタにマッチするか確認
 */
export function matches(element: HTMLElement, selector: string): boolean {
  return element.matches(selector);
}

/**
 * 複数の兄弟要素の中から最初のマッチを取得
 */
export function nextElementSibling<E extends HTMLElement = HTMLElement>(
  element: HTMLElement,
  selector?: string
): E | null {
  let next = element.nextElementSibling as E | null;

  while (next) {
    if (!selector || next.matches(selector)) {
      return next;
    }
    next = next.nextElementSibling as E | null;
  }

  return null;
}

/**
 * 複数の兄弟要素の中から最初のマッチを取得（逆方向）
 */
export function previousElementSibling<E extends HTMLElement = HTMLElement>(
  element: HTMLElement,
  selector?: string
): E | null {
  let prev = element.previousElementSibling as E | null;

  while (prev) {
    if (!selector || prev.matches(selector)) {
      return prev;
    }
    prev = prev.previousElementSibling as E | null;
  }

  return null;
}

/**
 * 親要素内の最初のマッチング子要素を取得
 */
export function findChild<E extends HTMLElement = HTMLElement>(
  parent: HTMLElement,
  selector: string
): E | null {
  return parent.querySelector<E>(selector);
}

/**
 * 親要素内のマッチング子要素をすべて取得
 */
export function findChildren<E extends HTMLElement = HTMLElement>(
  parent: HTMLElement,
  selector: string
): E[] {
  return Array.from(parent.querySelectorAll<E>(selector));
}

/**
 * 要素が DOM に存在するか確認
 */
export function isInDOM(element: HTMLElement): boolean {
  return document.contains(element);
}

/**
 * 要素が表示されているか確認
 */
export function isVisible(element: HTMLElement): boolean {
  return !!(
    element.offsetParent !== null &&
    getComputedStyle(element).display !== 'none'
  );
}

/**
 * 要素が無効か確認
 */
export function isDisabled(element: HTMLElement): boolean {
  const el = element as unknown as { disabled: boolean | undefined };
  return el.disabled === true || element.getAttribute('disabled') === 'disabled';
}

/**
 * 要素にテキストが含まれているか確認（大文字小文字区別なし）
 */
export function containsText(
  element: HTMLElement,
  text: string,
  caseSensitive: boolean = false
): boolean {
  const elementText = element.textContent || '';
  const searchText = caseSensitive ? text : text.toLowerCase();
  const targetText = caseSensitive ? elementText : elementText.toLowerCase();
  return targetText.includes(searchText);
}

/**
 * 要素の親パスを取得
 */
export function getParentPath(element: HTMLElement): HTMLElement[] {
  const path: HTMLElement[] = [];
  let current: HTMLElement | null = element;

  while (current) {
    path.push(current);
    current = current.parentElement;
  }

  return path;
}

/**
 * 要素のパスセレクタを生成
 */
export function getPathSelector(element: HTMLElement): string {
  const path: string[] = [];
  let current: HTMLElement | null = element;

  while (current && current !== document.documentElement) {
    let selector = current.tagName.toLowerCase();

    if (current.id) {
      selector = `#${current.id}`;
      path.unshift(selector);
      break;
    }

    if (current.className) {
      selector += `.${current.className.split(' ').join('.')}`;
    }

    path.unshift(selector);
    current = current.parentElement;
  }

  return path.join(' > ');
}
