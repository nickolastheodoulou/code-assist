import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

type CodeInput = {
    fileName: string,
    fileContent: string
}[]

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('code-assist.helloWorld', async () => {
        // Ask the user for file names
        const input = await vscode.window.showInputBox({
            placeHolder: 'Enter relative file names separated by commas',
        });

        const codeInput: CodeInput = []

        if (input) {
            const fileNames = input.split(',').map(file => file.trim());
            fileNames.forEach(fileName => {
                const filePath = path.join(vscode.workspace.rootPath || '', fileName);
                try {
                    const fileContent = fs.readFileSync(filePath, 'utf8');
                    codeInput.push({
                        fileName,
                        fileContent
                    })
                } catch (error) {
                    // @ts-ignore
                    vscode.window.showErrorMessage(`Error reading file ${fileName}: ${error.message}`);
                }
            });
            vscode.window.showInformationMessage(`This is my code in an array of object with the structure { fileName: string, fileContent: string }: ${JSON.stringify(codeInput)}`);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
