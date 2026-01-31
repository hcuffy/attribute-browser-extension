import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        ignores: ['dist/**', 'node_modules/**']
    },
    {
        files: ['**/*.{ts,tsx}'],
        plugins: {
            '@stylistic': stylistic,
            'react':      reactPlugin,
            'react-hooks': reactHooksPlugin
        },
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            }
        },
        settings: {
            react: {
                version: 'detect'
            }
        },
        rules: {
            '@stylistic/type-annotation-spacing':              ['error', { before: false, after: false }],
            '@typescript-eslint/array-type':                   'error',
            '@typescript-eslint/consistent-type-definitions':  ['error', 'interface'],
            '@typescript-eslint/prefer-nullish-coalescing':    'off',
            '@typescript-eslint/no-unused-vars':               ['error', {
                vars:              'all',
                args:              'after-used',
                ignoreRestSiblings: true
            }],

            'array-bracket-spacing':               'error',
            'comma-dangle':                        'error',
            'comma-spacing':                       'error',
            'comma-style':                         'error',
            'no-extra-semi':                       'error',
            curly:                                 'error',
            indent:                                ['error', 4],
            'key-spacing':                         ['error', {
                align:       'colon',
                beforeColon: false,
                afterColon:  true
            }],
            'max-len':                             ['error', {
                code:                  150,
                tabWidth:              2,
                ignoreUrls:            true,
                ignoreStrings:         false,
                ignoreTemplateLiterals: false,
                ignoreComments:        true
            }],
            'no-confusing-arrow':                  'error',
            'no-duplicate-imports':                'error',
            'no-useless-rename':                   'error',
            'no-nested-ternary':                   'error',
            'no-trailing-spaces':                  'error',
            'no-unneeded-ternary':                 'error',
            'nonblock-statement-body-position':    'error',
            'no-extra-parens':                     'off',
            'no-template-curly-in-string':         'error',
            'no-fallthrough':                      'error',
            'no-lone-blocks':                      'error',
            'no-loop-func':                        'error',
            'no-multiple-empty-lines':             ['error', { max: 1, maxEOF: 0 }],
            'no-multi-spaces':                     ['error', {
                exceptions: {
                    Property: true
                }
            }],
            'no-unused-vars':                      'off',
            'no-var':                              'error',
            'padding-line-between-statements':     [
                'error',
                { blankLine: 'always', prev: '*', next: 'expression' },
                { blankLine: 'any', prev: 'expression', next: 'expression' },
                { blankLine: 'always', prev: '*', next: 'function' },
                { blankLine: 'always', prev: 'function', next: '*' }
            ],
            'prefer-const':                        'error',
            'quote-props':                         ['error', 'as-needed'],
            quotes:                                ['error', 'single'],
            'require-await':                       'error',
            semi:                                  ['error', 'always'],
            'semi-spacing':                        'error',
            'semi-style':                          'error',
            'spaced-comment':                      ['error', 'always', { block: { balanced: true } }],
            'object-curly-newline':                ['error', {
                ImportDeclaration: {
                    multiline:     true,
                    minProperties: 5
                }
            }],
            'react-hooks/rules-of-hooks':          'error',
            'react-hooks/exhaustive-deps':         'warn',
            'prefer-arrow-callback':               'off',
            'arrow-body-style':                    'off'
        }
    }
);
