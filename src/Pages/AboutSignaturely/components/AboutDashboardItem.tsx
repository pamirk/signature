import React from 'react';
import { ReactSVG } from 'react-svg';

interface AboutDashboardItemProps {
  icon: string;
  title: string;
  desc: string;
}

const AboutDashboardItem = ({ icon, title, desc }: AboutDashboardItemProps) => {
  return (
    <li className="about-signaturely__dashboard-item">
      <div className="about-signaturely__dashboard-icon-wrapper">
        <ReactSVG src={icon} className="about-signaturely__dashboard-item-icon" />
      </div>
      <p className="about-signaturely__dashboard-item-label">{title}</p>
      <p className="about-signaturely__dashboard-item-desc">{desc}</p>
    </li>
  );
};

export default AboutDashboardItem;
