import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import History from 'Services/History';
import { DocumentStatuses } from 'Interfaces/Document';
import { PlanTypes } from 'Interfaces/Billing';
import {
  selectApiPlan,
  selectApiTemplatesCount,
  selectCommonTemplatesCount,
  selectUser,
  selectUserPlan,
} from 'Utils/selectors';
import { User } from 'Interfaces/User';
import useUpgradeModal from 'Hooks/Common/useUpgradeModal';
import useApiUpgradeModal from 'Hooks/Common/useApiUpgradeModal';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';

export default (type?: DocumentStatuses) => {
  const userPlan = useSelector(selectUserPlan);
  const user = useSelector(selectUser) as User;
  const apiPlan = useSelector(selectApiPlan);
  const apiTemplatesCount = useSelector(selectApiTemplatesCount);
  const commonTemplatesCount = useSelector(selectCommonTemplatesCount);

  const [openUpgradeModal] = useUpgradeModal();
  const [openApiUpgradeModal] = useApiUpgradeModal();

  const navigateToCreateTemplate = useCallback(() => {
    if (type === DocumentStatuses.ACTIVE) {
      if (
        !user.teamId &&
        (userPlan.type === PlanTypes.FREE ||
          (userPlan.type === PlanTypes.PERSONAL && commonTemplatesCount >= 1))
      ) {
        openUpgradeModal();
      } else {
        History.push(AuthorizedRoutePaths.TEMPLATES_CREATE);
      }
    } else {
      if (apiTemplatesCount >= apiPlan.templateLimit && apiPlan.templateLimit !== -1) {
        openApiUpgradeModal();
      } else {
        History.push(`${AuthorizedRoutePaths.TEMPLATES_CREATE}?status=api`);
      }
    }
  }, [
    apiPlan.templateLimit,
    apiTemplatesCount,
    commonTemplatesCount,
    openApiUpgradeModal,
    openUpgradeModal,
    type,
    user.teamId,
    userPlan.type,
  ]);

  return [navigateToCreateTemplate];
};
