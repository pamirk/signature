import React, { useCallback, useEffect } from 'react';
import { SignUpData } from 'Interfaces/Auth';
import { OnSubmitReturnType } from 'Interfaces/FinalForm';
import { useGoogleLoginRenderButton } from 'Hooks/Auth';
import { jwtDecode } from "jwt-decode";

declare let google: any;

interface GoogleLoginFormProps {
  onSubmit: (values: SignUpData) => OnSubmitReturnType;
  width: number;
  text?: string;
}

const GoogleLoginForm = ({ onSubmit, width, text }: GoogleLoginFormProps) => {
  const handleSuccess = useCallback(
    response => {
      const parseToken: any = jwtDecode(response.credential);
      onSubmit({
        email: parseToken.email,
        id_token: response.credential,
        name: parseToken.name,
      });
    },
    [onSubmit],
  );

  const gisRenderButton = useGoogleLoginRenderButton({ onSubmit: handleSuccess });

  useEffect(() => {
    gisRenderButton(document.getElementById('buttonDiv') as HTMLButtonElement, {
      type: 'standart',
      theme: 'outline',
      size: 'large',
      shape: 'pill',
      width: width,
      text: text,
    });
  }, [gisRenderButton, text, width]);

  return <div id="buttonDiv" data-context="signin" data-auto_select="true"></div>;
};

export default GoogleLoginForm;
