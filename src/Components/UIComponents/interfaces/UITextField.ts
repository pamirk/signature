
export interface UITextFieldProps<HTMLInputElement> {
    onBlur?: () => void;
    onFocus?: () => void;
    onKeyUp?: () => void;
    onKeyDown?: () => void;
    onChange?: (v:any) => void;
    value?:any;
    error?:any;
    placeholder?:any;
    disabled?:boolean;
    required?:boolean;
    readOnly?:boolean;
    type?:string;
    autofocus?:boolean;
    hidden?:any;
    icon?:any;
    min?:any;

}