import createFolder from './createFolder.js';

export const createFolders = async (folderArray, targetPath) => {
  for (let folderName of folderArray) {
    try {
      await createFolder(targetPath, folderName);
    } catch (err) {
      console.error(`Error creating message at ${targetPath}:`, err);
    }
  };
}

export default createFolders;
