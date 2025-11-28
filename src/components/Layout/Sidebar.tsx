import { NavLink, useLocation } from 'react-router-dom';
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
  ChevronDown,
  ChevronRight,
  Globe,
  Layers,
  Container,
  Anchor
} from 'lucide-react';
import clsx from 'clsx';
import { useSidebar } from '../../contexts/SidebarContext';
import { useSearch } from '../../contexts/SearchContext';
import { useState, useEffect } from 'react';
import './Sidebar.css';

interface NavItemType {
  label: string;
  path: string;
  icon: any;
  children?: { label: string; path: string; icon: any }[];
}

const NAV_ITEMS: NavItemType[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Datacenters', path: '/datacenters', icon: Cloud },
  { label: 'Servers', path: '/servers', icon: Server },
  { label: 'Virtual Machines', path: '/vms', icon: Box },
  { label: 'Network Devices', path: '/network-devices', icon: Network },
  { 
    label: 'Kubernetes', 
    path: '/k8s', 
    icon: Container, // Changed from Box to Container (or ShipWheel if available, but Container is good)
    children: [
      { label: 'Clusters', path: '/k8s/clusters', icon: Box },
      { label: 'Ingress', path: '/k8s/ingress', icon: Globe },
      { label: 'Deployments', path: '/k8s/deployments', icon: Layers },
      { label: 'Helm Releases', path: '/k8s/helm', icon: Anchor },
      { label: 'Pods', path: '/k8s/pods', icon: Container },
      { label: 'Services', path: '/k8s/services', icon: Network },
    ]
  },
  { label: 'Databases', path: '/databases', icon: Database },
  { label: 'Message Brokers', path: '/brokers', icon: MessageSquare },
  { label: 'DNS', path: '/dns', icon: Globe }, // Added DNS
  { label: 'IPAM', path: '/ipam', icon: Share2 },
  { label: 'Findings', path: '/findings', icon: Activity },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export function Sidebar() {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { closeSearch, isSearchOpen } = useSearch();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Auto-expand parent if child is active
  useEffect(() => {
    NAV_ITEMS.forEach(item => {
      if (item.children && item.children.some(child => location.pathname.startsWith(child.path))) {
        setExpandedItems(prev => [...new Set([...prev, item.path])]);
      }
    });
  }, [location.pathname]);

  // Listen for Command/Ctrl key to show shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        setShowShortcuts(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.metaKey && !e.ctrlKey) {
        setShowShortcuts(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Also clear on blur to prevent getting stuck
    window.addEventListener('blur', () => setShowShortcuts(false));

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', () => setShowShortcuts(false));
    };
  }, []);

  const handleSidebarClick = () => {
    closeSearch();
  };

  const toggleExpand = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCollapsed) return;
    
    setExpandedItems(prev => 
      prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]
    );
  };

  // Подсказка о search при hover на nav items
  const handleNavItemHover = () => {
    const searchContainer = document.querySelector('.search-container-centered');
    if (searchContainer) {
      searchContainer.classList.add('pulse-hint');
      setTimeout(() => {
        searchContainer.classList.remove('pulse-hint');
      }, 1500);
    }
  };

  return (
    <aside 
      className={`sidebar glass-panel ${isCollapsed ? 'collapsed' : ''} ${isSearchOpen ? 'pointer-events-none' : ''}`}
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
        {NAV_ITEMS.map((item, index) => {
          const isExpanded = expandedItems.includes(item.path);
          const hasChildren = item.children && item.children.length > 0;
          // const isActive = location.pathname === item.path || (hasChildren && item.children?.some(c => location.pathname === c.path));
          
          // Shortcut number (1-9)
          const shortcutNumber = index < 9 ? index + 1 : null;

          return (
            <div key={item.path} className="nav-group">
              <NavLink
                to={item.path}
                className={({ isActive }) => clsx('nav-item', isActive && 'active')}
                title={isCollapsed ? item.label : undefined}
                onMouseEnter={handleNavItemHover}
                onClick={(e) => hasChildren && !isCollapsed ? toggleExpand(item.path, e) : undefined}
              >
                <item.icon className="nav-icon" size={20} />
                {!isCollapsed && (
                  <>
                    <span className="nav-label">{item.label}</span>
                    {/* Show shortcut hint if Cmd is held and index is 0-8 */}
                    {showShortcuts && shortcutNumber && (
                      <span className="nav-shortcut-hint">
                        ⌘{shortcutNumber}
                      </span>
                    )}
                    {hasChildren && (
                      <div className="nav-chevron">
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </div>
                    )}
                  </>
                )}
                <div className="nav-glow" />
              </NavLink>

              {/* Sub-menu */}
              {hasChildren && !isCollapsed && isExpanded && (
                <div className="nav-sub-menu">
                  {item.children?.map(child => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      className={({ isActive }) => clsx('nav-sub-item', isActive && 'active')}
                    >
                      <child.icon size={16} />
                      <span>{child.label}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
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
