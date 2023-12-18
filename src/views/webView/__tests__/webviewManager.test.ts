import { getTitleFromPromptType } from "../../../utils/prompt/getTitleFromPromptType";
import * as vscode from 'vscode';
import { getFormHtml, openForm } from "../webviewManager";
import TITLE from "../../../utils/constants/title";
import { PromptType } from "../../../__types__/types";

jest.mock('../../../utils/prompt/getTitleFromPromptType', () => ({
    getTitleFromPromptType: jest.fn(),
}));

jest.mock('vscode', () => ({
    window: {
        createWebviewPanel: jest.fn(),
    },
    ViewColumn: {
        One: 1, // Mocking ViewColumn.One
    },
}));

const getMock = jest.fn();
const updateMock = jest.fn();

const mockExtensionContext = {
    globalState: {
      get: getMock,
      update: updateMock,
    },
  } as unknown as vscode.ExtensionContext;

describe('getFormHtml', () => {
    it('returns the correct HTML for a given prompt type', () => {
        (getTitleFromPromptType as jest.Mock).mockReturnValue('Test Title');
        const html = getFormHtml();

        expect(html).toContain(TITLE);
        expect(html).toContain('<title>Form</title>');
        expect(html).toMatch(/<input[^>]+id="files"/); // Checks if input for files exists
        expect(html).toMatch(/<textarea[^>]+id="ticket-info"/); // Checks if textarea for ticket-info exists
        expect(html).toMatch(/<button[^>]+id="copyButton"/); // Checks if the copy button exists
        expect(html).toMatch(/<div[^>]+id="output"/); // Checks if the output div exists
    });
});

describe('openForm', () => {
    beforeEach(() => {
        getMock.mockReturnValueOnce([]);
      });
      const mockPanel = {
        webview: {
            html: '',
            postMessage: jest.fn(),
            onDidReceiveMessage: jest.fn().mockImplementation((handler) => {
                // Simulate a message being posted to the webview
                handler({ command: 'displayOutput', data: { redactedText: 'example', redactedStrings: ['test'] } });
                handler({ command: 'restoreState', data: { files: 'example', ticketInfo: 'ticket info...', promptType: PromptType.CODE_OPTIMIZATIONS} });
                // Add more simulations as needed
            }),
        },
        // ... other mock properties ...
    };
    it('creates a webview panel and sets up message handling', () => {
        (vscode.window.createWebviewPanel as jest.Mock).mockReturnValue(mockPanel);

        openForm(mockExtensionContext);

        expect(vscode.window.createWebviewPanel).toHaveBeenCalledWith(
            'formView',
            expect.any(String),
            vscode.ViewColumn.One,
            { enableScripts: true }
        );
        expect(mockPanel.webview.onDidReceiveMessage).toHaveBeenCalled();
    });

    it('handles messages correctly', () => {
       
        (vscode.window.createWebviewPanel as jest.Mock).mockReturnValue(mockPanel);

        openForm(mockExtensionContext);

        // Test if the message handler was invoked
        expect(mockPanel.webview.onDidReceiveMessage).toHaveBeenCalled();

        // Further assertions to check if the message was handled as expected
    });

});


// describe('applyRedactedClass', () => {
//     it('correctly sanitizes and redacts HTML content', () => {
//         // Set up a JSDOM instance to simulate the browser's environment
//         const dom = new JSDOM(`<!DOCTYPE html><p id="output"></p>`);
//         global.document = dom.window.document;
// 
// 
//         // Example HTML and redaction strings
//         const exampleHTML = '<div>Some <script>alert("xss")</script> content</div>';
//         const redactedStrings = ['content'];
// 
//         // Apply the redaction
//         applyRedactedClass(exampleHTML, redactedStrings);
// 
//         // Assertions
//         const outputElement = document.getElementById('output');
//         // @ts-ignore
//         expect(outputElement.innerHTML).not.toContain('<script>');
//         // @ts-ignore
//         expect(outputElement.innerHTML).toContain('<span class="redacted">content</span>');
//     });
// });