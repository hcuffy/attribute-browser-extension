export default {
    preset              : 'ts-jest',
    testEnvironment     : 'jsdom',
    roots               : ['<rootDir>/src'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    testMatch           : ['**/*.test.ts', '**/*.test.tsx'],
    setupFilesAfterEnv  : ['<rootDir>/jest.setup.ts'],
    moduleNameMapper    : {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
    },
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: 'tsconfig.json',
            useESM  : false
        }]
    }
};
