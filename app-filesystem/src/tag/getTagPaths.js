import path from 'path'
import { promises as fs } from 'fs'
import getAllPaths from '../path/getAllPaths.js'
import getRecordNumber from '../record/getRecordNumber.js'

export const getTagPaths = async (rootPath, tag, type = 'Record') => {
  const paths = await getAllPaths(rootPath)

  const tagPaths = paths.filter(p => p.toLowerCase().includes(tag.toLowerCase()));

  const numbersPaths = {}

  for (let tagPath of tagPaths) {
    const parentDir = path.dirname(tagPath)

    const directories = await fs.readdir(parentDir)

    const recordFolderName = directories.filter(p => p.toLowerCase().includes(type.toLowerCase()))[0]

    const recordNumber = getRecordNumber(recordFolderName, type.toUpperCase())

    if (recordNumber) {
      numbersPaths[recordNumber] = tagPath
    }
  }

  return numbersPaths
}

export default getTagPaths
