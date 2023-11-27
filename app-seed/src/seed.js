import calculateTreeSizeFromPathArray from './utils/calculateTreeSizeFromPathArray.js'
import createFolderStructure from './utils/createFolderStructure.js'

if (process.argv.length !== 3) {
  console.error('Usage: node seed.js ROOT_PATH');
  process.exit(1); // Exit with an error code
}

const seed = async (ROOT_PATH) => {
    // Folder structure ranges:
  // [min, max] for each depth level
  const nodeRanges = [
    [2, 3],
    [2, 10],
    [2, 10],
    [6, 10],
    // [6, 12],
    // [6, 10],
    // [2, 4]
  ]

  try {
    const generatedPaths = await createFolderStructure(ROOT_PATH, nodeRanges);

    const result = calculateTreeSizeFromPathArray(generatedPaths)

    console.log(`  Total folders: ${result.totalFolders}`)
    console.log(`  Total size (MB): ${result.totalSizeMB.toFixed(2)}`)
    console.log(`  Total size (GB): ${result.totalSizeGB.toFixed(2)}`)
    console.log('\n')
  } catch (err) {
    console.error(err);
  }
}

(async () => {
  const ROOT_PATH = process.argv[2];

  await seed(ROOT_PATH)
})();
