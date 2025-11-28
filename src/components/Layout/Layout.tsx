import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useSidebar } from '../../contexts/SidebarContext';
import { useEffect } from 'react';
import clsx from 'clsx';
import './Layout.css';

export function Layout() {
  const { isCollapsed } = useSidebar();
  const navigate = useNavigate();

  // Keyboard shortcuts for navigation (Cmd+1 to Cmd+9)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case '1': e.preventDefault(); navigate('/dashboard'); break;
          case '2': e.preventDefault(); navigate('/datacenters'); break;
          case '3': e.preventDefault(); navigate('/servers'); break;
          case '4': e.preventDefault(); navigate('/vms'); break;
          case '5': e.preventDefault(); navigate('/network-devices'); break;
          case '6': e.preventDefault(); navigate('/k8s'); break;
          case '7': e.preventDefault(); navigate('/databases'); break;
          case '8': e.preventDefault(); navigate('/brokers'); break;
          case '9': e.preventDefault(); navigate('/dns'); break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <div className="app-layout">
      <Sidebar />
      <div className={clsx('main-content', isCollapsed && 'sidebar-collapsed')}>
        <Topbar />
        <div className="page-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
