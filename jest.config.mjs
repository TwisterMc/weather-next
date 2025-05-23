import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
    dir: './',
});

const customJestConfig = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    testEnvironment: 'jsdom',
    testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/', '<rootDir>/coverage/', '<rootDir>/dist/'],
    collectCoverage: true,
    collectCoverageFrom: [
        './src/**/*.{js,jsx,ts,tsx}',
        '!./src/**/_*.{js,jsx,ts,tsx}',
        '!./src/**/*.stories.{js,jsx,ts,tsx}',
        '!**/*.d.ts',
        '!**/node_modules/**',
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
    coverageReporters: ['text', 'lcov', 'json', 'html'],
    verbose: true,
    testTimeout: 30000,
    moduleDirectories: ['node_modules', '<rootDir>/'],
};

export default createJestConfig(customJestConfig);
