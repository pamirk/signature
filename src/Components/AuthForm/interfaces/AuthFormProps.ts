export interface AuthFormProps {
    onSubmit: (values: any) => any;
    isLoading?: boolean;
    formClassName?: string;
    initialValues?: Record<string, any>;
    validationSchema?: any; // Adjust type as needed
    submitButtonText?: string;
    showForgotPasswordLink?: boolean;
    forgotPasswordLinkText?: string;
    onForgotPasswordClick?: () => void;
    showSignUpLink?: boolean;
    signUpLinkText?: string;
    onSignUpClick?: () => void;
}