import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

type CodeInput = {
    fileName: string,
    fileContent: string
}[];

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
    let disposable = vscode.commands.registerCommand('code-assist.helloWorld', async () => {
        // Ask the user for file names
        const input = await vscode.window.showInputBox({
            placeHolder: 'Enter relative file names separated by commas',
        });

        const codeInput: CodeInput = [];

        if (input) {
            const fileNames = input.split(',').map(file => file.trim());

            fileNames.forEach(fileName => {
                const filePath = path.join(vscode.workspace.rootPath || '', fileName);
                try {
                    const fileContent = fs.readFileSync(filePath, 'utf8');
                    codeInput.push({
                        fileName,
                        fileContent
                    });
                } catch (error) {
                    // @ts-ignore
                    vscode.window.showErrorMessage(`Error reading file ${fileName}: ${error.message}`);
                }
            });

            const rootDir = fileNames.length > 0 ? path.dirname(path.join(vscode.workspace.rootPath || '', fileNames[0])) : '';

            const fileTree = generateFileTree(rootDir);
            vscode.window.showInformationMessage(`
            I'm looking to update my code to meet the following business requirements with the ticket information:

            ** INSERT TICKET**

            This is my code in an array of object with the structure { fileName: string, fileContent: string }: ${JSON.stringify(codeInput)}. 
            
            This is the file tree of my code staring with \n ${rootDir}: \n ${fileTree}. 
            
            Let me know if you would like to see further input from the files.

            Can you offer some code solutions to meet the ticket requirements?`);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
