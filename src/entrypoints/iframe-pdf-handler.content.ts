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
            // campusweb/action/download... やファイル名に .pdf が含まれる場合
            const isDownloadLink = href.includes('download') || 
                                 href.includes('file') || 
                                 href.toLowerCase().endsWith('.pdf');

            if (isDownloadLink) {
                // 新しいタブで開くように属性を変更
                anchor.target = '_blank';
                // もし onclick などで JavaScript が動いている場合でも、
                // target="_blank" があればブラウザが優先してくれることが多い
                console.log('[IframePdfHandler] Opening link in new tab:', href);
            }
        }, true);
    },
});
