/**
 * 要素の属性設定オプション
 */
export interface ElementOptions {
  id?: string;
  className?: string | string[];
  style?: Partial<CSSStyleDeclaration>;
  attributes?: Record<string, string>;
  dataset?: Record<string, string>;
}

/**
 * イベントリスナーオプション
 */
export interface EventListenerOptions {
  capture?: boolean;
  once?: boolean;
  passive?: boolean;
}

/**
 * 要素に属性を設定
 */
export function setAttributes(
  element: HTMLElement,
  attributes: Record<string, string>
): HTMLElement {
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  return element;
}

/**
 * 要素にスタイルを設定
 */
export function setStyles(
  element: HTMLElement,
  styles: Partial<CSSStyleDeclaration>
): HTMLElement {
  Object.assign(element.style, styles);
  return element;
}

/**
 * 要素にクラスを追加
 */
export function addClass(
  element: HTMLElement,
  classes: string | string[]
): HTMLElement {
  const classList = Array.isArray(classes) ? classes : [classes];
  element.classList.add(...classList);
  return element;
}

/**
 * 要素からクラスを削除
 */
export function removeClass(
  element: HTMLElement,
  classes: string | string[]
): HTMLElement {
  const classList = Array.isArray(classes) ? classes : [classes];
  element.classList.remove(...classList);
  return element;
}

/**
 * 要素にクラスをトグル
 */
export function toggleClass(
  element: HTMLElement,
  className: string,
  force?: boolean
): HTMLElement {
  element.classList.toggle(className, force);
  return element;
}

/**
 * イベントリスナーを追加（チェーン可能）
 */
export function on<K extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  event: K,
  handler: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
  options?: EventListenerOptions
): HTMLElement {
  element.addEventListener(
    event,
    handler as EventListener,
    options
  );
  return element;
}

/**
 * 一度限りのイベントリスナーを追加
 */
export function once<K extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  event: K,
  handler: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any
): HTMLElement {
  element.addEventListener(
    event,
    handler as EventListener,
    { once: true }
  );
  return element;
}

/**
 * イベントリスナーを削除
 */
export function off<K extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  event: K,
  handler: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any
): HTMLElement {
  element.removeEventListener(event, handler as EventListener);
  return element;
}

/**
 * 子要素を追加（複数対応）
 */
export function append(
  parent: HTMLElement,
  ...children: (HTMLElement | string)[]
): HTMLElement {
  children.forEach(child => {
    if (typeof child === 'string') {
      parent.appendChild(document.createTextNode(child));
    } else {
      parent.appendChild(child);
    }
  });
  return parent;
}

/**
 * 子要素を先頭に追加
 */
export function prepend(
  parent: HTMLElement,
  ...children: (HTMLElement | string)[]
): HTMLElement {
  children.reverse().forEach(child => {
    if (typeof child === 'string') {
      parent.insertAdjacentHTML('afterbegin', child);
    } else {
      parent.insertBefore(child, parent.firstChild);
    }
  });
  return parent;
}

/**
 * 要素の前に要素を挿入
 */
export function before(
  element: HTMLElement,
  ...nodes: (HTMLElement | string)[]
): HTMLElement {
  nodes.forEach(node => {
    if (typeof node === 'string') {
      element.insertAdjacentHTML('beforebegin', node);
    } else {
      element.parentNode?.insertBefore(node, element);
    }
  });
  return element;
}

/**
 * 要素の後ろに要素を挿入
 */
export function after(
  element: HTMLElement,
  ...nodes: (HTMLElement | string)[]
): HTMLElement {
  nodes.forEach(node => {
    if (typeof node === 'string') {
      element.insertAdjacentHTML('afterend', node);
    } else {
      element.parentNode?.insertBefore(node, element.nextSibling);
    }
  });
  return element;
}

/**
 * 要素を削除
 */
export function remove(element: HTMLElement): void {
  element.parentNode?.removeChild(element);
}

/**
 * 要素の内容をクリア
 */
export function clear(element: HTMLElement): HTMLElement {
  element.innerHTML = '';
  return element;
}

/**
 * ボタン生成ヘルパー
 */
