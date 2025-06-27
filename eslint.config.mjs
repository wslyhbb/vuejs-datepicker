// http://eslint.org/docs/user-guide/configuring

import pluginVue from 'eslint-plugin-vue';
import js from '@eslint/js';
import globals from 'globals';

export default [
    {
        ignores: [
            'dist/**/*',
            'test/unit/coverage/**/*'
        ]
    },
    ...pluginVue.configs['flat/essential'],
    {
        files: [
            'src/**/*.js',
            'src/**/*.vue',
            'src/**/*.ts'
        ],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node
            }
        },
        rules: {
            ...js.configs.recommended.rules,
            'arrow-parens': 0,
            'generator-star-spacing': 0,
            'no-debugger': 0
        }
    },
    {
        files: [
            'test/unit/specs/**/*spec.js',
        ],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.vitest
            }
        },
        rules: {
            ...js.configs.recommended.rules
        }
    }
];
