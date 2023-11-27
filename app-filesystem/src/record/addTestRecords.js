import addContributionRecord from './addContributionRecord.js';
import randomInt from '../utils/randomInt.js';
import { TAGS } from '../../../app-interface/constants.js';

export const addTestRecords = async (rootFolder, num) => {
  const tags = Array.from({ length: num }, () => TAGS[randomInt(0, TAGS.length - 1)]);

  for (const tag of tags) {
    await addContributionRecord(rootFolder, tag, 'test');
  }
}

// export default addTestRecords;

(async () => {
  addTestRecords('./output', 30);
})();