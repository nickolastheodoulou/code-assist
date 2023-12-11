import { PromptType } from "../../__types__/types";
import { getTitleFromPromptType } from "../../utils/prompt/getTitleFromPromptType";
import { getFormHtml, openForm } from "../webviewManager";
import * as vscode from 'vscode';

jest.mock('../../utils/prompt/getTitleFromPromptType', () => ({
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

describe('getFormHtml', () => {
    it('returns the correct HTML for a given prompt type', () => {
        (getTitleFromPromptType as jest.Mock).mockReturnValue('Test Title');
        const html = getFormHtml('codeSolution');

        expect(html).toContain('Test Title');
        expect(html).toContain('<title>Form</title>');
        // Further assertions to verify the HTML structure can be added here
    });
});

describe('openForm', () => {
    it('creates a webview panel and sets up message handling', () => {
        const mockPanel = {
            webview: {
                html: '',
                onDidReceiveMessage: jest.fn(),
            },
            onDidDispose: jest.fn(),
            reveal: jest.fn(),
        };
        (vscode.window.createWebviewPanel as jest.Mock).mockReturnValue(mockPanel);

        openForm(PromptType.CODE_SOLUTION, {});

        expect(vscode.window.createWebviewPanel).toHaveBeenCalledWith(
            'formView',
            expect.any(String),
            vscode.ViewColumn.One,
            { enableScripts: true }
        );
        expect(mockPanel.webview.onDidReceiveMessage).toHaveBeenCalled();
    });

});
