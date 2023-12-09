# Code Prompt Assist README

Welcome to **Code Prompt Assist**, a powerful Visual Studio Code extension designed to streamline your coding workflow. Whether you're a seasoned developer or just starting out, Code Prompt Assist offers intuitive tools to generate code solutions, unit tests, and code optimizations efficiently, saving you time and enhancing your coding experience.

## Features

1. Generate Code Solution: With Code Prompt Assist, you can automatically generate code solutions based on your project's specific requirements. Simply input your file paths and ticket information, and let Code Prompt Assist do the rest.

2. Generate Unit Tests: Ensure your code's reliability with our automated unit test generation feature. This tool analyzes your code and creates comprehensive unit tests, helping you catch bugs and improve code quality.

3. Generate Code Optimizations: Code Prompt Assist not only writes code but also suggests optimizations. It provides insights into performance improvements and best coding practices tailored to your codebase.

## Screenshots and Animations

Here is a screenshot to give you a glimpse of Code Prompt Assist in action:

![How to find](/readme/readme.png)

1. Code Solution Generation: Code Solution Generation
2. Unit Test Creation: Unit Test Creation
3. Code Optimization Suggestions: Code Optimization

Tip: Witness Code Prompt Assist's capabilities through these short, focused animations, demonstrating its ease of use and powerful features.
Requirements

## Before installing Code Prompt Assist, ensure you have the following

- Visual Studio Code (version 1.XX or higher)

## This extension contributes to the following settings

This extension contributes the following settings which can be added to your `.vscode/settings.json` file:

- `codeAssist.redactionRules`: This setting allows you to specify a list of rules for redacting strings in the generated code. Each rule consists of an `original` string and an optional `replacement` string. If the `replacement` string is not provided, the extension will automatically use a default format: `redactedN`, where `N` is a unique number for each redacted string.

### Example Configuration

```json
{
    "codeAssist.redactionRules": [
        {
            "original": "apiKey",
            "replacement": "confidentialKey"
        },
        {
            "original": "username"
            // No replacement is provided for "username",
            // so it will be replaced with "redacted1", "redacted2", etc., 
            // based on its occurrence.
        },
        {
            "original": "password",
            // Again, no replacement provided. This will follow the redactedN pattern.
        }
    ]
}
```

### How To Configure

1. **Open Your Workspace Settings**: Go to your project workspace in VSCode. Press `Ctrl +` , (or `Cmd +` , on macOS) to open Settings.
2. **Edit settings.json**: Click on the {} icon in the top right corner to open the `settings.json` file.
3. **Add Redaction Rules**: Add the `codeAssist.redactionRules` configuration with the desired rules as shown in the example above.
4. **Save the Changes**: Save your `settings.json` file. The extension will now use these rules to redact strings in the generated code.

### Understanding the Configuration:

- Each rule in the `redactionRules` array consists of two properties:
    - **original**: The string you want to redact.
    - **replacement** (optional): The string to replace the `original` string. If omitted, the extension automatically uses a placeholder in the format `redactedN`.
- The replacement is applied to all occurrences of the `original` string in the generated code.
- The `redactedN` pattern ensures that each unique redacted string has a distinct placeholder, with `N` incrementing for each new original string without a specified replacement.


## To install Code Prompt Assist, follow these steps

1. Open Visual Studio Code.
2. Navigate to the Extensions view by clicking on the square icon on the sidebar.
3. Search for "Code Prompt Assist" and click install.
4. Once installed, refer to the screenshot to see how to use the plugin

## Known Issues

Currently no known issues found

## Release Notes

- 1.0.0
    - Initial release with code solution generation, unit test creation, and code optimization features.
    - Settings available to redact strings from the prompt settings
- 1.0.1
    - Fix broken changes
- 1.0.2
    - Implement CI for deployment of extension
- 1.0.3
    - Ensure ReadMe and package.json versioning updated as part of CI pipeline

## Frequently Asked Questions (FAQs)

- Q: Does Code Prompt Assist support all programming languages?
- A: Currently, Code Prompt Assist focuses on JavaScript and TypeScript. It can support other languages but there are plans to expand to other languages in future updates.

---

- Q: Can I customize the code generation templates?
- A: Yes, Code Prompt Assist allows you to modify the templates used for code generation. Visit the settings to customize them.

## License

- Refer to LICENSE.txt

## Contact Information

For support or inquiries, please email us at <nickolastheodoulou@hotmail.com>.

Enjoy coding with ease using Code Prompt Assist!
