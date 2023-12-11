import * as vscode from 'vscode';
import { getTitleFromPromptType } from "./getTitleFromPromptType";
import { PromptType } from '../__types__/types';
import { processFiles } from './fileSystem';

const getFormHtml = (promptType: string): string => {
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
            color: #333333;
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
    <h1>${getTitleFromPromptType(promptType)}</h1>
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

        // Add event listeners to capture input changes and save state on window change
        document.getElementById('files').addEventListener('input', saveState);
        document.getElementById('ticket-info').addEventListener('input', saveState);


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
};

type OpenForm = (
    promptType: PromptType,
    context: any
) => void;

const openForm: OpenForm = (promptType, context) => {
    const panel = vscode.window.createWebviewPanel(
        'formView',
        getTitleFromPromptType(promptType),
        vscode.ViewColumn.One,
        { enableScripts: true }
    );

    panel.webview.html = getFormHtml(promptType);

    panel.webview.onDidReceiveMessage(
        message => {
            if (message.command === 'submit') {
                processFiles({ ...message.data, promptType }, panel.webview);
            }
        },
        undefined,
        context.subscriptions
    );
};

export {
    openForm,
    getFormHtml
};