import React from 'react';
import { Bell, Globe, Sun, Moon } from 'lucide-react';
import { GlobalSearch } from '../UI/GlobalSearch';
import { useTheme } from '../../contexts/ThemeContext';
import './Topbar.css';

export const Topbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="topbar glass-panel">
      <div className="region-selector">
        <div className="region-label">
          <span className="text-muted">Region / </span>
          <span className="font-medium">Global</span>
        </div>
        <div className="region-dropdown">
          <Globe size={16} />
          <span>Global (Super-Region)</span>
        </div>
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
