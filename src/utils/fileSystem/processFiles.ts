import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { CodeInput, PromptType } from "../../__types__/types";
import { getPropt } from "../prompt/getPropt";
import { generateFileTree } from "./generateFileTree";


async function processFiles(data: { files: string; ticketInfo: string; promptType: PromptType; }, webview: vscode.Webview, context: vscode.ExtensionContext) {
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
                const fileTree = await generateFileTree(rootDir);
                const { redactedText, redactedStrings } = getPropt(ticketInfo, codeInput, rootDir, fileTree, promptType, context);
                webview.postMessage({ command: 'displayOutput', redactedText, redactedStrings });
            }
        });
    } catch (error) {
        // @ts-ignore
        const errorMessage = error.message || 'An error occurred while processing files.';
        vscode.window.showErrorMessage(errorMessage);
        throw new Error(errorMessage);
    }
}

export {
    processFiles
};