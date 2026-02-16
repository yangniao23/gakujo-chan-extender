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

        document.addEventListener('click', async (event) => {
            const target = event.target as HTMLElement;
            const anchor = target.closest('a');

            if (!anchor) return;

            const href = anchor.getAttribute('href');
            if (!href || href === '#' || href.startsWith('javascript:')) return;

            // 学情のダウンロードリンクやPDFらしきパスを検知
            const isDownloadLink = href.includes('download') || 
                                 href.includes('file') || 
                                 href.toLowerCase().endsWith('.pdf');

            if (isDownloadLink) {
                // デフォルトの挙動（ダウンロードやページ遷移）を停止
                event.preventDefault();
                event.stopPropagation();

                // リンクテキストをファイル名として取得
                const filename = anchor.innerText.trim() || 'document';
                
                // 絶対URLを取得し、末尾にダミーのファイル名を付与
                // 例: .../campussquare.do?id=123&/ファイル名.pdf
                // 多くのサーバーはクエリ内の &/... 以降を無視するが、ブラウザはこれをファイル名として認識する
                const urlObj = new URL(href, window.location.href);
                urlObj.searchParams.append('', `/${filename}.pdf`);
                const openUrl = urlObj.href;

                console.log(`[IframePdfHandler] Preparing to open ${filename}...`);

                try {
                    // 背景スクリプトに準備を依頼（URLはダミー付与後のものを使用）
                    await browser.runtime.sendMessage({
                        type: 'PREPARE_PDF',
                        url: openUrl,
                        filename: filename
                    });
                    
                    // 準備ができたら新しいタブで開く
                    window.open(openUrl, '_blank');
                    console.log(`[IframePdfHandler] Opening ${filename} in new tab`);
                } catch (error) {
                    console.error('[IframePdfHandler] Failed to prepare PDF:', error);
                    window.open(openUrl, '_blank');
                }
            }
        }, true);
    },
});
