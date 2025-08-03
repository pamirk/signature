import React from 'react';
import { Tab } from './components';

const tabs = ['Create an account', 'Activate your trial'];

interface TabsProps {
  activeTab: 1 | 2;
}

export const Tabs = ({ activeTab }: TabsProps) => {
  return (
    <div className="sign-up-second-step__tabs">
      {tabs.map((tab, index) => (
        <Tab
          key={index}
          text={tab}
          tubNumber={index + 1}
          isNextTab={index + 1 > activeTab}
          isActive={index + 1 === activeTab}
        />
      ))}
    </div>
  );
};
