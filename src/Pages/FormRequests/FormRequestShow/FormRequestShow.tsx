import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { Document } from 'Interfaces/Document';
import { RouteChildrenProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import History from 'Services/History';
import { selectDocumentWithCompany } from 'Utils/selectors';
import { Field } from 'react-final-form';

import UISpinner from 'Components/UIComponents/UISpinner';
import Toast from 'Services/Toast';
import UIButton from 'Components/UIComponents/UIButton';
import { Form, FormRenderProps } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FieldTextInput } from 'Components/FormFields';
import { Helmet } from 'react-helmet';

import { composeValidators } from 'Utils/functions';
import { required, notOnlySpaces, email } from 'Utils/validation';
import useDocumentCreateFromFormRequest from 'Hooks/Document/useDocumentCreateFromFormRequest';
import useFormRequestGet from 'Hooks/Document/useFormRequestGet';
import useFormRequestGuard from 'Hooks/Document/useFormRequestGuard';
import ThanksMessage from './components/ThanksMessage';
import Logo from 'Assets/images/logo.svg';
import useIsMobile from 'Hooks/Common/useIsMobile';
import classNames from 'classnames';
import { removeEmptyCharacters } from 'Utils/formatters';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';

interface TemplateRouteParams {
  formRequestId: Document['id'];
}

const FormRequestShow = ({ match }: RouteChildrenProps<TemplateRouteParams>) => {
  const documentId = match?.params.formRequestId as string;
  const [getDocument] = useFormRequestGet();
  const document = useSelector(state => selectDocumentWithCompany(state, { documentId }));
  const [createDocument] = useDocumentCreateFromFormRequest();
  const isMobile = useIsMobile();

  const [thanksMessage, setThanksMessage] = useState<boolean>(false);

  const initialValues = useMemo(() => ({ documentId }), [documentId]);

  const handleDocumentShare = useCallback(async values => {
    try {
      await createDocument({
        templateId: documentId,
        signer: { email: values.email, name: values.name },
      });
      // Toast.success('Document successfully sended to specified email(s).');
      setThanksMessage(true);
    } catch (err) {
      Toast.handleErrors(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getDocument({ documentId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDocumentNotFound = useCallback(() => {
    History.push(AuthorizedRoutePaths.FORM_REQUESTS);
  }, []);

  const isCheckingDocument = useFormRequestGuard({
    documentId,
    onFailure: handleDocumentNotFound,
  });

  if (thanksMessage) {
    return <ThanksMessage companyLogo={document?.company.logo} />;
  }

  if (isCheckingDocument) {
    return <UISpinner wrapperClassName="spinner--main__wrapper" width={50} height={50} />;
  }
  return (
    <div className="form-request__content">
      <div className="form-request">
        <Helmet>
          <meta name="description" content="Log in to Signaturely." />
          <title>Send Document</title>
        </Helmet>
        <Form
          initialValues={initialValues}
          onSubmit={handleDocumentShare}
          mutators={{ ...arrayMutators }}
          render={({
            handleSubmit,
            submitting,
            pristine,
            valid,
          }: FormRenderProps<any>) => (
            <form className="form-request__form--border">
              <div
                className={classNames('form-request__form', 'form-request__form--login', {
                  mobile: isMobile,
                })}
              >
                <div className="form-request__logo">
                  {document?.company.logo ? (
                    <img src={document.company.logo} alt="" />
                  ) : (
                    <img src={Logo} alt="Signaturely" />
                  )}
                </div>

                <div className="form-request__documentTitle">{document?.title}</div>
                <div className="form-request__documentMessage">{document?.message}</div>

                <div className="form-request__hr"></div>
                <div className="form-request__separator"></div>

                <Field
                  label="Name"
                  name="name"
                  placeholder="Name"
                  component={FieldTextInput}
                  validate={composeValidators<string>(required, notOnlySpaces)}
                />
                <Field
                  label="Email Address"
                  name="email"
                  placeholder="Email"
                  component={FieldTextInput}
                  parse={removeEmptyCharacters}
                  validate={composeValidators<string>(required, email)}
                />
                <div className="form-request__submitButton">
                  <UIButton
                    priority="primary"
                    handleClick={handleSubmit}
                    disabled={pristine || !valid || submitting}
                    isLoading={submitting}
                    type="submit"
                    title="Continue"
                  />
                </div>
              </div>
              <div className="form-request__footer">
                <a
                  href="https://signaturely.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: 'none',
                  }}
                >
                  <span>Powered by</span>
                  <span className="form-request__footer--signaturely">Signaturely</span>
                </a>
              </div>
            </form>
          )}
        />
      </div>
    </div>
  );
};

export default FormRequestShow;
