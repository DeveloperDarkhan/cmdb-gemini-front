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
  Share2 
} from 'lucide-react';
import clsx from 'clsx';
import './Sidebar.css';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Datacenters', path: '/datacenters', icon: Cloud },
  { label: 'Servers', path: '/servers', icon: Server },
  { label: 'Virtual Machines', path: '/vms', icon: Box },
  { label: 'Network Devices', path: '/network-devices', icon: Network },
  { label: 'K8s Clusters', path: '/k8s', icon: Box }, // Using Box as placeholder for K8s
  { label: 'Databases', path: '/databases', icon: Database },
  { label: 'Message Brokers', path: '/brokers', icon: MessageSquare },
  { label: 'IPAM', path: '/ipam', icon: Share2 },
  { label: 'Findings', path: '/findings', icon: Activity },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <div className="logo-container">
          <Database className="logo-icon" />
          <span className="logo-text">CMDB <span className="logo-version">v1</span></span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => clsx('nav-item', isActive && 'active')}
          >
            <item.icon className="nav-icon" size={20} />
            <span className="nav-label">{item.label}</span>
            {/* Active indicator glow */}
            <div className="nav-glow" />
          </NavLink>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <div className="version-tag">
          <span>v1.0.0</span>
        </div>
      </div>
    </aside>
  );
}
