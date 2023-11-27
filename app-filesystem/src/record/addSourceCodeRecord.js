import path from 'path'
import addRecord from './addRecord.js'
import copyFolder from '../folder/copyFolder.js'

if (process.argv.length < 7) {
  console.error('Usage: node addSourceCodeRecord.js ROOT_PATH SOURCE_PATH TAG LABEL MIN_DEPTH MAX_DEPTH');
  process.exit(1);
}

const addSourceCodeRecord = async (rootFolder, sourceDirectory, tag, label, minimumDepth, maximumDepth) => {
  const { folderArray, newRecordPath } = await addRecord(rootFolder, tag, label, minimumDepth, maximumDepth);

  const labelFolderName = folderArray[3];

  const destinationPath = path.join(newRecordPath, labelFolderName);

  await copyFolder(sourceDirectory, destinationPath);

  return { destinationPath, labelFolderName }
}

(async () => {
  const ROOT_PATH = process.argv[2];
  const SOURCE_PATH = process.argv[3];
  const TAG = process.argv[4];
  const LABEL = process.argv[5];
  const MIN_DEPTH = process.argv[6];
  const MAX_DEPTH = process.argv[7];

  const { destinationPath } = await addSourceCodeRecord(ROOT_PATH, SOURCE_PATH, TAG, LABEL, MIN_DEPTH, MAX_DEPTH)

  console.log(`  ${destinationPath}`);
})()