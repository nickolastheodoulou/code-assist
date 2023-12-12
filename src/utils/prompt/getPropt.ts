import * as vscode from "vscode";

import { GetPrompt, PromptType } from "../../__types__/types";

type RedactionRules = {
  original: string,
  replacement: string
}[];

function applyRedactionRules(text: string, context: vscode.ExtensionContext): string {
  const redactionRules:RedactionRules = context.globalState.get("redactionRules", []);

  let redactedText = text;
  let redactionCount = 0;

  redactionRules.forEach((rule) => {
    const originalPattern = new RegExp(rule.original, "gi"); // "i" flag for case-insensitivity
    const replacement = rule.replacement || `redacted${++redactionCount}`;
    redactedText = redactedText.replace(originalPattern, replacement);
  });

  return redactedText;
}

/*
TODO consider adding
    Context: [Add any additional context about the environment or technologies used]

    Objective: [Add specific questions or objectives]
*/
const getPropt: GetPrompt = (
  ticketInfo,
  codeInput,
  rootDir,
  fileTree,
  promptType,
  context
) => {
  let promptMessage = "";

  switch (promptType) {
    case PromptType.CODE_SOLUTION:
      promptMessage =
        "Can you offer a code solution to meet these requirements?";
      break;
    case PromptType.CODE_OPTIMIZATIONS:
      promptMessage =
        "Can you offer code optimizations that meet best practises to meet these requirements?";
      break;
    case PromptType.UNIT_TESTS:
      promptMessage =
        "Can you write me some unit tests to meet these requirements?";
      break;
    default:
      promptMessage = "";
  }

  const nonRedactedPrompt = `I'm looking to update my code to meet the following business requirements with the ticket information:
    
  ${ticketInfo}
    

  This is my key code sections, in an array of objects with the structure { fileName: string, fileContent: string }[]:
  ${JSON.stringify(codeInput)}
  

  This is the file tree of my code starting with \n ${rootDir}. The default max depth is 5:
  ${fileTree}
  
  Let me know if you would like to see further input from the files.
  
  ${promptMessage}
  
  Ideally I'd want to get to a point that I can raise an MR with the suggestions prodived
  `;

  return applyRedactionRules(nonRedactedPrompt, context);
};

export { getPropt, applyRedactionRules };