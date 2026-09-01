import React from 'react';
import { ScreenType } from '../types';

interface BottomNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const tabs: { id: ScreenType; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop' },
    { id: 'collections', label: 'Collections' },
    { id: 'profile', label: 'Profile' }
  ];

  // Determine active tab (if product-detail or cart, default to shop or none)
  const activeTab = currentScreen === 'product-detail' || currentScreen === 'cart' ? 'shop' : currentScreen;

  return (
    <nav
      id="main-bottom-navigation-bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#E8E2D5] py-3 transition-all"
    >
      <div className="max-w-md md:max-w-4xl mx-auto px-6 flex items-center justify-between">
        {tabs.map((tab, tIdx) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={`bottom-nav-tab-btn-${tab.id}-${tIdx}`}
              id={`bottom-nav-tab-${tab.id}`}
              onClick={() => onNavigate(tab.id)}
              className="flex flex-col items-center justify-center relative py-1 px-3 group focus:outline-hidden"
            >
              <span
                className={`font-sans-ui text-xs tracking-wider transition-colors duration-200 ${
                  isActive
                    ? 'text-[#1E1A17] font-medium'
                    : 'text-[#8C7E72] hover:text-[#3B342E]'
                }`}
              >
                {tab.label}
              </span>

              {/* Active Golden Line Indicator */}
              <div
                className={`h-[2px] w-8 mt-1.5 transition-all duration-300 rounded-full ${
                  isActive ? 'bg-[#C59B27] opacity-100' : 'bg-transparent opacity-0'
                }`}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
};
