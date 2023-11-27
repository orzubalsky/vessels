export const generateNextFolderName = (width = 24) => {
  return '~~[' + '_'.repeat(width - 7) + '>>]~~';
}

export default generateNextFolderName