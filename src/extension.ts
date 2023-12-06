import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

type CodeInput = {
    fileName: string,
    fileContent: string
}[];

type Message = {
    data: {
        files: string,
        ticketInfo: string
    }
};

type GetPrompt = (
    ticketInfo: string,
    codeInput: CodeInput,
    rootDir: string,
    fileTree: string,
) => string;

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
    let disposable = vscode.commands.registerCommand('code-assist.generatePrompt', () => {
        const panel = vscode.window.createWebviewPanel(
            'formView',
            'Form View',
            vscode.ViewColumn.One,
            { enableScripts: true }
        );

        panel.webview.html = getFormHtml();

        panel.webview.onDidReceiveMessage(
            message => {
                if (message.command === 'submit') {
                    processFiles(message.data, panel.webview);
                }
            },
            undefined,
            context.subscriptions
        );
    });

    context.subscriptions.push(disposable);
}

/*
TODO consider adding 
    Context: [Add any additional context about the environment or technologies used]

    Objective: [Add specific questions or objectives]
*/
const getPropt: GetPrompt = (ticketInfo, codeInput, rootDir, fileTree) => `
    I'm looking to update my code to meet the following business requirements with the ticket information:
    ${ticketInfo}

    This is my key code sections, in an array of objects with the structure { fileName: string, fileContent: string }[]:
    ${JSON.stringify(codeInput)}

    This is the file tree of my code starting with \n ${rootDir}. The default max depth is 5:
    ${fileTree}

    Let me know if you would like to see further input from the files.

    Can you offer code solutions or optimizations to meet these requirements? 
    Ideally I'd want to get to a point that I can raise an MR with the suggestions prodived
    `;

async function processFiles(data: { files: string, ticketInfo: string }, webview: vscode.Webview) {
    const { files, ticketInfo } = data;
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
                const output = getPropt(ticketInfo, codeInput, rootDir, fileTree);
                webview.postMessage({ command: 'displayOutput', output });
            }
        });
    } catch (error) {
        // @ts-ignore
        vscode.window.showErrorMessage(error.message);
    }
}

function getFormHtml(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Form</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        label {
            display: block;
            margin-top: 10px;
        }
        input, textarea {
            width: 100%;
            padding: 8px;
            margin-top: 5px;
            box-sizing: border-box; /* Make sure padding doesn't affect overall width */
        }
        #error-message {
            color: red;
            margin-bottom: 10px;
        }
        #output {
            white-space: pre-wrap;
            margin-top: 20px;
            background-color: #f4f4f4;
            padding: 10px;
            border-radius: 5px;
        }
        .tooltip {
            position: relative;
            display: inline-block;
            border-bottom: 1px dotted black; /* If you need a dotted underline */
        }
        .tooltip .tooltiptext {
            visibility: hidden;
            width: 120px;
            background-color: black;
            color: #fff;
            text-align: center;
            border-radius: 6px;
            padding: 5px 0;
            position: absolute;
            z-index: 1;
            bottom: 100%;
            left: 50%;
            margin-left: -60px; /* Use half of the width (120px/2 = 60px) */
        }
        .tooltip:hover .tooltiptext {
            visibility: visible;
        }
        #outputContainer {
            position: relative;
            margin-top: 20px;
            padding: 10px;
            background-color: #f4f4f4;
            border-radius: 5px;
        }
        #copyButton {
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 5px 10px;
            background-color: #0078D4;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        #copyButton:hover {
            background-color: #005a9e;
        }
    </style>
</head>
<body>
    <div id="error-message"></div>
    <form id="myForm">
        <label for="files">Relative File Paths:</label>
        <input type="text" id="files" name="files" placeholder="e.g., src/index.js, lib/util.js">
        <span class="tooltip">?
            <span class="tooltiptext">Enter file paths separated by commas</span>
        </span>

        <label for="ticket-info">Ticket Info:</label>
        <textarea id="ticket-info" name="Ticket Info" placeholder="Describe your ticket information here..." rows="4"></textarea>
        
        <input type="button" value="Submit" onclick="submitForm()">
    </form>
    <div id="outputContainer">
        <div id="output"></div>
        <button id="copyButton">Copy To Clipboard</button>
    </div>
    <script>
        const vscode = acquireVsCodeApi();
        
        const previousState = vscode.getState();
        if (previousState) {
            document.getElementById('files').value = previousState.files || '';
            document.getElementById('ticket-info').value = previousState.ticketInfo || '';
            document.getElementById('output').textContent = previousState.output || '';
        }

        function saveState() {
            const files = document.getElementById('files').value;
            const ticketInfo = document.getElementById('ticket-info').value;
            const output = document.getElementById('output').textContent;
            vscode.setState({ files, ticketInfo, output });
        }

        function displayError(message) {
            const errorElement = document.getElementById('error-message');
            errorElement.textContent = message;
            errorElement.style.display = message ? 'block' : 'none';
        }

        function validateInput(files, ticketInfo) {
            if (!files.trim()) {
                return 'Please enter file paths.';
            }
            if (!ticketInfo.trim()) {
                return 'Please enter ticket information.';
            }
            return '';
        }

        function submitForm() {
            const files = document.getElementById('files').value;
            const ticketInfo = document.getElementById('ticket-info').value;

            const errorMessage = validateInput(files, ticketInfo);
            if (errorMessage) {
                displayError(errorMessage);
                return;
            }
            displayError('');

            saveState();

            vscode.postMessage({
                command: 'submit',
                data: { files, ticketInfo }
            });
        }

        window.addEventListener('message', event => {
            switch (event.data.command) {
                case 'displayOutput':
                    document.getElementById('output').textContent = event.data.output;
                    saveState();
                    break;
            }
        });

        document.getElementById('files').addEventListener('change', saveState);
        document.getElementById('ticket-info').addEventListener('change', saveState);

        function copyToClipboard() {
            const outputText = document.getElementById('output').textContent;
            const el = document.createElement('textarea');
            el.value = outputText;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            vscode.window.showInformationMessage('Output copied to clipboard.');
        }

        document.getElementById('copyButton').addEventListener('click', copyToClipboard);
    </script>
</body>
</html>`;
}

export function deactivate() { }
