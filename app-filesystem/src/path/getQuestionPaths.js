import getAllPaths from './getAllPaths.js'

export const getQuestionPaths = async (rootPath) => {
  const paths = await getAllPaths(rootPath)

  const questionPaths = paths.filter(p => p.toLowerCase().includes('Question'.toLowerCase()));

  return questionPaths;
}

export default getQuestionPaths
