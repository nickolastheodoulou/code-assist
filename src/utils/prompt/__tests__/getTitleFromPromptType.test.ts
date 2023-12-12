import { getTitleFromPromptType } from "../getTitleFromPromptType";

describe("getTitleFromPromptType", () => {
  it('should return "1. Generate Code Solution" for codeSolution', () => {
    const title = getTitleFromPromptType("codeSolution");
    expect(title).toBe("1. Generate Code Solution");
  });

  it('should return "2. Generate Unit Tests" for unitTests', () => {
    const title = getTitleFromPromptType("unitTests");
    expect(title).toBe("2. Generate Unit Tests");
  });

  it('should return "3. Generate Code Optimizations" for codeOptimizations', () => {
    const title = getTitleFromPromptType("codeOptimizations");
    expect(title).toBe("3. Generate Code Optimizations");
  });

  it('should return "Form View" for default case', () => {
    const title = getTitleFromPromptType("");
    expect(title).toBe("Form View");
  });

  // Test for an unrecognized promptType
  it('should return "Form View" for unrecognized promptType', () => {
    const title = getTitleFromPromptType("someRandomType");
    expect(title).toBe("Form View");
  });
});
