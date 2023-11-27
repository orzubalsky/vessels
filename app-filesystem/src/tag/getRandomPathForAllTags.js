import path from 'path'
import randomInt from '../utils/randomInt.js'
import getTagPaths from './getTagPaths.js'

export const getRandomPathForAllTags = async (rootPath, tags, type = 'Record') => {
  const paths = {}

  for (let tagName of tags) {
    const tagPathsObject = await getTagPaths(rootPath, tagName, type)

    const tagPaths = Object.values(tagPathsObject)

    if (tagPaths.length === 0) continue

    const randomPath = tagPaths[randomInt(0, tagPaths.length - 1)]

    const parentDir = path.dirname(randomPath)

    const relativePath = path.relative(rootPath, parentDir);

    paths[tagName] = {
      relativePath: `${relativePath}/`,
      relativePathFormatted: relativePath.replace('output/', '/')
    }
  }

  return paths
}

export default getRandomPathForAllTags

// (async () => const r = await getRandomPathForAllTags('./output', [ 'healing', 'tactics' ]); console.log(r); )()