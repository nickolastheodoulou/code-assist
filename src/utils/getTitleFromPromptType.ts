const getTitleFromPromptType = (promptType: string): string => {
  let title = "";
  switch (promptType) {
    case "codeSolution":
      title = "1. Generate Code Solution";
      break;
    case "unitTests":
      title = "2. Generate Unit Tests";
      break;
    case "codeOptimizations":
      title = "3. Generate Code Optimizations";
      break;
    default:
      title = "Form View";
      break;
  }
  return title;
};

export { getTitleFromPromptType };
