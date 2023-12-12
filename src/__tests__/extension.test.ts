import * as vscode from "vscode";
import { activate, deactivate } from "../extension";
import { openForm } from "../views/webView/webviewManager";

jest.mock("vscode", () => ({
  commands: {
    registerCommand: jest.fn(),
  },
  window: {
    createTreeView: jest.fn(),
  },
}));

jest.mock("../views/treeView/treeView", () => ({
  CodeAssistTreeProvider: jest.fn().mockImplementation(() => ({})),
}));

jest.mock("../views/webView/webviewManager", () => ({
  openForm: jest.fn().mockImplementation(() => ({
    onDidDispose: jest.fn(),
    reveal: jest.fn(),
  })),
}));

describe("Extension", () => {
  let mockContext: vscode.ExtensionContext;

  beforeEach(() => {
    mockContext = { subscriptions: [] } as unknown as vscode.ExtensionContext;
    (openForm as jest.Mock).mockClear();
  });

  it("activates correctly", () => {
    activate(mockContext as unknown as vscode.ExtensionContext);

    expect(vscode.window.createTreeView).toHaveBeenCalledWith(
      "codeAssistTreeView",
      expect.any(Object)
    );
    expect(vscode.commands.registerCommand).toHaveBeenCalledWith(
      "code-prompt-assist.openForm",
      expect.any(Function)
    );
  });

  it("registers openForm command correctly", () => {
    const commandName = "code-prompt-assist.openForm";
    const promptType = "testPromptType";

    activate(mockContext as unknown as vscode.ExtensionContext);
    const command = (
      vscode.commands.registerCommand as jest.Mock
    ).mock.calls.find((call) => call[0] === commandName);
    expect(command).toBeDefined();

    command[1](promptType);
    expect(openForm).toHaveBeenCalledWith(promptType, mockContext);
  });
});

describe("deactivate", () => {
  it("deactivates correctly", () => {
    deactivate();
  });
});
