module.exports = {
    "extends": "google",
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
        }
    },
    "rules": {
        "require-jsdoc": "off",
        "max-len": ["error", {
            "ignorePattern": "^import .*",
            "ignoreComments": true,
            "ignoreStrings": true,
        }],
        "object-curly-spacing": "off",
        "switch-colon-spacing": "off",
    }
};