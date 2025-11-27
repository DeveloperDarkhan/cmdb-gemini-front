import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useSidebar } from '../../contexts/SidebarContext';
import clsx from 'clsx';
import './Layout.css';

export function Layout() {
  const { isCollapsed } = useSidebar();

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
