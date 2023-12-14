import * as fs from "fs";
import * as path from "path";

const IGNORED_FILES = ["node_modules"];

type FileTreeOptions = {
  level?: number;
  maxDepth?: number;
};

const existsAsync = async (filePath: string): Promise<boolean> => {
  try {
    await fs.promises.access(filePath);
    return true;
  } catch {
    return false;
  }
};

const isDirectoryAsync = async (filePath: string): Promise<boolean> => {
  try {
    const stats = await fs.promises.stat(filePath);
    return stats.isDirectory();
  } catch {
    return false;
  }
};

async function generateFileTree(
  dirPath: string,
  options: FileTreeOptions = {}
): Promise<string> {
  const { level = 0, maxDepth = 5 } = options;

  // Validate directory path
  if (
    level > maxDepth ||
    !(await existsAsync(dirPath)) ||
    !(await isDirectoryAsync(dirPath))
  ) {
    return "";
  }

  // Process directory
  let tree = "";
  const files = await fs.promises.readdir(dirPath);

  for (const file of files) {
    if (IGNORED_FILES.includes(file)) {
      continue;
    }

    tree += " ".repeat(level * 2) + file + "\n";
    const filePath = path.join(dirPath, file);

    if (await isDirectoryAsync(filePath)) {
      tree += await generateFileTree(filePath, { level: level + 1, maxDepth });
    }
  }

  return tree;
}

export { generateFileTree };
