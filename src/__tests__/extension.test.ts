import * as vscode from "vscode";
import { activate, deactivate } from "../extension";
import { openForm } from "../views/webviewManager";

jest.mock("vscode", () => ({
  commands: {
    registerCommand: jest.fn(),
  },
  window: {
    createTreeView: jest.fn(),
  },
}));

jest.mock("../views/treeView", () => ({
  CodeAssistTreeProvider: jest.fn().mockImplementation(() => ({})),
}));

jest.mock("../views/webviewManager", () => ({
  openForm: jest.fn(),
}));

describe("Extension", () => {
  const mockContext = { subscriptions: [] };

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
