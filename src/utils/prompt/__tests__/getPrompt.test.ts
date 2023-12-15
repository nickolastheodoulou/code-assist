import * as vscode from "vscode";

import { PromptType } from "../../../__types__/types";
import { getPropt, applyRedactionRules } from "../getPropt";

const getMock = jest.fn();
const updateMock = jest.fn();

const mockExtensionContext = {
  globalState: {
    get: getMock,
    update: updateMock,
  },
} as unknown as vscode.ExtensionContext;

describe("getPropt", () => {
  beforeEach(() => {
    getMock.mockReturnValueOnce([]);
  });

  const ticketInfo = "Ticket Information";
  const codeInput = [
    { fileName: "file1.js", fileContent: 'console.log("Hello World");' },
    { fileName: "file2.js", fileContent: 'console.log("Goodbye World");' },
  ];
  const rootDir = "/root/directory";
  const fileTree = "file1.js\nfile2.js";

  it("returns prompt for CODE_SOLUTION", () => {
    const result = getPropt(
      ticketInfo,
      codeInput,
      rootDir,
      fileTree,
      PromptType.CODE_SOLUTION,
      mockExtensionContext
    );
    expect(result).toContain(
      "Can you offer a code solution to meet these requirements?"
    );
    expect(result).toContain(ticketInfo);
    expect(result).toContain(JSON.stringify(codeInput));
    expect(result).toContain(fileTree);
  });

  it("returns prompt for CODE_OPTIMIZATIONS", () => {
    const result = getPropt(
      ticketInfo,
      codeInput,
      rootDir,
      fileTree,
      PromptType.CODE_OPTIMIZATIONS,
      mockExtensionContext
    );
    expect(result).toContain(
      "Can you offer code optimizations that meet best practises to meet these requirements?"
    );
    expect(result).toContain(ticketInfo);
    expect(result).toContain(JSON.stringify(codeInput));
    expect(result).toContain(fileTree);
  });

  it("returns prompt for UNIT_TESTS", () => {
    const result = getPropt(
      ticketInfo,
      codeInput,
      rootDir,
      fileTree,
      PromptType.UNIT_TESTS,
      mockExtensionContext
    );
    expect(result).toContain(
      "Can you write me some unit tests to meet these requirements?"
    );
    expect(result).toContain(ticketInfo);
    expect(result).toContain(JSON.stringify(codeInput));
    expect(result).toContain(fileTree);
  });

  it("returns a default prompt when prompt type is not recognized", () => {
    const result = getPropt(
      ticketInfo,
      codeInput,
      rootDir,
      fileTree,
      "UNKNOWN" as PromptType,
      mockExtensionContext
    );
    expect(result).toContain(ticketInfo);
    expect(result).toContain(JSON.stringify(codeInput));
    expect(result).toContain(fileTree);
    expect(result).not.toContain("Can you offer");
    expect(result).not.toContain("Can you write me");
  });
});

describe("applyRedactionRules", () => {
  beforeEach(() => {
    getMock.mockReset();
    updateMock.mockReset();
  });

  test("replaces specified strings with their replacements", () => {
    getMock.mockReturnValueOnce([
      { original: "secret", replacement: "classified" },
      { original: "password", replacement: "passcode" },
    ]);

    const result = applyRedactionRules(
      "This is a Secret and here is a PassWord",
      mockExtensionContext
    );
    expect(result).toBe("This is a classified and here is a passcode");
  });

  test("uses redactedN for strings without a specified replacement", () => {
    getMock.mockReturnValueOnce([
      { original: "username" },
      { original: "email" },
    ]);

    const result = applyRedactionRules(
      "UserNAME and EmAiL are redacted",
      mockExtensionContext
    );
    expect(result).toBe("redacted and redacted are redacted");
  });
});
