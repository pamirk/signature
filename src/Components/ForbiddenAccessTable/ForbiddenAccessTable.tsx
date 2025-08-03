import React from 'react';
import EmptyTable from 'Components/EmptyTable';
import History from 'Services/History';
import TeamIcon from 'Assets/images/icons/team-empty-icon.svg';
import { UnauthorizedRoutePaths } from 'Interfaces/RoutePaths';

const ForbiddenAccessTable = () => (
  <EmptyTable
    buttonText="Back to main page"
    icon={TeamIcon}
    iconClassName="empty-table__icon--team"
    onClick={() => {
      History.push(UnauthorizedRoutePaths.BASE_PATH);
    }}
    headerText="Oops! You don’t have access."
    description="Your account is part of a Signaturely team account. Please contact with your team administrator to perform updates on these settings."
  />
);

export default ForbiddenAccessTable;
