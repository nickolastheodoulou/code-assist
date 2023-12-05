import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

type CodeInput = {
    fileName: string,
    fileContent: string
}[];

type Message = {
    data: {
        files: string
    }
}

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
            {
                // Enable scripts in the webview
                enableScripts: true
            }
        );

        panel.webview.html = getFormHtml();

        // Handle messages from the webview
        panel.webview.onDidReceiveMessage(
            async message => {
                switch (message.command) {
                    case 'submit':
                        const { files, ticketInfo } = message.data;
                        // @ts-ignore
                        const fileNames = files.split(',').map(file => file.trim());

                        // @ts-ignore
                        if (fileNames.some(fileName => !fileName)) {
                            vscode.window.showErrorMessage('Invalid file path provided.');
                            return;
                        }

                        const codeInput = [];
                        for (const fileName of fileNames) {
                            const filePath = path.join(vscode.workspace.rootPath || '', fileName);
                            if (!fs.existsSync(filePath)) {
                                const errorMessage = `File not found: ${fileName}`;
                                vscode.window.showErrorMessage(errorMessage);
                                throw new Error(errorMessage);
                            }
                            try {
                                const fileContent = await fs.promises.readFile(filePath, 'utf8');
                                codeInput.push({ fileName, fileContent });
                            } catch (error) {
                                // @ts-ignore
                                const errorMessage = `Error reading file ${fileName}: ${error.message}`;
                                vscode.window.showErrorMessage(errorMessage);
                            }
                        }


                        const rootDir = path.dirname(path.join(vscode.workspace.rootPath || '', fileNames[0]));

                        const fileTree = generateFileTree(rootDir);
                        vscode.window.showInformationMessage(`
                          I'm looking to update my code to meet the following business requirements with the ticket information:
              

                          ${ticketInfo}

              
                          This is my code in an array of object with the structure { fileName: string, fileContent: string }: ${JSON.stringify(codeInput)}. 
                          
                          This is the file tree of my code staring with \n ${rootDir}: \n ${fileTree}. 
                          
                          Let me know if you would like to see further input from the files.
              
                          Can you offer some code solutions to meet the ticket requirements?`);
                        return;
                }
            },
            undefined,
            context.subscriptions
        );
    });

    context.subscriptions.push(disposable);
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
    <script>
    const vscode = acquireVsCodeApi();
    
    // Restores the state when the webview is reloaded
    const previousState = vscode.getState();
    if (previousState) {
        document.getElementById('files').value = previousState.files || '';
        document.getElementById('ticket-info').value = previousState.ticketInfo || '';
    }

    function saveState() {
        const files = document.getElementById('files').value;
        const ticketInfo = document.getElementById('ticket-info').value;
        vscode.setState({ files, ticketInfo });
    }

    function displayError(message) {
        const errorElement = document.getElementById('error-message');
            errorElement.textContent = message; // Display the error message
            errorElement.style.display = message ? 'block' : 'none'; // Hide the element if there's no message
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

        saveState(); // Save state on submit

        vscode.postMessage({
            command: 'submit',
            data: { files, ticketInfo }
        });
    }

    // Add event listeners to save state when form fields change
    document.getElementById('files').addEventListener('change', saveState);
    document.getElementById('ticket-info').addEventListener('change', saveState);
</script>
</body>
</html>`;
}

export function deactivate() { }
