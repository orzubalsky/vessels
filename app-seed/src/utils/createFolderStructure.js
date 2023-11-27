import { promises as fs } from 'fs'
import path from 'path'
import randomInt from './randomInt.js'
import folderNameFromIntegar from './folderNameFromIntegar.js'

export const createFolderStructure = async (rootPath, depthRanges) => {
  try {
    await fs.mkdir(rootPath, { recursive: true });

    let generatedPaths = []

    if (depthRanges.length === 0) {
      return generatedPaths
    }

    const [min, max] = depthRanges[0]
    const nodesAtThisDepth = randomInt(min, max)

    for (let i = 1; i <= nodesAtThisDepth; i++) {
      const folderName = folderNameFromIntegar(i)
      const folderPath = path.join(rootPath, folderName)
      generatedPaths.push(folderPath)

      await fs.mkdir(folderPath, { recursive: true })

      const childPaths = await createFolderStructure(folderPath, depthRanges.slice(1))

      generatedPaths = [...generatedPaths, ...childPaths]
    }

    return generatedPaths
  } catch (error) {
    console.error('Error seeding file system:', error)
  }
}

export default createFolderStructure
