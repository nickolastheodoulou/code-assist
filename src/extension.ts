import * as vscode from 'vscode';
import { CodeAssistTreeProvider } from './views/treeView';
import { openForm } from './views/webviewManager';


export function activate(context: vscode.ExtensionContext) {
    const treeDataProvider = new CodeAssistTreeProvider();
    vscode.window.createTreeView('codeAssistTreeView', { treeDataProvider });

    const openFormCommand = vscode.commands.registerCommand('code-prompt-assist.openForm', (promptType) => {
        openForm(promptType, context);
    });

    context.subscriptions.push(openFormCommand);

    const openSettingsCommand = vscode.commands.registerCommand('code-prompt-assist.openSettings', () => {
        // Open a custom settings UI or a dedicated settings file
        // For demonstration purposes, we'll show a simple notification
        vscode.window.showInformationMessage('Open your extension settings UI or file here.');
    });

    context.subscriptions.push(openSettingsCommand);
}



export function deactivate() { }
