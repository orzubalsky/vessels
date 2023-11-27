import getTagPaths from './getTagPaths.js'

export const getNextTagIndex = async (rootFolder, tag, type = 'Record') => {
  try {
    const tagPaths = await getTagPaths(rootFolder, tag, type)

    const recordNumbers = Object.keys(tagPaths)

    if (recordNumbers.length === 0) return 1

    if (recordNumbers.length === 1 && recordNumbers[0] === 'undefined') return 1

    const maxRecordNumber = Math.max(...recordNumbers)

    return maxRecordNumber + 1
  } catch (error) {
    console.error(error)
  }
}

export default getNextTagIndex
