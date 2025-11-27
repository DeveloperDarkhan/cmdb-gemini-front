import React, { useState } from 'react';
import { Bell, Sun, Moon, User } from 'lucide-react';
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
  };

  return (
    <div className="topbar glass-panel">
      <div className="search-container">
        <GlobalSearch />
      </div>

      <div className="actions-container">
        <RegionSelector value={selectedRegion} onChange={handleRegionChange} />
        
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
        
        <button className="icon-btn user-icon" title="Admin User">
          <User size={20} />
        </button>
      </div>
    </div>
  );
};
