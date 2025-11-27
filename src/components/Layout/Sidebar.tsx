import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Server, 
  Network, 
  Settings, 
  Database, 
  Activity, 
  Box, 
  Cloud, 
  MessageSquare, 
  Share2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import clsx from 'clsx';
import { useSidebar } from '../../contexts/SidebarContext';
import { useSearch } from '../../contexts/SearchContext';
import './Sidebar.css';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Datacenters', path: '/datacenters', icon: Cloud },
  { label: 'Servers', path: '/servers', icon: Server },
  { label: 'Virtual Machines', path: '/vms', icon: Box },
  { label: 'Network Devices', path: '/network-devices', icon: Network },
  { label: 'K8s Clusters', path: '/k8s', icon: Box },
  { label: 'Databases', path: '/databases', icon: Database },
  { label: 'Message Brokers', path: '/brokers', icon: MessageSquare },
  { label: 'IPAM', path: '/ipam', icon: Share2 },
  { label: 'Findings', path: '/findings', icon: Activity },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export function Sidebar() {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { closeSearch } = useSearch();

  const handleSidebarClick = () => {
    closeSearch();
  };

  return (
    <aside 
      className={clsx('sidebar glass-panel', isCollapsed && 'collapsed')}
      onClick={handleSidebarClick}
    >
      <div className="sidebar-header">
        <div 
          className={clsx('logo-container', isCollapsed && 'clickable')}
          onClick={isCollapsed ? toggleSidebar : undefined}
          title={isCollapsed ? 'Expand sidebar' : undefined}
        >
          <Database className="logo-icon" />
          {!isCollapsed && (
            <span className="logo-text">CMDB <span className="logo-version">v1</span></span>
          )}
        </div>
        {!isCollapsed && (
          <button 
            className="sidebar-toggle" 
            onClick={toggleSidebar}
            title="Collapse sidebar"
            data-testid="sidebar-toggle"
          >
            <ChevronLeft size={18} />
          </button>
        )}
      </div>
      
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => clsx('nav-item', isActive && 'active')}
            title={isCollapsed ? item.label : undefined}
          >
            <item.icon className="nav-icon" size={20} />
            {!isCollapsed && <span className="nav-label">{item.label}</span>}
            <div className="nav-glow" />
          </NavLink>
        ))}
      </nav>
      
      {!isCollapsed && (
        <div className="sidebar-footer">
          <div className="version-tag">
            <span>v1.0.0</span>
          </div>
        </div>
      )}
    </aside>
  );
}
