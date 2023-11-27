import { promises as fs } from 'fs'
import getRecordNumber from './getRecordNumber.js'
import getTagName from '../tag/getTagName.js'

export const getRecordMetadata = async (recordDir, type = 'Record') => {
  const directories = await fs.readdir(recordDir)

  const recordFolderName = directories.filter(p => p.toLowerCase().includes(type.toLowerCase()))[0]

  const recordNumber = getRecordNumber(recordFolderName)

  const tagFolderName = directories.filter(p => p.toLowerCase().includes('++['.toLowerCase()))[0]

  const tagName = getTagName(tagFolderName)

  return {
    recordDir,
    recordFolderName,
    recordNumber,
    tagFolderName,
    tagName
  }
}

export default getRecordMetadata