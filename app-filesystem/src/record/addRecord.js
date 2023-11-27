import createFolders from '../folder/createFolders.js';
import generateRecordFolderArray from '../folder/generateFolderNameArray.js';
import getUnusedPath from '../path/getUnusedPath.js';

export const addRecord = async (rootFolder, tag, label, minimumDepth = 3, maximumDepth) => {
  try {
    const min = minimumDepth ? parseInt(minimumDepth, 10) : undefined;
    const max = maximumDepth ? parseInt(maximumDepth, 10) : undefined;

    // Find a folder that doesn't have a contribution yet
    const newRecordPath = await getUnusedPath(rootFolder, min, max);

    // Generate folder names for record
    const folderArray = generateRecordFolderArray(tag, label);

    // Create folders for record
    await createFolders(folderArray, newRecordPath);

    return { folderArray, tag, label, newRecordPath, success: true };
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export default addRecord;
