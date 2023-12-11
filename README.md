# Code Prompt Assist

Welcome to **Code Prompt Assist**, the indispensable Visual Studio Code extension that revolutionizes your coding workflow while prioritizing data privacy. 

Code Prompt Assist is unique in its commitment to data privacy with its advanced text redaction feature, making it a pioneer in secure, AI-assisted coding tools.

In today's world, where AI-driven development tools are gaining traction, many organizations remain cautious about using such technologies due to the risk of exposing sensitive information. 


Code Prompt Assist is your solution. It features a unique and powerful text redaction tool, ensuring that **confidential data never leaves your workspace**. 

Whether you're an experienced developer or a newcomer, leverage Code Prompt Assist to efficiently generate code solutions, unit tests, and code optimizations, all while safeguarding your company's proprietary information.

## Features

### 1. Effortless Code Solutions

**Save Time and Simplify Your Workflow:** Code Prompt Assist streamlines your coding process by generating code solutions automatically. Just input your file paths and ticket information, and watch as Code Prompt Assist efficiently crafts solutions tailored to your project’s specific needs.

### 2. Automated Unit Test Generation

**Enhance Code Reliability and Reduce Errors:** Trust Code Prompt Assist to fortify your code's robustness. With our automated unit test generation feature, your code undergoes a thorough analysis, leading to the creation of comprehensive unit tests. This pivotal feature assists in identifying bugs early and elevating your code quality.

### 3. Intelligent Code Optimizations

**Optimize Performance with Smart Insights:** Code Prompt Assist isn’t just about writing code; it’s about writing better code. By offering suggestions for code optimizations, this tool provides invaluable insights into performance enhancements and best coding practices, all uniquely adapted to your existing codebase.


<!---

## What Our Users Say

We are proud of the positive impact Code Prompt Assist has had on our users. Here's what some of them have to say:

### Testimonial 1

"Code Prompt Assist has been a game-changer for our development team. The automated unit test generation saved us countless hours, and the code optimization suggestions have noticeably improved our project's performance. Highly recommend it for any serious development team!" - **Alex Mercer, Senior Developer at DevTech Inc.**

### Testimonial 2

"As a junior developer, I often struggle with complex coding requirements. Code Prompt Assist has made my learning curve much smoother. Its intuitive interface and powerful features like code solution generation are incredibly helpful." - **Samantha Lee, Junior Software Engineer**

### Testimonial 3

"The redaction tool in Code Prompt Assist is a standout feature for us. Working with sensitive data, we can now use AI tools without the risk of data exposure. It's efficient and, more importantly, secure." - **Rahul Gupta, Lead Data Scientist, SecureData Corp.**

-->

## Visual Showcase: See Code Prompt Assist in Action

Explore how Code Prompt Assist transforms your coding experience with our carefully curated visuals. Each image and animation is designed to give you a glimpse of the power and simplicity of our tool.

1. Code Solution Generation: Code Solution Generation
2. Unit Test Creation: Unit Test Creation
3. Code Optimization Suggestions: Code Optimization

Tip: Witness Code Prompt Assist's capabilities through these short, focused animations, demonstrating its ease of use and powerful features.
Requirements

### Feature 1: Effortless Code Solutions
![Effortless Code Solutions](https://raw.githubusercontent.com/nickolastheodoulou/code-assist-public/main/public/ExtensionGuide.gif)
_Crafting precise code solutions with ease - see how Code Prompt Assist automates and simplifies complex tasks._

### Feature 2: Redacted Unit Test Generation
![Redact Prompt And Generate Unit Tests](https://raw.githubusercontent.com/nickolastheodoulou/code-assist-public/main/public/UnitTests.png)
_Reliability at its best - our extension automatically generates comprehensive readacted promps for unit tests._

### Feature 3: Redacted Code Optimisation
![Automated Unit Test Generation](https://raw.githubusercontent.com/nickolastheodoulou/code-assist-public/main/public/CodeOptimisations.png)
_Reliability at its best - our extension automatically generates comprehensive readacted promps for code optimisation._

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

1. **Open Your Workspace Settings**: Go to your project workspace in VSCode. Press `Ctrl ,` , (or `Cmd ,` , on macOS) to open Settings.
2. **Edit settings.json**: Click on the {} icon in the top right corner to open the `settings.json` file.
3. **Add Redaction Rules**: Add the `codeAssist.redactionRules` configuration with the desired rules as shown in the example above.
4. **Save the Changes**: Save your `settings.json` file. The extension will now use these rules to redact strings in the generated code.

### Understanding the Configuration:

- Each rule in the `redactionRules` array consists of two properties:
    - **original**: The string you want to redact.
    - **replacement** (optional): The string to replace the `original` string. If omitted, the extension automatically uses a placeholder in the format `redactedN`.
- The replacement is applied to all occurrences of the `original` string in the generated code.
- The `redactedN` pattern ensures that each unique redacted string has a distinct placeholder, with `N` incrementing for each new original string without a specified replacement.


## Installation Guide

1. **Open Visual Studio Code**: Launch your VS Code application.

2. **Access Extensions**: Click on the Extensions icon in the sidebar or press `Ctrl+Shift+X` (`Cmd+Shift+X` on macOS).

3. **Search for Code Prompt Assist**: Type "Code Prompt Assist" in the Extensions search bar.

4. **Install the Extension**: Find Code Prompt Assist in the search results and click the 'Install' button.

5. **Verify Installation**: Once installed, you will see 'Code Prompt Assist' listed in your installed extensions.

![Redact Prompt And Generate Unit Tests](https://raw.githubusercontent.com/nickolastheodoulou/code-assist-public/main/public/GenerateCodeSolution.png)
_Screenshot of the Extensions view in VS Code, highlighting the search and install steps._



## Known Issues

Currently no known issues found


## Frequently Asked Questions (FAQs)

- **Q: Is Code Prompt Assist compatible with all versions of Visual Studio Code?**
  - A: Code Prompt Assist is compatible with Visual Studio Code version 1.XX and above. We continually update our extension to ensure compatibility with the latest versions.

- **Q: What are the future plans for Code Prompt Assist?**
  - A: We are constantly working to improve Code Prompt Assist. Upcoming features include support for additional programming languages and enhanced AI-driven code recommendations. Stay tuned for updates!

- **Q: How does Code Prompt Assist compare to similar extensions?**
  - A: Code Prompt Assist stands out with its unique text redaction feature, which ensures data privacy, and its focus on optimizing both code generation and unit test creation for JavaScript and TypeScript.

## Upcoming Features and Roadmap

We are dedicated to making Code Prompt Assist even better. Here's what's on the horizon:

- **Support for More Languages**: Expanding beyond JavaScript and TypeScript to include Python, C#, and more.
- **Advanced AI Features**: Implementing more sophisticated AI algorithms for smarter code suggestions.
- **Enhanced User Experience**: Continuously refining the interface for an even smoother coding experience.

## License

- Refer to LICENSE.txt

<!--


## Community and Support

Join our vibrant community forum where you can share ideas, ask questions, and get help from both the developers and other users. Visit [Code Prompt Assist Forum](forum_link_here) to get involved. For direct support, reach out to us via [Support Email](support_email_here).
-->
## Contact Information

For support or inquiries, please email us at <nickolastheodoulou@hotmail.com>.

Enjoy coding with ease using Code Prompt Assist!
