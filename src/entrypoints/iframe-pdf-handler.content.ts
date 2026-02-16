/**
 * iframe内でのPDF/ドキュメントリンク制御
 * iframe内のリンクがクリックされた際、新しいタブで開くように調整する
 */

export default defineContentScript({
    matches: ['https://gakujo.iess.niigata-u.ac.jp/campusweb/*'],
    allFrames: true, // 全てのiframe内で実行
    main() {
        // メインフレーム（最上位）では実行しない
        if (window.self === window.top) return;

        document.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            const anchor = target.closest('a');

            if (!anchor) return;

            const href = anchor.getAttribute('href');
            if (!href) return;

            // 学情のダウンロードリンクやPDFらしきパスを検知
            const isDownloadLink = href.includes('download') || 
                                 href.includes('file') || 
                                 href.toLowerCase().endsWith('.pdf');

            if (isDownloadLink) {
                // 絶対URLを取得（ルールマッチングのため）
                const absoluteUrl = new URL(href, window.location.href).href;
                
                // リンクテキストをファイル名として取得（前後の空白を削除）
                const filename = anchor.innerText.trim();

                if (filename) {
                    // 背景スクリプトにファイル名の準備を依頼
                    browser.runtime.sendMessage({
                        type: 'PREPARE_PDF',
                        url: absoluteUrl,
                        filename: filename
                    });
                }

                // 新しいタブで開くように属性を変更
                anchor.target = '_blank';
                console.log(`[IframePdfHandler] Preparing to open ${filename} in new tab`);
            }
        }, true);
    },
});
