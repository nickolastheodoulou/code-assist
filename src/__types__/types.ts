type CodeInput = {
    fileName: string,
    fileContent: string
}[];

enum PromptType {
    CODE_OPTIMIZATIONS = 'codeOptimizations',
    UNIT_TESTS = 'unitTests',
    CODE_SOLUTION = 'codeSolution'
}
type GetPrompt = (
    ticketInfo: string,
    codeInput: CodeInput,
    rootDir: string,
    fileTree: string,
    promptType: PromptType
) => string;


export {
    GetPrompt,
    CodeInput,
    PromptType
};