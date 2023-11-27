import { promises as fs } from 'fs';
import path from 'path';

/**
 * Create a directory at the given path.
 * @param {string} dirPath - Directory path to be created.
 * @returns {Promise<void>}
 */
export const createFolder = async (dirPath, folderName) => {
  const fullPath = path.join(dirPath, folderName)

  try {
    // Use { recursive: true } to create parent directories if needed.
    await fs.mkdir(fullPath, { recursive: true });
  } catch (err) {
    console.error(`Error creating directory at ${fullPath}:`, err);
  }
}

export default createFolder;
