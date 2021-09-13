import { toast, Id as ToastId, ToastOptions, ToastContent, } from 'react-toastify';
import { HttpStatus } from 'Interfaces/HttpStatusEnum';

class Toast {
  success = (message: ToastContent) => toast.success(message);

  handleErrors = (error:any) => {
    if (error.statusCode === HttpStatus.UNAUTHORIZED) return;

    return this.error(error.message);
  };

  error = (message?: ToastContent) => toast.error(message || 'Something went wrong');

  warn = (message: ToastContent, options?: ToastOptions) => toast.warn(message, options);

  isActive = (toastId: ToastId) => toast.isActive(toastId);

  dismiss = (toastId: ToastId) => toast.dismiss(toastId);
}

export default new Toast();
