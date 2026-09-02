// components/MobileNav.tsx

import React from 'react';
import { Link } from 'next/link';

/**
 * MobileNav - A client component for a mobile bottom tab bar with icons and labels for Home, Entries, Insights, and Settings.
 */
const MobileNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
      <div className="flex justify-between px-4 py-2">
        <Link href="/home" passHref>
          <a className="text-center flex flex-col items-center space-y-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-gray-500 hover:text-blue-500 transition-colors"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6H21m0 0l4.5 4.5m-4.5-4.5L9 21m18-18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V9" />
            </svg>
            <span className="text-xs text-gray-500 hover:text-blue-500 transition-colors">Home</span>
          </a>
        </Link>
        <Link href="/entries" passHref>
          <a className="text-center flex flex-col items-center space-y-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-gray-500 hover:text-blue-500 transition-colors"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6H21m0 0l4.5 4.5m-4.5-4.5L9 21m18-18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V9" />
            </svg>
            <span className="text-xs text-gray-500 hover:text-blue-500 transition-colors">Entries</span>
          </a>
        </Link>
        <Link href="/insights" passHref>
          <a className="text-center flex flex-col items-center space-y-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-gray-500 hover:text-blue-500 transition-colors"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6H21m0 0l4.5 4.5m-4.5-4.5L9 21m18-18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V9" />
            </svg>
            <span className="text-xs text-gray-500 hover:text-blue-500 transition-colors">Insights</span>
          </a>
        </Link>
        <Link href="/settings" passHref>
          <a className="text-center flex flex-col items-center space-y-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-gray-500 hover:text-blue-500 transition-colors"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6H21m0 0l4.5 4.5m-4.5-4.5L9 21m18-18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V9" />
            </svg>
            <span className="text-xs text-gray-500 hover:text-blue-500 transition-colors">Settings</span>
          </a>
        </Link>
      </div>
    </nav>
  );
};

export default MobileNav;