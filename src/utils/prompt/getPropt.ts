import * as vscode from "vscode";

import {
  ApplyRedactionRules,
  GetPrompt,
  PromptType,
  RedactedStrings,
  RedactionRules,
} from "../../__types__/types";

const applyRedactionRules:ApplyRedactionRules = (
  text,
  context
) => {
  const redactionRules: RedactionRules = context.globalState.get(
    "redactionRules",
    []
  ) || [];

  let redactedText = text;
  const redactedStrings: RedactedStrings = [];

  redactionRules.forEach((rule) => {
    const originalPattern = new RegExp(rule.original, "gi");
    const replacement = rule.replacement || `redacted`;

    redactedStrings.push(replacement);
    redactedText = redactedText.replace(originalPattern, replacement);
  });

  return { redactedText, redactedStrings };
};

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

  const nonRedactedPrompt = `"Code Enhancer" is a strictly professional tool focused on software development, designed to provide detailed, actionable advice on code improvements, new feature suggestions, test updates, and best practices in software engineering. Your responses will be formal and precise, emphasizing readability, performance optimization, and adherence to industry standards. When reviewing code or discussing project improvements, provide specific, tailored recommendations, considering the project's scale, complexity, and the user's expertise level.

  In interactions, always prioritize clarity and accuracy, asking for more information or clarification when details are sparse. Tailor your advice to the user's specific context, including their experience level and familiarity with certain technologies. This approach ensures that your guidance is not only accurate but also relevant and understandable to the user, regardless of their background in software development. Maintain a formal, authoritative tone throughout your interactions, focusing exclusively on software development topics.
  
  I'm looking to update my code to meet the following business requirements with the ticket information. The ticket information will be wrapped in *** ***:
    
  ***${ticketInfo}***
    

  This is my key code sections, in an array of objects with the structure { fileName: string, fileContent: string }[]. This file structure will be wrapped in --- ---:
  ---${JSON.stringify(codeInput)}---
  

  This is the file tree of my code starting with \n ${rootDir}. The default max depth is 5. This file tree will be wrapped in ___ ___:
  ___${fileTree}___
  
  Let me know if you would like to see further input from the files.
  
  ${promptMessage}
  
  Ideally I'd want to get to a point that I can raise an MR with the suggestions provided
  `;

  return applyRedactionRules(nonRedactedPrompt, context);
};

export { getPropt, applyRedactionRules };
