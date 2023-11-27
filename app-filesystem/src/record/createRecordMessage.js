import { promises as fs } from 'fs'
import path from 'path'

/**
 * Create a txt file with some content at the given path.
 * @param {string} dirPath - Directory path where the txt file should be created.
 * @param {string} filename - Name of the file to be created.
 * @param {string} content - Content of file to be created.
 * @returns {Promise<void>}
 */
export const createRecordMessage = async (dirPath, filename, content) => {
  const fullPath = path.join(dirPath, filename)

  try {
      await fs.writeFile(fullPath, content)
  } catch (err) {
      console.error(`Error creating file at ${fullPath}:`, err)
  }
}

export default createRecordMessage
