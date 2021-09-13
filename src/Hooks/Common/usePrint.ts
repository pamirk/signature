import useShadowIframe from './useShadowIframe';

interface PrintDocument {
  (url: string): void;
}

export default () => {
  const shadowIframe = useShadowIframe();

  const print = (url: string) => {
    if (shadowIframe) {
      shadowIframe.onload = () => {
        shadowIframe?.focus();
        shadowIframe?.contentWindow?.print();
      };
      shadowIframe.src = url as string;
    }
  };

  return print as PrintDocument;
};
