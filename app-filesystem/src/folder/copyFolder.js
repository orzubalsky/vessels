import { promises as fs } from 'fs';
import path from 'path';

export const copyFolder = async (sourceDir, destinationDir) => {
  try {
    // Create the destination directory if it doesn't exist
    await fs.mkdir(destinationDir, { recursive: true });

    // Read the source directory
    const files = await fs.readdir(sourceDir);

    for (const file of files) {
      const sourceFilePath = path.join(sourceDir, file);
      const destinationFilePath = path.join(destinationDir, file);

      // Check if the file is a directory
      const sourceFileStats = await fs.stat(sourceFilePath);
      if (sourceFileStats.isDirectory()) {
        // Recursively copy subdirectories
        await copyFolder(sourceFilePath, destinationFilePath);
      } else {
        // Copy the file
        await fs.copyFile(sourceFilePath, destinationFilePath);
      }
    }
  } catch (error) {
    console.error('Error copying directory:', error);
  }
}

export default copyFolder;
