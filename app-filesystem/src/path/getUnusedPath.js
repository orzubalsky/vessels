import path from 'path';
import randomInt from '../utils/randomInt.js';
import getAllPaths from './getAllPaths.js';

const getUnusedPath = async (rootPath, minimumDepth = 3, maximumDepth) => {
  const paths = await getAllPaths(rootPath);

  // Filter paths based on depth and other conditions
  const filteredPaths = paths.filter(p => {
    const depth = p.split(path.sep).length - 1;

    if (typeof maximumDepth === 'number') {
      // Check both minimum and maximum depth if maximumDepth is provided
      return depth >= minimumDepth && depth <= maximumDepth &&
        !p.includes(path.sep + '##') && !p.includes(path.sep + '#=') &&
        !p.includes(path.sep + '++') && !p.includes(path.sep + '==') &&
        !p.includes(path.sep + '=~') && !p.includes(path.sep + '~~');
    } else {
      // Check only minimum depth if maximumDepth is not provided
      return depth >= minimumDepth &&
        !p.includes(path.sep + '##') && !p.includes(path.sep + '#=') &&
        !p.includes(path.sep + '++') && !p.includes(path.sep + '==') &&
        !p.includes(path.sep + '=~') && !p.includes(path.sep + '~~');
    }
  });

  if (filteredPaths.length === 0) {
    // No paths meet the depth and condition requirements
    return rootPath;
  }

  const randomIndex = randomInt(0, filteredPaths.length - 1);

  const randomPath = filteredPaths[randomIndex];

  return randomPath;
};

export default getUnusedPath;
