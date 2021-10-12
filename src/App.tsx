import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { ModalProvider } from 'react-modal-hook';
import { Helmet } from 'react-helmet';
import AppRouter from 'Routes';
import { store } from 'Store';
import Modal from 'react-modal';
import { ReactSVG } from 'react-svg';
import IconClose from 'Assets/images/icons/close-icon.svg';

const App = () => {
  useEffect(() => {
    Modal.setAppElement('#root');
  }, []);

  return (
    <Provider store={store}>
      <Helmet>
        <meta name="description" content="Web site created using create-react-app" />
        <title>E-Sign</title>
      </Helmet>
      <ToastContainer
        closeButton={<ReactSVG src={IconClose} />}
        autoClose={6000}
        draggablePercent={60}
        newestOnTop
      />
      <ModalProvider>
        <AppRouter />
      </ModalProvider>
    </Provider>
  );
};

export default App;
