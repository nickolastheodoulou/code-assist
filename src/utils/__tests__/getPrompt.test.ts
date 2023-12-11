import * as vscode from 'vscode';

import { PromptType } from "../../__types__/types";
import { getPropt, applyRedactionRules } from "../getPropt";

jest.mock('vscode', () => ({
    workspace: {
        getConfiguration: jest.fn(() => ({
            get: jest.fn().mockReturnValue([])
        }))
    }
}));

describe('getPropt', () => {
    const ticketInfo = 'Ticket Information';
    const codeInput = [
        { fileName: 'file1.js', fileContent: 'console.log("Hello World");' },
        { fileName: 'file2.js', fileContent: 'console.log("Goodbye World");' }
    ];
    const rootDir = '/root/directory';
    const fileTree = 'file1.js\nfile2.js';

    it('returns prompt for CODE_SOLUTION', () => {
        const result = getPropt(ticketInfo, codeInput, rootDir, fileTree, PromptType.CODE_SOLUTION);
        expect(result).toContain('Can you offer a code solution to meet these requirements?');
        expect(result).toContain(ticketInfo);
        expect(result).toContain(JSON.stringify(codeInput));
        expect(result).toContain(fileTree);
    });

    it('returns prompt for CODE_OPTIMIZATIONS', () => {
        const result = getPropt(ticketInfo, codeInput, rootDir, fileTree, PromptType.CODE_OPTIMIZATIONS);
        expect(result).toContain('Can you offer code optimizations that meet best practises to meet these requirements?');
        expect(result).toContain(ticketInfo);
        expect(result).toContain(JSON.stringify(codeInput));
        expect(result).toContain(fileTree);
    });

    it('returns prompt for UNIT_TESTS', () => {
        const result = getPropt(ticketInfo, codeInput, rootDir, fileTree, PromptType.UNIT_TESTS);
        expect(result).toContain('Can you write me some unit tests to meet these requirements?');
        expect(result).toContain(ticketInfo);
        expect(result).toContain(JSON.stringify(codeInput));
        expect(result).toContain(fileTree);
    });

    it('returns a default prompt when prompt type is not recognized', () => {
        const result = getPropt(ticketInfo, codeInput, rootDir, fileTree, 'UNKNOWN' as PromptType);
        expect(result).toContain(ticketInfo);
        expect(result).toContain(JSON.stringify(codeInput));
        expect(result).toContain(fileTree);
        expect(result).not.toContain('Can you offer');
        expect(result).not.toContain('Can you write me');
    });
});

describe('applyRedactionRules', () => {
    let getConfigurationMock: jest.Mock<any, any, any>;

    beforeEach(() => {
        getConfigurationMock = jest.fn().mockReturnValue({
            get: jest.fn().mockReturnValue([])
        });
        vscode.workspace.getConfiguration = getConfigurationMock;
    });

    test('replaces specified strings with their replacements', () => {
        getConfigurationMock.mockReturnValueOnce({
            get: jest.fn().mockReturnValueOnce([
                { original: 'secret', replacement: 'classified' },
                { original: 'password', replacement: 'passcode' }
            ])
        });

        const result = applyRedactionRules('This is a Secret and here is a PassWord');
        expect(result).toBe('This is a classified and here is a passcode');
    });

    test('uses redactedN for strings without a specified replacement', () => {
        getConfigurationMock.mockReturnValueOnce({
            get: jest.fn().mockReturnValueOnce([
                { original: 'username' },
                { original: 'email' }
            ])
        });

        const result = applyRedactionRules('UserNAME and EmAiL are redacted');
        expect(result).toBe('redacted1 and redacted2 are redacted');
    });

});
