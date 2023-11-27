export const getTagName = (folderName) => {
  // record folder names are in the pattern '==[__ RECORD.87421 __]=='
  // Define a regular expression to match the number inside the string
  const regex = /\s(\w+)\s/;

  // Use the exec method to extract the number
  const match = regex.exec(folderName);

  if (match) {
    // The tag name is captured in the first capture group (index 1)
    return match[1];
  }

  return;
}

export default getTagName;
