import * as vscode from 'vscode';

const getHtml = (): string => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redaction Rules</title>
    <style>
        /* Add your CSS styles here */
        .container {
            margin: 20px;
        }
        .rule {
            margin-bottom: 10px;
        }
        .deleteButton {
            margin-left: 10px;
            cursor: pointer;
            color: red;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Redaction Rules Settings</h1>
        <div>
            <input type="text" id="originalText" placeholder="Original Text">
            <input type="text" id="replacementText" placeholder="Replacement Text">
            <button id="addRule">Add Rule</button>
        </div>
        <ul id="rulesList">
            <!-- Rules will be listed here -->
        </ul>
    </div>

    <script>
    const vscode = acquireVsCodeApi();
    
    const rulesList = document.getElementById('rulesList');
    const originalTextInput = document.getElementById('originalText');
    const replacementTextInput = document.getElementById('replacementText');
    document.getElementById('addRule').addEventListener('click', addRule);

    let previousState = vscode.getState() || { rules: [] };
    previousState.rules.forEach(displayRule);

        function addRule() {
            const original = originalTextInput.value.trim();
            const replacement = replacementTextInput.value.trim();

            if (original) {
                const rule = { original, replacement };
                previousState.rules.push(rule);
                displayRule(rule);

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
    return panel
};

export {
    openSettings,
};
