import path from "path";
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "code-assist.openWebview",
    () => {
      const panel = vscode.window.createWebviewPanel(
        "fileInput",
        "File Input",
        vscode.ViewColumn.One,
        {
          // Enable scripts in the webview
          enableScripts: true,

          // Restrict the webview to only loading content from our extension's `media` directory.
          localResourceRoots: [
            vscode.Uri.file(path.join(context.extensionPath, "media")),
          ],
        }
      );

      // Get the path to script on disk
      const onDiskPath = vscode.Uri.file(
        path.join(context.extensionPath, "media", "webviewScript.js")
      );

      // And the uri we use to load this script in the webview
      const scriptUri = panel.webview.asWebviewUri(onDiskPath);

      panel.webview.html = getWebviewContent(scriptUri);
    }
  );

  context.subscriptions.push(disposable);
}

function getWebviewContent(scriptUri: vscode.Uri) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src ${scriptUri};">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Input</title>
</head>
<body>
    <h1>Input File Names</h1>
    <input type="text" id="fileInput" placeholder="Enter file names"/>
    <button id="submitButton">Submit</button>

    <script src="${scriptUri}"></script>
</body>
</html>`;
}

export function deactivate() {}
