import React from 'react';
import { StaticContext } from 'react-router';
import { RouteComponentProps } from 'react-router-dom';
import History from 'Services/History';
import UIButton from 'Components/UIComponents/UIButton';
import { AboutDashboardItem } from './components';
import CollaborationIcon from 'Assets/images/aboutSignaturelyIcons/collaboration-icon.svg';
import TimeSaveIcon from 'Assets/images/aboutSignaturelyIcons/time-save-icon.svg';
import LegalIcon from 'Assets/images/aboutSignaturelyIcons/legal-icon.svg';
import ReminderIcon from 'Assets/images/aboutSignaturelyIcons/reminder-icon.svg';
import ManagementIcon from 'Assets/images/aboutSignaturelyIcons/management-icon.svg';
import PaperlessIcon from 'Assets/images/aboutSignaturelyIcons/paperless-icon.svg';

const dashboardItems = [
  {
    title: 'Seamless collaboration',
    desc:
      'Sign your own documents and send them to one or multiple signers. Always get your paperwork signed on time, by all parties.',
    icon: CollaborationIcon,
  },
  {
    title: 'Tine-saving templates',
    desc:
      'Create templates for your documents once and use them again and again. Share templates with others in your team for extra hours saved.',
    icon: TimeSaveIcon,
  },
  {
    title: 'Legal validation',
    desc:
      'Signatures, initials, dates, textboxes and checkboxes. Any data collected via Signaturely is legally binding.',
    icon: LegalIcon,
  },
  {
    title: 'Automatic reminders',
    desc:
      'You always know which documents are signed. And if someone hasn’t signed yet, they’ll get an automatic reminder.',
    icon: ReminderIcon,
  },
  {
    title: 'Easy access & management',
    desc:
      'Digitally store all paperwork in one place that you can go back to in minutes. Stop legal, financial or HR nightmares before they happen.',
    icon: ManagementIcon,
  },
  {
    title: 'Paperless',
    desc:
      'Save time, save trees and save on paper goods. Reduce your carbon footprint and hit your company’s green goals',
    icon: PaperlessIcon,
  },
];

interface AboutSignaturelyProps {
  isSignUpClose?: boolean;
}

const AboutSignaturely = ({
  location,
}: RouteComponentProps<{}, StaticContext, AboutSignaturelyProps>) => {
  if (!location?.state?.isSignUpClose) History.push('/');

  return (
    <div className="about-signaturely__wrapper">
      <div className="about-signaturely">
        <div className="about-signaturely__info">
          <div className="about-signaturely__info-title">
            What Signaturely can do for you?
          </div>
          <div className="about-signaturely__info-text">
            Did you enjoy the experience of signing with Signaturely? Sign like
            <br />
            that everytime. Create a free account today and enjoy all these great
            benefits.
          </div>
          <UIButton
            priority="primary"
            title="Create Free Account"
            handleClick={() => {
              History.push('/signup');
            }}
          />
        </div>
        <ul className="about-signaturely__dashboard">
          {dashboardItems.map((item, index) => (
            <AboutDashboardItem key={index} {...item} />
          ))}
        </ul>
        <UIButton
          priority="primary"
          title="Create Free Account"
          handleClick={() => {
            History.push('/signup');
          }}
        />
      </div>
    </div>
  );
};

export default AboutSignaturely;
