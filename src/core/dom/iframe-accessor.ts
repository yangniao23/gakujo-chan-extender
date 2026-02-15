/**
 * iframe内のDocumentを安全に取得
 */
export function getIframeDocument(iframeId: string): Document {
  const iframe = document.getElementById(iframeId) as HTMLIFrameElement;
  
  if (!iframe) {
    throw new Error(`Iframe with id "${iframeId}" not found`);
  }

  const doc = iframe.contentWindow?.document;
  
  if (!doc) {
    throw new Error(`Cannot access document of iframe "${iframeId}"`);
  }

  return doc;
}

/**
 * iframe内の要素を取得
 */
export function getIframeElement(
  iframeId: string,
  selector: string
): Element | null {
  try {
    const doc = getIframeDocument(iframeId);
    return doc.querySelector(selector);
  } catch {
    return null;
  }
}

/**
 * iframe内の複数要素を取得
 */
export function getIframeElements(
  iframeId: string,
  selector: string
): Element[] {
  try {
    const doc = getIframeDocument(iframeId);
    return Array.from(doc.querySelectorAll(selector));
  } catch {
    return [];
  }
}
