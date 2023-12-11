import { generateFileTree } from "../generateFileTree";

import * as fs from "fs";

jest.mock("vscode", () => ({
  window: {
    withProgress: jest.fn((_, callback) =>
      callback({ report: () => {} }, { isCancellationRequested: false })
    ),
    showInformationMessage: jest.fn(),
    showErrorMessage: jest.fn(),
  },
}));

jest.mock("fs", () => ({
  promises: {
    readFile: jest.fn(),
  },
  existsSync: jest.fn(),
  statSync: jest.fn(),
  readdirSync: jest.fn(),
}));

describe("generateFileTree", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("generates a file tree for a given directory", () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.statSync as jest.Mock).mockImplementation((path) => ({
      isDirectory: () => !path.includes(".txt"),
    }));
    (fs.readdirSync as jest.Mock).mockReturnValue(["file1.txt", "folder1"]);

    const tree = generateFileTree("/test/path");
    expect(tree).toMatch("file1.txt");
    expect(tree).toMatch("folder1");
  });

  it("returns an empty string if the directory does not exist", () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    const tree = generateFileTree("/non/existent/path");
    expect(tree).toBe("");
  });
});
