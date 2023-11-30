import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Your extension "code-assist" is now active!');

    let disposable = vscode.commands.registerCommand('code-assist.helloWorld', () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
            const filePath = activeEditor.document.uri.fsPath;
            vscode.window.showInformationMessage(`Current file path: ${filePath}`);
        } else {
            vscode.window.showInformationMessage('No active editor');
        }

        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders) {
            const workspacePath = workspaceFolders[0].uri.fsPath;
            vscode.window.showInformationMessage(`Current workspace path: ${workspacePath}`);
        } else {
            vscode.window.showInformationMessage('No open workspace');
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
