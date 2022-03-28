import { useAuth } from '@xrpl-wallet-poc/browser-extension/hooks';
import React, { useEffect } from 'react';
import {
  Link,
  Route,
  Switch,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';
import { ManageAccounts } from './account/account';
import { ManageAccountSettings } from './settings/settings';

interface NavItemProps {
  linkTo: string;
  title: string;
  icon: JSX.Element;
}

function NavItem({ linkTo, title, icon }: NavItemProps) {
  const match = useRouteMatch(linkTo);
  const isSelected = !!(match && match.isExact);

  return (
    <Link
      to={linkTo}
      className={`group rounded-md flex items-center text-sm leading-5 font-medium focus:outline-none transition ease-in-out duration-150 ${
        !isSelected
          ? 'py-4 px-7 text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:text-gray-900 focus:bg-gray-50'
          : 'rounded-l-none py-4 px-6 text-teal-600 bg-teal-50 border-l-4 border-teal-600'
      }`}
    >
      {React.cloneElement(icon, {
        className: `mr-5 h-6 w-6 transition ease-in-out duration-150 ${
          !isSelected
            ? 'text-gray-400 group-hover:text-gray-500 group-focus:text-gray-500'
            : 'text-teal-500'
        }`,
      })}
      {title}
    </Link>
  );
}

export function ManageAccount() {
  const auth = useAuth();
  const history = useHistory();
  const topBarHeight = '64px';
  const privateMessageBarHeight = '42px';

  useEffect(() => {
    // Ensure the hash-based URL is appropriate at this point
    history.push('/admin/accounts');
  }, [history]);

  const navItems: NavItemProps[] = [
    {
      title: 'Accounts',
      linkTo: '/admin/accounts',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    {
      title: 'Settings',
      linkTo: '/admin/settings',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div
      className="h-screen bg-gray-100 overflow-hidden flex flex-col"
      style={{
        height: `calc(100vh - ${privateMessageBarHeight})`,
      }}
    >
      <nav
        className="bg-white shadow-sm z-10 w-full"
        style={{ height: topBarHeight }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                {/* DA Logo SVG */}
                <svg
                  className="h-6 w-auto fill-current text-gray-800"
                  viewBox="0 0 169.33 107.16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g strokeWidth=".265">
                    <path
                      d="M97.209 16.798L106.36.968l60.935 105.542-83.113-.158s42.093-35.357 13.025-89.557zM.858.943v105.414l35.973-.052s51.153-.44 51.153-52.437C87.984.404 34.424.81 34.424.81z"
                      strokeWidth=".1897082"
                    />
                  </g>
                </svg>
              </div>
              <div className="hidden sm:ml-12 space-x-8 sm:flex">
                <span className="inline-flex items-center px-1 pt-1 border-b-2 border-teal-500 text-sm font-medium leading-5 text-gray-900 focus:outline-none focus:border-teal-700 transition duration-150 ease-in-out">
                  Browser Extension
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-row">
        <div
          className="flex flex-shrink-0"
          style={{
            height: `calc(100vh - ${topBarHeight} - ${privateMessageBarHeight})`,
          }}
        >
          <div className="w-64 flex flex-col">
            <nav className="pt-5 pb-3 flex flex-col flex-grow overflow-y-auto">
              <div className="flex-grow mt-5 flex flex-col">
                <div className="flex-1 space-y-1 ml-2">
                  {navItems.map((navItem, i) => (
                    <NavItem key={i} {...navItem} />
                  ))}
                </div>
              </div>
              <div className="mb-5 flex-shrink-0 block ml-2">
                <NavItem
                  title="Lock Extension"
                  linkTo="/lock"
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  }
                />
              </div>
            </nav>
          </div>
        </div>

        <div
          className="flex-1 flex flex-col"
          style={{
            height: `calc(100vh - ${topBarHeight} - ${privateMessageBarHeight})`,
          }}
        >
          <main
            className="flex-1 overflow-y-auto focus:outline-none"
            tabIndex={0}
          >
            <Switch>
              <Route path="/admin/accounts">
                <ManageAccounts accounts={auth.accountsData?.accounts || []} />
              </Route>
              <Route path="/admin/settings">
                <ManageAccountSettings />
              </Route>
            </Switch>
          </main>
        </div>
      </div>
    </div>
  );
}
