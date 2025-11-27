import React, { useState } from 'react';
import { Bell, Sun, Moon } from 'lucide-react';
import { GlobalSearch } from '../UI/GlobalSearch';
import { RegionSelector, type Region } from '../UI/RegionSelector';
import { useTheme } from '../../contexts/ThemeContext';
import './Topbar.css';

export const Topbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [selectedRegion, setSelectedRegion] = useState<Region>('global');

  const handleRegionChange = (region: Region) => {
    setSelectedRegion(region);
    console.log('Selected region:', region);
    // В реальном приложении здесь будет обновление контекста/state для фильтрации поиска
  };

  return (
    <div className="topbar glass-panel">
      <div className="topbar-left">
        <RegionSelector value={selectedRegion} onChange={handleRegionChange} />
      </div>

      <div className="search-container">
        <GlobalSearch />
      </div>

      <div className="actions-container">
        <button 
          className="icon-btn theme-toggle" 
          onClick={toggleTheme}
          data-testid="theme-toggle"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="icon-btn" data-testid="notifications-btn">
          <Bell size={20} />
          <span className="notification-dot" />
        </button>
        <div className="user-profile">
          <div className="avatar">DM</div>
          <div className="user-info">
            <span className="name">Admin User</span>
            <span className="role">Global Admin</span>
          </div>
        </div>
      </div>
    </div>
  );
};
