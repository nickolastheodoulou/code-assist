import * as vscode from "vscode";
import { getTitleFromPromptType } from "../../utils/prompt/getTitleFromPromptType";
import { PromptType } from "../../__types__/types";
import { processFiles } from "../../utils/fileSystem/processFiles";
import { applyRedactionRules } from "../../utils/prompt/getPropt";

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
            color: #C0C0CD; /* Default text color */
            background-color: #343541; /* Light mode background */
        }

        button#Submit {
            padding: 10px 15px;
            margin-bottom: 20px;
            background-color: #0078D4;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        
        button#Submit:hover {
            background-color: #005a9e;
        }
        
        @media (prefers-color-scheme: dark) {
            body {
                color: #fff; /* White text for dark mode */
                background-color: #343541; /* Dark mode background */
            }
        }
        
        label {
            display: block;
            margin-top: 10px;
            color: inherit; /* Ensure label text color matches body color */
        }
        
        input[type="text"], textarea {
            width: 100%;
            padding: 8px;
            margin-top: 5px;
            box-sizing: border-box;
            background-color: #f5f5f5; /* Light mode */
            border: 1px solid #ccc;
            border-radius: 4px;
            color: #333;
        }
        
        input[type="text"]:focus, textarea:focus {
            border-color: #0078D4;
            outline: none;
            background-color: #005a9e; /* Lighter background for focus */
        }

        #error-message {
            color: red;
            margin-bottom: 10px;
        }
        
        #copyButton, input[type="button"] {
            padding: 10px 15px;
            background-color: #0078D4;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        
        #copyButton:hover, input[type="button"]:hover {
            background-color: #005a9e;
        }
        
        #output, #outputContainer {
            background-color: #f9f9f9; /* Light mode */
            border: 1px solid #ccc;
            padding: 10px;
            border-radius: 5px;
            margin-top: 20px;
        }
        
        @media (prefers-color-scheme: dark) {
            input[type="text"], textarea, 
            #output, #outputContainer {
                background-color: #2c2c2c; /* Dark mode background */
                color: #fff;
                border-color: #444;
            }
        }

        textarea#ticket-info {
            margin-bottom: 15px;
        }
        
        #outputContainer {
            position: relative;
            padding-right: 50px; 
            margin-top: 20px;
        }
        
        #copyButton {
            position: absolute;
            top: 10px;
            right: 10px;
        }
        
        .redacted {
            color: green;
        }
        
        /* Tooltip styles */
        .tooltip {
            position: relative;
            display: inline-block;
            border-bottom: 1px dotted black; /* If you need a dotted underline */
        }
        
        .tooltip .tooltiptext {
            visibility: hidden;
            width: 220px;
            background-color: black;
            color: #fff;
            border-radius: 6px;
            padding: 5px;
            margin: 5px;
            position: absolute;
            z-index: 1;
            bottom: 100%;
            left: 0%;
            margin-left: 0
            transform: translateX(-100%);
        }
        
        .tooltip:hover .tooltiptext {
            visibility: visible;
        }

    </style>
</head>
<body>
    <h1>${getTitleFromPromptType(promptType)}</h1>
    <div id="error-message"></div>
    <form id="myForm">
        <label for="files">Relative File Paths:
        <span class="tooltip">?
            <span class="tooltiptext">Enter file paths separated by commas</span>
        </span>
        </label>
        <input type="text" id="files" name="files" placeholder="e.g., src/index.js, lib/util.js">

        <label for="ticket-info">Ticket Info:</label>
        <textarea id="ticket-info" name="Ticket Info" placeholder="Describe your ticket information here..." rows="4"></textarea>

        <input type="button" id="Submit" value="Submit" onclick="submitForm()">
    </form>
    <div id="outputContainer">
        <button id="copyButton">Copy To Clipboard</button>
        </br>
        </br>
        <div id="output"></div>
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

        function escapeRegExp(string) {
            return string.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&');
        }
        
        function applyRedactedClass(redactedText, redactedStrings) {
             const outputElement = document.getElementById('output');
            outputElement.textContent = redactedText;
        
            redactedStrings.forEach(redactedString => {
                const regex = new RegExp(escapeRegExp(redactedString), 'gi');
                highlightText(outputElement, regex);
            });
        }
        
        function highlightText(parentNode, regex) {
            const walker = document.createTreeWalker(parentNode, NodeFilter.SHOW_TEXT, null, false);
            let node;
            
            while (node = walker.nextNode()) {
                let match;
                while ((match = regex.exec(node.nodeValue)) !== null) {
                    const span = document.createElement('span');
                    span.className = 'redacted';
                    span.textContent = match[0];
                    
                    const range = document.createRange();
                    range.setStart(node, match.index);
                    range.setEnd(node, match.index + match[0].length);
                    range.deleteContents();
                    range.insertNode(span);
        
                    // Update the walker's current node to the next sibling of the span, to avoid infinite loop
                    walker.currentNode = span.nextSibling;
                }
            }
        }
        
        window.addEventListener('message', event => {
            switch (event.data.command) {
                case 'displayOutput':
                    const { redactedText, redactedStrings } = event.data;
                    applyRedactedClass(redactedText, redactedStrings);
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

    const copyButton = document.getElementById('copyButton');
    const originalText = copyButton.textContent;
    copyButton.textContent = 'Copied!';
    copyButton.style.backgroundColor = '#28a745'; // Change to a success color

    setTimeout(() => {
        copyButton.textContent = originalText;
        copyButton.style.backgroundColor = ''; // Reset to original color
    }, 2000); // Reset after 2 seconds

    vscode.window.showInformationMessage('Output copied to clipboard.');
}

        document.getElementById('copyButton').addEventListener('click', copyToClipboard);
    </script>
</body>
</html>`;
};

type OpenForm = (
  promptType: PromptType,
  context: vscode.ExtensionContext
) => void;

const openForm: OpenForm = (promptType, context) => {
  const panel = vscode.window.createWebviewPanel(
    "formView",
    getTitleFromPromptType(promptType),
    vscode.ViewColumn.One,
    { enableScripts: true }
  );

  panel.webview.html = getFormHtml(promptType);

  const { redactedText, redactedStrings } = applyRedactionRules(promptType, context);
  console.log('redactedText in openForm', redactedText);
    console.log('redactedStrings in openForm', redactedStrings);
  panel.webview.postMessage({ 
    command: 'redactedRules', 
    data: { redactedText, redactedStrings } 
  });

  panel.webview.onDidReceiveMessage(
    (message) => {
      if (message.command === "submit") {
        processFiles({ ...message.data, promptType }, panel.webview, context);
      }
    },
    undefined,
    context.subscriptions
  );
  return panel;
};

export { openForm, getFormHtml };
