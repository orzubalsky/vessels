import getNextTagIndex from '../tag/getNextTagIndex.js'

export const generateRecordLabel = async (rootPath, tag, type = 'Record') => {
  try {
    const number = await getNextTagIndex(rootPath, tag, type)

    return `${type}_${number}`;
  } catch (error) {
    console.error(error)
  }
}

export default generateRecordLabel;
