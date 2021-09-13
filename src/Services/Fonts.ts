export const fontFamilyByValue = {
  arial: 'Arial',
  calibri: 'Calibri',
  cambria: 'Cambria',
  courier: 'Courier',
  georgia: 'Georgia',
  timesNewRoman: 'Times New Roman',
  trebuchet: 'Trebuchet',
  verdana: 'Verdana',
  openSans: 'Open Sans',
  roboto: 'Roboto',
  sacramento: 'Sacramento',
  kalam: 'Kalam',
  laBelleAurore: 'La Belle Aurore',
  gochiHand: 'Gochi Hand',
  caveat: 'Caveat',
  marckScript: 'Marck Script',
  handlee: 'Handlee',
  nothingYouCouldDo: 'Nothing You Could Do',
  coveredByYourGrace: 'Covered By Your Grace',
  justAnotherHand: 'Just Another Hand',
  shadowsIntoLight: 'Shadows Into Light',
  badScript: 'Bad Script',
  yellowtail: 'Yellowtail',
  dancingScript: 'Dancing Script',
  greatVibes: 'Great Vibes',
  qwigley: 'Qwigley',
  bilboSwashCaps: 'Bilbo Swash Caps',
  stalemate: 'Stalemate',
};

export const availableFontFamilyOptions = {
  dancingScript: 'Dancing Script',
  sacramento: 'Sacramento',
  laBelleAurore: 'La Belle Aurore',
  bilboSwashCaps: 'Bilbo Swash Caps',
  yellowtail: 'Yellowtail',
  greatVibes: 'Great Vibes',
  qwigley: 'Qwigley',
  marckScript: 'Marck Script',
};

export const requisiteFontFamilyOptions = Object.keys(availableFontFamilyOptions).map(
  key => ({
    value: key,
    label: availableFontFamilyOptions[key] as string,
  }),
);

export const fontFamilyOptions = Object.keys(fontFamilyByValue).map(key => ({
  value: key,
  label: fontFamilyByValue[key] as string,
}));

export const fontSizeOptions = [
  {
    value: 7,
    label: '7 px',
  },
  {
    value: 8,
    label: '8 px',
  },
  {
    value: 9,
    label: '9 px',
  },
  {
    value: 10,
    label: '10 px',
  },
  {
    value: 12,
    label: '12 px',
  },
  {
    value: 14,
    label: '14 px',
  },
  {
    value: 16,
    label: '16 px',
  },
  {
    value: 18,
    label: '18 px',
  },
  {
    value: 20,
    label: '20 px',
  },
  {
    value: 24,
    label: '24 px',
  },
  {
    value: 26,
    label: '26 px',
  },
  {
    value: 28,
    label: '28 px',
  },
  {
    value: 36,
    label: '36 px',
  },
  {
    value: 42,
    label: '42 px',
  },
  {
    value: 48,
    label: '48 px',
  },
];
