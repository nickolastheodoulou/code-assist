import * as vscode from "vscode";
import TITLE from "../../utils/constants/title";

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
        createTreeItem("Configure Redaction Settings", {
          command: "code-prompt-assist.openSettings",
          title: "Create Redaction Rules",
        }),
        createTreeItem(TITLE, {
          command: "code-prompt-assist.openForm",
          title: "Open Form",
          arguments: [],
        }),
      ]);
    }
  }
}

export { CodeAssistTreeProvider };
