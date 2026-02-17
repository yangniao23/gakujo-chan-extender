/**
 * フォーム操作・イベント委譲・高度なDOM操作
 */

import { on, off } from './element-factory';

/**
 * フォーム要素の値を取得
 */
export function getValue(element: HTMLInputElement | HTMLTextAreaElement): string {
  return element.value;
}

/**
 * フォーム要素に値を設定
 */
export function setValue(
  element: HTMLInputElement | HTMLTextAreaElement,
  value: string
): HTMLInputElement | HTMLTextAreaElement {
  element.value = value;
  return element;
}

/**
 * チェックボックス/ラジオボタンが選択されているか
 */
export function isChecked(element: HTMLInputElement): boolean {
  return element.checked;
}

/**
 * チェックボックス/ラジオボタンを選択状態に設定
 */
export function setChecked(
  element: HTMLInputElement,
  checked: boolean
): HTMLInputElement {
  element.checked = checked;
  return element;
}

/**
 * フォーム要素を無効にする
 */
export function disable<T extends HTMLElement & { disabled?: boolean }>(element: T): T {
  const el = element as unknown as { disabled: boolean };
  el.disabled = true;
  element.setAttribute('disabled', 'disabled');
  return element;
}

/**
 * フォーム要素を有効にする
 */
export function enable<T extends HTMLElement & { disabled?: boolean }>(element: T): T {
  const el = element as unknown as { disabled: boolean };
  el.disabled = false;
  element.removeAttribute('disabled');
  return element;
}

/**
 * フォームのすべての値をオブジェクトとして取得
 */
export function getFormData(form: HTMLFormElement): Record<string, string> {
  const formData = new FormData(form);
  const data: Record<string, string> = {};

  for (const [key, value] of formData as unknown as Iterable<[string, FormDataEntryValue]>) {
    if (typeof value === 'string') {
      data[key] = value;
    }
  }

  return data;
}

/**
 * フォームのすべての値をオブジェクトから設定
 */
export function setFormData(
  form: HTMLFormElement,
  data: Record<string, string>
): void {
  Object.entries(data).forEach(([name, value]) => {
    const element = form.elements.namedItem(name);

    if (!element) return;

    if (element instanceof HTMLInputElement) {
      if (element.type === 'checkbox' || element.type === 'radio') {
        element.checked = value === 'true';
      } else {
        element.value = value;
      }
    } else if (element instanceof HTMLTextAreaElement) {
      element.value = value;
    } else if (element instanceof HTMLSelectElement) {
      element.value = value;
    }
  });
}

/**
 * フォームをリセット
 */
export function resetForm(form: HTMLFormElement): void {
  form.reset();
}

/**
 * イベント委譲を設定
 */
export function delegate<K extends keyof HTMLElementEventMap>(
  parent: HTMLElement,
  selector: string,
  event: K,
  handler: (element: HTMLElement, event: HTMLElementEventMap[K]) => void
): () => void {
  const listener = (e: HTMLElementEventMap[K]) => {
    const target = e.target as HTMLElement;
    const matchedElement = target.closest(selector) as HTMLElement | null;

    if (matchedElement && parent.contains(matchedElement)) {
      handler(matchedElement, e);
    }
  };

  on(parent, event, listener);

  return () => {
    off(parent, event, listener);
  };
}

/**
 * 要素がビューポート内に見えているか確認
 */
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= window.innerHeight &&
    rect.right <= window.innerWidth
  );
}

/**
 * 要素をビューポート内にスクロール
 */
export function scrollIntoView(
  element: HTMLElement,
  behavior: ScrollBehavior = 'smooth'
): void {
  element.scrollIntoView({ behavior, block: 'nearest' });
}

/**
 * 要素の位置情報を取得
 */
export function getPosition(element: HTMLElement): {
  top: number;
  left: number;
  width: number;
  height: number;
} {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
    width: rect.width,
    height: rect.height,
  };
}

/**
 * 要素のサイズを取得
 */
export function getSize(element: HTMLElement): { width: number; height: number } {
  return {
    width: element.offsetWidth,
    height: element.offsetHeight,
  };
}

/**
 * 要素のスクロール位置を取得
 */
export function getScroll(element: HTMLElement): { x: number; y: number } {
  return {
    x: element.scrollLeft,
    y: element.scrollTop,
  };
}

/**
 * 要素をスクロール
 */
export function scroll(
  element: HTMLElement,
  x?: number,
  y?: number
): void {
  if (x !== undefined) {
    element.scrollLeft = x;
  }
  if (y !== undefined) {
    element.scrollTop = y;
  }
}

/**
 * DOM変更を監視
 */
export function observeDOM(
  element: HTMLElement,
  callback: (mutations: MutationRecord[]) => void,
  options?: MutationObserverInit
): () => void {
  const observer = new MutationObserver(callback);

  const defaultOptions: MutationObserverInit = {
    childList: true,
    subtree: true,
    attributes: true,
    ...options,
  };

  observer.observe(element, defaultOptions);

  return () => {
    observer.disconnect();
  };
}

/**
 * 複数の要素をすべて同じクラスで装飾
 */
export function applyToAll<T extends HTMLElement>(
  elements: T[],
  callback: (element: T) => void
): void {
  elements.forEach(callback);
}

/**
 * 最初にマッチする要素にコールバックを実行
 */
export function applyToFirst<T extends HTMLElement>(
  elements: T[],
  callback: (element: T) => void
): void {
  if (elements.length > 0) {
    callback(elements[0]);
  }
}

/**
 * 要素を複製
 */
export function clone<T extends HTMLElement>(element: T, deep: boolean = true): T {
  return element.cloneNode(deep) as T;
}

/**
 * 要素を別の要素で置き換え
 */
export function replace(oldElement: HTMLElement, newElement: HTMLElement): void {
  oldElement.parentNode?.replaceChild(newElement, oldElement);
}

