import { useMemo } from 'react';
import { Signer } from 'Interfaces/Document';
import { InteractModes } from 'Components/Interact/components/FieldItem';

export enum FieldColorNames {
  EMPTY = 'empty',
  USER = 'user',
  ORANGE = 'orange',
  GREEN = 'green',
  TURQUOISE = 'turquoise',
  BLUE = 'blue',
  RED = 'red',
  LIGHT_GREEN = 'lightGreen',
  VIOLET = 'violet',
  YELLOW = 'yellow',
  DARK_BLUE = 'darkBlue',
  DARK_VIOLET = 'darkViolet',
}

const signerFieldColors = [
  FieldColorNames.ORANGE,
  FieldColorNames.GREEN,
  FieldColorNames.TURQUOISE,
  FieldColorNames.BLUE,
  FieldColorNames.RED,
  FieldColorNames.LIGHT_GREEN,
  FieldColorNames.VIOLET,
  FieldColorNames.YELLOW,
  FieldColorNames.DARK_BLUE,
  FieldColorNames.DARK_VIOLET,
];

export default (
  signer: Signer,
  interactMode: InteractModes = InteractModes.PREPARING,
) => {
  const fieldColor = useMemo(() => {
    const colorIndex = (signer.order - 1) % signerFieldColors.length;

    const fieldColor =
      signer.isPreparer || interactMode === InteractModes.SIGNING
        ? FieldColorNames.USER
        : signerFieldColors[colorIndex];

    return fieldColor;
  }, [signer, interactMode]);

  return fieldColor;
};