export function createButton(
  text: string,
  onClick?: (event: MouseEvent) => void,
  options?: ElementOptions
): HTMLButtonElement {
  const button = document.createElement('button');
  button.textContent = text;

  if (onClick) {
    on(button, 'click', onClick as any);
  }

  applyOptions(button, options);
  return button;
}

/**
 * 入力フィールド生成ヘルパー
 */
export function createInput(
  type: string = 'text',
  options?: ElementOptions & { placeholder?: string; value?: string }
): HTMLInputElement {
  const input = document.createElement('input');
  input.type = type;

  if (options?.placeholder) {
    input.placeholder = options.placeholder;
  }

  if (options?.value) {
    input.value = options.value;
  }

  applyOptions(input, options);
  return input;
}

/**
 * テキストエリア生成ヘルパー
 */
export function createTextarea(
  options?: ElementOptions & { placeholder?: string; value?: string }
): HTMLTextAreaElement {
  const textarea = document.createElement('textarea');

  if (options?.placeholder) {
    textarea.placeholder = options.placeholder;
  }

  if (options?.value) {
    textarea.value = options.value;
  }

  applyOptions(textarea, options);
  return textarea;
}

/**
 * セレクト要素生成ヘルパー
 */
export function createSelect(
  options?: ElementOptions & {
    choices?: Array<{ value: string; label: string }>;
  }
): HTMLSelectElement {
  const select = document.createElement('select');

  if (options?.choices) {
    options.choices.forEach(choice => {
      const optionEl = document.createElement('option');
      optionEl.value = choice.value;
      optionEl.textContent = choice.label;
      select.appendChild(optionEl);
    });
  }

  applyOptions(select, options);
  return select;
}

/**
 * リンク生成ヘルパー
 */
export function createLink(
  text: string,
  href: string,
  options?: ElementOptions & { target?: string }
): HTMLAnchorElement {
  const link = document.createElement('a');
  link.textContent = text;
  link.href = href;

  if (options?.target) {
    link.target = options.target;
  }

  applyOptions(link, options);
  return link;
}

/**
 * テキスト要素生成ヘルパー
 */
export function createTextElement(
  tag: keyof HTMLElementTagNameMap,
  text: string,
  options?: ElementOptions
): HTMLElement {
  const element = document.createElement(tag);
  element.textContent = text;
  applyOptions(element, options);
  return element;
}

/**
 * 分割線要素生成
 */
export function createHr(options?: ElementOptions): HTMLHRElement {
  const hr = document.createElement('hr');
  applyOptions(hr, options);
  return hr;
}

/**
 * 改行要素生成
 */
export function createBr(options?: ElementOptions): HTMLBRElement {
  const br = document.createElement('br');
  applyOptions(br, options);
  return br;
}

/**
 * コンテナ要素生成
 */
export function createDiv(options?: ElementOptions): HTMLDivElement {
  const div = document.createElement('div');
  applyOptions(div, options);
  return div;
}

/**
 * スパン要素生成
 */
export function createSpan(
  text?: string,
  options?: ElementOptions
): HTMLSpanElement {
  const span = document.createElement('span');
  if (text) span.textContent = text;
  applyOptions(span, options);
  return span;
}

/**
 * リスト要素生成
 */
export function createList(
  items: string[],
  ordered: boolean = false,
  options?: ElementOptions
): HTMLUListElement | HTMLOListElement {
  const list = document.createElement(ordered ? 'ol' : 'ul');
  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    list.appendChild(li);
  });
  applyOptions(list, options);
  return list;
}

/**
 * オプションを要素に適用（内部ヘルパー）
 */
function applyOptions(
  element: HTMLElement,
  options?: ElementOptions
): void {
  if (!options) return;

  if (options.id) {
    element.id = options.id;
  }

  if (options.className) {
    const classes = Array.isArray(options.className)
      ? options.className
      : [options.className];
    element.classList.add(...classes);
  }

  if (options.style) {
    setStyles(element, options.style);
  }

  if (options.attributes) {
    setAttributes(element, options.attributes);
  }

  if (options.dataset) {
    Object.assign(element.dataset, options.dataset);
  }
}
