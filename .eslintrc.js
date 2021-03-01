/* eslint-disable indent */
module.exports = {
extends: 'standard',
overrides: [
    {
files: [
        '**/*.test.js'
],
env: {
        jest: true // now **/*.test.js files' env has both es6 *and* jest
},
plugins: ['jest'],
rules: {
'jest/no-disabled-tests': 'warn',
'jest/no-focused-tests': 'error',
'jest/no-identical-title': 'error',
        'jest/prefer-to-have-length': 'warn',
        'jest/valid-expect': 'error'
}
    }
]
}
