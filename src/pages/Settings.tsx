import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Bell, Globe, Shield, User } from 'lucide-react';
import './Settings.css';

export function Settings() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1 className="text-gradient">Settings</h1>
        <p className="subtitle">Manage your preferences and configurations</p>
      </div>

      <div className="settings-grid">
        {/* Appearance Settings */}
        <div className="settings-card glass-card">
          <div className="settings-card-header">
            <div className="settings-icon">
              {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <div>
              <h3>Appearance</h3>
              <p className="card-subtitle">Customize your visual experience</p>
            </div>
          </div>

          <div className="settings-option">
            <div className="option-info">
              <label>Theme Mode</label>
              <span className="option-description">Choose between light and dark theme</span>
            </div>
            <div className="theme-toggle-buttons">
              <button
                className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                onClick={() => theme === 'dark' && toggleTheme()}
                data-testid="light-theme-btn"
              >
                <Sun size={18} />
                <span>Light</span>
              </button>
              <button
                className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => theme === 'light' && toggleTheme()}
                data-testid="dark-theme-btn"
              >
                <Moon size={18} />
                <span>Dark</span>
              </button>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="settings-card glass-card">
          <div className="settings-card-header">
            <div className="settings-icon">
              <User size={20} />
            </div>
            <div>
              <h3>Account</h3>
              <p className="card-subtitle">Manage your account information</p>
            </div>
          </div>

          <div className="settings-option">
            <div className="option-info">
              <label>Username</label>
              <span className="option-description">Admin User</span>
            </div>
          </div>

          <div className="settings-option">
            <div className="option-info">
              <label>Email</label>
              <span className="option-description">admin@company.com</span>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="settings-card glass-card">
          <div className="settings-card-header">
            <div className="settings-icon">
              <Bell size={20} />
            </div>
            <div>
              <h3>Notifications</h3>
              <p className="card-subtitle">Configure notification preferences</p>
            </div>
          </div>

          <div className="settings-option">
            <div className="option-info">
              <label>Email Notifications</label>
              <span className="option-description">Receive updates via email</span>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="settings-option">
            <div className="option-info">
              <label>Critical Alerts</label>
              <span className="option-description">Get notified about critical issues</span>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {/* Region Settings */}
        <div className="settings-card glass-card">
          <div className="settings-card-header">
            <div className="settings-icon">
              <Globe size={20} />
            </div>
            <div>
              <h3>Region</h3>
              <p className="card-subtitle">Default region settings</p>
            </div>
          </div>

          <div className="settings-option">
            <div className="option-info">
              <label>Default Region</label>
              <span className="option-description">Global (Super-Region)</span>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="settings-card glass-card">
          <div className="settings-card-header">
            <div className="settings-icon">
              <Shield size={20} />
            </div>
            <div>
              <h3>Security</h3>
              <p className="card-subtitle">Security and privacy settings</p>
            </div>
          </div>

          <div className="settings-option">
            <div className="option-info">
              <label>Two-Factor Authentication</label>
              <span className="option-description">Extra security for your account</span>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
