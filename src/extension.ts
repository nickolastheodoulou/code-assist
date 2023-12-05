import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

type CodeInput = {
    fileName: string,
    fileContent: string
}[];

type Message = {
    data: {
        files: string
    }
}

function generateFileTree(dirPath: string, level: number = 0, maxDepth: number = 5): string {
    if (level > maxDepth || !fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
        return '';
    }

    let tree = '';
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
        tree += ' '.repeat(level * 2) + file + '\n';
        const filePath = path.join(dirPath, file);
        if (fs.statSync(filePath).isDirectory()) {
            tree += generateFileTree(filePath, level + 1, maxDepth);
        }
    }

    return tree;
}

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
            async message => {
                switch (message.command) {
                    case 'submit':
                        const { files, ticketInfo } = message.data;
                        const codeInput: CodeInput = [];

                        // @ts-ignore
                        const fileNames = files.split(',').map(file => file.trim());

                        // @ts-ignore
                        for (const fileName of fileNames) {
                            const filePath = path.join(vscode.workspace.rootPath || '', fileName);
                            try {
                                const fileContent = await fs.promises.readFile(filePath, 'utf8');
                                codeInput.push({
                                    fileName,
                                    fileContent
                                });
                            } catch (error) {
                                // @ts-ignore
                                vscode.window.showErrorMessage(`Error reading file ${fileName}: ${error.message}`);
                            }
                        }

                        const rootDir = fileNames.length > 0 ? path.dirname(path.join(vscode.workspace.rootPath || '', fileNames[0])) : '';

                        const fileTree = generateFileTree(rootDir);
                        vscode.window.showInformationMessage(`
                          I'm looking to update my code to meet the following business requirements with the ticket information:
              

                          ${ticketInfo}

              
                          This is my code in an array of object with the structure { fileName: string, fileContent: string }: ${JSON.stringify(codeInput)}. 
                          
                          This is the file tree of my code staring with \n ${rootDir}: \n ${fileTree}. 
                          
                          Let me know if you would like to see further input from the files.
              
                          Can you offer some code solutions to meet the ticket requirements?`);
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
        <label for="files">Relative File Paths (seperated by ','):</label><br>
        <input type="text" id="files" name="files"><br>
        <label for="ticket-info">Ticket Info:</label><br>
        <textarea id="ticket-info" name="Ticket Info"></textarea><br>
        <input type="button" value="Submit" onclick="submitForm()">
    </form>
    <script>
        const vscode = acquireVsCodeApi();
        function submitForm() {
            const files = document.getElementById('files').value;
            const ticketInfo = document.getElementById('ticket-info').value;
            vscode.postMessage({
                command: 'submit',
                data: { files, ticketInfo }
            });
        }
    </script>
</body>
</html>`;
}

export function deactivate() { }
