// ESLint setup for WhatWatch - development only, not packed into the extension
//   yarn install   (or: npm install)
//   yarn lint      (or: npx eslint .)
import js from '@eslint/js';
import globals from 'globals';

export default [
    {
        ignores: ['node_modules/'],
    },
    js.configs.recommended,
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.es2021,
                // Provided by GJS / GNOME Shell
                global: 'readonly',
                console: 'readonly',
                log: 'readonly',
                logError: 'readonly',
                print: 'readonly',
                printerr: 'readonly',
                imports: 'readonly',
                ARGV: 'readonly',
                TextEncoder: 'readonly',
                TextDecoder: 'readonly',
            },
        },
        rules: {
            // Signal handlers and callbacks often receive arguments they do not need
            'no-unused-vars': ['error', {args: 'none'}],
        },
    },
];
