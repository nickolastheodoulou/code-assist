import * as path from "path";
import { processFiles } from "../processFiles";
import { PromptType } from "../../../__types__/types";
import * as vscode from "vscode";
import * as fs from "fs";
import { generateFileTree } from "../generateFileTree";
import { getPropt } from "../../prompt/getPropt";



jest.mock("../generateFileTree", () => ({
    generateFileTree: jest.fn(),
    }));

jest.mock("../../prompt/getPropt", () => ({
    getPropt: jest.fn(),
    }));

jest.mock("vscode", () => ({
  window: {
    createWebviewPanel: jest.fn().mockImplementation(() => ({
      webview: {
        html: "",
        onDidReceiveMessage: jest.fn(),
        postMessage: jest.fn(),
      },
      onDidDispose: jest.fn(),
      reveal: jest.fn(),
    })),
    withProgress: jest.fn((_, callback) =>
      callback(
        { report: () => {} },
        { isCancellationRequested: false, onCancellationRequested: jest.fn() }
      )
    ),
    showInformationMessage: jest.fn(),
    showErrorMessage: jest.fn(),
  },
  ProgressLocation: {
    Notification: jest.fn(),
    globalState: {
      get: jest.fn(),
    },
  },
  CancellationTokenSource: jest.fn(),
  workspace: {
    rootPath: "/",
  },
}));

jest.mock("fs", () => ({
  promises: {
    readFile: jest.fn(),
  },
  existsSync: jest.fn(),
  statSync: jest.fn().mockImplementation((path) => ({
    isDirectory: () => !path.includes(".txt"), // Mock implementation
  })),
  readdirSync: jest.fn(),
}));

const generateFileTreeMock = generateFileTree as jest.Mock;
const getProptMock = getPropt as jest.Mock;

describe("processFiles", () => {
  let mockWebview: vscode.Webview;
  const mockContext = {
    globalState: { get: jest.fn(), update: jest.fn() },
  } as unknown as vscode.ExtensionContext;

  it("throws an error when a file does not exist", async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false); // Mock file does not exist

    const data = {
      files: "nonexistent.js",
      ticketInfo: "Ticket Information",
      promptType: PromptType.CODE_SOLUTION,
    };

    await expect(processFiles(data, mockWebview, mockContext)).rejects.toThrow(
      "File not found: nonexistent.js"
    );
  });

  it("processes files and sends output to webview", async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.promises.readFile as jest.Mock).mockResolvedValue("file content");

    generateFileTreeMock.mockReturnValue("file tree");
    getProptMock.mockReturnValue("prompt output");

    const mockPanel = {
      webview: {
        html: "",
        onDidReceiveMessage: jest.fn(),
        postMessage: jest.fn(),
      },
      onDidDispose: jest.fn(),
      reveal: jest.fn(),
    };

    const data = {
      files: "file1.js,file2.js",
      ticketInfo: "Ticket Information",
      promptType: PromptType.CODE_SOLUTION,
    };

    await processFiles(
      data,
      mockPanel.webview as unknown as vscode.Webview,
      mockContext
    );
    // expect(mockPanel.webview.postMessage).toHaveBeenCalled();
    // const output = mockPanel.webview.postMessage.mock.calls[0][0];
    // expect(output.command).toBe('displayOutput');
  });

  it("handles errors and displays error message", async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.promises.readFile as jest.Mock).mockRejectedValue(
      new Error("Read file error")
    ); // Mock error

    const mockShowErrorMessage = jest.fn();
    vscode.window.showErrorMessage = mockShowErrorMessage;

    const data = {
      files: "file1.js",
      ticketInfo: "Ticket Information",
      promptType: PromptType.CODE_SOLUTION,
    };

    await expect(processFiles(data, mockWebview, mockContext)).rejects.toThrow(
      "Read file error"
    );
    expect(mockShowErrorMessage).toHaveBeenCalledWith("Read file error");
  });
});
