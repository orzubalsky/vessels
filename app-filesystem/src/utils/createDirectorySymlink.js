import { promises as fs } from 'fs'

export const createDirectorySymlink = async (target, linkpath) => {
  try {
    await fs.symlink(target, linkpath, 'dir');
  } catch (err) {
    console.error(err);
  }
}

export default createDirectorySymlink

// (async () => {
//   await createDirectorySymlink('../output/1/target', '../output/source2')
// })()
