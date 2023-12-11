import * as vscode from 'vscode';
import { CodeAssistTreeItem } from '../treeView';

jest.mock('vscode', () => ({
    TreeItem: jest.fn(),
}));

describe('CodeAssistTreeItem', () => {
    it('should instantiate correctly', () => {
        const command: vscode.Command = { command: 'testCommand', title: 'Test' };
        const item = new CodeAssistTreeItem('Test Label', command);

        expect(vscode.TreeItem).toHaveBeenCalledWith('Test Label');
        expect(item.label).toBe('Test Label');
        expect(item.command).toEqual(command);
    });
});
