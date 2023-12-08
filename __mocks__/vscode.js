const vscode = {
    window: {
        showInformationMessage: jest.fn(),
        // Mock other methods or properties you use from `vscode.window`
    },
    // Mock other parts of the vscode API as necessary
};

module.exports = vscode;
