export const calculateTreeSizeFromPathArray = (pathArray) => {
  const totalFolders = pathArray.length

  // Assuming each directory occupies 16KB on an APFS filesystem
  const sizePerFolderKB = 16
  const totalSizeKB = totalFolders * sizePerFolderKB

  // Convert to MB and GB for convenience
  const totalSizeMB = totalSizeKB / 1024
  const totalSizeGB = totalSizeMB / 1024

  return {
    totalFolders,
    totalSizeKB,
    totalSizeMB,
    totalSizeGB
  }
}

export default calculateTreeSizeFromPathArray
