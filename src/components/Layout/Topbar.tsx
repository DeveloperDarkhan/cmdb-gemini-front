import React, { useState, useEffect, useRef } from 'react';
import { Bell, Sun, Moon, User } from 'lucide-react';
import { GlobalSearch } from '../UI/GlobalSearch';
import { RegionSelector, type Region } from '../UI/RegionSelector';
import { useTheme } from '../../contexts/ThemeContext';
import './Topbar.css';

export const Topbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [selectedRegion, setSelectedRegion] = useState<Region>('global');
  const [showLightning, setShowLightning] = useState(false);
  const topbarRef = useRef<HTMLDivElement>(null);
  const lightningTimeoutRef = useRef<NodeJS.Timeout>();

  const handleRegionChange = (region: Region) => {
    setSelectedRegion(region);
    console.log('Selected region:', region);
  };

  // Молния при hover на search trigger
  useEffect(() => {
    const handleSearchHover = (e: CustomEvent) => {
      if (e.detail.isHovering) {
        setShowLightning(true);
        if (lightningTimeoutRef.current) {
          clearTimeout(lightningTimeoutRef.current);
        }
        lightningTimeoutRef.current = setTimeout(() => {
          setShowLightning(false);
        }, 800);
      }
    };

    window.addEventListener('search-hover' as any, handleSearchHover);
    return () => {
      window.removeEventListener('search-hover' as any, handleSearchHover);
      if (lightningTimeoutRef.current) {
        clearTimeout(lightningTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={topbarRef}
      className={`topbar glass-panel ${showLightning ? 'show-lightning' : ''}`}
    >
      <div className="topbar-spacer"></div>
      
      <div className="search-container-centered">
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
