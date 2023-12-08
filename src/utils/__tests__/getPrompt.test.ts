import { PromptType } from "../../__types__/types";
import { getPropt } from "../getPropt";

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
