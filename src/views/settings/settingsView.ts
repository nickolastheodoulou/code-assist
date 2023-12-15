import * as vscode from 'vscode';

const getHtml = (): string => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redaction Rules</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #C0C0CD; /* Default text color */
            background-color: #343541; /* Light mode background */
        }
        
        @media (prefers-color-scheme: dark) {
            body {
                color: #fff; /* White text for dark mode */
                background-color: #343541; /* Dark mode background */
            }
        }
        /* Dark mode styles */
        @media (prefers-color-scheme: dark) {
            .container {
                color: #fff; /* White text for dark mode */
                background-color: #343541; /* Dark mode background */
            }
            .tooltip .tooltiptext {
                background-color: #555; /* Darker background for tooltip */
            }
        }
        .rule {
            margin-bottom: 10px;
        }
        .deleteButton {
            margin-left: 10px;
            cursor: pointer;
            color: red;
        }
        .tooltip {
            position: relative;
            display: inline-block;
            border-bottom: 1px dotted black; /* If you need a dotted underline */
        }

        input {
            background-color: #343541;
        }
        .input-container {
            display: flex;
            flex-direction: column;
            margin-bottom: 15px;
        }
        
        input[type="text"] {
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            background-color: #f5f5f5; /* Light mode */
        }
        
        input[type="text"]:focus {
            border-color: #0078D4;
            outline: none;
            background-color: #005a9e;
        }
        
        button#addRule {
            padding: 10px 15px;
            background-color: #0078D4;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        
        button#addRule:hover {
            background-color: #005a9e;
        }
        
        ul#rulesList {
            list-style-type: none;
            padding: 0;
        }
        
        ul#rulesList li {
            background-color: #f9f9f9; /* Light mode */
            border: 1px solid #ccc;
            padding: 8px;
            margin-top: 5px;
            border-radius: 4px;
        }
        
        
        .deleteButton {
            float: right;
            background-color: #ff4d4d;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 2px 6px;
            margin-left: 10px;
            cursor: pointer;
        }
        
        .deleteButton:hover {
            background-color: #ff3333;
        }
        
        /* Dark mode styles */
        @media (prefers-color-scheme: dark) {
            input[type="text"], 
            ul#rulesList li {
                background-color: #2c2c2c; /* Dark mode background */
                color: #fff;
                border-color: #444;
            }
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
            left: 50%;
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
        <h1>Redaction Rules Settings</h1>
        <div>
        <div class="input-container">
        <label for="originalText">Original Text: 
            <span class="tooltip">?
            <span class="tooltiptext">Text to redact from the generated prompt.</span>
            </span>
            </label>
        <input type="text" id="originalText" name="originalText" placeholder="e.g. google.com">
        </div>
        
        <div class="input-container">
            <label for="replacementText">Replacement Text: 
                <span class="tooltip">?
                <span class="tooltiptext">Replacement for the original text. Defaults to <strong>redactedN</strong> if left blank.</span>
                </span>
            </label>
            <input type="text" id="replacementText" name="replacementText" placeholder="e.g. searchEngine.com">
        </div>
            <button id="addRule">Add Rule</button>
        </div>
        <ul id="rulesList">
            <!-- Rules will be listed here -->
        </ul>

    <script>
    const vscode = acquireVsCodeApi();
    
    const rulesList = document.getElementById('rulesList');
    const originalTextInput = document.getElementById('originalText');
    const replacementTextInput = document.getElementById('replacementText');
    document.getElementById('addRule').addEventListener('click', addRule);

    let previousState = vscode.getState() || { rules: [] };
    previousState.rules.forEach(displayRule);

    function renderRulesList() {
        rulesList.innerHTML = '';
        previousState.rules.forEach(displayRule);
    }

    function addRule() {
        const original = originalTextInput.value.trim();
        const replacement = replacementTextInput.value.trim();
    
        if (original) {
            // Check if a rule with the same original text already exists
            const existingRuleIndex = previousState.rules.findIndex(rule => rule.original === original);
    
            if (existingRuleIndex >= 0) {
                // Update existing rule
                previousState.rules[existingRuleIndex].replacement = replacement;
            } else {
                // Add new rule
                const rule = { original, replacement };
                previousState.rules.push(rule);
            }
    
            // Re-render the rules list and clear inputs
            renderRulesList();
            originalTextInput.value = '';
            replacementTextInput.value = '';
            updateState();
        }
    }

        function displayRule(rule, index) {
            const listItem = document.createElement('li');
            listItem.classList.add('rule');
            listItem.textContent = \`\${rule.original} -> \${rule.replacement || 'redactedN'}\`;

            const deleteButton = document.createElement('span');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('deleteButton');
            deleteButton.onclick = function() { deleteRule(index); };
            listItem.appendChild(deleteButton);

            rulesList.appendChild(listItem);
        }

        function deleteRule(index) {
            previousState.rules.splice(index, 1);
            rulesList.innerHTML = '';
            previousState.rules.forEach(displayRule);
            updateState();
        }

        function updateState() {
            vscode.setState(previousState);
            // Send updated state to VS Code
            vscode.postMessage({ command: 'updateRules', data: previousState.rules });
        }

        function loadPersistedRules(rules) {
            rulesList.innerHTML = '';  // Clear existing rules
            rules.forEach(rule => {
                displayRule(rule);
            });
            previousState.rules = rules;
            updateState();
        }

        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.command) {
                case 'loadRules':
                    loadPersistedRules(message.data);
                    break;
            }
        });
    </script>
</body>
</html>`;
};

type OpenSettings = (
    context: vscode.ExtensionContext
) => void;


const openSettings: OpenSettings = (context) => {
    const panel = vscode.window.createWebviewPanel(
        'formView',
        'Redaction Rules Settings',
        vscode.ViewColumn.One,
        { enableScripts: true }
    );

    panel.webview.html = getHtml();

    // Retrieve persisted rules and send them to the webview
    const persistedRules = context.globalState.get('redactionRules', []);
    panel.webview.postMessage({ command: 'loadRules', data: persistedRules });

    function handleUpdateRules(rules: any) {
        context.globalState.update('redactionRules', rules);
    }

    panel.webview.onDidReceiveMessage(
        message => {
            switch (message.command) {
                case 'updateRules':
                    handleUpdateRules(message.data);
                    break;
            }
        },
        undefined,
        context.subscriptions
    );
    return panel;
};

export {
    openSettings,
    getHtml,
};
