import * as vscode from "vscode";

type CodeInput = {
    fileName: string,
    fileContent: string
}[];

enum PromptType {
    CODE_OPTIMIZATIONS = 'codeOptimizations',
    UNIT_TESTS = 'unitTests',
    CODE_SOLUTION = 'codeSolution'
}

type RedactionRules = {
    original: string,
    replacement: string
  }[];

  type RedactedStrings = string[];

type GetPrompt = (
    ticketInfo: string,
    codeInput: CodeInput,
    rootDir: string,
    fileTree: string,
    promptType: PromptType,
    context: vscode.ExtensionContext
) => { redactedText: string, redactedStrings: RedactedStrings };

type ApplyRedactionRules = (
    text: string,
    context: vscode.ExtensionContext
) => { redactedText: string, redactedStrings: RedactedStrings };

export {
    GetPrompt,
    CodeInput,
    PromptType,
    RedactionRules,
    RedactedStrings,
    ApplyRedactionRules
};