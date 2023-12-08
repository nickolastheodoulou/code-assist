import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { CodeInput, PromptType } from "../__types__/types";
import { getPropt } from "./getPropt";

function generateFileTree(dirPath: string, level: number = 0, maxDepth: number = 5): string {
    if (level > maxDepth || !fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
        return '';
    }

    let tree = '';
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
        if (file === 'node_modules') {
            continue;
        }
        tree += ' '.repeat(level * 2) + file + '\n';
        const filePath = path.join(dirPath, file);
        if (fs.statSync(filePath).isDirectory()) {
            tree += generateFileTree(filePath, level + 1, maxDepth);
        }
    }

    return tree;
}

async function processFiles(data: { files: string; ticketInfo: string; promptType: PromptType; }, webview: vscode.Webview) {
    const { files, ticketInfo, promptType } = data;
    const fileNames = files.split(',').map(file => file.trim());

    try {
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Processing Files",
            cancellable: true
        }, async (progress, token) => {
            token.onCancellationRequested(() => {
                vscode.window.showInformationMessage('File processing cancelled.');
            });

            const codeInput: CodeInput = [];

            for (const [index, fileName] of fileNames.entries()) {
                if (token.isCancellationRequested) {
                    break;
                }

                progress.report({ increment: (index / fileNames.length) * 100, message: `Processing ${fileName}` });

                const filePath = path.join(vscode.workspace.rootPath || '', fileName);
                if (!fs.existsSync(filePath)) {
                    throw new Error(`File not found: ${fileName}`);
                }

                const fileContent = await fs.promises.readFile(filePath, 'utf8');
                codeInput.push({ fileName, fileContent });
            }

            if (!token.isCancellationRequested) {
                const rootDir = path.dirname(path.join(vscode.workspace.rootPath || '', fileNames[0]));
                const fileTree = generateFileTree(rootDir);
                const output = getPropt(ticketInfo, codeInput, rootDir, fileTree, promptType);
                webview.postMessage({ command: 'displayOutput', output });
            }
        });
    } catch (error) {
        // @ts-ignore
        vscode.window.showErrorMessage(error.message || 'An error occurred while processing files.');
    }
}


export {
    generateFileTree,
    processFiles
};