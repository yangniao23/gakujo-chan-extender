/**
 * Vitest セットアップファイル
 */

// グローバルなモックやヘルパーをここで定義

// ブラウザAPIのモック
interface MockChrome {
    runtime: {
        getManifest: () => { version: string };
        sendMessage: () => Promise<void>;
        onMessage: {
            addListener: () => void;
        };
    };
    storage: {
        local: {
            get: () => Promise<Record<string, unknown>>;
            set: () => Promise<void>;
        };
    };
}

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
} as unknown as MockChrome;

global.browser = global.chrome;
