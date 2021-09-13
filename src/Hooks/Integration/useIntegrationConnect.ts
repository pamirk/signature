import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import {
  IntegrationActionPayload,
  IntegrationTypes,
  IntegrationUrlPayload,
} from 'Interfaces/Integration';
import useAuthUrlGet from './useAuthUrlGet';
import { openPopupCenter } from 'Utils/functions';
import Toast from 'Services/Toast';
import { setIntegration } from 'Store/ducks/user/actionCreators';
import { integrationsList } from 'Pages/Integrations/Integrations';

interface IntegrationPayload {
  type: IntegrationTypes;
  title: string;
}

enum IntegrationActivationStatuses {
  SUCCESS = 'success',
  ERROR = 'error',
}

interface PopupGrant {
  (): Promise<void>;
}

export default ({ type, title }: IntegrationPayload) => {
  const dispatch = useDispatch();
  const [getAuthUrl] = useAuthUrlGet();

  const openPopup: PopupGrant = useCallback(async () => {
    try {
      const { url } = (await getAuthUrl({ type })) as IntegrationUrlPayload;
      openPopupCenter(url, title, 800, 640);
    } catch (error:any) {
      Toast.error(error);
    }
  }, [getAuthUrl, title, type]);

  useEffect(() => {
    window.onmessage = ({ data }) => {
      if (data.integrationStatus) {
        if (data.integrationStatus.status === IntegrationActivationStatuses.SUCCESS) {
          Toast.success(`
            ${
              integrationsList.find(
                integartion => integartion.type === data.integrationStatus.type,
              )?.title
            }
            successfully integrated!
          `);

          dispatch(
            setIntegration({ type: data.integrationStatus.type as IntegrationTypes }),
          );
        } else if (
          data.integrationStatus.status === IntegrationActivationStatuses.ERROR
        ) {
          Toast.error(data.integrationStatus.error);
        }
      }
    };

    return () => {
      window.onmessage = null;
    };
  }, [dispatch]);

  return [openPopup];
};
