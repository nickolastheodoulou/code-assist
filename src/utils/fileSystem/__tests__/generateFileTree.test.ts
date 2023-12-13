import { generateFileTree } from "../generateFileTree";
import * as fs from "fs";

jest.mock("fs", () => ({
  promises: {
    access: jest.fn(),
    stat: jest.fn(),
    readdir: jest.fn(),
  }
}));

describe("generateFileTree", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("generates a file tree for a given directory", async () => {
    // Mocking the asynchronous operations
    (fs.promises.access as jest.Mock).mockResolvedValue(true);
    (fs.promises.stat as jest.Mock).mockImplementation((path) => Promise.resolve({
      isDirectory: () => !path.includes(".txt"),
    }));
    (fs.promises.readdir as jest.Mock).mockResolvedValue(["file1.txt", "folder1"]);

    const tree = await generateFileTree("/test/path");
    expect(tree).toMatch("file1.txt");
    expect(tree).toMatch("folder1");
  });

  it("returns an empty string if the directory does not exist", async () => {
    (fs.promises.access as jest.Mock).mockRejectedValue(new Error("Not Found"));

    const tree = await generateFileTree("/non/existent/path");
    expect(tree).toBe("");
  });
});
