export const getRecordNumber = (folderName, type = 'RECORD') => {
  // record folder names are in the pattern '==[__ RECORD_87421 __]=='
  // question folder names are in the pattern '==[__ QUESTION_87421 __]=='
  // Define a regular expression to match the number inside the string
  let regex = /.*RECORD.(\d+).*/;

  if (type === 'QUESTION') {
    regex = /.*QUESTION.(\d+).*/;
  }

  // Use the exec method to extract the number
  const match = regex.exec(folderName);

  if (match) {
    // The number is captured in the first capture group (index 1)
    return parseInt(match[1], 10);
  }

  return;
}

export default getRecordNumber;
