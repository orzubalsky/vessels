import path from 'path'
import getPreviousTagRecord from '../tag/getPreviousTagRecord.js'
import generateNextFolderName from '../folder/generateNextFolderName.js'
import getRecordMetadata from './getRecordMetadata.js'
import createDirectorySymlink from '../utils/createDirectorySymlink.js'

export const connectPreviousRecordToCurrentRecord = async (rootFolder, recordPath, type = 'Record') => {
  try {
    const { recordFolderName, tagName } = await getRecordMetadata(recordPath)

    const previousRecordPath = await getPreviousTagRecord(rootFolder, recordFolderName, tagName, type)

    if (previousRecordPath) {
      const nextFolderName = generateNextFolderName()

      const target = path.resolve(recordPath)

      const source = `${path.resolve(previousRecordPath)}/${nextFolderName}`

      await createDirectorySymlink(target, source)
    }
  } catch (error) {
    console.error(error)
  }
}

export default connectPreviousRecordToCurrentRecord

// (async () => {
//   await createNextSymlinkToCurentMessage('./output', './output/  /    /  ')
// })()