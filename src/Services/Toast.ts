import { toast, ToastId, ToastOptions, ToastContent } from 'react-toastify';
import { HttpStatus } from 'Interfaces/HttpStatusEnum';

class Toast {
  success = (message: ToastContent) => toast.success(message);

  handleErrors = (error, options?: ToastOptions) => {
    if (error.statusCode === HttpStatus.UNAUTHORIZED) return;

    if (error.statusCode === HttpStatus.BAD_GATEWAY) {
      return this.error('502 Bad Gateway, Please try in again in a few minutes', options);
    }

    if (error.statusCode === HttpStatus.SERVICE_UNAVAILABLE) {
      return this.error(
        '503 Service Temporary Unavailable, Please try in again in a few minutes',
        options,
      );
    }

    if (error.statusCode === HttpStatus.GATEWAY_TIMEOUT) {
      return this.error(
        '504 Gateway timeout, Please try in again in a few minutes',
        options,
      );
    }

    return this.error(error.message, options);
  };

  error = (message?: ToastContent, options?: ToastOptions) =>
    toast.error(message || 'Something went wrong', options);

  warn = (message: ToastContent, options?: ToastOptions) => toast.warn(message, options);

  isActive = (toastId: ToastId) => toast.isActive(toastId);

  dismiss = (toastId: ToastId) => toast.dismiss(toastId);
}

export default new Toast();
