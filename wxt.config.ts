import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
    srcDir: 'src',
    outDir: '.output',

    manifest: {
        name: 'More-Better-Gakujo',
        version: '0.64.0',
        description: '学情の不便を多少解消するかもしれない新大生用拡張機能',
        permissions: ['storage', 'declarativeNetRequest', 'tabs', 'scripting'],
        host_permissions: ['https://gakujo.iess.niigata-u.ac.jp/*'],
        icons: {
            48: '/icon48.png',
            128: '/icon128.png',
        },
        browser_specific_settings: {
            gecko: {
                id: 'gakujo-chan-extender@ksmt.jp',
            },
        },
    },
});
