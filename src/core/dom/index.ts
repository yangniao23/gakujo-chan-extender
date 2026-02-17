/**
 * DOM操作ユーティリティの統一エクスポート
 */

// 要素生成と基本操作
export {
  type ElementOptions,
  type EventListenerOptions,
  setAttributes,
  setStyles,
  addClass,
  removeClass,
  toggleClass,
  on,
  once,
  off,
  append,
  prepend,
  before,
  after,
  remove,
  clear,
  createButton,
  createInput,
  createTextarea,
  createSelect,
  createLink,
  createTextElement,
  createHr,
  createBr,
  createDiv,
  createSpan,
  createList,
} from './element-factory';

// DOM選択・クエリ
export {
  getElementById,
  getElementsByClassName,
  getElementsByTagName,
  querySelector,
  querySelectorAll,
  closest,
  matches,
  nextElementSibling,
  previousElementSibling,
  findChild,
  findChildren,
  isInDOM,
  isVisible,
  isDisabled,
  containsText,
  getParentPath,
  getPathSelector,
} from './element-query';

// 高度なDOM操作
export {
  getValue,
  setValue,
  isChecked,
  setChecked,
  disable,
  enable,
  getFormData,
  setFormData,
  resetForm,
  delegate,
  isInViewport,
  scrollIntoView,
  getPosition,
  getSize,
  getScroll,
  scroll,
  observeDOM,
  applyToAll,
  applyToFirst,
  clone,
  replace,
} from './element-advanced';

// 要素待機
export { waitForElement } from './element-waiter';

// iframe操作
export { getIframeDocument } from './iframe-accessor';
// 新しい iframe 操作ヘルパー
export {
  getFrameDocument,
  getTableInFrame,
  getElementByIdInFrame,
  querySelectorInFrame,
  querySelectorAllInFrame,
} from './iframe-helper';

// テーブル操作ヘルパー
export {
  reorderTableRows,
  extractColumns,
  extractColumnText,
} from './table-helper';

// ポーリング/待機ユーティリティ
export {
  pollUntil,
  waitForElementInFrame,
  startPolling,
} from './polling';
