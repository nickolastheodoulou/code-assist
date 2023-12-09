import * as vscode from 'vscode';
import { CodeAssistTreeProvider } from './utils/treeView';
import { openForm } from './utils/webviewManager';


export function activate(context: vscode.ExtensionContext) {
    const treeDataProvider = new CodeAssistTreeProvider();
    vscode.window.createTreeView('codeAssistTreeView', { treeDataProvider });

    const openFormCommand = vscode.commands.registerCommand('code-prompt-assist.openForm', (promptType) => {
        openForm(promptType, context);
    });

    context.subscriptions.push(openFormCommand);
}



export function deactivate() { }
