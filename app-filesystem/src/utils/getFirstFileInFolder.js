import { promises as fs } from 'fs'

export const getFirstFileInFolder = async (path) => {
  try {
    const files = await fs.readdir(path);

    if (files.length === 0) {
      return;
    }

    const firstFile = files[0];

    return firstFile;
  } catch (err) {
    console.error('Error:', err);
  }
}

export default getFirstFileInFolder;
