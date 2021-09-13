export interface UIModalProps {
    onClose?: () => void;
    children?: any;
    className?: string;
    overlayClassName?: string;
    isOverlayTransparent?: boolean
    hideCloseIcon?: boolean
}

export interface BaseModalProps {
    onClose: () => void;
}