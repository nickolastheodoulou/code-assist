import * as vscode from "vscode";
import { processFiles } from "../../utils/fileSystem/processFiles";
import TITLE from "../../utils/constants/title";

const getFormHtml = (): string => {

    const promptTypeDropdown = `
        <label for="promptType">Select Prompt Type:</label>
        <select id="promptType" name="promptType">
            <option value="codeOptimizations">Code Optimizations</option>
            <option value="unitTests">Unit Tests</option>
            <option value="codeSolution">Code Solution</option>
        </select>
    `;

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

        select#promptType {
        width: 100%; /* Full-width */
        padding: 10px; /* Comfortable padding */
        margin-top: 10px; /* Consistent margin */
        margin-bottom: 10px;
        background-color: #f5f5f5; /* Light mode background */
        border: 1px solid #ccc; /* Subtle border */
        border-radius: 4px; /* Rounded corners */
        color: #333; /* Text color */
        box-sizing: border-box; /* Box sizing */
        transition: border-color 0.3s; /* Smooth transition for border */
}

select#promptType:focus {
    border-color: #0078D4; /* Highlight color when focused */
    outline: none; /* Removing default focus outline */
    background-color: #eef4fb; /* Slightly different background on focus */
}

/* Styling for the options inside the dropdown */
select#promptType option {
    padding: 8px; /* Padding for options */
    background-color: white; /* Background for options */
    color: black; /* Text color for options */
}
        
        #outputContainer {
            position: relative;
            padding-right: 50px; 
            margin-top: 20px;
            display: none;
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
    <h1>${TITLE}</h1>
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

        ${promptTypeDropdown}
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

        function validateInput(files, ticketInfo, promptType) {
            if (!files.trim()) {
                return 'Please enter file paths.';
            }
            if (!ticketInfo.trim()) {
                return 'Please enter ticket information.';
            }
            if (!promptType.trim()) {
                return 'Please select a prompt type.';
            }
            return '';
        }

        function submitForm() {
            const files = document.getElementById('files').value;
            const ticketInfo = document.getElementById('ticket-info').value;
            const promptType = document.getElementById('promptType').value;
          
            const errorMessage = validateInput(files, ticketInfo, promptType);
            if (errorMessage) {
                displayError(errorMessage);
                return;
            }
            displayError('');

            document.getElementById('outputContainer').style.display = 'block';

            saveState();

            vscode.postMessage({
                command: 'submit',
                data: { files, ticketInfo, promptType }
            });
        }


        
        // Inject the dependent functions into the script tag
        // @ts-ignore
        function escapeRegExp(string) {
            return string.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&');
        }

        // @ts-ignore
        function sanitizeHTML(text) {
            const tempDiv = document.createElement('div');
            tempDiv.textContent = text;
            return tempDiv.innerHTML;
        }

        // @ts-ignore
        function applyRedactedClass(redactedText, redactedStrings) {
            const outputElement = document.getElementById('output');
            
            // Sanitize the redactedText to escape any HTML
            let sanitizedText = sanitizeHTML(redactedText);

            // @ts-ignore
            redactedStrings.forEach(redactedString => {
                const escapedString = escapeRegExp(redactedString);
                const regex = new RegExp(escapedString, 'gi');
                sanitizedText = sanitizedText.replace(regex, '<span class="redacted">$&</span>');
            });

            // @ts-ignore
            outputElement.innerHTML = sanitizedText;
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
  context: vscode.ExtensionContext
) => void;

const openForm: OpenForm = (context) => {
  const panel = vscode.window.createWebviewPanel(
    "formView",
    TITLE,
    vscode.ViewColumn.One,
    { enableScripts: true }
  );

  panel.webview.html = getFormHtml();

  panel.webview.onDidReceiveMessage(
    (message) => {
      if (message.command === "submit") {
        processFiles({ ...message.data }, panel.webview, context);
      }
    },
    undefined,
    context.subscriptions
  );
  return panel;
};

export { openForm, getFormHtml };
