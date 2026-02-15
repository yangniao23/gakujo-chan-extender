/**
 * iframe内の要素にアクセスするヘルパー関数
 */

import { MAIN_IFRAME_ID } from '@/core/constants';

/**
 * メインフレームのdocumentを取得
 * @returns iframe内のDocument、または見つからない場合はnull
 */
export function getFrameDocument(): Document | null {
    const iframe = document.getElementById(MAIN_IFRAME_ID) as HTMLIFrameElement;
    if (!iframe?.contentWindow) {
        return null;
    }
    return iframe.contentWindow.document;
}

/**
 * iframe内のテーブル要素を取得
 * @param selector テーブルのCSSセレクタ
 * @returns HTMLTableElement、または見つからない場合はnull
 */
export function getTableInFrame(selector: string): HTMLTableElement | null {
    const doc = getFrameDocument();
    if (!doc) {
        return null;
    }
    return doc.querySelector(selector) as HTMLTableElement | null;
}

/**
 * iframe内の単一要素を取得
 * @param id 要素のID
 * @returns HTMLElement、または見つからない場合はnull
 */
export function getElementByIdInFrame(id: string): HTMLElement | null {
    const doc = getFrameDocument();
    if (!doc) {
        return null;
    }
    return doc.getElementById(id);
}

/**
 * iframe内の要素をセレクタで検索
 * @param selector CSSセレクタ
 * @returns HTMLElement、または見つからない場合はnull
 */
export function querySelectorInFrame(selector: string): HTMLElement | null {
    const doc = getFrameDocument();
    if (!doc) {
        return null;
    }
    return doc.querySelector(selector) as HTMLElement | null;
}

/**
 * iframe内の複数要素をセレクタで検索
 * @param selector CSSセレクタ
 * @returns NodeListOf<Element>
 */
export function querySelectorAllInFrame(selector: string): NodeListOf<Element> {
    const doc = getFrameDocument();
    if (!doc) {
        return document.querySelectorAll(':not(*)'); // 空のNodeList
    }
    return doc.querySelectorAll(selector);
}
