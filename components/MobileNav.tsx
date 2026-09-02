// components/MobileNav.tsx

import React from 'react';
import { Link } from 'next/link';

/**
 * MobileNav - A client component for a mobile bottom tab bar with icons and labels for Home, Entries, Insights, and Settings.
 */
const MobileNav: React.FC = () => {
  const tabItems = [
    {
      label: 'Home',
      icon: '/icons/home.svg', // Path to the SVG icon for Home
      href: '/home',
    },
    {
      label: 'Entries',
      icon: '/icons/entries.svg', // Path to the SVG icon for Entries
      href: '/entries',
    },
    {
      label: 'Insights',
      icon: '/icons/insights.svg', // Path to the SVG icon for Insights
      href: '/insights',
    },
    {
      label: 'Settings',
      icon: '/icons/settings.svg', // Path to the SVG icon for Settings
      href: '/settings',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg hidden md:flex">
      <div className="flex justify-between px-4 py-2">
        {tabItems.map((item, index) => (
          <Link key={index} href={item.href} passHref>
            <a className="text-center flex flex-col items-center space-y-1">
              <img src={item.icon} alt={`${item.label} icon`} className="w-6 h-6 text-gray-500 hover:text-blue-500 transition-colors" />
              <span className="text-xs text-gray-500 hover:text-blue-500 transition-colors">{item.label}</span>
            </a>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;