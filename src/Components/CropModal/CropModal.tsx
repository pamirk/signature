import UIModal from 'Components/UIComponents/UIModal';
import React, { useCallback, useEffect, useState } from 'react';
import { Cropper } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import UIButton from 'Components/UIComponents/UIButton';
import { base64ToFile } from 'Utils/functions';

interface CropModalProps {
  file: File | null;
  onSubmit: (file: File) => void;
  onClose: () => void;
  onCancel?: () => void;
  aspectRatio: number;
}

const CropModal = ({
  file,
  onSubmit,
  onClose,
  aspectRatio,
  onCancel,
}: CropModalProps) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [cropper, setCropper] = useState<any>();

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  }, [file]);

  const handleSaveCroppedImage = useCallback(() => {
    if (cropper !== undefined && file) {
      const resultFile = base64ToFile(cropper.getCroppedCanvas().toDataURL(), file.name);
      onSubmit(resultFile);
      onClose();
    }
  }, [cropper, file, onClose, onSubmit]);

  return (
    <UIModal onClose={onClose} className="cropModal">
      <div className="cropModal__wrapper">
        <div className="cropModal__subtitle">
          To crop an image, select the desired area and click the &quot;Save&quot; button
        </div>
        <div className="cropModal__cropper">
          <Cropper
            src={imageUrl}
            style={{
              width: '100%',
              height: '100%',
              maxHeight: '490px',
              minHeight: '256px',
            }}
            zoomable={false}
            guides={false}
            onInitialized={instance => {
              setCropper(instance);
            }}
            aspectRatio={aspectRatio}
          />
        </div>
        <div className="cropModal__buttons">
          <UIButton
            title="Save"
            priority="primary"
            handleClick={handleSaveCroppedImage}
          />
          <UIButton title="Cancel" priority="red" handleClick={onCancel} />
        </div>
      </div>
    </UIModal>
  );
};

export default CropModal;
