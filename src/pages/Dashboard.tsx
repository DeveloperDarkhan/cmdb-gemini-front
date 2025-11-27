import { Server, Network, Box, Activity, Cloud } from 'lucide-react';
import { StatCard } from '../components/UI/StatCard';
import { ValidatorWidget } from '../components/UI/ValidatorWidget';
import './Dashboard.css';

export function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Region Dashboard</h1>
        <p className="subtitle">Overview of infrastructure in Global Region</p>
      </div>

      <div className="stats-grid">
        <StatCard 
          title="Datacenters" 
          value="12" 
          icon={Cloud} 
          color="primary"
        />
        <StatCard 
          title="Physical Servers" 
          value="1,248" 
          icon={Server} 
          trend={{ value: 12, isPositive: true }}
          color="secondary"
        />
        <StatCard 
          title="Virtual Machines" 
          value="8,502" 
          icon={Box} 
          trend={{ value: 5, isPositive: true }}
          color="success"
        />
        <StatCard 
          title="Network Devices" 
          value="342" 
          icon={Network} 
          color="warning"
        />
      </div>

      <div className="dashboard-content-grid">
        <div className="main-chart-area glass-card">
          {/* Placeholder for a chart */}
          <div className="chart-header">
            <h3>Resource Growth</h3>
            <div className="chart-actions">
              <button className="active">30D</button>
              <button>3M</button>
              <button>1Y</button>
            </div>
          </div>
          <div className="chart-placeholder">
            <Activity size={48} className="chart-icon-placeholder" />
            <span>Chart Visualization Placeholder</span>
          </div>
        </div>
        
        <div className="side-widget-area">
          <ValidatorWidget />
        </div>
      </div>
    </div>
  );
}
