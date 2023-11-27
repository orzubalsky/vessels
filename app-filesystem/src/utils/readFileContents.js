import { promises as fs } from 'fs';

export const readFileContents = async (path) => {
  try {
    // Read the contents of the first file
    const data = await fs.readFile(`${path}`, 'utf8');

    return data;
  } catch (err) {
    console.error('Error:', err);
  }
}

export default readFileContents;
