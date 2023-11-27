import { promises as fs } from 'fs';
import path from 'path';

export const getAllPaths = async (rootPath) => {
  const stack = [rootPath];
  const paths = [];

  while (stack.length > 0) {
    const currentPath = stack.pop();

    try {
      const items = await fs.readdir(currentPath, { withFileTypes: true });

      await Promise.all(
        items.map(async (item) => {
          const fullPath = path.join(currentPath, item.name);

          if (item.isDirectory()) {
            stack.push(fullPath);
            paths.push(fullPath);
          }
        })
      );
    } catch (error) {
      console.error(`Error reading directory: ${error.message}`);
    }
  }

  return paths;
};

export default getAllPaths;
