import React, { useState } from 'react';

export interface TabElement {
  name: string;
  component: any;
}

export interface TabsProps {
  tabs: TabElement[];
}

export const Tabs = (props: TabsProps) => {
  const [selectedTab, setSelectedTab] = useState(props.tabs[0]);
  return (
    <>
      <div>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {props.tabs.map((tab, i) => {
              return (
                <div
                  onClick={() => {
                    setSelectedTab(tab);
                  }}
                  key={i}
                  className={
                    tab.name === selectedTab.name
                      ? 'flex-grow py-4 px-4 cursor-pointer text-center border-b-2 border-teal-500 font-medium text-sm leading-5 text-gray-900 focus:outline-none focus:text-teal-800 focus:border-teal-700'
                      : 'flex-grow py-4 px-4 text-center border-b-2 border-transparent font-medium text-sm leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 cursor-pointer'
                  }
                >
                  {tab.name}
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {selectedTab.component}
    </>
  );
};
