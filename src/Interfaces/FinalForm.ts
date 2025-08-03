// Type for form submission return value - typically a Promise that resolves to success/failure
export type OnSubmitReturnType = Promise<void>;

// Type for common form error shape
export interface FormError {
  [key: string]: string;
}

// Interface for form submission handler
export interface FormSubmitHandler<T> {
  (values: T): OnSubmitReturnType;
}