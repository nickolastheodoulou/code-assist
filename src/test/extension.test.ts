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

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("Extension Activation", async () => {
    const mockContext = createMockExtensionContext();
    await activate(mockContext);
    const commands = await vscode.commands.getCommands(true);
    assert.ok(commands.includes("code-prompt-assist.openForm"));
    assert.ok(commands.includes("code-prompt-assist.openSettings"));
  });

  test("Tree View Provider", async () => {
    const treeView = vscode.window.createTreeView("codeAssistTreeView", {
      treeDataProvider: new CodeAssistTreeProvider(),
    });
    assert.ok(treeView);
  });

  test("Open Form Command", async () => {
    await vscode.commands.executeCommand(
      "code-prompt-assist.openForm",
      "somePromptType"
    );
    // Additional verification for form opening can be added here
  });

  test("Open Settings Command", async () => {
    await vscode.commands.executeCommand("code-prompt-assist.openSettings");
    // Additional verification for settings opening can be added here
  });

  test("Extension Deactivation", async () => {
    deactivate();
    // Additional verification for deactivation can be added here
  });
});
