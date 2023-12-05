import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('code-assist.showForm', () => {
        const panel = vscode.window.createWebviewPanel(
            'formView',
            'Form View',
            vscode.ViewColumn.One,
            {
                // Enable scripts in the webview
                enableScripts: true
            }
        );

        panel.webview.html = getFormHtml();

        // Handle messages from the webview
        panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'submit':
                        const { files } = message.data;
                        console.log('files', files);
                        // Handle the form data here (e.g., display, store, or process it)
                        vscode.window.showInformationMessage(`Files: ${files}`);
                        return;
                }
            },
            undefined,
            context.subscriptions
        );
    });

    context.subscriptions.push(disposable);
}

function getFormHtml(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Form</title>
</head>
<body>
    <form id="myForm">
        <label for="files">Files (delimited with ,):</label><br>
        <input type="text" id="files" name="files"><br>
        <input type="button" value="Submit" onclick="submitForm()">
    </form>
    <script>
        const vscode = acquireVsCodeApi();
        function submitForm() {
            const files = document.getElementById('files').value;
            vscode.postMessage({
                command: 'submit',
                data: { files }
            });
        }
    </script>
</body>
</html>`;
}

export function deactivate() {}
