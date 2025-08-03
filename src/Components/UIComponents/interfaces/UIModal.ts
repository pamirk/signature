export interface UIModalProps {
    onClose?: () => void;
    className?: string;
    overlayClassName?: string;
    isOverlayTransparent?: boolean
    hideCloseIcon?: boolean
    shouldCloseOnOverlayClick?: boolean;
    children?: React.ReactNode;
}

export interface BaseModalProps {
    onClose: () => void;
}