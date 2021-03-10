// eslint-disable-next-line no-undef
module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:prettier/recommended", "prettier"],
    rules: {
        "@typescript-eslint/consistent-type-assertions": [
            "warn",
            {
                assertionStyle: "as",
                objectLiteralTypeAssertions: "allow-as-parameter",
            },
        ],
    },
    overrides: [
        // Override some TypeScript rules just for .js files
        {
            files: ["*.js"],
            rules: {
                "@typescript-eslint/no-var-requires": "off", //
            },
        },
    ],
};
