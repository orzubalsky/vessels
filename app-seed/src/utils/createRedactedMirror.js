import { promises as fs } from 'fs';
import path from 'path';

export const createRedactedMirror = async (folderPath, searchString = 'RECORD') => {
  try {
    const files = await fs.readdir(folderPath);

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const stats = await fs.lstat(filePath);
      const parentDirectoryName = path.basename(folderPath);

      if (stats.isDirectory()) {
        // Recursively process subdirectories
        await createRedactedMirror(filePath, searchString);
      } else if (stats.isFile() && parentDirectoryName.includes(searchString)) {
        const newFilePath = path.join(folderPath, 'REDACTED.txt');
        await fs.writeFile(newFilePath, '');
        await fs.unlink(filePath);
        // console.log(`File replaced: ${filePath} -> ${newFilePath}`);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

const ROOT_PATH = process.argv[2];

createRedactedMirror(ROOT_PATH);
