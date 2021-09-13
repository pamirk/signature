import { DocumentActivityTypes } from 'Interfaces/Document';
import CreatedIcon from 'Assets/images/activityTypeIcons/created-icon.svg';
import UpdatedIcon from 'Assets/images/activityTypeIcons/updated-icon.svg';
import SendIcon from 'Assets/images/activityTypeIcons/sent-icon.svg';
import ViewIcon from 'Assets/images/activityTypeIcons/viewed-icon.svg';
import SignIcon from 'Assets/images/activityTypeIcons/signed-icon.svg';
import CompleteIcon from 'Assets/images/activityTypeIcons/completed-icon.svg';
import RevertedIcon from 'Assets/images/activityTypeIcons/reverted-icon.svg';

export const documentActivityContentByType = {
  [DocumentActivityTypes.CREATE]: {
    icon: CreatedIcon,
    title: 'CREATED',
  },
  [DocumentActivityTypes.UPDATE]: {
    icon: UpdatedIcon,
    title: 'UPDATED',
  },
  [DocumentActivityTypes.SEND]: {
    icon: SendIcon,
    title: 'SENT',
  },
  [DocumentActivityTypes.VIEW]: {
    icon: ViewIcon,
    title: 'VIEWED',
  },
  [DocumentActivityTypes.SIGN]: {
    icon: SignIcon,
    title: 'SIGNED',
  },
  [DocumentActivityTypes.COMPLETE]: {
    icon: CompleteIcon,
    title: 'COMPLETED',
  },
  [DocumentActivityTypes.REVERT]: {
    icon: RevertedIcon,
    title: 'REVERTED',
  },
};
