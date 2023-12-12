import * as vscode from "vscode";
import { getHtml, openSettings } from "../settingsView";

// Mocking VS Code API
jest.mock('vscode', () => ({
    window: {
      createWebviewPanel: jest.fn().mockImplementation(() => ({
        webview: {
          html: '',
          onDidReceiveMessage: jest.fn(),
          postMessage: jest.fn(),
        },
        onDidDispose: jest.fn(),
        reveal: jest.fn(),
      })),
    },
    ViewColumn: {
      One: 1,
    },
  }));
  

describe("settingsView", () => {
  describe("getHtml", () => {
    it("returns valid HTML structure", () => {
      const html = getHtml();
      expect(html).toContain("DOCTYPE html");
      expect(html).toContain('class="container"');
      expect(html).toContain('id="rulesList"');
      // More assertions can be added here
    });
  });

  describe("openSettings", () => {
    it("creates a webview panel with correct properties", () => {
      const context = { globalState: { get: jest.fn(), update: jest.fn() } } as unknown as vscode.ExtensionContext;
      openSettings(context);
      expect(vscode.window.createWebviewPanel).toHaveBeenCalledWith(
        "formView",
        "Redaction Rules Settings",
        vscode.ViewColumn.One,
        { enableScripts: true }
      );
    });

    // Additional tests for message handling and state management
  });
});
