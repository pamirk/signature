import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import SignaturePad from 'signature_pad';
import Toast from 'Services/Toast';
import { Requisite, RequisiteValueType } from 'Interfaces/Requisite';
import { SignedUrlResponse } from 'Interfaces/Common';
import { useDownloadFileByUrl } from 'Hooks/Requisite';
import { useSignedGetUrl } from 'Hooks/User';
import { base64ToFile } from 'Utils/functions';

interface Props {
  requisite?: Requisite;
  requisiteValueType: RequisiteValueType;
  defaultValue: Requisite['text'];
}

export default ({ requisite, defaultValue, requisiteValueType }: Props) => {
  const [getSignedUrl] = useSignedGetUrl();
  const [downloadFile, isDownloading] = useDownloadFileByUrl();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageFile, setImageFile] = useState<File>();

  const [requisiteValue, setRequisiteValue] = useState<string>(
    requisite?.valueType === RequisiteValueType.TEXT ? requisite?.text : defaultValue,
  );

  const [isInitialImage, setIsInitialImage] = useState<boolean>();

  const setImageToCanvas = useCallback(
    async (key: string) => {
      try {
        const signedUrlData = (await getSignedUrl({ key })) as SignedUrlResponse;
        const imageData: File = await downloadFile(signedUrlData.result);
        setImageFile(imageData);
        setIsInitialImage(true);
      } catch (error) {
        Toast.handleErrors(error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleDrawOnCanvas = useCallback(
    (signaturePad: SignaturePad) => {
      const data = signaturePad.toDataURL('image/png');
      const requisiteFile = base64ToFile(data, 'requisite');
      setImageFile(requisiteFile);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useLayoutEffect(() => {
    if (requisite) {
      switch (requisite.valueType) {
        case RequisiteValueType.UPLOAD:
        case RequisiteValueType.DRAW:
          setImageToCanvas(requisite.fileKey);
          break;
        default:
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && (requisiteValueType === RequisiteValueType.DRAW || isInitialImage)) {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;

      canvas.getContext('2d')?.scale(ratio, ratio);
      const signPad = new SignaturePad(canvas);

      if (imageFile) {
        const imageUrl = URL.createObjectURL(imageFile);
        signPad.fromDataURL(imageUrl);
        setIsInitialImage(false);
      }

      signPad.onEnd = () => {
        handleDrawOnCanvas(signPad);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requisiteValueType, isInitialImage]);

  return [
    canvasRef,
    [imageFile, setImageFile],
    [requisiteValue, setRequisiteValue],
    isDownloading,
  ] as const;
};
