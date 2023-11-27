export const generateRecordFolderArray = (tag, label, width = 24) => {
  // First line in the format of ##==================
  const lineOne = '##' + '='.repeat(width - 2);

  // Second line in the format of #=[~~~~~~~~~~~~~]==
  const lineTwoBorderLeft = '#=[';
  const lineTwoBorderRight = ']==';
  const lineTwoScaffoldingLength = `${lineTwoBorderLeft}${lineTwoBorderRight}`.length;
  const lineTwoSpaceFiller = '~'.repeat((width - lineTwoScaffoldingLength));
  const lineTwo = `${lineTwoBorderLeft}${lineTwoSpaceFiller}${lineTwoBorderRight}`;

  // Tag line in the format of ++[__ TAG-NAME ___]++
  const tagBorderLeft = '++[';
  const tagBorderRight = ']++';
  const tagScaffoldingLength = `${tagBorderLeft} ${tag} ${tagBorderRight}`.length;
  const tagPaddingLeft = '_'.repeat(Math.floor((width - tagScaffoldingLength) / 2));
  const tagPaddingRight = '_'.repeat(Math.ceil((width - tagScaffoldingLength) / 2));
  const formattedTag = `${tagBorderLeft}${tagPaddingLeft} ${tag.toUpperCase()} ${tagPaddingRight}${tagBorderRight}`;

  // Label line in the format of ==[__ LABEL-NAME ___]==
  const labelBorderLeft = '==[';
  const labelBorderRight = ']==';
  const labelScaffoldingLength = `${labelBorderLeft} ${label} ${labelBorderRight}`.length;
  const labelPaddingLeft = '_'.repeat(Math.floor((width - labelScaffoldingLength) / 2));
  const labelPaddingRight = '_'.repeat(Math.ceil((width - labelScaffoldingLength) / 2));
  const formattedLabel = `${labelBorderLeft}${labelPaddingLeft} ${label.toUpperCase()} ${labelPaddingRight}${labelBorderRight}`;

  // Fifth line in the format of ~~[__________________]~~
  const lineFiveBorderLeft = '=~[';
  const lineFiveBorderRight = ']~~';
  const lineFiveScaffoldingLength = `${lineFiveBorderLeft}${lineFiveBorderRight}`.length;
  const lineFiveSpaceFiller = '_'.repeat((width - lineFiveScaffoldingLength + 1));
  const lineFive = `${lineFiveBorderLeft}${lineFiveSpaceFiller}${lineFiveBorderRight}`;

  // Sixth line in the format of ~~~~~~~~~~~~~~~~~~~
  const lineSix = '~'.repeat(width);

  const rectangle = [
    lineOne,
    lineTwo,
    formattedTag,
    formattedLabel,
    lineFive,
    lineSix
  ];

  return rectangle;
};

export default generateRecordFolderArray;
