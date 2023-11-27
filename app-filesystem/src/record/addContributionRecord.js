import path from 'path';
import addRecord from './addRecord.js';
import connectPreviousRecordToCurrentRecord from './connectPreviousRecordToCurrentRecord.js'
import connectCurrentRecordToPreviousRecord from './connectCurrentRecordToPreviousRecord.js';
import createRecordMessage from './createRecordMessage.js';
import getRecordMetadata from './getRecordMetadata.js';
import generateRecordLabel from './generateRecordLabel.js';

export const addContributionRecord = async (rootFolder, tag, content) => {
  try {
    // Generate label with current index for tag
    const label = await generateRecordLabel(rootFolder, tag);

    const { folderArray, newRecordPath } = await addRecord(rootFolder, tag, label, 3);

    // Create txt file for record
    const messageFilePath = path.join(newRecordPath, folderArray[3]);

    if (content) {
      await createRecordMessage(messageFilePath, `${label}.txt`, content);
    }

    // Create symlink from the newly created message to the previous one
    await connectCurrentRecordToPreviousRecord(rootFolder, newRecordPath);

    // Create symlink from the previous message to the newly created one
    await connectPreviousRecordToCurrentRecord(rootFolder, newRecordPath);

    const recordPath = encodeURI(path.relative(rootFolder, newRecordPath));

    return { tag, label, recordFolderName: folderArray[3], recordPath, recordPathFull: newRecordPath, success: true };
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export default addContributionRecord;
