import * as vscode from 'vscode';
import { CodeAssistTreeProvider } from './views/treeView/treeView';
import { openForm } from './views/webView/webviewManager';
import { openSettings } from './views/settings/settingsView';


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
        openSettings(context);
    });

    context.subscriptions.push(openSettingsCommand);
}



export function deactivate() { }
