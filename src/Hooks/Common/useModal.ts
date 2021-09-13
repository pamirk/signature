import { useState } from 'react';
import { useModal } from 'react-modal-hook';

interface OpenModal {
  (): void;
}

interface CloseModal {
  (): void;
}

type IsOpen = {} & boolean;

export default (Component: React.FunctionComponent, inputs?: any[]) => {
  const [isModalOpen, setIsModalOpen] = useState<IsOpen>(false);
  const [showModal, hideModal] = useModal(Component, inputs);

  const openModal: OpenModal = () => {
    showModal();
    setIsModalOpen(true);
  };

  const closeModal: CloseModal = () => {
    hideModal();
    setIsModalOpen(false);
  };

  return [openModal, closeModal, isModalOpen] as const;
};
