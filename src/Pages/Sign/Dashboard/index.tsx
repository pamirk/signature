import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ReactSVG } from 'react-svg';
import UIButton from 'Components/UIComponents/UIButton';
import IconOnlyMe from 'Assets/images/dashboardIcons/only-me-icon.svg';
import IconMeAndOthers from 'Assets/images/dashboardIcons/me-others-icon.svg';
import IconOnlyOthers from 'Assets/images/dashboardIcons/only-others-icon.svg';
import useWootricSurvey from 'Hooks/Common/useWootricSurvey';
import { useSelector } from 'react-redux';
import { User } from 'Interfaces/User';
import { selectUser } from 'Utils/selectors';
import useIsMobile from 'Hooks/Common/useIsMobile';
import classNames from 'classnames';

enum SignTypes {
  ONLY_ME = 'onlyme',
  ME_AND_OTHERS = 'me&others',
  ONLY_OTHERS = 'onlyothers',
}

const signData = {
  [SignTypes.ONLY_ME]: {
    title: 'Only Me',
    description: 'Sign a document yourself.',
    link: '/only-me',
    icon: IconOnlyMe,
  },
  [SignTypes.ME_AND_OTHERS]: {
    title: 'Me & Others',
    description: 'Send a document for others and yourself to sign.',
    link: '/me-and-others',
    icon: IconMeAndOthers,
  },
  [SignTypes.ONLY_OTHERS]: {
    title: 'Only Others',
    description: 'Send a document for others to sign.',
    link: '/only-others',
    icon: IconOnlyOthers,
  },
};

const Dashboard = () => {
  const { email, createdAt }: User = useSelector(selectUser);
  const isMobile = useIsMobile();
  useWootricSurvey(email as string, createdAt as Date);

  const getDefaultView = useCallback((data: any) => {
    return (
      <>
        <div className="dashboard__item-icon-wrapper">
          <ReactSVG src={data.icon} className="dashboard__item-icon" />
        </div>
        <p className="dashboard__item-label">{data.title}</p>
        <p className="dashboard__item-desc">{data.description}</p>
        <Link to={data.link} className="dashboard__item-link">
          <UIButton priority="primary" title={data.title} />
        </Link>
      </>
    );
  }, []);

  const getMobileView = useCallback((data: any) => {
    return (
      <>
        <div className="dashboard__item-wrapper">
          <div className="dashboard__item-icon-wrapper mobile">
            <ReactSVG src={data.icon} className="dashboard__item-icon" />
          </div>
          <div className="dashboard__item-text">
            <p className="dashboard__item-label mobile">{data.title}</p>
            <p className="dashboard__item-desc mobile">{data.description}</p>
          </div>
        </div>
        <Link to={data.link} className="dashboard__item-link mobile">
          <UIButton priority="primary" title={data.title} />
        </Link>
      </>
    );
  }, []);

  return (
    <div className="dashboard__wrapper">
      <h1 className="dashboard__title">Who needs to sign?</h1>
      <ul className="dashboard__list">
        <li className={classNames('dashboard__item', { mobile: isMobile })}>
          {isMobile
            ? getMobileView(signData[SignTypes.ONLY_ME])
            : getDefaultView(signData[SignTypes.ONLY_ME])}
        </li>
        <li className={classNames('dashboard__item', { mobile: isMobile })}>
          {isMobile
            ? getMobileView(signData[SignTypes.ME_AND_OTHERS])
            : getDefaultView(signData[SignTypes.ME_AND_OTHERS])}
        </li>
        <li className={classNames('dashboard__item', { mobile: isMobile })}>
          {isMobile
            ? getMobileView(signData[SignTypes.ONLY_OTHERS])
            : getDefaultView(signData[SignTypes.ONLY_OTHERS])}
        </li>
      </ul>
    </div>
  );
};

export default Dashboard;
