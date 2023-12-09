import * as vscode from "vscode";

export class CodeAssistTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly command?: vscode.Command
  ) {
    super(label);
  }
}

function createTreeItem(
  label: string,
  command?: vscode.Command
): CodeAssistTreeItem {
  return new CodeAssistTreeItem(label, command);
}

class CodeAssistTreeProvider
  implements vscode.TreeDataProvider<CodeAssistTreeItem>
{
  getTreeItem(element: CodeAssistTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: CodeAssistTreeItem): Thenable<CodeAssistTreeItem[]> {
    if (element) {
      // If you have nested items, handle them here
      return Promise.resolve([]);
    } else {
      // Root items
      return Promise.resolve([
        createTreeItem("1. Generate Code Solution", {
          command: "code-prompt-assist.openForm",
          title: "Open Form",
          arguments: ["codeSolution"],
        }),
        createTreeItem("2. Generate Unit Tests", {
          command: "code-prompt-assist.openForm",
          title: "Open Form",
          arguments: ["unitTests"],
        }),
        createTreeItem("3. Generate Code Optimizations", {
          command: "code-prompt-assist.openForm",
          title: "Open Form",
          arguments: ["codeOptimizations"],
        }),
      ]);
    }
  }
}

export { CodeAssistTreeProvider };
