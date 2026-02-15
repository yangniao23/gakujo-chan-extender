/**
 * 要素が出現するまで待機するユーティリティ
 */
export async function waitForElement(
  selector: string,
  doc: Document = document,
  timeout: number = 10000,
  interval: number = 100
): Promise<Element> {
  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    const timer = setInterval(() => {
      const element = doc.querySelector(selector);
      
      if (element) {
        clearInterval(timer);
        resolve(element);
        return;
      }

      if (Date.now() - startTime > timeout) {
        clearInterval(timer);
        reject(new Error(`Element "${selector}" not found within ${timeout}ms`));
      }
    }, interval);
  });
}

/**
 * 複数要素のいずれかが出現するまで待機
 */
export async function waitForAnyElement(
  selectors: string[],
  doc: Document = document,
  timeout: number = 10000
): Promise<{ element: Element; selector: string }> {
  const promises = selectors.map(selector =>
    waitForElement(selector, doc, timeout).then(element => ({ element, selector }))
  );

  return Promise.race(promises);
}
