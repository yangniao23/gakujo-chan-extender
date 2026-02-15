/**
 * Vitest セットアップファイル
 */

// グローバルなモックやヘルパーをここで定義

// ブラウザAPIのモック
global.chrome = {
    runtime: {
        getManifest: () => ({ version: '0.64.0' }),
        sendMessage: () => Promise.resolve(),
        onMessage: {
            addListener: () => { },
        },
    },
    storage: {
        local: {
            get: () => Promise.resolve({}),
            set: () => Promise.resolve(),
        },
    },
} as any;

global.browser = global.chrome;
