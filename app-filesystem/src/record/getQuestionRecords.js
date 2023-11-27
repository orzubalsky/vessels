import path from 'path'
import getQuestionPaths from '../path/getQuestionPaths.js'
import readFileContents from '../utils/readFileContents.js'
import getFirstFileInFolder from '../utils/getFirstFileInFolder.js'
import getRecordMetadata from './getRecordMetadata.js'

export const getQuestionRecords = async (rootPath) => {
  const questionPaths = await getQuestionPaths(rootPath)

  const questions = [];

  for (let questionPath of questionPaths) {
    const questionMessageFile = await getFirstFileInFolder(questionPath);

    const parentPath = path.dirname(questionPath);

    const relativePath = `/${path.relative(rootPath, parentPath)}`;

    const relativePathFormatted = relativePath.replace('/output/', '/');

    const recordPath = path.join(questionPath, questionMessageFile);

    const question = await readFileContents(recordPath);

    const { tagName } = await getRecordMetadata(path.dirname(questionPath))

    questions.push({
      path: parentPath,
      question,
      relativePath: relativePathFormatted,
      tag: tagName.toLowerCase()
    })
  }

  return questions;
}

export default getQuestionRecords
