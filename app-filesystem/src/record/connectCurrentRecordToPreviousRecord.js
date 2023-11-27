import path from 'path'
import getPreviousTagRecord from '../tag/getPreviousTagRecord.js'
import generatePreviousFolderName from '../folder/generatePreviousFolderName.js'
import getRecordMetadata from './getRecordMetadata.js'
import createDirectorySymlink from '../utils/createDirectorySymlink.js'

export const connectCurrentRecordToPreviousRecord = async (rootFolder, messagePath, type = 'Record') => {
  try {
    const { recordFolderName, tagName } = await getRecordMetadata(messagePath)

    const previousRecordPath = await getPreviousTagRecord(rootFolder, recordFolderName, tagName, type)

    if (previousRecordPath) {
      const previousFolderName = generatePreviousFolderName()

      const target = path.resolve(previousRecordPath)

      const source = `${path.resolve(messagePath)}/${previousFolderName}`

      await createDirectorySymlink(target, source)
    }
  } catch (error) {
    console.error(error)
  }
}

export default connectCurrentRecordToPreviousRecord

// (async () => {
//   await createPreviousSymlink('./output', './output/  /    /  ')
// })()