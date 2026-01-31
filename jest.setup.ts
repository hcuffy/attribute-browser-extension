import '@testing-library/jest-dom';

const mockChrome = {
    runtime: {
        onMessage: {
            addListener   : jest.fn(),
            removeListener: jest.fn()
        },
        onInstalled: {
            addListener: jest.fn()
        },
        sendMessage: jest.fn(),
        lastError  : undefined as chrome.runtime.LastError | undefined,
        getManifest: jest.fn(() => ({ version: '1.0.0' }))
    },
    tabs: {
        query      : jest.fn(),
        sendMessage: jest.fn()
    },
    storage: {
        local: {
            get: jest.fn(),
            set: jest.fn()
        },
        sync: {
            get: jest.fn(),
            set: jest.fn()
        }
    }
};

global.chrome = mockChrome as unknown as typeof chrome;

beforeEach(() => {
    jest.clearAllMocks();
});
