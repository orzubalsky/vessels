import { QUESTIONS } from '../../../app-interface/constants.js'
import { addQuestionRecord } from '../../../app-filesystem/src/index.js';

export const createInitialQuestionRecords = async (rootFolder) => {
  console.log('\n');

  try {
    for (let questionObject of QUESTIONS) {
      const { tag, question } = questionObject

      const { newRecordPath } = await addQuestionRecord(rootFolder, tag, question);

      console.log(`  ${newRecordPath.substring(rootFolder.length)}`);
    }

    console.log('\n');
  } catch (err) {
    console.error(err)
  }
}

(async () => {
  const ROOT_PATH = process.argv[2];

  await createInitialQuestionRecords(ROOT_PATH)
})();
