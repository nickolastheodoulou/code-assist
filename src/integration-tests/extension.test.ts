import * as vscode from "vscode";
import * as assert from "assert";
import { CodeAssistTreeProvider } from "../views/treeView/treeView";
import { activate, deactivate } from "../extension";

function createMockExtensionContext(): vscode.ExtensionContext {
  return {
    subscriptions: [],
    extensionUri: vscode.Uri.file(__dirname),
    storageUri: vscode.Uri.file(__dirname),
    globalStorageUri: vscode.Uri.file(__dirname),
    logUri: vscode.Uri.file(__dirname),
    extensionPath: __dirname,
    asAbsolutePath: (relativePath: string) => relativePath,
    storagePath: __dirname,
    globalStoragePath: __dirname,
    logPath: __dirname,
    workspaceState: {
      get: () => {},
      // @ts-ignore
      update: () => {},
    },
    globalState: {
      get: () => {},
      // @ts-ignore
      update: () => {},
    },
    secrets: {
      // @ts-ignore
      get: () => {},
      // @ts-ignore
      store: () => {},
    },
    environmentVariableCollection: {
      replace: () => {},
      append: () => {},
      prepend: () => {},
      // @ts-ignore
      get: () => {},
      forEach: () => {},
      delete: () => {},
    },
    // Add other necessary properties and methods here
  };
}

describe("Extension Test Suite", () => {
  // Setup before each test
  before(async () => {
    // const mockContext = createMockExtensionContext();
    // await activate(mockContext);
  });

  after(() => {
    deactivate();
  });

  vscode.window.showInformationMessage("Start all tests.");

  it("Extension Activation", async () => {
    const commands = await vscode.commands.getCommands(true);
    assert.ok(commands.includes("code-prompt-assist.openForm"));
    assert.ok(commands.includes("code-prompt-assist.openSettings"));
  });

  it("Tree View Provider", async () => {
    const treeView = vscode.window.createTreeView("codeAssistTreeView", {
      treeDataProvider: new CodeAssistTreeProvider(),
    });
    assert.ok(treeView);
  });

  it("Open Form Command", async () => {
    await vscode.commands.executeCommand(
      "code-prompt-assist.openForm",
      "somePromptType"
    );
    // Additional verification for form opening can be added here
  });

  it("Open Settings Command", async () => {
    await vscode.commands.executeCommand("code-prompt-assist.openSettings");
    // Additional verification for settings opening can be added here
  });

  it.only("Add Rule to Settings and Verify", async () => {
    deactivate();
    // Open the settings view
    const webViewPanel = (await vscode.commands.executeCommand(
      "code-prompt-assist.openSettings"
    )) as vscode.WebviewPanel;

    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
    console.log("webViewPanel after delay:", webViewPanel);

    // Simulate user input for 'originalText' and 'replacementText'
    const originalText = "exampleOriginal";
    const replacementText = "exampleReplacement";

    webViewPanel.webview.postMessage({
      command: "setInputValues",
      inputs: {
        originalText: originalText,
        replacementText: replacementText,
      },
    });
    //
    // // Simulate button click to add the rule
    // webViewPanel.webview.postMessage({
    //   command: "clickButton",
    //   selector: "#addRule",
    // });
    //
    // // Delay to ensure DOM updates
    // await new Promise((resolve) => setTimeout(resolve, 1000)); // Adjust timing as needed
    //
    // // Retrieve the updated rules list
    // let rules: any[] = [];
    // webViewPanel.webview.onDidReceiveMessage((message) => {
    //   if (message.command === "getRulesList") {
    //     rules = message.data;
    //   }
    // });
    // webViewPanel.webview.postMessage({ command: "requestRulesList" });
    //
    // // Verify rule addition
    // assert.ok(
    //   rules.some(
    //     (rule) =>
    //       rule.original === originalText && rule.replacement === replacementText
    //   ),
    //   "New rule not found in rules list after addition"
    // );
  });

  it("Extension Deactivation", async () => {
    deactivate();
    // Additional verification for deactivation can be added here
  });
});
