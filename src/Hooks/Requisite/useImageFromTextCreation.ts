import { useCallback } from 'react';
import trimCanvas from 'trim-canvas';
import { fontFamilyByValue } from 'Services/Fonts';
import { base64ToFile } from 'Utils/functions';

interface Props {
  textFontSize: number;
  fontFamilyType: string;
  typeCanvasSize?: { width: number; height: number };
}

export default ({
  textFontSize,
  fontFamilyType,
  typeCanvasSize = { width: 17500, height: 750 },
}: Props) => {
  const createTypeCanvas = useCallback(() => {
    const canvas = document.createElement('canvas') as HTMLCanvasElement;
    canvas.width = typeCanvasSize.width;
    canvas.height = typeCanvasSize.height;

    return canvas;
  }, [typeCanvasSize.height, typeCanvasSize.width]);

  return useCallback(
    (text: string) => {
      const typeCanvas = createTypeCanvas();
      const context = typeCanvas.getContext('2d') as CanvasRenderingContext2D;
      context.font = `${textFontSize}px ${fontFamilyByValue[fontFamilyType]}`;
      const textSize = context.measureText(text);
      const coordinateX =
        textSize.width > typeCanvasSize.width
          ? 0
          : (typeCanvasSize.width - textSize.width) / 2;

      context.fillText(text, coordinateX, typeCanvasSize.height / 2);
      const data = trimCanvas(typeCanvas).toDataURL('image/png');

      typeCanvas.remove();
      return base64ToFile(data, 'requisite');
    },
    [
      createTypeCanvas,
      textFontSize,
      fontFamilyType,
      typeCanvasSize.width,
      typeCanvasSize.height,
    ],
  );
};
