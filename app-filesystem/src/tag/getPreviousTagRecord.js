import path from 'path'
import getRecordNumber from '../record/getRecordNumber.js'
import getTagPaths from './getTagPaths.js'

export const getPreviousTagRecord = async (rootFolder, recordFolderName, tag, type = 'Record') => {
  const tagPaths = await getTagPaths(rootFolder, tag, type)

  const tagRecordNumbers = Object.keys(tagPaths)

  if (tagRecordNumbers.length <= 1) return false

  const recordNumber = getRecordNumber(recordFolderName)

  let closestRecordNumber = null

  for (let i = 0; i < tagRecordNumbers.length; i++) {
    if (tagRecordNumbers[i] < recordNumber) {
      closestRecordNumber = tagRecordNumbers[i]
    } else {
      // Stop searching once we've passed the target
      break;
    }
  }

  // Use lastest record number if no previous record number is found
  if (closestRecordNumber === null) {
    closestRecordNumber = Math.max(...tagRecordNumbers)
  }

  // Return parent of tag path
  return path.resolve(path.dirname(tagPaths[closestRecordNumber]))
}

export default getPreviousTagRecord

// (async () => {
//   const r = await findPreviousMessageForTag('./output', '==[____ RECORD_3 ____]==', 'tactics')
//   console.log(r)
// })()