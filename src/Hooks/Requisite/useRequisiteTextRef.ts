import { useWindowSize } from 'Hooks/Common';
import { useCallback, useEffect, useRef } from 'react';

interface Props {
  textValue: string;
  fontFamilyType: string;
}

export default ({ textValue, fontFamilyType }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [width, heigth] = useWindowSize();

  const resizeFont = useCallback(() => {
    if (ref.current && ref.current.parentElement) {
      let fontSize = 36;
      ref.current.style.fontSize = `${fontSize}px`;

      let fieldWidth = ref.current.clientWidth;
      const containerWidth = ref.current.parentElement.clientWidth;
      const containerPadding = 40;

      while (fieldWidth > containerWidth - containerPadding) {
        --fontSize;
        ref.current.style.fontSize = `${fontSize}px`;
        fieldWidth = ref.current.clientWidth;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textValue, fontFamilyType, width, heigth]);

  useEffect(() => {
    const interval = setInterval(resizeFont, 1000);
    return () => clearInterval(interval);
  }, [resizeFont]);

  return ref;
};
