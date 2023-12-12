import * as vscode from 'vscode';
import { CodeAssistTreeProvider } from './views/treeView/treeView';
import { openForm } from './views/webView/webviewManager';
import { openSettings } from './views/settings/settingsView';

export function activate(context: vscode.ExtensionContext) {
    const treeDataProvider = new CodeAssistTreeProvider();
    vscode.window.createTreeView('codeAssistTreeView', { treeDataProvider });

    const openedPanels:any = {}; // TODO add type

    const openFormCommand = vscode.commands.registerCommand('code-prompt-assist.openForm', (promptType) => {
        if (!openedPanels[promptType]) {
            openedPanels[promptType] = openForm(promptType, context);
            openedPanels[promptType].onDidDispose(() => {
                openedPanels[promptType] = undefined;
            });
        } else {
            openedPanels[promptType].reveal();
        }
    });

    context.subscriptions.push(openFormCommand);

    const openSettingsCommand = vscode.commands.registerCommand('code-prompt-assist.openSettings', () => {
        if (!openedPanels['settings']) {
            openedPanels['settings'] = openSettings(context);
            openedPanels['settings'].onDidDispose(() => {
                openedPanels['settings'] = undefined;
            });
        } else {
            openedPanels['settings'].reveal();
        }
    });

    context.subscriptions.push(openSettingsCommand);
}

export function deactivate() { }
