import React, { useState } from 'react';
import { Search, Bell, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Topbar.css';

export const Topbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

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
        <form onSubmit={handleSearch} className="search-form">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search assets, IPs, or tags..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      <div className="actions-container">
        <button className="icon-btn">
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
