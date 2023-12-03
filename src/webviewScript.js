const vscode = acquireVsCodeApi();
console.log('hello');
document.getElementById('submitButton').addEventListener('click', () => {
    const input = document.getElementById('fileInput').value;
    vscode.postMessage({
        command: 'submit',
        text: input
    });
});
