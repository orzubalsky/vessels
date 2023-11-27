import os from 'os';
import fs from 'fs';
import path from 'path';

export const findFolder = (ROOT_PATH, folderName) => {
  const files = fs.readdirSync(ROOT_PATH);

  for (const file of files) {
    const fullPath = path.join(ROOT_PATH, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {

      if (file.includes(folderName)) {
        // Found the app-filesystem folder
        return fullPath;
      } else {
        // Continue searching recursively
        const result = findFolder(fullPath, folderName);
        if (result) {
          return result;
        }
      }
    }
  }
}

export const findNetworkInterfaceWithIPv4 = () => {
  const networkInterfaces = os.networkInterfaces();
  for (const interfaceName in networkInterfaces) {
    const interfaceInfo = networkInterfaces[interfaceName];
    for (const info of interfaceInfo) {
      if (info.family === 'IPv4' && !info.internal) {
        return {
          name: interfaceName,
          address: info.address,
        };
      }
    }
  }
  return null; // No suitable network interface found
}